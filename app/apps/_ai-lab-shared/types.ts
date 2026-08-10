/**
 * 「인공지능 기초 실험실」 8개 모듈이 공유하는 타입 정의.
 * 이 폴더는 앱이 아니라 공용 라이브러리이므로
 * data/apps.ts와 app/apps/app-loaders.ts에 등록하지 않습니다.
 */

/** 학습 진입점. 실력 등급이 아니라 '어디서부터 시작할지'를 뜻합니다. */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export const DIFFICULTY_ORDER: Difficulty[] = ['beginner', 'intermediate', 'advanced']

/** 화면에 노출할 난이도 문구. 학생에게 '쉬움/어려움'으로 보이지 않게 합니다. */
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: '처음 배워요',
  intermediate: '직접 조절해요',
  advanced: '깊이 파고들어요',
}

export const DIFFICULTY_SHORT: Record<Difficulty, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

/** 난이도별 소개 카드에 들어갈 내용 */
export interface DifficultyCard {
  difficulty: Difficulty
  /** 이 난이도에서 무엇을 하게 되는지 한 문장 */
  summary: string
  /** 다루는 개념·기능 목록 */
  points: string[]
  /** 예상 소요 시간 안내 */
  minutes: number
}

/** 모듈 공통 학습 단계 */
export type StageId = 'intro' | 'explore' | 'challenge' | 'result' | 'reflect'

export const STAGE_LABEL: Record<StageId, string> = {
  intro: '도입',
  explore: '탐구',
  challenge: '도전',
  result: '결과',
  reflect: '성찰',
}

/**
 * 8개 모듈이 공통으로 쓰는 결과 스키마.
 * 이름·학번·이메일 같은 개인 식별 정보는 절대 넣지 않습니다.
 */
export interface ModuleResult {
  moduleId: string
  moduleName: string
  version: string
  completedAt: string
  difficulty: Difficulty
  /** 학생이 선택하거나 조절한 값 */
  inputs: Record<string, unknown>
  /** 화면에서 관찰한 내용 */
  observations: Record<string, unknown>
  /** 수치 지표 */
  metrics: Record<string, number | string>
  /** 성찰 응답 */
  reflection: Record<string, string>
}

/** 성찰 질문 정의. 난이도에 따라 형식이 달라집니다. */
export interface ReflectionQuestion {
  id: string
  prompt: string
  /** 객관식이면 선택지를 제공합니다. 초급에서 주로 사용합니다. */
  choices?: string[]
  /** 서술형 입력의 권장 문장 수 */
  sentences?: number
  placeholder?: string
}
