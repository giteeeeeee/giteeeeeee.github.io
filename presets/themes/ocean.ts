import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const oceanThemePreset = {
  name: 'Ocean',
  nameZh: '海岸晴空',
  description: '海蓝、青绿、沙白与日光水纹构成的清爽海岸风格，适合摄影与旅行记录。',
  config: {
    mode: 'system',
    primary: '#176C82',
    source: {
      primary: '#176C82',
      secondary: '#42756F',
      tertiary: '#9A6A3E',
      neutral: '#707677',
      neutralVariant: '#697779',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.rounded.global),
      baseSize: 15,
      lineHeight: 1.68,
    },
    shape: {
      radiusXs: '8px',
      radiusSm: '12px',
      radiusMd: '17px',
      radiusLg: '24px',
      radiusXl: '30px',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: '0 8px 24px -20px rgba(var(--md-sys-color-primary-rgb), 0.3)',
      shadowMd: '0 18px 46px -34px rgba(var(--md-sys-color-primary-rgb), 0.38)',
      shadowLg: '0 30px 72px -48px rgba(var(--md-sys-color-tertiary-rgb), 0.4)',
    },
    background: {
      type: 'gradient',
      decoration: 'ocean',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.78 },
      gradient: { useMD3Colors: true, direction: '180deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'summer',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: false, summer: true, autumn: false, winter: false },
      },
    },
  },
} satisfies ThemePresetDefinition;
