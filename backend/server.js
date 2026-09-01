import app from './src/app.js'
import { config } from './src/config.js'
import { pool } from './src/db.js'

const server = app.listen(config.port, () => {
  console.log(`SHEIN with Rejo API listening on port ${config.port} (${config.isProd ? 'production' : 'development'})`)
})

async function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully…`)
  server.close(() => {
    pool.end().then(() => process.exit(0))
  })
  // Force-exit if connections do not drain in time.
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
