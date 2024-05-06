/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "firebasestorage.googleapis.com"],
  },
  // compiler: {
  //   removeConsole: {
  //     exclude: ["error"],
  //   },
  // },
};

export default nextConfig;
