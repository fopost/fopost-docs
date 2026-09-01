# FoPost Documentation

The content for the FoPost documentation site at [fopost.com/docs](https://fopost.com/docs).

This repository holds only the documentation itself. The site application lives in a private repository and consumes this repo as a git submodule mounted at its content path.

## Structure

- One folder per section: `introduction/`, `guide/`, `sdks/`, `api/`
- Pages are MDX (`.mdx`)
- Each folder's `meta.json` sets the page order and section title; the root `meta.json` orders the sections

Write "FoPost" in prose as usual — the site application rebrands the content at build time, so contributors should always use the FoPost name.

## Contributing

Fixes and clarifications are welcome — open a pull request. Keep changes focused: one topic per PR.
