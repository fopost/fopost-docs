import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const CONTENT = fileURLToPath(new URL('../content', import.meta.url));
const API_DOCS = join(CONTENT, 'docs/api');

function mdxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return mdxFiles(full);
    return entry.endsWith('.mdx') ? [full] : [];
  });
}

function offenders(files: string[], pattern: RegExp, label: string): string[] {
  return files.flatMap((file) =>
    readFileSync(file, 'utf8')
      .split('\n')
      .flatMap((line, i) => (pattern.test(line) ? [`${file.slice(CONTENT.length)}:${i + 1} ${label}`] : [])),
  );
}

/**
 * FoPost's own per-minute ceiling is an abuse control we reserve the right to
 * move, so it is never stated publicly. Third-party platform limits (Reddit,
 * Tumblr) are legitimately documented, so only our own API docs are scanned.
 */
describe('Rate-limit thresholds are not published on any public page', () => {
  const apiDocs = mdxFiles(API_DOCS);

  it('has no per-plan rate table in the API docs', () => {
    const column = /requests?\s*[/|]\s*(minute|min|hour|day)/i;
    expect(offenders(apiDocs, column, 'rate-per-period table column')).toEqual([]);
  });

  it('states no numeric request rate in the API docs', () => {
    const rate = /\b\d[\d,]*\s*(requests?|reqs?|calls?)\b\s*(per|\/)\s*(second|minute|min|hour|day)\b/i;
    expect(offenders(apiDocs, rate, 'numeric request rate')).toEqual([]);
  });

  it('never fills a concrete number into the X-RateLimit-Limit example', () => {
    const header = /X-RateLimit-Limit:\s*\d/i;
    expect(offenders(mdxFiles(CONTENT), header, 'literal rate ceiling')).toEqual([]);
  });
});
