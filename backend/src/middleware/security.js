import rateLimit from 'express-rate-limit'

const standardOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please wait a moment and try again.' },
}

export const generalLimiter = rateLimit({
  ...standardOptions,
  windowMs: 15 * 60 * 1000,
  limit: 300,
})

export const orderCreateLimiter = rateLimit({
  ...standardOptions,
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'You have submitted several requests recently. Please try again later or message us on WhatsApp.' },
})

export const trackingLimiter = rateLimit({
  ...standardOptions,
  windowMs: 15 * 60 * 1000,
  limit: 40,
  message: { success: false, message: 'Too many tracking attempts. Please wait a few minutes and try again.' },
})

export const loginLimiter = rateLimit({
  ...standardOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many sign-in attempts. Please wait a few minutes and try again.' },
})
