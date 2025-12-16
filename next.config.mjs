import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/introduction/what-is-attentionpad',
        permanent: false,
      },
    ];
  },
};

export default withMDX(config);
