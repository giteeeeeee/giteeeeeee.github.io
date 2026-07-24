import { getPostUrl, getSortedPosts } from '@features/blog/lib/blog';
import { getPlogAlbums } from '@features/gallery/lib/plog';

export type SearchDocumentKind = 'blog' | 'plog';

export interface SearchFallbackDocument {
  url: string;
  title: string;
  description: string;
  kind: SearchDocumentKind;
  date: string;
  keywords: string[];
}

export async function getSearchFallbackDocuments(): Promise<SearchFallbackDocument[]> {
  const [posts, plogAlbums] = await Promise.all([
    getSortedPosts(),
    getPlogAlbums(),
  ]);

  return [
    ...posts.map((post) => ({
      url: getPostUrl(post),
      title: post.data.title,
      description: post.data.description ?? '',
      kind: 'blog' as const,
      date: post.data.publishDate.toISOString().slice(0, 10),
      keywords: [
        post.data.category,
        post.data.series,
        ...post.data.tags,
      ].filter((keyword): keyword is string => Boolean(keyword)),
    })),
    ...plogAlbums.map((album) => ({
      url: album.href,
      title: album.title,
      description: album.description,
      kind: 'plog' as const,
      date: album.date,
      keywords: [
        album.collectionTitle,
        album.location,
        album.camera,
        ...album.tags,
      ].filter(Boolean),
    })),
  ];
}

export function getSearchSuggestions(documents: SearchFallbackDocument[], limit = 6) {
  const counts = new Map<string, number>();

  documents.forEach((document) => {
    new Set(document.keywords).forEach((keyword) => {
      const normalized = keyword.trim();
      if (!normalized) return;
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort(([left, leftCount], [right, rightCount]) => (
      rightCount - leftCount || left.localeCompare(right, 'zh-CN')
    ))
    .slice(0, limit)
    .map(([keyword]) => keyword);
}
