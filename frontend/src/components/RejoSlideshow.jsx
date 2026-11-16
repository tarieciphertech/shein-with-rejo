import ImageCarousel from './ImageCarousel'

const base = import.meta.env.BASE_URL

const rejoSlides = [
  {
    src: `${base}rejo.jpeg`,
    alt: 'Rejo, the shopper behind SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Meet Rejo — your personal shopper.',
  },
  {
    src: `${base}rejo2.jpg`,
    alt: 'Rejo from SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Personal service, with a familiar face.',
  },
  {
    src: `${base}rejo3.jpg`,
    alt: 'Rejo from SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Here to help with your SHEIN orders.',
  },
  {
    src: `${base}images/IMG-20261008-WA0012.jpg`,
    alt: 'Rejo, the shopper behind SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Rejo, your shopper.',
  },
  {
    src: `${base}images/IMG-20261008-WA0014.jpg`,
    alt: 'Rejo from SHEIN with Rejo',
    focal: '50% 50%',
    caption: 'Personal service in Harare.',
  },
  {
    src: `${base}images/IMG-20261008-WA0016.jpg`,
    alt: 'Rejo from SHEIN with Rejo',
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
