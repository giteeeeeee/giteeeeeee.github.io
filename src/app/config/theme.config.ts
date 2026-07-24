/**
 * Theme Configuration
 *
 * This is the only file you need to edit for the site's visual language.
 * Choose a preset, then write any changes directly in the same object.
 */

import {
  defineTheme,
  fontStacks,
  themePresets,
} from '../../../presets/themes';

/**
 * Start with `preset`, then uncomment only what you want to change.
 *
 * - `primary` regenerates the complete MD3 palette from one brand color.
 * - `source` is the advanced alternative for explicit key colors.
 * - nested typography, shape, background, and effects values merge deeply.
 */
export const themeConfig = defineTheme({
  preset: 'technology',

  // primary: '#5B8CFF',

  // typography: {
  //   baseSize: 16,
  //   fontFamilies: { global: fontStacks.rounded.global },
  // },

  // background: {
  //   type: 'image',
  //   decoration: 'plain',
  //   imageUrl: '/images/background.jpg',
  //   imageStyle: { opacity: 0.72 },
  // },
});

/** Backward-compatible metadata exports; do not edit these separately. */
export const activeThemePreset = themeConfig.preset;

/** Discoverable metadata for a future settings UI or documentation tooling. */
export const availableThemePresets = themePresets;

export { fontStacks };
export const fontFamilies = themeConfig.typography.fontFamilies;
export const backgroundConfig = themeConfig.background;

export type {
  ResolvedThemeConfig,
  ThemeDefinition,
  ThemePresetName,
  ThemePresetOverrides,
} from '../../../presets/themes';

export type {
  BackgroundConfig,
  BackgroundDecoration,
  EffectsConfig,
  HomeWaveIntensity,
  SeasonalEffectSeason,
  ThemeConfig,
  VisualEffectDensity,
} from './theme.types';
