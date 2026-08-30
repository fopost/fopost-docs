# Icon sources

Two sets live in `icons/svg/`, and `scripts/generate-icons.mjs` compiles both
into `components/icons/`. Never hand-edit the generated files.

## Geist icons

Everything without a prefix. Copied from `packages/icons/svg/` in the `fopost`
monorepo, which is the Figma export of Vercel's Geist set. That package is
private, so the docs keep the subset this site renders rather than importing it.

To add one: copy `packages/icons/svg/<slug>.svg` across and run `npm run icons`.

## Technology marks: `tech-*`

Brand marks Geist does not carry, for the languages and frameworks the SDKs
target. Taken from [simple-icons](https://github.com/simple-icons/simple-icons)
15.22.0, which publishes them under **CC0-1.0**: single path, monochrome, on a
24 grid, which is what makes them safe to recolour to `currentColor` and drop
into the same tile as a Geist icon.

The marks themselves remain trademarks of their owners and are used here only
to identify the client each page documents.

| File | simple-icons slug |
| --- | --- |
| `tech-typescript.svg` | `typescript` |
| `tech-python.svg` | `python` |
| `tech-php.svg` | `php` |
| `tech-laravel.svg` | `laravel` |
| `tech-java.svg` | `openjdk` |
| `tech-dotnet.svg` | `dotnet` |
| `tech-rust.svg` | `rust` |
| `tech-go.svg` | `go` |
| `tech-ruby.svg` | `ruby` |
| `tech-mcp.svg` | `modelcontextprotocol` |

Every one of these now has a page behind it.

To add one, fetch the mark, strip `<title>` and `role`, put `fill="#000000"` on
the paths (the generator themes that to `currentColor`, and the root `<svg>` is
`fill="none"`, so a path with no fill would render nothing), and keep the
original `viewBox`.
