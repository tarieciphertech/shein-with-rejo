import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'
import { loginSchema, updateOrderSchema } from '../validation/schemas.js'
import { listOrders, getOrder, updateOrder } from '../services/orders.js'
import { requireAdmin, issueAdminCookie, clearAdminCookie, signAdminSession } from '../middleware/auth.js'
import { loginLimiter } from '../middleware/security.js'
import { customerError } from '../middleware/errors.js'

const router = Router()

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body || {})
    if (!parsed.success) throw customerError(400, 'Please enter your email and password.')
    const { email, password } = parsed.data

    const result = await query('SELECT id, email, password_hash, must_change_password FROM admin_users WHERE LOWER(email) = LOWER($1)', [email])
    const admin = result.rows[0]
    const hash = admin?.password_hash || '$2a$10$C6UzMDM.H6dfI/f/IKcEeO7VTgxjrpU8k95Lxvtqk1PGCvXnLBDF6'
    const valid = await bcrypt.compare(password, hash)
    if (!admin || !valid) throw customerError(401, 'That email and password combination is not correct.')

    issueAdminCookie(res, signAdminSession(admin.email))
    res.json({ success: true, data: { user: { email: admin.email, mustChangePassword: admin.must_change_password } } })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (req, res) => {
  clearAdminCookie(res)
  res.json({ success: true })
})

router.get('/me', requireAdmin, async (req, res, next) => {
  try {
    const result = await query('SELECT email, must_change_password FROM admin_users WHERE LOWER(email) = LOWER($1)', [req.adminEmail])
    const admin = result.rows[0]
    if (!admin) throw customerError(404, 'Admin account not found.')
    res.json({ success: true, data: { user: { email: admin.email, mustChangePassword: admin.must_change_password } } })
  } catch (error) {
    next(error)
  }
})

router.get('/orders', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
    const result = await listOrders({ search: String(req.query.search || '').slice(0, 100), status: String(req.query.status || ''), paymentStatus: String(req.query.paymentStatus || ''), page })
    res.json({ success: true, data: result })
  } catch (error) { next(error) }
})

router.get('/orders/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) throw customerError(404, 'Order not found.')
    const order = await getOrder(id)
    if (!order) throw customerError(404, 'Order not found.')
    res.json({ success: true, data: order })
  } catch (error) { next(error) }
})

router.patch('/orders/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) throw customerError(404, 'Order not found.')
    const parsed = updateOrderSchema.safeParse(req.body || {})
    if (!parsed.success) throw customerError(400, 'That update is not valid. Please check the values and try again.')
    const order = await updateOrder(id, parsed.data, req.adminEmail)
    if (!order) throw customerError(404, 'Order not found.')
    res.json({ success: true, data: order })
  } catch (error) { next(error) }
})

export default router
