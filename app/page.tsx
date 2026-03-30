'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import Footer from './components/Footer'

const MainContent = dynamic(() => import('./components/MainContent'), {
  ssr: false,
})

type Category = '정보' | '인공지능기초' | '수업도구' | '방과후학교'

const TAB_FROM_URL: Record<string, Category> = {
  '정보': '정보',
  '인공지능기초': '인공지능기초',
  '방과후': '방과후학교',
  '수업도구': '수업도구',
}

function HomeContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  // tab 파라미터 없으면 홈(메인), 있으면 해당 탭
  const [selectedCategory, setSelectedCategory] = useState<Category | '홈'>(
    () => (tabParam && TAB_FROM_URL[tabParam]) || '홈'
  )

  useEffect(() => {
    if (tabParam && TAB_FROM_URL[tabParam]) {
      setSelectedCategory(TAB_FROM_URL[tabParam])
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.getElementById('실습-시작하기')?.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      })
    } else {
      setSelectedCategory('홈')
    }
  }, [tabParam])

  const showHomePage = selectedCategory === '홈'

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white">
      {showHomePage ? (
        <div className="relative min-h-screen w-full bg-white">
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header selectedCategory="정보" setSelectedCategory={(c) => setSelectedCategory(c)} isHomeView />
            <HeroSection />
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen w-full bg-white">
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header selectedCategory={selectedCategory} setSelectedCategory={(c) => setSelectedCategory(c)} />
            <section className="relative flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto flex items-start px-6 sm:px-8 lg:px-12 pb-24">
                <main id="실습-시작하기" className="w-full max-w-6xl mx-auto py-8 lg:py-12">
                  <MainContent selectedCategory={selectedCategory} setSelectedCategory={(c) => setSelectedCategory(c)} compactMode />
                </main>
              </div>
              <div className="absolute bottom-0 left-0 right-0">
                <Footer />
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

function PageFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" aria-hidden />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HomeContent />
    </Suspense>
  )
}
