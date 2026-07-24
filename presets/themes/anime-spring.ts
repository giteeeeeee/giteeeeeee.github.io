import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const animeSpringThemePreset = {
  name: 'Anime Spring',
  nameZh: '春日动画',
  description: '晴空蓝、樱花粉与柔暖日光组成的原创春日动画色彩，轻快而不甜腻。',
  config: {
    mode: 'system',
    primary: '#4D72B8',
    source: {
      primary: '#4D72B8',
      secondary: '#A95F7D',
      tertiary: '#A87322',
      neutral: '#77747A',
      neutralVariant: '#77727D',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.rounded.global),
      baseSize: 15,
      lineHeight: 1.68,
    },
    shape: {
      radiusXs: '10px',
      radiusSm: '14px',
      radiusMd: '19px',
      radiusLg: '26px',
      radiusXl: '34px',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: '0 8px 22px -18px rgba(var(--md-sys-color-primary-rgb), 0.32)',
      shadowMd: '0 18px 44px -32px rgba(var(--md-sys-color-primary-rgb), 0.38)',
      shadowLg: '0 32px 76px -48px rgba(var(--md-sys-color-tertiary-rgb), 0.42)',
    },
    background: {
      type: 'gradient',
      decoration: 'anime-spring',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.76 },
      gradient: { useMD3Colors: true, direction: '180deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'spring',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: true, summer: false, autumn: false, winter: false },
      },
    },
  },
} satisfies ThemePresetDefinition;
