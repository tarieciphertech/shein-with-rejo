// Central site configuration.
// Anything prefixed VITE_ is exposed to the browser — never put secrets here.

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://tarieciphertech.github.io/shein-with-rejo').replace(/\/$/, '')

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export const BUSINESS = {
  name: 'SHEIN with Rejo',
  tagline: 'See it on SHEIN? Rejo can help you get it.',
  phoneDisplay: '0784 487 866',
  phoneIntl: '+263784487866',
  whatsapp: '263784487866',
  email: 'remudzamba@gmail.com',
  location: 'Harare, Zimbabwe',
  orderingCycleDays: 3,
  deliveryNote: 'Free delivery in Harare',
}

/**
 * Build a WhatsApp deep link with a pre-filled, context-aware message.
 * @param {string} [message] - Optional message for the customer's first chat.
 */
export function whatsappLink(message) {
  const base = `https://wa.me/${BUSINESS.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const WHATSAPP_MESSAGES = {
  general: 'Hi Rejo, I have a question about placing a SHEIN order.',
  newRequest: 'Hi Rejo, I have a SHEIN item I would like to order.',
  orderHelp: 'Hi Rejo, I would like help with my SHEIN request.',
}

export const AFFILIATION_DISCLAIMER =
  'SHEIN with Rejo is an independent ordering service. We are not SHEIN and we are not affiliated with, endorsed by, or connected to SHEIN.'
