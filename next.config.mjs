/** @type {import('next').NextConfig} */
const nextConfig = {
  pagesDir: "./pages",
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
};

export default nextConfig;
