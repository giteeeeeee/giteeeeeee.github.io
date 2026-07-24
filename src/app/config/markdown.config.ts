/**
 * Markdown Rendering Configuration
 * 
 * Centralized configuration for all Markdown-related plugins and options.
 * This file manages syntax highlighting, math rendering, and content processing.
 */

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import { unified } from '@astrojs/markdown-remark'
import { remarkReadingTime } from '../../features/blog/lib/remark-reading-time'
import type { AstroUserConfig } from 'astro'
import { 
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers'

/**
 * Main Markdown configuration
 */
export const markdownConfig: AstroUserConfig['markdown'] = {
  processor: unified({
    // Remark plugins process Markdown syntax.
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkReadingTime,
    ],
    // Rehype plugins process the generated HTML tree.
    rehypePlugins: [
      rehypeSlug,
      rehypeKatex,
    ],
  }),

  // Code highlighting configuration (Shiki)
  shikiConfig: {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    langAlias: {
      gitignore: 'plaintext',
    },
    wrap: true,
    defaultColor: false,
    
    // Advanced code block transformers
    transformers: [
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
    ],
  },

  syntaxHighlight: 'shiki',
}
