'use client'

import { useState } from 'react'

export default function TestApp() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            테스트 앱
          </h1>
          <p className="text-gray-600 mb-6">
            이것은 기본 틀에서 시작하는 첫 번째 테스트 앱입니다.
          </p>
          
          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <p className="text-lg font-semibold text-indigo-900 mb-2">
              클릭 횟수: {count}
            </p>
            <button
              onClick={() => setCount(count + 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              클릭하기
            </button>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500">
              ✅ 앱이 정상적으로 작동합니다!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
