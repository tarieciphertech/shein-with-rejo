import multer from 'multer'

export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'We could not find that page or resource.' })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Known, expected errors get their message through; everything else is logged
  // and replaced with a generic message so internals never leak to customers.
  const known =
    err instanceof multer.MulterError ||
    err.isCustomerMessage ||
    err.status === 400 ||
    err.status === 401 ||
    err.status === 404

  if (!known) {
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err)
  }

  const status = err.status || (err instanceof multer.MulterError ? 400 : 500)
  const message = known
    ? err.message || 'Something went wrong. Please try again.'
    : 'Something went wrong on our side. Please try again in a moment.'

  if (status === 400 && err.details) {
    return res.status(400).json({ success: false, message, errors: err.details })
  }

  res.status(status).json({ success: false, message })
}

/** Attach a friendly status + message to validation errors. */
export function customerError(status, message, details) {
  const error = new Error(message)
  error.status = status
  error.isCustomerMessage = true
  if (details) error.details = details
  return error
}
