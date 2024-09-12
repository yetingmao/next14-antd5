/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"
const nextConfig = {

  // assetPrefix: isProd ? "http://20.58.69.75:28088/" : "",
  //assetPrefix: isProd ? "./" : "",
  output: 'export',
  //basePath:"",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  //crossOrigin: 'anonymous',
  // trailingSlash: true,
};

export default nextConfig;
