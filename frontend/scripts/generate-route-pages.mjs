import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = 'https://shopwithrejo.co.zw'
const dist = path.resolve('dist')
const source = path.join(dist, 'index.html')

const routes = {
  '/about': {
    title: 'About Rejo | Independent SHEIN Ordering Help in Zimbabwe',
    description: 'Meet Rejo, an independent SHEIN ordering helper based in Harare. Learn how customers in Zimbabwe can request fashion, shoes, beauty and accessories they find on SHEIN.',
  },
  '/how-it-works': {
    title: 'How to Order from SHEIN in Zimbabwe | Step-by-Step Guide',
    description: 'Learn how to order from SHEIN in Zimbabwe with Rejo. Send a product link or screenshot, confirm size, colour and payment, then join the 3-day ordering cycle. Free delivery is available only within Harare.',
  },
  '/submit-order': {
    title: 'Submit a SHEIN Order Request | SHEIN with Rejo',
    description: 'Send Rejo the SHEIN product links or screenshots, sizes, colours and quantities you want to request. Rejo will confirm the details with you before ordering.',
    noindex: true,
  },
  '/track-order': {
    title: 'Track Your SHEIN Order Request | SHEIN with Rejo Zimbabwe',
    description: 'Check the latest status of your SHEIN order request with Rejo using your order reference and phone number.',
    noindex: true,
  },
  '/faq': {
    title: 'SHEIN Zimbabwe FAQs | Ordering, Payments & Delivery | Rejo',
    description: 'Find answers about ordering from SHEIN in Zimbabwe, payment methods, the 3-day ordering cycle, order tracking and delivery. Free delivery is available only within Harare.',
  },
  '/contact': {
    title: 'SHEIN Zimbabwe Contact Details | Contact Rejo in Harare',
    description: 'Need help ordering from SHEIN in Zimbabwe? WhatsApp or call Rejo on 0784 487 866, or email remudzamba@gmail.com. Based in Harare; free delivery is available only within Harare.',
  },
  '/admin': { title: 'SHEIN with Rejo Admin', description: 'Private administration area.', noindex: true },
  '/admin/login': { title: 'Admin Sign In | SHEIN with Rejo', description: 'Private administration sign in.', noindex: true },
  '/admin/forgot-password': { title: 'Forgot Password | SHEIN with Rejo', description: 'Private administration password recovery.', noindex: true },
  '/admin/reset-password': { title: 'Reset Password | SHEIN with Rejo', description: 'Private administration password reset.', noindex: true },
  '/admin/account': { title: 'Admin Account | SHEIN with Rejo', description: 'Private administration account.', noindex: true },
  '/admin/orders': { title: 'Admin Orders | SHEIN with Rejo', description: 'Private administration orders.', noindex: true },
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
  const robots = meta.noindex
    ? 'noindex, nofollow, noarchive'
    : 'index, follow, max-image-preview:large'

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`)
  html = html.replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeAttr(meta.title)}" />`)
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttr(meta.description)}" />`)
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`)
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`)

  await writeFile(target, html)
}

console.log(`Generated SEO-ready static HTML entry points for ${Object.keys(routes).length} routes.`)
