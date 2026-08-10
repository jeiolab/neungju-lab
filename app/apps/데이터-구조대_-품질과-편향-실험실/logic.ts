/**
 * 데이터 품질 검사, 전처리, k-NN 분류, 성능 평가.
 * 모두 화면 코드와 분리된 순수 함수라 값만 넣으면 언제나 같은 결과가 나옵니다.
 */
import type {
  CellIssue,
  ConfusionMatrix,
  FeatureKey,
  Interest,
  Label,
  Metrics,
  NumericField,
  PreprocessId,
  QualityReport,
  Student,
  SupportGroup,
} from './types'

const NUMERIC_FIELDS: NumericField[] = ['priorActivities', 'availableHours', 'quizScore']

/** 데이터 사전에 적힌 정상 범위. 이 밖의 값은 이상값으로 봅니다. */
export const VALID_RANGE: Record<NumericField, { min: number; max: number }> = {
  priorActivities: { min: 0, max: 8 },
  availableHours: { min: 1, max: 9 },
  quizScore: { min: 0, max: 10 },
}

const SUSPICIOUS_NEIGHBORS = 5

function isMissing(value: unknown): boolean {
  return value === null || value === undefined
}

/** id를 뺀 모든 값이 같으면 같은 행으로 봅니다. */
function rowSignature(row: Student): string {
  return [row.priorActivities, row.interest, row.availableHours, row.quizScore, row.group, row.label].join('|')
}

/** 결측과 제외된 특성을 뺀 나머지로 거리를 재고, 사용한 특성 수로 나눠 보정합니다. */
function distance(
  a: Student,
  b: Student,
  scale: Record<NumericField, { min: number; span: number }> | null,
  excluded: ReadonlySet<FeatureKey>
): number {
  let sum = 0
  let used = 0

  NUMERIC_FIELDS.forEach(field => {
    if (excluded.has(field)) return
    const av = a[field]
    const bv = b[field]
    if (isMissing(av) || isMissing(bv)) return
    let diff = (av as number) - (bv as number)
    if (scale) {
      const { span } = scale[field]
      diff = span === 0 ? 0 : diff / span
    }
    sum += diff * diff
    used += 1
  })

  if (!excluded.has('interest') && !isMissing(a.interest) && !isMissing(b.interest)) {
    sum += a.interest === b.interest ? 0 : 1
    used += 1
  }

  // 사용한 특성 수가 다르면 거리가 불공평해지므로 평균 제곱으로 보정합니다.
  if (used === 0) return Number.POSITIVE_INFINITY
  return Math.sqrt(sum / used)
}

const NO_EXCLUSION: ReadonlySet<FeatureKey> = new Set()

function buildScale(rows: Student[]): Record<NumericField, { min: number; span: number }> {
  const scale = {} as Record<NumericField, { min: number; span: number }>
  NUMERIC_FIELDS.forEach(field => {
    const values = rows
      .map(row => row[field])
      .filter((value): value is number => !isMissing(value))
    const min = values.length > 0 ? Math.min(...values) : 0
    const max = values.length > 0 ? Math.max(...values) : 1
    scale[field] = { min, span: max - min }
  })
  return scale
}

/** 이웃의 다수 레이블. 동점이면 가장 가까운 이웃의 레이블을 따릅니다. */
function majorityLabel(neighbors: Array<{ row: Student; distance: number }>): Label {
  let recommend = 0
  let hold = 0
  neighbors.forEach(neighbor => {
    if (neighbor.row.label === '추천') recommend += 1
    else hold += 1
  })
  if (recommend > hold) return '추천'
  if (hold > recommend) return '보류'
  return neighbors[0]?.row.label ?? '보류'
}

function nearest(
  target: Student,
  pool: Student[],
  k: number,
  scale: Record<NumericField, { min: number; span: number }> | null,
  excluded: ReadonlySet<FeatureKey> = NO_EXCLUSION
): Array<{ row: Student; distance: number }> {
  return pool
    .map(row => ({ row, distance: distance(target, row, scale, excluded) }))
    .filter(item => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)
}

/** 데이터에서 품질 문제를 찾아냅니다. */
export function detectQuality(rows: Student[]): QualityReport {
  const issues: CellIssue[] = []

  rows.forEach(row => {
    NUMERIC_FIELDS.forEach(field => {
      const value = row[field]
      if (isMissing(value)) {
        issues.push({ rowId: row.id, field, kind: 'missing', reason: '값이 비어 있습니다.' })
        return
      }
      const range = VALID_RANGE[field]
      if ((value as number) < range.min || (value as number) > range.max) {
        issues.push({
          rowId: row.id,
          field,
          kind: 'outlier',
          reason: `정상 범위(${range.min}~${range.max})를 벗어난 값입니다.`,
        })
      }
    })

    if (isMissing(row.interest)) {
      issues.push({ rowId: row.id, field: 'interest', kind: 'missing', reason: '값이 비어 있습니다.' })
    }
  })

  // 중복: 같은 내용이 두 번째로 나오는 행부터 표시합니다.
  const seen = new Map<string, string>()
  rows.forEach(row => {
    const signature = rowSignature(row)
    const first = seen.get(signature)
    if (first) {
      issues.push({
        rowId: row.id,
        field: 'id',
        kind: 'duplicate',
        reason: `${first}번과 내용이 완전히 같습니다.`,
      })
    } else {
      seen.set(signature, row.id)
    }
  })

  // 의심 레이블: 비슷한 사례들과 결과가 다른 행
  const scale = buildScale(rows)
  rows.forEach(row => {
    const others = rows.filter(other => other.id !== row.id)
    const neighbors = nearest(row, others, SUSPICIOUS_NEIGHBORS, scale)
    if (neighbors.length < SUSPICIOUS_NEIGHBORS) return
    const expected = majorityLabel(neighbors)
    if (expected !== row.label) {
      issues.push({
        rowId: row.id,
        field: 'label',
        kind: 'suspiciousLabel',
        reason: `비슷한 사례 ${SUSPICIOUS_NEIGHBORS}개는 대부분 '${expected}'입니다.`,
      })
    }
  })

  const groupCounts: Record<SupportGroup, number> = { A: 0, B: 0 }
  const labelCounts: Record<Label, number> = { 추천: 0, 보류: 0 }
  rows.forEach(row => {
    groupCounts[row.group] += 1
    labelCounts[row.label] += 1
  })

  return {
    issues,
    missingCount: issues.filter(issue => issue.kind === 'missing').length,
    outlierCount: issues.filter(issue => issue.kind === 'outlier').length,
    duplicateCount: issues.filter(issue => issue.kind === 'duplicate').length,
    suspiciousLabelCount: issues.filter(issue => issue.kind === 'suspiciousLabel').length,
    groupCounts,
    labelCounts,
  }
}

export interface PreprocessResult {
  rows: Student[]
  /** 정규화를 적용했는지 여부. k-NN 거리 계산에 그대로 전달합니다. */
  normalized: boolean
  /** 학습에서 제외한 특성 */
  excluded: Set<FeatureKey>
  /** 학생에게 보여 줄 처리 요약 */
  log: string[]
  /** 처리 후 학습이 불가능해졌다면 그 이유 */
  blockedReason: string | null
}

/** 선택한 전처리 카드를 순서대로 적용합니다. 원본 배열은 바꾸지 않습니다. */
export function applyPreprocess(source: Student[], selected: Set<PreprocessId>): PreprocessResult {
  let rows = source.map(row => ({ ...row }))
  const log: string[] = []

  if (selected.has('dropDuplicates')) {
    const seen = new Set<string>()
    const before = rows.length
    rows = rows.filter(row => {
      const signature = rowSignature(row)
      if (seen.has(signature)) return false
      seen.add(signature)
      return true
    })
    log.push(`중복 ${before - rows.length}줄을 지웠습니다.`)
  }

  if (selected.has('clampOutliers')) {
    let changed = 0
    rows = rows.map(row => {
      const next = { ...row }
      NUMERIC_FIELDS.forEach(field => {
        const value = next[field]
        if (isMissing(value)) return
        const range = VALID_RANGE[field]
        if ((value as number) > range.max) {
          next[field] = range.max
          changed += 1
        } else if ((value as number) < range.min) {
          next[field] = range.min
          changed += 1
        }
      })
      return next
    })
    log.push(`범위를 벗어난 값 ${changed}개를 정상 범위로 되돌렸습니다.`)
  }

  if (selected.has('dropMissingRows')) {
    const before = rows.length
    rows = rows.filter(
      row =>
        !isMissing(row.quizScore) &&
        !isMissing(row.priorActivities) &&
        !isMissing(row.availableHours) &&
        !isMissing(row.interest)
    )
    log.push(`빈칸이 있는 ${before - rows.length}줄을 학습에서 뺐습니다.`)
  }

  if (selected.has('fillNumericMean')) {
    let filled = 0
    NUMERIC_FIELDS.forEach(field => {
      const values = rows
        .map(row => row[field])
        .filter((value): value is number => !isMissing(value))
      if (values.length === 0) return
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length
      const rounded = Math.round(mean * 10) / 10
      rows = rows.map(row => {
        if (!isMissing(row[field])) return row
        filled += 1
        const next = { ...row }
        next[field] = rounded
        return next
      })
    })
    if (filled > 0) log.push(`비어 있던 숫자 칸 ${filled}개를 평균으로 채웠습니다.`)
  }

  if (selected.has('fillCategoryMode')) {
    const counts = new Map<Interest, number>()
    rows.forEach(row => {
      if (row.interest) counts.set(row.interest, (counts.get(row.interest) ?? 0) + 1)
    })
    let mode: Interest | null = null
    let best = -1
    for (const [key, count] of Array.from(counts.entries())) {
      if (count > best) {
        best = count
        mode = key
      }
    }
    if (mode !== null) {
      const fillValue: Interest = mode
      let filled = 0
      rows = rows.map(row => {
        if (row.interest) return row
        filled += 1
        return { ...row, interest: fillValue }
      })
      if (filled > 0) log.push(`비어 있던 관심 분야 ${filled}개를 '${fillValue}'로 채웠습니다.`)
    }
  }

  const excluded = new Set<FeatureKey>()
  if (selected.has('dropProxyFeature')) {
    excluded.add('priorActivities')
    log.push('사전 활동 횟수를 학습에서 뺐습니다. 남은 특성만으로 판단합니다.')
  }

  if (selected.has('fixSuspiciousLabels')) {
    const scale = buildScale(rows)
    let fixed = 0
    const snapshot = rows.map(row => ({ ...row }))
    rows = rows.map(row => {
      const others = snapshot.filter(other => other.id !== row.id)
      const neighbors = nearest(row, others, SUSPICIOUS_NEIGHBORS, scale, excluded)
      if (neighbors.length < SUSPICIOUS_NEIGHBORS) return row
      const expected = majorityLabel(neighbors)
      if (expected === row.label) return row
      fixed += 1
      return { ...row, label: expected }
    })
    if (fixed > 0) log.push(`이웃과 결과가 달랐던 ${fixed}줄의 기록을 바꿨습니다.`)
  }

  if (selected.has('resampleMinority')) {
    const groupA = rows.filter(row => row.group === 'A')
    const groupB = rows.filter(row => row.group === 'B')
    const minority = groupA.length < groupB.length ? groupA : groupB
    const majority = groupA.length < groupB.length ? groupB : groupA
    if (minority.length > 0 && minority.length < majority.length) {
      const need = majority.length - minority.length
      const copies: Student[] = []
      for (let i = 0; i < need; i += 1) {
        const origin = minority[i % minority.length]
        copies.push({ ...origin, id: `${origin.id}-복제${Math.floor(i / minority.length) + 1}` })
      }
      rows = [...rows, ...copies]
      log.push(`수가 적던 ${minority[0].group} 그룹을 ${need}줄 복제해 양쪽 수를 맞췄습니다.`)
    }
  }

  let blockedReason: string | null = null
  if (rows.length === 0) {
    blockedReason = '학습에 쓸 데이터가 한 줄도 남지 않았습니다. 전처리를 하나 해제해 보세요.'
  } else {
    const labels = new Set(rows.map(row => row.label))
    if (labels.size < 2) {
      blockedReason =
        '남은 데이터의 결과가 한 종류뿐이라 모델이 구분을 배울 수 없습니다. 전처리를 하나 해제해 보세요.'
    }
  }

  return { rows, normalized: selected.has('normalize'), excluded, log, blockedReason }
}

/** 교육용 k-NN 분류. 훈련 데이터에서 가장 가까운 k개의 이웃에게 물어봅니다. */
export function knnPredict(
  train: Student[],
  test: Student[],
  k: number,
  normalized: boolean,
  excluded: ReadonlySet<FeatureKey> = NO_EXCLUSION
): Label[] {
  const scale = normalized ? buildScale(train) : null
  return test.map(target => {
    const neighbors = nearest(target, train, k, scale, excluded)
    if (neighbors.length === 0) return '보류'
    return majorityLabel(neighbors)
  })
}

function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator
}

/** '추천'을 양성으로 두고 성능을 계산합니다. */
export function evaluate(test: Student[], predicted: Label[]): Metrics {
  const matrix: ConfusionMatrix = {
    truePositive: 0,
    falsePositive: 0,
    trueNegative: 0,
    falseNegative: 0,
  }
  const groupHit: Record<SupportGroup, { hit: number; total: number }> = {
    A: { hit: 0, total: 0 },
    B: { hit: 0, total: 0 },
  }

  test.forEach((row, index) => {
    const guess = predicted[index]
    const actual = row.label

    if (actual === '추천') {
      groupHit[row.group].total += 1
      if (guess === '추천') {
        matrix.truePositive += 1
        groupHit[row.group].hit += 1
      } else {
        matrix.falseNegative += 1
      }
    } else if (guess === '추천') {
      matrix.falsePositive += 1
    } else {
      matrix.trueNegative += 1
    }
  })

  const correct = matrix.truePositive + matrix.trueNegative
  const total = test.length
  const recallA = safeDivide(groupHit.A.hit, groupHit.A.total)
  const recallB = safeDivide(groupHit.B.hit, groupHit.B.total)

  return {
    accuracy: safeDivide(correct, total),
    precision: safeDivide(matrix.truePositive, matrix.truePositive + matrix.falsePositive),
    recall: safeDivide(matrix.truePositive, matrix.truePositive + matrix.falseNegative),
    matrix,
    correct,
    total,
    recallByGroup: { A: recallA, B: recallB },
    recallGap: Math.abs(recallA - recallB),
    missedByGroup: {
      A: { missed: groupHit.A.total - groupHit.A.hit, shouldRecommend: groupHit.A.total },
      B: { missed: groupHit.B.total - groupHit.B.hit, shouldRecommend: groupHit.B.total },
    },
  }
}

export function toPercent(value: number): number {
  return Math.round(value * 1000) / 10
}
