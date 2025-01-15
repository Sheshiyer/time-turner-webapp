import React from 'react'
import { motion } from 'framer-motion'

interface NavigationMenuProps {
  onProfileClick: () => void
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ onProfileClick }) => {
  return (
    <motion.div 
      className="fixed left-8 top-1/2 -translate-y-1/2 z-20"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="glass-effect rounded-full p-2 backdrop-blur-lg">
        <nav className="flex flex-col gap-4">
          <button 
            onClick={onProfileClick}
            className="p-3 hover:bg-white/10 rounded-full transition-all border border-[#F6F2C0]/30 hover:border-[#F6F2C0]/50 hover:scale-110 group"
            title="Profile"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-6 h-6 text-[#F6F2C0] group-hover:text-[#CB9B51] transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </button>
          {/* Add more navigation buttons here */}
        </nav>
      </div>
    </motion.div>
  )
}

export default NavigationMenu
