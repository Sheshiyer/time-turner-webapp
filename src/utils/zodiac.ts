export interface ZodiacInfo {
  sign: string;
  element: string;
  quality: string;
}

const ZODIAC_SIGNS: { [key: string]: ZodiacInfo } = {
  'Aries': { sign: 'Aries', element: 'Fire', quality: 'Cardinal' },
  'Taurus': { sign: 'Taurus', element: 'Earth', quality: 'Fixed' },
  'Gemini': { sign: 'Gemini', element: 'Air', quality: 'Mutable' },
  'Cancer': { sign: 'Cancer', element: 'Water', quality: 'Cardinal' },
  'Leo': { sign: 'Leo', element: 'Fire', quality: 'Fixed' },
  'Virgo': { sign: 'Virgo', element: 'Earth', quality: 'Mutable' },
  'Libra': { sign: 'Libra', element: 'Air', quality: 'Cardinal' },
  'Scorpio': { sign: 'Scorpio', element: 'Water', quality: 'Fixed' },
  'Sagittarius': { sign: 'Sagittarius', element: 'Fire', quality: 'Mutable' },
  'Capricorn': { sign: 'Capricorn', element: 'Earth', quality: 'Cardinal' },
  'Aquarius': { sign: 'Aquarius', element: 'Air', quality: 'Fixed' },
  'Pisces': { sign: 'Pisces', element: 'Water', quality: 'Mutable' }
};

const ZODIAC_DATES = [
  { sign: 'Capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { sign: 'Aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { sign: 'Pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
  { sign: 'Aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { sign: 'Taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { sign: 'Gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { sign: 'Cancer', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { sign: 'Leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { sign: 'Virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { sign: 'Libra', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { sign: 'Scorpio', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { sign: 'Sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
];

export function getZodiacInfo(date: Date): ZodiacInfo {
  const month = date.getMonth() + 1; // JavaScript months are 0-based
  const day = date.getDate();
  
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

  const zodiacDate = ZODIAC_DATES.find(z => 
    isDateInRange(month, day, z.start, z.end)
  );

  return ZODIAC_SIGNS[zodiacDate?.sign || 'Capricorn'];
}

export function getCurrentZodiacInfo(): ZodiacInfo {
  return getZodiacInfo(new Date());
}

export function getZodiacSymbol(sign: string): string {
  const symbols: { [key: string]: string } = {
    'Aries': '♈',
    'Taurus': '♉',
    'Gemini': '♊',
    'Cancer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Scorpio': '♏',
    'Sagittarius': '♐',
    'Capricorn': '♑',
    'Aquarius': '♒',
    'Pisces': '♓'
  };
  return symbols[sign] || '';
}

export function getElementColor(element: string): string {
  const colors: { [key: string]: string } = {
    'Fire': '#FF4D4D',
    'Earth': '#8B4513',
    'Air': '#87CEEB',
    'Water': '#4169E1'
  };
  return colors[element] || '#FFFFFF';
}

export function getZodiacDescription(sign: string): string {
  const descriptions: { [key: string]: string } = {
    'Aries': 'Dynamic, energetic, and pioneering',
    'Taurus': 'Stable, practical, and determined',
    'Gemini': 'Versatile, expressive, and curious',
    'Cancer': 'Nurturing, intuitive, and protective',
    'Leo': 'Confident, dramatic, and generous',
    'Virgo': 'Analytical, practical, and diligent',
    'Libra': 'Harmonious, diplomatic, and fair',
    'Scorpio': 'Intense, passionate, and transformative',
    'Sagittarius': 'Adventurous, optimistic, and philosophical',
    'Capricorn': 'Ambitious, disciplined, and patient',
    'Aquarius': 'Progressive, original, and humanitarian',
    'Pisces': 'Compassionate, artistic, and intuitive'
  };
  return descriptions[sign] || '';
}
