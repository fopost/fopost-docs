/**
 * The public URL a docs file is served at, and its `[[...slug]]` params.
 *
 * Introduction pages live one level down from where they are addressed, so
 * `content/docs/introduction/quick-start.mdx` is `/quick-start`. The mapping is
 * done here rather than with a rewrite: a rewrite leaves the server rendering
 * `/introduction/quick-start` while the browser is on `/quick-start`, and the
 * sidebar, which picks its section from the pathname, then ships the whole tree
 * until hydration corrects it.
 */
export function pageUrl(slugs: string[]): string {
  const rest = slugs[0] === 'introduction' ? slugs.slice(1) : slugs;
  return rest.length === 0 ? '/' : `/${rest.join('/')}`;
}

/** The route params that serve a public URL. */
export function urlToParams(url: string): string[] {
  return url === '/' ? [] : url.slice(1).split('/');
}
