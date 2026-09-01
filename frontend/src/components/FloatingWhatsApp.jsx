import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { whatsappLink, WHATSAPP_MESSAGES } from '../config'

const messageByPath = (path) => {
  if (path.startsWith('/track-order')) return WHATSAPP_MESSAGES.orderHelp
  if (path.startsWith('/submit-order')) return WHATSAPP_MESSAGES.newRequest
  return WHATSAPP_MESSAGES.general
}

export default function FloatingWhatsApp() {
  const { pathname } = useLocation()

  return (
    <motion.a
      href={whatsappLink(messageByPath(pathname))}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#25D366] rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center text-white hover:bg-[#1ebe5a] transition-colors"
      aria-label="Chat with Rejo on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" aria-hidden="true" />
    </motion.a>
  )
}
