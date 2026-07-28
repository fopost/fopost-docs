import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://owlstack.app/docs'),
  title: {
    template: '%s - OwlStack Docs',
    default: 'OwlStack Docs',
  },
  description: 'Unified Social Media Publishing SDK - Documentation',
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
