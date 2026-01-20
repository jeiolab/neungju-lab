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
  'sns-해킹-방어-실험실_-내-계정-지키기': () => import('./sns-해킹-방어-실험실_-내-계정-지키기/App'),
  'the-anonymizer-가명-정보-공작소': () => import('./the-anonymizer-가명-정보-공작소/App'),
  '가명화-파이프라인-퍼즐': () => import('./가명화-파이프라인-퍼즐/App'),
  '개인정보-처리-흐름-조립-퍼즐': () => import('./개인정보-처리-흐름-조립-퍼즐/App'),
  '공유해도-될까-3분류-챌린지': () => import('./공유해도-될까-3분류-챌린지/App'),
  '4단계-진로-설계-위저드': () => import('./4단계-진로-설계-위저드/App'),
  'ai-서비스-파이프라인-퍼즐': () => import('./ai-서비스-파이프라인-퍼즐/App'),
  'ml-pipeline-puzzle': () => import('./ml-pipeline-puzzle/index'),
  '나의-ai-진로-나침반': () => import('./나의-ai-진로-나침반/App'),
  '나의-디지털-트윈-농장': () => import('./나의-디지털-트윈-농장/App'),
  '디지털-탐정-진실을-찾아라': () => import('./디지털-탐정-진실을-찾아라/App'),
  '미래-농장-타이쿤': () => import('./미래-농장-타이쿤/App'),
  '미래-직업-연구소_-나만의-커리어-믹서': () => import('./미래-직업-연구소_-나만의-커리어-믹서/App'),
  '사회-문제-해결사_-테크로-세상을-바꾸다': () => import('./사회-문제-해결사_-테크로-세상을-바꾸다/App'),
  '커리어-밸런스-게임_-미래성-vs-안정-vs-흥미': () => import('./커리어-밸런스-게임_-미래성-vs-안정-vs-흥미/App'),
  '마이데이터-딜레마_-이득-vs-위험': () => import('./마이데이터-딜레마_-이득-vs-위험/App'),
  '수행평가-메이커_-안전한-공유-프로젝트': () => import('./수행평가-메이커_-안전한-공유-프로젝트/App'),
  '스미싱피싱-방어-훈련장': () => import('./스미싱피싱-방어-훈련장/App'),
  '스타트업-ceo_-보안-vs-성장': () => import('./스타트업-ceo_-보안-vs-성장/App'),
  '위협-데이터베이스': () => import('./위협-데이터베이스/App'),
  '저작권과-공유의-세계': () => import('./저작권과-공유의-세계/App'),
  '정보-보안-지킴이': () => import('./정보-보안-지킴이/App'),
  '정보-보호의-성': () => import('./정보-보호의-성/App'),
  'ai-선생님_-정답을-알려줘': () => import('./ai-선생님_-정답을-알려줘/App'),
  'cluster-manager_-choosing-k': () => import('./cluster-manager_-choosing-k/App'),
  'data-chef_-ai-요리하기': () => import('./data-chef_-ai-요리하기/App'),
  'k-means-lab': () => import('./k-means-lab/App'),
  'k-nn-거리-게임': () => import('./k-nn-거리-게임/App'),
  'k-평균-순서-퍼즐': () => import('./k-평균-순서-퍼즐/App'),
  'marketing-cluster-wizard': () => import('./marketing-cluster-wizard/App'),
  'model-selection-trade-off-challenge': () => import('./model-selection-trade-off-challenge/App'),
  'unsupervised-wizard': () => import('./unsupervised-wizard/App'),
  '규칙-vs-데이터_-코딩-대결': () => import('./규칙-vs-데이터_-코딩-대결/App'),
  '급식-잔반-예측-미니랩': () => import('./급식-잔반-예측-미니랩/App'),
  '급식간식-군집화-미니랩': () => import('./급식간식-군집화-미니랩/App'),
  '기계학습-트레이드오프-코치': () => import('./기계학습-트레이드오프-코치/App'),
  '나만의-ai-설계소_-기획부터-윤리까지': () => import('./나만의-ai-설계소_-기획부터-윤리까지/App'),
  '내-이웃은-누구-k-nn-시뮬레이터': () => import('./내-이웃은-누구-k-nn-시뮬레이터/App'),
  '로봇-키우기_-당근과-채찍': () => import('./로봇-키우기_-당근과-채찍/App'),
  '머신러닝-카드덱_-규칙을-찾는-공부-친구': () => import('./머신러닝-카드덱_-규칙을-찾는-공부-친구/App'),
  '머신러닝-파이프라인-조립-퍼즐': () => import('./머신러닝-파이프라인-조립-퍼즐/App'),
  '모델-디버깅-위저드': () => import('./모델-디버깅-위저드/App'),
  '미세먼지-예보관': () => import('./미세먼지-예보관/App'),
  '분류-스쿼드-classification-squad': () => import('./분류-스쿼드-classification-squad/App'),
  '분류냐-회귀냐_-문제-해결사': () => import('./분류냐-회귀냐_-문제-해결사/App'),
  '예_아니요-탐정_-의사결정트리': () => import('./예_아니요-탐정_-의사결정트리/App'),
  '우리-학교-ai-해결사': () => import('./우리-학교-ai-해결사/App'),
  '이건-어떤-학습-60초-판별-게임': () => import('./이건-어떤-학습-60초-판별-게임/App'),
  '이상치-탐정_-이-점-튀었는데': () => import('./이상치-탐정_-이-점-튀었는데/App'),
  '임계값-딜레마_-위험-경보-결정하기': () => import('./임계값-딜레마_-위험-경보-결정하기/App'),
  '최적의-선을-찾아라-linear-regression': () => import('./최적의-선을-찾아라-linear-regression/App'),
  '탐정-ai_-숨은-패턴-찾기': () => import('./탐정-ai_-숨은-패턴-찾기/App'),
  '트리-빌더_-루브릭-퍼즐': () => import('./트리-빌더_-루브릭-퍼즐/App'),
  '펭귄과-기후-연구소': () => import('./펭귄과-기후-연구소/App'),
  'ai-테크-마스터': () => import('./ai-테크-마스터/App'),
  'logicloop_-ai-thinking-puzzles': () => import('./logicloop_-ai-thinking-puzzles/App'),
  'robolearn_-ai-agent-simulation': () => import('./robolearn_-ai-agent-simulation/App'),
  '빌드-잇_-나만의-ai-에이전트': () => import('./빌드-잇_-나만의-ai-에이전트/App'),
  '에이전트-루프-퍼즐': () => import('./에이전트-루프-퍼즐/App'),
  '에이전트-아카데미_-단순-vs-지능': () => import('./에이전트-아카데미_-단순-vs-지능/App'),
  '지능-에이전트-마스터': () => import('./지능-에이전트-마스터/App'),
  '축제-운영-ai_-밸런스-게임': () => import('./축제-운영-ai_-밸런스-게임/App'),
  '파이프라인-조립소': () => import('./파이프라인-조립소/App'),
  '프로젝트-위저드_-수질-관리-에이전트': () => import('./프로젝트-위저드_-수질-관리-에이전트/App'),
  'bodycheck_-나의-건강-데이터-변수-연구소': () => import('./bodycheck_-나의-건강-데이터-변수-연구소/App'),
  'cafecoder_-나만의-키오스크-만들기': () => import('./cafecoder_-나만의-키오스크-만들기/App'),
  'classmanager': () => import('./classmanager/App'),
  'cvs-manager-편의점-재고-매니저': () => import('./cvs-manager-편의점-재고-매니저/App'),
  'datasort_-데이터-분리수거-대작전': () => import('./datasort_-데이터-분리수거-대작전/App'),
  'medi-check-logic_-ai-건강검진-판독기': () => import('./medi-check-logic_-ai-건강검진-판독기/App'),
  'pixellog_-2차원-배열로-그리는-그림': () => import('./pixellog_-2차원-배열로-그리는-그림/App'),
  'rpg-히어로-팩토리': () => import('./rpg-히어로-팩토리/App'),
  'school-lunch-bot': () => import('./school-lunch-bot/App'),
  'secretlog_-나만의-파이썬-일기장': () => import('./secretlog_-나만의-파이썬-일기장/App'),
  'smart-farm-logic-lab': () => import('./smart-farm-logic-lab/App'),
  '교실-데이터-맵': () => import('./교실-데이터-맵/index'),
  '동아리-캐릭터-카드로-배우는-클래스': () => import('./동아리-캐릭터-카드로-배우는-클래스/App'),
  '등굣길-자동결정-시뮬레이터': () => import('./등굣길-자동결정-시뮬레이터/App'),
  '수행평가-위저드_-나만의-학생-데이터-카드': () => import('./수행평가-위저드_-나만의-학생-데이터-카드/App'),
  '수행평가-위저드_-우리-반-출석부-설계': () => import('./수행평가-위저드_-우리-반-출석부-설계/App'),
  '오늘의-oop-미션': () => import('./오늘의-oop-미션/App'),
  '우주-여행-플래너-space-travel-planner': () => import('./우주-여행-플래너-space-travel-planner/App'),
  '입출력-루트-빌더': () => import('./입출력-루트-빌더/App'),
  '편의점-할인-판별-게임': () => import('./편의점-할인-판별-게임/App'),
  '하루-1개-입출력-수리공': () => import('./하루-1개-입출력-수리공/App'),
  '혈압-루틴-플로우-퍼즐': () => import('./혈압-루틴-플로우-퍼즐/App'),
  '길-찾기의-신_-단순화의-힘': () => import('./길-찾기의-신_-단순화의-힘/App'),
  '도서관-사서의-하루_-실생활-정렬-챌린지': () => import('./도서관-사서의-하루_-실생활-정렬-챌린지/App'),
  '등교-최적화-트레이드오프-랩': () => import('./등교-최적화-트레이드오프-랩/App'),
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
  
  // 없으면 원본 ID로 시도 (디코딩 전)
  if (!loader) {
    loader = appComponents[appId]
  }
  
  // 없으면 정규화된 버전으로 시도
  if (!loader) {
    const normalizedDecoded = normalize(decodedId)
    loader = appComponents[normalizedDecoded]
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

  // 여전히 없으면 대소문자 무시하고 찾기 (영문 앱의 경우)
  if (!loader && /^[a-zA-Z0-9_-]+$/.test(decodedId)) {
    const lowerDecoded = decodedId.toLowerCase()
    for (const key of Object.keys(appComponents)) {
      if (key.toLowerCase() === lowerDecoded) {
        loader = appComponents[key]
        break
      }
    }
  }

  // 특정 앱 ID에 대한 직접 매핑 (fallback)
  if (!loader) {
    const directMappings: Record<string, string> = {
      'classmanager': 'classmanager',
      'school-lunch-bot': 'school-lunch-bot',
      'smart-farm-logic-lab': 'smart-farm-logic-lab',
    }
    const mappedKey = directMappings[decodedId] || directMappings[appId]
    if (mappedKey && appComponents[mappedKey]) {
      loader = appComponents[mappedKey]
    }
  }

  if (!loader) {
    // 디버깅: 등록된 앱 키 목록 확인
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('앱을 찾을 수 없습니다:', appId)
      console.warn('등록된 앱 키:', Object.keys(appComponents).slice(0, 10))
    }
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
