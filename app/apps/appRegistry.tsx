/**
 * 앱 컴포넌트 레지스트리
 * 새로운 앱을 추가할 때 여기에만 등록하면 됩니다.
 */

import React from 'react'
import dynamic from 'next/dynamic'

// 앱 컴포넌트 타입
type AppComponent = React.ComponentType

// 앱 레지스트리 맵
const appComponents: Record<string, () => Promise<{ default: AppComponent }>> = {
  '지능형-짝꿍-배치-시스템': () => import('./지능형-짝꿍-배치-시스템/App'),
  'sns-해킹-방어-실험실_-내-계정-지키기': () => import('./sns-해킹-방어-실험실_-내-계정-지키기/App'),
  'the-anonymizer-가명-정보-공작소': () => import('./the-anonymizer-가명-정보-공작소/App'),
  '가명화-파이프라인-퍼즐': () => import('./가명화-파이프라인-퍼즐/App'),
  '개인정보-처리-흐름-조립-퍼즐': () => import('./개인정보-처리-흐름-조립-퍼즐/App'),
  '공유해도-될까-3분류-챌린지': () => import('./공유해도-될까-3분류-챌린지/App'),
  '4단계-진로-설계-위저드': () => import('./4단계-진로-설계-위저드/App'),
  'ai-서비스-파이프라인-퍼즐': () => import('./ai-서비스-파이프라인-퍼즐/App'),
  'digital-concept-master': () => import('./digital-concept-master/App'),
  '나의-ai-진로-나침반': () => import('./나의-ai-진로-나침반/App'),
  '나의-디지털-진로-로드맵-위저드-2': () => import('./나의-디지털-진로-로드맵-위저드-2/App'),
  '나의-디지털-트윈-농장': () => import('./나의-디지털-트윈-농장/App'),
  '대체될까-협업할까-직업-판별-게임': () => import('./대체될까-협업할까-직업-판별-게임/App'),
  '디지털-탐정-진실을-찾아라': () => import('./디지털-탐정-진실을-찾아라/App'),
  '미래-농장-타이쿤': () => import('./미래-농장-타이쿤/App'),
  '미래-직업-연구소_-나만의-커리어-믹서': () => import('./미래-직업-연구소_-나만의-커리어-믹서/App'),
  '사회-문제-해결사_-테크로-세상을-바꾸다': () => import('./사회-문제-해결사_-테크로-세상을-바꾸다/App'),
  '역량-레이더_-내-진로-스킬을-수치로-보기': () => import('./역량-레이더_-내-진로-스킬을-수치로-보기/App'),
  '커리어-밸런스-게임_-미래성-vs-안정-vs-흥미': () => import('./커리어-밸런스-게임_-미래성-vs-안정-vs-흥미/App'),
  '마이데이터-딜레마_-이득-vs-위험': () => import('./마이데이터-딜레마_-이득-vs-위험/App'),
  '수행평가-메이커_-안전한-공유-프로젝트': () => import('./수행평가-메이커_-안전한-공유-프로젝트/App'),
  '스미싱피싱-방어-훈련장': () => import('./스미싱피싱-방어-훈련장/App'),
  '스타트업-ceo_-보안-vs-성장': () => import('./스타트업-ceo_-보안-vs-성장/App'),
  '위협-데이터베이스': () => import('./위협-데이터베이스/App'),
  '저작권과-공유의-세계': () => import('./저작권과-공유의-세계/App'),
  '정보-보안-지킴이': () => import('./정보-보안-지킴이/App'),
  '정보-보호의-성': () => import('./정보-보호의-성/App'),
}

/**
 * 앱 ID로 컴포넌트를 동적으로 로드합니다
 * URL 인코딩된 ID도 자동으로 디코딩하여 처리합니다
 */
export function getAppComponent(appId: string): AppComponent | null {
  // URL 인코딩된 ID를 디코딩 시도
  let decodedId = appId
  try {
    // 여러 번 디코딩 시도 (이중 인코딩된 경우 대비)
    decodedId = decodeURIComponent(appId)
    // 한 번 더 시도
    if (decodedId !== appId && decodedId.includes('%')) {
      decodedId = decodeURIComponent(decodedId)
    }
  } catch (e) {
    // 디코딩 실패 시 원본 사용
    decodedId = appId
  }

  // 정규화 함수 (NFD <-> NFC 변환)
  const normalize = (str: string): string => {
    // NFC로 정규화
    return str.normalize('NFC')
  }

  // 디코딩된 ID로 먼저 시도
  let loader = appComponents[decodedId]
  
  // 없으면 정규화된 버전으로 시도
  if (!loader) {
    const normalizedDecoded = normalize(decodedId)
    loader = appComponents[normalizedDecoded]
  }

  // 없으면 원본 ID로 시도
  if (!loader) {
    loader = appComponents[appId]
  }

  // 없으면 정규화된 원본 ID로 시도
  if (!loader) {
    const normalizedOriginal = normalize(appId)
    loader = appComponents[normalizedOriginal]
  }

  // 여전히 없으면 모든 키를 순회하며 정규화된 버전으로 비교
  if (!loader) {
    const normalizedDecoded = normalize(decodedId)
    const normalizedOriginal = normalize(appId)
    
    for (const key of Object.keys(appComponents)) {
      const normalizedKey = normalize(key)
      if (normalizedKey === normalizedDecoded || normalizedKey === normalizedOriginal) {
        loader = appComponents[key]
        break
      }
    }
  }

  if (!loader) {
    return null
  }

  // 동적 import로 컴포넌트 로드 (최적화된 설정)
  return dynamic(loader, {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">앱을 불러오는 중...</p>
        </div>
      </div>
    ),
    ssr: false, // 클라이언트 사이드에서만 렌더링
    // 로딩 최적화를 위한 추가 옵션
  })
}

/**
 * 등록된 모든 앱 ID 목록을 반환합니다
 */
export function getRegisteredAppIds(): string[] {
  return Object.keys(appComponents)
}

/**
 * 앱이 등록되어 있는지 확인합니다
 */
export function isAppRegistered(appId: string): boolean {
  return appId in appComponents
}
