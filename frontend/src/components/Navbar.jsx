import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiMenu, 
  HiX, 
  HiSun, 
  HiMoon,
  HiShoppingBag 
} from 'react-icons/hi'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/submit-order', label: 'Submit Order' },
  { path: '/track-order', label: 'Track Order' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar({ isDark, toggleDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-charcoal/90 backdrop-blur-lg shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-charcoal dark:bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <HiShoppingBag className="w-5 h-5 text-white dark:text-charcoal" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-charcoal dark:text-white leading-tight">SHEIN</span>
                <span className="text-xs font-medium text-accent leading-tight">with Rejo</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${
                    location.pathname === link.path ? 'text-charcoal dark:text-white after:w-full' : ''
                  } dark:text-white/70 dark:hover:text-white`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full bg-beige dark:bg-white/10 flex items-center justify-center 
                           hover:bg-sand dark:hover:bg-white/20 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <HiSun className="w-5 h-5 text-amber-400" />
                ) : (
                  <HiMoon className="w-5 h-5 text-charcoal" />
                )}
              </button>

              <Link
                to="/submit-order"
                className="hidden sm:inline-flex btn-primary text-sm px-6 py-2.5"
              >
                Start Your Order
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full bg-beige dark:bg-white/10 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-5 h-5 text-charcoal dark:text-white" />
                ) : (
                  <HiMenu className="w-5 h-5 text-charcoal dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-charcoal shadow-2xl"
            >
              <div className="pt-24 px-6 pb-8">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          location.pathname === link.path
                            ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                            : 'text-charcoal dark:text-white hover:bg-beige dark:hover:bg-white/10'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    to="/submit-order"
                    className="btn-primary w-full text-center"
                  >
                    Start Your Order
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
