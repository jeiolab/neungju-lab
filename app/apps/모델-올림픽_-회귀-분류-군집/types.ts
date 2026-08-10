/** 기계학습 문제 유형 세 가지 */
export type ProblemType = 'regression' | 'classification' | 'clustering'

/** 교육용 합성 데이터셋 */
export type DatasetId = 'bike' | 'rocks' | 'energy'

/** 열의 값 종류 */
export type ColumnKind = 'numeric' | 'categorical'

/** 고급에서 고를 수 있는 모델 */
export type ModelKind = 'linear' | 'knn' | 'stump' | 'tree' | 'kmeans'

/** 데이터셋의 한 열 정의 */
export interface ColumnDef {
  key: string
  label: string
  kind: ColumnKind
  /** 이 열을 목표로 두면 어떤 문제 유형이 되는지 */
  asTarget?: ProblemType
  unit?: string
  /** 짧은 설명 */
  meaning: string
}

/** 한 줄(한 샘플) */
export interface DataRow {
  id: string
  /** 숫자·범주 값을 문자열 키로 담습니다 */
  values: Record<string, number | string>
}

/** 초급 문제 카드 */
export interface ProblemCard {
  id: string
  datasetId: DatasetId
  title: string
  /** 학생이 읽는 상황 설명 */
  story: string
  correctType: ProblemType
  /** 왜 그 유형인지 객관식 */
  whyChoices: string[]
  whyCorrect: string
  /** 결과 시각화에 쓰는 짧은 안내 */
  vizHint: string
}

/** 회귀 지표 */
export interface RegressionMetrics {
  mae: number
  r2: number
  /** 예측값 일부 (시각화용) */
  samples: Array<{ actual: number; predicted: number }>
}

/** 분류 지표 */
export interface ClassificationMetrics {
  accuracy: number
  correct: number
  total: number
  recallByClass: Record<string, number>
  /** 혼동행렬: [실제][예측] 횟수 */
  confusion: Record<string, Record<string, number>>
}

/** 군집 지표 (단순화 실루엣) */
export interface ClusteringMetrics {
  silhouette: number
  inertia: number
  k: number
  /** 시각화용: 2차원 투영과 군집 번호 */
  points: Array<{ x: number; y: number; cluster: number }>
}

export type MetricsBundle =
  | { type: 'regression'; model: RegressionMetrics; baseline: RegressionMetrics }
  | { type: 'classification'; model: ClassificationMetrics; baseline: ClassificationMetrics }
  | { type: 'clustering'; model: ClusteringMetrics; baseline: ClusteringMetrics }

/** 고급 모델 카드 초안 */
export interface ModelCardDraft {
  purpose: string
  limits: string
  misuse: string
}

/** 과적합 실험 결과 */
export interface OverfitReport {
  trainScore: number
  testScore: number
  gap: number
  /** 어떤 설정이 과적합을 만들었는지 */
  setup: string
  scoreLabel: string
  higherIsBetter: boolean
}
