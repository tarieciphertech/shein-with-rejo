import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve('dist')
const source = path.join(dist, 'index.html')

const routes = {
  '/about': {
    title: 'About SHEIN with Rejo | SHEIN Ordering Service in Harare',
    description: 'Learn about SHEIN with Rejo, an independent Harare-based ordering service helping customers in Zimbabwe order items they find on SHEIN.',
  },
  '/how-it-works': {
    title: 'How It Works | Order from SHEIN in Zimbabwe',
    description: 'See how SHEIN with Rejo works: send a SHEIN link or screenshot, confirm your details and payment, then follow your order through the next ordering cycle.',
  },
  '/submit-order': {
    title: 'Send a SHEIN Order Request | SHEIN with Rejo',
    description: 'Send a SHEIN product link or screenshot with your size, colour and quantity. Rejo helps customers in Zimbabwe place orders every 3 days.',
  },
  '/track-order': {
    title: 'Track Your SHEIN Order | SHEIN with Rejo',
    description: 'Track your SHEIN order request with Rejo using your order reference and phone number.',
  },
  '/faq': {
    title: 'SHEIN Zimbabwe Ordering FAQ | SHEIN with Rejo',
    description: 'Get answers about SHEIN ordering in Zimbabwe, payments, delivery in Harare, the 3-day ordering cycle, tracking and more.',
  },
  '/contact': {
    title: 'Contact SHEIN with Rejo | Harare, Zimbabwe',
    description: 'Contact Rejo on WhatsApp, phone or email about SHEIN orders, delivery and product requests in Harare, Zimbabwe.',
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

const replaceMeta = (html, pattern, replacement) => html.replace(pattern, replacement)

const template = await readFile(source, 'utf8')

for (const [route, meta] of Object.entries(routes)) {
  const target = path.join(dist, route.replace(/^\//, ''), 'index.html')
  await mkdir(path.dirname(target), { recursive: true })

  const canonical = `https://shopwithrejo.cyphertech.co.zw${route}`
  const isAdmin = route.startsWith('/admin')

  let html = template
  html = replaceMeta(html, /<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
  html = replaceMeta(html, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`)
  html = replaceMeta(html, /<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${isAdmin ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large'}" />`)
  html = replaceMeta(html, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
  html = replaceMeta(html, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeAttr(meta.title)}" />`)
  html = replaceMeta(html, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttr(meta.description)}" />`)
  html = replaceMeta(html, /<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
  html = replaceMeta(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`)
  html = replaceMeta(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`)

  await writeFile(target, html)
}

console.log(`Generated SEO-ready static HTML entry points for ${Object.keys(routes).length} routes.`)
