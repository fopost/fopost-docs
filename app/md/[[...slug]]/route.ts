import { source } from '@/lib/source';
import { pageMarkdown } from '@/lib/markdown';
import { notFound } from 'next/navigation';

/**
 * The Markdown source of a page, for models and for anyone who would rather
 * read the text than the site. `next.config.mjs` rewrites `<path>.md` here.
 *
 * Lookup is by public URL, not by file slug: the introduction pages are served
 * a level up from where they live, so `/quick-start` and `introduction/quick-start`
 * are the same page and only the URL is the address a reader has.
 */
export const revalidate = false;

/** `/` has no slug to append `.md` to, so its Markdown lives at `/index.md`. */
const urlOf = (slug: string[] = []) =>
  slug.length === 0 || (slug.length === 1 && slug[0] === 'index') ? '/' : `/${slug.join('/')}`;

export async function GET(_request: Request, props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params;
  const url = urlOf(slug);
  const page = source.getPages().find((candidate) => candidate.url === url);
  if (!page) notFound();

  return new Response(await pageMarkdown(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.url === '/' ? ['index'] : page.url.slice(1).split('/'),
  }));
}
