import React from 'react'
import { motion } from 'framer-motion'
import { ClockIcon } from '@heroicons/react/24/outline'

interface ClockToggleProps {
  onToggle: () => void
}

const ClockToggle: React.FC<ClockToggleProps> = ({ onToggle }) => {
  return (
    <motion.div 
      className="fixed left-8 top-1/2 -translate-y-1/2 z-20"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="glass-effect rounded-full p-2 backdrop-blur-lg">
        <button 
          onClick={onToggle}
          className="p-3 hover:bg-white/10 rounded-full transition-all border border-[#F6F2C0]/30 hover:border-[#F6F2C0]/50 hover:scale-110 group"
          title="Toggle Clock View"
        >
          <ClockIcon className="w-6 h-6 text-[#F6F2C0] group-hover:text-[#CB9B51] transition-colors" />
        </button>
      </div>
    </motion.div>
  )
}

export default ClockToggle
