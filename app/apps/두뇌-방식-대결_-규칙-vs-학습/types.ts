/** 외계 식물 안전성 레이블 */
export type Label = '식용' | '독성'

/** 토양 빛깔 (범주형 특성) */
export type SoilHue = '보라' | '청록' | '황금'

/** 거리·규칙에 쓰는 특성 키 */
export type FeatureKey = 'glow' | 'spikes' | 'height' | 'nectar' | 'soil'

export type NumericFeature = Exclude<FeatureKey, 'soil'>

/** IF 조건에 쓰는 비교 연산자 */
export type CompareOp = '>=' | '<=' | '>' | '<' | '==' | '!='

/** 외계 식물 한 개체 */
export interface Plant {
  id: string
  /** 학생에게 보여 줄 짧은 이름 */
  name: string
  /** 잎빛 세기 (0~10). null이면 결측 */
  glow: number | null
  /** 가시 개수 (0~8) */
  spikes: number | null
  /** 키(손뼘, 1~20) */
  height: number | null
  /** 꿀의 달콤함 (0~10) */
  nectar: number | null
  /** 자라는 토양 빛깔 */
  soil: SoilHue | null
  label: Label
}

/** IF-THEN 규칙 한 줄 */
export interface Rule {
  id: string
  feature: FeatureKey
  op: CompareOp
  /** 수치 또는 토양 빛깔 */
  value: number | SoilHue
  label: Label
  /**
   * 우선순위. 숫자가 작을수록 먼저 적용됩니다.
   * (1이 가장 높은 우선순위)
   */
  priority: number
  enabled: boolean
}

/** 규칙이 여러 개 맞을 때 어떻게 고를지 */
export type ConflictPolicy = 'firstMatch' | 'highestPriority' | 'majorityVote'

/** 특성 값이 비어 있을 때 규칙 엔진 행동 */
export type MissingPolicy = 'skipRule' | 'failSafeToxic' | 'useDefault'

export interface RuleTraceStep {
  ruleId: string
  /** 조건이 참이었는지 */
  matched: boolean
  /** 결측 때문에 이 규칙을 건너뛰었는지 */
  skippedMissing: boolean
  description: string
}

export interface RulePrediction {
  label: Label | null
  path: RuleTraceStep[]
  explanation: string
  /** 충돌이 있었으면 짧은 메모 */
  conflictNote?: string
}

export interface NeighborInfo {
  plant: Plant
  distance: number
}

export interface KnnPrediction {
  label: Label | null
  neighbors: NeighborInfo[]
  explanation: string
}

export interface CaseComparison {
  plant: Plant
  rule: RulePrediction
  knn: KnnPrediction
  agree: boolean
}

export interface CompareMetrics {
  total: number
  agreementRate: number
  ruleAccuracy: number
  knnAccuracy: number
  disagreeCount: number
  ruleCorrect: number
  knnCorrect: number
}

export interface FeatureMeta {
  key: FeatureKey
  label: string
  meaning: string
  range: string
  kind: 'number' | 'category'
}
