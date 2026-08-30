import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, Cards } from '@/components/mdx/card';
import { SearchTrigger } from '@/components/search-trigger';
import { ArrowLeftIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

/**
 * The 404 inside the docs layout.
 *
 * Next's built-in not-found is a bare centered <div>, which the notebook grid
 * drops into the sidebar gutter — the page arrives squeezed into a column a
 * few words wide, with no way forward. `[grid-area:main]` is what a real docs
 * page uses to claim the content column; the rest keeps the reader moving:
 * search, home, and the four sections, each card inheriting its icon and
 * description from the page it links to.
 */
export default function NotFound() {
  return (
    <article className="flex flex-col [grid-area:main] px-4 py-16 md:px-6 md:py-20 xl:px-8">
      <div className="w-full max-w-[620px]">
        <span className="inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium text-fd-muted-foreground shadow-border">
          404
        </span>
        <h1 className="mt-4 text-[28px] leading-9 font-semibold tracking-[-0.56px] text-fd-foreground">
          This page could not be found
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-fd-muted-foreground">
          The link may be out of date, or the page may have moved. Search the docs, or start from
          one of the sections below.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <SearchTrigger />
          <Link
            href="/"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-fd-foreground no-underline shadow-border transition-colors hover:bg-fd-muted"
          >
            <ArrowLeftIcon className="text-base" />
            Go to Docs Home
          </Link>
        </div>

        <Cards>
          <Card title="Introduction" href="/" description="Overview and getting started" />
          <Card title="Guide" href="/guide" description="For creators and teams" />
          <Card title="SDKs" href="/sdks" description="Clients and integrations" />
          <Card title="API Reference" href="/api/overview" description="REST API documentation" />
        </Cards>
      </div>
    </article>
  );
}
