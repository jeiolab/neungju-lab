'use client'

import { useParams } from 'next/navigation'
import { getAppComponent } from '../appRegistry'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function AppPage() {
  const params = useParams()
  const id = params?.id as string
  
  if (!id) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">앱 ID가 없습니다</h1>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // URL 인코딩된 ID를 디코딩
  const decodedId = decodeURIComponent(id)
  const AppComponent = getAppComponent(decodedId)

  if (!AppComponent) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">앱을 찾을 수 없습니다</h1>
              <p className="text-gray-600">
                요청하신 앱 ID: <code className="bg-gray-100 px-2 py-1 rounded">{decodedId}</code>
              </p>
              <p className="text-sm text-gray-500">
                원본 ID: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
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
