import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const forestThemePreset = {
  name: 'Forest',
  nameZh: '青苔护眼',
  description: '低刺激鼠尾草绿、柔和圆角与暖灰表面，适合日常记录和长时间浏览。',
  config: {
    mode: 'system',
    primary: '#4E6B50',
    source: {
      primary: '#4E6B50',
      secondary: '#5D6F5B',
      tertiary: '#6C6550',
      neutral: '#70766D',
      neutralVariant: '#6C756A',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.rounded.global),
      baseSize: 16,
      lineHeight: 1.72,
    },
    shape: {
      radiusXs: '8px',
      radiusSm: '12px',
      radiusMd: '16px',
      radiusLg: '22px',
      radiusXl: '28px',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: '0 3px 12px -9px rgba(var(--md-sys-color-shadow-rgb), 0.24)',
      shadowMd: '0 16px 42px -34px rgba(var(--md-sys-color-shadow-rgb), 0.32)',
      shadowLg: '0 24px 64px -46px rgba(var(--md-sys-color-shadow-rgb), 0.4)',
    },
    background: {
      type: 'gradient',
      decoration: 'paper',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.7 },
      gradient: { useMD3Colors: true, direction: '145deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'spring',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: true, summer: true, autumn: false, winter: false },
      },
    },
  },
} satisfies ThemePresetDefinition;
