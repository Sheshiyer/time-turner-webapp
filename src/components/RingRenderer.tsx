import React from 'react';
import { Ring } from '../types/rings';
import TcmRing from './TcmRing';
import BiorhythmRing from './BiorhythmRing';

interface RingRendererProps {
  ring: Ring;
  visible: boolean;
  birthDate?: string;
  birthTime?: string;
}

const RingRenderer: React.FC<RingRendererProps> = ({ 
  ring, 
  visible, 
  birthDate = '', 
  birthTime = '' 
}) => {
  // Create gradient ID based on ring type
  const gradientId = `${ring.id}Gradient`;

  // Create gradient definition
  const createGradient = () => (
    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
      {ring.gradient.colors.map((color, index) => {
        const offset = index === 0 ? '0%' : 
                      index === ring.gradient.colors.length - 1 ? '100%' :
                      `${(index / (ring.gradient.colors.length - 1)) * 100}%`;
        return (
          <stop 
            key={`${ring.id}-${index}`}
            offset={offset} 
            stopColor={color} 
            stopOpacity={ring.gradient.opacity} 
          />
        );
      })}
    </linearGradient>
  );

  // Render specific ring type
  const renderRing = () => {
    switch (ring.type) {
      case 'tcm':
        return <TcmRing radius={ring.radius} />;
      case 'biorhythm':
        return <BiorhythmRing radius={ring.radius} birthDate={birthDate} />;
      case 'zodiac':
      case 'daily':
        // These are currently handled in AlethiometerClock
        return null;
      case 'lunar':
        // TODO: Implement lunar phase ring
        return (
          <circle
            cx="200"
            cy="200"
            r={ring.radius}
            fill="url(#engravedPattern)"
            stroke={`url(#${gradientId})`}
            strokeWidth="35"
            opacity={ring.gradient.opacity}
          />
        );
      case 'seasonal':
        // TODO: Implement seasonal cycle ring
        return (
          <circle
            cx="200"
            cy="200"
            r={ring.radius}
            fill="url(#engravedPattern)"
            stroke={`url(#${gradientId})`}
            strokeWidth="35"
            opacity={ring.gradient.opacity}
          />
        );
      case 'planetary':
        // TODO: Implement planetary hours ring
        return (
          <circle
            cx="200"
            cy="200"
            r={ring.radius}
            fill="url(#engravedPattern)"
            stroke={`url(#${gradientId})`}
            strokeWidth="35"
            opacity={ring.gradient.opacity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <g style={{ opacity: visible ? 1 : 0 }} className={`${ring.id}-ring`}>
      <defs>
        {createGradient()}
      </defs>
      {renderRing()}
    </g>
  );
};

export default RingRenderer;
