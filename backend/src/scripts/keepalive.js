import pg from 'pg'

const connectionString = process.env.SUPABASE_DB_URL
if (!connectionString) {
  console.error('[keepalive] Missing SUPABASE_DB_URL repository secret.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 5000,
})

try {
  // Read only one identifier; do not modify customer or order data.
  await pool.query('SELECT id FROM public.customers LIMIT 1')
  console.log('[keepalive] Supabase database query succeeded.')
} catch (error) {
  console.error('[keepalive] Database check failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
