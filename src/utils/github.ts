/**
 * GitHub API Utilities
 * Fetch repository information and README content
 * 
 * Performance optimizations:
 * - Dual-layer caching (memory + disk)
 * - Parallel requests
 * - ETag conditional requests
 * - Request deduplication
 */
import { getGitHubConfig } from '../data/site.config';
import { githubCache } from './github-cache';

interface GitHubRepo {
  owner: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isArchived: boolean;
  isFork: boolean;
  license: string | null;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionCalendar {
  username: string;
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
  activeDays: number;
  maxCount: number;
  weeks: GitHubContributionDay[][];
  source: 'graphql' | 'events' | 'repos' | 'cache' | 'empty';
}

interface GitHubReadme {
  content: string;
  encoding: string;
}

const GITHUB_API = 'https://api.github.com';
const githubConfig = getGitHubConfig();
const rawGitHubToken = githubConfig.token || import.meta.env.GITHUB_TOKEN;
const GITHUB_TOKEN = rawGitHubToken && !/^your[_-]?github[_-]?token$/i.test(rawGitHubToken)
  ? rawGitHubToken
  : '';
const REQUEST_TIMEOUT_MS = 10000;

const pendingRequests = new Map<string, Promise<any>>();

const getHeaders = (etag?: string, includeToken = true) => {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (includeToken && GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  if (etag) {
    headers['If-None-Match'] = etag;
  }
  return headers;
};

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchGitHub(url: string, etag?: string) {
  let response = await fetchWithTimeout(url, {
    headers: getHeaders(etag),
  });

  if (response.status === 401 && GITHUB_TOKEN) {
    console.warn('⚠️ GitHub token was rejected; retrying public request without Authorization.');
    response = await fetchWithTimeout(url, {
      headers: getHeaders(etag, false),
    });
  }

  return response;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getContributionLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (maxCount <= 1) return 1;
  const ratio = count / maxCount;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}

function buildContributionCalendar(
  username: string,
  counts: Map<string, number>,
  source: GitHubContributionCalendar['source']
): GitHubContributionCalendar {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(today);
  const start = new Date(end);
  start.setDate(end.getDate() - 364);

  const firstSunday = new Date(start);
  firstSunday.setDate(start.getDate() - start.getDay());

  const days: GitHubContributionDay[] = [];
  let maxCount = 0;

  for (let date = new Date(firstSunday); date <= end; date.setDate(date.getDate() + 1)) {
    const key = toDateKey(date);
    const count = counts.get(key) ?? 0;
    maxCount = Math.max(maxCount, count);
    days.push({ date: key, count, level: 0 });
  }

  const withLevels = days.map(day => ({
    ...day,
    level: getContributionLevel(day.count, maxCount),
  }));

  const weeks: GitHubContributionDay[][] = [];
  for (let index = 0; index < withLevels.length; index += 7) {
    weeks.push(withLevels.slice(index, index + 7));
  }

  const visibleDays = withLevels.filter(day => day.date >= toDateKey(start) && day.date <= toDateKey(end));
  const totalContributions = visibleDays.reduce((sum, day) => sum + day.count, 0);
  const activeDays = visibleDays.filter(day => day.count > 0).length;

  let longestStreak = 0;
  let runningStreak = 0;
  visibleDays.forEach(day => {
    if (day.count > 0) {
      runningStreak++;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  });

  let currentStreak = 0;
  for (let index = visibleDays.length - 1; index >= 0; index--) {
    if (visibleDays[index].count <= 0) break;
    currentStreak++;
  }

  return {
    username,
    totalContributions,
    longestStreak,
    currentStreak,
    activeDays,
    maxCount,
    weeks,
    source,
  };
}

async function getContributionCalendarFromGraphQL(username: string) {
  if (!GITHUB_TOKEN) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetchWithTimeout('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar?.weeks) return null;

  const counts = new Map<string, number>();
  calendar.weeks.forEach((week: any) => {
    (week.contributionDays ?? []).forEach((day: any) => {
      counts.set(day.date, day.contributionCount ?? 0);
    });
  });

  return buildContributionCalendar(username, counts, 'graphql');
}

async function getContributionCalendarFromEvents(username: string) {
  const counts = new Map<string, number>();

  for (let page = 1; page <= 3; page++) {
    const response = await fetchGitHub(`${GITHUB_API}/users/${username}/events/public?per_page=100&page=${page}`);
    if (!response.ok) break;

    const events = await response.json();
    if (!Array.isArray(events) || events.length === 0) break;

    events.forEach((event: any) => {
      const date = event?.created_at ? toDateKey(new Date(event.created_at)) : null;
      if (!date) return;

      const weight = event.type === 'PushEvent'
        ? Math.max(1, event.payload?.commits?.length ?? 1)
        : 1;
      counts.set(date, (counts.get(date) ?? 0) + weight);
    });
  }

  return counts.size > 0 ? buildContributionCalendar(username, counts, 'events') : null;
}

function getContributionCalendarFromRepos(username: string, repos: GitHubRepo[]) {
  const counts = new Map<string, number>();

  repos.forEach(repo => {
    const pushedAt = repo.pushedAt || repo.updatedAt;
    if (!pushedAt) return;
    const date = toDateKey(new Date(pushedAt));
    const repoWeight = 1 + Math.min(3, repo.stars + repo.forks);
    counts.set(date, (counts.get(date) ?? 0) + repoWeight);
  });

  return buildContributionCalendar(username, counts, counts.size > 0 ? 'repos' : 'empty');
}

export async function getGitHubContributionCalendar(
  username: string,
  repos: GitHubRepo[] = []
): Promise<GitHubContributionCalendar> {
  const cacheKey = `contributions:${username}`;
  const cached = githubCache.get<GitHubContributionCalendar>(cacheKey);
  const staleCached = githubCache.getStale<GitHubContributionCalendar>(cacheKey);

  if (cached) {
    return { ...cached, source: 'cache' };
  }

  try {
    const graphQLCalendar = await getContributionCalendarFromGraphQL(username);
    if (graphQLCalendar) {
      githubCache.set(cacheKey, graphQLCalendar);
      return graphQLCalendar;
    }

    const eventCalendar = await getContributionCalendarFromEvents(username);
    if (eventCalendar) {
      githubCache.set(cacheKey, eventCalendar);
      return eventCalendar;
    }
  } catch (error) {
    console.warn(`⚠️ Failed to fetch contribution calendar for ${username}: ${formatErrorMessage(error)}`);
  }

  if (staleCached) {
    return { ...staleCached, source: 'cache' };
  }

  const repoCalendar = getContributionCalendarFromRepos(username, repos);
  githubCache.set(cacheKey, repoCalendar);
  return repoCalendar;
}

/**
 * Get single repository information with caching
 */
export async function getGitHubRepo(owner: string, repo: string): Promise<GitHubRepo | null> {
  const cacheKey = `repo:${owner}/${repo}`;

  const cached = githubCache.get<GitHubRepo>(cacheKey);
  const staleCached = githubCache.getStale<GitHubRepo>(cacheKey);
  if (cached) {
    console.log(`✅ Cache hit: ${owner}/${repo}`);
    return cached;
  }

  if (pendingRequests.has(cacheKey)) {
    console.log(`⏳ Reusing pending request: ${owner}/${repo}`);
    return pendingRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
    try {
      const etag = githubCache.getETag(cacheKey);
      const response = await fetchGitHub(`${GITHUB_API}/repos/${owner}/${repo}`, etag);

      // Use cache if not modified
      if (response.status === 304 && staleCached) {
        console.log(`✅ 304 Not Modified: ${owner}/${repo}`);
        githubCache.set(cacheKey, staleCached, response.headers.get('etag') || etag);
        return staleCached;
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`❌ Repo not found: ${owner}/${repo}`);
          return null;
        }
        console.warn(`⚠️ Failed to fetch repo ${owner}/${repo}: ${response.status}`);
        return staleCached;
      }

      const data = await response.json();
      const newEtag = response.headers.get('etag') || undefined;

      const repoData: GitHubRepo = {
        owner: data.owner.login,
        name: data.name,
        description: data.description,
        url: data.html_url,
        homepage: data.homepage,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        topics: data.topics || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        pushedAt: data.pushed_at,
        isArchived: data.archived,
        isFork: data.fork,
        license: data.license?.spdx_id || null,
      };

      // Write to cache
      githubCache.set(cacheKey, repoData, newEtag);
      console.log(`💾 Cached: ${owner}/${repo}`);

      return repoData;
    } catch (error) {
      console.warn(`⚠️ Using stale repo cache for ${owner}/${repo}: ${formatErrorMessage(error)}`);
      return staleCached;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

/**
 * Get all public repositories for a user with caching
 * 
 * @param username - GitHub username
 * @returns Array of repository information
 * 
 * @remarks
 * Fetches all public repositories with pagination support (100 per page)
 * Results are cached and concurrent requests are deduplicated
 */
export async function getUserRepos(username: string): Promise<GitHubRepo[]> {
  const cacheKey = `user-repos:${username}`;

  // Check cache first
  const cached = githubCache.get<GitHubRepo[]>(cacheKey);
  const staleCached = githubCache.getStale<GitHubRepo[]>(cacheKey);
  if (cached) {
    console.log(`✅ Cache hit: user repos for ${username}`);
    return cached;
  }

  // Deduplicate concurrent requests
  if (pendingRequests.has(cacheKey)) {
    console.log(`⏳ Reusing pending request: user repos for ${username}`);
    return pendingRequests.get(cacheKey);
  }

  // Make new request
  const requestPromise = (async () => {
    try {
      const repos: GitHubRepo[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetchGitHub(
          `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100&page=${page}`
        );

        if (!response.ok) {
          console.warn(`⚠️ Failed to fetch repos for ${username}: ${response.status}`);
          return staleCached || [];
        }

        const data = await response.json();
        
        if (data.length === 0) {
          hasMore = false;
        } else {
          repos.push(...data.map((repo: any) => ({
            owner: repo.owner.login,
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
            isArchived: repo.archived,
            isFork: repo.fork,
            license: repo.license?.spdx_id || null,
          })));
          page++;
        }
      }

      // Write to cache
      githubCache.set(cacheKey, repos);
      console.log(`💾 Cached: ${repos.length} repos for ${username}`);

      return repos;
    } catch (error) {
      console.warn(`⚠️ Using stale repo list for ${username}: ${formatErrorMessage(error)}`);
      return staleCached || [];
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

/**
 * Get repository README content with caching
 * 
 * @param owner - Repository owner username
 * @param repo - Repository name
 * @returns README content as UTF-8 string, or null if not found
 * 
 * @remarks
 * GitHub API returns base64-encoded content which is automatically decoded
 * Supports ETag-based conditional requests to minimize API calls
 */
export async function getRepoReadme(owner: string, repo: string): Promise<string | null> {
  const cacheKey = `readme:${owner}/${repo}`;

  // Check cache first
  const cached = githubCache.get<string>(cacheKey);
  const staleCached = githubCache.getStale<string>(cacheKey);
  if (cached) {
    console.log(`✅ Cache hit: README for ${owner}/${repo}`);
    return cached;
  }

  // Deduplicate concurrent requests
  if (pendingRequests.has(cacheKey)) {
    console.log(`⏳ Reusing pending request: README for ${owner}/${repo}`);
    return pendingRequests.get(cacheKey);
  }

  // Make new request
  const requestPromise = (async () => {
    try {
      const etag = githubCache.getETag(cacheKey);
      const response = await fetchGitHub(`${GITHUB_API}/repos/${owner}/${repo}/readme`, etag);

      // Use cache if not modified
      if (response.status === 304 && staleCached) {
        console.log(`✅ 304 Not Modified: README for ${owner}/${repo}`);
        githubCache.set(cacheKey, staleCached, response.headers.get('etag') || etag);
        return staleCached;
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`❌ README not found for ${owner}/${repo}`);
          return null;
        }
        console.warn(`⚠️ Failed to fetch README for ${owner}/${repo}: ${response.status}`);
        return staleCached;
      }

      const data: GitHubReadme = await response.json();
      const newEtag = response.headers.get('etag') || undefined;

      // GitHub API returns base64-encoded content - decode to UTF-8
      let content = '';
      if (data.encoding === 'base64') {
        // Use Buffer for proper UTF-8 decoding
        const base64Content = data.content.replace(/\n/g, '');
        content = Buffer.from(base64Content, 'base64').toString('utf-8');
      } else {
        content = data.content;
      }

      // Write to cache
      githubCache.set(cacheKey, content, newEtag);
      console.log(`💾 Cached: README for ${owner}/${repo}`);

      return content;
    } catch (error) {
      console.warn(`⚠️ Using stale README cache for ${owner}/${repo}: ${formatErrorMessage(error)}`);
      return staleCached;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

/**
 * Format large numbers to compact representation
 * 
 * @param num - Number to format
 * @returns Formatted string (e.g., 1234 -> "1.2k")
 * 
 * @example
 * ```ts
 * formatNumber(1234)  // "1.2k"
 * formatNumber(999)   // "999"
 * formatNumber(5678)  // "5.7k"
 * ```
 */
export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * Format date to relative time string (Chinese)
 * 
 * @param dateString - ISO date string to format
 * @returns Relative time string in Chinese (e.g., "3 天前", "2 个月前")
 * 
 * @remarks
 * Calculates time difference and returns human-readable format:
 * - 0 days: "今天"
 * - 1 day: "昨天"
 * - < 7 days: "X 天前"
 * - < 30 days: "X 周前"
 * - < 365 days: "X 个月前"
 * - >= 365 days: "X 年前"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays} 天前`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} 周前`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} 个月前`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} 年前`;
  }
}

/**
 * Get a theme-aware accent color for a programming language.
 *
 * @param language - Programming language name
 * @returns CSS color token from the active MD3 scheme
 *
 * @remarks
 * Language markers intentionally use MD3 system roles instead of GitHub's
 * hard-coded language hex colors so project cards remain theme-compliant.
 */
export function getLanguageColor(language: string | null): string {
  if (!language) return 'var(--md-sys-color-outline)';

  const tokens = [
    'var(--md-sys-color-primary)',
    'var(--md-sys-color-secondary)',
    'var(--md-sys-color-tertiary)',
    'var(--md-sys-color-primary-fixed-dim)',
    'var(--md-sys-color-secondary-fixed-dim)',
    'var(--md-sys-color-tertiary-fixed-dim)',
  ];
  const index = Array.from(language).reduce((sum, char) => sum + char.charCodeAt(0), 0) % tokens.length;
  return tokens[index];
}
