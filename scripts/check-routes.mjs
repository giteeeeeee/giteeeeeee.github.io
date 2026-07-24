import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'dist');
const requiredArtifacts = [
  ['/', 'index.html'],
  ['/404', '404.html'],
  ['/about', 'about/index.html'],
  ['/archives', 'archives/index.html'],
  ['/blog', 'blog/index.html'],
  ['/gallery', 'gallery/index.html'],
  ['/guestbook', 'guestbook/index.html'],
  ['/links', 'links/index.html'],
  ['/projects', 'projects/index.html'],
  ['/search', 'search/index.html'],
  ['/rss.xml', 'rss.xml'],
  ['/robots.txt', 'robots.txt'],
  ['/sitemap-index.xml', 'sitemap-index.xml'],
  ['/pagefind', 'pagefind/pagefind.js'],
  ['/theme.css', 'theme.css'],
  ['/markdown.css', 'markdown.css'],
];

const failures = [];

for (const [route, file] of requiredArtifacts) {
  try {
    await access(resolve(root, file), constants.R_OK);
  } catch {
    failures.push(`${route} -> dist/${file}`);
  }
}

if (failures.length > 0) {
  console.error('Missing production route artifacts:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const searchPage = await readFile(resolve(root, 'search/index.html'), 'utf8');
const notFoundPage = await readFile(resolve(root, '404.html'), 'utf8');
const rss = await readFile(resolve(root, 'rss.xml'), 'utf8');
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
const themeCss = await readFile(resolve(root, 'theme.css'), 'utf8');
const markdownCss = await readFile(resolve(root, 'markdown.css'), 'utf8');

if (!searchPage.includes('data-pagefind-search')) failures.push('/search has no Pagefind mount point');
if (!notFoundPage.includes('not-found')) failures.push('/404 has no custom not-found content');
if (!rss.includes('<rss version="2.0">')) failures.push('/rss.xml is not an RSS 2.0 document');
if (!robots.includes('Sitemap:')) failures.push('/robots.txt does not advertise a sitemap');
if (!themeCss.includes('--md-sys-color-primary')) failures.push('/theme.css has no MD3 system variables');
if (!markdownCss.includes('.prose')) failures.push('/markdown.css has no prose rules');

if (failures.length > 0) {
  console.error('Production route validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${requiredArtifacts.length} production route artifacts.`);
