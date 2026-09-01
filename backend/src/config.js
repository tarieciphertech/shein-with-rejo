import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProd = process.env.NODE_ENV === 'production'

function required(name, message) {
  const value = process.env[name]
  if (!value) {
    console.error(`[config] Missing required environment variable ${name}. ${message}`)
    process.exit(1)
  }
  return value
}

export const config = {
  isProd,
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: required(
    'DATABASE_URL',
    'Set it in backend/.env — see backend/.env.example.'
  ),
  jwtSecret: isProd
    ? required('JWT_SECRET', 'Required in production — generate one with `openssl rand -hex 64`.')
    : process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  corsOrigins: (process.env.CORS_ORIGINS ||
    'http://localhost:5173,https://tarieciphertech.github.io')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean),
  cookieSecure: process.env.COOKIE_SECURE === 'true' || isProd,
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  uploadDir: path.isAbsolute(process.env.UPLOAD_DIR || '')
    ? process.env.UPLOAD_DIR
    : path.resolve(path.dirname(__dirname), process.env.UPLOAD_DIR || './uploads'),
  maxUploadMb: parseInt(process.env.MAX_UPLOAD_MB || '5', 10),
}

if (config.isProd && config.jwtSecret === 'dev-only-insecure-secret-change-me') {
  console.error('[config] Refusing to start in production with the development JWT secret.')
  process.exit(1)
}

fs.mkdirSync(config.uploadDir, { recursive: true })
