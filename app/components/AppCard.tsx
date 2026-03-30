'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { App } from '@/data/apps'
import { useCallback, useEffect, useRef } from 'react'
import { warmAppChunk } from '@/app/apps/app-loaders'
import { canonicalAppId } from '@/lib/app-meta'
import { useAppRatingSummary } from '@/hooks/useAppRatingSummary'

interface AppCardProps {
  app: App
}

export default function AppCard({ app }: AppCardProps) {
  const router = useRouter()
  const prefetchedRef = useRef(false)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const ratingId = canonicalAppId(app.id)
  const { average, count } = useAppRatingSummary(ratingId)
  const href = `/apps/${encodeURIComponent(app.id)}`

  const kickLoad = useCallback(() => {
    warmAppChunk(app.id)
    router.prefetch(href)
    void import('@/app/apps/AppRouteInner')
  }, [app.id, router, href])

  const handleMouseEnter = () => {
    if (!prefetchedRef.current) {
      kickLoad()
      prefetchedRef.current = true
    }
  }

  useEffect(() => {
    const el = cardRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          kickLoad()
          prefetchedRef.current = true
          obs.disconnect()
        }
      },
      { rootMargin: '900px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [app.id, kickLoad])

  return (
    <Link
      ref={cardRef}
      href={href}
      className="relative z-10 flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-inherit no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      onClick={(e) => {
        e.stopPropagation()
      }}
      onPointerDown={kickLoad}
      onFocus={kickLoad}
      onMouseEnter={handleMouseEnter}
      prefetch
    >
      <div className="pointer-events-none flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
          {app.badge && (
            <span
              className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                app.badge === 'new'
                  ? 'bg-blue-100 text-blue-700'
                  : app.badge === 'popular'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              {app.badge === 'new' ? 'NEW' : app.badge === 'popular' ? '인기' : ''}
            </span>
          )}
        </div>
        <p className="text-sm font-normal text-gray-600">{app.description}</p>
        {average != null && (
          <p className="text-xs font-medium text-amber-600">
            ★ {average}
            {count > 0 ? ` (${count})` : ''}
          </p>
        )}
      </div>
      <div className="pointer-events-none mt-auto flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white">
        {app.buttonText || '시작하기'}
      </div>
    </Link>
  )
}

