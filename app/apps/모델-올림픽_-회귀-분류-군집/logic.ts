/**
 * 회귀·분류·군집 학습과 지표. 화면과 분리된 순수 함수입니다.
 * 라이브러리 없이 교육용으로 단순화한 구현입니다.
 */
import type {
  ClassificationMetrics,
  ClusteringMetrics,
  DataRow,
  MetricsBundle,
  ModelKind,
  OverfitReport,
  ProblemType,
  RegressionMetrics,
} from './types'

export function toPercent(ratio: number): number {
  return Math.round(ratio * 1000) / 10
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function asNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value)
}

export function asLabel(value: number | string): string {
  return String(value)
}

/** 훈련·시험 분할. 앞쪽 trainRatio 비율을 훈련으로 씁니다(seed 고정 데이터라 셔플 생략). */
export function trainTestSplit(
  rows: DataRow[],
  trainRatio: number
): { train: DataRow[]; test: DataRow[] } {
  const ratio = Math.min(0.9, Math.max(0.5, trainRatio))
  const cut = Math.max(1, Math.min(rows.length - 1, Math.round(rows.length * ratio)))
  return { train: rows.slice(0, cut), test: rows.slice(cut) }
}

function featureVector(row: DataRow, features: string[]): number[] {
  return features.map(key => asNumber(row.values[key] ?? 0))
}

function euclidean(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i] - b[i]
    sum += d * d
  }
  return Math.sqrt(sum)
}

function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((s, v) => s + v, 0) / values.length
}

function majorityLabel(labels: string[]): string {
  const counts = new Map<string, number>()
  labels.forEach(label => counts.set(label, (counts.get(label) ?? 0) + 1))
  let best = labels[0] ?? '?'
  let bestCount = -1
  counts.forEach((count, label) => {
    if (count > bestCount) {
      best = label
      bestCount = count
    }
  })
  return best
}

// ─── 기준 모델 ───────────────────────────────────────────────

/** 회귀 기준: 훈련 목표의 평균으로 전부 예측 */
export function baselineRegression(
  train: DataRow[],
  test: DataRow[],
  targetKey: string
): number[] {
  const m = mean(train.map(row => asNumber(row.values[targetKey])))
  return test.map(() => m)
}

/** 분류 기준: 훈련에서 가장 많은 종류로 전부 예측 */
export function baselineClassification(
  train: DataRow[],
  test: DataRow[],
  targetKey: string
): string[] {
  const maj = majorityLabel(train.map(row => asLabel(row.values[targetKey])))
  return test.map(() => maj)
}

/**
 * 군집 기준: 전부 한 무리(k=1)에 넣거나, 인덱스 기반 임의 배정.
 * mode 'single' = k=1, 'random' = 해시성 의사난수 배정
 */
export function baselineClustering(
  rows: DataRow[],
  k: number,
  mode: 'single' | 'random' = 'single'
): number[] {
  if (mode === 'single' || k <= 1) return rows.map(() => 0)
  return rows.map((row, index) => {
    // 안정적인 의사난수: id 문자 합
    let h = index
    for (let i = 0; i < row.id.length; i += 1) h = (h * 31 + row.id.charCodeAt(i)) >>> 0
    return h % k
  })
}

// ─── 회귀: 단순·다중 선형회귀 (정규방정식) ───────────────────

/**
 * 최소제곱 선형회귀. features에 절편 열을 붙입니다.
 * 행렬이 특이하면 평균 예측으로 퇴화합니다.
 */
export function fitLinearRegression(
  train: DataRow[],
  features: string[],
  targetKey: string
): { predict: (row: DataRow) => number; weights: number[] } {
  const n = train.length
  const p = features.length
  if (n === 0 || p === 0) {
    return { predict: () => 0, weights: [0] }
  }

  // X: n x (p+1), y: n
  const XtX: number[][] = Array.from({ length: p + 1 }, () => Array(p + 1).fill(0))
  const Xty: number[] = Array(p + 1).fill(0)

  train.forEach(row => {
    const x = [1, ...featureVector(row, features)]
    const y = asNumber(row.values[targetKey])
    for (let i = 0; i < p + 1; i += 1) {
      Xty[i] += x[i] * y
      for (let j = 0; j < p + 1; j += 1) {
        XtX[i][j] += x[i] * x[j]
      }
    }
  })

  // 능선 정규화로 수치 안정성
  for (let i = 0; i < p + 1; i += 1) XtX[i][i] += 1e-6

  const weights = solveLinearSystem(XtX, Xty)
  if (!weights) {
    const m = mean(train.map(row => asNumber(row.values[targetKey])))
    return { predict: () => m, weights: [m] }
  }

  return {
    weights,
    predict: (row: DataRow) => {
      const x = [1, ...featureVector(row, features)]
      let sum = 0
      for (let i = 0; i < x.length; i += 1) sum += weights[i] * x[i]
      return sum
    },
  }
}

/** 가우스 소거 (부분 피벗). 실패 시 null */
function solveLinearSystem(Ain: number[][], bin: number[]): number[] | null {
  const n = bin.length
  const A = Ain.map((row, i) => [...row, bin[i]])
  for (let col = 0; col < n; col += 1) {
    let pivot = col
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r
    }
    if (Math.abs(A[pivot][col]) < 1e-10) return null
    if (pivot !== col) {
      const tmp = A[col]
      A[col] = A[pivot]
      A[pivot] = tmp
    }
    const div = A[col][col]
    for (let c = col; c <= n; c += 1) A[col][c] /= div
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue
      const factor = A[r][col]
      for (let c = col; c <= n; c += 1) A[r][c] -= factor * A[col][c]
    }
  }
  return A.map(row => row[n])
}

export function predictLinear(
  model: { predict: (row: DataRow) => number },
  rows: DataRow[]
): number[] {
  return rows.map(row => model.predict(row))
}

// ─── 분류: k-NN ─────────────────────────────────────────────

export function knnClassify(
  train: DataRow[],
  test: DataRow[],
  features: string[],
  targetKey: string,
  k: number
): string[] {
  const kk = Math.max(1, Math.min(k, train.length))
  const trainVecs = train.map(row => ({
    vec: featureVector(row, features),
    label: asLabel(row.values[targetKey]),
  }))

  return test.map(row => {
    const vec = featureVector(row, features)
    const neighbors = trainVecs
      .map(t => ({ dist: euclidean(vec, t.vec), label: t.label }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, kk)
    return majorityLabel(neighbors.map(n => n.label))
  })
}

// ─── 분류: 의사결정 그루터기 / 얕은 나무 ─────────────────────

interface Stump {
  feature: string
  threshold: number
  leftLabel: string
  rightLabel: string
}

function bestStump(
  train: DataRow[],
  features: string[],
  targetKey: string
): Stump | null {
  if (train.length === 0 || features.length === 0) return null
  const fallback = majorityLabel(train.map(r => asLabel(r.values[targetKey])))
  let best: Stump | null = null
  let bestCorrect = -1

  features.forEach(feature => {
    const values = train.map(r => asNumber(r.values[feature])).sort((a, b) => a - b)
    const thresholds = new Set<number>()
    for (let i = 0; i < values.length - 1; i += 1) {
      if (values[i] !== values[i + 1]) thresholds.add((values[i] + values[i + 1]) / 2)
    }
    // 후보가 많으면 균등 샘플
    const list = Array.from(thresholds)
    const step = Math.max(1, Math.floor(list.length / 12))
    for (let i = 0; i < list.length; i += step) {
      const threshold = list[i]
      const left = train.filter(r => asNumber(r.values[feature]) >= threshold)
      const right = train.filter(r => asNumber(r.values[feature]) < threshold)
      if (left.length === 0 || right.length === 0) continue
      const leftLabel = majorityLabel(left.map(r => asLabel(r.values[targetKey])))
      const rightLabel = majorityLabel(right.map(r => asLabel(r.values[targetKey])))
      let correct = 0
      train.forEach(r => {
        const pred =
          asNumber(r.values[feature]) >= threshold ? leftLabel : rightLabel
        if (pred === asLabel(r.values[targetKey])) correct += 1
      })
      if (correct > bestCorrect) {
        bestCorrect = correct
        best = { feature, threshold, leftLabel, rightLabel }
      }
    }
  })

  return best ?? {
    feature: features[0],
    threshold: 0,
    leftLabel: fallback,
    rightLabel: fallback,
  }
}

export function stumpClassify(
  train: DataRow[],
  test: DataRow[],
  features: string[],
  targetKey: string
): string[] {
  const stump = bestStump(train, features, targetKey)
  if (!stump) return test.map(() => '?')
  return test.map(row =>
    asNumber(row.values[stump.feature]) >= stump.threshold ? stump.leftLabel : stump.rightLabel
  )
}

/**
 * 깊이 제한 얕은 나무. 각 노드에서 그루터기를 고르고 재귀합니다.
 * depth=1이면 그루터기와 같습니다.
 */
export function shallowTreeClassify(
  train: DataRow[],
  test: DataRow[],
  features: string[],
  targetKey: string,
  maxDepth: number
): string[] {
  type Node =
    | { kind: 'leaf'; label: string }
    | { kind: 'split'; feature: string; threshold: number; left: Node; right: Node }

  function build(rows: DataRow[], depth: number): Node {
    const labels = rows.map(r => asLabel(r.values[targetKey]))
    const maj = majorityLabel(labels)
    if (depth >= maxDepth || rows.length < 4 || new Set(labels).size === 1) {
      return { kind: 'leaf', label: maj }
    }
    const stump = bestStump(rows, features, targetKey)
    if (!stump) return { kind: 'leaf', label: maj }
    const leftRows = rows.filter(r => asNumber(r.values[stump.feature]) >= stump.threshold)
    const rightRows = rows.filter(r => asNumber(r.values[stump.feature]) < stump.threshold)
    if (leftRows.length === 0 || rightRows.length === 0) return { kind: 'leaf', label: maj }
    return {
      kind: 'split',
      feature: stump.feature,
      threshold: stump.threshold,
      left: build(leftRows, depth + 1),
      right: build(rightRows, depth + 1),
    }
  }

  function predict(node: Node, row: DataRow): string {
    if (node.kind === 'leaf') return node.label
    return asNumber(row.values[node.feature]) >= node.threshold
      ? predict(node.left, row)
      : predict(node.right, row)
  }

  const root = build(train, 0)
  return test.map(row => predict(root, row))
}

// ─── 군집: k-평균 ───────────────────────────────────────────

export function kMeans(
  rows: DataRow[],
  features: string[],
  k: number,
  maxIter = 25
): { assignments: number[]; centroids: number[][] } {
  const kk = Math.max(1, Math.min(k, rows.length))
  const vecs = rows.map(row => featureVector(row, features))
  if (vecs.length === 0) return { assignments: [], centroids: [] }

  // 초기 중심: 균등 간격 샘플
  const centroids: number[][] = []
  for (let i = 0; i < kk; i += 1) {
    const idx = Math.floor((i * (vecs.length - 1)) / Math.max(1, kk - 1))
    centroids.push([...vecs[idx]])
  }

  let assignments = vecs.map(() => 0)
  for (let iter = 0; iter < maxIter; iter += 1) {
    let changed = false
    assignments = vecs.map((vec, index) => {
      let best = 0
      let bestDist = Infinity
      for (let c = 0; c < kk; c += 1) {
        const d = euclidean(vec, centroids[c])
        if (d < bestDist) {
          bestDist = d
          best = c
        }
      }
      if (best !== assignments[index]) changed = true
      return best
    })

    for (let c = 0; c < kk; c += 1) {
      const members = vecs.filter((_, i) => assignments[i] === c)
      if (members.length === 0) continue
      const dim = members[0].length
      const next = Array(dim).fill(0)
      members.forEach(m => {
        for (let d = 0; d < dim; d += 1) next[d] += m[d]
      })
      for (let d = 0; d < dim; d += 1) next[d] /= members.length
      centroids[c] = next
    }
    if (!changed) break
  }

  return { assignments, centroids }
}

// ─── 지표 ───────────────────────────────────────────────────

export function evaluateRegression(
  actual: number[],
  predicted: number[]
): RegressionMetrics {
  const n = actual.length
  if (n === 0) {
    return { mae: 0, r2: 0, samples: [] }
  }
  let absErr = 0
  let ssRes = 0
  const yBar = mean(actual)
  let ssTot = 0
  for (let i = 0; i < n; i += 1) {
    const e = actual[i] - predicted[i]
    absErr += Math.abs(e)
    ssRes += e * e
    ssTot += (actual[i] - yBar) ** 2
  }
  const mae = absErr / n
  const r2 = ssTot < 1e-9 ? 0 : 1 - ssRes / ssTot
  const samples = actual.slice(0, 24).map((a, i) => ({
    actual: round2(a),
    predicted: round2(predicted[i]),
  }))
  return { mae: round2(mae), r2: round2(r2), samples }
}

export function evaluateClassification(
  actual: string[],
  predicted: string[]
): ClassificationMetrics {
  const labels = Array.from(new Set([...actual, ...predicted])).sort()
  const confusion: Record<string, Record<string, number>> = {}
  labels.forEach(a => {
    confusion[a] = {}
    labels.forEach(p => {
      confusion[a][p] = 0
    })
  })

  let correct = 0
  actual.forEach((a, i) => {
    const p = predicted[i]
    confusion[a][p] = (confusion[a][p] ?? 0) + 1
    if (a === p) correct += 1
  })

  const recallByClass: Record<string, number> = {}
  labels.forEach(label => {
    const rowSum = labels.reduce((s, p) => s + confusion[label][p], 0)
    recallByClass[label] = rowSum === 0 ? 0 : round2(confusion[label][label] / rowSum)
  })

  return {
    accuracy: actual.length === 0 ? 0 : round2(correct / actual.length),
    correct,
    total: actual.length,
    recallByClass,
    confusion,
  }
}

/** 단순화 실루엣: 각 점의 (b-a)/max(a,b) 평균. a=같은 무리 평균거리, b=가장 가까운 다른 무리 */
export function evaluateClustering(
  rows: DataRow[],
  features: string[],
  assignments: number[]
): ClusteringMetrics {
  const vecs = rows.map(row => featureVector(row, features))
  const k = assignments.length === 0 ? 0 : Math.max(...assignments) + 1

  let inertia = 0
  const centroids: number[][] = []
  for (let c = 0; c < k; c += 1) {
    const members = vecs.filter((_, i) => assignments[i] === c)
    if (members.length === 0) {
      centroids.push(vecs[0] ? [...vecs[0]] : [])
      continue
    }
    const dim = members[0].length
    const center = Array(dim).fill(0)
    members.forEach(m => {
      for (let d = 0; d < dim; d += 1) center[d] += m[d]
    })
    for (let d = 0; d < dim; d += 1) center[d] /= members.length
    centroids.push(center)
    members.forEach(m => {
      inertia += euclidean(m, center) ** 2
    })
  }

  let silhouetteSum = 0
  let silhouetteCount = 0
  // 성능: 최대 60점만 샘플
  const sampleIdx = vecs.map((_, i) => i).filter(i => i % Math.max(1, Math.ceil(vecs.length / 60)) === 0)

  sampleIdx.forEach(i => {
    const ci = assignments[i]
    const same = sampleIdx.filter(j => j !== i && assignments[j] === ci)
    if (same.length === 0) return
    const a = mean(same.map(j => euclidean(vecs[i], vecs[j])))
    let b = Infinity
    for (let c = 0; c < k; c += 1) {
      if (c === ci) continue
      const other = sampleIdx.filter(j => assignments[j] === c)
      if (other.length === 0) continue
      const dist = mean(other.map(j => euclidean(vecs[i], vecs[j])))
      if (dist < b) b = dist
    }
    if (b === Infinity) return
    const s = (b - a) / Math.max(a, b, 1e-9)
    silhouetteSum += s
    silhouetteCount += 1
  })

  // 시각화: 앞의 두 특성으로 산점도
  const xKey = 0
  const yKey = Math.min(1, (features.length || 1) - 1)
  const points = rows.slice(0, 60).map((row, i) => ({
    x: round2(asNumber(row.values[features[xKey]] ?? 0)),
    y: round2(asNumber(row.values[features[yKey]] ?? 0)),
    cluster: assignments[i] ?? 0,
  }))

  return {
    silhouette: silhouetteCount === 0 ? 0 : round2(silhouetteSum / silhouetteCount),
    inertia: round2(inertia),
    k,
    points,
  }
}

// ─── 통합 실행 ───────────────────────────────────────────────

export function inferProblemType(
  targetKey: string | null,
  columns: Array<{ key: string; asTarget?: ProblemType }>
): ProblemType {
  if (!targetKey) return 'clustering'
  const col = columns.find(c => c.key === targetKey)
  return col?.asTarget ?? 'clustering'
}

/** 중급·고급에서 쓰는 한 번의 실험 실행 */
export function runExperiment(args: {
  problemType: ProblemType
  modelKind: ModelKind
  rows: DataRow[]
  features: string[]
  targetKey: string | null
  trainRatio: number
  k: number
  treeDepth: number
}): {
  train: DataRow[]
  test: DataRow[]
  metrics: MetricsBundle
  overfit?: OverfitReport
} {
  const { problemType, modelKind, rows, features, targetKey, trainRatio, k, treeDepth } = args
  const { train, test } = trainTestSplit(rows, trainRatio)
  const feat = features.length > 0 ? features : []

  if (problemType === 'regression' && targetKey) {
    const actualTest = test.map(r => asNumber(r.values[targetKey]))
    const actualTrain = train.map(r => asNumber(r.values[targetKey]))
    const basePred = baselineRegression(train, test, targetKey)

    let modelPred: number[]
    if (modelKind === 'knn') {
      const kk = Math.max(1, Math.min(k, train.length))
      modelPred = test.map(row => {
        const vec = featureVector(row, feat)
        const neighbors = train
          .map(t => ({
            dist: euclidean(vec, featureVector(t, feat)),
            y: asNumber(t.values[targetKey]),
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, kk)
        return mean(neighbors.map(n => n.y))
      })
    } else {
      const model = fitLinearRegression(train, feat, targetKey)
      modelPred = predictLinear(model, test)
    }

    const modelMetrics = evaluateRegression(actualTest, modelPred)
    const baselineMetrics = evaluateRegression(actualTest, basePred)

    // 과적합: k=1 이웃 회귀 또는 훈련에만 맞춘 선형 vs 시험
    const overfitModel = fitLinearRegression(train, feat, targetKey)
    const trainPred = predictLinear(overfitModel, train)
    const testPred = predictLinear(overfitModel, test)
    const trainMae = evaluateRegression(actualTrain, trainPred).mae
    const testMae = evaluateRegression(actualTest, testPred).mae
    // k=1이 더 과적합을 잘 보여 줌
    const knn1Train = train.map(row => {
      const vec = featureVector(row, feat)
      const neighbors = train
        .map(t => ({
          dist: euclidean(vec, featureVector(t, feat)),
          y: asNumber(t.values[targetKey]),
        }))
        .sort((a, b) => a.dist - b.dist)
      return neighbors[0]?.y ?? 0
    })
    const knn1Test = test.map(row => {
      const vec = featureVector(row, feat)
      const neighbors = train
        .map(t => ({
          dist: euclidean(vec, featureVector(t, feat)),
          y: asNumber(t.values[targetKey]),
        }))
        .sort((a, b) => a.dist - b.dist)
      return neighbors[0]?.y ?? 0
    })
    const knn1TrainMae = evaluateRegression(actualTrain, knn1Train).mae
    const knn1TestMae = evaluateRegression(actualTest, knn1Test).mae

    const overfit: OverfitReport = {
      trainScore: knn1TrainMae,
      testScore: knn1TestMae,
      gap: round2(knn1TestMae - knn1TrainMae),
      setup: '이웃 수 k=1로 숫자를 맞히면 훈련에는 거의 완벽하지만 시험에서는 오차가 커질 수 있습니다.',
      scoreLabel: '평균절대오차(MAE)',
      higherIsBetter: false,
    }
    void trainMae
    void testMae

    return {
      train,
      test,
      metrics: { type: 'regression', model: modelMetrics, baseline: baselineMetrics },
      overfit,
    }
  }

  if (problemType === 'classification' && targetKey) {
    const actualTest = test.map(r => asLabel(r.values[targetKey]))
    const actualTrain = train.map(r => asLabel(r.values[targetKey]))
    const basePred = baselineClassification(train, test, targetKey)

    let modelPred: string[]
    if (modelKind === 'stump') {
      modelPred = stumpClassify(train, test, feat, targetKey)
    } else if (modelKind === 'tree') {
      modelPred = shallowTreeClassify(train, test, feat, targetKey, treeDepth)
    } else {
      modelPred = knnClassify(train, test, feat, targetKey, k)
    }

    const modelMetrics = evaluateClassification(actualTest, modelPred)
    const baselineMetrics = evaluateClassification(actualTest, basePred)

    // 과적합: 깊은 나무(depth 8) vs 시험
    const deepTrain = shallowTreeClassify(train, train, feat, targetKey, 8)
    const deepTest = shallowTreeClassify(train, test, feat, targetKey, 8)
    const trainAcc = evaluateClassification(actualTrain, deepTrain).accuracy
    const testAcc = evaluateClassification(actualTest, deepTest).accuracy

    const overfit: OverfitReport = {
      trainScore: trainAcc,
      testScore: testAcc,
      gap: round2(trainAcc - testAcc),
      setup: '깊이 8인 얕지 않은 나무는 훈련 데이터를 거의 외워 시험 성적이 떨어질 수 있습니다.',
      scoreLabel: '정확도',
      higherIsBetter: true,
    }

    return {
      train,
      test,
      metrics: { type: 'classification', model: modelMetrics, baseline: baselineMetrics },
      overfit,
    }
  }

  // 군집: 전체 데이터에 대해 k-means (비지도이므로 분할 없이 비교하되, 시험 구간만 지표로 쓰기도 함)
  const clusterRows = rows
  const km = kMeans(clusterRows, feat, k)
  const baseAssign = baselineClustering(clusterRows, k, 'single')
  const randomAssign = baselineClustering(clusterRows, k, 'random')

  const modelMetrics = evaluateClustering(clusterRows, feat, km.assignments)
  // 기준은 k=1(전부 한 무리) — 실루엣이 의미 없을 수 있어 임의 배정도 함께 참고
  const baselineMetrics = evaluateClustering(clusterRows, feat, baseAssign)
  const randomMetrics = evaluateClustering(clusterRows, feat, randomAssign)

  // 과적합 유사: k를 너무 크게(거의 점마다 한 무리)
  const tooBigK = Math.min(clusterRows.length, Math.max(k * 4, 12))
  const overfitKm = kMeans(clusterRows, feat, tooBigK)
  const overfitSil = evaluateClustering(clusterRows, feat, overfitKm.assignments)

  const overfit: OverfitReport = {
    trainScore: overfitSil.silhouette,
    testScore: modelMetrics.silhouette,
    gap: round2(overfitSil.inertia < modelMetrics.inertia ? modelMetrics.inertia - overfitSil.inertia : 0),
    setup: `무리 개수 k를 ${tooBigK}처럼 너무 크게 잡으면 관성(inertia)은 줄지만, 해석 가능한 묶음이 아니게 됩니다.`,
    scoreLabel: '실루엣(참고)',
    higherIsBetter: true,
  }
  void randomMetrics

  return {
    train,
    test,
    metrics: {
      type: 'clustering',
      model: modelMetrics,
      baseline: {
        ...baselineMetrics,
        // 기준 설명용: k=1 실루엣을 낮은 값으로 유지
      },
    },
    overfit,
  }
}

/** 초급 시각화용: 데이터셋·유형에 맞는 데모 결과 */
export function beginnerDemo(
  problemType: ProblemType,
  rows: DataRow[],
  featureKeys: string[],
  targetKey: string | null
) {
  const { train, test } = trainTestSplit(rows, 0.7)
  if (problemType === 'regression' && targetKey) {
    const model = fitLinearRegression(train, featureKeys, targetKey)
    const pred = predictLinear(model, test)
    const base = baselineRegression(train, test, targetKey)
    const actual = test.map(r => asNumber(r.values[targetKey]))
    return {
      type: 'regression' as const,
      model: evaluateRegression(actual, pred),
      baseline: evaluateRegression(actual, base),
    }
  }
  if (problemType === 'classification' && targetKey) {
    const pred = knnClassify(train, test, featureKeys, targetKey, 3)
    const base = baselineClassification(train, test, targetKey)
    const actual = test.map(r => asLabel(r.values[targetKey]))
    return {
      type: 'classification' as const,
      model: evaluateClassification(actual, pred),
      baseline: evaluateClassification(actual, base),
    }
  }
  const km = kMeans(rows, featureKeys, 3)
  const base = baselineClustering(rows, 3, 'single')
  return {
    type: 'clustering' as const,
    model: evaluateClustering(rows, featureKeys, km.assignments),
    baseline: evaluateClustering(rows, featureKeys, base),
  }
}

export function columnLabel(
  columns: Array<{ key: string; label: string }>,
  key: string
): string {
  return columns.find(c => c.key === key)?.label ?? key
}
