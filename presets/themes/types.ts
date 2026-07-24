import type {
  BackgroundConfig,
  EffectsConfig,
  ThemeConfig,
} from '../../src/app/config/theme.types';
import type { FontFamilyRoles, Shape } from '../../src/design-system/theme';

export interface ThemePresetDefinition {
  name: string;
  nameZh: string;
  description: string;
  config: ThemeConfig;
}

export type ThemePresetOverrides =
  & Omit<Partial<ThemeConfig>, 'source' | 'typography' | 'shape' | 'background' | 'effects'>
  & {
    source?: NonNullable<ThemeConfig['source']>;
    typography?: Partial<Omit<ThemeConfig['typography'], 'fontFamilies' | 'scale'>> & {
      fontFamilies?: Partial<FontFamilyRoles>;
      scale?: NonNullable<ThemeConfig['typography']['scale']>;
    };
    shape?: Partial<Shape>;
    background?: Partial<BackgroundConfig> & {
      imageStyle?: BackgroundConfig['imageStyle'];
      gradient?: BackgroundConfig['gradient'];
    };
    effects?: {
      homeWave?: Partial<EffectsConfig['homeWave']>;
      seasonal?: Partial<EffectsConfig['seasonal']> & {
        seasons?: Partial<EffectsConfig['seasonal']['seasons']>;
      };
    };
  };
