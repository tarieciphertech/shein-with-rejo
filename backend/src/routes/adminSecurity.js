import crypto from 'crypto'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'
import { config } from '../config.js'
import { requireAdmin } from '../middleware/auth.js'
import { customerError } from '../middleware/errors.js'
import { sendEmail } from '../services/notifications.js'

const router = Router()
const MIN_PASSWORD_LENGTH = 12
const RESET_TTL_MINUTES = 30

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) throw customerError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) throw customerError(400, 'Password must include an uppercase letter, lowercase letter, and number.')
}

function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex') }
function resetUrl(token) { return `${config.publicSiteUrl.replace(/\/$/, '')}/#/admin/reset-password?token=${encodeURIComponent(token)}` }

router.get('/security', requireAdmin, async (req, res, next) => {
  try {
    const result = await query('SELECT email, must_change_password FROM admin_users WHERE LOWER(email) = LOWER($1)', [req.adminEmail])
    const admin = result.rows[0]
    if (!admin) throw customerError(404, 'Admin account not found.')
    res.json({ success: true, data: { email: admin.email, mustChangePassword: admin.must_change_password } })
  } catch (error) { next(error) }
})

router.post('/change-password', requireAdmin, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {}
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') throw customerError(400, 'Please enter your current and new password.')
    validatePassword(newPassword)
    const result = await query('SELECT id, password_hash FROM admin_users WHERE LOWER(email) = LOWER($1)', [req.adminEmail])
    const admin = result.rows[0]
    if (!admin) throw customerError(404, 'Admin account not found.')
    if (!(await bcrypt.compare(currentPassword, admin.password_hash))) throw customerError(401, 'Your current password is not correct.')
    if (await bcrypt.compare(newPassword, admin.password_hash)) throw customerError(400, 'Your new password must be different from your current password.')
    const passwordHash = await bcrypt.hash(newPassword, 12)
    await query('UPDATE admin_users SET password_hash = $1, must_change_password = FALSE WHERE id = $2', [passwordHash, admin.id])
    await query('DELETE FROM admin_password_reset_tokens WHERE admin_id = $1', [admin.id])
    res.json({ success: true, data: { email: req.adminEmail, mustChangePassword: false } })
  } catch (error) { next(error) }
})

router.post('/request-reset', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const generic = { success: true, message: 'If that email is the admin account, a password reset link has been sent.' }
    if (!email) return res.json(generic)
    const result = await query('SELECT id, email FROM admin_users WHERE LOWER(email) = LOWER($1)', [email])
    const admin = result.rows[0]
    if (!admin) return res.json(generic)
    const token = crypto.randomBytes(32).toString('hex')
    await query('DELETE FROM admin_password_reset_tokens WHERE admin_id = $1 OR expires_at < now()', [admin.id])
    await query("INSERT INTO admin_password_reset_tokens (admin_id, token_hash, expires_at) VALUES ($1, $2, now() + ($3 * interval '1 minute'))", [admin.id, hashToken(token), RESET_TTL_MINUTES])
    const url = resetUrl(token)
    try {
      await sendEmail({ to: admin.email, subject: 'Reset your SHEIN with Rejo admin password', html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#201f1d"><h2>Reset your admin password</h2><p>We received a request to reset the SHEIN with Rejo admin password.</p><p>This link expires in ${RESET_TTL_MINUTES} minutes and can only be used once.</p><p><a href="${url}" style="display:inline-block;padding:12px 18px;background:#201f1d;color:#fff;text-decoration:none;border-radius:8px">Reset password</a></p><p style="color:#666">If you did not request this, you can safely ignore this email.</p></div>` })
    } catch (error) { console.error('[admin-security] Reset email failed:', error.message) }
    return res.json(generic)
  } catch (error) { next(error) }
})

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body || {}
    if (typeof token !== 'string' || !token || typeof newPassword !== 'string') throw customerError(400, 'This reset link is invalid or incomplete.')
    validatePassword(newPassword)
    const result = await query('SELECT t.id, t.admin_id, a.password_hash FROM admin_password_reset_tokens t JOIN admin_users a ON a.id = t.admin_id WHERE t.token_hash = $1 AND t.used_at IS NULL AND t.expires_at > now()', [hashToken(token)])
    const reset = result.rows[0]
    if (!reset) throw customerError(400, 'This reset link is invalid or has expired. Please request a new one.')
    if (await bcrypt.compare(newPassword, reset.password_hash)) throw customerError(400, 'Your new password must be different from your current password.')
    const passwordHash = await bcrypt.hash(newPassword, 12)
    await query('UPDATE admin_users SET password_hash = $1, must_change_password = FALSE WHERE id = $2', [passwordHash, reset.admin_id])
    await query('UPDATE admin_password_reset_tokens SET used_at = now() WHERE id = $1', [reset.id])
    await query('DELETE FROM admin_password_reset_tokens WHERE admin_id = $1 AND id <> $2', [reset.admin_id, reset.id])
    res.json({ success: true, data: { mustChangePassword: false } })
  } catch (error) { next(error) }
})

export default router
