import { Helmet } from 'react-helmet-async'
import { SITE_URL, BUSINESS } from '../config'

export default function SEO({
  title = `${BUSINESS.name} | Order from SHEIN in Zimbabwe`,
  description = 'Found something on SHEIN you love? Rejo helps customers in Zimbabwe order from SHEIN — send a link or screenshot, and orders go in every 3 days with free delivery in Harare.',
  path = '/',
  image = `${SITE_URL}/og-image.png`,
  type = 'website',
}) {
  const canonicalUrl = `${SITE_URL}${path === '/' ? '/' : path}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={BUSINESS.name} />
      <meta property="og:locale" content="en_ZW" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}

