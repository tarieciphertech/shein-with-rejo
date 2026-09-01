import { Router } from 'express'
import multer from 'multer'
import { orderSchema, normalizePhone } from '../validation/schemas.js'
import { createOrder, trackOrder } from '../services/orders.js'
import { storage } from '../storage/index.js'
import { customerError } from '../middleware/errors.js'
import { config } from '../config.js'

const router = Router()

const ALLOWED_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function hasValidImageSignature(buffer) {
  if (buffer.length < 12) return false
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true // JPEG
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
  ) return true // PNG
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) return true // WebP
  return false
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxUploadMb * 1024 * 1024,
    files: 60,
  },
}).any()

const REFERENCE_FIELD = /items\[(\d+)\]\[screenshots\]/

/** Public: create an order request. */
router.post('/orders', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? `One of the screenshots is larger than ${config.maxUploadMb}MB — please use a smaller image.`
          : err.code === 'LIMIT_FILE_COUNT'
            ? 'Too many screenshots — up to 3 per item please.'
            : 'There was a problem with the upload. Please try again.'
      return next(customerError(400, message))
    }
    next()
  })
}, async (req, res, next) => {
  try {
    let rawPayload
    try {
      rawPayload = JSON.parse(req.body.payload || '{}')
    } catch {
      throw customerError(400, 'Your request could not be read. Please try submitting again.')
    }

    const parsed = orderSchema.safeParse(rawPayload)
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))
      throw customerError(400, 'Some details need attention before we can send your request.', details)
    }
    const payload = parsed.data

    // Route uploaded screenshots to the right item and validate content.
    const screenshotsByItem = {}
    for (const file of req.files || []) {
      const match = file.fieldname.match(REFERENCE_FIELD)
      const itemIndex = match ? parseInt(match[1], 10) : -1
      if (itemIndex < 0 || itemIndex >= payload.items.length) continue
      const extension = ALLOWED_MIME[file.mimetype]
      if (!extension || !hasValidImageSignature(file.buffer)) continue
      const saved = await storage.save(file.buffer, extension)
      ;(screenshotsByItem[itemIndex] ||= []).push(saved)
    }

    const result = await createOrder({ payload, screenshotsByItem })
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
})

/** Public: track a single order by reference + phone. */
router.get('/orders/track', async (req, res, next) => {
  try {
    const reference = String(req.query.reference || '')
    const phone = String(req.query.phone || '')
    if (!reference.trim() || !phone.trim()) {
      throw customerError(400, 'Please enter both your order reference and phone number.')
    }
    if (normalizePhone(phone).length < 7) {
      throw customerError(400, 'That phone number does not look complete — please double-check it.')
    }
    const order = await trackOrder(reference, phone)
    if (!order) {
      throw customerError(404, 'We could not find a request with those details.')
    }
    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
})

export default router
