import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const root = process.cwd();
const documentationRoots = [
  'README.md',
  'CONTRIBUTING.md',
  'docs',
  'llmdoc',
  'presets/themes/README.md',
];
const failures = [];

async function collectMarkdownFiles(path) {
  const absolutePath = resolve(root, path);
  const entry = await stat(absolutePath);
  if (entry.isFile()) return path.endsWith('.md') ? [absolutePath] : [];

  const children = await readdir(absolutePath, { withFileTypes: true });
  const nested = await Promise.all(children.map((child) => (
    child.isDirectory() || child.name.endsWith('.md')
      ? collectMarkdownFiles(resolve(absolutePath, child.name))
      : []
  )));
  return nested.flat();
}

function normalizeLinkTarget(rawTarget) {
  const target = rawTarget.trim().replace(/^<|>$/g, '');
  if (!target || target.startsWith('#') || target.startsWith('/')) return null;
  if (/^[a-z][a-z\d+.-]*:/i.test(target)) return null;

  const withoutFragment = target.split('#', 1)[0].split('?', 1)[0];
  if (!withoutFragment) return null;

  try {
    return decodeURIComponent(withoutFragment);
  } catch {
    return withoutFragment;
  }
}

const markdownFiles = (await Promise.all(documentationRoots.map(collectMarkdownFiles))).flat();
const markdownLinkPattern = /!?(?:\[[^\]]*\])\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g;

for (const file of markdownFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(markdownLinkPattern)) {
    const target = normalizeLinkTarget(match[1]);
    if (!target) continue;

    const destination = resolve(dirname(file), target);
    try {
      await stat(destination);
    } catch {
      failures.push(`${relative(root, file)} links to missing ${target}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Documentation validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Documentation links passed for ${markdownFiles.length} Markdown files.`);
