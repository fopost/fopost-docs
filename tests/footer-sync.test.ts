import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SIBLING = join(ROOT, '..', 'fopost', 'packages', 'marketing-footer', 'src');
const VENDORED = join(ROOT, 'components', 'marketing-footer');

/** file name → content hash, for every regular file except the generated README. */
function digest(dir: string): Record<string, string> {
  return Object.fromEntries(
    readdirSync(dir)
      .filter((f) => f !== 'README.md' && statSync(join(dir, f)).isFile())
      .map((f) => [f, createHash('sha256').update(readFileSync(join(dir, f))).digest('hex')]),
  );
}

/**
 * The footer in components/marketing-footer/ is a vendored copy of the
 * monorepo's packages/marketing-footer/src. When the sibling checkout is
 * present (the dev machine, the deploy server) this pins the copy to the
 * source; in CI, where there is no sibling, it skips.
 */
describe.skipIf(!existsSync(SIBLING))('vendored footer matches the monorepo source', () => {
  it('has no drift — when this fails, run npm run sync-footer', () => {
    expect(digest(VENDORED), 'run npm run sync-footer').toEqual(digest(SIBLING));
  });
});
