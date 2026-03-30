'use client'

import { getAppComponent } from './appRegistry'
import AppRunnerShell from '@/app/components/AppRunnerShell'
import { findAppMeta, canonicalAppId } from '@/lib/app-meta'

type Props = { appId: string }

export default function AppRouteInner({ appId }: Props) {
  const AppComponent = getAppComponent(appId)

  if (!AppComponent) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">앱을 찾을 수 없습니다</h1>
        <p className="text-slate-600">
          요청 ID: <code className="rounded bg-slate-100 px-2 py-1 text-sm">{appId}</code>
        </p>
      </div>
    )
  }

  const meta = findAppMeta(appId)
  const appName = meta?.name ?? appId
  const ratingId = meta ? canonicalAppId(meta.id) : canonicalAppId(appId)

  return (
    <AppRunnerShell appId={ratingId} appName={appName}>
      <AppComponent />
    </AppRunnerShell>
  )
}
