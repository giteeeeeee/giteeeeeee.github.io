import { currentMarkdownStyle } from '@app/config/markdown-style.config';
import { generateMarkdownStyles } from '@features/blog/lib/markdown-style-generator';

export const prerender = true;

export function GET() {
  return new Response(generateMarkdownStyles(currentMarkdownStyle), {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
