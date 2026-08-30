import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { pageUrl } from '@/lib/markdown';

// basePath applies to the route itself, so this is served at /docs/sitemap.xml.
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: pageUrl(page),
    changeFrequency: 'weekly',
    priority: page.url === '/' ? 1 : 0.7,
  }));
}
