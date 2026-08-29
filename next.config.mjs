import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The marketing site these redirects point at is per-brand. The pre-rebrand
// /what-is-owlstack, /why-owlstack and /guide/using-owlstack/* slugs are kept
// as redirect sources only, so external links to them keep resolving.
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
        { source: '/what-is-fopost', destination: '/introduction/what-is-fopost' },
        { source: '/why-fopost', destination: '/introduction/why-fopost' },
        // Pre-rebrand slugs, still linked to from outside.
        { source: '/what-is-owlstack', destination: '/introduction/what-is-fopost' },
        { source: '/why-owlstack', destination: '/introduction/why-fopost' },
        { source: '/how-it-works', destination: '/introduction/how-it-works' },
        { source: '/quick-start', destination: '/introduction/quick-start' },
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
      // AI Studio was replaced by the agent.
      { source: '/guide/using-fopost/ai-studio', destination: '/guide/using-fopost/agent', permanent: true },
      { source: '/guide/using-owlstack/ai-studio', destination: '/guide/using-fopost/agent', permanent: true },
      // The agent page dropped the retired brand's "Owl" name.
      { source: '/guide/using-fopost/owl-agent', destination: '/guide/using-fopost/agent', permanent: true },
      { source: '/guide/using-owlstack/owl-agent', destination: '/guide/using-fopost/agent', permanent: true },
      // The using-owlstack family was renamed to using-fopost in the rebrand.
      { source: '/guide/using-owlstack/:path*', destination: '/guide/using-fopost/:path*', permanent: true },
      { source: '/guide/using-owlstack', destination: '/guide/using-fopost', permanent: true },
      // The guide/ai and guide/pro families folded into using-fopost.
      { source: '/guide/ai/content-generation', destination: '/guide/using-fopost/ai-content', permanent: true },
      { source: '/guide/ai/post-optimization', destination: '/guide/using-fopost/ai-content', permanent: true },
      { source: '/guide/ai/auto-hashtags', destination: '/guide/using-fopost/ai-content', permanent: true },
      { source: '/guide/ai/content-calendar', destination: '/guide/using-fopost/calendar', permanent: true },
      { source: '/guide/ai/ab-testing', destination: '/guide/using-fopost/analytics', permanent: true },
      { source: '/guide/pro/analytics', destination: '/guide/using-fopost/analytics', permanent: true },
      { source: '/guide/pro/scheduling', destination: '/guide/using-fopost/scheduling', permanent: true },
      { source: '/guide/pro/batch-publishing', destination: '/guide/using-fopost/bulk-scheduling', permanent: true },
      { source: '/guide/pro/delivery-logging', destination: '/guide/using-fopost/scheduling', permanent: true },
      { source: '/guide/pro/templates', destination: '/guide/using-fopost/creating-posts', permanent: true },
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
      // Competitor comparisons live on the marketing site, where the data is
      // one source shared with the pricing and feature pages. The docs copies
      // had drifted into claims the product does not make.
      { source: '/comparisons/agorapulse', destination: `${WEBSITE_URL}/compare/agorapulse`, permanent: true },
      { source: '/comparisons/buffer', destination: `${WEBSITE_URL}/compare/buffer`, permanent: true },
      { source: '/comparisons/contentstudio', destination: `${WEBSITE_URL}/compare/contentstudio`, permanent: true },
      { source: '/comparisons/heyorca', destination: `${WEBSITE_URL}/compare/heyorca`, permanent: true },
      { source: '/comparisons/hootsuite', destination: `${WEBSITE_URL}/compare/hootsuite`, permanent: true },
      { source: '/comparisons/later', destination: `${WEBSITE_URL}/compare/later`, permanent: true },
      { source: '/comparisons/metricool', destination: `${WEBSITE_URL}/compare/metricool`, permanent: true },
      { source: '/comparisons/planable', destination: `${WEBSITE_URL}/compare/planable`, permanent: true },
      { source: '/comparisons/publer', destination: `${WEBSITE_URL}/compare/publer`, permanent: true },
      { source: '/comparisons/sendible', destination: `${WEBSITE_URL}/compare/sendible`, permanent: true },
      { source: '/comparisons/socialpilot', destination: `${WEBSITE_URL}/compare/socialpilot`, permanent: true },
      { source: '/comparisons/sprout-social', destination: `${WEBSITE_URL}/compare/sprout-social`, permanent: true },
      { source: '/comparisons/tweethunter', destination: `${WEBSITE_URL}/compare/tweet-hunter`, permanent: true },
      { source: '/comparisons/:slug*', destination: `${WEBSITE_URL}/compare`, permanent: true },
      { source: '/comparisons', destination: `${WEBSITE_URL}/compare`, permanent: true },
      { source: '/introduction/comparisons/:slug*', destination: `${WEBSITE_URL}/compare`, permanent: true },
      { source: '/support', destination: `${WEBSITE_URL}/contact`, permanent: true },
      { source: '/changelog', destination: `${WEBSITE_URL}/roadmap`, permanent: true },
    ];
  },
};

export default withMDX(config);
