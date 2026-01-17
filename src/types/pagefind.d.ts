declare module "*/pagefind.js" {
  export interface PagefindSearchResult {
    results: Array<{
      data: () => Promise<{
        url: string;
        excerpt: string;
        meta: {
          title: string;
        };
      }>;
    }>;
  }

  export interface Pagefind {
    init: () => Promise<void>;
    search: (query: string) => Promise<PagefindSearchResult>;
    debouncedSearch: (
      query: string,
      options?: { timeout?: number }
    ) => Promise<PagefindSearchResult>;
  }

  const pagefind: Pagefind;
  export default pagefind;
}
