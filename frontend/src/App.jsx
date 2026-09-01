import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { AdminAuthProvider } from './context/AdminAuthContext'
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
import AdminLogin from './pages/admin/AdminLogin'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import ProtectedAdmin from './pages/admin/ProtectedAdmin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <section className="pt-40 pb-32 section-padding text-center min-h-[60vh]">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ink dark:text-cream mb-4">
        This page went <span className="italic text-clay">out of stock.</span>
      </h1>
      <p className="text-charcoal/70 dark:text-cream/70 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist. Let's get you back to something useful.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3.5">
        <a href="#/" className="btn-accent">Back to Home</a>
        <a href="#/submit-order" className="btn-secondary dark:!border-cream/40 dark:!text-cream dark:hover:!bg-cream dark:hover:!text-ink">Send a Request</a>
      </div>
    </section>
  )
}

function App() {
  const { isDark, toggle } = useDarkMode()
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-cream dark:bg-ink transition-colors duration-300 flex flex-col">
        <ScrollToTop />
        {!isAdminRoute && <Navbar isDark={isDark} toggleDarkMode={toggle} />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/submit-order" element={<SubmitOrder />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/orders"
              element={
                <ProtectedAdmin>
                  <AdminOrders />
                </ProtectedAdmin>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedAdmin>
                  <AdminOrderDetail />
                </ProtectedAdmin>
              }
            />
            <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <FloatingWhatsApp />}
        <BackToTop />
      </div>
    </AdminAuthProvider>
  )
}

export default App
