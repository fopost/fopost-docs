import { source } from '@/lib/source';
import { pageUrl } from '@/lib/markdown';
import { BRAND } from '@/lib/brand';

type Page = ReturnType<typeof source.getPages>[number];

/** Docs root, e.g. https://fopost.com/docs. No trailing slash. */
export const SITE_URL = BRAND.docsUrl;
const SITE_NAME = `${BRAND.name} Docs`;

/* schema.org node ids. They are the marketing site's, not the docs site's, so
   a crawler merges the two into one graph instead of seeing two publishers. */
const ORGANIZATION_ID = `${BRAND.websiteUrl}/#organization`;
const WEBSITE_ID = `${BRAND.websiteUrl}/#website`;

type Crumb = { name: string; url: string };

/* The page tree carries site-relative URLs; schema.org wants absolute ones. */
const absolute = (url: string) => `${SITE_URL}${url === '/' ? '' : url}`;

/**
 * The trail from the docs root down to a page. An ancestor earns a crumb only
 * when a page is actually served at that path: several sections are grouping
 * folders whose own URL redirects into the section (`/api` -> `/api/overview`),
 * and a crumb pointing at a redirect is a crumb pointing nowhere.
 */
export function breadcrumbTrail(page: Page): Crumb[] {
  if (page.url === '/') return [];

  const segments = page.url.slice(1).split('/');
  const pages = source.getPages();

  const ancestors = segments.slice(0, -1).flatMap((_, i) => {
    const url = `/${segments.slice(0, i + 1).join('/')}`;
    const ancestor = pages.find((candidate) => candidate.url === url);
    return ancestor ? [{ name: ancestor.data.title, url: absolute(url) }] : [];
  });

  return [...ancestors, { name: page.data.title, url: absolute(page.url) }];
}

/**
 * One self-contained graph per page: who publishes it, which site it belongs
 * to, where it sits, and the page itself. TechArticle is the type Google
 * documents for developer documentation.
 */
export function pageGraph(page: Page) {
  const url = pageUrl(page);
  const trail = breadcrumbTrail(page);

  const nodes: object[] = [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: BRAND.name,
      url: BRAND.websiteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${BRAND.logoLarge.replace(/^\/docs/, '')}`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: BRAND.name,
      url: BRAND.websiteUrl,
      publisher: { '@id': ORGANIZATION_ID },
      inLanguage: 'en-US',
    },
    {
      '@type': 'TechArticle',
      '@id': `${url}#article`,
      headline: page.data.title,
      name: page.data.title,
      ...(page.data.description ? { description: page.data.description } : {}),
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      isPartOf: { '@id': WEBSITE_ID },
      // Brand voice only: no personal identities on public surfaces.
      author: { '@id': ORGANIZATION_ID },
      publisher: { '@id': ORGANIZATION_ID },
      inLanguage: 'en-US',
    },
  ];

  // The root page is the start of every trail, so it gets no list of its own.
  if (trail.length > 0) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [{ name: SITE_NAME, url: SITE_URL }, ...trail].map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': nodes };
}
