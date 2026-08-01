# SHEIN with Rejo

A modern, responsive ordering service website that helps customers in Zimbabwe place orders from SHEIN. Customers submit product links or screenshots, and the business places orders on their behalf every three days.

![SHEIN with Rejo](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## Features

- **7 Pages**: Home, About, How It Works, Submit Order, Track Order, FAQ, Contact
- **Modern Design**: Neutral color palette (white, beige, cream, soft brown, black accents)
- **Fully Responsive**: Mobile-first design that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Framer Motion scroll reveals, hover effects, and transitions
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, structured data, sitemap, robots.txt
- **Accessible**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Lazy loading, code splitting, optimized assets
- **Order Form**: Dynamic product links, image upload preview, validation
- **Floating WhatsApp**: Persistent WhatsApp chat button on all pages
- **Back to Top**: Smooth scroll button appears on scroll

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- React Icons
- React Hook Form
- React Helmet Async

### Backend (Optional)
- Node.js
- Express
- Multer (file uploads)
- CORS
- UUID

## Project Structure

```
shein-with-rejo/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FloatingWhatsApp.jsx
│   │   │   ├── BackToTop.jsx
│   │   │   ├── SEO.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── SubmitOrder.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── FAQ.jsx
│   │   │   └── Contact.jsx
│   │   ├── hooks/
│   │   │   └── useDarkMode.js
│   │   ├── data/
│   │   │   └── sampleData.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Build for Production

```bash
cd frontend
npm run build
```

The production build will be in the `dist/` directory.

### Backend Setup (Optional)

```bash
cd backend
npm install
# Copy .env.example to .env and configure
cp .env.example .env
npm run dev
```

The backend API will run on `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get single order |
| PATCH | `/api/orders/:id` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |

## Deployment

### Frontend

**Vercel:**
```bash
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
# Deploy dist/ folder to Netlify
```

**GitHub Pages:**
Update `vite.config.js` base URL and deploy the `dist/` folder.

### Backend

**Render:**
1. Connect your GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`

**Railway:**
```bash
railway login
railway up
```

## Contact Information

- **Phone:** 0784 487 866
- **Email:** remudzamba@gmail.com
- **WhatsApp:** [Chat Now](https://wa.me/263784487866)
- **Location:** Harare, Zimbabwe

## License

This project is private and proprietary.

---

Built with care for Zimbabwe.
