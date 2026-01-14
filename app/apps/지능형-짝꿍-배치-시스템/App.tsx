'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';

// 동적 import로 컴포넌트 로드 (SSR 방지)
const SmartRandomPairMatcher = dynamic(
  () => import('./components/SmartRandomPairMatcher'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">로딩 중...</p>
        </div>
      </div>
    ),
  }
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="w-full h-full">
        <SmartRandomPairMatcher />
      </div>
    </ErrorBoundary>
  );
};

export default App;