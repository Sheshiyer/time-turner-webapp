import React from 'react'

interface LoadingSpinnerProps {
  message?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-[#F6F2C0]/20 rounded-full" />
        {/* Spinning inner ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-[#CB9B51] rounded-full animate-spin" />
        {/* Center dot */}
        <div className="absolute inset-[30%] bg-gradient-to-br from-[#F6F2C0] to-[#CB9B51] rounded-full" />
      </div>
      {message && (
        <p className="text-[#F6F2C0] text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner
