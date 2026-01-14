'use client'

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import React from 'react'

interface AppPageClientProps {
  appId: string
  originalId: string
  AppComponent: React.ComponentType | null
}

export default function AppPageClient({ appId, originalId, AppComponent }: AppPageClientProps) {
  if (!AppComponent) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">앱을 찾을 수 없습니다</h1>
              <p className="text-gray-600">
                요청하신 앱 ID: <code className="bg-gray-100 px-2 py-1 rounded">{appId}</code>
              </p>
              <p className="text-sm text-gray-500">
                원본 ID: <code className="bg-gray-100 px-2 py-1 rounded">{originalId}</code>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
      <Header />
      <AppComponent />
      <Footer />
    </div>
  )
}
