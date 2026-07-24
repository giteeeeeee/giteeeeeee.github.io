import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const ukiyoThemePreset = {
  name: 'Ukiyo',
  nameZh: '浮世绘',
  description: '靛青、赭红、米纸与版画波纹组成的东方刊物风格，鲜明但保持克制。',
  config: {
    mode: 'system',
    primary: '#315C73',
    source: {
      primary: '#315C73',
      secondary: '#994A3D',
      tertiary: '#9A692C',
      neutral: '#756F67',
      neutralVariant: '#756E68',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.paper.global, {
        navigation: fontStacks.rounded.global,
        metadata: fontStacks.rounded.global,
      }),
      baseSize: 16,
      lineHeight: 1.74,
    },
    shape: {
      radiusXs: '0',
      radiusSm: '3px',
      radiusMd: '6px',
      radiusLg: '10px',
      radiusXl: '14px',
      radiusPill: '6px',
      borderWidth: '1px',
      shadowSm: '0 2px 0 rgba(var(--md-sys-color-shadow-rgb), 0.08)',
      shadowMd: '0 12px 28px -22px rgba(var(--md-sys-color-shadow-rgb), 0.3)',
      shadowLg: '0 22px 48px -34px rgba(var(--md-sys-color-shadow-rgb), 0.4)',
    },
    background: {
      type: 'gradient',
      decoration: 'ukiyo',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.78 },
      gradient: { useMD3Colors: true, direction: '155deg' },
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
