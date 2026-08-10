/** 외계 생물이 사는 서식 환경 (분류 정답) */
export type Habitat = '습한동굴' | '건조사막' | '빛나숲'

/** 분류에 쓰는 숫자 특성 */
export type FeatureKey = 'bodySize' | 'antennae' | 'glow' | 'humidity' | 'temp'

/** 합성 생물 한 마리 */
export interface Creature {
  id: string
  bodySize: number
  antennae: number
  glow: number
  humidity: number
  temp: number
  habitat: Habitat
}

/** 초급에서 고르는 질문 카드 */
export interface QuestionCard {
  id: string
  /** 학생에게 보이는 질문 문장 */
  prompt: string
  feature: FeatureKey
  /** 특성 값이 threshold 이상이면 '예' 갈래 */
  threshold: number
  /** 짧은 설명 */
  hint: string
}

/** 나무의 한 노드. 분할이 없으면 잎(다수 서식지 예측) */
export interface TreeNode {
  id: string
  /** 부모 노드 id. 뿌리는 null */
  parentId: string | null
  /** 왼쪽(예) / 오른쪽(아니오) 자식. 잎이면 null */
  leftId: string | null
  rightId: string | null
  feature: FeatureKey | null
  threshold: number | null
  /** 이 노드에 도달한 훈련 데이터의 다수 서식지 */
  prediction: Habitat
  depth: number
}

/** 분할 후보의 평가 결과 */
export interface SplitCandidate {
  feature: FeatureKey
  threshold: number
  giniBefore: number
  giniLeft: number
  giniRight: number
  giniAfter: number
  improvement: number
  leftCount: number
  rightCount: number
}

/** 서식지별 개체 수 */
export type HabitatCounts = Record<Habitat, number>

export interface NodeStats {
  counts: HabitatCounts
  total: number
  gini: number
  majority: Habitat
}

export interface AccuracyReport {
  correct: number
  total: number
  accuracy: number
  /** 서식지별 맞힌 수 / 전체 */
  byHabitat: Record<Habitat, { correct: number; total: number }>
}

/** 초급에서 저장한 질문 순서 실험 */
export interface OrderTrial {
  id: string
  label: string
  questionIds: string[]
  correct: number
  total: number
}
