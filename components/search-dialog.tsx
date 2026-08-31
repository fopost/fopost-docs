'use client';

import { useMemo } from 'react';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
} from 'fumadocs-ui/components/dialog/search';
import type { SearchLink, SharedProps } from 'fumadocs-ui/contexts/search';
import { BASE_PATH } from '@/lib/brand';

/**
 * The default fetch dialog plus a labelled "Suggestions" list while the query
 * is empty. The links arrive from the provider, resolved server-side so the
 * titles track the source. The api URL spells out the basePath because the
 * client builds it from the origin and would 404 on /api/search otherwise.
 */
export default function DocsSearchDialog({
  links = [],
  ...props
}: SharedProps & { links?: SearchLink[] }) {
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    api: `${BASE_PATH}/api/search`,
  });

  const suggestions = useMemo<SearchItemType[]>(
    () =>
      links.map(([name, url]) => ({
        type: 'page',
        id: url,
        content: name,
        url,
      })),
    [links],
  );

  const results = query.data === 'empty' || query.data === undefined ? null : query.data;
  const showSuggestions = results === null && suggestions.length > 0;

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        {showSuggestions && (
          <p className="border-t px-4 pb-1 pt-3 text-[13px] font-medium text-fd-muted-foreground">
            Suggestions
          </p>
        )}
        <SearchDialogList items={results ?? (showSuggestions ? suggestions : null)} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
