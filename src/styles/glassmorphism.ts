/**
 * Glassmorphism Style Utilities
 * Premium glass effect without expo-blur dependency
 * Works across web and mobile
 */

import { ViewStyle, Platform } from 'react-native';

export type GlassTheme = 'light' | 'dark' | 'valentine' | 'ramadan';

interface GlassConfig {
  background: string;
  borderColor: string;
  shadow: string;
  backdropFilter?: string; // Web only
}

/**
 * Theme-specific glass configurations
 */
const GLASS_CONFIGS: Record<GlassTheme, GlassConfig> = {
  light: {
    background: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadow: '0px 8px 32px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(6px)',
  },
  dark: {
    background: 'rgba(20, 20, 50, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(6px)',
  },
  valentine: {
    background: 'rgba(196, 30, 58, 0.15)',
    borderColor: 'rgba(255, 182, 193, 0.25)',
    shadow: '0px 8px 32px rgba(196, 30, 58, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  ramadan: {
    background: 'rgba(13, 27, 42, 0.18)',
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadow: '0px 8px 32px rgba(212, 175, 55, 0.15)',
    backdropFilter: 'blur(6px)',
  },
};

/**
 * Generate glass effect styles
 * @param theme - Theme variant (light, dark, valentine, ramadan)
 * @param radius - Border radius (default: 20)
 * @param intense - Whether to use intense shimmer (gated by feature flag)
 */
export const createGlassStyle = (
  theme: GlassTheme = 'light',
  radius: number = 20,
  intense: boolean = false
): ViewStyle => {
  const config = GLASS_CONFIGS[theme];
  
  const baseStyle: ViewStyle = {
    backgroundColor: config.background,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: config.borderColor,
    overflow: 'hidden',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8, // Android shadow
  };

  // Add backdrop filter for web
  if (Platform.OS === 'web') {
    return {
      ...baseStyle,
      backdropFilter: config.backdropFilter,
      WebkitBackdropFilter: config.backdropFilter, // Safari support
    } as ViewStyle;
  }

  return baseStyle;
};

/**
 * Glass card style for wizard steps
 */
export const glassCard = (theme: GlassTheme = 'light'): ViewStyle => 
  createGlassStyle(theme, 20, false);

/**
 * Glass panel style for larger surfaces
 */
export const glassPanel = (theme: GlassTheme = 'light'): ViewStyle => 
  createGlassStyle(theme, 24, false);

/**
 * Glass button style for CTAs
 */
export const glassButton = (theme: GlassTheme = 'light'): ViewStyle => ({
  ...createGlassStyle(theme, 16, false),
  paddingVertical: 16,
  paddingHorizontal: 24,
});

/**
 * Inner glow overlay (optional enhancement)
 * Use only when PlayGiftConsumerMode is true
 */
export const glassInnerGlow = (theme: GlassTheme = 'light'): ViewStyle => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '30%',
  backgroundColor: 
    theme === 'valentine' 
      ? 'rgba(255, 182, 193, 0.1)'
      : theme === 'ramadan'
      ? 'rgba(212, 175, 55, 0.08)'
      : 'rgba(255, 255, 255, 0.05)',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
});

/**
 * Shimmer gradient colors for animated effects (heavy - gate behind flag)
 */
export const getShimmerColors = (theme: GlassTheme): string[] => {
  switch (theme) {
    case 'valentine':
      return ['rgba(196, 30, 58, 0)', 'rgba(255, 182, 193, 0.2)', 'rgba(196, 30, 58, 0)'];
    case 'ramadan':
      return ['rgba(212, 175, 55, 0)', 'rgba(244, 164, 96, 0.2)', 'rgba(212, 175, 55, 0)'];
    case 'dark':
      return ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0)'];
    default:
      return ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0)'];
  }
};
