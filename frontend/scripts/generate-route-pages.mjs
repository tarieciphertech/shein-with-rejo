import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = 'https://shopwithrejo.co.zw'
const dist = path.resolve('dist')
const source = path.join(dist, 'index.html')

const routes = {
  '/about': {
    title: 'About SHEIN with Rejo | Independent SHEIN Ordering Help in Zimbabwe',
    description: 'Meet Rejo, an independent SHEIN ordering helper based in Harare. Learn how customers in Zimbabwe can request fashion, shoes, beauty and accessories they find on SHEIN.',
  },
  '/how-it-works': {
    title: 'How to Order from SHEIN in Zimbabwe | SHEIN with Rejo',
    description: 'See how to request SHEIN items from Zimbabwe with Rejo: share a product link or screenshot, confirm the details and payment, then follow the order through its 3-day ordering cycle. Free delivery is available only within Harare, Zimbabwe.',
  },
  '/submit-order': {
    title: 'Order from SHEIN in Zimbabwe | Submit a Request | SHEIN with Rejo',
    description: 'Request items from SHEIN with Rejo. Send a product link or screenshot, plus your size, colour and quantity. Based in Harare, helping customers in Zimbabwe. Free delivery is available only within Harare.',
  },
  '/track-order': {
    title: 'Track Your SHEIN Order Request | SHEIN with Rejo Zimbabwe',
    description: 'Check the latest status of your SHEIN order request with Rejo using your order reference and phone number.',
  },
  '/faq': {
    title: 'SHEIN Zimbabwe FAQs | Ordering, Payments & Delivery | Rejo',
    description: 'Answers about requesting SHEIN items from Zimbabwe, accepted payment methods, Rejo’s 3-day ordering cycle, order tracking and current delivery arrangements. Delivery is available only within Harare, Zimbabwe.',
  },
  '/contact': {
    title: 'Contact SHEIN with Rejo | Zimbabwe Ordering Support',
    description: 'Contact Rejo about requesting SHEIN items from Zimbabwe. WhatsApp or call 0784 487 866, or email remudzamba@gmail.com. Based in Harare. Free delivery is available only within Harare.',
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
