import React from 'react';
import {
  InformationCircleIcon,
  SunIcon,
  MoonIcon,
  ClockIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export type RingType = 'zodiac' | 'tcm' | 'daily' | 'biorhythm';

interface ClockControlsProps {
  visibleRings: Record<RingType, boolean>;
  onToggleRing: (ring: RingType) => void;
  onShowInfo: () => void;
}

const ClockControls: React.FC<ClockControlsProps> = ({
  visibleRings,
  onToggleRing,
  onShowInfo,
}) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20">
      <div className="flex flex-col items-center gap-4 py-5 px-3 glass-effect rounded-full shadow-lg backdrop-blur-md bg-[#1a0f0d]/30 border border-[#F6F2C0]/20">
        <button
          onClick={() => onToggleRing('zodiac')}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-[#F6F2C0]/30 hover:border-[#F6F2C0]/50 hover:bg-[#F6F2C0]/5 transition-all hover:scale-110 group"
          title="Toggle Zodiac Ring - Shows your astrological influences"
        >
          {visibleRings.zodiac ? (
            <SunIcon className="w-5 h-5 text-[#F6F2C0] group-hover:text-[#CB9B51] transition-colors" />
          ) : (
            <SunIcon className="w-5 h-5 text-[#F6F2C0]/40 group-hover:text-[#CB9B51]/40 transition-colors" />
          )}
        </button>
        <button
          onClick={() => onToggleRing('tcm')}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-[#F6F2C0]/30 hover:border-[#F6F2C0]/50 hover:bg-[#F6F2C0]/5 transition-all hover:scale-110 group"
          title="Toggle TCM Ring - Traditional Chinese Medicine Elements"
        >
          {visibleRings.tcm ? (
            <MoonIcon className="w-5 h-5 text-[#F6F2C0] group-hover:text-[#CB9B51] transition-colors" />
          ) : (
            <MoonIcon className="w-5 h-5 text-[#F6F2C0]/40 group-hover:text-[#CB9B51]/40 transition-colors" />
          )}
        </button>
        <button
          onClick={() => onToggleRing('daily')}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-[#F6F2C0]/30 hover:border-[#F6F2C0]/50 hover:bg-[#F6F2C0]/5 transition-all hover:scale-110 group"
          title="Toggle Daily Ring - 24-hour Cycle"
        >
          {visibleRings.daily ? (
            <ClockIcon className="w-5 h-5 text-[#F6F2C0] group-hover:text-[#CB9B51] transition-colors" />
          ) : (
            <ClockIcon className="w-5 h-5 text-[#F6F2C0]/40 group-hover:text-[#CB9B51]/40 transition-colors" />
          )}
        </button>
        <button
          onClick={() => onToggleRing('biorhythm')}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-[#F6F2C0]/30 hover:border-[#F6F2C0]/50 hover:bg-[#F6F2C0]/5 transition-all hover:scale-110 group"
          title="Toggle Biorhythm Ring - Your Physical, Emotional, and Intellectual Cycles"
        >
          {visibleRings.biorhythm ? (
            <HeartIcon className="w-5 h-5 text-[#F6F2C0] group-hover:text-[#CB9B51] transition-colors" />
          ) : (
            <HeartIcon className="w-5 h-5 text-[#F6F2C0]/40 group-hover:text-[#CB9B51]/40 transition-colors" />
          )}
        </button>
        <div className="w-8 h-px bg-[#F6F2C0]/20" /> {/* Divider */}
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center border border-[#F6F2C0]/30 hover:border-[#F6F2C0]/50 hover:bg-[#F6F2C0]/5 transition-all hover:scale-110 group"
          title="View Information and Settings"
          onClick={onShowInfo}
        >
          <InformationCircleIcon className="w-5 h-5 text-[#F6F2C0] group-hover:text-[#CB9B51] transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default ClockControls;
