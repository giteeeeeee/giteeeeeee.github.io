import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const monochromeInkThemePreset = {
  name: 'Monochrome Ink',
  nameZh: '墨白丹朱',
  description: '宣纸白、浓淡墨色、楷体细线与克制朱砂印记构成的黑白水墨主题。',
  config: {
    mode: 'light',
    primary: '#242321',
    source: {
      primary: '#242321',
      secondary: '#65615C',
      tertiary: '#A7352A',
      neutral: '#77736D',
      neutralVariant: '#6D6962',
      variant: 'neutral',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.ink.global, {
        navigation: fontStacks.clean.global,
        metadata: fontStacks.clean.global,
      }),
      baseSize: 16,
      lineHeight: 1.82,
    },
    shape: {
      radiusXs: '0',
      radiusSm: '2px',
      radiusMd: '4px',
      radiusLg: '7px',
      radiusXl: '10px',
      radiusPill: '999px',
      borderWidth: '1px',
      shadowSm: 'none',
      shadowMd: '0 14px 34px -32px rgba(var(--md-sys-color-shadow-rgb), 0.32)',
      shadowLg: '0 24px 54px -46px rgba(var(--md-sys-color-shadow-rgb), 0.38)',
    },
    background: {
      type: 'gradient',
      decoration: 'monochrome-ink',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.82 },
      gradient: { useMD3Colors: true, direction: '180deg' },
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
