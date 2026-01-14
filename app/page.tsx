'use client'

import { apps } from '@/data/apps'
import Header from './components/Header'
import Footer from './components/Footer'
import AppCard from './components/AppCard'

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900">
              JEIO 실습, 지금 바로 시작하세요!
            </h1>
            <p className="text-base font-normal text-gray-600">
              기술은 머리로만 배우지 않습니다. 직접 해 보고, 실수하고, 다시 도전하며 진짜 실력을 만들어 봅시다.
            </p>
          </div>
          
          {apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="text-center space-y-4">
                <p className="text-base font-normal text-gray-600">
                  등록된 앱이 없습니다. 앱을 추가해주세요.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
