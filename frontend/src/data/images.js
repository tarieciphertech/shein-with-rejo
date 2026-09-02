/**
 * CENTRAL IMAGE REGISTRY — the single source of truth for all site imagery.
 *
 * Every image is a self-hosted, original campaign asset in frontend/public/images/
 * (warm editorial tones — draped fabrics, silhouettes, tags, cards, packaging).
 *
 * HOW TO REPLACE WITH REAL PHOTOGRAPHY:
 *   Drop your photograph over the same filename in frontend/public/images/ and it
 *   will be used everywhere automatically. No component edits needed.
 *
 * asset() prefixes the Vite base path (needed for GitHub Pages). Never hardcode
 * '/images/...' directly in a component.
 */
export const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`

/**
 * Each entry: { src, alt, focal, caption? }
 * - alt    : meaningful description (accessibility)
 * - focal  : CSS object-position for deliberate cropping
 * - caption: optional editorial caption
 */
export const images = {
  /* Homepage hero slideshow — one coherent campaign, four moments */
  hero: [
    {
      src: asset('hero-lookbook.webp'),
      alt: 'Editorial composition of draped fabric and fashion look cards in warm cream and clay tones',
      focal: '58% 55%',
      caption: 'Your finds, styled',
    },
    {
      src: asset('hero-accessories.webp'),
      alt: 'Stylised handbag silhouette with a pearl chain detail in clay and taupe tones',
      focal: '60% 55%',
      caption: 'The everyday edit',
    },
    {
      src: asset('hero-discover.webp'),
      alt: 'Illustration of a phone showing a saved fashion item next to a reserved tag',
      focal: '56% 45%',
      caption: 'Found it — send it to Rejo',
    },
    {
      src: asset('hero-arrival.webp'),
      alt: 'Elegant gift box with ribbon, warmly lit against a deep charcoal backdrop',
      focal: '60% 55%',
      caption: 'On its way to Harare',
    },
  ],

  /* Fashion editorial rail */
  rail: [
    { src: asset('rail-drape.webp'), alt: 'Draped fabric folds in clay and sand tones', caption: 'Draped fabric', ratio: '3/4' },
    { src: asset('rail-bag.webp'), alt: 'Dark tote bag silhouette on a taupe backdrop', caption: 'The every-day tote', ratio: '3/4' },
    { src: asset('rail-knit.webp'), alt: 'Warm clay knit texture with cream stitches', caption: 'Knit texture', ratio: '1/1' },
    { src: asset('rail-dress.webp'), alt: 'A-line dress silhouette hanging from a hanger on cream', caption: 'The daily edit', ratio: '3/4' },
    { src: asset('rail-shoes.webp'), alt: 'Two elegant heel silhouettes on sand backdrop', caption: 'On your feet', ratio: '4/3' },
    { src: asset('rail-tag.webp'), alt: 'Care tag with size labels on a hanger', caption: 'Sizes, sorted', ratio: '3/4' },
    { src: asset('rail-totes.webp'), alt: 'Two tote bag silhouettes in different sizes', caption: 'The carry-alls', ratio: '4/3' },
    { src: asset('rail-weave.webp'), alt: 'Fine linen weave texture close-up', caption: 'Linen weave', ratio: '1/1' },
  ],

  /* How it works visual story */
  howItWorks: {
    find: { src: asset('how-find.webp'), alt: 'Illustration of a phone browsing a saved fashion item', focal: '50% 50%' },
    send: { src: asset('how-send.webp'), alt: 'Illustration of a fashion card being sent along a dotted path', focal: '50% 50%' },
    check: { src: asset('how-check.webp'), alt: 'Illustration of a checklist card confirming an order request', focal: '50% 50%' },
    order: { src: asset('how-order.webp'), alt: 'Illustration of a gift box marked ordered in deep tones', focal: '50% 50%' },
    receive: { src: asset('how-receive.webp'), alt: 'Warm illustration of a delivery at a doorway with a gift box', focal: '50% 50%' },
  },

  /* About page editorial composition */
  about: {
    large: {
      src: asset('about-large.webp'),
      alt: 'Editorial montage of layered fabric ribbons and look cards with a Made in Harare note',
      focal: '50% 50%',
    },
    secondary: {
      src: asset('about-secondary.webp'),
      alt: 'Close detail of layered fabric ribbons and buttons in warm tones',
      focal: '50% 50%',
    },
  },

  /* Submit Order sidebar */
  order: {
    side: {
      src: asset('order-side.webp'),
      alt: 'Illustration of a saved fashion card being sent along a path to Rejo',
      focal: '50% 40%',
    },
  },

  /* 3-day ordering cycle */
  cycle: {
    src: asset('cycle.webp'),
    alt: 'Progress of a request through review, confirm, order and delivery stages',
    focal: '50% 50%',
  },

  /* Full-width CTA band */
  cta: {
    src: asset('cta.webp'),
    alt: '', // decorative background
    focal: '50% 50%',
  },
}
