/** 한 개의 2차원 입력과 정답 레이블 */
export interface SamplePoint {
  id: string
  x1: number
  x2: number
  /** 0 또는 1 */
  label: 0 | 1
}

/** 단일 퍼셉트론의 가중치와 편향 */
export interface Weights {
  w1: number
  w2: number
  b: number
}

export type ActivationKind = 'step' | 'sigmoid'

/** 논리 게이트 도전 과제 */
export type GateId = 'AND' | 'OR' | 'XOR'

export interface GateChallenge {
  id: GateId
  name: string
  description: string
  points: SamplePoint[]
  /** 직선 하나로 나눌 수 있는지 */
  linearlySeparable: boolean
}

/** 가중합을 항별로 펼친 결과 */
export interface WeightedSumBreakdown {
  w1x1: number
  w2x2: number
  b: number
  z: number
}

/** 퍼셉트론 학습 한 단계의 기록 */
export interface LearningStep {
  epoch: number
  sampleIndex: number
  pointId: string
  x1: number
  x2: number
  label: 0 | 1
  prediction: 0 | 1
  error: number
  weightsBefore: Weights
  weightsAfter: Weights
  updated: boolean
}

/** 한 epoch가 끝난 뒤의 오류 개수 */
export interface EpochError {
  epoch: number
  errors: number
}

export interface ClassificationResult {
  correct: number
  total: number
  accuracy: number
  /** 각 점의 예측 (points 순서와 동일) */
  predictions: Array<0 | 1>
}
