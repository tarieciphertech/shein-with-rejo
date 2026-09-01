import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export const ADMIN_COOKIE = 'swr_admin'

export function issueAdminCookie(res, token) {
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSecure ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
    path: '/',
  })
}

export function clearAdminCookie(res) {
  res.clearCookie(ADMIN_COOKIE, { path: '/' })
}

export function signAdminSession(email) {
  return jwt.sign({ sub: email, role: 'admin' }, config.jwtSecret, { expiresIn: '8h' })
}

/** Require a valid admin session cookie. */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[ADMIN_COOKIE]
  if (!token) {
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' })
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (payload.role !== 'admin') throw new Error('wrong role')
    req.adminEmail = payload.sub
    return next()
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' })
  }
}
