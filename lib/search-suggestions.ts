import { source } from '@/lib/source';
import { SUGGESTED_URLS } from '@/lib/suggested-pages';
import type { SearchLink } from 'fumadocs-ui/contexts/search';

/** The curated pages as search links, titles resolved from the source. */
export function searchSuggestions(): SearchLink[] {
  const byUrl = new Map(source.getPages().map((page) => [page.url, page]));
  return SUGGESTED_URLS.flatMap((url) => {
    const page = byUrl.get(url);
    return page ? [[page.data.title, url] satisfies SearchLink] : [];
  });
}
