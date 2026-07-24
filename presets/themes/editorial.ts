import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const editorialThemePreset = {
  name: 'Editorial',
  nameZh: '朱砂刊物',
  description: '朱砂红点题、衬线标题与利落边界，接近独立杂志和作品集的编辑气质。',
  config: {
    mode: 'system',
    primary: '#8B2635',
    source: {
      primary: '#8B2635',
      secondary: '#76565A',
      tertiary: '#805532',
      neutral: '#777171',
      neutralVariant: '#7D6D70',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.clean.global, {
        brand: fontStacks.paper.global,
        heading: fontStacks.paper.global,
        prose: fontStacks.paper.global,
        proseHeading: fontStacks.paper.global,
      }),
      baseSize: 15,
      lineHeight: 1.68,
    },
    shape: {
      radiusXs: '0',
      radiusSm: '2px',
      radiusMd: '5px',
      radiusLg: '8px',
      radiusXl: '12px',
      radiusPill: '4px',
      borderWidth: '1px',
      shadowSm: '0 2px 0 rgba(var(--md-sys-color-shadow-rgb), 0.08)',
      shadowMd: '0 12px 28px -24px rgba(var(--md-sys-color-shadow-rgb), 0.32)',
      shadowLg: '0 20px 42px -34px rgba(var(--md-sys-color-shadow-rgb), 0.42)',
    },
    background: {
      type: 'gradient',
      decoration: 'plain',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.72 },
      gradient: { useMD3Colors: true, direction: '165deg' },
    },
    effects: {
      homeWave: { enabled: false, intensity: 'low' },
      seasonal: {
        enabled: false,
        season: 'auto',
        density: 'low',
        showOnMobile: false,
        respectReducedMotion: true,
        seasons: { spring: false, summer: false, autumn: false, winter: false },
      },
    },
  },
} satisfies ThemePresetDefinition;
