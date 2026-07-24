declare module '@pagefind/default-ui' {
  export interface PagefindUIOptions {
    element: string | HTMLElement;
    bundlePath?: string;
    showImages?: boolean;
    showSubResults?: boolean;
    excerptLength?: number;
    autofocus?: boolean;
    focusOnSlash?: boolean;
    translations?: Record<string, string>;
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
    triggerSearch(term: string): void;
    triggerFilters(filters: Record<string, string | string[]>): void;
    destroy(): void;
  }
}
