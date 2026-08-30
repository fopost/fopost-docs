'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { MagnifyingGlassIcon } from '@/components/icons';

/** Opens the same dialog as the header search, so a 404 stays one click from the answer. */
export function SearchTrigger() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="inline-flex h-8 items-center gap-2 rounded-md bg-fd-primary px-3 text-[13px] font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
    >
      <MagnifyingGlassIcon className="text-base" />
      Search the Docs
    </button>
  );
}
