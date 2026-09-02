import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { customerError } from '../middleware/errors.js'

const router = Router()
const MIN_PASSWORD_LENGTH = 12

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw customerError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw customerError(400, 'Password must include an uppercase letter, lowercase letter, and number.')
  }
}

router.get('/security', requireAdmin, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT email, must_change_password FROM admin_users WHERE LOWER(email) = LOWER($1)',
      [req.adminEmail]
    )
    const admin = result.rows[0]
    if (!admin) throw customerError(404, 'Admin account not found.')
    res.json({ success: true, data: { email: admin.email, mustChangePassword: admin.must_change_password } })
  } catch (error) {
    next(error)
  }
})

router.post('/change-password', requireAdmin, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {}
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      throw customerError(400, 'Please enter your current and new password.')
    }
    validatePassword(newPassword)

    const result = await query(
      'SELECT id, password_hash, must_change_password FROM admin_users WHERE LOWER(email) = LOWER($1)',
      [req.adminEmail]
    )
    const admin = result.rows[0]
    if (!admin) throw customerError(404, 'Admin account not found.')

    const valid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!valid) throw customerError(401, 'Your current password is not correct.')

    if (await bcrypt.compare(newPassword, admin.password_hash)) {
      throw customerError(400, 'Your new password must be different from your current password.')
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await query(
      'UPDATE admin_users SET password_hash = $1, must_change_password = FALSE WHERE id = $2',
      [passwordHash, admin.id]
    )

    res.json({ success: true, data: { email: req.adminEmail, mustChangePassword: false } })
  } catch (error) {
    next(error)
  }
})

export default router
