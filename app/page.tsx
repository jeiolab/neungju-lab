'use client'

import { useState } from 'react'
import { apps } from '@/data/apps'
import Header from './components/Header'
import Footer from './components/Footer'
import AppCard from './components/AppCard'

type Category = '정보' | '인공지능기초' | '수업도구' | '방과후학교'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('정보')

  const filteredApps = apps.filter(app => 
    app.category === selectedCategory || (!app.category && selectedCategory === '정보')
  )

  const categories: Category[] = ['정보', '인공지능기초', '방과후학교', '수업도구']

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
          
          <div className="mb-6">
            <div className="flex border-b border-gray-200 gap-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-colors ${
                    selectedCategory === category
                      ? 'border-b-primary'
                      : 'border-b-transparent'
                  }`}
                >
                  <p className={`text-sm font-bold transition-colors ${
                    selectedCategory === category
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-primary'
                  }`}>
                    {category}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="text-center space-y-4">
                <p className="text-base font-normal text-gray-600">
                  {selectedCategory} 카테고리에 등록된 앱이 없습니다.
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
