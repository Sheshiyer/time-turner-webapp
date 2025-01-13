import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import TcmRing from './TcmRing';
import BiorhythmRing from './BiorhythmRing';
import { 
  InformationCircleIcon, 
  SunIcon,
  MoonIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import CentralInfo from './CentralInfo';
import { DEFAULT_RINGS } from '../types/rings';

interface TimeRing {
  type: 'zodiac' | 'lunar' | 'daily';
  currentPosition: number;
  totalDivisions: number;
  symbols: Array<{
    position: number;
    symbol: string;
    meaning: string;
  }>;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const ZODIAC_SIGNS = [
  { symbol: 'A', name: 'Aries' },
  { symbol: 'T', name: 'Taurus' },
  { symbol: 'G', name: 'Gemini' },
  { symbol: 'C', name: 'Cancer' },
  { symbol: 'L', name: 'Leo' },
  { symbol: 'V', name: 'Virgo' },
  { symbol: 'B', name: 'Libra' },
  { symbol: 'S', name: 'Scorpio' },
  { symbol: 'S', name: 'Sagittarius' },
  { symbol: 'C', name: 'Capricorn' },
  { symbol: 'A', name: 'Aquarius' },
  { symbol: 'P', name: 'Pisces' }
];

interface AlethiometerClockProps {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

const AlethiometerClock: React.FC<AlethiometerClockProps> = ({ birthDate, birthTime, birthPlace }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [visibleRings, setVisibleRings] = useState({
    zodiac: true,
    tcm: true,
    daily: true,
    biorhythm: true
  });
  const [showLegend, setShowLegend] = useState(false);
  const [currentZodiac, setCurrentZodiac] = useState('');
  const [showCentralInfo, setShowCentralInfo] = useState(false);
  
  const calculatePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360) / total - 90; // -90 to start at top
    const radian = (angle * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(radian),
      y: 200 + radius * Math.sin(radian),
      angle
    };
  };

  // Calculate zodiac position based on birth date
  const getZodiacInfo = (date: string) => {
    const birthDate = new Date(date);
    const month = birthDate.getMonth() + 1; // JavaScript months are 0-based
    const day = birthDate.getDate();
    
    const zodiacRanges = [
      { sign: 'Capricorn', symbol: 'C', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
      { sign: 'Aquarius', symbol: 'A', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
      { sign: 'Pisces', symbol: 'P', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
      { sign: 'Aries', symbol: 'A', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
      { sign: 'Taurus', symbol: 'T', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
      { sign: 'Gemini', symbol: 'G', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
      { sign: 'Cancer', symbol: 'C', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
      { sign: 'Leo', symbol: 'L', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
      { sign: 'Virgo', symbol: 'V', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
      { sign: 'Libra', symbol: 'B', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
      { sign: 'Scorpio', symbol: 'S', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
      { sign: 'Sagittarius', symbol: 'S', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
    ];

    // Helper function to compare dates
    const isDateInRange = (month: number, day: number, start: { month: number, day: number }, end: { month: number, day: number }) => {
      const date = month * 100 + day;
      const startDate = start.month * 100 + start.day;
      const endDate = end.month * 100 + end.day;
      
      if (startDate > endDate) { // Handles Capricorn case crossing year boundary
        return date >= startDate || date <= endDate;
      }
      return date >= startDate && date <= endDate;
    };

    const zodiacSign = zodiacRanges.find(range => 
      isDateInRange(month, day, range.start, range.end)
    ) || zodiacRanges[0]; // Default to Capricorn if not found

    return {
      sign: zodiacSign.sign,
      symbol: zodiacSign.symbol,
      index: zodiacRanges.indexOf(zodiacSign)
    };
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Setup hover animations for each ring
    const rings = [
      { selector: '.zodiac-ring circle', scale: 1.02 },
      { selector: '.tcm-ring circle', scale: 1.02 },
      { selector: '.daily-ring circle', scale: 1.02 },
      { selector: '.ghati-ring circle:first-child', scale: 1.02 }
    ];

    const cleanupListeners: (() => void)[] = [];

    rings.forEach(({ selector, scale }) => {
      const ring = document.querySelector(selector);
      if (!ring) return;

      const handleMouseEnter = () => {
        gsap.to(ring, {
          scale,
          filter: 'brightness(1.2)',
          duration: 0.3,
          transformOrigin: 'center center',
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(ring, {
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.3,
          transformOrigin: 'center center',
          ease: 'power2.out'
        });
      };

      ring.addEventListener('mouseenter', handleMouseEnter);
      ring.addEventListener('mouseleave', handleMouseLeave);

      cleanupListeners.push(() => {
        ring.removeEventListener('mouseenter', handleMouseEnter);
        ring.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    // Cleanup function
    return () => {
      cleanupListeners.forEach(cleanup => cleanup());
    };

    // Calculate fixed positions based on birth data
    const [birthHour, birthMinute] = birthTime.split(':').map(Number);
    const { index: zodiacIndex, sign: currentSign } = getZodiacInfo(birthDate);
    
    // Set fixed rotations based on birth time
    gsap.set('.zodiac-ring', {
      rotation: (zodiacIndex * 30), // 360/12 = 30 degrees per zodiac sign
      transformOrigin: 'center center'
    });

    // Update current zodiac
    setCurrentZodiac(currentSign);

    gsap.set('.daily-ring', {
      rotation: ((birthHour + birthMinute/60) * -15), // 360/24 = 15 degrees per hour
      transformOrigin: 'center center'
    });

    // Subtle pulse animation for symbols
    gsap.to('.zodiac-symbol, .hour-marker', {
      opacity: 0.7,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Rotate ghati ring smoothly
    gsap.to('.ghati-ring', {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
      transformOrigin: 'center center'
    });

    // Smooth animation for ghati indicator
    gsap.to('.ghati-ring circle:last-child', {
      scale: 1.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, [birthDate, birthTime]);

  return (
    <div className="relative w-full h-full min-h-[400px] grid grid-rows-[1fr,auto] gap-1 py-1">
      {/* Central Info Modal */}
      <CentralInfo
        visible={showCentralInfo}
        onClose={() => setShowCentralInfo(false)}
        rings={DEFAULT_RINGS}
        birthDate={birthDate}
        birthTime={birthTime}
        birthPlace={birthPlace}
      />

      {/* Clock container */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] aspect-square relative">
          <svg
            ref={svgRef}
            viewBox="0 0 400 400"
            className="w-full h-full"
          >
            <defs>
              {/* Zodiac ring gradient - Rich gold */}
              <linearGradient id="zodiacGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#462523', stopOpacity: 1 }} />
                <stop offset="20%" style={{ stopColor: '#CB9B51', stopOpacity: 1 }} />
                <stop offset="45%" style={{ stopColor: '#F6E27A', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#F6F2C0', stopOpacity: 1 }} />
                <stop offset="55%" style={{ stopColor: '#F6E27A', stopOpacity: 1 }} />
                <stop offset="80%" style={{ stopColor: '#CB9B51', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#462523', stopOpacity: 1 }} />
              </linearGradient>

              {/* TCM ring gradient - Rose gold */}
              <linearGradient id="tcmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4A1C17', stopOpacity: 1 }} />
                <stop offset="20%" style={{ stopColor: '#C77B58', stopOpacity: 1 }} />
                <stop offset="45%" style={{ stopColor: '#F4A460', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFD1B3', stopOpacity: 1 }} />
                <stop offset="55%" style={{ stopColor: '#F4A460', stopOpacity: 1 }} />
                <stop offset="80%" style={{ stopColor: '#C77B58', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#4A1C17', stopOpacity: 1 }} />
              </linearGradient>

              {/* Daily ring gradient - Silver */}
              <linearGradient id="dailyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#2B2B2B', stopOpacity: 1 }} />
                <stop offset="20%" style={{ stopColor: '#8C8C8C', stopOpacity: 1 }} />
                <stop offset="45%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#E8E8E8', stopOpacity: 1 }} />
                <stop offset="55%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
                <stop offset="80%" style={{ stopColor: '#8C8C8C', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2B2B2B', stopOpacity: 1 }} />
              </linearGradient>

              {/* Biorhythm ring gradient - Bronze */}
              <linearGradient id="biorhythmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3E2723', stopOpacity: 1 }} />
                <stop offset="20%" style={{ stopColor: '#8D6E63', stopOpacity: 1 }} />
                <stop offset="45%" style={{ stopColor: '#B8977E', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#D7CCC8', stopOpacity: 1 }} />
                <stop offset="55%" style={{ stopColor: '#B8977E', stopOpacity: 1 }} />
                <stop offset="80%" style={{ stopColor: '#8D6E63', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#3E2723', stopOpacity: 1 }} />
              </linearGradient>

              {/* Engraved pattern */}
              <pattern id="engravedPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M0 10 Q5 0, 10 10 T20 10"
                  fill="none"
                  stroke="#000"
                  strokeWidth="0.5"
                  opacity="0.1"
                />
              </pattern>

              {/* Glow effect */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Enhanced shadow */}
              <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                <feComposite in="SourceAlpha" in2="offsetBlur" operator="over"/>
                <feFlood floodColor="rgba(0,0,0,0.5)" result="color"/>
                <feComposite in="color" in2="SourceAlpha" operator="in" result="shadow"/>
                <feComposite in="shadow" in2="SourceGraphic" operator="over"/>
              </filter>

              {/* Radial texture */}
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: '#F6F2C0', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#CB9B51', stopOpacity: 0 }} />
              </radialGradient>
            </defs>
            
            {/* Background glow */}
            <circle
              cx="200"
              cy="200"
              r="195"
              fill="url(#centerGlow)"
              opacity="0.3"
            />
            
            {/* Outer frame */}
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="url(#engravedPattern)"
              stroke="url(#zodiacGradient)"
              strokeWidth="8"
              filter="url(#innerShadow)"
            />

            {/* Zodiac ring - Outermost */}
            <g className="zodiac-ring" style={{ opacity: visibleRings.zodiac ? 1 : 0 }}>
              <circle
                cx="200"
                cy="200"
                r="165"
                fill="url(#engravedPattern)"
                stroke="url(#zodiacGradient)"
                strokeWidth="35"
                opacity="0.7"
              />
              {ZODIAC_SIGNS.map((sign, index) => {
                const { x, y, angle } = calculatePosition(index, 12, 165);
                return (
                  <g key={sign.name} transform={`translate(${x},${y}) rotate(${angle})`}>
                    <text
                      className="zodiac-symbol cursor-pointer hover:opacity-80 transition-opacity"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="url(#zodiacGradient)"
                      fontSize="20"
                      fontFamily="serif"
                      fontWeight="bold"
                      filter="url(#glow)"
                      style={{ transform: `rotate(${-angle}deg)` }}
                    >
                      <title>{sign.name}</title>
                      {sign.symbol}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* TCM Ring */}
            <g className="tcm-ring" style={{ opacity: visibleRings.tcm ? 1 : 0 }}>
              <circle
                cx="200"
                cy="200"
                r="122"
                fill="url(#engravedPattern)"
                stroke="url(#tcmGradient)"
                strokeWidth="35"
                opacity="0.7"
              />
              <TcmRing radius={122} />
            </g>

            {/* Daily ring with Biorhythm */}
            <g className="daily-ring" style={{ opacity: visibleRings.daily ? 1 : 0 }}>
              <circle
                className="ring-hover"
                cx="200"
                cy="200"
                r="79"
                fill="url(#engravedPattern)"
                stroke="url(#dailyGradient)"
                strokeWidth="35"
                opacity="0.85"
              />
              <BiorhythmRing radius={79} birthDate={birthDate} />
            </g>

              {/* Ghati ring (innermost) */}
            <g style={{ opacity: visibleRings.biorhythm ? 1 : 0 }} className="ghati-ring">
              {/* Background circle */}
              <circle
                cx="200"
                cy="200"
                r="36"
                className="ring-hover"
                fill="url(#engravedPattern)"
                stroke="url(#biorhythmGradient)"
                strokeWidth="35"
                opacity="0.7"
              />
              
              {/* Grid lines */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 360) / 12;
                const radian = (angle * Math.PI) / 180;
                const innerX = 200 + 20 * Math.cos(radian);
                const innerY = 200 + 20 * Math.sin(radian);
                const outerX = 200 + 36 * Math.cos(radian);
                const outerY = 200 + 36 * Math.sin(radian);
                return (
                  <line
                    key={`grid-${i}`}
                    x1={innerX}
                    y1={innerY}
                    x2={outerX}
                    y2={outerY}
                    stroke="#F6F2C0"
                    strokeWidth="0.5"
                    opacity="0.2"
                  />
                );
              })}
              
              {/* Ghati numbers */}
              {Array.from({ length: 60 }, (_, i) => {
                const angle = (i * 360) / 60 - 90;
                const radian = (angle * Math.PI) / 180;
                const radius = i % 5 === 0 ? 34 : 36; // Major markers slightly inset
                const x = 200 + radius * Math.cos(radian);
                const y = 200 + radius * Math.sin(radian);
                return (
                  <g key={i} transform={`translate(${x},${y}) rotate(${angle})`}>
                    <text
                      className="ghati-marker cursor-pointer hover:opacity-80 transition-all duration-300"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="#F6F2C0"
                      fontSize={i % 5 === 0 ? "10" : "7"}
                      filter="url(#glow)"
                      style={{ transform: `rotate(${-angle}deg)` }}
                      opacity={i % 5 === 0 ? "0.9" : "0.6"}
                    >
                      <title>Ghati {i + 1} ({(i * 24).toString().padStart(2, '0')}:00 minutes)</title>
                      {(i + 1).toString().padStart(2, '0')}
                    </text>
                  </g>
                );
              })}
              
              {/* Current ghati indicator */}
              <circle
                cx="200"
                cy="164" // 200 - 36 (radius) to position at top
                r="2"
                fill="#F6F2C0"
                className="animate-pulse"
                filter="url(#glow)"
              />
            </g>

            {/* Center piece */}
            <g className="transform hover:scale-102 transition-transform">
              <circle
                cx="200"
                cy="200"
                r="25"
                fill="url(#zodiacGradient)"
                filter="url(#innerShadow)"
              />
              <circle
                cx="200"
                cy="200"
                r="5"
                fill="#F6F2C0"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </g>
          </svg>
        </div>

      </div>

      {/* Bottom menu */}
      <div className="flex items-center justify-center pb-2">
        <div className="flex items-center justify-center gap-3 py-2.5 px-5 glass-effect rounded-full shadow-lg">
          <button 
            onClick={() => setVisibleRings(prev => ({ ...prev, zodiac: !prev.zodiac }))}
            className="glass-button cursor-pointer hover:opacity-80 transition-opacity"
            title="Toggle Zodiac Ring - Shows your astrological influences"
          >
            {visibleRings.zodiac ? <SunIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5 opacity-40" />}
          </button>
          <button 
            onClick={() => setVisibleRings(prev => ({ ...prev, tcm: !prev.tcm }))}
            className="glass-button cursor-pointer hover:opacity-80 transition-opacity"
            title="Toggle TCM Ring - Traditional Chinese Medicine Elements"
          >
            {visibleRings.tcm ? <MoonIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5 opacity-40" />}
          </button>
          <button 
            onClick={() => setVisibleRings(prev => ({ ...prev, daily: !prev.daily }))}
            className="glass-button cursor-pointer hover:opacity-80 transition-opacity"
            title="Toggle Daily Ring - 24-hour Cycle"
          >
            {visibleRings.daily ? <ClockIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5 opacity-40" />}
          </button>
          <button 
            onClick={() => setVisibleRings(prev => ({ ...prev, biorhythm: !prev.biorhythm }))}
            className="glass-button cursor-pointer hover:opacity-80 transition-opacity"
            title="Toggle Biorhythm Ring - Your Physical, Emotional, and Intellectual Cycles"
          >
            {visibleRings.biorhythm ? <HeartIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5 opacity-40" />}
          </button>
          <div className="w-px h-4 bg-white/10" /> {/* Divider */}
          <button 
            className="glass-button cursor-pointer hover:opacity-80 transition-opacity"
            title="View Information and Settings"
            onClick={() => setShowCentralInfo(true)}
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend popup */}
      {showLegend && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 glass-effect p-4 rounded-xl shadow-2xl w-[280px] animate-in slide-up duration-200">
          <h3 className="font-medium mb-3 bg-gradient-to-r from-[#F6F2C0] to-[#CB9B51] bg-clip-text text-transparent">Legend</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-[#CB9B51]">○</span>
              <span className="text-white/90">Outer: Zodiac Signs</span>
              {currentZodiac && <span className="text-white/60 ml-auto">{currentZodiac}</span>}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#F4A460]">○</span>
              <span className="text-white/90">Upper Middle: TCM Elements</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C0C0C0]">○</span>
              <span className="text-white/90">Lower Middle: Daily Hours</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#FFD700]">○</span>
              <span className="text-white/90">Inner: Biorhythm</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlethiometerClock;
