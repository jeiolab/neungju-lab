/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages 배포를 원하면 아래 주석을 해제하세요
  // output: 'export',
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Vercel 배포를 원하면 위 설정을 주석 처리하고 아래를 사용하세요
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/copy-of-디지털-생존-가이드/**',
        '**/네트워크-방탈출-게임/**',
        '**/stitch_jeio.zip_home_screen/**',
      ],
    };
    return config;
  },
}

module.exports = nextConfig

