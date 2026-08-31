import Link from 'next/link';
import type { RelatedPage } from '@/lib/related';
import { ChevronDownIcon } from '@/components/icons';

/**
 * Collapsible list of related pages above the footer navigation. The caller
 * computes the list server-side; fewer than two entries renders nothing.
 */
export function RelatedDocs({ pages }: { pages: RelatedPage[] }) {
  if (pages.length < 2) return null;

  return (
    <details className="not-prose group rounded-xl shadow-border">
      <summary className="flex h-11 cursor-pointer list-none items-center justify-between px-4 text-[13px] font-medium text-fd-foreground [&::-webkit-details-marker]:hidden">
        Related documentation
        <ChevronDownIcon className="text-base text-fd-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <ul className="flex flex-col gap-3 border-t px-4 py-3">
        {pages.map((page) => (
          <li key={page.url}>
            <Link
              href={page.url}
              className="text-[13px] font-medium text-fd-foreground no-underline hover:underline"
            >
              {page.title}
            </Link>
            {page.description && (
              <p className="mt-0.5 text-[13px] text-fd-muted-foreground">{page.description}</p>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
