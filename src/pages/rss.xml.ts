import rss from '@astrojs/rss';
import { getSiteProfile, getUserProfile } from '@app/config/site.config';
import { getPostUrl, getSortedPosts } from '@features/blog/lib/blog';

export async function GET(context: { site?: URL }) {
  const posts = await getSortedPosts();
  const user = getUserProfile();
  const site = getSiteProfile('zh');

  return rss({
    title: `${site.name} · ${user.name}`,
    description: site.description,
    site: context.site ?? new URL('https://example.com'),
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.publishDate,
      link: getPostUrl(post),
      categories: post.data.tags,
      author: post.data.author ?? user.name,
    })),
    customData: '<language>zh-CN</language>',
  });
}
