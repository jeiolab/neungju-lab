/**
 * 앱 컴포넌트 레지스트리 (dynamic 래퍼)
 * 새 앱은 `app-loaders.ts`의 `appComponents`에만 등록하면 됩니다.
 */

import React from 'react'
import dynamic from 'next/dynamic'
import { resolveAppLoader } from './app-loaders'

type AppComponent = React.ComponentType

/** 동일 앱에 대해 dynamic()을 한 번만 생성 (매 렌더마다 새 타입이 되면 리마운트·지연 발생) */
const dynamicComponentCache = new Map<string, AppComponent>()

const appLoadingFallback = (
  <div
    className="flex min-h-[min(72vh,780px)] w-full flex-col gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 sm:p-6"
    aria-busy
    aria-label="앱을 불러오는 중"
  >
    <div className="h-8 w-3/5 max-w-md animate-pulse rounded-lg bg-slate-200/80" />
    <div className="h-4 w-4/5 max-w-lg animate-pulse rounded bg-slate-200/60" />
    <div className="mt-4 min-h-[40vh] flex-1 animate-pulse rounded-xl bg-slate-200/40" />
  </div>
)

/**
 * 앱 ID로 컴포넌트를 동적으로 로드합니다
 * URL 인코딩된 ID도 자동으로 디코딩하여 처리합니다
 */
export function getAppComponent(appId: string): AppComponent | null {
  const resolved = resolveAppLoader(appId)
  if (!resolved) return null

  const hit = dynamicComponentCache.get(resolved.cacheKey)
  if (hit) return hit

  const Comp = dynamic(resolved.loader, {
    loading: () => appLoadingFallback,
    ssr: false,
  })
  dynamicComponentCache.set(resolved.cacheKey, Comp)
  return Comp
}

export { warmAppChunk, getRegisteredAppIds, isAppRegistered } from './app-loaders'
