import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'content/docs');
const SVG_DIR = join(ROOT, 'icons/svg');

function walk(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full, ext);
    return entry.endsWith(ext) ? [full] : [];
  });
}

const available = new Set(readdirSync(SVG_DIR).map((file) => file.replace(/\.svg$/, '')));
const rel = (file: string) => file.slice(ROOT.length);

/**
 * An icon slug that has no SVG renders nothing at all: the sidebar row just
 * loses its icon and the page still builds, so nobody notices until someone
 * looks at every section. That is exactly the silent failure worth a test.
 */
describe('Every icon a page or a section names actually exists', () => {
  it('resolves each frontmatter icon', () => {
    const missing = walk(CONTENT, '.mdx').flatMap((file) => {
      const slug = readFileSync(file, 'utf8').match(/^icon:\s*(\S+)\s*$/m)?.[1];
      return slug && !available.has(slug) ? [`${rel(file)}: ${slug}`] : [];
    });

    expect(missing).toEqual([]);
  });

  it('resolves each meta.json icon', () => {
    const missing = walk(CONTENT, 'meta.json').flatMap((file) => {
      const slug = JSON.parse(readFileSync(file, 'utf8')).icon as string | undefined;
      return slug && !available.has(slug) ? [`${rel(file)}: ${slug}`] : [];
    });

    expect(missing).toEqual([]);
  });

  it('gives every page an icon, so no sidebar row is left bare', () => {
    const bare = walk(CONTENT, '.mdx').filter(
      (file) => !/^icon:\s*\S+\s*$/m.test(readFileSync(file, 'utf8')),
    );

    expect(bare.map(rel)).toEqual([]);
  });
});

/**
 * The page title is rendered above the body. A body that opens with the same
 * text as an H1 prints it twice, which is how these pages read before the
 * headings were stripped.
 */
describe('No page body repeats its own title', () => {
  it('has no H1 matching the frontmatter title', () => {
    const repeats = walk(CONTENT, '.mdx').flatMap((file) => {
      const source = readFileSync(file, 'utf8');
      const title = source.match(/^title:\s*(.+)$/m)?.[1].trim();
      const heading = source.replace(/^---\n[\s\S]*?\n---\n/, '').match(/^#\s+(.+)$/m)?.[1].trim();
      return title && heading === title ? [rel(file)] : [];
    });

    expect(repeats).toEqual([]);
  });
});
