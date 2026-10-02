/**
 * CENTRAL IMAGE REGISTRY — the single source of truth for all site imagery.
 *
 * Current assets are fashion and lifestyle photographs from Pexels (free license),
 * self-hosted as optimized WebP in frontend/public/images/.
 *
 * asset() prefixes the Vite base path (needed for GitHub Pages). Never hardcode
 * '/images/...' directly in a component.
 */
export const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`

export const images = {
  hero: [
    { src: asset('hero-lookbook.webp'), alt: 'A person wearing a stylish neutral-toned outfit, editorial fashion portrait', focal: '50% 40%', caption: 'Your finds, styled' },
    { src: asset('hero-accessories.webp'), alt: 'Fashion accessories and personal style items arranged in warm editorial lighting', focal: '50% 50%', caption: 'The everyday edit' },
    { src: asset('hero-discover.webp'), alt: 'A person browsing fashion on their phone, lifestyle shopping moment', focal: '50% 45%', caption: 'Found it — send it to Rejo' },
    { src: asset('hero-arrival.webp'), alt: 'A packaged order and shopping bag, delivery moment in warm light', focal: '50% 55%', caption: 'On its way to Harare' },
  ],
  rail: [
    { src: asset('rail-dress.webp'), alt: 'Portrait of a person in a stylish dress, warm editorial lighting', caption: 'The daily edit', ratio: '3/4' },
    { src: asset('rail-shoes.webp'), alt: 'Close-up of fashionable shoes styled on a clean backdrop', caption: 'On your feet', ratio: '3/4' },
    { src: asset('rail-bag.webp'), alt: 'A fashionable handbag styled in warm lifestyle lighting', caption: 'The every-day tote', ratio: '3/4' },
    { src: asset('rail-outfit.webp'), alt: 'Full outfit editorial portrait in natural warm light', caption: 'Head to toe', ratio: '3/4' },
    { src: asset('rail-accessories.webp'), alt: 'Fashion accessories and jewellery styled editorially', caption: 'The details', ratio: '3/4' },
    { src: asset('rail-lifestyle.webp'), alt: 'Lifestyle fashion portrait with confident styling', caption: 'Your style', ratio: '3/4' },
  ],
  howItWorks: {
    find: { src: asset('how-find.webp'), alt: 'A person browsing fashion and discovering items to save', focal: '50% 50%' },
    send: { src: asset('how-send.webp'), alt: 'Sending a fashion link or screenshot to Rejo', focal: '50% 50%' },
    review: { src: asset('how-review.webp'), alt: 'Reviewing and confirming order details together', focal: '50% 50%' },
    order: { src: asset('how-order.webp'), alt: 'A packaged and labelled order ready for processing', focal: '50% 50%' },
    receive: { src: asset('how-receive.webp'), alt: 'Receiving a delivered fashion order with excitement', focal: '50% 50%' },
  },
  about: {
    large: { src: asset('about-main.webp'), alt: 'Editorial fashion portrait representing the personal service behind SHEIN with Rejo', focal: '50% 50%' },
    secondary: { src: asset('about-secondary.webp'), alt: 'Lifestyle fashion detail in warm, natural editorial light', focal: '50% 50%' },
  },
  order: {
    side: { src: asset('order-side.webp'), alt: 'A person discovering fashion finds — send yours to Rejo', focal: '50% 40%' },
  },
  cycle: {
    src: asset('cycle.webp'),
    alt: 'A request moving through review, confirm, order and delivery stages',
    focal: '50% 50%',
  },
  cta: {
    src: asset('cta.webp'),
    alt: '',
    focal: '50% 50%',
  },
}
