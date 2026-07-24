// src/design-system/theme/config.ts
import type { ThemeConfig, UserThemeOverrides } from './types';
import { defaultFontFamilies, defaultTypography, defaultShape, DEFAULT_PRIMARY } from './tokens';
import { generateMaterialPalettes } from './generate';

export function createTheme(overrides?: UserThemeOverrides): ThemeConfig {
  const primary = overrides?.source?.primary ?? overrides?.primary ?? DEFAULT_PRIMARY;
  const colorSource = overrides?.source ? { ...overrides.source, primary } : primary;
  const { light, dark } = generateMaterialPalettes(colorSource);

  const typographyOverrides = overrides?.typography;
  const configuredFontFamilies = typographyOverrides?.fontFamilies ?? {};
  const globalFont = configuredFontFamilies.global?.trim()
    || typographyOverrides?.fontFamily?.trim()
    || defaultFontFamilies.global;
  const monoFont = configuredFontFamilies.mono?.trim()
    || typographyOverrides?.fontFamilyMono?.trim()
    || defaultFontFamilies.mono;
  const resolveRole = (role: keyof Omit<typeof defaultFontFamilies, 'global' | 'mono'>) => (
    configuredFontFamilies[role]?.trim() || globalFont
  );
  const { fontFamilies: _fontFamilies, fontFamily: _fontFamily, fontFamilyMono: _fontFamilyMono, ...restTypographyOverrides } = typographyOverrides ?? {};
  const typography = {
    ...defaultTypography,
    ...restTypographyOverrides,
    fontFamilies: {
      global: globalFont,
      brand: resolveRole('brand'),
      navigation: resolveRole('navigation'),
      heading: resolveRole('heading'),
      body: resolveRole('body'),
      metadata: resolveRole('metadata'),
      prose: resolveRole('prose'),
      proseHeading: resolveRole('proseHeading'),
      mono: monoFont,
    },
    scale: { ...defaultTypography.scale, ...(overrides?.typography?.scale ?? {}) },
  };
  const shape = { ...defaultShape, ...(overrides?.shape ?? {}) };

  return {
    mode: overrides?.mode ?? 'system',
    paletteLight: light,
    paletteDark: dark,
    typography,
    shape,
  };
}
