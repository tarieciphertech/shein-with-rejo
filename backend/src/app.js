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
import adminSecurityRoutes from './routes/adminSecurity.js'

const app = express()

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true)
      return callback(null, false)
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
app.use('/api/admin', adminSecurityRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
