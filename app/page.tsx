'use client'

import Header from './components/Header'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900">
              JEIO 실습
            </h1>
            <p className="text-base font-normal text-gray-600 max-w-2xl">
              기본 사이트가 준비되었습니다. 앱을 하나씩 추가하여 시작하세요.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
