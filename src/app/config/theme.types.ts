import type { FontFamilyRoles, Shape, UserThemeOverrides } from '@design/theme';

export type BackgroundDecoration =
  | 'aurora'
  | 'paper'
  | 'eink'
  | 'plain'
  | 'inkwash'
  | 'monochrome-ink'
  | 'anime-spring'
  | 'anime-night'
  | 'cosmic-abyss'
  | 'ukiyo'
  | 'ocean'
  | 'terminal';

export interface BackgroundConfig {
  type: 'gradient' | 'image' | 'none';
  /** Visual texture layered over the configured background. */
  decoration: BackgroundDecoration;
  blur: boolean;
  blurIntensity: 'light' | 'medium' | 'heavy';
  imageUrl?: string;
  imageStyle?: {
    size?: 'cover' | 'contain' | 'auto';
    position?: string;
    repeat?: string;
    opacity?: number;
  };
  gradient?: {
    useMD3Colors?: boolean;
    colors?: string[];
    direction?: string;
  };
}

export type SeasonalEffectSeason = 'auto' | 'spring' | 'summer' | 'autumn' | 'winter';
export type VisualEffectDensity = 'low' | 'medium' | 'high';
export type HomeWaveIntensity = 'low' | 'medium' | 'high';

export interface EffectsConfig {
  homeWave: {
    enabled: boolean;
    intensity: HomeWaveIntensity;
  };
  seasonal: {
    enabled: boolean;
    /**
     * auto follows the visitor's current month:
     * Mar-May spring, Jun-Aug summer, Sep-Nov autumn, Dec-Feb winter.
     */
    season: SeasonalEffectSeason;
    density: VisualEffectDensity;
    showOnMobile: boolean;
    respectReducedMotion: boolean;
    seasons: {
      spring: boolean;
      summer: boolean;
      autumn: boolean;
      winter: boolean;
    };
  };
}

export interface ThemeConfig extends UserThemeOverrides {
  mode: 'light' | 'dark' | 'system';
  primary: string;
  typography: NonNullable<UserThemeOverrides['typography']> & {
    fontFamilies: FontFamilyRoles;
    baseSize: number;
    lineHeight: number;
  };
  shape: Shape;
  background: BackgroundConfig;
  effects: EffectsConfig;
}
