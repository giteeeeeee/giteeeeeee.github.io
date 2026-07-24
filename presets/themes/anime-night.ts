import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const animeNightThemePreset = {
  name: 'Anime Night',
  nameZh: '动画夜城',
  description: '靛蓝夜空、霓虹青粉与城市剪影构成的原创动画夜景，明暗模式都保持清晰。',
  config: {
    mode: 'dark',
    primary: '#5968C7',
    source: {
      primary: '#5968C7',
      secondary: '#A35491',
      tertiary: '#247F94',
      neutral: '#74737B',
      neutralVariant: '#737280',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.rounded.global),
      baseSize: 15,
      lineHeight: 1.66,
    },
    shape: {
      radiusXs: '8px',
      radiusSm: '12px',
      radiusMd: '17px',
      radiusLg: '24px',
      radiusXl: '32px',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: '0 10px 28px -22px rgba(var(--md-sys-color-primary-rgb), 0.44)',
      shadowMd: '0 20px 52px -34px rgba(var(--md-sys-color-tertiary-rgb), 0.48)',
      shadowLg: '0 34px 86px -50px rgba(var(--md-sys-color-secondary-rgb), 0.5)',
    },
    background: {
      type: 'gradient',
      decoration: 'anime-night',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.8 },
      gradient: { useMD3Colors: true, direction: '165deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'winter',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: false, summer: false, autumn: false, winter: true },
      },
    },
  },
} satisfies ThemePresetDefinition;
