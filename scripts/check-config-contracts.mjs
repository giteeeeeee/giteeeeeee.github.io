import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createUserContactLinks } from '../src/app/config/user-contact.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const readSource = (path) => readFile(`${root}/${path}`, 'utf8');

const fixtureUser = {
  name: 'Example Owner',
  avatar: '/avatar.png',
  location: '',
  contact: {
    email: 'owner@example.com',
    twitter: 'https://x.com/example_owner',
    website: 'https://example.com',
    additionalLinks: [
      {
        id: 'mastodon',
        label: 'Mastodon',
        url: 'https://social.example/@owner',
        displayValue: '@owner',
        icon: 'i-simple-icons:mastodon',
      },
      {
        id: 'duplicate-website',
        label: 'Duplicate website',
        url: 'https://example.com',
        icon: 'i-carbon:earth',
      },
    ],
  },
  github: {
    username: 'example-owner',
    token: '',
  },
};

const contacts = createUserContactLinks(fixtureUser);
assert.deepEqual(
  contacts.map(({ id, href }) => ({ id, href })),
  [
    { id: 'email', href: 'mailto:owner@example.com' },
    { id: 'twitter', href: 'https://x.com/example_owner' },
    { id: 'website', href: 'https://example.com' },
    { id: 'github', href: 'https://github.com/example-owner' },
    { id: 'mastodon', href: 'https://social.example/@owner' },
  ],
  'contact values should normalize once and duplicate URLs should be removed',
);

const consumerContracts = new Map([
  ['src/features/home/components/ActivityStreamSection.astro', 'getUserContactLinks'],
  ['src/features/home/components/HeroSection.astro', 'getUserContactLinks'],
  ['src/pages/about/index.astro', 'getUserContactLinks'],
  ['src/pages/links/index.astro', 'getUserContactLinks'],
  ['src/pages/guestbook/index.astro', 'getUserContactLinks'],
  ['src/shared/components/Footer.astro', 'getUserContactLinks'],
]);

for (const [path, getter] of consumerContracts) {
  const source = await readSource(path);
  assert.ok(source.includes(getter), `${path} must consume ${getter}`);
}

const [linksConfig, projectsConfig, userConfig, header] = await Promise.all([
  readSource('src/app/config/links.config.ts'),
  readSource('src/app/config/projects.config.ts'),
  readSource('src/app/config/user.config.ts'),
  readSource('src/shared/components/Header.astro'),
]);

assert.doesNotMatch(linksConfig, /^\s*(contacts|mySiteInfo):/m, 'Links config must not redefine personal contact or site identity');
assert.doesNotMatch(projectsConfig, /^\s*(githubUsername|githubConfig):/m, 'Projects config must not redefine GitHub identity');
assert.doesNotMatch(userConfig, /^\s*socialNetworks:/m, 'About config must not redefine social contacts');
assert.match(header, /src=\{user\.avatar\}/, 'Header avatar must come from the user profile');

const [themeConfig, presetIndex, backgroundComponent, documentShell, presetIdentities] = await Promise.all([
  readSource('src/app/config/theme.config.ts'),
  readSource('presets/themes/index.ts'),
  readSource('src/shared/components/Background.astro'),
  readSource('src/app/layouts/base/DocumentShell.astro'),
  readSource('src/design-system/styles/preset-identities.css'),
]);

assert.match(themeConfig, /defineTheme\(\{[\s\S]*?preset:\s*'technology'/, 'technology should remain the default theme preset');
assert.doesNotMatch(themeConfig, /export const themeOverrides/, 'theme settings should use one user-facing configuration object');
assert.match(themeConfig, /background:\s*\{[\s\S]*?type:\s*'image'/, 'theme config should expose a discoverable background example');
assert.match(presetIndex, /export function defineTheme/, 'the preset registry must expose the unified theme builder');
assert.match(documentShell, /data-theme-preset=\{themeConfig\.preset\}/, 'the resolved preset identity must reach the document root');
assert.match(documentShell, /data-theme-default=\{themeConfig\.mode\}/, 'the configured default mode must reach the document root');
assert.match(documentShell, /preset-identities\.css/, 'the document shell must load preset component identities');

const presetDecorations = {
  technology: 'aurora',
  paper: 'paper',
  eink: 'eink',
  forest: 'paper',
  editorial: 'plain',
  inkwash: 'inkwash',
  'monochrome-ink': 'monochrome-ink',
  'anime-spring': 'anime-spring',
  'anime-night': 'anime-night',
  ukiyo: 'ukiyo',
  ocean: 'ocean',
  'retro-terminal': 'terminal',
};

for (const [preset, decoration] of Object.entries(presetDecorations)) {
  const source = await readSource(`presets/themes/${preset}.ts`);
  const registryKey = preset.includes('-') ? `'${preset}'` : preset;
  assert.match(presetIndex, new RegExp(`${registryKey}:`), `${preset} must be exported by the theme preset registry`);
  assert.match(source, /satisfies ThemePresetDefinition/, `${preset} must satisfy the shared preset contract`);
  assert.match(source, new RegExp(`decoration:\\s*'${decoration}'`), `${preset} must choose the ${decoration} background decoration`);
}

const [paperPreset, einkPreset] = await Promise.all([
  readSource('presets/themes/paper.ts'),
  readSource('presets/themes/eink.ts'),
]);
assert.match(paperPreset, /variant:\s*'neutral'/, 'paper should use the low-chroma MD3 Neutral variant');
assert.match(einkPreset, /variant:\s*'monochrome'/, 'eink should keep the MD3 Monochrome variant');

for (const decoration of ['paper', 'eink', 'plain', 'inkwash', 'monochrome-ink', 'anime-spring', 'anime-night', 'ukiyo', 'ocean', 'terminal']) {
  assert.match(backgroundComponent, new RegExp(`decoration-${decoration}`), `Background must implement the ${decoration} decoration`);
}

for (const preset of ['inkwash', 'monochrome-ink', 'anime-spring', 'anime-night', 'ukiyo', 'ocean', 'retro-terminal']) {
  assert.match(
    presetIdentities,
    new RegExp(`data-theme-preset=['"]${preset}['"]`),
    `${preset} must define a component-level visual identity`,
  );
}

assert.match(presetIdentities, /--md-sys-color-background:\s*#020503/, 'retro terminal must enforce a near-black CRT background');
assert.match(presetIdentities, /--md-sys-color-primary:\s*#72ff92/, 'retro terminal must expose a phosphor-green primary color');
assert.match(presetIdentities, /repeating-linear-gradient\(to bottom/, 'retro terminal must include scanlines');
assert.match(backgroundComponent, /decoration-inkwash \.scene-back/, 'inkwash must render a distant mountain layer');
assert.match(backgroundComponent, /decoration-inkwash \.scene-mid/, 'inkwash must render a middle mountain layer');
assert.match(backgroundComponent, /decoration-inkwash \.scene-front/, 'inkwash must render a foreground ink and mist layer');
assert.match(backgroundComponent, /decoration-monochrome-ink \.scene-back/, 'monochrome ink must render a distant ink mountain layer');
assert.match(backgroundComponent, /decoration-monochrome-ink \.scene-front::after/, 'monochrome ink must render a vermilion seal');
assert.match(presetIdentities, /data-theme-preset=['"]monochrome-ink['"]/, 'monochrome ink must define a component identity');
assert.match(presetIdentities, /--reay-ink-vermilion:\s*var\(--md-sys-color-tertiary\)/, 'monochrome ink must expose a restrained vermilion accent');
assert.match(presetIdentities, /--md-sys-color-background:\s*#f7f7f4/, 'monochrome ink light mode must keep a neutral paper background');
assert.match(presetIdentities, /--md-sys-color-background:\s*#101110/, 'monochrome ink dark mode must keep a neutral ink background');
assert.match(presetIdentities, /font-weight:\s*500\s*!important/, 'monochrome ink headings must keep a restrained calligraphic weight');

console.log('Configuration single-source contracts passed.');
