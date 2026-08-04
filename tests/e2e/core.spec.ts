import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import {
  defineTheme,
  fontStacks,
  themePresetNames,
} from '../../presets/themes';

test('one theme object combines presets with intuitive color and nested overrides', () => {
  const theme = defineTheme({
    preset: 'paper',
    primary: '#336699',
    typography: {
      fontFamilies: { global: '"Example Rounded"' },
    },
    background: {
      type: 'image',
      decoration: 'plain',
      imageUrl: '/images/background.jpg',
      imageStyle: { opacity: 0.72 },
    },
  });

  expect(theme.preset).toBe('paper');
  expect(theme.primary).toBe('#336699');
  expect(theme.source).toEqual({ primary: '#336699', variant: 'neutral' });
  expect(theme.shape.radiusLg).toBe('14px');
  expect(theme.background).toMatchObject({
    type: 'image',
    decoration: 'plain',
    imageUrl: '/images/background.jpg',
    imageStyle: { size: 'cover', opacity: 0.72 },
    gradient: { useMD3Colors: true, direction: '150deg' },
  });
  expect(theme.typography.fontFamilies.global).toBe('"Example Rounded"');
  expect(theme.typography.fontFamilies.heading).toBe('"Example Rounded"');
  expect(theme.typography.fontFamilies.navigation).toBe(fontStacks.rounded.global);

  const recoloredEink = defineTheme({ preset: 'eink', primary: '#3A4A52' });
  expect(recoloredEink.source).toEqual({
    primary: '#3A4A52',
    variant: 'monochrome',
  });

  const advanced = defineTheme({
    preset: 'forest',
    primary: '#111111',
    source: {
      primary: '#222222',
      secondary: '#777777',
      variant: 'monochrome',
    },
  });

  expect(advanced.primary).toBe('#222222');
  expect(advanced.source).toEqual({
    primary: '#222222',
    secondary: '#777777',
    variant: 'monochrome',
  });
});

test('expressive presets expose complete palettes, identity modes, typography, shapes, and background scenes', () => {
  const expressivePresets = {
    inkwash: { decoration: 'inkwash', mode: 'system' },
    'monochrome-ink': { decoration: 'monochrome-ink', mode: 'light' },
    'anime-spring': { decoration: 'anime-spring', mode: 'system' },
    'anime-night': { decoration: 'anime-night', mode: 'dark' },
    'cosmic-abyss': { decoration: 'cosmic-abyss', mode: 'dark' },
    ukiyo: { decoration: 'ukiyo', mode: 'system' },
    ocean: { decoration: 'ocean', mode: 'system' },
    'retro-terminal': { decoration: 'terminal', mode: 'dark' },
  } as const;

  expect(themePresetNames).toEqual([
    'technology',
    'paper',
    'eink',
    'forest',
    'editorial',
    ...Object.keys(expressivePresets),
  ]);

  for (const [preset, identity] of Object.entries(expressivePresets)) {
    const theme = defineTheme({ preset: preset as keyof typeof expressivePresets });
    expect(theme.mode).toBe(identity.mode);
    expect(theme.source?.primary).toBe(theme.primary);
    expect(theme.typography.fontFamilies.global.length).toBeGreaterThan(0);
    expect(theme.shape.radiusLg.length).toBeGreaterThan(0);
    expect(theme.background).toMatchObject({
      type: 'gradient',
      decoration: identity.decoration,
      blur: false,
      gradient: { useMD3Colors: true },
    });
  }

  const monochromeInk = defineTheme({ preset: 'monochrome-ink' });
  expect(monochromeInk.typography.fontFamilies.global).toContain('Kaiti SC');
  expect(monochromeInk.source).toMatchObject({
    primary: '#242321',
    tertiary: '#A7352A',
    variant: 'neutral',
  });
});

test('language, theme, and client navigation stay synchronized', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('YOUR_NAME');
  await expect(page.getByText('about.hobbies.title')).toHaveCount(0);

  const languageButton = page.getByRole('button', { name: '切换语言' });
  await languageButton.click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-user-content="role"]')).toHaveText('YOUR_ROLE');
  await expect(page.locator('[data-user-content="focus.0"]')).toHaveText('YOUR_FOCUS_1');
  await expect(
    page.locator('header').getByRole('link', { name: 'Search', exact: true }),
  ).toBeVisible();

  const themeButton = page.getByRole('button', { name: 'Switch theme (current: system)' });
  await themeButton.click();
  await expect(page.getByRole('button', { name: 'Switch theme (current: light)' })).toBeVisible();

  await page.locator('header').getByRole('link', { name: 'Blog', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByText('Posts', { exact: true })).toBeVisible();
  await expect(page.getByText('Latest', { exact: true })).toBeVisible();
});

test('primary navigation uses canonical directory URLs and restrained transitions', async ({ page }) => {
  await page.goto('/');

  const navigation = page.locator('.site-header nav:visible');
  const hrefs = await navigation.locator('a').evaluateAll(links =>
    links.map(link => link.getAttribute('href')),
  );

  expect(hrefs).toEqual([
    '/',
    '/blog/',
    '/archives/',
    '/projects/',
    '/gallery/',
    '/links/',
    '/guestbook/',
    '/about/',
  ]);
  await expect(navigation.locator('a[href="/blog/"]')).toHaveAttribute('data-astro-prefetch', 'load');
  await expect(navigation.locator('a[href="/archives/"]')).toHaveAttribute('data-astro-prefetch', 'load');
  await expect(navigation.locator('a[href="/projects/"]')).toHaveAttribute('data-astro-prefetch', 'hover');

  const routeDuration = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--reay-route-enter-duration').trim(),
  );
  expect(routeDuration).toMatch(/^(140ms|0?\.14s)$/);
});

test('Pagefind returns local results', async ({ page }) => {
  await page.goto('/search/');
  await expect(page.locator('[data-search-root]')).toHaveAttribute('data-search-state', 'idle');
  await page.getByRole('searchbox').fill('Astro');
  await expect(page).toHaveURL(/\?q=Astro/);
  const expectedResult = page.locator('[data-search-result] > a[href="/blog/astro-3-features/"]');
  await expect(expectedResult).toHaveCount(1, { timeout: 15_000 });
  await expect(expectedResult).toContainText('Astro 3.0 新特性详解');
  await expect(page.locator('[data-search-result]')).not.toHaveCount(0);
});

test('search falls back to Blog and Plog documents when Pagefind is unavailable', async ({ page }) => {
  await page.route('**/pagefind/pagefind.js', route => route.abort());
  await page.goto('/search/');
  await page.getByRole('searchbox').fill('Python');

  await expect(page.locator('[data-search-error]')).toBeVisible();
  await expect(page.locator('[data-search-status]')).toContainText('轻量索引');
  await expect(page.locator('[data-search-result] > a[href="/blog/python-tutorial-01/"]')).toBeVisible();
});

test('Blog and Plog detail back links restore the previous archive state', async ({ page }) => {
  await page.goto('/archives/?type=blog');
  const blogEntry = page.locator('[data-archive-row][data-archive-kind="blog"] > a[href="/blog/test-markdown/"]');
  await expect(blogEntry).toHaveCount(1);
  await blogEntry.click();
  await expect(page).toHaveURL(/\/blog\/test-markdown\/?$/);
  await page.locator('[data-history-back]').click();
  await expect(page).toHaveURL(/\/archives\/\?type=blog$/);

  await page.goto('/archives/?type=plog');
  const plogEntry = page.locator('[data-archive-row][data-archive-kind="plog"] > a[href="/gallery/daily/morning-window/"]');
  await expect(plogEntry).toHaveCount(1);
  await plogEntry.click();
  await expect(page).toHaveURL(/\/gallery\/daily\/morning-window\/?$/);
  await page.locator('[data-history-back]').click();
  await expect(page).toHaveURL(/\/archives\/\?type=plog$/);
});

test('custom 404 title follows the selected language', async ({ page }) => {
  const response = await page.goto('/definitely-missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('这一页暂时走丢了');

  await page.getByRole('button', { name: '切换语言' }).click();
  await expect(page).toHaveTitle('This page seems to have wandered away');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page seems to have wandered away');
});

test('gallery lightbox renders an image or an explicit fallback', async ({ page }) => {
  await page.goto('/gallery/daily/morning-window/');
  const trigger = page.locator('.photo-journal .photo-open');
  await expect(page.locator('#gallery-lightbox')).toHaveAttribute('data-initialized', 'true');
  await trigger.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: '关闭' })).toBeFocused();

  const image = dialog.locator('[data-lightbox-image]');
  const source = await image.getAttribute('src');
  if (source) {
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  } else {
    await expect(image).toBeHidden();
    await expect(dialog.locator('[data-lightbox-fallback]')).toBeVisible();
  }

  await page.getByRole('button', { name: '关闭' }).click();
  await expect(trigger).toBeFocused();
});

test('mobile navigation has no horizontal overflow and exposes its state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.locator('[data-home-now]')).toHaveCount(1);
  await page.locator('[data-home-heatmap]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-heatmap]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  const menuButton = page.getByRole('button', { name: '打开菜单' });
  await menuButton.click();
  await expect(page.getByRole('button', { name: '关闭菜单' })).toHaveAttribute('aria-expanded', 'true');
});

test('homepage exposes the unchanged Hero and asymmetric editorial showcase', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#fullpage-container[data-home-layout="flow"]')).toHaveCount(1);
  await expect(page.locator('[data-section="hero"]')).toHaveCount(1);
  await expect(page.locator('[data-section="activity"]')).toHaveCount(1);
  await expect(page.locator('[data-section="posts"], [data-section="projects"], [data-section="explore"]')).toHaveCount(0);
  await expect(page.locator('[data-home-stream]')).toHaveCount(1);
  await expect(page.locator('[data-home-editorial]')).toHaveCount(1);
  await expect(page.locator('[data-home-now]')).toHaveCount(1);
  await expect(page.locator('[data-home-showcase]')).toHaveCount(1);
  await expect(page.locator('[data-home-site]')).toHaveCount(1);
  await expect(page.locator('[data-home-wayfinder]')).toHaveCount(0);
  await expect(page.locator('[data-home-heatmap]')).toHaveCount(1);
  await expect(page.locator('[data-home-showcase-post]')).toHaveCount(4);
  await expect(page.locator('.home-project-shelf')).toHaveCount(0);
  await expect(page.locator('[data-home-showcase-project]')).toHaveCount(0);
  await expect(page.locator('[data-home-showcase-plog]')).toHaveCount(2);
  expect(await page.locator('.home-heatmap-grid .home-heatmap-day').count()).toBeGreaterThanOrEqual(365);
});

test('default technology preset reaches the rendered background and component shape tokens', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'technology');
  await expect(page.locator('html')).toHaveAttribute('data-theme-default', 'system');
  await expect(page.locator('.app-background.decoration-aurora')).toHaveCount(1);
  await expect(page.locator('.app-background .scene-layer')).toHaveCount(3);

  const theme = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const primaryButton = document.querySelector<HTMLElement>('.hero-primary-btn')!;

    return {
      radiusLg: root.getPropertyValue('--radius-lg').trim(),
      radiusPill: root.getPropertyValue('--radius-pill').trim(),
      buttonRadius: getComputedStyle(primaryButton).borderRadius,
    };
  });

  expect(theme).toEqual({
    radiusLg: '1.48rem',
    radiusPill: '999px',
    buttonRadius: '999px',
  });
});

test('blog table of contents keeps its reading percentage centered in a complete progress ring', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/blog/test-markdown/');

  const progress = page.locator('[data-toc-progress-circle]');
  await expect(progress).toHaveCount(1);
  await expect(progress).toHaveAttribute('aria-valuenow', '0');

  await page.evaluate(() => {
    const content = document.querySelector<HTMLElement>('[data-post-reading-content]')!;
    const contentBottom = content.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo(0, contentBottom - window.innerHeight);
  });

  await expect.poll(async () => progress.getAttribute('aria-valuenow')).toBe('100');

  const geometry = await progress.evaluate((element) => {
    const wrapper = element.getBoundingClientRect();
    const svg = element.querySelector<SVGElement>('.progress-ring')!.getBoundingClientRect();
    const text = element.querySelector<HTMLElement>('[data-toc-progress]')!.getBoundingClientRect();
    const ring = element.querySelector<SVGCircleElement>('[data-progress-ring]')!;

    return {
      wrapper: { width: wrapper.width, height: wrapper.height },
      svg: { width: svg.width, height: svg.height },
      centerDelta: {
        x: Math.abs((text.left + text.width / 2) - (wrapper.left + wrapper.width / 2)),
        y: Math.abs((text.top + text.height / 2) - (wrapper.top + wrapper.height / 2)),
      },
      dasharray: getComputedStyle(ring).strokeDasharray,
      dashoffset: ring.style.strokeDashoffset,
      transform: getComputedStyle(element.querySelector<SVGElement>('.progress-ring')!).transform,
    };
  });

  expect(geometry.svg.width).toBeCloseTo(geometry.wrapper.width, 1);
  expect(geometry.svg.height).toBeCloseTo(geometry.wrapper.height, 1);
  expect(geometry.centerDelta.x).toBeLessThanOrEqual(1);
  expect(geometry.centerDelta.y).toBeLessThanOrEqual(1);
  expect(geometry.dasharray).toBe('100px');
  expect(geometry.dashoffset).toBe('0');
  expect(geometry.transform).toBe('none');
});

test('configured contact and site identity propagate across public surfaces', async ({ page }) => {
  const website = 'https://yourusername.github.io';

  await page.goto('/');
  await expect(page.locator('[data-home-now] [data-contact-kind="website"]')).toHaveAttribute('href', website);
  await expect(page.locator('footer [data-contact-kind="website"]')).toHaveAttribute('href', website);

  await page.goto('/about/');
  await expect(page.locator('.socials-section [data-contact-kind="website"]')).toHaveAttribute('href', website);
  await expect(page.locator('[data-about-intro] h2')).toHaveText('YOUR_NAME');

  await page.goto('/links/');
  await expect(page.locator('.contact-buttons [data-contact-kind="website"]')).toHaveAttribute('href', website);
  await expect(page.locator('.site-info-card [data-copy="YOUR_NAME"]')).toHaveCount(1);
  await expect(page.locator(`.site-info-card [data-copy="${website}"]`)).toHaveCount(1);
});

test('homepage applies the compact config-driven typography scale', async ({ page }) => {
  await page.goto('/');

  await expect.poll(() => page.evaluate(() => document.fonts.check('15px "Nunito Variable"'))).toBe(true);
  await expect.poll(() => page.evaluate(async () => {
    const faces = await document.fonts.load('15px "寒蝉全圆体"', '中文归档');
    return faces.length > 0 && document.fonts.check('15px "寒蝉全圆体"', '中文归档');
  })).toBe(true);
  await expect.poll(() => page.evaluate(async () => {
    const faces = await document.fonts.load('15px "Noto Sans SC Variable"', '中文归档');
    return faces.length > 0 && document.fonts.check('15px "Noto Sans SC Variable"', '中文归档');
  })).toBe(true);
  const typography = await page.evaluate(() => ({
    configuredFamily: getComputedStyle(document.documentElement).getPropertyValue('--reay-font-sans'),
    family: getComputedStyle(document.body).fontFamily,
    root: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
    hero: Number.parseFloat(getComputedStyle(document.querySelector('h1')!).fontSize),
    section: Number.parseFloat(getComputedStyle(document.querySelector('.home-showcase-header h2')!).fontSize),
    feature: Number.parseFloat(getComputedStyle(document.querySelector('.home-writing-lead h3')!).fontSize),
  }));

  expect(typography.configuredFamily).toContain('Nunito Variable');
  expect(typography.configuredFamily).toContain('寒蝉全圆体');
  expect(typography.configuredFamily).toContain('Noto Sans SC Variable');
  expect(typography.family).toContain('Nunito Variable');
  expect(typography.family).toContain('寒蝉全圆体');
  expect(typography.family).toContain('Noto Sans SC Variable');
  expect(typography.root).toBe(15);
  expect(typography.hero).toBeLessThanOrEqual(36);
  expect(typography.section).toBeLessThanOrEqual(24.3);
  expect(typography.feature).toBeLessThanOrEqual(22.2);
});

test('role-based typography falls back globally and propagates to the intended surfaces', async ({ page }) => {
  await page.goto('/blog/test-markdown/');

  const typography = await page.evaluate(() => ({
    roles: [
      'global', 'brand', 'navigation', 'heading', 'body', 'metadata', 'prose', 'prose-heading',
    ].map((role) => getComputedStyle(document.documentElement).getPropertyValue(`--reay-font-${role}`)),
    mono: getComputedStyle(document.documentElement).getPropertyValue('--reay-font-mono'),
  }));

  for (const role of typography.roles) {
    expect(role).toContain('Nunito Variable');
    expect(role).toContain('寒蝉全圆体');
    expect(role).toContain('Noto Sans SC Variable');
  }
  expect(typography.mono).toContain('SFMono-Regular');

  const propagated = await page.evaluate(() => {
    const root = document.documentElement.style;
    root.setProperty('--reay-font-brand', 'serif');
    root.setProperty('--reay-font-navigation', 'monospace');
    root.setProperty('--reay-font-heading', 'cursive');
    root.setProperty('--reay-font-body', 'sans-serif');
    root.setProperty('--reay-font-metadata', 'serif');
    root.setProperty('--reay-font-prose', 'serif');
    root.setProperty('--reay-font-prose-heading', 'cursive');
    const family = (selector: string) => getComputedStyle(document.querySelector(selector)!).fontFamily;

    return {
      brand: family('.brand-link'),
      navigation: family('.site-header nav'),
      heading: family('.post-header h1'),
      body: getComputedStyle(document.body).fontFamily,
      metadata: family('.post-meta time'),
      prose: family('.prose'),
      proseHeading: family('.prose h2'),
      code: family('.prose pre'),
    };
  });

  expect(propagated).toEqual({
    brand: 'serif',
    navigation: 'monospace',
    heading: 'cursive',
    body: 'sans-serif',
    metadata: 'serif',
    prose: 'serif',
    proseHeading: 'cursive',
    code: expect.stringContaining('SFMono-Regular'),
  });

  await page.goto('/gallery/daily/morning-window/');
  const plogTypography = await page.evaluate(() => {
    document.documentElement.style.setProperty('--reay-font-prose', 'serif');
    return {
      narrative: getComputedStyle(document.querySelector('[data-plog-prose]')!).fontFamily,
      caption: getComputedStyle(document.querySelector('.photo-note > p')!).fontFamily,
    };
  });
  expect(plogTypography).toEqual({ narrative: 'serif', caption: 'serif' });
});

test('desktop homepage keeps only the Hero viewport-sized', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const layout = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>('[data-section="hero"]')!;
    const content = Array.from(document.querySelectorAll<HTMLElement>('[data-section="activity"]'));
    const contentTop = content[0].offsetTop;
    const contentBottom = content.at(-1)!.offsetTop + content.at(-1)!.offsetHeight;
    return {
      heroHeight: Math.round(hero.getBoundingClientRect().height),
      contentHeight: Math.round(contentBottom - contentTop),
      content: content.map((element) => ({
        id: element.dataset.section,
        position: getComputedStyle(element).position,
        minHeight: getComputedStyle(element).minHeight,
      })),
    };
  });

  expect(layout.heroHeight).toBeGreaterThanOrEqual(800);
  expect(layout.heroHeight).toBeLessThanOrEqual(845);
  expect(layout.contentHeight).toBeLessThanOrEqual(2300);
  for (const section of layout.content) {
    expect(section.position, `${section.id} should stay in normal flow`).toBe('relative');
    expect(section.minHeight, `${section.id} should use content height`).toBe('0px');
  }
});

test('public index pages share the compact editorial page contract', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const paths = [
    '/blog/',
    '/archives/',
    '/archives/tags/',
    '/archives/series/',
    '/archives/timeline/',
    '/projects/',
    '/gallery/',
    '/about/',
    '/links/',
    '/guestbook/',
    '/search/',
  ];

  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator('[data-editorial-page]'), `${path} should use the editorial flow`).toHaveCount(1);
    await expect(page.locator('[data-editorial-page-header]'), `${path} should use the shared page header`).toHaveCount(1);

    const layout = await page.evaluate(() => {
      const root = document.documentElement;
      const header = document.querySelector<HTMLElement>('[data-editorial-page-header]')!;
      const nextSection = header.nextElementSibling as HTMLElement | null;
      return {
        overflow: root.scrollWidth - root.clientWidth,
        titleSize: Number.parseFloat(getComputedStyle(header.querySelector('h1')!).fontSize),
        headerBottom: Math.round(header.getBoundingClientRect().bottom),
        nextSectionTop: nextSection ? Math.round(nextSection.getBoundingClientRect().top) : 0,
      };
    });

    expect(layout.overflow, `${path} should not overflow horizontally`).toBeLessThanOrEqual(0);
    expect(layout.titleSize, `${path} title should stay compact`).toBeLessThanOrEqual(39);
    expect(layout.headerBottom, `${path} header should stay above the fold`).toBeLessThanOrEqual(340);
    expect(layout.nextSectionTop, `${path} should expose real content promptly`).toBeLessThanOrEqual(410);
  }
});

test('guestbook keeps the conversation compact and visitor-facing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/guestbook/');

  const flow = page.locator('[data-guestbook-flow]');
  const commentSection = page.locator('[data-comment-section]');
  const unavailable = page.locator('[data-comment-unavailable]');

  await expect(flow).toBeVisible();
  await expect(page.locator('.guestbook-guidelines li')).toHaveCount(3);
  await expect(commentSection).toHaveAttribute('data-comment-mode', 'guestbook');
  await expect(commentSection).toHaveAttribute('data-ready', 'false');
  await expect(unavailable).toContainText('留言簿正在准备中');
  await expect(page.locator('.comment-fallback-links [data-contact-kind="social"]')).not.toHaveCount(0);
  await expect(page.locator('.comment-panel, .comment-meta, [data-comment-config]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/Provider|Thread|comments\.config\.ts/);

  const desktopLayout = await flow.evaluate((element) => {
    const root = document.documentElement;
    const rect = element.getBoundingClientRect();
    const unavailableRect = element.querySelector<HTMLElement>('[data-comment-unavailable]')!.getBoundingClientRect();
    return {
      centerDelta: Math.abs(rect.left + rect.right - root.clientWidth),
      overflow: root.scrollWidth - root.clientWidth,
      statusTop: unavailableRect.top,
    };
  });
  expect(desktopLayout.centerDelta).toBeLessThanOrEqual(2);
  expect(desktopLayout.overflow).toBeLessThanOrEqual(0);
  expect(desktopLayout.statusTop).toBeLessThan(900);

  await page.getByRole('button', { name: '切换语言' }).click();
  await expect(unavailable).toContainText('The guestbook is being prepared');
  await expect(page.locator('.guestbook-guidelines')).toHaveAttribute('aria-label', 'Before leaving a note');
  await expect(page.locator('.comment-fallback-links')).toHaveAttribute('aria-label', 'Elsewhere');

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileLayout = await flow.evaluate((element) => {
    const root = document.documentElement;
    const rect = element.getBoundingClientRect();
    const unavailableRect = element.querySelector<HTMLElement>('[data-comment-unavailable]')!.getBoundingClientRect();
    return {
      withinViewport: rect.left >= 0 && rect.right <= root.clientWidth,
      overflow: root.scrollWidth - root.clientWidth,
      statusTop: unavailableRect.top,
    };
  });
  expect(mobileLayout.withinViewport).toBe(true);
  expect(mobileLayout.overflow).toBeLessThanOrEqual(0);
  expect(mobileLayout.statusTop).toBeLessThan(844);
});

test('editorial details and archives do not regress into card walls', async ({ page }) => {
  await page.goto('/archives/');
  await expect(page.locator('[data-archive-explorer]')).toHaveCount(1);
  await expect(page.locator('[data-archive-year]')).not.toHaveCount(0);
  await expect(page.locator('[data-archive-topic-panel="all"]')).toBeVisible();
  await expect(page.locator('.archive-nav')).toHaveCount(0);
  expect(await page.locator('[data-archive-row][data-archive-kind="blog"]').count()).toBeGreaterThan(0);
  expect(await page.locator('[data-archive-row][data-archive-kind="plog"]').count()).toBe(6);
  await expect(page.locator('[data-archive-filter]')).toHaveText(['全部', 'Blog', 'Plog']);
  await expect(page.locator('[data-archive-series-shelf]')).toBeVisible();
  expect(await page.locator('[data-archive-series-entry]').count()).toBeLessThanOrEqual(4);
  await expect(page.locator('[data-archive-series-compact]')).toHaveCount(0);
  await expect(page.locator('[data-archive-series-shelf] > header a')).toHaveAttribute('href', '/archives/series/');

  const archiveSwitcher = await page.evaluate(() => {
    const toolbar = getComputedStyle(document.querySelector('[data-archive-toolbar]')!);
    const active = getComputedStyle(document.querySelector('[data-archive-filter].is-active')!);
    return {
      toolbarBackground: toolbar.backgroundColor,
      toolbarRadius: Number.parseFloat(toolbar.borderRadius),
      activeBackground: active.backgroundColor,
      activeWeight: Number.parseFloat(active.fontWeight),
    };
  });
  expect(archiveSwitcher.toolbarBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(archiveSwitcher.toolbarRadius).toBeGreaterThan(0);
  expect(archiveSwitcher.activeBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(archiveSwitcher.activeWeight).toBeLessThanOrEqual(700);

  await page.locator('[data-archive-filter="plog"]').click();
  await expect(page.locator('[data-archive-row][data-archive-kind="blog"]').first()).toBeHidden();
  await expect(page.locator('[data-archive-row][data-archive-kind="plog"]').first()).toBeVisible();
  await expect(page.locator('[data-archive-topic-panel="plog"]')).toBeVisible();
  await expect(page.locator('[data-archive-topic-panel="all"]')).toBeHidden();
  await expect(page.locator('[data-archive-series-shelf]')).toBeHidden();
  await expect(page.locator('.archive-main .reay-card, .series-progress')).toHaveCount(0);

  await page.goto('/links/');
  const linkCard = page.locator('[data-link-card]').first();
  const linkPreview = linkCard.locator('[data-link-preview]');
  await expect(linkCard).toHaveAttribute('data-preview-ready', 'true');
  await expect(linkPreview).not.toHaveAttribute('src', /.+/);
  const linkEntryStyle = await linkCard.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      background: style.backgroundColor,
      width: rect.width,
      ratio: rect.width / rect.height,
      radius: style.borderRadius,
      shadow: style.boxShadow,
    };
  });
  expect(linkEntryStyle.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(linkEntryStyle.width).toBeLessThanOrEqual(360);
  expect(linkEntryStyle.ratio).toBeCloseTo(16 / 9, 1);
  expect(Number.parseFloat(linkEntryStyle.radius)).toBeGreaterThan(0);
  expect(linkEntryStyle.shadow).not.toBe('none');
  await expect(linkCard.locator('.link-backdrop')).toHaveCount(1);
  await expect(linkCard).toHaveAttribute('data-preview-src', /api\.microlink\.io/);
  const fallbackStyle = await linkCard.locator('.link-backdrop').evaluate((element) => {
    element.closest('[data-link-card]')?.classList.remove('has-preview');
    const image = element.querySelector('img')!;
    return {
      opacity: Number.parseFloat(getComputedStyle(element).opacity),
      filter: getComputedStyle(image).filter,
    };
  });
  expect(fallbackStyle.opacity).toBeGreaterThanOrEqual(0.6);
  expect(fallbackStyle.filter).toContain('blur(7px)');
  await linkCard.hover();
  await expect(linkPreview).toHaveAttribute('src', /api\.microlink\.io/);

  await page.goto('/projects/');
  await expect(page.locator('[data-editorial-page-header]')).toHaveCount(1);
  await expect(page.locator('.stat-card')).toHaveCount(0);
});

test('tag and series directories keep a centered, compact editorial rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/archives/tags/');

  const tagLayout = await page.evaluate(() => {
    const flow = document.querySelector<HTMLElement>('.tag-page-flow')!;
    const rect = flow.getBoundingClientRect();
    const tagLinks = Array.from(document.querySelectorAll<HTMLElement>('[data-tag-map] a'));
    const rank = document.querySelector<HTMLElement>('.tag-rank')!;
    return {
      centerDelta: Math.abs(rect.left + rect.right - document.documentElement.clientWidth),
      maxFontSize: Math.max(...tagLinks.map((link) => Number.parseFloat(getComputedStyle(link).fontSize))),
      maxFontWeight: Math.max(...tagLinks.map((link) => Number.parseFloat(getComputedStyle(link).fontWeight))),
      rankFamily: getComputedStyle(rank).fontFamily,
      titleWeight: Number.parseFloat(getComputedStyle(document.querySelector('[data-editorial-page-header] h1')!).fontWeight),
    };
  });
  expect(tagLayout.centerDelta).toBeLessThanOrEqual(2);
  expect(tagLayout.maxFontSize).toBeLessThanOrEqual(16);
  expect(tagLayout.maxFontWeight).toBeLessThanOrEqual(720);
  expect(tagLayout.rankFamily).toContain('Nunito Variable');
  expect(tagLayout.rankFamily).not.toContain('SFMono-Regular');
  expect(tagLayout.titleWeight).toBeLessThanOrEqual(760);

  await page.goto('/archives/series/');
  await expect(page.locator('[data-series-index]')).toBeVisible();
  expect(await page.locator('[data-series-entry]').count()).toBeGreaterThan(0);
  const seriesCenterDelta = await page.locator('[data-series-index]').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return Math.abs(rect.left + rect.right - document.documentElement.clientWidth);
  });
  expect(seriesCenterDelta).toBeLessThanOrEqual(2);
});

test('archives keeps popular topics concise and returns topic discovery to filtered results', async ({ page }) => {
  await page.goto('/archives/');

  const popularTopics = page.locator('[data-archive-topic-panel="all"] .archive-popular-topics [data-archive-topic]');
  expect(await popularTopics.count()).toBeLessThanOrEqual(12);

  await page.locator('[data-archive-filter="blog"]').click();
  await expect(page.locator('[data-archive-series-shelf]')).toBeVisible();
  const seriesLink = page.locator('[data-archive-series-entry] > a').first();
  await expect(seriesLink).toHaveAttribute('href', /\/archives\/series\//);
  await seriesLink.click();
  await expect(page).toHaveURL(/\/archives\/series\//);
  await expect(page.locator('.series-chapters')).toBeVisible();

  await page.goto('/archives/');
  const topicTrigger = page.locator('[data-archive-toolbar] [data-archive-topic-dialog-open]');
  await expect(topicTrigger).toHaveAttribute('aria-label', '主题');
  await topicTrigger.click();
  const dialog = page.locator('[data-archive-topic-dialog]');
  await expect(dialog).toBeVisible();
  const desktopDialogCenter = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      horizontal: Math.abs(rect.left + rect.right - document.documentElement.clientWidth),
      vertical: Math.abs(rect.top + rect.bottom - document.documentElement.clientHeight),
    };
  });
  expect(desktopDialogCenter.horizontal).toBeLessThanOrEqual(2);
  expect(desktopDialogCenter.vertical).toBeLessThanOrEqual(2);

  await dialog.locator('[data-archive-topic-sort="alphabetical"]').click();
  await expect(dialog.locator('[data-archive-topic-sort="alphabetical"]')).toHaveAttribute('aria-pressed', 'true');
  await dialog.locator('[data-archive-topic-search]').fill('OOP');
  const matchingTopics = dialog.locator('[data-archive-topic-item]:visible');
  await expect(matchingTopics).toHaveCount(1);
  await expect(matchingTopics).toContainText('#OOP');
  await matchingTopics.click();

  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/type=blog/);
  await expect(page).toHaveURL(/topic=blog-tag%3AOOP/);
  await expect(page.locator('[data-archive-results]')).toBeFocused();
  await expect(page.locator('[data-archive-row][data-archive-kind="blog"]:visible')).toHaveCount(1);
  await expect(page.locator('[data-archive-active-topic]')).toContainText('OOP');

  await page.locator('[data-archive-clear]').click();
  await expect(page).not.toHaveURL(/topic=/);
  await expect(page.locator('[data-archive-clear]')).toBeHidden();
  expect(await page.locator('[data-archive-row][data-archive-kind="blog"]:visible').count()).toBeGreaterThan(1);
});

test('blog series context exposes structural position and adjacent chapters', async ({ page }) => {
  await page.goto('/blog/python-tutorial-03/');

  const context = page.locator('[data-post-series-context]');
  const navigation = page.locator('[data-post-series-navigation]');
  await expect(context).toBeVisible();
  await expect(context.locator('[data-series-position-value]:visible')).toHaveText('3 / 5');
  await expect(context.getByRole('link', { name: /Python 入门教程/ })).toHaveAttribute(
    'href',
    '/archives/series/Python%20%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/',
  );

  await expect(navigation).toBeVisible();
  await expect(navigation.locator('[data-series-position-value]:visible')).toHaveText('3 / 5');
  await expect(navigation.locator('[data-series-previous]')).toHaveAttribute('href', '/blog/python-tutorial-02/');
  await expect(navigation.locator('[data-series-next]')).toHaveAttribute('href', '/blog/python-tutorial-04/');
  await expect(navigation.locator('[data-series-previous]')).toContainText('数据结构与函数');
  await expect(navigation.locator('[data-series-next]')).toContainText('文件操作与异常处理');
});

test('archive topic dialog remains usable and overflow-free on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/archives/');
  await page.locator('[data-archive-toolbar] [data-archive-topic-dialog-open]').click();

  const dialog = page.locator('[data-archive-topic-dialog]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-archive-topic-search]')).toBeFocused();
  const mobileDialogCenter = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      horizontal: Math.abs(rect.left + rect.right - document.documentElement.clientWidth),
      vertical: Math.abs(rect.top + rect.bottom - document.documentElement.clientHeight),
    };
  });
  expect(mobileDialogCenter.horizontal).toBeLessThanOrEqual(2);
  expect(mobileDialogCenter.vertical).toBeLessThanOrEqual(2);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect.poll(() => dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('Plog groups moments into collections and About exposes its narrative', async ({ page }) => {
  await page.goto('/gallery/');
  await expect(page.locator('[data-plog-index]')).toHaveCount(1);
  await expect(page.locator('[data-plog-collection]')).toHaveCount(3);
  await expect(page.locator('.moment-entry')).toHaveCount(6);

  await page.goto('/about/');
  await expect(page.locator('[data-about-narrative]')).toHaveCount(1);
  await expect(page.locator('[data-about-intro] [data-user-content="status"]')).toHaveCount(1);
  await expect(page.getByText('访问', { exact: true })).toHaveCount(0);
});

test('all representative route types remain overflow-free on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const paths = [
    '/blog/',
    '/archives/',
    '/archives/tags/',
    '/archives/series/Python%20%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/',
    '/projects/',
    '/gallery/',
    '/about/',
    '/links/',
    '/guestbook/',
    '/search/',
    '/blog/test-markdown/',
    '/gallery/daily/morning-window/',
    '/404.html',
  ];

  for (const path of paths) {
    await page.goto(path);
    const layout = await page.evaluate(() => {
      const root = document.documentElement;
      const title = document.querySelector<HTMLElement>('h1');
      return {
        overflow: root.scrollWidth - root.clientWidth,
        titleSize: title ? Number.parseFloat(getComputedStyle(title).fontSize) : 0,
      };
    });

    expect(layout.overflow, `${path} should not overflow horizontally`).toBeLessThanOrEqual(0);
    expect(layout.titleSize, `${path} mobile title should remain compact`).toBeLessThanOrEqual(39);
  }
});

for (const path of ['/', '/archives/', '/guestbook/', '/search/', '/404.html']) {
  test(`has no automated WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
