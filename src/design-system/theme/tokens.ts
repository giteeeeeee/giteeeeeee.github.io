/**
 * Theme Tokens
 * Default source color, typography, and shape definitions for the theme system
 * 
 * @module theme/tokens
 */
import type { FontFamilyRoles, Typography, Shape } from './types';

/**
 * Default primary color - Bright blue representing a sunny and tech-forward aesthetic
 */
export const DEFAULT_PRIMARY = '#5B8CFF';

/**
 * Default typography system
 * 
 * @remarks
 * Defines font families, base size, line height, and a type scale for responsive design
 * - fontFamily: Self-hosted rounded Latin font with local CJK fallbacks
 * - fontFamilyMono: Monospace fonts for code display
 * - baseSize: 16px baseline for all text sizing
 * - lineHeight: 1.7 for comfortable reading
 * - scale: Responsive type scale from xs (0.75) to 3xl (1.875)
 */
const defaultRoundedFont = `"Nunito Variable", "寒蝉全圆体", "Noto Sans SC Variable", "PingFang SC", "Microsoft YaHei", ui-rounded, ui-sans-serif, system-ui, sans-serif`;
const defaultMonoFont = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

export const defaultFontFamilies: FontFamilyRoles = {
  global: defaultRoundedFont,
  brand: defaultRoundedFont,
  navigation: defaultRoundedFont,
  heading: defaultRoundedFont,
  body: defaultRoundedFont,
  metadata: defaultRoundedFont,
  prose: defaultRoundedFont,
  proseHeading: defaultRoundedFont,
  mono: defaultMonoFont,
};

export const defaultTypography: Typography = {
  fontFamilies: defaultFontFamilies,
  baseSize: 16,
  lineHeight: 1.7,
  scale: { xs: .75, sm: .875, md: 1, lg: 1.125, xl: 1.25, '2xl': 1.5, '3xl': 1.875 },
};

/**
 * Default shape tokens
 * 
 * @remarks
 * Defines border radius, widths, and shadows for consistent component shapes
 * - radiusXs/Sm/Md/Lg/Xl/Pill: Progressive border radius from subtle to prominent
 * - borderWidth: Standard border thickness
 * - shadowSm/Md/Lg: Elevation shadows for depth hierarchy
 */
export const defaultShape: Shape = {
  radiusXs: '6px',
  radiusSm: '8px',
  radiusMd: '16px',
  radiusLg: '24px',
  radiusXl: '30px',
  radiusPill: '999px',
  borderWidth: '1px',
  shadowSm: '0 1px 2px rgba(var(--md-sys-color-shadow-rgb), .06)',
  shadowMd: '0 8px 30px rgba(var(--md-sys-color-shadow-rgb), .08)',
  shadowLg: '0 18px 40px rgba(var(--md-sys-color-shadow-rgb), .12)',
};
