import React from 'react'
import { useTime } from '../context/TimeContext'

const ModernClock: React.FC = () => {
  const { currentTime } = useTime()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate hand angles for analog clock
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const hourDegrees = ((hours % 12) / 12) * 360 + (minutes / 60) * 30
  const minuteDegrees = (minutes / 60) * 360

  return (
    <div className="relative w-[320px] h-[320px] bg-[var(--surface-dark)] rounded-full shadow-lg flex items-center justify-center"
         style={{
           boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
           transform: 'translate3d(0,0,0)',
           backfaceVisibility: 'hidden'
         }}>
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Digital Display */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-['JetBrains_Mono'] text-2xl font-semibold text-white z-10">
          {formatTime(currentTime)}
        </div>

        {/* Analog Display */}
        <div className="absolute inset-4">
          {/* Clock Face */}
          <div className="relative w-full h-full">
            {/* Hour Markers */}
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-[2px] h-[2px] rounded-full ${i % 5 === 0 ? 'bg-white/60' : 'bg-white/30'}`}
                style={{
                  transform: `rotate(${i * 6}deg) translateY(calc(-50% + 8px))`,
                  transformOrigin: '50% 50%',
                  top: '50%',
                  left: '50%',
                }}
              />
            ))}

            {/* Hour Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-[3px] h-[60px] bg-white/80 rounded-full origin-bottom"
              style={{
                transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
                transformOrigin: '50% 100%',
              }}
            />

            {/* Minute Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-[2px] h-[90px] bg-white/90 rounded-full origin-bottom"
              style={{
                transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
                transformOrigin: '50% 100%',
              }}
            />

            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernClock
