import { Helmet } from 'react-helmet-async'

export default function SEO({ 
  title = 'SHEIN with Rejo | Easy SHEIN Ordering in Zimbabwe',
  description = 'Shop SHEIN easily with Rejo. We place orders on your behalf every 3 days with free delivery in Harare.',
  path = '/'
}) {
  const canonicalUrl = `https://sheinwithrejo.com${path}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
