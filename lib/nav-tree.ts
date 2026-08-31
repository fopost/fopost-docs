import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * The page tree, flattened into plain objects the slide sidebar can hold.
 *
 * Names and icons stay as the ReactNodes the loader already rendered, which
 * serialize fine across the server/client boundary; everything structural
 * (urls, nesting) becomes data so the client component owns the rendering.
 */
export interface NavPage {
  kind: 'page';
  name: ReactNode;
  url: string;
  icon?: ReactNode;
}

export interface NavGroup {
  kind: 'group';
  name: ReactNode;
  icon?: ReactNode;
  /** Where clicking the group navigates: its index page, else its first page. */
  url?: string;
  items: NavNode[];
}

export interface NavSeparator {
  kind: 'separator';
  name: ReactNode;
}

export type NavNode = NavPage | NavGroup | NavSeparator;

/**
 * The custom page-tree components render nothing except on one designated
 * node, where the whole slide navigation appears instead of the default tree.
 * The slot names that node: the first child of the page tree root.
 */
export interface NavSlot {
  type: 'page' | 'folder' | 'separator';
  name: string;
}

function firstPageUrl(nodes: PageTree.Node[]): string | undefined {
  for (const node of nodes) {
    if (node.type === 'page') return node.url;
    if (node.type === 'folder') {
      const url = node.index?.url ?? firstPageUrl(node.children);
      if (url) return url;
    }
  }
  return undefined;
}

function mapNode(node: PageTree.Node): NavNode {
  if (node.type === 'separator') return { kind: 'separator', name: node.name };
  if (node.type === 'folder') {
    const items = node.children.map(mapNode);
    // The index page lives on the folder, not in children; surface it as the
    // first row so the overview stays reachable inside the group.
    if (node.index && !node.children.some((c) => c.type === 'page' && c.url === node.index?.url)) {
      items.unshift({
        kind: 'page',
        name: node.index.name,
        url: node.index.url,
        icon: node.index.icon,
      });
    }
    return {
      kind: 'group',
      name: node.name,
      icon: node.icon,
      url: node.index?.url ?? firstPageUrl(node.children),
      items,
    };
  }
  return { kind: 'page', name: node.name, url: node.url, icon: node.icon };
}

export function buildNavTree(root: PageTree.Root): { nodes: NavNode[]; slot: NavSlot } {
  const first = root.children[0];
  if (!first) throw new Error('The page tree is empty; the sidebar has nothing to render.');
  return {
    nodes: root.children.map(mapNode),
    slot: { type: first.type, name: String(first.name) },
  };
}
