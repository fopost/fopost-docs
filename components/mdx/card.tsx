import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/registry';
import { source } from '@/lib/source';

/**
 * The card grid used on section landing pages.
 *
 * Replaces the fumadocs default so a card is a Geist surface: background plus
 * the 1px hairline, 12px radius, no drop shadow.
 */
export function Cards({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function Card({
  title,
  description,
  href,
  icon,
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  /** A Geist slug ('rocket'). Defaults to the icon of the page it links to. */
  icon?: string;
  children?: ReactNode;
}) {
  /* A card linking to a docs page inherits that page's icon and description,
     so a grid stays in step with the sidebar and with the page it points at
     without either being restated in the MDX. Both are still overridable. */
  const target = href?.startsWith('/')
    ? source.getPages().find((page) => page.url === href)
    : undefined;

  const slug = icon ?? (target?.data.icon as string | undefined);
  const body = description ?? children ?? target?.data.description;

  const inner = (
    <>
      {slug && (
        <span className="mb-3 inline-flex size-8 items-center justify-center rounded-lg bg-fd-muted text-base text-fd-muted-foreground transition-colors group-hover:text-fd-foreground">
          <Icon name={slug} />
        </span>
      )}
      <span className="block text-[14px] font-semibold tracking-[-0.28px] text-fd-foreground">
        {title}
      </span>
      {body && (
        <span className="mt-1 block text-[13px] leading-5 text-fd-muted-foreground">{body}</span>
      )}
    </>
  );

  const className =
    'group block rounded-xl bg-fd-background p-4 no-underline shadow-border ' +
    'transition-colors hover:bg-fd-muted';

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
