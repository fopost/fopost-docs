import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

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
      { source: '/support', destination: 'https://owlstack.app/contact', permanent: true },
      { source: '/changelog', destination: 'https://owlstack.app/roadmap', permanent: true },
    ];
  },
};

export default withMDX(config);
