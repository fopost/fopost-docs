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
      { source: '/guide/ai', destination: '/guide', permanent: true },
      { source: '/guide/pro', destination: '/guide', permanent: true },
      { source: '/support', destination: `${WEBSITE_URL}/contact`, permanent: true },
      { source: '/changelog', destination: `${WEBSITE_URL}/roadmap`, permanent: true },
    ];
  },
};

export default withMDX(config);
