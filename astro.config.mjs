// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import sitemap from '@astrojs/sitemap';

// Markdown 配置（集中管理）
import { markdownConfig } from './src/app/config/markdown.config.ts';

// https://astro.build/config
export default defineConfig({
    integrations: [
        UnoCSS({
            injectReset: true,
        }),
        sitemap(),
    ],
    site: process.env.SITE || process.env.PUBLIC_SITE_URL || 'https://example.com',
    // Reay deliberately supports root-path deployments only. This keeps every
    // authored URL, feed, search asset, and canonical on one explicit contract.
    base: '/',
    // GitHub Pages serves directory routes from `<route>/index.html`. Emitting
    // canonical trailing slashes keeps client navigation on the final URL and
    // avoids an extra 301 request for every directory-style route.
    trailingSlash: 'always',
    
    // 使用集中管理的 Markdown 配置
    markdown: markdownConfig,
});
