/**
 * 단일 퍼셉트론 계산·분류·학습.
 * 화면 코드와 분리된 순수 함수라 같은 입력이면 언제나 같은 결과가 나옵니다.
 */
import type {
  ClassificationResult,
  EpochError,
  LearningStep,
  SamplePoint,
  WeightedSumBreakdown,
  Weights,
} from './types'

export function weightedSum(w: Weights, x1: number, x2: number): WeightedSumBreakdown {
  const w1x1 = w.w1 * x1
  const w2x2 = w.w2 * x2
  const b = w.b
  return { w1x1, w2x2, b, z: w1x1 + w2x2 + b }
}

/** 계단 함수: z ≥ 0 이면 1, 아니면 0 */
export function stepActivate(z: number): 0 | 1 {
  return z >= 0 ? 1 : 0
}

/** 시그모이드. 확률처럼 부드러운 0~1 값 */
export function sigmoidActivate(z: number): number {
  // 오버플로 방지
  if (z > 20) return 1
  if (z < -20) return 0
  return 1 / (1 + Math.exp(-z))
}

export function predictStep(w: Weights, x1: number, x2: number): 0 | 1 {
  return stepActivate(weightedSum(w, x1, x2).z)
}

export function classifyPoints(w: Weights, points: SamplePoint[]): ClassificationResult {
  const predictions = points.map(p => predictStep(w, p.x1, p.x2))
  let correct = 0
  points.forEach((p, i) => {
    if (predictions[i] === p.label) correct += 1
  })
  const total = points.length
  return {
    correct,
    total,
    accuracy: total === 0 ? 0 : correct / total,
    predictions,
  }
}

export function toPercent(value: number): number {
  return Math.round(value * 1000) / 10
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * 결정 경계: w1·x1 + w2·x2 + b = 0
 * 플롯 범위 안에서 선분의 두 끝점을 구합니다.
 * w2≈0 이면 수직선, w1≈0 이면 수평선입니다.
 */
export function decisionBoundarySegment(
  w: Weights,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): { x1: number; y1: number; x2: number; y2: number } | null {
  const eps = 1e-9
  const { minX, maxX, minY, maxY } = bounds
  const candidates: Array<{ x: number; y: number }> = []

  if (Math.abs(w.w2) > eps) {
    const yAt = (x: number) => (-w.w1 * x - w.b) / w.w2
    ;[minX, maxX].forEach(x => {
      const y = yAt(x)
      if (y >= minY - eps && y <= maxY + eps) candidates.push({ x, y: clamp(y, minY, maxY) })
    })
  }
  if (Math.abs(w.w1) > eps) {
    const xAt = (y: number) => (-w.w2 * y - w.b) / w.w1
    ;[minY, maxY].forEach(y => {
      const x = xAt(y)
      if (x >= minX - eps && x <= maxX + eps) candidates.push({ x: clamp(x, minX, maxX), y })
    })
  }

  // 중복 제거 후 가장 멀리 떨어진 두 점 선택
  const unique: Array<{ x: number; y: number }> = []
  candidates.forEach(c => {
    if (!unique.some(u => Math.hypot(u.x - c.x, u.y - c.y) < 1e-6)) unique.push(c)
  })
  if (unique.length < 2) return null

  let best = { a: unique[0], b: unique[1], d: -1 }
  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const d = Math.hypot(unique[i].x - unique[j].x, unique[i].y - unique[j].y)
      if (d > best.d) best = { a: unique[i], b: unique[j], d }
    }
  }
  return { x1: best.a.x, y1: best.a.y, x2: best.b.x, y2: best.b.y }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

/**
 * 퍼셉트론 학습 규칙 (0/1 레이블).
 * 예측이 틀리면 w ← w + η·(y − ŷ)·x , b ← b + η·(y − ŷ)
 */
export function perceptronUpdate(
  w: Weights,
  x1: number,
  x2: number,
  label: 0 | 1,
  learningRate: number
): { next: Weights; prediction: 0 | 1; error: number; updated: boolean } {
  const prediction = predictStep(w, x1, x2)
  const error = label - prediction
  if (error === 0) {
    return { next: { ...w }, prediction, error, updated: false }
  }
  return {
    next: {
      w1: w.w1 + learningRate * error * x1,
      w2: w.w2 + learningRate * error * x2,
      b: w.b + learningRate * error,
    },
    prediction,
    error,
    updated: true,
  }
}

/** 한 샘플만 학습하고 단계 기록을 남깁니다. */
export function runLearningStep(
  w: Weights,
  point: SamplePoint,
  sampleIndex: number,
  epoch: number,
  learningRate: number
): LearningStep {
  const before = { ...w }
  const { next, prediction, error, updated } = perceptronUpdate(
    w,
    point.x1,
    point.x2,
    point.label,
    learningRate
  )
  return {
    epoch,
    sampleIndex,
    pointId: point.id,
    x1: point.x1,
    x2: point.x2,
    label: point.label,
    prediction,
    error,
    weightsBefore: before,
    weightsAfter: next,
    updated,
  }
}

/**
 * 전체 epoch를 돌리며 단계와 epoch별 오류 수를 모읍니다.
 * 오류가 0이 되면 조기 종료합니다.
 */
export function trainPerceptron(
  start: Weights,
  points: SamplePoint[],
  learningRate: number,
  maxEpochs: number
): { weights: Weights; steps: LearningStep[]; epochErrors: EpochError[]; converged: boolean } {
  let w = { ...start }
  const steps: LearningStep[] = []
  const epochErrors: EpochError[] = []
  let converged = false

  for (let epoch = 1; epoch <= maxEpochs; epoch += 1) {
    let errors = 0
    points.forEach((point, sampleIndex) => {
      const step = runLearningStep(w, point, sampleIndex, epoch, learningRate)
      steps.push(step)
      w = step.weightsAfter
      if (step.error !== 0) errors += 1
    })
    epochErrors.push({ epoch, errors })
    if (errors === 0) {
      converged = true
      break
    }
  }

  return { weights: w, steps, epochErrors, converged }
}

/** 시그모이드 곡선용 샘플 (z축) */
export function sigmoidCurve(from = -6, to = 6, count = 61): Array<{ z: number; y: number }> {
  const out: Array<{ z: number; y: number }> = []
  for (let i = 0; i < count; i += 1) {
    const z = from + ((to - from) * i) / (count - 1)
    out.push({ z, y: sigmoidActivate(z) })
  }
  return out
}

export function formatWeight(value: number): string {
  const rounded = round2(value)
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}
