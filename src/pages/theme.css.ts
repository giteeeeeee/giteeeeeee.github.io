import { getThemeConfig } from '@app/config/site.config';
import { createTheme, themeToCSSVars } from '@design/theme';

export const prerender = true;

export function GET() {
  const css = themeToCSSVars(createTheme(getThemeConfig()));

  return new Response(css, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
