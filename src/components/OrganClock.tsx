import React, { useMemo } from 'react'
import { useTime } from '../context/TimeContext'

// Organ data with additional styling information
const ORGANS = [
  { name: 'Liver', function: 'Detoxification & Planning', color: '#4CAF50' },
  { name: 'Lung', function: 'Breathing & Letting Go', color: '#90CAF9' },
  { name: 'Large Intestine', function: 'Elimination', color: '#FFB74D' },
  { name: 'Stomach', function: 'Breaking Down', color: '#F06292' },
  { name: 'Spleen', function: 'Transformation', color: '#CE93D8' },
  { name: 'Heart', function: 'Joy & Circulation', color: '#EF5350' },
  { name: 'Small Intestine', function: 'Sorting & Processing', color: '#FFD54F' },
  { name: 'Bladder', function: 'Storage & Release', color: '#81C784' },
  { name: 'Kidney', function: 'Vitality & Willpower', color: '#7986CB' },
  { name: 'Pericardium', function: 'Protection & Relationships', color: '#FF8A65' },
  { name: 'Triple Burner', function: 'Temperature & Fluid', color: '#4DB6AC' },
  { name: 'Gallbladder', function: 'Decision Making', color: '#AED581' },
]

const OrganSegment: React.FC<{
  organ: typeof ORGANS[0]
  index: number
  isActive: boolean
  isNext: boolean
}> = ({ organ, index, isActive, isNext }) => {
  const angle = (index * 30)
  const startAngle = angle - 15
  const endAngle = angle + 15

  const segmentPath = useMemo(() => {
    const radius = 140
    const innerRadius = 80
    
    const startRadians = (startAngle * Math.PI) / 180
    const endRadians = (endAngle * Math.PI) / 180
    
    const startX = Math.cos(startRadians) * radius
    const startY = Math.sin(startRadians) * radius
    const endX = Math.cos(endRadians) * radius
    const endY = Math.sin(endRadians) * radius
    
    const innerStartX = Math.cos(startRadians) * innerRadius
    const innerStartY = Math.sin(startRadians) * innerRadius
    const innerEndX = Math.cos(endRadians) * innerRadius
    const innerEndY = Math.sin(endRadians) * innerRadius
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} L ${innerEndX} ${innerEndY} A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY} Z`
  }, [startAngle, endAngle])

  return (
    <path
      d={segmentPath}
      fill={organ.color}
      opacity={isActive ? 0.8 : isNext ? 0.5 : 0.2}
      className="transition-all duration-300 ease-in-out"
      style={{
        filter: isActive ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' : 'none',
        transform: `scale(${isActive ? 1.05 : 1})`,
        transformOrigin: 'center',
      }}
    />
  )
}

const OrganClock: React.FC = () => {
  const { organHour, currentTime } = useTime()
  const currentOrgan = ORGANS[organHour]
  const nextOrgan = ORGANS[(organHour + 1) % 12]
  
  // Calculate minutes until next transition
  const minutes = currentTime.getMinutes()
  const minutesUntilTransition = 120 - (minutes + (currentTime.getHours() % 2) * 60)

  return (
    <div className="relative w-[320px] h-[320px]">
      {/* Backdrop blur and overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/20 rounded-full" />
      
      {/* Organ Wheel */}
      <div className="absolute inset-0">
        <svg
          viewBox="-150 -150 300 300"
          className="w-full h-full transform -rotate-90"
        >
          <g className="transform translate-x-0 translate-y-0">
            {ORGANS.map((organ, index) => (
              <OrganSegment
                key={organ.name}
                organ={organ}
                index={index}
                isActive={index === organHour}
                isNext={index === (organHour + 1) % 12}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Current Organ Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
        <div className="text-2xl font-bold text-white mb-2 font-['JetBrains_Mono']">
          {currentOrgan.name}
        </div>
        <div className="text-sm text-white/80 mb-4">
          {currentOrgan.function}
        </div>
        <div className="text-sm text-white/60">
          Next: {nextOrgan.name}
          <br />
          in {minutesUntilTransition} minutes
        </div>
      </div>
    </div>
  )
}

export default OrganClock
