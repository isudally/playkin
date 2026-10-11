import { seasonalThemes } from '../design-tokens/theme';

const creatorWave = seasonalThemes['creator-wave'];

export const webTheme = {
  colors: {
    background: creatorWave.colors.background,
    surface: creatorWave.colors.surface,
    surfaceRaised: '#292524',
    text: creatorWave.colors.text,
    muted: creatorWave.colors.muted,
    primary: creatorWave.colors.primary,
    secondary: creatorWave.colors.secondary,
    accent: creatorWave.colors.accent,
    border: 'rgba(250, 250, 249, 0.14)',
    success: '#34D399',
  },
  spacing: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 10, md: 16, lg: 24, pill: 999 },
  type: {
    display: 48,
    heading: 28,
    body: 16,
    small: 13,
  },
} as const;

export const temporaryAssetNote =
  'Temporary development artwork: final Dodo illustration and game assets are not yet approved.';
