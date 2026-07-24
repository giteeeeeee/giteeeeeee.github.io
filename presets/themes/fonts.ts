import type { FontFamilyRoles } from '../../src/design-system/theme';

const fallbackSans = '"Noto Sans SC Variable", "PingFang SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif';
const roundedLatin = '"Nunito Variable"';
const roundedCjk = '"寒蝉全圆体"';
const serifLatin = 'ui-serif, Georgia, Cambria, "Times New Roman"';
const serifCjk = '"Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", serif';
const calligraphicLatin = '"Iowan Old Style", Baskerville, "Times New Roman", ui-serif, serif';
const calligraphicCjk = '"Kaiti SC", STKaiti, KaiTi, "楷体", serif';
const cleanSans = `Inter, "Helvetica Neue", Arial, ${fallbackSans}`;

export const fontStacks = {
  /** Legacy aliases remain the default rounded stack. */
  latin: roundedLatin,
  cjk: roundedCjk,
  fallback: fallbackSans,
  mono: 'ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  rounded: {
    global: `${roundedLatin}, ${roundedCjk}, ${fallbackSans}`,
  },
  paper: {
    global: `${serifLatin}, ${serifCjk}`,
  },
  ink: {
    global: `${calligraphicLatin}, ${calligraphicCjk}`,
  },
  clean: {
    global: cleanSans,
  },
} as const;

export function createFontRoles(
  global: string,
  roles: Partial<Omit<FontFamilyRoles, 'global' | 'mono'>> = {},
): FontFamilyRoles {
  return {
    global,
    brand: roles.brand || global,
    navigation: roles.navigation || global,
    heading: roles.heading || global,
    body: roles.body || global,
    metadata: roles.metadata || global,
    prose: roles.prose || global,
    proseHeading: roles.proseHeading || global,
    mono: fontStacks.mono,
  };
}
