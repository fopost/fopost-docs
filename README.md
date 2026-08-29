# FoPost Documentation

The documentation site for [FoPost](https://fopost.com). Next.js and [Fumadocs](https://fumadocs.dev), MDX content under `content/`.

Live at [fopost.com/docs](https://fopost.com/docs).

## Sections

| Section | Covers |
|---|---|
| `content/docs/introduction/` | What FoPost is, how it works, supported platforms, quick start |
| `content/docs/guide/` | The dashboard, for creators and teams. Plans and pricing |
| `content/docs/api/` | The Cloud REST API, written against `apps/api/openapi.json` in the `fopost` repo |
| `content/docs/sdks/` | TypeScript, Python, PHP, Laravel, MCP, WordPress plugin, browser extension |

**These docs cover the Cloud only**, meaning everything that publishes through a FoPost account with an API key. That includes the Cloud PHP client (`fopost/sdk`, the `fopost-php` repo) and its Laravel wrapper (`fopost/laravel`, `fopost-laravel`), both of which have pages here.

What does **not** belong here is the separate free, self-hosted PHP library that talks to each network from your own server with your own app credentials (`fopost-social-core`) and its own framework wrappers (`fopost-social-laravel`, `fopost-social-wp`). Those are documented in their own repos. The `fopost-<language>` repos are Cloud clients; the `fopost-social-*` repos are the self-hosted library. Confusing the two is how PHP went undocumented here for months.

## Development

```bash
npm install
npm run dev      # http://localhost:3000/docs
npm run build
npm test
npm run icons    # regenerate components/icons/ from icons/svg/
```

The site is served under a `/docs` basePath. Anything that is not a Next route (a `next/image` src it passes through unoptimised, a `metadata.icons` href) needs the basePath applied by hand. `lib/brand.ts` does that for brand assets; do the same for anything new.

## Design

The docs share the marketing site's design system. `app/geist.css` is a copy of
`packages/design/geist.css` from the `fopost` monorepo, and `app/global.css`
points every fumadocs `--color-fd-*` at a `--ds-*` token from it, so both sites
draw from one palette and flip together. Surfaces are background plus the 1px
`shadow-border` hairline at a 12px radius; nothing casts a drop shadow. Blue
(`--ds-blue-700`) is the only accent, and it means "this goes somewhere".

The four sections sit in the navbar (`tabMode: 'navbar'` on the notebook layout)
rather than behind a dropdown, and the sidebar shows one section's tree in full.

### Icons

Geist SVG icons, generated the same way the monorepo generates `@fopost/icons`.
That package is private and cannot be imported here, so `icons/svg/` holds the
subset this site renders and `scripts/generate-icons.mjs` compiles it into
`components/icons/`. Never hand-edit the generated files.

Adding one: copy the export from `packages/icons/svg/<slug>.svg` in the
monorepo into `icons/svg/`, run `npm run icons`, and commit both. Language and
framework brand marks that Geist has no equivalent for are vendored under a
`tech-` prefix; `icons/SOURCE.md` records where each set comes from.

A page names its icon by slug in frontmatter (`icon: rocket`); a section names
one in its `meta.json`. `tests/docs-icons.test.ts` fails on a slug with no SVG
and on a page with no icon at all. `components/icons/registry.tsx` is
**server-components-only** — it references every icon, so a client import ships
all of them; client components import by name.

Icon fonts are banned, and so is `lucide-react`.

## Markdown and AI clients

Every page is also served as Markdown at its own URL plus `.md`
(`/docs/quick-start.md`; the site root is `/docs/index.md`), with `/docs/llms.txt`
as the index and `/docs/llms-full.txt` as the whole site in one file. The page
header carries a **Copy page** button and an **Open** menu built on the same
route, so a reader can hand any page to a model without scraping it.

That text is the compiled Markdown, produced after the brand plugin runs, so it
names the deployment's brand like the rendered page does.

## Writing

- **No em-dashes or en-dashes.** House style, enforced by review
- **Verify before you write.** Every factual claim on these pages should be checked against the source: the OpenAPI spec, `packages/shared` for plans and platform counts, the SDK repos for method names, the registries for what is actually published
- **Do not document something that does not ship.** A page for an unbuilt feature is a promise, and it will be read as one
- **Adding a page** means adding it to the section's `meta.json` and giving it an `icon`. **Removing one** means adding a redirect in `next.config.mjs`, since these URLs are indexed
- **No page opens with an H1 repeating its own title.** The title is rendered above the body already; a second copy prints it twice. Start at `##`

## Branding

The site is built once per brand. Content under `content/**` is written naming FoPost and the `fopost.com` hosts; `lib/remark-brand.mjs` swaps both for the deployment's brand as the MDX compiles, and `lib/brand.ts` covers everything written in TypeScript.

Those source tokens are what the swap matches on. Writing `fopost.com` into a page defeats it.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_BRAND_NAME` | Product name in prose, page titles, and the sidebar |
| `NEXT_PUBLIC_BRAND_SLUG` | Lowercase identifier |
| `NEXT_PUBLIC_BRAND_DOMAIN` | Bare apex domain |
| `NEXT_PUBLIC_BRAND_LOGO` / `_LOGO_DARK` | Nav mark: the black mark on light, the white mark on dark |
| `NEXT_PUBLIC_BRAND_FAVICON` / `_APPLE_TOUCH_ICON` | Tab and touch icons |
| `NEXT_PUBLIC_WEBSITE_URL` / `_APP_URL` / `_API_URL` / `_DOCS_URL` | Service hosts, rewritten in prose and in code samples |

Two things are deliberately **not** rewritten:

- **Package names inside code fences.** `@fopost/sdk`, `fopost/fopost-social-core`, `from fopost import Fopost` name real published packages. Rewriting them would hand the reader code that does not run. Hostnames in code *are* rewritten, so a copied `curl` hits the right API
- **URL slugs** such as `/introduction/what-is-fopost`. They are routes with inbound links, not branding

Add a brand by dropping `mark.svg`, `mark-dark.svg`, `favicon.ico`, and `apple-touch-icon.png` into `public/brand/<slug>/` and pointing the variables at them.

## Deployment

Built as a Docker image from this repo by `fopost-deploy`. `NEXT_PUBLIC_*` values are baked at build time, so changing one needs a rebuild.

## License

Part of the [FoPost](https://github.com/foposts) project.
