import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { config } from '../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function migrate() {
  const schemaPath = path.join(__dirname, '..', '..', 'src', 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')

  console.log('[migrate] Applying schema…')
  await pool.query(schema)
  console.log('[migrate] Schema applied.')

  if (config.adminEmail && config.adminPasswordHash) {
    const existing = await pool.query('SELECT id FROM admin_users WHERE LOWER(email) = LOWER($1)', [config.adminEmail])
    if (existing.rowCount === 0) {
      await pool.query('INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)', [
        config.adminEmail.toLowerCase(),
        config.adminPasswordHash,
      ])
      console.log(`[migrate] Admin account created for ${config.adminEmail}.`)
    } else {
      console.log(`[migrate] Admin account for ${config.adminEmail} already exists.`)
    }
  } else {
    console.warn(
      '[migrate] ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set — no admin account created.\n' +
        '         Generate a hash with: npm run hash-password -- "your-password"'
    )
  }

  await pool.end()
}

migrate().catch((error) => {
  console.error('[migrate] Failed:', error.message)
  process.exit(1)
})
