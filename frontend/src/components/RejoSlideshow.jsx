import ImageCarousel from './ImageCarousel'

const base = import.meta.env.BASE_URL

const rejoSlides = [
  {
    src: `${base}rejo.jpeg`,
    alt: 'Rejo, the shopper behind SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Rejo, your shopper.',
  },
  {
    src: `${base}rejo2.jpg`,
    alt: 'Rejo, the shopper behind SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Personal service in Harare.',
  },
  {
    src: `${base}rejo3.jpg`,
    alt: 'Rejo, the shopper behind SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Real help for your SHEIN order.',
  },
]

export default function RejoSlideshow({ className = '', label = 'Rejo — SHEIN with Rejo' }) {
  return (
    <ImageCarousel
      slides={rejoSlides}
      autoplayMs={4500}
      className={`aspect-[4/5] overflow-hidden rounded-2xl ${className}`}
      label={label}
    />
  )
}
