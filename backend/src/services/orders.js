import crypto from 'crypto'
import { query, withTransaction } from '../db.js'
import { customerError } from '../middleware/errors.js'
import { normalizePhone } from '../validation/schemas.js'

export const ORDER_STATUSES = ['pending', 'reviewed', 'priced', 'paid', 'ordered', 'shipped', 'delivered', 'cancelled']
export const PAYMENT_STATUSES = ['pending', 'awaiting_confirmation', 'confirmed']

// Reference alphabet without ambiguous characters (0/O, 1/I/L)
const REF_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

function generateReference() {
  const bytes = crypto.randomBytes(6)
  let ref = 'SWR-'
  for (const byte of bytes) {
    ref += REF_ALPHABET[byte % REF_ALPHABET.length]
  }
  return ref
}

/** Create a customer order with items, screenshots and initial status history. */
export async function createOrder({ payload, screenshotsByItem }) {
  const phoneNorm = normalizePhone(payload.customer.phone)

  return withTransaction(async (client) => {
    // Reuse the customer record when the same phone orders again.
    const existing = await client.query(
      'SELECT id, email FROM customers WHERE phone_normalized = $1 FOR UPDATE',
      [phoneNorm]
    )

    let customerId
    if (existing.rowCount > 0) {
      customerId = existing.rows[0].id
      await client.query('UPDATE customers SET name = $1, email = COALESCE($2, email), updated_at = now() WHERE id = $3', [
        payload.customer.name,
        payload.customer.email || null,
        customerId,
      ])
    } else {
      const inserted = await client.query(
        'INSERT INTO customers (name, phone, phone_normalized, email) VALUES ($1, $2, $3, $4) RETURNING id',
        [payload.customer.name, payload.customer.phone, phoneNorm, payload.customer.email || null]
      )
      customerId = inserted.rows[0].id
    }

    // Generate a collision-safe public reference.
    let reference
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = generateReference()
      const clash = await client.query('SELECT 1 FROM orders WHERE reference = $1', [candidate])
      if (clash.rowCount === 0) {
        reference = candidate
        break
      }
    }
    if (!reference) {
      throw customerError(500, 'Could not generate an order reference. Please try again.')
    }

    const orderResult = await client.query(
      `INSERT INTO orders (reference, customer_id, delivery_area, delivery_notes, contact_method)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, reference, created_at`,
      [reference, customerId, payload.delivery.area, payload.delivery.notes || null, payload.contactMethod]
    )
    const order = orderResult.rows[0]

    for (let i = 0; i < payload.items.length; i += 1) {
      const item = payload.items[i]
      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, url, size, color, quantity, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [order.id, item.url || null, item.size || null, item.color || null, item.quantity, item.notes || null]
      )
      const itemId = itemResult.rows[0].id

      const files = screenshotsByItem[i] || []
      for (const file of files) {
        await client.query(
          'INSERT INTO order_item_screenshots (order_item_id, filename, size_bytes) VALUES ($1, $2, $3)',
          [itemId, file.filename, file.size]
        )
      }
    }

    await client.query(
      'INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by) VALUES ($1, NULL, $2, $3)',
      [order.id, 'pending', 'customer']
    )

    return {
      reference: order.reference,
      submittedAt: order.created_at,
      status: 'pending',
    }
  })
}

/** Track a single order by reference + phone. Returns customer-safe fields only. */
export async function trackOrder(reference, phone) {
  const phoneNorm = normalizePhone(phone)
  const result = await query(
    `SELECT o.reference, o.status, o.payment_status, o.created_at,
            json_agg(
              json_build_object(
                'url', oi.url, 'size', oi.size, 'color', oi.color,
                'quantity', oi.quantity
              ) ORDER BY oi.id
            ) AS items
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE UPPER(o.reference) = UPPER($1) AND c.phone_normalized = $2
      GROUP BY o.id`,
    [reference.trim(), phoneNorm]
  )

  if (result.rowCount === 0) return null
  const row = result.rows[0]
  return {
    reference: row.reference,
    status: row.status,
    submittedAt: row.created_at,
    items: row.items.filter((item) => item.url || item.size || item.color || item.quantity),
  }
}

/** Admin: list orders with search, filters and pagination. */
export async function listOrders({ search = '', status = '', paymentStatus = '', page = 1, limit = 20 }) {
  const params = []
  const conditions = []

  if (search) {
    params.push(`%${search}%`)
    const idx = params.length
    conditions.push(
      `(o.reference ILIKE $${idx} OR c.name ILIKE $${idx} OR c.phone ILIKE $${idx} OR c.email ILIKE $${idx})`
    )
  }
  if (status) {
    params.push(status)
    conditions.push(`o.status = $${params.length}`)
  }
  if (paymentStatus) {
    params.push(paymentStatus)
    conditions.push(`o.payment_status = $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (Math.max(1, page) - 1) * limit

  const countResult = await query(
    `SELECT COUNT(*)::int AS total FROM orders o JOIN customers c ON c.id = o.customer_id ${where}`,
    params
  )
  const total = countResult.rows[0].total

  params.push(limit, offset)
  const rows = await query(
    `SELECT o.id, o.reference, o.status, o.payment_status, o.created_at AS submitted_at,
            c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       ${where}
      ORDER BY o.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )

  return {
    orders: rows.rows.map((row) => ({
      id: row.id,
      reference: row.reference,
      status: row.status,
      paymentStatus: row.payment_status,
      submittedAt: row.submitted_at,
      customer: { name: row.customer_name, phone: row.customer_phone, email: row.customer_email },
    })),
    pagination: {
      page: Math.max(1, page),
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

/** Admin: full order detail including items, screenshots and history. */
export async function getOrder(id) {
  const orderResult = await query(
    `SELECT o.id, o.reference, o.status, o.payment_status, o.admin_notes, o.contact_method,
            o.delivery_area, o.delivery_notes, o.created_at AS submitted_at,
            c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email
       FROM orders o JOIN customers c ON c.id = o.customer_id
      WHERE o.id = $1`,
    [id]
  )
  if (orderResult.rowCount === 0) return null
  const row = orderResult.rows[0]

  const itemsResult = await query(
    `SELECT oi.id, oi.url, oi.size, oi.color, oi.quantity, oi.notes,
            json_agg(json_build_object('filename', s.filename) ORDER BY s.id) FILTER (WHERE s.id IS NOT NULL) AS screenshots
       FROM order_items oi
       LEFT JOIN order_item_screenshots s ON s.order_item_id = oi.id
      WHERE oi.order_id = $1
      GROUP BY oi.id
      ORDER BY oi.id`,
    [id]
  )

  const historyResult = await query(
    `SELECT previous_status, new_status, changed_by, created_at
       FROM order_status_history WHERE order_id = $1 ORDER BY created_at ASC`,
    [id]
  )

  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    paymentStatus: row.payment_status,
    adminNotes: row.admin_notes,
    contactMethod: row.contact_method,
    delivery: { area: row.delivery_area, notes: row.delivery_notes },
    submittedAt: row.submitted_at,
    customer: { name: row.customer_name, phone: row.customer_phone, email: row.customer_email },
    items: itemsResult.rows.map((item) => ({
      url: item.url,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      notes: item.notes,
      screenshots: item.screenshots || [],
    })),
    statusHistory: historyResult.rows,
  }
}

/** Admin: update status / payment status / notes, recording history. */
export async function updateOrder(id, patch, changedBy) {
  const wasUpdated = await withTransaction(async (client) => {
    const current = await client.query('SELECT id, status FROM orders WHERE id = $1 FOR UPDATE', [id])
    if (current.rowCount === 0) return false

    const previousStatus = current.rows[0].status
    const sets = []
    const params = []

    if (patch.status !== undefined) {
      params.push(patch.status)
      sets.push(`status = $${params.length}`)
    }
    if (patch.paymentStatus !== undefined) {
      params.push(patch.paymentStatus)
      sets.push(`payment_status = $${params.length}`)
    }
    if (patch.adminNotes !== undefined) {
      params.push(patch.adminNotes)
      sets.push(`admin_notes = $${params.length}`)
    }
    if (sets.length === 0) return true

    sets.push('updated_at = now()')
    params.push(id)
    await client.query(`UPDATE orders SET ${sets.join(', ')} WHERE id = $${params.length}`, params)

    if (patch.status !== undefined && patch.status !== previousStatus) {
      await client.query(
        'INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by) VALUES ($1, $2, $3, $4)',
        [id, previousStatus, patch.status, changedBy]
      )
    }

    return true
  })

  if (!wasUpdated) return null
  return getOrder(id)
}
