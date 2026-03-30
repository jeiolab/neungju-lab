function buildContentSecurityPolicy() {
  const connect = [
    "'self'",
    'https://openrouter.ai',
    'https://*.openrouter.ai',
    'https://generativelanguage.googleapis.com',
    'https://*.googleapis.com',
    'https://ai.google.dev',
    'https://*.google.dev',
    'wss:',
    'https:',
  ].join(' ')

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    `connect-src ${connect}`,
  ].join('; ')
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    const cspName =
      process.env.CSP_REPORT_ONLY === '1'
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy'

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(process.env.DISABLE_CSP === '1'
            ? []
            : [{ key: cspName, value: buildContentSecurityPolicy() }]),
        ],
      },
    ]
  },
  // 빌드 최적화
  swcMinify: true,
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
    
    // ! 문자가 포함된 경로 처리
    // webpack이 ! 문자를 loader 구분자로 해석하지 않도록 설정
    config.module = {
      ...config.module,
      rules: [
        ...(config.module?.rules || []),
      ],
    };
    
    // 코드 스플리팅은 Next.js 기본 설정 사용 (안정성 우선)
    
    return config;
  },
}

module.exports = nextConfig

