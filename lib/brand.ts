/**
 * Brand identity for this docs deployment.
 *
 * The docs site is built once per brand, so the name, domain, and logo are
 * build-time configuration. Prose in `content/**` keeps writing "OwlStack";
 * the remark plugin in `lib/remark-brand.mjs` rewrites it during the build.
 * Anything in TypeScript reads from here instead.
 *
 * Each field is listed explicitly because Next.js inlines
 * `process.env.NEXT_PUBLIC_*` by literal text substitution — a computed
 * lookup would be undefined in the browser bundle.
 */
const pick = (value: string | undefined, fallback: string) => value?.trim() || fallback;

export const BRAND = {
  name: pick(process.env.NEXT_PUBLIC_BRAND_NAME, 'OwlStack'),
  slug: pick(process.env.NEXT_PUBLIC_BRAND_SLUG, 'owlstack'),
  domain: pick(process.env.NEXT_PUBLIC_BRAND_DOMAIN, 'owlstack.app'),
  logo: pick(process.env.NEXT_PUBLIC_BRAND_LOGO, '/brand/owlstack/logo.png'),
  favicon: pick(process.env.NEXT_PUBLIC_BRAND_FAVICON, '/brand/owlstack/favicon.ico'),
  appleTouchIcon: pick(process.env.NEXT_PUBLIC_BRAND_APPLE_TOUCH_ICON, ''),
  websiteUrl: pick(process.env.NEXT_PUBLIC_WEBSITE_URL, 'https://owlstack.app'),
  appUrl: pick(process.env.NEXT_PUBLIC_APP_URL, 'https://app.owlstack.app'),
  apiUrl: pick(process.env.NEXT_PUBLIC_API_URL, 'https://api.owlstack.app'),
  docsUrl: pick(process.env.NEXT_PUBLIC_DOCS_URL, 'https://owlstack.app/docs'),
} as const;
