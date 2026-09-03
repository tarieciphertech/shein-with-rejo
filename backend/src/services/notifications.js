import { query } from '../db.js'
import { config } from '../config.js'

const STATUS_LABELS = {
  pending: 'Request received', reviewed: 'Being reviewed', priced: 'Quotation sent', paid: 'Payment confirmed', ordered: 'Order placed', shipped: 'In transit', delivered: 'Delivered', cancelled: 'Cancelled',
}

function esc(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}

function normalizeWhatsApp(phone) {
  const raw = String(phone || '').trim()
  if (!raw) return ''
  if (raw.startsWith('+')) return `whatsapp:${raw.replace(/[^+\d]/g, '')}`
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('263')) return `whatsapp:+${digits}`
  if (digits.startsWith('0')) return `whatsapp:+263${digits.slice(1)}`
  return `whatsapp:+${digits}`
}

function trackingUrl(reference) { return `${config.publicSiteUrl.replace(/\/$/, '')}/#/track-order?reference=${encodeURIComponent(reference)}` }
function adminOrderUrl(id) { return `${config.publicSiteUrl.replace(/\/$/, '')}/#/admin/orders/${encodeURIComponent(id)}` }
function statusLabel(status) { return STATUS_LABELS[status] || status }

export async function sendEmail({ to, subject, html }) {
  if (!config.resendApiKey || !config.emailFrom || !to) return false
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: config.emailFrom, to: [to], subject, html }),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Email provider rejected the message (${response.status}): ${body.slice(0, 300)}`)
  }
  return true
}

async function sendWhatsApp({ to, body, contentSid, contentVariables }) {
  if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioWhatsAppFrom || !to) return false
  const destination = normalizeWhatsApp(to)
  if (!destination) return false
  const params = new URLSearchParams()
  params.set('From', `whatsapp:${config.twilioWhatsAppFrom.replace(/^whatsapp:/, '')}`)
  params.set('To', destination)
  if (contentSid) { params.set('ContentSid', contentSid); if (contentVariables) params.set('ContentVariables', JSON.stringify(contentVariables)) } else params.set('Body', body)
  const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64')
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(config.twilioAccountSid)}/Messages.json`, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params })
  if (!response.ok) { const data = await response.text().catch(() => ''); throw new Error(`WhatsApp provider rejected the message (${response.status}): ${data.slice(0, 300)}`) }
  return true
}

async function getNotificationOrder(reference) {
  const result = await query(`SELECT o.id, o.reference, o.status, o.contact_method, o.created_at, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email, o.delivery_area, (SELECT COUNT(*)::int FROM order_items oi WHERE oi.order_id = o.id) AS item_count FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.reference = $1`, [reference])
  return result.rows[0] || null
}

function adminMessage(order) { return ['🛍️ SHEIN with Rejo — New order', '', `Reference: ${order.reference}`, `Customer: ${order.customer_name}`, `Phone: ${order.customer_phone}`, `Items: ${order.item_count}`, `Delivery: ${order.delivery_area}`, '', `Review order: ${adminOrderUrl(order.id)}`].join('\n') }
function adminEmail(order) { const url = adminOrderUrl(order.id); return `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#201f1d"><h2 style="margin-bottom:6px">New SHEIN with Rejo order</h2><p style="color:#666">A new customer request has been submitted.</p><div style="background:#f6f2ec;padding:18px;border-radius:12px"><p><strong>Reference:</strong> ${esc(order.reference)}</p><p><strong>Customer:</strong> ${esc(order.customer_name)}</p><p><strong>Phone:</strong> ${esc(order.customer_phone)}</p><p><strong>Items:</strong> ${esc(order.item_count)}</p><p><strong>Delivery:</strong> ${esc(order.delivery_area)}</p></div><p><a href="${esc(url)}" style="display:inline-block;padding:12px 18px;background:#201f1d;color:#fff;text-decoration:none;border-radius:8px">Review order</a></p></div>` }

export async function notifyNewOrder(reference) {
  try {
    const order = await getNotificationOrder(reference)
    if (!order) return
    const jobs = []
    if (config.adminNotificationEmail) jobs.push(sendEmail({ to: config.adminNotificationEmail, subject: `New order ${order.reference} — SHEIN with Rejo`, html: adminEmail(order) }))
    if (config.adminWhatsAppTo) jobs.push(sendWhatsApp({ to: config.adminWhatsAppTo, body: adminMessage(order), contentSid: config.twilioAdminNewOrderContentSid, contentVariables: { 1: order.reference, 2: order.customer_name, 3: order.customer_phone, 4: String(order.item_count), 5: adminOrderUrl(order.id) } }))
    const results = await Promise.allSettled(jobs)
    for (const result of results) if (result.status === 'rejected') console.error('[notifications] New-order notification failed:', result.reason?.message || result.reason)
  } catch (error) { console.error('[notifications] New-order notification error:', error.message) }
}

export async function notifyStatusChange(order) {
  try {
    const label = statusLabel(order.status), url = trackingUrl(order.reference)
    const message = ['SHEIN with Rejo — Order update', '', `Hi ${order.customer.name},`, `Your order ${order.reference} is now: ${label}.`, '', `Track your order: ${url}`, '', 'Thank you for choosing SHEIN with Rejo.'].join('\n')
    const html = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#201f1d"><h2>Order update</h2><p>Hi ${esc(order.customer.name)},</p><p>Your SHEIN with Rejo order <strong>${esc(order.reference)}</strong> is now <strong>${esc(label)}</strong>.</p><p><a href="${esc(url)}" style="display:inline-block;padding:12px 18px;background:#201f1d;color:#fff;text-decoration:none;border-radius:8px">Track your order</a></p><p style="color:#666">Thank you for choosing SHEIN with Rejo.</p></div>`
    const jobs = []
    if (order.contactMethod === 'WhatsApp' && order.customer.phone) jobs.push(sendWhatsApp({ to: order.customer.phone, body: message, contentSid: config.twilioCustomerStatusContentSid, contentVariables: { 1: order.customer.name, 2: order.reference, 3: label, 4: url } }))
    if (order.contactMethod === 'Email' && order.customer.email) jobs.push(sendEmail({ to: order.customer.email, subject: `Order ${order.reference} update — ${label}`, html }))
    if (jobs.length === 0 && order.customer.email) jobs.push(sendEmail({ to: order.customer.email, subject: `Order ${order.reference} update — ${label}`, html }))
    const results = await Promise.allSettled(jobs)
    for (const result of results) if (result.status === 'rejected') console.error('[notifications] Status notification failed:', result.reason?.message || result.reason)
  } catch (error) { console.error('[notifications] Status notification error:', error.message) }
}
