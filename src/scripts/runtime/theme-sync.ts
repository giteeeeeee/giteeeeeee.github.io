type ThemeMode = 'light' | 'dark' | 'system';

type AstroSwapEvent = Event & {
  newDocument?: Document;
  detail?: {
    newDocument?: Document;
  };
};

const THEME_STORAGE_KEY = 'theme';
let initialized = false;

function getStoredTheme(): ThemeMode {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

function resolveTheme(mode = getStoredTheme()): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function onSystemThemeChange(callback: () => void) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', callback);
}

function applyResolvedTheme(targetDocument: Document, theme = resolveTheme()) {
  targetDocument.documentElement.setAttribute('data-theme', theme);
  targetDocument.documentElement.style.colorScheme = theme;
}

function getSwapDocument(event: AstroSwapEvent) {
  return event.newDocument ?? event.detail?.newDocument ?? null;
}

export function initThemeSync() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  applyResolvedTheme(document);

  document.addEventListener('astro:before-swap', (event) => {
    const theme = resolveTheme();
    const nextDocument = getSwapDocument(event as AstroSwapEvent);

    applyResolvedTheme(document, theme);

    if (nextDocument) {
      applyResolvedTheme(nextDocument, theme);
    }
  });

  document.addEventListener('astro:after-swap', () => {
    applyResolvedTheme(document);
  });

  onSystemThemeChange(() => {
    if (getStoredTheme() === 'system') {
      applyResolvedTheme(document);
    }
  });
}
