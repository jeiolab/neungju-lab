'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { App } from '@/data/apps'
import { useEffect, useRef } from 'react'

interface AppCardProps {
  app: App
}

export default function AppCard({ app }: AppCardProps) {
  const router = useRouter()
  const prefetchedRef = useRef(false)

  // 마우스 호버 시 프리페치
  const handleMouseEnter = () => {
    if (!prefetchedRef.current) {
      router.prefetch(`/apps/${app.id}`)
      prefetchedRef.current = true
    }
  }

  return (
    <Link 
      href={`/apps/${app.id}`}
      className="block flex flex-col gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full no-underline text-inherit relative z-10"
      onClick={(e) => {
        e.stopPropagation()
      }}
      onMouseEnter={handleMouseEnter}
      prefetch={true}
    >
      <div className="flex flex-col gap-2 flex-1 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-900">
            {app.name}
          </h3>
          {app.badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
              app.badge === 'new' ? 'bg-blue-100 text-blue-700' :
              app.badge === 'popular' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {app.badge === 'new' ? 'NEW' : app.badge === 'popular' ? '인기' : ''}
            </span>
          )}
        </div>
        <p className="text-sm font-normal text-gray-600">
          {app.description}
        </p>
      </div>
      <div className="mt-auto w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-opacity-90 transition-colors pointer-events-none">
        {app.buttonText || '연습 시작'}
      </div>
    </Link>
  )
}

