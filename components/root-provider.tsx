'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { SearchLink } from 'fumadocs-ui/contexts/search';
import DocsSearchDialog from '@/components/search-dialog';

/**
 * The hotkey's `key` is a function, which a server component cannot pass as a
 * prop, so the provider is configured in this client wrapper. Only the
 * suggestion links, resolved server-side, travel in from the layout.
 */

const noopSubscribe = () => () => {};

function isMac() {
  const nav = window.navigator as Navigator & { userAgentData?: { platform?: string } };
  return /mac/i.test(nav.userAgentData?.platform ?? nav.platform ?? '');
}

/* '⌘' during SSR and hydration, the real OS symbol right after. */
function MetaOrCtrl() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (isMac() ? '⌘' : 'Ctrl'),
    () => '⌘',
  );
}

export function DocsRootProvider({
  links,
  children,
}: {
  links: SearchLink[];
  children: ReactNode;
}) {
  return (
    <RootProvider
      search={{
        SearchDialog: DocsSearchDialog,
        links,
        hotKey: [
          { key: (e) => e.metaKey || e.ctrlKey, display: <MetaOrCtrl /> },
          { key: 'k', display: 'K' },
        ],
      }}
      theme={{
        enabled: true,
      }}
    >
      {children}
    </RootProvider>
  );
}
