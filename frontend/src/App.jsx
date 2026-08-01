import { Routes, Route } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import BackToTop from './components/BackToTop'
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import SubmitOrder from './pages/SubmitOrder'
import OrderTracking from './pages/OrderTracking'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'

function App() {
  const { isDark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen bg-cream dark:bg-softblack transition-colors duration-300">
      <Navbar isDark={isDark} toggleDarkMode={toggle} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/submit-order" element={<SubmitOrder />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  )
}

export default App
