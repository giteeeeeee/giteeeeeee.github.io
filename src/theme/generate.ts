import type { Palette, ReferencePalettes, ThemeColorSource, TonePalette } from './types';
import {
  DynamicScheme,
  Hct,
  SchemeTonalSpot,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';

type TonalPaletteLike = {
  tone: (tone: number) => number;
};

const FALLBACK_PRIMARY = '#5B8CFF';
const HEX_COLOR = /^#?[0-9a-f]{6}$/i;
const REFERENCE_TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100] as const;
const STANDARD_CONTRAST_LEVEL = 0;

function normalizeHex(input: string | undefined, fallback = FALLBACK_PRIMARY): string {
  if (!input || !HEX_COLOR.test(input.trim())) return fallback;
  const value = input.trim();
  return value.startsWith('#') ? value : `#${value}`;
}

function toArgb(input: string | undefined, fallback = FALLBACK_PRIMARY): number {
  return argbFromHex(normalizeHex(input, fallback));
}

function resolveSource(source: string | ThemeColorSource): ThemeColorSource {
  if (typeof source === 'string') {
    return { primary: normalizeHex(source) };
  }

  const primary = normalizeHex(source.primary);
  return {
    primary,
    secondary: source.secondary ? normalizeHex(source.secondary, primary) : undefined,
    tertiary: source.tertiary ? normalizeHex(source.tertiary, primary) : undefined,
    neutral: source.neutral ? normalizeHex(source.neutral, primary) : undefined,
    neutralVariant: source.neutralVariant ? normalizeHex(source.neutralVariant, primary) : undefined,
    error: source.error ? normalizeHex(source.error, '#BA1A1A') : undefined,
  };
}

function tone(palette: TonalPaletteLike, value: number): string {
  return hexFromArgb(palette.tone(value));
}

function referenceTonePalette(palette: TonalPaletteLike): TonePalette {
  return Object.fromEntries(
    REFERENCE_TONES.map((value) => [value, tone(palette, value)])
  ) as TonePalette;
}

function buildReferencePalettes(scheme: DynamicScheme): ReferencePalettes {
  return {
    primary: referenceTonePalette(scheme.primaryPalette),
    secondary: referenceTonePalette(scheme.secondaryPalette),
    tertiary: referenceTonePalette(scheme.tertiaryPalette),
    neutral: referenceTonePalette(scheme.neutralPalette),
    neutralVariant: referenceTonePalette(scheme.neutralVariantPalette),
    error: referenceTonePalette(scheme.errorPalette),
  };
}

function createScheme(source: ThemeColorSource, isDark: boolean): DynamicScheme {
  const sourceColorArgb = toArgb(source.primary);
  const sourceColorHct = Hct.fromInt(sourceColorArgb);
  const baseScheme = new SchemeTonalSpot(sourceColorHct, isDark, STANDARD_CONTRAST_LEVEL);

  if (!source.secondary && !source.tertiary && !source.neutral && !source.neutralVariant) {
    return baseScheme;
  }

  return new DynamicScheme({
    sourceColorArgb,
    variant: baseScheme.variant,
    contrastLevel: STANDARD_CONTRAST_LEVEL,
    isDark,
    primaryPalette: baseScheme.primaryPalette,
    secondaryPalette: source.secondary ? TonalPalette.fromInt(toArgb(source.secondary, source.primary)) : baseScheme.secondaryPalette,
    tertiaryPalette: source.tertiary ? TonalPalette.fromInt(toArgb(source.tertiary, source.primary)) : baseScheme.tertiaryPalette,
    neutralPalette: source.neutral ? TonalPalette.fromInt(toArgb(source.neutral, source.primary)) : baseScheme.neutralPalette,
    neutralVariantPalette: source.neutralVariant ? TonalPalette.fromInt(toArgb(source.neutralVariant, source.primary)) : baseScheme.neutralVariantPalette,
  });
}

function pick(scheme: DynamicScheme, key: keyof DynamicScheme): string {
  return hexFromArgb(scheme[key] as number);
}

function buildPalette(scheme: DynamicScheme): Palette {
  const isDark = scheme.isDark;

  return {
    ref: buildReferencePalettes(scheme),

    primary: pick(scheme, 'primary'), onPrimary: pick(scheme, 'onPrimary'),
    primaryContainer: pick(scheme, 'primaryContainer'), onPrimaryContainer: pick(scheme, 'onPrimaryContainer'),
    primaryFixed: pick(scheme, 'primaryFixed'), primaryFixedDim: pick(scheme, 'primaryFixedDim'),
    onPrimaryFixed: pick(scheme, 'onPrimaryFixed'), onPrimaryFixedVariant: pick(scheme, 'onPrimaryFixedVariant'),

    secondary: pick(scheme, 'secondary'), onSecondary: pick(scheme, 'onSecondary'),
    secondaryContainer: pick(scheme, 'secondaryContainer'), onSecondaryContainer: pick(scheme, 'onSecondaryContainer'),
    secondaryFixed: pick(scheme, 'secondaryFixed'), secondaryFixedDim: pick(scheme, 'secondaryFixedDim'),
    onSecondaryFixed: pick(scheme, 'onSecondaryFixed'), onSecondaryFixedVariant: pick(scheme, 'onSecondaryFixedVariant'),

    tertiary: pick(scheme, 'tertiary'), onTertiary: pick(scheme, 'onTertiary'),
    tertiaryContainer: pick(scheme, 'tertiaryContainer'), onTertiaryContainer: pick(scheme, 'onTertiaryContainer'),
    tertiaryFixed: pick(scheme, 'tertiaryFixed'), tertiaryFixedDim: pick(scheme, 'tertiaryFixedDim'),
    onTertiaryFixed: pick(scheme, 'onTertiaryFixed'), onTertiaryFixedVariant: pick(scheme, 'onTertiaryFixedVariant'),

    background: pick(scheme, 'background'), onBackground: pick(scheme, 'onBackground'),
    surface: pick(scheme, 'surface'), onSurface: pick(scheme, 'onSurface'),
    surfaceTint: pick(scheme, 'surfaceTint'),
    surfaceVariant: pick(scheme, 'surfaceVariant'), onSurfaceVariant: pick(scheme, 'onSurfaceVariant'),
    surfaceDim: pick(scheme, 'surfaceDim'),
    surfaceBright: pick(scheme, 'surfaceBright'),
    surfaceContainerLowest: pick(scheme, 'surfaceContainerLowest'),
    surfaceContainerLow: pick(scheme, 'surfaceContainerLow'),
    surfaceContainer: pick(scheme, 'surfaceContainer'),
    surfaceContainerHigh: pick(scheme, 'surfaceContainerHigh'),
    surfaceContainerHighest: pick(scheme, 'surfaceContainerHighest'),
    outline: pick(scheme, 'outline'),
    outlineVariant: pick(scheme, 'outlineVariant'),
    shadow: pick(scheme, 'shadow'),
    scrim: pick(scheme, 'scrim'),
    inverseSurface: pick(scheme, 'inverseSurface'),
    inverseOnSurface: pick(scheme, 'inverseOnSurface'),
    inversePrimary: pick(scheme, 'inversePrimary'),

    error: pick(scheme, 'error'), onError: pick(scheme, 'onError'),
    errorContainer: pick(scheme, 'errorContainer'), onErrorContainer: pick(scheme, 'onErrorContainer'),
    success: tone(scheme.secondaryPalette, isDark ? 80 : 40),
    warning: tone(scheme.tertiaryPalette, isDark ? 80 : 40),
    info: tone(scheme.primaryPalette, isDark ? 80 : 40),
  };
}

export function generateMaterialPalettes(source: string | ThemeColorSource): { light: Palette; dark: Palette } {
  const resolvedSource = resolveSource(source);
  return {
    light: buildPalette(createScheme(resolvedSource, false)),
    dark: buildPalette(createScheme(resolvedSource, true)),
  };
}
