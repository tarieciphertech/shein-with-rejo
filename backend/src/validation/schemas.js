import { z } from 'zod'

const trimmed = (max) => z.string().transform((s) => s.trim()).pipe(z.string().max(max))

export const orderItemSchema = z.object({
  url: z
    .string()
    .max(500)
    .optional()
    .transform((v) => (v ? v.trim() : ''))
    .refine((v) => !v || /^https?:\/\/|^www\./i.test(v), {
      message: 'Please provide a valid product link starting with http(s)://',
    }),
  size: trimmed(50).optional().default(''),
  color: trimmed(50).optional().default(''),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
  notes: trimmed(500).optional().default(''),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Add at least one item.').max(20, 'You can request up to 20 items at a time.'),
  customer: z.object({
    name: trimmed(100).refine((v) => v.length >= 2, { message: 'Please provide your full name.' }),
    phone: trimmed(30).refine((v) => /^[+0-9][0-9\s-]{6,}$/.test(v), {
      message: 'Please provide a valid phone number.',
    }),
    email: z
      .union([z.literal(''), z.string().email({ message: 'That email address is not valid.' })])
      .optional()
      .default(''),
  }),
  delivery: z.object({
    area: trimmed(120).refine((v) => v.length >= 2, { message: 'Please tell us where to deliver.' }),
    notes: trimmed(500).optional().default(''),
  }),
  contactMethod: z.enum(['WhatsApp', 'Phone call', 'Email']).default('WhatsApp'),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
})

export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'priced', 'paid', 'ordered', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'awaiting_confirmation', 'confirmed']).optional(),
  adminNotes: trimmed(2000).optional(),
})

export function normalizePhone(phone) {
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.startsWith('0')) return `263${digits.slice(1)}`
  return digits
}
