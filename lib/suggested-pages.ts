/**
 * Curated entry points the search dialog offers before any query is typed.
 * URLs only; titles resolve from the source in lib/search-suggestions.ts so
 * they never go stale. Kept dependency-free so the staleness test can import
 * the list without dragging in the generated source.
 */
export const SUGGESTED_URLS = [
  '/quick-start',
  '/guide/using-fopost/getting-started',
  '/guide/using-fopost/connecting-accounts',
  '/guide/using-fopost/creating-posts',
  '/api/overview',
  '/api/authentication',
  '/api/publishing',
  '/sdks/overview',
] as const;
