/**
 * Blog Utilities
 * Helper functions for blog post management and retrieval
 */

import { getCollection, type CollectionEntry } from 'astro:content'
import { isPublishableContentVisible } from './visibility'

const BLOG_FILE_EXTENSION_PATTERN = /\.(md|mdx)$/i

/**
 * Extract slug from post ID for URL generation
 * Format examples:
 * - "welcome/index" -> "welcome"
 * - "typescript-advanced/index" -> "typescript-advanced"
 */
export function getSlugFromPostId(id: string): string {
  let slug = id.replace(BLOG_FILE_EXTENSION_PATTERN, '')
  slug = slug.replace(/\/index$/i, '')
  return slug
}

export function getPostSlug(post: CollectionEntry<'blog'>): string {
  return getSlugFromPostId(post.id)
}

/**
 * Encode a route path while preserving nested separators.
 */
export function encodePathSegments(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .map(segment => encodeURIComponent(segment))
    .join('/')
}

/**
 * Decode Astro route params, including catch-all params.
 */
export function decodeRouteParam(param?: string): string {
  if (!param) {
    return ''
  }

  return param
    .split('/')
    .map(segment => {
      try {
        return decodeURIComponent(segment)
      } catch {
        return segment
      }
    })
    .join('/')
}

/**
 * Generate blog post URL
 */
export function getPostUrl(post: CollectionEntry<'blog'>): string {
  return `/blog/${encodePathSegments(getPostSlug(post))}`
}

export function getTagUrl(tag: string): string {
  return `/archives/tags/${encodeURIComponent(tag)}`
}

export function getSeriesUrl(series: string): string {
  return `/archives/series/${encodeURIComponent(series)}`
}

/**
 * Get all blog posts excluding drafts and unpublished content
 */
export async function getAllPosts() {
  const posts = await getCollection('blog', ({ data }) => isPublishableContentVisible(data))
  return posts
}

/**
 * Sort posts by publish date (newest first)
 */
export function sortPostsByDate(posts: CollectionEntry<'blog'>[]) {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.data.publishDate).valueOf()
    const dateB = new Date(b.data.publishDate).valueOf()
    return dateB - dateA
  })
}

/**
 * Get all published posts sorted by date
 */
export async function getSortedPosts() {
  const posts = await getAllPosts()
  return sortPostsByDate(posts)
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts() {
  const posts = await getAllPosts()
  return sortPostsByDate(posts.filter(post => post.data.featured))
}

/**
 * Get latest posts
 */
export async function getLatestPosts(limit = 6) {
  const posts = await getSortedPosts()
  return posts.slice(0, limit)
}

/**
 * Get post by slug
 * @param slug - Post slug identifier
 * @returns Post entry or undefined if not found
 */
export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts()
  return posts.find(post => getPostSlug(post) === slug)
}

/**
 * Get all tags with their post counts
 * @returns Array of tags sorted by count (descending)
 */
export async function getAllTags() {
  const posts = await getAllPosts()
  const tagMap = new Map<string, number>()
  
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Get posts by tag
 * @param tag - Tag to filter by
 * @returns Sorted posts with the specified tag
 */
export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts()
  return sortPostsByDate(
    posts.filter(post => 
      post.data.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
    )
  )
}

/**
 * Get related posts based on tag matching
 * @param currentPost - Current post to find related posts for
 * @param limit - Maximum number of related posts to return
 * @returns Array of related posts sorted by relevance
 */
export async function getRelatedPosts(currentPost: CollectionEntry<'blog'>, limit = 3) {
  const allPosts = await getAllPosts()
  const currentTags = currentPost.data.tags
  
  // Calculate tag matching score for each post
  const postsWithScore = allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => {
      const matchingTags = post.data.tags.filter(tag => 
        currentTags.includes(tag)
      )
      return {
        post,
        score: matchingTags.length
      }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
  
  return postsWithScore.slice(0, limit).map(item => item.post)
}

/**
 * Format date to localized string
 * @param date - Date to format
 * @returns Formatted date string in Chinese locale
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Calculate reading time based on word count
 * Assumes 200 Chinese characters per minute
 * @param content - Content to calculate reading time for
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content?: string): number {
  const wordsPerMinute = 200
  const words = content?.length ?? 0
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

/**
 * 获取所有系列及其文章数量
 */
export async function getAllSeries() {
  const posts = await getAllPosts()
  const seriesMap = new Map<string, { count: number; posts: CollectionEntry<'blog'>[] }>()
  
  posts.forEach(post => {
    const series = post.data.series
    if (series) {
      if (!seriesMap.has(series)) {
        seriesMap.set(series, { count: 0, posts: [] })
      }
      const seriesData = seriesMap.get(series)!
      seriesData.count++
      seriesData.posts.push(post)
    }
  })
  
  // Sort posts within each series by order
  seriesMap.forEach((data) => {
    data.posts.sort((a, b) => {
      const orderA = a.data.seriesOrder ?? 999
      const orderB = b.data.seriesOrder ?? 999
      return orderA - orderB
    })
  })
  
  return Array.from(seriesMap.entries())
    .map(([series, data]) => ({ series, count: data.count, posts: data.posts }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 根据系列获取文章
 */
export async function getPostsBySeries(series: string) {
  const posts = await getAllPosts()
  const seriesPosts = posts
    .filter(post => post.data.series === series)
    .sort((a, b) => {
      const orderA = a.data.seriesOrder ?? 999
      const orderB = b.data.seriesOrder ?? 999
      return orderA - orderB
    })
  return seriesPosts
}

/**
 * 按年份分组文章
 */
export async function getPostsByYear() {
  const posts = await getSortedPosts()
  const postsByYear = new Map<number, CollectionEntry<'blog'>[]>()
  
  posts.forEach(post => {
    const year = new Date(post.data.publishDate).getFullYear()
    if (!postsByYear.has(year)) {
      postsByYear.set(year, [])
    }
    postsByYear.get(year)!.push(post)
  })
  
  return Array.from(postsByYear.entries())
    .sort((a, b) => b[0] - a[0])
}

/**
 * Group posts by month
 */
export async function getPostsByMonth() {
  const posts = await getSortedPosts()
  const postsByMonth = new Map<string, CollectionEntry<'blog'>[]>()
  
  posts.forEach(post => {
    const date = new Date(post.data.publishDate)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!postsByMonth.has(key)) {
      postsByMonth.set(key, [])
    }
    postsByMonth.get(key)!.push(post)
  })
  
  return Array.from(postsByMonth.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
}

/**
 * Get archive statistics
 */
export async function getArchiveStats() {
  const posts = await getAllPosts()
  const tags = await getAllTags()
  const series = await getAllSeries()
  const postsByYear = await getPostsByYear()

  // calculate total words and average words
  let totalWords = 0
  let maxWords = 0
  let longestPost: CollectionEntry<'blog'> | undefined
  
  posts.forEach(post => {
    const wordCount = post.body?.length || 0
    totalWords += wordCount
    if (wordCount > maxWords) {
      maxWords = wordCount
      longestPost = post
    }
  })
  
  const averageWords = posts.length > 0 ? Math.round(totalWords / posts.length) : 0

  // calculate publish frequency (number of posts / days since first post)
  const sortedPosts = sortPostsByDate(posts)
  const firstPostDate = posts.length > 0 ? sortedPosts[sortedPosts.length - 1].data.publishDate : null
  const latestPostDate = posts.length > 0 ? sortedPosts[0].data.publishDate : null
  
  let publishFrequency = 0
  if (firstPostDate && latestPostDate) {
    const daysSinceFirst = Math.floor((new Date().getTime() - new Date(firstPostDate).getTime()) / (1000 * 60 * 60 * 24))
    publishFrequency = daysSinceFirst > 0 ? posts.length / daysSinceFirst : 0
  }

  // calculate posts published this year
  const currentYear = new Date().getFullYear()
  const postsThisYear = posts.filter(post => 
    new Date(post.data.publishDate).getFullYear() === currentYear
  ).length
  
  return {
    totalPosts: posts.length,
    totalTags: tags.length,
    totalSeries: series.length,
    totalWords,
    averageWords,
    maxWords,
    longestPostTitle: longestPost?.data.title || '',
    totalYears: postsByYear.length,
    postsThisYear,
    publishFrequency: Number(publishFrequency.toFixed(3)),
    firstPostDate,
    latestPostDate
  }
}
