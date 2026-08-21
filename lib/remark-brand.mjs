/**
 * Apply the deployment's brand to the docs at build time.
 *
 * The 119 files under content/ are prose. Threading a JSX expression through
 * every sentence that names the product would make them unreadable and would
 * break the moment someone writes a new page the normal way — so the content
 * keeps saying "OwlStack" and this module applies the brand as the docs are
 * compiled.
 *
 * Two rules, deliberately different:
 *
 *   Prose  — the product name is rewritten, and so are service hostnames.
 *            Longer identifiers are left alone (`@owlstackapp/sdk`,
 *            `owlstack-core`): the published packages carry that name
 *            whatever the site is called.
 *   Code   — only the hostnames, so a copied curl command hits the API the
 *            reader actually has an account on. The name is left alone inside
 *            a fence on purpose: most occurrences there are SDK symbols
 *            (`OwlStack::Client`, `use OwlStack\\OwlStack`,
 *            `from owlstack import OwlStack`) that name a real published
 *            package. Rewriting them would hand the reader code that does not
 *            run. The cost is a handful of ASCII diagrams that keep the old
 *            name; the alternative is broken samples.
 *
 * A no-op when nothing is configured: the defaults are the OwlStack values.
 *
 * Frontmatter and meta.json titles never reach a remark plugin — fumadocs
 * parses them separately — so source.config.ts runs `brandText` over them
 * through the schemas. That is where the sidebar and page titles come from.
 */

const DEFAULTS = {
  name: 'OwlStack',
  websiteHost: 'owlstack.app',
  appHost: 'app.owlstack.app',
  apiHost: 'api.owlstack.app',
  docsHost: 'owlstack.app/docs',
};

const pick = (value, fallback) => (value && value.trim()) || fallback;
const hostOf = (url, fallback) =>
  pick(url, '').replace(/^https?:\/\//, '').replace(/\/$/, '') || fallback;

/** Standalone brand words only — never part of a longer identifier. */
const NAME_RE = /(?<![A-Za-z0-9_@/-])Owl[Ss]tack(?![A-Za-z0-9_-])/g;

function config() {
  const name = pick(process.env.NEXT_PUBLIC_BRAND_NAME, DEFAULTS.name);
  // Matched scheme-less so a bare "api.owlstack.app" in an ASCII diagram is
  // rewritten too, and longest-first so app./api./docs paths are consumed
  // before the apex they contain.
  const hosts = [
    [DEFAULTS.docsHost, hostOf(process.env.NEXT_PUBLIC_DOCS_URL, DEFAULTS.docsHost)],
    [DEFAULTS.apiHost, hostOf(process.env.NEXT_PUBLIC_API_URL, DEFAULTS.apiHost)],
    [DEFAULTS.appHost, hostOf(process.env.NEXT_PUBLIC_APP_URL, DEFAULTS.appHost)],
    [DEFAULTS.websiteHost, hostOf(process.env.NEXT_PUBLIC_WEBSITE_URL, DEFAULTS.websiteHost)],
  ].filter(([from, to]) => from !== to);
  const changed = name !== DEFAULTS.name || hosts.length > 0;
  return { name, hosts, changed };
}

/** Service hostnames only. Safe inside a code sample. */
export function brandCode(value) {
  const { hosts, changed } = config();
  let out = hosts.reduce((acc, [from, to]) => acc.split(from).join(to), value);
  // The content was written against OwlStack's deployed API, which still
  // serves /api/v1. Branded deployments run the current code, whose prefix is
  // /v1 — so a branded build also normalises the path. The default build must
  // NOT: its samples have to keep matching what owlstack.app actually serves.
  if (changed) out = out.split('/api/v1').join('/v1');
  return out;
}

/** Hostnames and the product name. For prose, titles, and descriptions. */
export function brandText(value) {
  const { name } = config();
  return brandCode(value).replace(NAME_RE, name);
}

export default function remarkBrand() {
  const { changed } = config();
  return (tree) => {
    if (!changed) return;
    visit(tree, (node) => {
      if (node.type === 'text' || node.type === 'html') {
        node.value = brandText(node.value);
      } else if (node.type === 'code' || node.type === 'inlineCode') {
        node.value = brandCode(node.value);
      } else if (node.type === 'link' || node.type === 'definition') {
        node.url = brandCode(node.url);
      }
      // MDX component props — <Card title="What is OwlStack?" /> — are
      // attributes, not children, so the walk above never sees them.
      for (const attr of node.attributes ?? []) {
        if (attr.type === 'mdxJsxAttribute' && typeof attr.value === 'string') {
          attr.value = brandText(attr.value);
        }
      }
    });
  };
}

/** Minimal depth-first walk — avoids a unist-util-visit dependency. */
function visit(node, fn) {
  fn(node);
  for (const child of node.children ?? []) visit(child, fn);
}
