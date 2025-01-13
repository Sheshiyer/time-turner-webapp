import React, { useMemo } from 'react'
import { useTime } from '../context/TimeContext'

const CYCLES = [
  { 
    name: 'Physical', 
    radius: '95%', 
    color: 'var(--physical-color)',
    varName: 'physical'
  },
  { 
    name: 'Emotional', 
    radius: '85%', 
    color: 'var(--emotional-color)',
    varName: 'emotional'
  },
  { 
    name: 'Intellectual', 
    radius: '75%', 
    color: 'var(--intellectual-color)',
    varName: 'intellectual'
  }
]

const BiorhythmRing: React.FC<{
  cycle: typeof CYCLES[0]
  value: number
}> = ({ cycle, value }) => {
  const pathData = useMemo(() => {
    const radius = parseInt(cycle.radius) * 1.5
    const points: [number, number][] = []
    const segments = 72 // One point every 5 degrees
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      points.push([x, y])
    }
    
    return `M ${points[0][0]} ${points[0][1]} ` + 
           points.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ')
  }, [cycle.radius])

  return (
    <g className="transform transition-transform duration-300 ease-in-out">
      {/* Base ring */}
      <path
        d={pathData}
        fill="none"
        stroke={cycle.color}
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      
      {/* Value indicator */}
      <circle
        cx={Math.cos(Math.PI * 2 * 0.75) * parseInt(cycle.radius) * 1.5}
        cy={Math.sin(Math.PI * 2 * 0.75) * parseInt(cycle.radius) * 1.5}
        r="6"
        fill={cycle.color}
        className="transition-all duration-300 ease-in-out hover:r-8 hover:filter hover:brightness-125"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))'
        }}
      />
    </g>
  )
}

const BiorhythmDisplay: React.FC = () => {
  const { biorhythm } = useTime()

  const formatPercentage = (value: number) => {
    return Math.round(value * 100)
  }

  return (
    <div className="relative w-[320px] h-[320px]">
      {/* SVG Container */}
      <svg
        viewBox="-150 -150 300 300"
        className="w-full h-full transform rotate-180"
      >
        {CYCLES.map((cycle) => (
          <BiorhythmRing
            key={cycle.name}
            cycle={cycle}
            value={biorhythm[cycle.varName as keyof typeof biorhythm]}
          />
        ))}
      </svg>

      {/* Cycle Values */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 text-center">
          {CYCLES.map((cycle) => {
            const value = biorhythm[cycle.varName as keyof typeof biorhythm]
            return (
              <div key={cycle.name} className="flex flex-col items-center">
                <div className="text-sm font-medium text-white/80">
                  {cycle.name}
                </div>
                <div
                  className="text-xl font-bold font-['JetBrains_Mono']"
                  style={{ color: cycle.color }}
                >
                  {formatPercentage(value)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BiorhythmDisplay
