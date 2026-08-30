import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import config from '../next.config.mjs';

const INTRODUCTION = fileURLToPath(new URL('../content/docs/introduction', import.meta.url));

/* next.config.mjs is plain JS, so the shapes come back loosely typed; both
   hooks are defined right there in the file this test imports. */
const rewrites = (await config.rewrites!()) as { beforeFiles: { source: string }[] };
const redirects = (await config.redirects!()) as { source: string }[];
const sources = new Set(rewrites.beforeFiles.map((rule) => rule.source));

/**
 * The introduction pages are served a level up from where they live, so each
 * one needs a rewrite. /platforms 404ed in production for exactly as long as
 * that list was maintained by hand.
 */
describe('Every introduction page is reachable at its public URL', () => {
  const slugs = readdirSync(INTRODUCTION)
    .filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')
    .map((file) => file.replace(/\.mdx$/, ''));

  it('has a page to serve', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it('rewrites each one', () => {
    expect(slugs.filter((slug) => !sources.has(`/${slug}`))).toEqual([]);
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
