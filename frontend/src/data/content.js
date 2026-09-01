/**
 * All customer-facing content lives here so copy can be reviewed and updated
 * in one place. Only verified business facts appear in this file.
 */

export const journeySteps = [
  {
    number: '01',
    title: 'Find it',
    description: 'Browse SHEIN and find something you love.',
    detail: 'Take your time — browse the app, save your favourites, imagine the outfit.',
  },
  {
    number: '02',
    title: 'Send it',
    description: 'Send the product link or a screenshot.',
    detail: 'No SHEIN account needed. Just the link, or a screenshot of the item.',
  },
  {
    number: '03',
    title: 'We check it',
    description: 'Rejo reviews your request and confirms the details.',
    detail: 'Sizes, colours, availability — we make sure everything is right before anything is ordered.',
  },
  {
    number: '04',
    title: 'We place it',
    description: 'Your request joins the next ordering cycle.',
    detail: 'Orders go in every 3 days, so your request is never far from being placed.',
  },
  {
    number: '05',
    title: 'You receive it',
    description: 'Track your order and receive it in Harare.',
    detail: 'Follow every step on the tracking page until it reaches your door.',
  },
]

export const howItWorksSteps = [
  {
    number: '01',
    title: 'Find your item',
    description: 'Open the SHEIN app or website and find something you love. You do not need a SHEIN account or to check out — just look.',
  },
  {
    number: '02',
    title: 'Send the link or screenshot',
    description: 'Copy the product link, or take a screenshot. Either one works. Send it through our request form.',
  },
  {
    number: '03',
    title: 'Tell us your size, colour and quantity',
    description: 'Add the details that matter — your size, preferred colour, and how many you would like.',
  },
  {
    number: '04',
    title: 'We review your request',
    description: 'Rejo checks availability and confirms the details with you before anything is ordered.',
  },
  {
    number: '05',
    title: 'Payment and confirmation',
    description: 'Once you are happy, we confirm payment. You can pay with EcoCash, cash, or PayPal — whatever suits you.',
  },
  {
    number: '06',
    title: 'Your request enters the next ordering cycle',
    description: 'Orders are placed every 3 days, so your confirmed request joins the next batch.',
  },
  {
    number: '07',
    title: 'Track your order',
    description: 'Use your request reference and phone number on the tracking page to see exactly where things stand.',
  },
  {
    number: '08',
    title: 'Receive your items',
    description: 'We deliver to your address in Harare — free of charge.',
  },
]

export const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Find the item on SHEIN, then send us the product link or a screenshot through the request form along with your size, colour and quantity. Rejo will review your request and guide you through the rest.',
  },
  {
    question: 'Can I send a screenshot instead of a link?',
    answer: 'Yes. A clear screenshot of the item works just as well as a link. You can upload screenshots when you submit your request.',
  },
  {
    question: 'Do I need a SHEIN account?',
    answer: 'No. You do not need to create a SHEIN account or check out on SHEIN yourself. Rejo handles the ordering for you.',
  },
  {
    question: 'How often are orders placed?',
    answer: 'We group customer requests and place orders every 3 days. Your confirmed request joins the next ordering cycle.',
  },
  {
    question: 'How do I track my order?',
    answer: 'When you submit a request you receive a reference number. Enter that reference and the phone number you provided on the Track Order page to see your current status.',
  },
  {
    question: 'Where do you deliver?',
    answer: 'We currently deliver within Harare, and delivery in Harare is free. If you are outside Harare, message us on WhatsApp to talk about your options.',
  },
  {
    question: 'What payment methods are available?',
    answer: 'We accept EcoCash, cash, and PayPal. After your request is reviewed, we confirm the total with you before payment.',
  },
  {
    question: 'Can I order multiple items?',
    answer: 'Yes. The request form lets you add multiple items — each with its own link, screenshot, size, colour and quantity.',
  },
  {
    question: 'What happens after I submit a request?',
    answer: 'You receive a reference number right away. Rejo then reviews your request, confirms details and pricing with you, and once confirmed, your order joins the next 3-day ordering cycle.',
  },
  {
    question: 'Is SHEIN with Rejo affiliated with SHEIN?',
    answer: 'No. SHEIN with Rejo is an independent ordering service run from Harare. We are not SHEIN, and we are not affiliated with or endorsed by SHEIN. We simply help customers in Zimbabwe order items they find on SHEIN.',
  },
]

export const orderTimeline = [
  { key: 'pending', label: 'Request received', description: 'Your request is in. Rejo will review it shortly.' },
  { key: 'reviewed', label: 'Being reviewed', description: 'Details and availability are being confirmed.' },
  { key: 'priced', label: 'Quotation sent', description: 'We have sent you the total to confirm.' },
  { key: 'paid', label: 'Payment confirmed', description: 'Payment received — thank you.' },
  { key: 'ordered', label: 'Order placed', description: 'Your items have been ordered with SHEIN.' },
  { key: 'shipped', label: 'In transit', description: 'Your order is on its way.' },
  { key: 'delivered', label: 'Delivered', description: 'Delivered in Harare. Enjoy your items!' },
]
