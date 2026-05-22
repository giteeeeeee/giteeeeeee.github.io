/**
 * Theme Type Definitions
 * TypeScript types for Material Design 3 theme system
 * 
 * @module theme/types
 */

/**
 * Material Design 3 color palette
 * 
 * @remarks
 * Defines all color roles following MD3 specifications:
 * - Primary/Secondary/Tertiary: Brand colors with container variants
 * - Surface: Background colors with multiple container levels
 * - On-* colors: Text/icon colors that appear on corresponding backgrounds
 * - Error: The only MD3 semantic color role
 * 
 * @see {@link https://m3.material.io/styles/color/the-color-system/key-colors-tones}
 */
export type PaletteTone =
  | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 98 | 99 | 100;

export type TonePalette = Record<PaletteTone, string>;

export type ReferencePalettes = {
  primary: TonePalette;
  secondary: TonePalette;
  tertiary: TonePalette;
  neutral: TonePalette;
  neutralVariant: TonePalette;
  error: TonePalette;
};

export type Palette = {
  ref: ReferencePalettes;

  primary: string; onPrimary: string;
  primaryContainer: string; onPrimaryContainer: string;
  primaryFixed: string; primaryFixedDim: string;
  onPrimaryFixed: string; onPrimaryFixedVariant: string;
  secondary: string; onSecondary: string;
  secondaryContainer: string; onSecondaryContainer: string;
  secondaryFixed: string; secondaryFixedDim: string;
  onSecondaryFixed: string; onSecondaryFixedVariant: string;
  tertiary: string; onTertiary: string;
  tertiaryContainer: string; onTertiaryContainer: string;
  tertiaryFixed: string; tertiaryFixedDim: string;
  onTertiaryFixed: string; onTertiaryFixedVariant: string;

  background: string; onBackground: string;
  surface: string; onSurface: string;
  surfaceTint: string;
  surfaceVariant: string; onSurfaceVariant: string;
  surfaceDim?: string;
  surfaceBright?: string;
  surfaceContainerLowest?: string;
  surfaceContainerLow?: string;
  surfaceContainer?: string;
  surfaceContainerHigh?: string;
  surfaceContainerHighest?: string;
  outline: string;
  outlineVariant?: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  error: string; onError: string;
  errorContainer: string; onErrorContainer: string;
  // App aliases derived from MD3 palettes, exported as --reay-color-*.
  success: string; warning: string; info: string;
};

export type ThemeColorSource = {
  primary: string;
  secondary?: string;
  tertiary?: string;
  neutral?: string;
  neutralVariant?: string;
  error?: string;
};

/**
 * Typography system configuration
 * 
 * @remarks
 * Defines font families, base size, line height, and responsive type scale
 * - fontFamily: Main text font stack
 * - fontFamilyMono: Monospace font for code
 * - baseSize: Base font size in pixels
 * - lineHeight: Default line height multiplier
 * - scale: Responsive type scale with named sizes
 */
export type Typography = {
  fontFamily: string;
  fontFamilyMono: string;
  baseSize: number;
  lineHeight: number;
  scale: {
    xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number; '3xl': number;
  };
};

/**
 * Shape and elevation tokens
 * 
 * @remarks
 * Defines border radius values, border widths, and shadow styles
 * for consistent component shapes and depth hierarchy
 */
export type Shape = {
  radiusSm: string; radiusMd: string; radiusLg: string;
  borderWidth: string;
  shadowSm: string; shadowMd: string; shadowLg: string;
};

/**
 * Complete theme configuration
 * 
 * @remarks
 * Supports light and dark mode with separate palettes
 * - mode: Theme mode preference (light/dark/system)
 * - paletteLight: Color palette for light mode
 * - paletteDark: Color palette for dark mode
 * - typography: Global typography settings
 * - shape: Global shape and shadow tokens
 */
export type ThemeConfig = {
  mode: 'light' | 'dark' | 'system';
  paletteLight: Palette;
  paletteDark: Palette;
  typography: Typography;
  shape: Shape;
};

/**
 * User theme customization overrides
 * 
 * @remarks
 * Allows users to override specific theme properties without providing complete configuration
 * - mode: Optional theme mode override
 * - primary: Optional primary color - automatically generates full MD3 color roles
 * - typography: Optional typography overrides (partial)
 * - shape: Optional shape token overrides (partial)
 * 
 * @example
 * ```ts
 * const userTheme: UserThemeOverrides = {
 *   mode: 'dark',
 *   primary: '#5B8CFF',
 *   typography: {
 *     baseSize: 18,
 *     scale: { md: 1.1 }
 *   }
 * };
 * ```
 */
export type UserThemeOverrides = Partial<{
  mode: 'light' | 'dark' | 'system';
  primary: string;   // Provide only primary color - MD3 color roles generated automatically
  source: Partial<ThemeColorSource>; // Optional MD3 key colors for advanced palette control
  typography: Partial<Omit<Typography, 'scale'>> & Partial<{ scale: Partial<Typography['scale']> }>;
  shape: Partial<Shape>;
}>;
