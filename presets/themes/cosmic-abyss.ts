import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const cosmicAbyssThemePreset = {
  name: 'Cosmic Abyss',
  nameZh: '星渊银河',
  description: '深空蓝紫、银河尘带、星野与黑洞吸积盘构成的沉浸式宇宙主题。',
  config: {
    mode: 'dark',
    primary: '#7786FF',
    source: {
      primary: '#7786FF',
      secondary: '#B76CF0',
      tertiary: '#35BFD5',
      neutral: '#74727F',
      neutralVariant: '#706D82',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.rounded.global),
      baseSize: 15,
      lineHeight: 1.66,
    },
    shape: {
      radiusXs: '8px',
      radiusSm: '13px',
      radiusMd: '19px',
      radiusLg: '27px',
      radiusXl: '36px',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: '0 10px 30px -22px rgba(var(--md-sys-color-primary-rgb), 0.48)',
      shadowMd: '0 22px 58px -34px rgba(var(--md-sys-color-secondary-rgb), 0.54)',
      shadowLg: '0 38px 96px -48px rgba(var(--md-sys-color-tertiary-rgb), 0.52)',
    },
    background: {
      type: 'gradient',
      decoration: 'cosmic-abyss',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.9 },
      gradient: { useMD3Colors: true, direction: '155deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'winter',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: false, summer: false, autumn: false, winter: false },
      },
    },
  },
} satisfies ThemePresetDefinition;
