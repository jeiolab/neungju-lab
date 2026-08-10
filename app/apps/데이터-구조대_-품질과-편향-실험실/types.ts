/** 관심 분야 (가상 범주) */
export type Interest = '로봇' | '데이터' | '예술'

/**
 * 학습 지원 그룹. 성별·인종 같은 실제 민감 속성 대신
 * 교육용으로 만든 가상의 A/B 그룹입니다.
 */
export type SupportGroup = 'A' | 'B'

export type Label = '추천' | '보류'

/** 동아리 체험 프로그램 참가 추천 데이터 한 줄 */
export interface Student {
  id: string
  /** 사전 활동 횟수 */
  priorActivities: number | null
  /** 관심 분야 */
  interest: Interest | null
  /** 주당 참여 가능 시간 */
  availableHours: number | null
  /** 기초 퀴즈 점수 */
  quizScore: number | null
  group: SupportGroup
  label: Label
}

export type NumericField = 'priorActivities' | 'availableHours' | 'quizScore'

/** 거리 계산에 쓰는 특성 */
export type FeatureKey = NumericField | 'interest'

/** 품질 문제 종류 */
export type IssueKind = 'missing' | 'outlier' | 'duplicate' | 'suspiciousLabel'

export interface CellIssue {
  rowId: string
  field: keyof Student
  kind: IssueKind
  reason: string
}

export interface QualityReport {
  issues: CellIssue[]
  missingCount: number
  outlierCount: number
  duplicateCount: number
  suspiciousLabelCount: number
  /** 그룹별 행 수 */
  groupCounts: Record<SupportGroup, number>
  /** 레이블별 행 수 */
  labelCounts: Record<Label, number>
}

/** 전처리 카드 식별자 */
export type PreprocessId =
  | 'dropMissingRows'
  | 'fillNumericMean'
  | 'fillCategoryMode'
  | 'clampOutliers'
  | 'fixSuspiciousLabels'
  | 'resampleMinority'
  | 'dropProxyFeature'
  | 'normalize'
  | 'dropDuplicates'

export interface PreprocessCard {
  id: PreprocessId
  name: string
  /** 초급·중급에서 쓰는 쉬운 이름 */
  plainName: string
  description: string
  /** 언제 쓰면 좋은지 */
  whenToUse: string
  /** 주의할 점 */
  caution: string
  /** 고급 미션에서 쓰는 정비 비용 */
  cost: number
  /** 이 카드가 노출되는 최소 난이도 */
  level: 'intermediate' | 'advanced'
}

export interface ConfusionMatrix {
  truePositive: number
  falsePositive: number
  trueNegative: number
  falseNegative: number
}

export interface Metrics {
  accuracy: number
  precision: number
  recall: number
  matrix: ConfusionMatrix
  /** 정답을 맞힌 개수와 전체 개수 (초급에서 백분율 대신 함께 표시) */
  correct: number
  total: number
  /** 그룹별 재현율 */
  recallByGroup: Record<SupportGroup, number>
  /** 그룹 간 재현율 격차 */
  recallGap: number
  /**
   * 그룹별로 '추천해야 했는데 놓친 인원 수'.
   * 중급에서는 비율 대신 이 사람 수로 보여 줍니다.
   */
  missedByGroup: Record<SupportGroup, { missed: number; shouldRecommend: number }>
}
