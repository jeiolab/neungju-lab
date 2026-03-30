import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkApiRateLimit, getClientIp } from '@/lib/rate-limit'
import { checkUpstashRateLimit } from '@/lib/upstash-rate-limit'

export async function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS' || request.method === 'HEAD') {
    return NextResponse.next()
  }

  const ip = getClientIp(request)
  const path = request.nextUrl.pathname
  const family = path.startsWith('/api/llm') ? 'llm' : 'gemini'

  const upstash = await checkUpstashRateLimit(family, ip)
  if (upstash.used) {
    if (!upstash.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(upstash.retryAfterSec),
          },
        }
      )
    }
    return NextResponse.next()
  }

  const key = `${ip}:${family}`
  const result = checkApiRateLimit(key)
  if (!result.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfterSec),
        },
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/llm/:path*', '/api/gemini/:path*'],
}
