import React from 'react';

interface BiorhythmRingProps {
  radius: number;
  birthDate: string;
}

interface Cycle {
  name: string;
  days: number;
  color: string;
}

const CYCLES: Cycle[] = [
  { name: 'Physical', days: 23, color: '#FF4D4D' },
  { name: 'Emotional', days: 28, color: '#00E5FF' },
  { name: 'Intellectual', days: 33, color: '#FFD700' }
];

// Create gradient definitions for each cycle
const createGradientId = (name: string) => `biorhythm${name}Gradient`;

const GradientDefs: React.FC = () => (
  <>
    <linearGradient id={createGradientId('Physical')} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FF4D4D" stopOpacity="1" />
      <stop offset="50%" stopColor="#FF8080" stopOpacity="1" />
      <stop offset="100%" stopColor="#FF4D4D" stopOpacity="1" />
    </linearGradient>
    <linearGradient id={createGradientId('Emotional')} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
      <stop offset="50%" stopColor="#80F1FF" stopOpacity="1" />
      <stop offset="100%" stopColor="#00E5FF" stopOpacity="1" />
    </linearGradient>
    <linearGradient id={createGradientId('Intellectual')} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
      <stop offset="50%" stopColor="#FFE866" stopOpacity="1" />
      <stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
    </linearGradient>
    
    {/* Enhanced glow filter */}
    <filter id="enhancedGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </>
);

const BiorhythmRing: React.FC<BiorhythmRingProps> = ({ radius, birthDate }) => {
  const calculateBiorhythm = (cycle: number, birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const position = Math.sin((2 * Math.PI * days) / cycle);
    return position;
  };

  const createArcPath = (radius: number, cycle: Cycle) => {
    const value = calculateBiorhythm(cycle.days, birthDate);
    const startAngle = -90; // Start from top
    const endAngle = startAngle + (value + 1) * 180; // Map -1 to 1 to 0 to 360 degrees
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 200 + radius * Math.cos(startRad);
    const y1 = 200 + radius * Math.sin(startRad);
    const x2 = 200 + radius * Math.cos(endRad);
    const y2 = 200 + radius * Math.sin(endRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  return (
    <g className="biorhythm-ring">
      <defs>
        <GradientDefs />
      </defs>
      <circle
        cx="200"
        cy="200"
        r={radius}
        fill="url(#engravedPattern)"
        stroke="url(#goldMetallic)"
        strokeWidth="25"
        opacity="0.7"
      />
      {CYCLES.map((cycle, index) => {
        const cycleRadius = radius - (index * 8) - 4;
        return (
          <g key={cycle.name} className="cursor-pointer hover:opacity-80 transition-opacity">
            <title>{cycle.name} Cycle: {Math.round(calculateBiorhythm(cycle.days, birthDate) * 100)}%</title>
            <path
              d={createArcPath(cycleRadius, cycle)}
              fill="none"
              stroke={`url(#${createGradientId(cycle.name)})`}
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#enhancedGlow)"
              opacity="0.9"
            />
          </g>
        );
      })}
    </g>
  );
};

export default BiorhythmRing;
