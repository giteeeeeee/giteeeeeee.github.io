import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(process.cwd(), 'dist');
const budgets = {
  homeHtml: 160_000,
  blogIndexHtml: 180_000,
  inlineScript: 12_000,
  inlineStyle: 16_000,
};

const failures = [];

function totalInlineBytes(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  return [...html.matchAll(pattern)].reduce((total, match) => total + Buffer.byteLength(match[1]), 0);
}

function assertBudget(label, actual, maximum) {
  if (actual > maximum) failures.push(`${label}: ${actual} bytes exceeds ${maximum}`);
}

const home = await readFile(resolve(root, 'index.html'), 'utf8');
const blogIndex = await readFile(resolve(root, 'blog/index.html'), 'utf8');
const themeCss = await readFile(resolve(root, 'theme.css'), 'utf8');
const markdownCss = await readFile(resolve(root, 'markdown.css'), 'utf8');

assertBudget('home HTML', Buffer.byteLength(home), budgets.homeHtml);
assertBudget('blog index HTML', Buffer.byteLength(blogIndex), budgets.blogIndexHtml);
assertBudget('home inline scripts', totalInlineBytes(home, 'script'), budgets.inlineScript);
assertBudget('home inline styles', totalInlineBytes(home, 'style'), budgets.inlineStyle);

if (home.includes('data-astro-rerun')) failures.push('home contains a data-astro-rerun script');
if (!/href="[^"]*theme\.css(?:\?[^"]*)?"/.test(home)) failures.push('home does not load cacheable theme.css');
if (!themeCss.includes('--md-sys-color-primary')) failures.push('theme.css has no MD3 system variables');
if (!markdownCss.includes('.prose')) failures.push('markdown.css has no prose rules');

if (failures.length > 0) {
  console.error('Performance budget validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Performance budgets passed:');
console.log(`- home HTML: ${Buffer.byteLength(home)} bytes (${gzipSync(home).length} gzip)`);
console.log(`- blog index HTML: ${Buffer.byteLength(blogIndex)} bytes (${gzipSync(blogIndex).length} gzip)`);
console.log(`- home inline scripts: ${totalInlineBytes(home, 'script')} bytes`);
console.log(`- home inline styles: ${totalInlineBytes(home, 'style')} bytes`);
