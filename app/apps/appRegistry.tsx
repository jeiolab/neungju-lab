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
  'infosec-habit-streak': () => import('./infosec-habit-streak/App'),
  'share-or-shield': () => import('./share-or-shield/App'),
  //   'sns-해킹-방어-실험실_-내-계정-지키기': () => import('./sns-해킹-방어-실험실_-내-계정-지키기/App'),
  //   'the-anonymizer-가명-정보-공작소': () => import('./the-anonymizer-가명-정보-공작소/App'),
  //   //   '가명화-파이프라인-퍼즐': () => import('./가명화-파이프라인-퍼즐/App'),
  //   //   '개인정보-처리-흐름-조립-퍼즐': () => import('./개인정보-처리-흐름-조립-퍼즐/App'),
  '공유해도-돼-보호해야-돼': () => import('./공유해도-돼-보호해야-돼/App'),
  '공유해도-될까-3분류-챌린지': () => import('./공유해도-될까-3분류-챌린지/App'),
  '균형-잡기_-정보-보호와-공유': () => import('./균형-잡기_-정보-보호와-공유/App'),
  '내-폰을-지켜라-smishing-defense': () => import('./내-폰을-지켜라-smishing-defense/App'),
  '마이데이터-딜레마_-이득-vs-위험': () => import('./마이데이터-딜레마_-이득-vs-위험/App'),
  '문자-함정-탐정단': () => import('./문자-함정-탐정단/App'),
  '보호-vs-공유_-개념-마스터-트레이너': () => import('./보호-vs-공유_-개념-마스터-트레이너/App'),
  '수행평가-메이커_-안전한-공유-프로젝트': () => import('./수행평가-메이커_-안전한-공유-프로젝트/App'),
  '수행평가-메이커_-안전한-정보-공유-프로젝트-위저드': () => import('./수행평가-메이커_-안전한-정보-공유-프로젝트-위저드/App'),
  '스미싱피싱-방어-훈련장': () => import('./스미싱피싱-방어-훈련장/App'),
  '스타트업-ceo_-보안-vs-성장': () => import('./스타트업-ceo_-보안-vs-성장/App'),
  '우리-학교-저작권-지킴이-ccl-maker': () => import('./우리-학교-저작권-지킴이-ccl-maker/App'),
  '위협-데이터베이스': () => import('./위협-데이터베이스/App'),
  '저작권과-공유의-세계': () => import('./저작권과-공유의-세계/App'),
  '정보-보안-가디언-아카데미': () => import('./정보-보안-가디언-아카데미/App'),
  '정보-보안-지킴이': () => import('./정보-보안-지킴이/App'),
  '정보-보호의-성': () => import('./정보-보호의-성/App'),
  '지능형-짝꿍-배치-시스템': () => import('./지능형-짝꿍-배치-시스템/App'),
}

/**
 * 앱 ID로 컴포넌트를 동적으로 로드합니다
 */
export function getAppComponent(appId: string): AppComponent | null {
  const loader = appComponents[appId]
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

