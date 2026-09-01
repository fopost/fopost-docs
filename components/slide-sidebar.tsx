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
  // The docs home shows the whole root list; Introduction owns '/' but only
  // claims the panel when entered by click or from one of its deeper pages.
  const derived = pathname === '/' ? null : findActiveSection(nodes, pathname);
  const [override, setOverride] = useState<{ path: string; view: number | null } | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  // The URL decides the visible level on load and after every navigation; a
  // click's override wins at the pathname it targeted (entering Introduction
  // lands on '/', whose URL-derived default is the root list) and expires as
  // soon as the pathname moves somewhere else.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (override && override.path !== pathname) setOverride(null);
  }
  const view = override && override.path === pathname ? override.view : derived;
  const showView = (target: number | null, url?: string) =>
    setOverride({ path: url ? normalize(url) : pathname, view: target });

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
          <RootRow
            key={i}
            node={node}
            pathname={pathname}
            onEnter={() => showView(i, node.kind === 'group' ? node.url : undefined)}
          />
        ))}
      </Panel>
      {nodes.map((node, i) =>
        node.kind === 'group' ? (
          <Panel key={i} active={view === i} exit="end">
            <button
              type="button"
              onClick={() => showView(null)}
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

/**
 * A group inside a section — a separator-labelled run or a real nested folder,
 * both wearing the same collapsible row: label, chevron, animated height.
 * Every group starts open; collapsing is the reader's own move.
 */
function AccordionGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const active = containsUrl(group, pathname);
  const [override, setOverride] = useState<boolean | null>(null);
  const [lastActive, setLastActive] = useState(active);
  const open = override ?? true;

  // Navigating into a collapsed group reopens it; a stale toggle never hides
  // the row the reader just landed on.
  if (lastActive !== active) {
    setLastActive(active);
    setOverride(null);
  }

  return (
    <div className="mt-5 flex flex-col gap-0.5 first:mt-1">
      <button
        type="button"
        onClick={() => setOverride(!open)}
        aria-expanded={open}
        className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-[12px] font-medium text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground [&_svg]:shrink-0"
      >
        {group.icon}
        <span className="flex-1 truncate text-start">{group.name}</span>
        <ChevronDownIcon
          className={cn(
            'text-xs transition-transform duration-200 motion-reduce:transition-none',
            !open && '-rotate-90',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div inert={!open} className="flex min-h-0 flex-col gap-0.5 overflow-hidden">
          {group.items.map((child, i) => (
            <SectionRow key={i} node={child} pathname={pathname} />
          ))}
        </div>
      </div>
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
