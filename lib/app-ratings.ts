import { canonicalAppId } from '@/lib/app-meta'

export const APP_RATINGS_EVENT = 'jeiolab-app-ratings-change'

const STORAGE_KEY = 'jeiolab-app-ratings-v1'

type Entry = {
  sum: number
  count: number
  my?: number
}

type Store = {
  v: 1
  apps: Record<string, Entry>
}

function emptyStore(): Store {
  return { v: 1, apps: {} }
}

function readStore(): Store {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const p = JSON.parse(raw) as Store
    if (p?.v !== 1 || typeof p.apps !== 'object') return emptyStore()
    return p
  } catch {
    return emptyStore()
  }
}

function writeStore(s: Store) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  window.dispatchEvent(new Event(APP_RATINGS_EVENT))
}

export function getRatingSummary(appId: string): {
  average: number | null
  count: number
  my: number | null
} {
  const key = canonicalAppId(appId)
  const st = readStore()
  const e = st.apps[key]
  if (!e || e.count <= 0) {
    return { average: null, count: 0, my: e?.my ?? null }
  }
  return {
    average: Math.round((e.sum / e.count) * 10) / 10,
    count: e.count,
    my: e.my ?? null,
  }
}

/** 1~5 별점 등록(같은 기기에서 동일 앱은 마지막 평가로 덮어씀, 집계는 1인 1평가 기준) */
export function submitAppRating(appId: string, stars: number): void {
  const n = Math.min(5, Math.max(1, Math.round(stars)))
  const key = canonicalAppId(appId)
  const st = readStore()
  const prev = st.apps[key]
  let sum = prev?.sum ?? 0
  let count = prev?.count ?? 0

  if (prev?.my != null) {
    sum -= prev.my
  } else {
    count += 1
  }
  sum += n

  st.apps[key] = { sum, count, my: n }
  writeStore(st)
}

/** 낮은 평균 순 정렬용 (같은 브라우저에 쌓인 데이터 기준) */
export function listRatingsSortedByAverage(): Array<{
  id: string
  average: number
  count: number
}> {
  const st = readStore()
  return Object.entries(st.apps)
    .filter(([, e]) => e.count > 0)
    .map(([id, e]) => ({
      id,
      average: e.sum / e.count,
      count: e.count,
    }))
    .sort((a, b) => a.average - b.average)
}
