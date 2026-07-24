/**
 * Remark Plugin: Calculate Reading Time
 * Automatically calculates and adds reading time to post frontmatter
 */
import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'
import type { Root } from 'mdast'
import type { VFile } from 'vfile'

interface AstroRemarkData {
  astro?: {
    frontmatter?: Record<string, unknown>
  }
}

/**
 * Remark plugin to calculate reading time for markdown content
 * @returns Remark transformer function
 */
export function remarkReadingTime() {
  return function (tree: Root, file: VFile) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage, {
      wordsPerMinute: 200 // Approx. 200 Chinese characters per minute
    })

    const frontmatter = (file.data as AstroRemarkData).astro?.frontmatter
    if (!frontmatter) return

    // Add reading time to frontmatter
    frontmatter.readingTime = readingTime.text
    frontmatter.readingMinutes = Math.ceil(readingTime.minutes)
  }
}
