/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  images: {
    domains: ['localhost', 'backend'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // ❌ ELIMINAR esta sección completa
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/inicio',
  //       permanent: true,
  //     },
  //   ];
  // },
  
  
};

module.exports = nextConfig;