import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SUGGESTED_URLS } from '../lib/suggested-pages';

const CONTENT = fileURLToPath(new URL('../content/docs', import.meta.url));

/**
 * A suggestion with no page behind it silently disappears from the search
 * dialog, so every curated URL must resolve to a content file. Introduction
 * pages are addressed one level up from where they live (see lib/page-url.ts).
 */
describe('Every search suggestion resolves to a page', () => {
  it.each([...SUGGESTED_URLS])('%s', (url) => {
    const candidates = [
      `${CONTENT}${url}.mdx`,
      `${CONTENT}${url}/index.mdx`,
      `${CONTENT}/introduction${url}.mdx`,
    ];
    expect(candidates.some((file) => existsSync(file))).toBe(true);
  });
});
