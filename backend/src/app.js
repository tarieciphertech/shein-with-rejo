import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { config } from './config.js'
import { generalLimiter } from './middleware/security.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { storage } from './storage/index.js'
import publicRoutes from './routes/public.js'
import adminRoutes from './routes/admin.js'

const app = express()

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(helmet({
  contentSecurityPolicy: false, // API serves no HTML; headers stay sane elsewhere
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images from the Pages site
}))

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl, health checks) with no origin.
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true)
      return callback(null, false) // don't error; just don't emit CORS headers
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  })
)

app.use(express.json({ limit: '64kb' }))
app.use(express.urlencoded({ extended: false, limit: '64kb' }))
app.use(cookieParser())
app.use(generalLimiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Screenshot files are served by unguessable random name only.
app.get('/api/uploads/:filename', async (req, res, next) => {
  try {
    const buffer = await storage.read(req.params.filename)
    if (!buffer) return res.status(404).json({ success: false, message: 'Not found' })
    res.setHeader('Content-Type', storage.contentType(req.params.filename))
    res.setHeader('Cache-Control', 'private, max-age=3600')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    return res.send(buffer)
  } catch (error) {
    return next(error)
  }
})

app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
