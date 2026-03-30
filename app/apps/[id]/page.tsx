'use client'

import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

const AppRouteInner = dynamic(() => import('../AppRouteInner'), {
  ssr: false,
  loading: () => <AppRunnerCanvasSkeleton />,
})

function AppRunnerCanvasSkeleton() {
  return (
    <div
      className="app-runner-root flex w-full flex-col gap-4"
      aria-busy
      aria-label="실습 앱을 준비하는 중"
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200/80" />
          <div className="h-6 w-2/3 max-w-md animate-pulse rounded-lg bg-slate-200/80" />
        </div>
        <div className="h-10 w-32 shrink-0 animate-pulse rounded-lg bg-slate-100 sm:border-0" />
      </div>
      <div className="app-runner-canvas w-full min-h-[min(72vh,780px)] overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/40 shadow-sm">
        <div className="min-h-[min(72vh,780px)] w-full space-y-4 bg-white p-4 sm:p-6">
          <div className="h-8 w-2/5 animate-pulse rounded-lg bg-slate-200/70" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-200/50" />
          <div className="min-h-[min(48vh,420px)] animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

function AppPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-100/80">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <section className="relative flex flex-1 flex-col min-h-0">
          <div className="flex flex-1 min-h-0 justify-center overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 lg:px-10 pb-28">
            <div className="w-full max-w-6xl">{children}</div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0">
            <Footer />
          </div>
        </section>
      </div>
    </div>
  )
}

export default function AppPage() {
  const params = useParams()
  const id = params?.id as string

  if (!id) {
    return (
      <AppPageLayout>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-slate-900">앱 ID가 없습니다</h1>
        </div>
      </AppPageLayout>
    )
  }

  const decodedId = decodeURIComponent(id)

  return (
    <AppPageLayout>
      <AppRouteInner appId={decodedId} />
    </AppPageLayout>
  )
}
