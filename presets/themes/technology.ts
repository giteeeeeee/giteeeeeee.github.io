import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const technologyThemePreset = {
  name: 'Technology',
  nameZh: '科技流光',
  description: '高明度青蓝主色、圆润字体、柔和光晕与轻量网格，保留项目默认视觉。',
  config: {
    mode: 'system',
    primary: '#00EEFF',
    source: {
      primary: '#00EEFF',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.rounded.global),
      baseSize: 15,
      lineHeight: 1.6,
    },
    shape: {
      radiusXs: '0.6rem',
      radiusSm: '0.86rem',
      radiusMd: '1.08rem',
      radiusLg: '1.48rem',
      radiusXl: '1.86rem',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: '0 12px 30px -24px rgba(var(--md-sys-color-shadow-rgb), 0.5), inset 0 1px 0 rgba(var(--md-sys-color-surface-bright-rgb), 0.28)',
      shadowMd: '0 16px 42px -34px rgba(var(--md-sys-color-shadow-rgb), 0.42), 0 7px 18px -18px rgba(var(--md-sys-color-primary-rgb), 0.18)',
      shadowLg: '0 30px 82px -52px rgba(var(--md-sys-color-primary-rgb), 0.62), 0 14px 34px -26px rgba(var(--md-sys-color-shadow-rgb), 0.46)',
    },
    background: {
      type: 'gradient',
      decoration: 'aurora',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.6 },
      gradient: { useMD3Colors: true, direction: '135deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'auto',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: true, summer: true, autumn: true, winter: true },
      },
    },
  },
} satisfies ThemePresetDefinition;
