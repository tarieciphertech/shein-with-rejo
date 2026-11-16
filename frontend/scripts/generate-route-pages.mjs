import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = 'https://shopwithrejo.co.zw'
const dist = path.resolve('dist')
const source = path.join(dist, 'index.html')

const routes = {
  '/about': {
    title: 'About SHEIN with Rejo | SHEIN Ordering Service in Harare',
    description: 'Meet Rejo and learn how this independent SHEIN ordering service helps customers in Harare and across Zimbabwe request fashion, shoes, beauty and accessories from SHEIN.',
  },
  '/how-it-works': {
    title: 'How to Order from SHEIN in Zimbabwe | SHEIN with Rejo',
    description: 'Learn how to order from SHEIN in Zimbabwe with Rejo: share a product link or screenshot, confirm your order details and payment, then follow the ordering cycle.',
  },
  '/submit-order': {
    title: 'Request a SHEIN Order in Zimbabwe | SHEIN with Rejo',
    description: 'Send Rejo your SHEIN product link or screenshot, size, colour and quantity to request an order from Zimbabwe.',
  },
  '/track-order': {
    title: 'Track Your SHEIN Order Request | SHEIN with Rejo',
    description: 'Check the status of your SHEIN order request with Rejo using your order reference and phone number.',
  },
  '/faq': {
    title: 'SHEIN Zimbabwe: Ordering, Payments & Delivery FAQs | Rejo',
    description: 'Find answers about ordering from SHEIN in Zimbabwe, payments, delivery in Harare, order tracking and Rejo’s ordering cycle.',
  },
  '/contact': {
    title: 'Contact Rejo | SHEIN Orders in Harare, Zimbabwe',
    description: 'Contact SHEIN with Rejo in Harare, Zimbabwe for help with product requests, order details, payments and delivery.',
  },
  '/admin': { title: 'SHEIN with Rejo Admin', description: 'Private administration area.' },
  '/admin/login': { title: 'Admin Sign In | SHEIN with Rejo', description: 'Private administration sign in.' },
  '/admin/forgot-password': { title: 'Forgot Password | SHEIN with Rejo', description: 'Private administration password recovery.' },
  '/admin/reset-password': { title: 'Reset Password | SHEIN with Rejo', description: 'Private administration password reset.' },
  '/admin/account': { title: 'Admin Account | SHEIN with Rejo', description: 'Private administration account.' },
  '/admin/orders': { title: 'Admin Orders | SHEIN with Rejo', description: 'Private administration orders.' },
}

const escapeAttr = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const template = await readFile(source, 'utf8')

for (const [route, meta] of Object.entries(routes)) {
  const target = path.join(dist, route.replace(/^\//, ''), 'index.html')
  await mkdir(path.dirname(target), { recursive: true })

  const canonical = `${SITE_URL}${route}`
  const isAdmin = route.startsWith('/admin')

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`)
  html = html.replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${isAdmin ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large'}" />`)
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeAttr(meta.title)}" />`)
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttr(meta.description)}" />`)
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`)
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`)

  await writeFile(target, html)
}

console.log(`Generated SEO-ready static HTML entry points for ${Object.keys(routes).length} routes.`)
