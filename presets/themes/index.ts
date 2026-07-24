import type { FontFamilyRoles } from '../../src/design-system/theme';
import type { ThemeConfig } from '../../src/app/config/theme.types';
import { animeNightThemePreset } from './anime-night';
import { animeSpringThemePreset } from './anime-spring';
import { cosmicAbyssThemePreset } from './cosmic-abyss';
import { editorialThemePreset } from './editorial';
import { einkThemePreset } from './eink';
import { forestThemePreset } from './forest';
import { inkwashThemePreset } from './inkwash';
import { monochromeInkThemePreset } from './monochrome-ink';
import { oceanThemePreset } from './ocean';
import { paperThemePreset } from './paper';
import { retroTerminalThemePreset } from './retro-terminal';
import { technologyThemePreset } from './technology';
import { ukiyoThemePreset } from './ukiyo';
import type { ThemePresetOverrides } from './types';

export { fontStacks } from './fonts';
export type { ThemePresetDefinition, ThemePresetOverrides } from './types';

export const themePresets = {
  technology: technologyThemePreset,
  paper: paperThemePreset,
  eink: einkThemePreset,
  forest: forestThemePreset,
  editorial: editorialThemePreset,
  inkwash: inkwashThemePreset,
  'monochrome-ink': monochromeInkThemePreset,
  'anime-spring': animeSpringThemePreset,
  'anime-night': animeNightThemePreset,
  'cosmic-abyss': cosmicAbyssThemePreset,
  ukiyo: ukiyoThemePreset,
  ocean: oceanThemePreset,
  'retro-terminal': retroTerminalThemePreset,
} as const;

export type ThemePresetName = keyof typeof themePresets;
export const themePresetNames = Object.keys(themePresets) as ThemePresetName[];

export type ThemeDefinition = ThemePresetOverrides & {
  /** Complete visual foundation. Everything else in this object is optional. */
  preset?: ThemePresetName;
};

export type ResolvedThemeConfig = ThemeConfig & {
  /** Kept on the resolved object for diagnostics and future settings UIs. */
  preset: ThemePresetName;
};

const semanticFontRoles = [
  'brand',
  'navigation',
  'heading',
  'body',
  'metadata',
  'prose',
  'proseHeading',
] as const satisfies ReadonlyArray<keyof FontFamilyRoles>;

function resolveFontFamilies(
  base: FontFamilyRoles,
  typography: ThemePresetOverrides['typography'],
): FontFamilyRoles {
  const overrides = typography?.fontFamilies;
  const global = overrides?.global?.trim()
    || typography?.fontFamily?.trim()
    || base.global;
  const mono = overrides?.mono?.trim()
    || typography?.fontFamilyMono?.trim()
    || base.mono;
  const resolved = { ...base, global, mono };

  for (const role of semanticFontRoles) {
    const inherited = base[role] === base.global ? global : base[role];
    resolved[role] = overrides?.[role]?.trim() || inherited;
  }

  return resolved;
}

function resolveThemePreset(
  name: ThemePresetName,
  overrides: ThemePresetOverrides = {},
): ResolvedThemeConfig {
  const base: ThemeConfig = themePresets[name].config;
  const presetSource = base.source ?? { primary: base.primary };
  const hasUserColorSource = overrides.primary !== undefined || overrides.source !== undefined;
  const primary = overrides.source?.primary
    ?? overrides.primary
    ?? presetSource.primary
    ?? base.primary;
  const variant = overrides.source?.variant ?? presetSource.variant;
  const source = hasUserColorSource
    ? {
        ...(variant ? { variant } : {}),
        ...overrides.source,
        primary,
      }
    : {
        ...presetSource,
        primary,
      };

  return {
    ...base,
    ...overrides,
    preset: name,
    primary,
    source,
    typography: {
      ...base.typography,
      ...overrides.typography,
      fontFamilies: resolveFontFamilies(base.typography.fontFamilies, overrides.typography),
      scale: {
        ...base.typography.scale,
        ...overrides.typography?.scale,
      },
    },
    shape: { ...base.shape, ...overrides.shape },
    background: {
      ...base.background,
      ...overrides.background,
      imageStyle: {
        ...base.background.imageStyle,
        ...overrides.background?.imageStyle,
      },
      gradient: {
        ...base.background.gradient,
        ...overrides.background?.gradient,
      },
    },
    effects: {
      homeWave: {
        ...base.effects.homeWave,
        ...overrides.effects?.homeWave,
      },
      seasonal: {
        ...base.effects.seasonal,
        ...overrides.effects?.seasonal,
        seasons: {
          ...base.effects.seasonal.seasons,
          ...overrides.effects?.seasonal?.seasons,
        },
      },
    },
  };
}

/**
 * Resolve one user-facing object into the complete theme consumed by the site.
 *
 * Color rules stay intentionally simple:
 * - no color fields: keep the preset palette source;
 * - `primary`: derive a fresh MD3 palette from that color;
 * - `source`: use only the explicitly supplied advanced key colors.
 */
export function defineTheme(definition: ThemeDefinition = {}): ResolvedThemeConfig {
  const { preset = 'technology', ...overrides } = definition;
  return resolveThemePreset(preset, overrides);
}

/** @deprecated Prefer `defineTheme({ preset, ...overrides })`. */
export function createThemePreset(
  name: ThemePresetName,
  overrides: ThemePresetOverrides = {},
): ResolvedThemeConfig {
  return resolveThemePreset(name, overrides);
}
