import { createFontRoles, fontStacks } from './fonts';
import type { ThemePresetDefinition } from './types';

export const retroTerminalThemePreset = {
  name: 'Retro Terminal',
  nameZh: '复古终端',
  description: '固定近黑底、磷光绿、扫描线和终端网格构成的经典复古计算机界面。',
  config: {
    mode: 'dark',
    primary: '#287A4B',
    source: {
      primary: '#287A4B',
      secondary: '#4B705B',
      tertiary: '#6B7434',
      neutral: '#5E6861',
      neutralVariant: '#53665A',
    },
    typography: {
      fontFamilies: createFontRoles(fontStacks.mono),
      baseSize: 15,
      lineHeight: 1.64,
    },
    shape: {
      radiusXs: '0',
      radiusSm: '2px',
      radiusMd: '3px',
      radiusLg: '4px',
      radiusXl: '6px',
      radiusPill: '4px',
      borderWidth: '1px',
      shadowSm: 'none',
      shadowMd: 'none',
      shadowLg: 'none',
    },
    background: {
      type: 'gradient',
      decoration: 'terminal',
      blur: false,
      blurIntensity: 'light',
      imageStyle: { size: 'cover', position: 'center', repeat: 'no-repeat', opacity: 0.86 },
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
