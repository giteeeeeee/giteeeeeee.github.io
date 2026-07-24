import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const inkwashThemePreset = {
  name: 'Ink Landscape',
  nameZh: '水墨江湖',
  description: '烟青灰墨、朱砂点题与宣纸山岚，适合随笔、游记和东方叙事。',
  config: {
    mode: 'system',
    primary: '#3F5650',
    source: {
      primary: '#3F5650',
      secondary: '#626B64',
      tertiary: '#9B4438',
      neutral: '#73736E',
      neutralVariant: '#6C756F',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.paper.global, {
        navigation: fontStacks.rounded.global,
        metadata: fontStacks.rounded.global,
      }),
      baseSize: 16,
      lineHeight: 1.8,
    },
    shape: {
      radiusXs: '1px',
      radiusSm: '4px',
      radiusMd: '8px',
      radiusLg: '13px',
      radiusXl: '18px',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: '0 2px 8px -6px rgba(var(--md-sys-color-shadow-rgb), 0.2)',
      shadowMd: '0 14px 34px -30px rgba(var(--md-sys-color-shadow-rgb), 0.34)',
      shadowLg: '0 24px 56px -42px rgba(var(--md-sys-color-shadow-rgb), 0.4)',
    },
    background: {
      type: 'gradient',
      decoration: 'inkwash',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.78 },
      gradient: { useMD3Colors: true, direction: '178deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'autumn',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: false, summer: false, autumn: true, winter: false },
      },
    },
  },
} satisfies ThemePresetDefinition;
