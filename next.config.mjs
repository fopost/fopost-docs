import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The marketing site these redirects point at is per-brand. The /what-is-*
// and /why-* rewrites above are legacy content slugs, not branding — they
// name a page that exists, so they stay as written.
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL?.trim() || 'https://fopost.com';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  basePath: '/docs',
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/introduction' },
        { source: '/what-is-owlstack', destination: '/introduction/what-is-owlstack' },
        { source: '/why-owlstack', destination: '/introduction/why-owlstack' },
        { source: '/how-it-works', destination: '/introduction/how-it-works' },
        { source: '/quick-start', destination: '/introduction/quick-start' },
        { source: '/comparisons', destination: '/introduction/comparisons' },
        { source: '/comparisons/:path+', destination: '/introduction/comparisons/:path+' },
      ],
    };
  },
  async redirects() {
    return [
      { source: '/introduction', destination: '/', permanent: true },
      { source: '/introduction/:path+', destination: '/:path+', permanent: true },
      // Section indexes with no page of their own (GSC 404s)
      { source: '/api', destination: '/api/overview', permanent: true },
      { source: '/guide/plans', destination: '/guide/plans/overview', permanent: true },
      // Retired plan tiers. Pro Plus and Pro AI became Business; there is no
      // enterprise plan.
      { source: '/guide/plans/pro-plus', destination: '/guide/plans/business', permanent: true },
      { source: '/guide/plans/pro-ai', destination: '/guide/plans/business', permanent: true },
      { source: '/guide/plans/enterprise', destination: '/guide/plans/overview', permanent: true },
      // AI Studio was replaced by the Owl Agent.
      { source: '/guide/using-owlstack/ai-studio', destination: '/guide/using-owlstack/owl-agent', permanent: true },
      // The guide/ai and guide/pro families folded into using-owlstack.
      { source: '/guide/ai/content-generation', destination: '/guide/using-owlstack/ai-content', permanent: true },
      { source: '/guide/ai/post-optimization', destination: '/guide/using-owlstack/ai-content', permanent: true },
      { source: '/guide/ai/auto-hashtags', destination: '/guide/using-owlstack/ai-content', permanent: true },
      { source: '/guide/ai/content-calendar', destination: '/guide/using-owlstack/calendar', permanent: true },
      { source: '/guide/ai/ab-testing', destination: '/guide/using-owlstack/analytics', permanent: true },
      { source: '/guide/pro/analytics', destination: '/guide/using-owlstack/analytics', permanent: true },
      { source: '/guide/pro/scheduling', destination: '/guide/using-owlstack/scheduling', permanent: true },
      { source: '/guide/pro/batch-publishing', destination: '/guide/using-owlstack/bulk-scheduling', permanent: true },
      { source: '/guide/pro/delivery-logging', destination: '/guide/using-owlstack/scheduling', permanent: true },
      { source: '/guide/pro/templates', destination: '/guide/using-owlstack/creating-posts', permanent: true },
      { source: '/guide/ai/:path*', destination: '/guide', permanent: true },
      { source: '/guide/pro/:path*', destination: '/guide', permanent: true },
      { source: '/guide/ai', destination: '/guide', permanent: true },
      { source: '/guide/pro', destination: '/guide', permanent: true },
      // Retired pages for SDKs that were never built. The overview says what
      // exists and what does not, instead of a page per language promising one.
      // Cloud topics that had duplicate pages under the PHP library section.
      { source: '/developers/authentication/api-keys', destination: '/api/authentication', permanent: true },
      { source: '/developers/events/webhooks', destination: '/api/webhooks', permanent: true },
      { source: '/sdks/nodejs', destination: '/sdks/typescript', permanent: true },
      { source: '/sdks/python-sdk', destination: '/sdks/python', permanent: true },
      { source: '/sdks/golang', destination: '/sdks/overview', permanent: true },
      { source: '/sdks/ruby', destination: '/sdks/overview', permanent: true },
      { source: '/sdks/rust', destination: '/sdks/overview', permanent: true },
      { source: '/support', destination: `${WEBSITE_URL}/contact`, permanent: true },
      { source: '/changelog', destination: `${WEBSITE_URL}/roadmap`, permanent: true },
    ];
  },
};

export default withMDX(config);
