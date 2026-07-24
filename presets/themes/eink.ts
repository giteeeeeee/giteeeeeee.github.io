import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const einkThemePreset = {
  name: 'E-ink',
  nameZh: '墨水屏',
  description: '低彩度近黑白配色、克制圆角与无抬升阴影，强调长文阅读和电子纸颗粒。',
  config: {
    mode: 'system',
    primary: '#424242',
    source: {
      primary: '#424242',
      variant: 'monochrome',
      secondary: '#5C5C5C',
      tertiary: '#606060',
      neutral: '#777777',
      neutralVariant: '#707070',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.clean.global, {
        brand: fontStacks.paper.global,
        heading: fontStacks.paper.global,
        prose: fontStacks.paper.global,
        proseHeading: fontStacks.paper.global,
      }),
      baseSize: 16,
      lineHeight: 1.82,
    },
    shape: {
      radiusXs: '0',
      radiusSm: '2px',
      radiusMd: '3px',
      radiusLg: '5px',
      radiusXl: '6px',
      radiusPill: '5px',
      borderWidth: '1px',
      shadowSm: 'none',
      shadowMd: 'none',
      shadowLg: 'none',
    },
    background: {
      type: 'gradient',
      decoration: 'eink',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.9 },
      gradient: { useMD3Colors: true, direction: '180deg' },
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
