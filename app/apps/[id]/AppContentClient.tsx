'use client'

import Link from 'next/link'
import { Suspense, useMemo } from 'react'
import { App } from '@/data/apps'
import AppWrapper from './components/AppWrapper'
import { getAppComponent } from '../appRegistry'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

interface AppContentClientProps {
  appId: string
  app: App
}

export default function AppContentClient({ appId, app }: AppContentClientProps) {
  // 동적으로 앱 컴포넌트 로드 (메모이제이션으로 최적화)
  const AppComponent = useMemo(() => getAppComponent(appId), [appId])

  // 등록된 앱 컴포넌트가 있으면 렌더링
  if (AppComponent) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">앱을 불러오는 중...</p>
            </div>
          </div>
        }
      >
        <AppComponent />
      </Suspense>
    )
  }

  // 외부 URL이 있으면 iframe으로 표시
  if (app.url) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary mb-6"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            홈으로 돌아가기
          </Link>
          <AppWrapper appId={app.id} url={app.url} />
        </main>
        <Footer />
      </div>
    )
  }

  // 기본 플레이스홀더
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          홈으로 돌아가기
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 mb-3">
              {app.name}
            </h1>
            <p className="text-base font-normal text-gray-600">
              {app.description}
            </p>
          </div>
          
          <AppWrapper appId={app.id} url={app.url}>
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 inline-block">
                apps
              </span>
              <p className="text-gray-600 mb-2">이 앱의 내용을 여기에 추가하세요.</p>
              <p className="text-sm text-gray-500">
                구글 AI 스튜디오에서 제작한 앱의 코드를 이 컴포넌트에 통합하거나,
                외부 URL이 있다면 apps.ts에서 url 필드를 추가하세요.
              </p>
            </div>
          </AppWrapper>
        </div>
      </main>
      <Footer />
    </div>
  )
}

