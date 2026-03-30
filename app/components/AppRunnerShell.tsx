'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { PRACTICE_CATALOG_HREF } from '@/lib/routes'
import AppRatingWidget from './AppRatingWidget'

type Props = {
  appId: string
  appName: string
  children: ReactNode
}

export default function AppRunnerShell({ appId, appName, children }: Props) {
  return (
    <div className="app-runner-root flex w-full flex-col gap-4">
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            href={PRACTICE_CATALOG_HREF}
            className="text-xs font-medium text-slate-500 transition-colors hover:text-primary"
          >
            ← 실습 목록으로
          </Link>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {appName}
          </h1>
        </div>
        <div className="shrink-0 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
          <AppRatingWidget appId={appId} />
        </div>
      </header>

      <div className="app-runner-canvas w-full min-h-[min(72vh,780px)] overflow-x-auto overflow-y-auto rounded-2xl border border-slate-200/90 bg-slate-50/40 shadow-sm">
        <div className="min-h-[min(72vh,780px)] w-full max-w-full bg-white p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
