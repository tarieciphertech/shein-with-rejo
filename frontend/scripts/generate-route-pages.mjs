import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve('dist')

const routes = [
  '/',
  '/about',
  '/how-it-works',
  '/submit-order',
  '/track-order',
  '/faq',
  '/contact',
  '/admin',
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
  '/admin/account',
  '/admin/orders'
]

for (const route of routes) {
  if (route === '/') continue

  const target = path.join(dist, route.replace(/^\//, ''))
  await mkdir(target, { recursive: true })
  await cp(path.join(dist, 'index.html'), path.join(target, 'index.html'))
}

console.log(`Generated ${routes.length - 1} GitHub Pages route entry points.`)
