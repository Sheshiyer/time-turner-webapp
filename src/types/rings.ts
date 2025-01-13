export interface Ring {
  id: string;
  name: string;
  type: 'zodiac' | 'tcm' | 'biorhythm' | 'daily' | 'lunar' | 'seasonal' | 'planetary';
  radius: number;
  gradient: {
    colors: string[];
    opacity: number;
  };
  icon: 'sun' | 'moon' | 'clock' | 'heart' | 'star' | 'leaf' | 'planet';
}

export interface RingSystem {
  rings: Ring[];
  spacing: number; // Space between rings
  maxRadius: number; // Outer radius
  minRadius: number; // Inner radius
}

// Default configuration for the current rings
export const DEFAULT_RINGS: Ring[] = [
  {
    id: 'zodiac',
    name: 'Zodiac Signs',
    type: 'zodiac',
    radius: 170,
    gradient: {
      colors: ['#462523', '#CB9B51', '#F6E27A', '#F6F2C0'],
      opacity: 0.7
    },
    icon: 'sun'
  },
  {
    id: 'tcm',
    name: 'TCM Elements',
    type: 'tcm',
    radius: 130,
    gradient: {
      colors: ['#4A1C17', '#C77B58', '#F4A460', '#FFD1B3'],
      opacity: 0.7
    },
    icon: 'moon'
  },
  {
    id: 'daily',
    name: 'Daily Hours',
    type: 'daily',
    radius: 90,
    gradient: {
      colors: ['#2B2B2B', '#8C8C8C', '#C0C0C0', '#E8E8E8'],
      opacity: 0.85
    },
    icon: 'clock'
  },
  {
    id: 'biorhythm',
    name: 'Biorhythm',
    type: 'biorhythm',
    radius: 50,
    gradient: {
      colors: ['#3E2723', '#8D6E63', '#B8977E', '#D7CCC8'],
      opacity: 0.7
    },
    icon: 'heart'
  }
];

// Example configurations for future rings
export const ADDITIONAL_RINGS: Ring[] = [
  {
    id: 'lunar',
    name: 'Lunar Phases',
    type: 'lunar',
    radius: 210,
    gradient: {
      colors: ['#1A237E', '#3949AB', '#5C6BC0', '#7986CB'],
      opacity: 0.7
    },
    icon: 'moon'
  },
  {
    id: 'seasonal',
    name: 'Seasonal Cycles',
    type: 'seasonal',
    radius: 250,
    gradient: {
      colors: ['#1B5E20', '#388E3C', '#4CAF50', '#81C784'],
      opacity: 0.7
    },
    icon: 'leaf'
  },
  {
    id: 'planetary',
    name: 'Planetary Hours',
    type: 'planetary',
    radius: 290,
    gradient: {
      colors: ['#311B92', '#512DA8', '#673AB7', '#9575CD'],
      opacity: 0.7
    },
    icon: 'planet'
  }
];

// Helper function to calculate ring positions
export const calculateRingPositions = (rings: Ring[], containerSize: number = 400) => {
  const center = containerSize / 2;
  const maxRadius = (containerSize / 2) * 0.85; // Leave some margin
  const minRadius = maxRadius * 0.15; // Center area
  const availableSpace = maxRadius - minRadius;
  const spacing = availableSpace / (rings.length + 1);

  return rings.map((ring, index) => ({
    ...ring,
    radius: maxRadius - (spacing * (index + 1))
  }));
};
