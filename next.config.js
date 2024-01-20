/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  output:'static',
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["crealink-images.s3.ap-southeast-1.amazonaws.com",]
  },
    basePath,
  async redirects() {
    return [
      {
        source: '/',
        destination: `${basePath}/login`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
