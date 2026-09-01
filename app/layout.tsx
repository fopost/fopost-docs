import '@/app/global.css';
import { DocsRootProvider } from '@/components/root-provider';
import { searchSuggestions } from '@/lib/search-suggestions';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { SidebarFooterArea } from '@/components/sidebar-footer-area';
import {
  SlideNavFolder,
  SlideNavItem,
  SlideNavProvider,
  SlideNavSeparator,
  SlideSidebarSearch,
} from '@/components/slide-sidebar';
import { SiteFooter } from '@/components/site-footer';
import { buildNavTree } from '@/lib/nav-tree';
import { source } from '@/lib/source';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.docsUrl),
  title: {
    template: `%s - ${BRAND.name} Docs`,
    default: `${BRAND.name} Docs`,
  },
  description: `${BRAND.name} documentation: the dashboard, the REST API, the SDKs, and the platforms.`,
  icons: { icon: BRAND.favicon, ...(BRAND.appleTouchIcon ? { apple: BRAND.appleTouchIcon } : {}) },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  const { nav, ...options } = baseOptions();
  const { nodes, slot } = buildNavTree(source.pageTree);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className={`${GeistSans.className} flex flex-col min-h-screen`}>
        <DocsRootProvider links={searchSuggestions()}>
          {/* One sidebar, Vercel-docs style: a flat root list of the sections
              that slides sideways into the selected section's page list. The
              default page tree is swapped out through the components slot; the
              full-width navbar and the mobile drawer stay the layout's own. */}
          <SlideNavProvider nodes={nodes} slot={slot}>
            <DocsLayout
              tree={source.pageTree}
              {...options}
              nav={{ ...nav, mode: 'top' }}
              searchToggle={{ enabled: false }}
              sidebar={{
                banner: <SlideSidebarSearch />,
                footer: SidebarFooterArea,
                tabs: false,
                components: {
                  Folder: SlideNavFolder,
                  Item: SlideNavItem,
                  Separator: SlideNavSeparator,
                },
              }}
            >
              {children}
            </DocsLayout>
          </SlideNavProvider>
          {/* Below the docs grid, so it spans the full width under the
              sidebar the way a normal site footer does. */}
          <SiteFooter />
        </DocsRootProvider>
      </body>
    </html>
  );
}
