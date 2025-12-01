'use client'

import { useEffect, useState } from 'react'

interface AppWrapperProps {
  appId: string
  url?: string
  children?: React.ReactNode
}

/**
 * 앱을 래핑하는 컴포넌트
 * 외부 URL이 있으면 iframe으로 표시하고, 없으면 children을 렌더링합니다
 */
export default function AppWrapper({ appId, url, children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (url) {
      setIsLoading(false)
    }
  }, [url])

  if (url) {
    return (
      <div style={{ width: '100%', height: '100vh', minHeight: '600px' }}>
        {isLoading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#666'
          }}>
            앱을 불러오는 중...
          </div>
        )}
        <iframe
          src={url}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
          }}
          onLoad={() => setIsLoading(false)}
          title={appId}
        />
      </div>
    )
  }

  return <>{children}</>
}

