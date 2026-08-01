import { Link } from 'react-router-dom'
import { 
  HiShoppingBag, 
  HiPhone, 
  HiEnvelope, 
  HiMapPin,
  HiClock 
} from 'react-icons/hi2'
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'
import { businessHours } from '../data/sampleData'

const quickLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/submit-order', label: 'Submit Order' },
  { path: '/track-order', label: 'Track Order' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal dark:bg-black text-white pt-16 pb-8">
      <div className="section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <HiShoppingBag className="w-5 h-5 text-charcoal" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">SHEIN</span>
                <span className="text-xs font-medium text-accent leading-tight">with Rejo</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Your trusted partner for easy SHEIN ordering in Zimbabwe. 
              We handle everything so you can shop with confidence.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://wa.me/263784487866" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <HiPhone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Phone</p>
                  <a href="tel:+263784487866" className="text-sm hover:text-accent transition-colors">
                    0784 487 866
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <HiEnvelope className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <a href="mailto:remudzamba@gmail.com" className="text-sm hover:text-accent transition-colors">
                    remudzamba@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <HiMapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Location</p>
                  <p className="text-sm">Harare, Zimbabwe</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Business Hours</h3>
            <ul className="space-y-3">
              {businessHours.map((item) => (
                <li key={item.day} className="flex items-start gap-3">
                  <HiClock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{item.day}</p>
                    <p className="text-sm text-white/60">{item.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} SHEIN with Rejo. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Website developed by <a href="https://tarieciphertech.github.io/cyphertech-v2/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors">Cypher Technologies ⚡</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
