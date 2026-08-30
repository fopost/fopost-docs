import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import config from '../next.config.mjs';
import { pageUrl, urlToParams } from '../lib/page-url';

const INTRODUCTION = fileURLToPath(new URL('../content/docs/introduction', import.meta.url));

/* next.config.mjs is plain JS, so the shapes come back loosely typed; both
   hooks are defined right there in the file this test imports. */
type Rule = { source: string; destination: string };
const rewrites = (await config.rewrites!()) as { beforeFiles: Rule[] };
const redirects = (await config.redirects!()) as Rule[];

/**
 * The introduction pages are addressed a level up from where they live. The
 * mapping is a pure function the loader and the route share, not a list of
 * rewrites: a hand-maintained list is how /platforms 404ed, and a rewrite is
 * how every introduction URL shipped the whole sidebar until hydration, since
 * the server rendered /introduction/x while the browser sat on /x.
 */
describe('Every introduction page is reachable at its public URL', () => {
  const slugs = readdirSync(INTRODUCTION)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));

  it('has a page to serve', () => {
    expect(slugs.length).toBeGreaterThan(1);
  });

  /* The loader drops an `index` segment before it asks for a URL, so the
     section's own page arrives as ['introduction']. */
  const urls = slugs.map((slug) =>
    pageUrl(slug === 'index' ? ['introduction'] : ['introduction', slug]),
  );

  it('serves each one without the section prefix', () => {
    expect(urls).toEqual(slugs.map((slug) => (slug === 'index' ? '/' : `/${slug}`)));
  });

  it('round-trips every public URL back to the params that serve it', () => {
    expect(urls.map((url) => pageUrl(urlToParams(url)))).toEqual(urls);
  });
});

/**
 * A rewrite leaves the server rendering a different pathname than the browser
 * is on, and the sidebar picks its section from the pathname: every rewritten
 * page shipped the full tree and re-rendered it on hydration. Only the .md
 * source of a page may be rewritten, because nothing renders a sidebar there.
 */
describe('No rewrite changes the pathname a page renders at', () => {
  it('rewrites nothing but the .md source', () => {
    const pageRewrites = rewrites.beforeFiles.filter((rule) => !rule.source.endsWith('\\.md'));

    expect(pageRewrites).toEqual([]);
  });
});

/**
 * A `:param*` matches the empty string too, so a wildcard redirect written for
 * a section's children also swallows the section's own page: /sdks/wordpress
 * was redirecting to the docs home. `+` is the one that means "at least one".
 */
describe('No wildcard redirect swallows the path it sits under', () => {
  it('uses + rather than * on every prefix redirect', () => {
    const greedy = redirects
      .filter((rule) => /:\w+\*/.test(rule.source))
      .map((rule) => rule.source);

    expect(greedy).toEqual([]);
  });

  it('does not redirect a URL that is a real page', () => {
    const pages = [
      '/sdks/wordpress',
      '/sdks/php',
      '/sdks/laravel',
      '/sdks/typescript',
      '/sdks/ruby',
      '/sdks/go',
      '/sdks/rust',
      '/sdks/java',
      '/sdks/dotnet',
    ];
    const caught = pages.filter((page) => redirects.some((rule) => rule.source === page));

    expect(caught).toEqual([]);
  });
});

/**
 * The retired brand is gone from the site, and a redirect source is as public
 * as a page: the URL shows up in a browser's address bar on the way through.
 */
describe('No route rule carries the retired brand', () => {
  it('names it in no source or destination', () => {
    const named = [...rewrites.beforeFiles, ...redirects]
      .flatMap((rule) => [rule.source, rule.destination])
      .filter((value) => /owlstack/i.test(value));

    expect(named).toEqual([]);
  });
});
