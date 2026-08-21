import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
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
  description: 'Unified Social Media Publishing SDK - Documentation',
  icons: { icon: BRAND.favicon, ...(BRAND.appleTouchIcon ? { apple: BRAND.appleTouchIcon } : {}) },
};

export default function Layout({ children }: LayoutProps<'/'>) {
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
            {...baseOptions()}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
