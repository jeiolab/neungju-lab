/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  // 빌드 최적화
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 이미지 최적화
  images: {
    unoptimized: false,
  },
  webpack: (config) => {
    // 웹팩 최적화
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/copy-of-디지털-생존-가이드/**',
        '**/네트워크-방탈출-게임/**',
        '**/stitch_jeio.zip_home_screen/**',
      ],
    };
    
    // 한글 파일명 처리 개선
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    };
    
    // 코드 스플리팅은 Next.js 기본 설정 사용 (안정성 우선)
    
    return config;
  },
}

module.exports = nextConfig

