import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/263784487866"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-green-500/30 
                 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-charcoal" />
    </motion.a>
  )
}
