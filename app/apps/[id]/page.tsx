'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getAppComponent } from '../appRegistry'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function AppPage() {
  const params = useParams()
  const id = params?.id as string
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    // URL 인코딩된 ID를 디코딩
    let decodedId = id
    try {
      decodedId = decodeURIComponent(id)
      if (decodedId !== id && decodedId.includes('%')) {
        decodedId = decodeURIComponent(decodedId)
      }
    } catch (e) {
      decodedId = id
    }

    // 동적 import를 직접 사용
    const loadComponent = async () => {
      try {
        const component = getAppComponent(decodedId)
        if (component) {
          setAppComponent(() => component)
        } else {
          setAppComponent(null)
        }
      } catch (error) {
        console.error('Failed to load app component:', error)
        setAppComponent(null)
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [id])
  
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

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">앱을 불러오는 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!AppComponent) {
    let decodedId = id
    try {
      decodedId = decodeURIComponent(id)
      if (decodedId !== id && decodedId.includes('%')) {
        decodedId = decodeURIComponent(decodedId)
      }
    } catch (e) {
      decodedId = id
    }

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
