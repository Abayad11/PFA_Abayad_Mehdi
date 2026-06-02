/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Désactiver le SSG pour éviter les erreurs avec AuthContext
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/login': { page: '/login' },
    };
  },
};
module.exports = nextConfig;
