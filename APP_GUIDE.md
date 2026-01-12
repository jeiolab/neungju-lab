# 앱 추가 가이드

새로운 앱을 추가하는 방법을 안내합니다.

## 빠른 시작

### 1. 앱 폴더 생성

`app/apps/` 폴더에 새 앱 폴더를 만듭니다.

```
app/apps/
  └── my-new-app/
      └── MyNewApp.tsx  (메인 컴포넌트)
```

### 2. 앱 컴포넌트 작성

앱의 메인 컴포넌트를 작성합니다. 반드시 `'use client'` 지시어를 포함해야 합니다.

```tsx
'use client'

import React from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

const MyNewApp: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <h1>내 새 앱</h1>
        {/* 앱 내용 */}
      </main>
      <Footer />
    </div>
  )
}

export default MyNewApp
```

### 3. 앱 레지스트리에 등록

`app/apps/appRegistry.ts` 파일에 앱을 등록합니다.

```typescript
const appComponents: Record<string, () => Promise<{ default: AppComponent }>> = {
  // ... 기존 앱들
  'my-new-app': () => import('../my-new-app/MyNewApp'),
}
```

### 4. 앱 목록에 추가

`data/apps.ts` 파일에 앱 정보를 추가합니다.

```typescript
{
  id: 'my-new-app',
  name: '내 새 앱',
  description: '앱 설명',
  badge: 'new',
  category: '정보',
  buttonText: '시작하기',
  // 메뉴 구조 기반 분류 (권장)
  menuId: 'unit-1-1', // menuStructure.ts에 정의된 메뉴 ID
}
```

#### 메뉴 ID 찾기

`data/menuStructure.ts` 파일에서 사용 가능한 메뉴 ID를 확인할 수 있습니다:

**정보 탭:**
- `unit-1-1`: I 컴퓨팅 시스템 > 1 네트워크
- `unit-1-2`: I 컴퓨팅 시스템 > 2 사물 인터넷 시스템
- `unit-2-1`: II 데이터 > 1 디지털 데이터의 압축과 암호화
- `unit-2-2`: II 데이터 > 2 빅데이터
- `unit-3-1`: III 알고리즘과 프로그래밍 > 1 알고리즘
- `unit-3-2`: III 알고리즘과 프로그래밍 > 2 프로그래밍
- `unit-4-1`: IV 인공지능 > 1 지능 에이전트
- `unit-4-2`: IV 인공지능 > 2 기계학습
- `unit-5-1`: V 디지털 문화 > 1 디지털 기술과 사회 변화
- `unit-5-2`: V 디지털 문화 > 2 정보 보호와 보안

**인공지능기초 탭:**
- `ai-1`: AI 개념 이해
- `ai-2`: 머신러닝 기초
- `ai-3`: 딥러닝 입문

**방과후 탭:**
- `after-1`: 프로젝트 실습
- `after-2`: 심화 학습
- `after-3`: 협력 활동

**교사도구 탭:**
- `tool-1`: 학급 관리
- `tool-2`: 평가 도구
- `tool-3`: 수업 보조

#### 하위 호환성 (기존 방식)

기존 `unit`과 `subunit` 방식도 여전히 지원됩니다:

```typescript
{
  // ...
  unit: 'I 컴퓨팅 시스템',
  subunit: '1 네트워크',
}
```

## 완료!

이제 앱이 홈페이지에 표시되고 접근 가능합니다.

## 추가 정보

### 단원 정보 (정보 탭 전용)

정보 탭에서 교과서 단원별로 표시하려면:

- `unit`: 단원 (예: 'I 컴퓨팅 시스템', 'II 데이터', 'III 알고리즘과 프로그래밍', 'IV 인공지능', 'V 디지털 문화')
- `subunit`: 소단원 (예: '1 네트워크', '2 사물 인터넷 시스템')

### 외부 URL 앱

외부 URL을 사용하는 앱은 컴포넌트 없이 `url` 필드만 추가하면 됩니다:

```typescript
{
  id: 'external-app',
  name: '외부 앱',
  url: 'https://example.com/app',
  category: '정보',
}
```

### 카테고리

- `정보`: 교과서 단원별로 구성됨
- `인공지능기초`: 인공지능 관련 앱
- `방과후`: 방과후 활동용 앱
- `교사도구`: 교사용 도구

