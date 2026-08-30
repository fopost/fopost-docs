import { docs } from '../.source/server';
import { loader } from 'fumadocs-core/source';
import { Icon } from '@/components/icons/registry';
import { pageUrl } from '@/lib/page-url';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  url: (slugs) => pageUrl(slugs),
  // meta.json and frontmatter name a Geist icon by its slug ('rocket'), the
  // same names apps/web uses in its data files. The registry is server-only.
  icon: (icon) => (icon ? <Icon name={icon} className="text-[15px]" /> : undefined),
});

/** Pages are addressed by their public URL, not by their file slug. */
export function getPageByUrl(slug: string[] = []) {
  const url = pageUrl(slug);
  return source.getPages().find((page) => page.url === url);
}
