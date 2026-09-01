import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiBars3,
  HiXMark,
  HiSun,
  HiMoon,
  HiArrowRight,
} from 'react-icons/hi2'
import { BUSINESS } from '../config'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/track-order', label: 'Track Order' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
]

function BrandMark({ dark = false }) {
  return (
    <span className="flex items-center gap-2.5" aria-hidden="true">
      <span
        className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-lg transition-colors ${
          dark ? 'bg-cream text-ink' : 'bg-ink text-cream'
        }`}
      >
        R
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[15px] font-semibold tracking-tight ${dark ? 'text-cream' : 'text-ink'}`}>
          SHEIN <span className="font-display italic font-medium">with</span> Rejo
        </span>
        <span className={`text-[10px] uppercase tracking-widest2 mt-0.5 ${dark ? 'text-cream/50' : 'text-clay'}`}>
          Harare · Zimbabwe
        </span>
      </span>
    </span>
  )
}

export default function Navbar({ isDark, toggleDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-cream/95 dark:bg-ink/95 backdrop-blur-md border-b border-sand/80 dark:border-white/10'
            : 'bg-transparent'
        }`}
      >
        <nav className="section-padding" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 lg:h-[76px]">
            <Link to="/" className="group" aria-label={`${BUSINESS.name} — home`}>
              <BrandMark />
            </Link>

            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link dark:text-cream/70 dark:hover:text-cream ${
                    location.pathname === link.path
                      ? 'text-ink dark:text-cream after:w-full'
                      : ''
                  }`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full border border-sand dark:border-white/15 flex items-center justify-center hover:border-clay transition-colors"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <HiSun className="w-[18px] h-[18px] text-amber-300" />
                ) : (
                  <HiMoon className="w-[18px] h-[18px] text-ink dark:text-cream" />
                )}
              </button>

              <Link
                to="/submit-order"
                className="hidden sm:inline-flex items-center gap-2 bg-clay text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-clay-deep transition-colors"
              >
                Send a Request
                <HiArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full border border-sand dark:border-white/15 flex items-center justify-center"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <HiXMark className="w-5 h-5 text-ink dark:text-cream" />
                ) : (
                  <HiBars3 className="w-5 h-5 text-ink dark:text-cream" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-cream dark:bg-ink"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="pt-24 px-6 pb-8 h-full flex flex-col overflow-y-auto">
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + index * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-4 text-2xl font-display border-b border-sand dark:border-white/10 transition-colors ${
                        location.pathname === link.path
                          ? 'text-clay italic'
                          : 'text-ink dark:text-cream'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-auto pt-8 pb-4"
              >
                <Link to="/submit-order" className="btn-accent w-full text-center">
                  Send a SHEIN Request
                  <HiArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <p className="text-center text-xs text-charcoal/50 dark:text-cream/50 mt-4">
                  Questions first? WhatsApp {BUSINESS.phoneDisplay}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
