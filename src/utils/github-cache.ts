/**
 * GitHub API Cache System
 * Optimizes performance by reducing API request latency
 */
import fs from 'fs';
import path from 'path';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

interface CacheOptions {
  ttl?: number;
  cacheDir?: string;
}

const envTtl = Number(process.env.GITHUB_CACHE_TTL_MS);
const DEFAULT_TTL = Number.isFinite(envTtl) && envTtl > 0
  ? envTtl
  : 1000 * 60 * 60 * 6;
const DEFAULT_CACHE_DIR = '.cache/github';

class GitHubCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private cacheDir: string;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl || DEFAULT_TTL;
    this.cacheDir = options.cacheDir || DEFAULT_CACHE_DIR;
    this.ensureCacheDir();
  }

  private ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getCacheFilePath(key: string): string {
    const safeKey = key.replace(/[^a-z0-9-_]/gi, '_');
    return path.join(this.cacheDir, `${safeKey}.json`);
  }

  /**
   * Get data from memory cache
   */
  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Get data from disk cache
   */
  private getFromDisk<T>(key: string): T | null {
    try {
      const filePath = this.getCacheFilePath(key);
      if (!fs.existsSync(filePath)) return null;

      const content = fs.readFileSync(filePath, 'utf-8');
      const entry: CacheEntry<T> = JSON.parse(content);

      const isExpired = Date.now() - entry.timestamp > this.ttl;
      if (isExpired) {
        return null;
      }

      this.memoryCache.set(key, entry);
      return entry.data;
    } catch (error) {
      console.error(`Error reading cache for ${key}:`, error);
      return null;
    }
  }

  /**
   * Get data from memory cache even if it is expired.
   */
  private getStaleFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    return entry ? (entry.data as T) : null;
  }

  /**
   * Get data from disk cache even if it is expired.
   */
  private getStaleFromDisk<T>(key: string): T | null {
    try {
      const filePath = this.getCacheFilePath(key);
      if (!fs.existsSync(filePath)) return null;

      const content = fs.readFileSync(filePath, 'utf-8');
      const entry: CacheEntry<T> = JSON.parse(content);
      this.memoryCache.set(key, entry);
      return entry.data;
    } catch (error) {
      console.error(`Error reading stale cache for ${key}:`, error);
      return null;
    }
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    // Try memory cache first
    const memoryData = this.getFromMemory<T>(key);
    if (memoryData) return memoryData;

    // Fall back to disk cache
    return this.getFromDisk<T>(key);
  }

  /**
   * Get cached data even if the entry has expired.
   */
  getStale<T>(key: string): T | null {
    const memoryData = this.getStaleFromMemory<T>(key);
    if (memoryData) return memoryData;

    return this.getStaleFromDisk<T>(key);
  }

  /**
   * Set cache data with optional ETag
   */
  set<T>(key: string, data: T, etag?: string): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      etag,
    };

    // Write to memory cache
    this.memoryCache.set(key, entry);

    // Write to disk cache (async, non-blocking)
    try {
      const filePath = this.getCacheFilePath(key);
      fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
    } catch (error) {
      console.error(`Error writing cache for ${key}:`, error);
    }
  }

  /**
   * 获取 ETag（用于条件请求）
   */
  getETag(key: string): string | undefined {
    const entry = this.memoryCache.get(key);
    if (entry?.etag) return entry.etag;

    try {
      const filePath = this.getCacheFilePath(key);
      if (!fs.existsSync(filePath)) return undefined;

      const content = fs.readFileSync(filePath, 'utf-8');
      const diskEntry: CacheEntry<any> = JSON.parse(content);
      return diskEntry.etag;
    } catch {
      return undefined;
    }
  }

  /**
   * Clear cache for specific key or all cache
   */
  clear(key?: string): void {
    if (key) {
      // Clear specific key
      this.memoryCache.delete(key);
      try {
        const filePath = this.getCacheFilePath(key);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(`Error clearing cache for ${key}:`, error);
      }
    } else {
      // Clear all cache
      this.memoryCache.clear();
      try {
        if (fs.existsSync(this.cacheDir)) {
          fs.rmSync(this.cacheDir, { recursive: true });
          this.ensureCacheDir();
        }
      } catch (error) {
        console.error('Error clearing all cache:', error);
      }
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const diskFiles = fs.existsSync(this.cacheDir)
      ? fs.readdirSync(this.cacheDir).length
      : 0;

    return {
      memoryEntries: this.memoryCache.size,
      diskEntries: diskFiles,
      cacheDir: this.cacheDir,
    };
  }
}

// Export singleton instance with default configuration
export const githubCache = new GitHubCache({
  ttl: DEFAULT_TTL,
  cacheDir: '.cache/github',
});

/**
 * Get cache instance based on environment
 * Dev: 5min cache, Prod: 10min cache
 */
export const getCache = () => {
  if (import.meta.env.DEV) {
    return new GitHubCache({ ttl: 1000 * 60 * 5 });
  }
  return githubCache;
};
