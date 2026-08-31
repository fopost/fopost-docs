import Link from 'next/link';
import type { ReactNode } from 'react';
import { findNeighbour, findParent } from 'fumadocs-core/page-tree';
import type { Root } from 'fumadocs-core/page-tree';
import { ChevronLeftSmallIcon, ChevronRightSmallIcon } from '@/components/icons';

/**
 * Previous / next navigation under the page body: a small gray label over the
 * neighbour's title, with the parent section named for context.
 */
export function PageFooter({ tree, url }: { tree: Root; url: string }) {
  const { previous, next } = findNeighbour(tree, url);
  if (!previous && !next) return null;

  return (
    <nav className="not-prose flex items-start justify-between gap-4 border-t pt-6">
      {previous ? (
        <FooterLink
          href={previous.url}
          label="Previous"
          title={withParent(tree, previous.url, previous.name)}
          icon={<ChevronLeftSmallIcon className="text-base" />}
          side="left"
        />
      ) : (
        <span />
      )}
      {next ? (
        <FooterLink
          href={next.url}
          label="Next"
          title={withParent(tree, next.url, next.name)}
          icon={<ChevronRightSmallIcon className="text-base" />}
          side="right"
        />
      ) : (
        <span />
      )}
    </nav>
  );
}

/** "Parent / Page Title" when the page sits inside a section, else the title. */
function withParent(tree: Root, url: string, name: ReactNode): ReactNode {
  const parent = findParent(tree, url);
  if (!parent || !('type' in parent) || !parent.name) return name;
  return (
    <>
      {parent.name} / {name}
    </>
  );
}

function FooterLink({
  href,
  label,
  title,
  icon,
  side,
}: {
  href: string;
  label: string;
  title: ReactNode;
  icon: ReactNode;
  side: 'left' | 'right';
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-1 no-underline ${side === 'right' ? 'items-end text-end' : ''}`}
    >
      <span className="text-[13px] text-fd-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-fd-foreground group-hover:underline">
        {side === 'left' && icon}
        {title}
        {side === 'right' && icon}
      </span>
    </Link>
  );
}
