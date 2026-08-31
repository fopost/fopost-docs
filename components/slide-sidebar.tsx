'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, use, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { cn } from 'fumadocs-ui/utils/cn';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import type { NavGroup, NavNode, NavSlot } from '@/lib/nav-tree';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@/components/icons';

/**
 * A Vercel-docs-style sidebar: one flat root list of sections, and a
 * horizontal slide into the selected section's page list. The root level
 * shows the top-level sections; entering one both navigates to its overview
 * page and slides the list; the back row slides back without navigating.
 *
 * It replaces the default Fumadocs page tree through the layout's
 * `sidebar.components` slot: every root node renders null except one
 * designated by the slot, which renders this navigation instead. That keeps
 * the whole notebook layout — navbar, mobile drawer, collapse — intact.
 */

const NavContext = createContext<{ nodes: NavNode[]; slot: NavSlot } | null>(null);

export function SlideNavProvider({
  nodes,
  slot,
  children,
}: {
  nodes: NavNode[];
  slot: NavSlot;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ nodes, slot }), [nodes, slot]);
  return <NavContext value={value}>{children}</NavContext>;
}

function useNavTree() {
  const ctx = use(NavContext);
  if (!ctx) throw new Error('SlideNavProvider is missing above the docs layout.');
  return ctx;
}

/* ── Adapters for the layout's page-tree component slots ── */

function SlotNav({ type, name }: { type: NavSlot['type']; name: ReactNode }) {
  const { slot } = useNavTree();
  if (type !== slot.type || String(name) !== slot.name) return null;
  return <SlideNav />;
}

export function SlideNavFolder({ item }: { item: PageTree.Folder }) {
  return <SlotNav type="folder" name={item.name} />;
}

export function SlideNavItem({ item }: { item: PageTree.Item }) {
  return <SlotNav type="page" name={item.name} />;
}

export function SlideNavSeparator({ item }: { item: PageTree.Separator }) {
  return <SlotNav type="separator" name={item.name} />;
}

/* ── The navigation itself ── */

const rowClass =
  'flex h-8 items-center gap-2 rounded-md px-2 text-[13px] text-fd-muted-foreground ' +
  'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground ' +
  'data-[active=true]:bg-fd-accent data-[active=true]:font-medium data-[active=true]:text-fd-accent-foreground ' +
  '[&_svg]:shrink-0';

function normalize(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function containsUrl(node: NavNode, url: string): boolean {
  if (node.kind === 'page') return node.url === url;
  if (node.kind === 'group')
    return node.url === url || node.items.some((child) => containsUrl(child, url));
  return false;
}

/** The index of the root-level section whose subtree holds the URL, if any. */
function findActiveSection(nodes: NavNode[], url: string): number | null {
  const index = nodes.findIndex((node) => node.kind === 'group' && containsUrl(node, url));
  return index === -1 ? null : index;
}

function SlideNav() {
  const { nodes } = useNavTree();
  const pathname = normalize(usePathname());
  const active = findActiveSection(nodes, pathname);
  const [view, setView] = useState<number | null>(active);
  const [lastActive, setLastActive] = useState(active);

  // The URL decides the visible level on load and after every navigation;
  // the back row only touches local state, so it survives until the next move.
  if (lastActive !== active) {
    setLastActive(active);
    setView(active);
  }

  // A deep link into a long section should land with its row in view.
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    navRef.current
      ?.querySelector(':scope > div:not([inert]) [data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, []);

  return (
    <nav ref={navRef} aria-label="Documentation" className="relative overflow-x-clip">
      <Panel active={view === null} exit="start">
        {nodes.map((node, i) => (
          <RootRow key={i} node={node} pathname={pathname} onEnter={() => setView(i)} />
        ))}
      </Panel>
      {nodes.map((node, i) =>
        node.kind === 'group' ? (
          <Panel key={i} active={view === i} exit="end">
            <button
              type="button"
              onClick={() => setView(null)}
              className={cn(
                rowClass,
                'sticky top-0 z-10 mb-2 w-full bg-fd-background font-medium text-fd-foreground',
              )}
            >
              <ChevronLeftIcon className="text-xs text-fd-muted-foreground" />
              <span className="truncate">{node.name}</span>
            </button>
            {node.items.map((child, j) => (
              <SectionRow key={j} node={child} pathname={pathname} />
            ))}
          </Panel>
        ) : null,
      )}
    </nav>
  );
}

/** One sliding level. The inactive panel parks off-screen without taking height. */
function Panel({
  active,
  exit,
  children,
}: {
  active: boolean;
  exit: 'start' | 'end';
  children: ReactNode;
}) {
  return (
    <div
      inert={!active}
      className={cn(
        'flex flex-col gap-0.5 transition-transform duration-300 ease-out motion-reduce:transition-none',
        active
          ? 'translate-x-0'
          : exit === 'start'
            ? 'absolute inset-x-0 top-0 -translate-x-full'
            : 'absolute inset-x-0 top-0 translate-x-full',
      )}
    >
      {children}
    </div>
  );
}

function RootRow({
  node,
  pathname,
  onEnter,
}: {
  node: NavNode;
  pathname: string;
  onEnter: () => void;
}) {
  if (node.kind === 'separator') return <SeparatorRow name={node.name} />;

  if (node.kind === 'page') {
    return (
      <Link href={node.url} data-active={pathname === node.url} className={rowClass}>
        {node.icon}
        <span className="truncate">{node.name}</span>
      </Link>
    );
  }

  const row = (
    <>
      {node.icon}
      <span className="flex-1 truncate text-start">{node.name}</span>
      <ChevronRightIcon className="text-xs" />
    </>
  );

  // Entering a section navigates to its overview page and slides in one click.
  if (node.url) {
    return (
      <Link
        href={node.url}
        onClick={onEnter}
        data-active={containsUrl(node, pathname)}
        className={rowClass}
      >
        {row}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onEnter} className={cn(rowClass, 'w-full')}>
      {row}
    </button>
  );
}

function SectionRow({ node, pathname }: { node: NavNode; pathname: string }) {
  if (node.kind === 'separator') return <SeparatorRow name={node.name} />;
  if (node.kind === 'group') return <AccordionGroup group={node} pathname={pathname} />;
  return (
    <Link href={node.url} data-active={pathname === node.url} className={rowClass}>
      {node.icon}
      <span className="truncate">{node.name}</span>
    </Link>
  );
}

function SeparatorRow({ name }: { name: ReactNode }) {
  return (
    <p className="mt-5 mb-1 px-2 text-[12px] font-medium text-fd-muted-foreground first:mt-1">
      {name}
    </p>
  );
}

/** A nested folder inside a section: an accordion at this level, not a slide. */
function AccordionGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const active = containsUrl(group, pathname);
  const [override, setOverride] = useState<boolean | null>(null);
  const [lastActive, setLastActive] = useState(active);
  const open = override ?? active;

  // Navigating into or out of the group beats a stale manual toggle.
  if (lastActive !== active) {
    setLastActive(active);
    setOverride(null);
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setOverride(!open)}
        aria-expanded={open}
        className={cn(rowClass, 'w-full')}
      >
        {group.icon}
        <span className="flex-1 truncate text-start">{group.name}</span>
        <ChevronDownIcon
          className={cn(
            'text-xs transition-transform motion-reduce:transition-none',
            !open && '-rotate-90',
          )}
        />
      </button>
      {open && (
        <div className="ms-[15px] flex flex-col gap-0.5 border-s border-fd-border ps-2">
          {group.items.map((child, i) => (
            <SectionRow key={i} node={child} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── The search trigger at the top of the sidebar ── */

/** Opens the shared search dialog; the input look is a trigger, not a redesign. */
export function SlideSidebarSearch() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="inline-flex h-8 w-full items-center gap-2 rounded-md border bg-fd-secondary/50 px-2.5 text-[13px] text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
    >
      <MagnifyingGlassIcon className="text-sm" />
      Search…
      <kbd className="ms-auto rounded border bg-fd-background px-1.5 font-sans text-[11px] text-fd-muted-foreground max-md:hidden">
        ⌘K
      </kbd>
    </button>
  );
}
