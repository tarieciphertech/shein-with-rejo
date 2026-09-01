import pg from 'pg'
import { config } from './config.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message)
})

/**
 * Run a parameterised query. Values are always passed separately — never
 * interpolate user input into SQL strings.
 */
export async function query(text, params = []) {
  const start = Date.now()
  const result = await pool.query(text, params)
  const duration = Date.now() - start
  if (duration > 500) {
    console.warn(`[db] Slow query (${duration}ms): ${text.slice(0, 80)}`)
  }
  return result
}

/** Run a set of queries inside a transaction. */
export async function withTransaction(handler) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await handler(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
