import { Link } from 'react-router-dom'
import { HiPhone, HiEnvelope, HiMapPin, HiArrowRight } from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import { BUSINESS, whatsappLink, AFFILIATION_DISCLAIMER } from '../config'

const quickLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/submit-order', label: 'Send a Request' },
  { path: '/track-order', label: 'Track Order' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="section-padding pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5" aria-label={`${BUSINESS.name} — home`}>
              <span className="w-9 h-9 rounded-full bg-cream text-ink flex items-center justify-center font-display font-bold text-lg" aria-hidden="true">R</span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-semibold tracking-tight text-cream">SHEIN <span className="font-display italic font-medium">with</span> Rejo</span>
                <span className="text-[10px] uppercase tracking-widest2 mt-0.5 text-cream/50">Harare · Zimbabwe</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
              A personal ordering service helping you get the SHEIN pieces you love, here in Zimbabwe. Orders go in every {BUSINESS.orderingCycleDays} days, with free delivery in Harare.
            </p>
            <a
              href={whatsappLink('Hi Rejo, I have a question about placing a SHEIN order.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cream hover:text-white transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-[#25D366]/15 flex items-center justify-center">
                <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
              </span>
              Chat with Rejo on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <nav className="lg:col-span-3" aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-widest2 text-cream/40 mb-4">Explore</h2>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-cream/70 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Good to know */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest2 text-cream/40 mb-4">Good to know</h2>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>Orders every {BUSINESS.orderingCycleDays} days</li>
              <li>Free delivery in Harare</li>
              <li>EcoCash · Cash · PayPal</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest2 text-cream/40 mb-4">Contact</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <HiPhone className="w-4 h-4 text-clay shrink-0 mt-0.5" aria-hidden="true" />
                <a href={`tel:${BUSINESS.phoneIntl}`} className="text-sm hover:text-cream transition-colors">
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <HiEnvelope className="w-4 h-4 text-clay shrink-0 mt-0.5" aria-hidden="true" />
                <a href={`mailto:${BUSINESS.email}`} className="text-sm hover:text-cream transition-colors break-all">
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <HiMapPin className="w-4 h-4 text-clay shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm">{BUSINESS.location}</span>
              </li>
            </ul>
            <Link to="/submit-order" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-clay hover:text-white transition-colors">
              Send a SHEIN request
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-12 text-xs leading-relaxed text-cream/40 max-w-3xl">
          {AFFILIATION_DISCLAIMER} The SHEIN name is used only to describe the service — helping customers order items they have found on SHEIN.
        </p>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/40 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="text-cream/40 text-xs">
            Website developed by <a href="https://tarieciphertech.github.io/cyphertech-v2/" target="_blank" rel="noopener noreferrer" className="text-clay hover:text-cream transition-colors">Cypher Technologies</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
