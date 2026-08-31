import { getPageTreePeers } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import { BASE_PATH, BRAND } from '@/lib/brand';

type Page = ReturnType<typeof source.getPages>[number];

export interface RelatedPage {
  url: string;
  title: string;
  description?: string;
}

const CAP = 8;

/**
 * Related reading for a page: the `related` frontmatter when the author set
 * it, otherwise siblings in the same folder plus the pages this one links to.
 */
export async function relatedPages(page: Page): Promise<RelatedPage[]> {
  const byUrl = new Map(source.getPages().map((p) => [p.url, p]));
  const override = page.data.related;

  const urls =
    override && override.length > 0
      ? override.map(normalizeUrl).filter((url): url is string => url !== null)
      : [
          ...getPageTreePeers(source.pageTree, page.url).map((item) => item.url),
          ...(await linkedUrls(page)),
        ];

  const seen = new Set<string>([page.url]);
  const related: RelatedPage[] = [];
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    const target = byUrl.get(url);
    if (!target) continue;
    related.push({
      url: target.url,
      title: target.data.title,
      description: target.data.description,
    });
    if (related.length >= CAP) break;
  }
  return related;
}

/** Internal links in the page body, in document order. */
async function linkedUrls(page: Page): Promise<string[]> {
  const markdown = await page.data.getText('processed');
  const urls: string[] = [];
  for (const match of markdown.matchAll(/\]\(([^()\s]+)\)/g)) {
    const url = normalizeUrl(match[1]);
    if (url) urls.push(url);
  }
  return urls;
}

/** A link target as a page URL, or null when it points outside the docs. */
function normalizeUrl(href: string): string | null {
  let url = href;
  if (url.startsWith(BRAND.docsUrl)) url = url.slice(BRAND.docsUrl.length) || '/';
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return null;
  if (url === BASE_PATH || url.startsWith(`${BASE_PATH}/`))
    url = url.slice(BASE_PATH.length) || '/';
  if (!url.startsWith('/')) return null;
  url = url.split('#')[0].split('?')[0];
  if (url.length > 1 && url.endsWith('/')) url = url.slice(0, -1);
  return url || '/';
}
