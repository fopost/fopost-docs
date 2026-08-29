# FoPost Documentation

The documentation site for [FoPost](https://fopost.com). Next.js and [Fumadocs](https://fumadocs.dev), MDX content under `content/`.

Live at [fopost.com/docs](https://fopost.com/docs).

## Sections

| Section | Covers |
|---|---|
| `content/docs/introduction/` | What FoPost is, how it works, supported platforms, quick start |
| `content/docs/guide/` | The dashboard, for creators and teams. Plans and pricing |
| `content/docs/api/` | The Cloud REST API, written against `apps/api/openapi.json` in the `fopost` repo |
| `content/docs/sdks/` | TypeScript, Python, MCP, WordPress plugin, browser extension |

**These docs cover the Cloud only.** The free self-hosted PHP library and its Laravel wrapper are documented in their own repos; do not add pages for them here.

## Development

```bash
npm install
npm run dev      # http://localhost:3000/docs
npm run build
npm test
```

The site is served under a `/docs` basePath. Anything that is not a Next route (a `next/image` src it passes through unoptimised, a `metadata.icons` href) needs the basePath applied by hand. `lib/brand.ts` does that for brand assets; do the same for anything new.

## Writing

- **No em-dashes or en-dashes.** House style, enforced by review
- **Verify before you write.** Every factual claim on these pages should be checked against the source: the OpenAPI spec, `packages/shared` for plans and platform counts, the SDK repos for method names, the registries for what is actually published
- **Do not document something that does not ship.** A page for an unbuilt feature is a promise, and it will be read as one
- **Adding a page** means adding it to the section's `meta.json`. **Removing one** means adding a redirect in `next.config.mjs`, since these URLs are indexed

## Branding

The site is built once per brand. Content under `content/**` is written naming FoPost and the `fopost.com` hosts; `lib/remark-brand.mjs` swaps both for the deployment's brand as the MDX compiles, and `lib/brand.ts` covers everything written in TypeScript.

Those source tokens are what the swap matches on. Writing `fopost.com` into a page defeats it.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_BRAND_NAME` | Product name in prose, page titles, and the sidebar |
| `NEXT_PUBLIC_BRAND_SLUG` | Lowercase identifier |
| `NEXT_PUBLIC_BRAND_DOMAIN` | Bare apex domain |
| `NEXT_PUBLIC_BRAND_LOGO` / `_LOGO_DARK` | Nav mark, light and dark |
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
