import { rehype } from 'rehype';
import rehypeSanitize, { defaultSchema, type Options } from 'rehype-sanitize';
import { marked } from 'marked';

const readmeSchema: Options = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] ?? []),
      'className',
      'title',
    ],
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ['className', /^language-[\w-]+$/],
    ],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      'loading',
      'width',
      'height',
    ],
    input: [
      ...(defaultSchema.attributes?.input ?? []),
      ['type', 'checkbox'],
      'checked',
      'disabled',
    ],
  },
};

export function stripMarkdownFrontmatter(markdown: string) {
  return markdown.replace(/^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/, '');
}

/** Convert an untrusted remote README into a GitHub-like safe HTML fragment. */
export async function renderSafeReadme(markdown: string) {
  const rendered = await marked(stripMarkdownFrontmatter(markdown));
  const file = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeSanitize, readmeSchema)
    .process(rendered);

  return String(file);
}
