import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { SidebarFooter } from '@/components/sidebar-footer';
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

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className={`${GeistSans.className} flex flex-col min-h-screen`}>
        <RootProvider
          theme={{
            enabled: true,
          }}
        >
          <DocsLayout
            tree={source.pageTree}
            {...options}
            /* The four sections sit in the navbar instead of behind a dropdown,
               so a reader sees the whole product at once and the sidebar below
               is free to show one section's tree in full. The header spans the
               full width, above the sidebar, the way the marketing site does. */
            nav={{ ...nav, mode: 'top' }}
            tabMode="navbar"
            sidebar={{
              defaultOpenLevel: 1,
              footer: <SidebarFooter />,
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
