# OwlStack Documentation

The official documentation site for [OwlStack](https://owlstack.dev) - a unified social media publishing SDK for PHP.

🌐 **Live site:** [docs.owlstack.dev](https://docs.owlstack.dev)

## What's Inside

- **Getting Started** - Installation, quick start guides for Core, Laravel, and WordPress
- **Core Concepts** - Posts, media, platform config, publishing, delivery status, error handling
- **Platforms** - Guides for all 11 supported platforms (Telegram, Twitter/X, Facebook, LinkedIn, Discord, Instagram, Pinterest, Reddit, Slack, Tumblr, WhatsApp)
- **Formatting** - Platform formatters, character limits, hashtag extraction
- **Authentication** - OAuth flows, access tokens, token storage
- **Events** - Event system, dispatchers, listeners
- **Frameworks** - Laravel and WordPress integration guides
- **Pro Features** - Batch publishing, scheduling, queues, delivery logging, templates, automation, AI, analytics
- **Extending** - Custom platforms, formatters, and HTTP clients
- **Blog** - Announcements and migration guides

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

Starts a local dev server at `http://localhost:3000`. Changes are hot-reloaded.

### Locale-specific previews

```bash
npm run start:fa   # Farsi (RTL)
npm run start:zh   # Chinese
npm run start:ja   # Japanese
```

## Build

```bash
npm run build
```

Generates static files into the `build` directory for all locales (en, fa, zh, ja).

## Versioning

Docs are versioned. The current stable version is **1.0**. To create a new version snapshot:

```bash
npx docusaurus docs:version X.Y
```

## Project Structure

```
docs/              # Current (next) version documentation
versioned_docs/    # Snapshotted version docs (e.g. version-1.0/)
blog/              # Blog posts
src/               # React components, pages, CSS
  components/      # ProBadge, ProFeature, PlatformTable
  css/             # Custom styles
  pages/           # Homepage
static/img/        # Logos and images
i18n/              # Translation files (fa, zh, ja)
```

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b docs/my-change`)
3. Make your changes
4. Run `npm run build` to verify no broken links
5. Submit a pull request

## License

This documentation is part of the [OwlStack](https://github.com/owlstacks) project.

## Branding

The docs site is built once per brand. Prose under `content/**` keeps naming
the product "OwlStack"; `lib/remark-brand.mjs` applies the deployment's brand
during the build, and `lib/brand.ts` covers everything written in TypeScript.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_BRAND_NAME` | Product name in prose, page titles, and the sidebar |
| `NEXT_PUBLIC_BRAND_SLUG` | Lowercase identifier |
| `NEXT_PUBLIC_BRAND_DOMAIN` | Bare apex domain |
| `NEXT_PUBLIC_BRAND_LOGO` | Nav mark, e.g. `/brand/fopost/logo.png` |
| `NEXT_PUBLIC_BRAND_FAVICON` | Browser tab icon |
| `NEXT_PUBLIC_WEBSITE_URL` / `_APP_URL` / `_API_URL` / `_DOCS_URL` | Service hosts, rewritten in prose and in code samples |

Unset means OwlStack: the build is byte-for-byte what it was before.

Two things are deliberately **not** rewritten:

- **Names inside code fences.** Most are SDK symbols (`OwlStack::Client`,
  `from owlstack import OwlStack`) that name a real published package, so
  rewriting them would hand the reader code that does not run. Hostnames in
  code *are* rewritten, so a copied `curl` still hits the right API.
- **URL slugs** such as `/introduction/what-is-owlstack`. They are routes with
  existing inbound links, not branding.

Add a brand by dropping `logo.png` and `favicon.ico` into
`public/brand/<slug>/` and pointing the variables at them.
