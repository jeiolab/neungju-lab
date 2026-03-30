/**
 * 고정 윈도우 인메모리 레이트 리밋 (미들웨어·Edge에서 사용 가능한 순수 로직).
 * 서버리스/다중 인스턴스에서는 인스턴스별로 따로 집계됩니다.
 */

type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()

const DEFAULT_WINDOW_MS = 60_000
const DEFAULT_MAX = 120
const PRUNE_EVERY = 200
let pruneCounter = 0

function envInt(name: string, fallback: number): number {
  const v = process.env[name]
  if (!v) return fallback
  const n = parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function pruneExpired(now: number) {
  pruneCounter += 1
  if (pruneCounter % PRUNE_EVERY !== 0) return
  for (const [k, b] of store) {
    if (b.resetAt < now) store.delete(k)
  }
  if (store.size > 20_000) {
    store.clear()
  }
}

export function getClientIp(request: { headers: Headers } & { ip?: string | null }): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const real = request.headers.get('x-real-ip')?.trim()
  if (real) return real
  const ip = 'ip' in request ? request.ip : undefined
  if (ip) return ip
  return 'unknown'
}

export function checkApiRateLimit(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  pruneExpired(now)

  const windowMs = envInt('API_RATE_LIMIT_WINDOW_MS', DEFAULT_WINDOW_MS)
  const max = envInt('API_RATE_LIMIT_MAX', DEFAULT_MAX)

  let b = store.get(key)
  if (!b || now >= b.resetAt) {
    b = { count: 1, resetAt: now + windowMs }
    store.set(key, b)
    return { ok: true }
  }

  if (b.count >= max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) }
  }

  b.count += 1
  return { ok: true }
}
