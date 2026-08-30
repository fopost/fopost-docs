import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The marketing site these redirects point at is per-brand.
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL?.trim() || 'https://fopost.com';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  basePath: '/docs',
  async rewrites() {
    return {
      beforeFiles: [
        // Any page, as Markdown, by appending .md — the convention AI clients
        // and crawlers look for. `/index.md` is the site root, which has no
        // slug of its own.
        { source: '/:slug(.*)\\.md', destination: '/md/:slug' },
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
      // The agent page was renamed when the retired brand's name went.
      { source: '/guide/using-fopost/owl-agent', destination: '/guide/using-fopost/agent', permanent: true },
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
      { source: '/guide/ai/:path+', destination: '/guide', permanent: true },
      { source: '/guide/pro/:path+', destination: '/guide', permanent: true },
      { source: '/guide/ai', destination: '/guide', permanent: true },
      { source: '/guide/pro', destination: '/guide', permanent: true },
      // Retired pages for SDKs that were never built. The overview says what
      // exists and what does not, instead of a page per language promising one.
      // Cloud topics that had duplicate pages under the PHP library section.
      { source: '/developers/authentication/api-keys', destination: '/api/authentication', permanent: true },
      { source: '/developers/events/webhooks', destination: '/api/webhooks', permanent: true },
      // The self-hosted PHP library and its Laravel wrapper are documented in
      // their own repos now, not here. Everything under them goes to the root.
      { source: '/developers', destination: '/', permanent: true },
      { source: '/developers/:path+', destination: '/', permanent: true },
      // /sdks/laravel is a real page again: the Cloud Laravel client, which is
      // not the self-hosted wrapper that used to sit at this URL.
      // The WordPress plugin keeps one page, the Cloud connection.
      { source: '/sdks/wordpress/cloud-connect', destination: '/sdks/wordpress', permanent: true },
      { source: '/sdks/wordpress/:path+', destination: '/', permanent: true },
      { source: '/sdks/nodejs', destination: '/sdks/typescript', permanent: true },
      { source: '/sdks/python-sdk', destination: '/sdks/python', permanent: true },
      { source: '/sdks/golang', destination: '/sdks/go', permanent: true },
      { source: '/sdks/csharp', destination: '/sdks/dotnet', permanent: true },
      { source: '/sdks/net', destination: '/sdks/dotnet', permanent: true },
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
      { source: '/comparisons/:slug+', destination: `${WEBSITE_URL}/compare`, permanent: true },
      { source: '/comparisons', destination: `${WEBSITE_URL}/compare`, permanent: true },
      { source: '/introduction/comparisons/:slug+', destination: `${WEBSITE_URL}/compare`, permanent: true },
      { source: '/support', destination: `${WEBSITE_URL}/contact`, permanent: true },
      { source: '/changelog', destination: `${WEBSITE_URL}/roadmap`, permanent: true },
    ];
  },
};

export default withMDX(config);
