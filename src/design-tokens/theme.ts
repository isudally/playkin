/**
 * GameForge Design Tokens
 * A unified design system for the forge aesthetic
 */
import { Platform } from 'react-native';

// Base unit: 4px
const BASE_UNIT = 4;

export const spacing = {
  xxs: BASE_UNIT,      // 4
  xs: BASE_UNIT * 2,   // 8
  sm: BASE_UNIT * 3,   // 12
  md: BASE_UNIT * 4,   // 16
  lg: BASE_UNIT * 6,   // 24
  xl: BASE_UNIT * 8,   // 32
  xxl: BASE_UNIT * 10, // 40
  xxxl: BASE_UNIT * 12, // 48
} as const;

export const typography = {
  // Font families — platform system stacks.
  // 25 call sites across EmojiPicker, RouletteWheel, StyleCarousel,
  // GiftCreationScreen and BrandingStudioScreen read typography.fontFamily.*
  fontFamily: Platform.select({
    ios: { regular: 'System', medium: 'System', bold: 'System' },
    android: {
      regular: 'sans-serif',
      medium: 'sans-serif-medium',
      bold: 'sans-serif',
    },
    default: {
      regular: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      medium: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      bold: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
  }) as { regular: string; medium: string; bold: string },
  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 32,
    display: 40,
  },
  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const shadows = {
  // For light mode
  light: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },
  // Forge glow shadows for dark mode
  forge: {
    sm: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    }),
    md: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 4,
    }),
    lg: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 8,
    }),
  },
} as const;

export const motion = {
  // Durations
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    glacial: 1000,
  },
  // Easing curves (for Reanimated)
  easing: {
    // Standard easing
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Bounce for playful interactions
    bounce: { damping: 12, stiffness: 180 },
    // Gentle spring for subtle movements
    gentle: { damping: 20, stiffness: 100 },
    // Snappy for quick responses
    snappy: { damping: 15, stiffness: 300 },
  },
} as const;

// Forge color palettes
export const forgeColors = {
  // Core brand
  ember: {
    50: '#FFF5F0',
    100: '#FFE8DC',
    200: '#FFD0B8',
    300: '#FFB088',
    400: '#FF8C57',
    500: '#FF6B2C', // Primary ember
    600: '#E85A1F',
    700: '#C44A19',
    800: '#9C3B14',
    900: '#7A2F10',
  },
  forge: {
    50: '#F0F4FF',
    100: '#E0E8FF',
    200: '#C7D4FF',
    300: '#A3B8FF',
    400: '#7A94FF',
    500: '#6366F1', // Primary forge purple
    600: '#5855E0',
    700: '#4A45C7',
    800: '#3C379E',
    900: '#302C7A',
  },
  spark: {
    50: '#FFF0F6',
    100: '#FFE0EB',
    200: '#FFC2D9',
    300: '#FF9BBF',
    400: '#FF6BA3',
    500: '#EC4899', // Spark pink
    600: '#D63B87',
    700: '#B32D6F',
    800: '#8F2459',
    900: '#701D46',
  },
  moss: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Success green
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Warning gold
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  // Neutrals with warm undertones
  stone: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
    950: '#0C0A09',
  },
} as const;

// Emotional color shifts for different creation contexts
export const emotionalPalettes = {
  celebration: {
    primary: '#FF6B2C',
    secondary: '#FFD700',
    accent: '#FF69B4',
    gradient: ['#FF6B2C', '#FF8C57', '#FFD700'],
  },
  romance: {
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#FFC2D9',
    gradient: ['#EC4899', '#F472B6', '#FFC2D9'],
  },
  adventure: {
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#34D399',
    gradient: ['#6366F1', '#818CF8', '#34D399'],
  },
  calm: {
    primary: '#10B981',
    secondary: '#6EE7B7',
    accent: '#A7F3D0',
    gradient: ['#10B981', '#6EE7B7', '#A7F3D0'],
  },
  playful: {
    primary: '#FBBF24',
    secondary: '#FCD34D',
    accent: '#FF8C57',
    gradient: ['#FBBF24', '#FF8C57', '#EC4899'],
  },
} as const;

// Time-based gradient presets
export const timeGradients = {
  dawn: ['#FF9A8B', '#FF6B6B', '#FF8E53'],
  morning: ['#A8EDEA', '#FED6E3', '#FFECD2'],
  afternoon: ['#667EEA', '#764BA2', '#F093FB'],
  evening: ['#FA709A', '#FEE140', '#FA709A'],
  night: ['#1A1A2E', '#16213E', '#0F3460'],
  midnight: ['#0C0A09', '#1C1917', '#292524'],
} as const;

// UAE Seasonal Themes - Auto-applied based on date
export interface SeasonalTheme {
  id: string;
  name: string;
  mood: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    glow: string;
  };
  gradient: string[];
  heroGlow: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

export const seasonalThemes: Record<string, SeasonalTheme> = {
  'winter-majlis': {
    id: 'winter-majlis',
    name: 'Winter Majlis',
    mood: 'Cozy gatherings, intimate luxury, warmth against cool evenings',
    colors: {
      primary: '#6B2D5B',     // Deep Burgundy
      secondary: '#1A5F4A',   // Forest Emerald
      accent: '#D4AF37',      // Arabic Gold
      background: '#1C1820',  // Warm Charcoal
      surface: '#2A2530',     // Soft Plum Black
      text: '#F5EDE6',        // Warm Cream
      muted: '#9A8F94',       // Dusty Mauve
      glow: '#D4AF37',        // Gold glow
    },
    gradient: ['#2A2530', '#1C1820', '#1A1A2E'],
    heroGlow: '#D4AF37',
    animationSpeed: 'slow',
  },
  'nocturnal-revival': {
    id: 'nocturnal-revival',
    name: 'Nocturnal Revival',
    mood: 'Calm energy, spiritual warmth, late-night creativity',
    colors: {
      primary: '#4A3F6B',     // Midnight Purple
      secondary: '#F4B942',   // Lantern Gold
      accent: '#7FDBDA',      // Moonlight Teal
      background: '#0D0D1A',  // Deep Night
      surface: '#1A1A2E',     // Night Sky
      text: '#F5F5F5',        // Moonlight White
      muted: '#7A7A8C',       // Dusk Grey
      glow: '#F4B942',        // Lantern glow
    },
    gradient: ['#1A1A2E', '#0D0D1A', '#0A0A14'],
    heroGlow: '#F4B942',
    animationSpeed: 'slow',
  },
  'golden-reunion': {
    id: 'golden-reunion',
    name: 'Golden Reunion',
    mood: 'Celebration, reunion, premium joy, optimism',
    colors: {
      primary: '#D4AF37',     // Pure Gold
      secondary: '#FFFFFF',   // Clean White
      accent: '#E8C4A2',      // Soft Peach
      background: '#FFFEF5',  // Warm White
      surface: '#FFF8E7',     // Cream
      text: '#2C2416',        // Rich Brown
      muted: '#A89F8F',       // Warm Grey
      glow: '#D4AF37',        // Gold glow
    },
    gradient: ['#FFF8E7', '#FFFEF5', '#FFFFFF'],
    heroGlow: '#D4AF37',
    animationSpeed: 'normal',
  },
  'neon-dubai-summer': {
    id: 'neon-dubai-summer',
    name: 'Neon Dubai Summer',
    mood: 'Bold nightlife, poolside energy, unapologetic glamour',
    colors: {
      primary: '#00FFFF',     // Electric Cyan
      secondary: '#FF00FF',   // Hot Magenta
      accent: '#FFFF00',      // Neon Yellow
      background: '#0A0A0F',  // Deep Black
      surface: '#15151F',     // Charcoal
      text: '#FFFFFF',        // Pure White
      muted: '#6B6B7B',       // Cool Grey
      glow: '#00FFFF',        // Cyan glow
    },
    gradient: ['#15151F', '#0A0A0F', '#050508'],
    heroGlow: '#00FFFF',
    animationSpeed: 'fast',
  },
  'uae-pride': {
    id: 'uae-pride',
    name: 'UAE Pride',
    mood: 'Patriotic, unified, proud, hopeful',
    colors: {
      primary: '#FF0000',     // UAE Red
      secondary: '#00732F',   // UAE Green
      accent: '#FFFFFF',      // Pure White
      background: '#111111',  // UAE Black
      surface: '#1A1A1A',     // Soft Black
      text: '#FFFFFF',        // White
      muted: '#888888',       // Grey
      glow: '#FF0000',        // Red glow
    },
    gradient: ['#1A1A1A', '#111111', '#0A0A0A'],
    heroGlow: '#FF0000',
    animationSpeed: 'normal',
  },
  'creator-wave': {
    id: 'creator-wave',
    name: 'Creator Wave',
    mood: 'Aspirational, creative, maximalist luxury',
    colors: {
      primary: '#6366F1',     // Forge Purple
      secondary: '#EC4899',   // Spark Pink
      accent: '#F59E0B',      // Creator Gold
      background: '#0C0A09',  // Warm Black
      surface: '#1C1917',     // Stone
      text: '#FAFAF9',        // Cream
      muted: '#78716C',       // Stone Grey
      glow: '#6366F1',        // Purple glow
    },
    gradient: ['#1C1917', '#0C0A09', '#0A0908'],
    heroGlow: '#6366F1',
    animationSpeed: 'normal',
  },
  'eternal-romance': {
    id: 'eternal-romance',
    name: 'Eternal Romance',
    mood: 'Deep passion, sophisticated love, timeless elegance',
    colors: {
      primary: '#8B0A1A',     // Deep Rose
      secondary: '#D4AF37',   // Champagne Gold
      accent: '#FFB6C1',      // Soft Blush
      background: '#0F0508',  // Midnight Rose
      surface: '#1A0C10',     // Dark Velvet
      text: '#FFF5F5',        // Rose White
      muted: '#8A6B70',       // Dusty Rose
      glow: '#FF4D6D',        // Rose Glow
    },
    gradient: ['#1A0C10', '#0F0508', '#080204'],
    heroGlow: '#FF4D6D',
    animationSpeed: 'slow',
  },
} as const;

// Islamic calendar dates by year (approximate Gregorian equivalents)
// These shift ~11 days earlier each year due to lunar calendar
interface IslamicDates {
  ramadanStart: { month: number; day: number };
  ramadanEnd: { month: number; day: number };
  eidFitrStart: { month: number; day: number };
  eidFitrEnd: { month: number; day: number };
  eidAdhaStart: { month: number; day: number };
  eidAdhaEnd: { month: number; day: number };
}

const islamicDatesByYear: Record<number, IslamicDates> = {
  2025: {
    ramadanStart: { month: 3, day: 1 },
    ramadanEnd: { month: 3, day: 29 },
    eidFitrStart: { month: 3, day: 30 },
    eidFitrEnd: { month: 4, day: 3 },
    eidAdhaStart: { month: 6, day: 6 },
    eidAdhaEnd: { month: 6, day: 10 },
  },
  2026: {
    ramadanStart: { month: 2, day: 18 },
    ramadanEnd: { month: 3, day: 19 },
    eidFitrStart: { month: 3, day: 20 },
    eidFitrEnd: { month: 3, day: 25 },
    eidAdhaStart: { month: 5, day: 27 },
    eidAdhaEnd: { month: 5, day: 31 },
  },
  2027: {
    ramadanStart: { month: 2, day: 8 },
    ramadanEnd: { month: 3, day: 8 },
    eidFitrStart: { month: 3, day: 9 },
    eidFitrEnd: { month: 3, day: 13 },
    eidAdhaStart: { month: 5, day: 16 },
    eidAdhaEnd: { month: 5, day: 20 },
  },
  2028: {
    ramadanStart: { month: 1, day: 28 },
    ramadanEnd: { month: 2, day: 25 },
    eidFitrStart: { month: 2, day: 26 },
    eidFitrEnd: { month: 3, day: 1 },
    eidAdhaStart: { month: 5, day: 5 },
    eidAdhaEnd: { month: 5, day: 9 },
  },
  2029: {
    ramadanStart: { month: 1, day: 16 },
    ramadanEnd: { month: 2, day: 13 },
    eidFitrStart: { month: 2, day: 14 },
    eidFitrEnd: { month: 2, day: 18 },
    eidAdhaStart: { month: 4, day: 24 },
    eidAdhaEnd: { month: 4, day: 28 },
  },
  2030: {
    ramadanStart: { month: 1, day: 5 },
    ramadanEnd: { month: 2, day: 2 },
    eidFitrStart: { month: 2, day: 3 },
    eidFitrEnd: { month: 2, day: 7 },
    eidAdhaStart: { month: 4, day: 13 },
    eidAdhaEnd: { month: 4, day: 17 },
  },
};

// Helper to check if date is within range (handles month boundaries)
function isDateInRange(
  month: number,
  day: number,
  start: { month: number; day: number },
  end: { month: number; day: number }
): boolean {
  const current = month * 100 + day;
  const startVal = start.month * 100 + start.day;
  const endVal = end.month * 100 + end.day;
  return current >= startVal && current <= endVal;
}

// Get the currently active seasonal theme based on date
export function getActiveSeasonalTheme(overrideTheme?: string): SeasonalTheme {
  // Allow manual override for user-selected themes
  if (overrideTheme && seasonalThemes[overrideTheme]) {
    return seasonalThemes[overrideTheme];
  }
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  
  // Get Islamic dates for current year (fallback to 2026 if not found)
  const islamicDates = islamicDatesByYear[year] || islamicDatesByYear[2026];

  // Valentine's Day: Feb 1-14 (prioritized for 2 weeks lead-up)
  if (month === 2 && day >= 1 && day <= 14) {
    return seasonalThemes['eternal-romance'];
  }

  // Ramadan (dynamic based on year)
  if (isDateInRange(month, day, islamicDates.ramadanStart, islamicDates.ramadanEnd)) {
    return seasonalThemes['nocturnal-revival'];
  }

  // Eid al-Fitr (dynamic based on year)
  if (isDateInRange(month, day, islamicDates.eidFitrStart, islamicDates.eidFitrEnd)) {
    return seasonalThemes['golden-reunion'];
  }

  // Eid al-Adha (dynamic based on year)
  if (isDateInRange(month, day, islamicDates.eidAdhaStart, islamicDates.eidAdhaEnd)) {
    return seasonalThemes['golden-reunion'];
  }

  // UAE National Day: Nov 30 - Dec 3
  if ((month === 11 && day >= 30) || (month === 12 && day <= 3)) {
    return seasonalThemes['uae-pride'];
  }

  // Winter: November - February (excluding Valentine's period)
  if (month >= 11 || month <= 2) {
    return seasonalThemes['winter-majlis'];
  }

  // Summer: June - August
  if (month >= 6 && month <= 8) {
    return seasonalThemes['neon-dubai-summer'];
  }

  // Default: Creator Wave
  return seasonalThemes['creator-wave'];
}

export type EmotionalState = keyof typeof emotionalPalettes;
export type TimeOfDay = keyof typeof timeGradients;
export type SeasonalThemeId = keyof typeof seasonalThemes;
