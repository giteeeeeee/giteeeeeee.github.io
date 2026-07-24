// src/design-system/theme/css-vars.ts
import type { ThemeConfig, Palette } from './types';

/**
 * 将 hex 颜色转换为 RGB 值 (不含 rgb() 包装)
 */
function hexToRGB(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

function referenceVars(p: Palette) {
  return ([
    ['primary', p.ref.primary],
    ['secondary', p.ref.secondary],
    ['tertiary', p.ref.tertiary],
    ['neutral', p.ref.neutral],
    ['neutral-variant', p.ref.neutralVariant],
    ['error', p.ref.error],
  ] as const)
    .map(([name, tones]) =>
      Object.entries(tones)
        .map(([tone, color]) => `  --md-ref-palette-${name}${tone}:${color};
  --md-ref-palette-${name}${tone}-rgb:${hexToRGB(color)};`)
        .join('\n')
    )
    .join('\n');
}

function paletteToVars(prefix: string, p: Palette) {
  return `
${prefix}{
  /* MD3 Reference Palettes */
${referenceVars(p)}

  /* MD3 Primary */
  --md-sys-color-primary:${p.primary};
  --md-sys-color-primary-rgb:${hexToRGB(p.primary)};
  --md-sys-color-on-primary:${p.onPrimary};
  --md-sys-color-on-primary-rgb:${hexToRGB(p.onPrimary)};
  --md-sys-color-primary-container:${p.primaryContainer};
  --md-sys-color-primary-container-rgb:${hexToRGB(p.primaryContainer)};
  --md-sys-color-on-primary-container:${p.onPrimaryContainer};
  --md-sys-color-on-primary-container-rgb:${hexToRGB(p.onPrimaryContainer)};
  --md-sys-color-primary-fixed:${p.primaryFixed};
  --md-sys-color-primary-fixed-rgb:${hexToRGB(p.primaryFixed)};
  --md-sys-color-primary-fixed-dim:${p.primaryFixedDim};
  --md-sys-color-primary-fixed-dim-rgb:${hexToRGB(p.primaryFixedDim)};
  --md-sys-color-on-primary-fixed:${p.onPrimaryFixed};
  --md-sys-color-on-primary-fixed-rgb:${hexToRGB(p.onPrimaryFixed)};
  --md-sys-color-on-primary-fixed-variant:${p.onPrimaryFixedVariant};
  --md-sys-color-on-primary-fixed-variant-rgb:${hexToRGB(p.onPrimaryFixedVariant)};
  
  /* MD3 Secondary */
  --md-sys-color-secondary:${p.secondary};
  --md-sys-color-secondary-rgb:${hexToRGB(p.secondary)};
  --md-sys-color-on-secondary:${p.onSecondary};
  --md-sys-color-on-secondary-rgb:${hexToRGB(p.onSecondary)};
  --md-sys-color-secondary-container:${p.secondaryContainer};
  --md-sys-color-secondary-container-rgb:${hexToRGB(p.secondaryContainer)};
  --md-sys-color-on-secondary-container:${p.onSecondaryContainer};
  --md-sys-color-on-secondary-container-rgb:${hexToRGB(p.onSecondaryContainer)};
  --md-sys-color-secondary-fixed:${p.secondaryFixed};
  --md-sys-color-secondary-fixed-rgb:${hexToRGB(p.secondaryFixed)};
  --md-sys-color-secondary-fixed-dim:${p.secondaryFixedDim};
  --md-sys-color-secondary-fixed-dim-rgb:${hexToRGB(p.secondaryFixedDim)};
  --md-sys-color-on-secondary-fixed:${p.onSecondaryFixed};
  --md-sys-color-on-secondary-fixed-rgb:${hexToRGB(p.onSecondaryFixed)};
  --md-sys-color-on-secondary-fixed-variant:${p.onSecondaryFixedVariant};
  --md-sys-color-on-secondary-fixed-variant-rgb:${hexToRGB(p.onSecondaryFixedVariant)};
  
  /* MD3 Tertiary */
  --md-sys-color-tertiary:${p.tertiary};
  --md-sys-color-tertiary-rgb:${hexToRGB(p.tertiary)};
  --md-sys-color-on-tertiary:${p.onTertiary};
  --md-sys-color-on-tertiary-rgb:${hexToRGB(p.onTertiary)};
  --md-sys-color-tertiary-container:${p.tertiaryContainer};
  --md-sys-color-tertiary-container-rgb:${hexToRGB(p.tertiaryContainer)};
  --md-sys-color-on-tertiary-container:${p.onTertiaryContainer};
  --md-sys-color-on-tertiary-container-rgb:${hexToRGB(p.onTertiaryContainer)};
  --md-sys-color-tertiary-fixed:${p.tertiaryFixed};
  --md-sys-color-tertiary-fixed-rgb:${hexToRGB(p.tertiaryFixed)};
  --md-sys-color-tertiary-fixed-dim:${p.tertiaryFixedDim};
  --md-sys-color-tertiary-fixed-dim-rgb:${hexToRGB(p.tertiaryFixedDim)};
  --md-sys-color-on-tertiary-fixed:${p.onTertiaryFixed};
  --md-sys-color-on-tertiary-fixed-rgb:${hexToRGB(p.onTertiaryFixed)};
  --md-sys-color-on-tertiary-fixed-variant:${p.onTertiaryFixedVariant};
  --md-sys-color-on-tertiary-fixed-variant-rgb:${hexToRGB(p.onTertiaryFixedVariant)};
  
  /* MD3 Surface & Background */
  --md-sys-color-background:${p.background};
  --md-sys-color-background-rgb:${hexToRGB(p.background)};
  --md-sys-color-on-background:${p.onBackground};
  --md-sys-color-on-background-rgb:${hexToRGB(p.onBackground)};
  --md-sys-color-surface:${p.surface};
  --md-sys-color-surface-rgb:${hexToRGB(p.surface)};
  --md-sys-color-on-surface:${p.onSurface};
  --md-sys-color-on-surface-rgb:${hexToRGB(p.onSurface)};
  --md-sys-color-surface-tint:${p.surfaceTint};
  --md-sys-color-surface-tint-rgb:${hexToRGB(p.surfaceTint)};
  --md-sys-color-surface-variant:${p.surfaceVariant};
  --md-sys-color-surface-variant-rgb:${hexToRGB(p.surfaceVariant)};
  --md-sys-color-on-surface-variant:${p.onSurfaceVariant};
  --md-sys-color-on-surface-variant-rgb:${hexToRGB(p.onSurfaceVariant)};
  
  /* MD3 Extended Surface Levels */
  --md-sys-color-surface-dim:${p.surfaceDim || p.surface};
  --md-sys-color-surface-dim-rgb:${hexToRGB(p.surfaceDim || p.surface)};
  --md-sys-color-surface-bright:${p.surfaceBright || p.surface};
  --md-sys-color-surface-bright-rgb:${hexToRGB(p.surfaceBright || p.surface)};
  --md-sys-color-surface-container-lowest:${p.surfaceContainerLowest || p.surface};
  --md-sys-color-surface-container-lowest-rgb:${hexToRGB(p.surfaceContainerLowest || p.surface)};
  --md-sys-color-surface-container-low:${p.surfaceContainerLow || p.surfaceVariant};
  --md-sys-color-surface-container-low-rgb:${hexToRGB(p.surfaceContainerLow || p.surfaceVariant)};
  --md-sys-color-surface-container:${p.surfaceContainer || p.surfaceVariant};
  --md-sys-color-surface-container-rgb:${hexToRGB(p.surfaceContainer || p.surfaceVariant)};
  --md-sys-color-surface-container-high:${p.surfaceContainerHigh || p.surfaceVariant};
  --md-sys-color-surface-container-high-rgb:${hexToRGB(p.surfaceContainerHigh || p.surfaceVariant)};
  --md-sys-color-surface-container-highest:${p.surfaceContainerHighest || p.surfaceVariant};
  --md-sys-color-surface-container-highest-rgb:${hexToRGB(p.surfaceContainerHighest || p.surfaceVariant)};
  
  /* MD3 Outline */
  --md-sys-color-outline:${p.outline};
  --md-sys-color-outline-rgb:${hexToRGB(p.outline)};
  --md-sys-color-outline-variant:${p.outlineVariant || p.outline};
  --md-sys-color-outline-variant-rgb:${hexToRGB(p.outlineVariant || p.outline)};
  --md-sys-color-shadow:${p.shadow};
  --md-sys-color-shadow-rgb:${hexToRGB(p.shadow)};
  --md-sys-color-scrim:${p.scrim};
  --md-sys-color-scrim-rgb:${hexToRGB(p.scrim)};
  --md-sys-color-inverse-surface:${p.inverseSurface};
  --md-sys-color-inverse-surface-rgb:${hexToRGB(p.inverseSurface)};
  --md-sys-color-inverse-on-surface:${p.inverseOnSurface};
  --md-sys-color-inverse-on-surface-rgb:${hexToRGB(p.inverseOnSurface)};
  --md-sys-color-inverse-primary:${p.inversePrimary};
  --md-sys-color-inverse-primary-rgb:${hexToRGB(p.inversePrimary)};
  
  /* MD3 Error */
  --md-sys-color-error:${p.error};
  --md-sys-color-error-rgb:${hexToRGB(p.error)};
  --md-sys-color-on-error:${p.onError};
  --md-sys-color-on-error-rgb:${hexToRGB(p.onError)};
  --md-sys-color-error-container:${p.errorContainer};
  --md-sys-color-error-container-rgb:${hexToRGB(p.errorContainer)};
  --md-sys-color-on-error-container:${p.onErrorContainer};
  --md-sys-color-on-error-container-rgb:${hexToRGB(p.onErrorContainer)};
  
  /* App semantic aliases derived from MD3 palettes */
  --reay-color-success:${p.success};
  --reay-color-success-rgb:${hexToRGB(p.success)};
  --reay-color-warning:${p.warning};
  --reay-color-warning-rgb:${hexToRGB(p.warning)};
  --reay-color-info:${p.info};
  --reay-color-info-rgb:${hexToRGB(p.info)};
}
`.trim();
}

function semanticVars(prefix: string) {
  return `
${prefix}{
  /* App semantic tokens mapped to MD3 roles */
  --reay-color-accent:var(--md-sys-color-primary);
  --reay-color-accent-rgb:var(--md-sys-color-primary-rgb);
  --reay-color-accent-container:var(--md-sys-color-primary-container);
  --reay-color-on-accent:var(--md-sys-color-on-primary);
  --reay-color-on-accent-container:var(--md-sys-color-on-primary-container);
  --reay-gradient-brand:linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  --reay-gradient-container:linear-gradient(135deg, var(--md-sys-color-primary-container), var(--md-sys-color-tertiary-container));
  --reay-color-shadow-rgb:var(--md-sys-color-shadow-rgb);
  --reay-color-highlight-rgb:var(--md-sys-color-surface-bright-rgb);
  --reay-shadow-soft:0 12px 32px -28px rgba(var(--md-sys-color-shadow-rgb), 0.38);
  --reay-shadow-panel:0 22px 58px -42px rgba(var(--md-sys-color-shadow-rgb), 0.58);
  --reay-highlight-hairline:inset 0 1px 0 rgba(var(--md-sys-color-surface-bright-rgb), 0.18);

  /* Component aliases */
  --reay-music-accent:var(--md-sys-color-primary);
  --reay-music-on-accent:var(--md-sys-color-on-primary);
  --reay-music-accent-container:var(--md-sys-color-primary-container);
  --reay-music-on-accent-container:var(--md-sys-color-on-primary-container);
  --reay-music-surface:rgba(var(--md-sys-color-surface-container-rgb), 0.9);
  --reay-music-cover-gradient:linear-gradient(135deg, var(--md-sys-color-primary-container), var(--md-sys-color-tertiary-container));
}
`.trim();
}

export function themeToCSSVars(theme: ThemeConfig) {
  const { paletteLight: L, paletteDark: D, typography: t, shape: s } = theme;

  const baseTokens = `
:root{
  /* typography */
  --reay-font-global:${t.fontFamilies.global};
  --reay-font-brand:${t.fontFamilies.brand};
  --reay-font-navigation:${t.fontFamilies.navigation};
  --reay-font-heading:${t.fontFamilies.heading};
  --reay-font-body:${t.fontFamilies.body};
  --reay-font-metadata:${t.fontFamilies.metadata};
  --reay-font-prose:${t.fontFamilies.prose};
  --reay-font-prose-heading:${t.fontFamilies.proseHeading};
  --reay-font-mono:${t.fontFamilies.mono};
  --reay-font-sans:var(--reay-font-global);
  --font-sans:var(--reay-font-global);
  --font-mono:var(--reay-font-mono);
  --text-base:${t.baseSize}px;
  --leading:${t.lineHeight};
  --fs-xs:${t.scale.xs}rem; --fs-sm:${t.scale.sm}rem; --fs-md:${t.scale.md}rem;
  --fs-lg:${t.scale.lg}rem; --fs-xl:${t.scale.xl}rem; --fs-2xl:${t.scale['2xl']}rem; --fs-3xl:${t.scale['3xl']}rem;

  /* shape */
  --radius-xs:${s.radiusXs}; --radius-sm:${s.radiusSm}; --radius-md:${s.radiusMd};
  --radius-lg:${s.radiusLg}; --radius-xl:${s.radiusXl}; --radius-pill:${s.radiusPill};
  --border-w:${s.borderWidth};
  --shadow-sm:${s.shadowSm}; --shadow-md:${s.shadowMd}; --shadow-lg:${s.shadowLg};
}
`.trim();

  // 默认用亮色；系统暗色时自动覆盖；用户手动切换再用 data-theme 强制覆盖
  return [
    baseTokens,
    paletteToVars(':root', L),
    semanticVars(':root'),
    `@media (prefers-color-scheme: dark){ ${paletteToVars(':root', D)} }`,
    paletteToVars(':root[data-theme="light"]', L),
    paletteToVars(':root[data-theme="dark"]', D),
  ].join('\n');
}
