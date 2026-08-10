/**
 * 규칙 엔진과 k-NN 판별.
 * 화면과 분리된 순수 함수라 같은 입력이면 언제나 같은 결과가 나옵니다.
 */
import { FEATURE_LABEL } from './data'
import type {
  CaseComparison,
  CompareMetrics,
  CompareOp,
  ConflictPolicy,
  FeatureKey,
  KnnPrediction,
  Label,
  MissingPolicy,
  NeighborInfo,
  Plant,
  Rule,
  RulePrediction,
  RuleTraceStep,
  SoilHue,
} from './types'

const NUMERIC_KEYS: Array<Exclude<FeatureKey, 'soil'>> = ['glow', 'spikes', 'height', 'nectar']

function isMissing(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

function formatValue(value: number | SoilHue | null | undefined): string {
  if (isMissing(value)) return '(없음)'
  return String(value)
}

function describeRule(rule: Rule): string {
  return `IF ${FEATURE_LABEL[rule.feature]} ${rule.op} ${rule.value} THEN ${rule.label}`
}

function compareValues(
  left: number | SoilHue,
  op: CompareOp,
  right: number | SoilHue
): boolean {
  if (typeof left === 'string' || typeof right === 'string') {
    const a = String(left)
    const b = String(right)
    if (op === '==') return a === b
    if (op === '!=') return a !== b
    return false
  }
  switch (op) {
    case '>=':
      return left >= right
    case '<=':
      return left <= right
    case '>':
      return left > right
    case '<':
      return left < right
    case '==':
      return left === right
    case '!=':
      return left !== right
    default:
      return false
  }
}

function getFeature(plant: Plant, key: FeatureKey): number | SoilHue | null {
  return plant[key]
}

/**
 * 활성 규칙을 우선순위 순으로 정렬합니다.
 * firstMatch는 목록 순서(우선순위 숫자)를 그대로 따릅니다.
 */
function sortedRules(rules: Rule[]): Rule[] {
  return rules
    .filter(rule => rule.enabled)
    .slice()
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
}

/** 규칙 기반 판별. 경로와 설명을 함께 반환합니다. */
export function predictWithRules(
  plant: Plant,
  rules: Rule[],
  conflictPolicy: ConflictPolicy = 'firstMatch',
  missingPolicy: MissingPolicy = 'skipRule',
  defaultLabel: Label = '독성'
): RulePrediction {
  const ordered = sortedRules(rules)
  const path: RuleTraceStep[] = []
  const matched: Rule[] = []

  for (const rule of ordered) {
    const raw = getFeature(plant, rule.feature)

    if (isMissing(raw)) {
      if (missingPolicy === 'failSafeToxic') {
        path.push({
          ruleId: rule.id,
          matched: true,
          skippedMissing: true,
          description: `${describeRule(rule)} → 값이 비어 있어 안전을 위해 '독성'으로 판단`,
        })
        return {
          label: '독성',
          path,
          explanation: `${plant.name}: 특성 값이 비어 있어 결측 정책(안전 우선)으로 '독성'입니다.`,
          conflictNote: '결측 때문에 나머지 규칙은 보지 않았습니다.',
        }
      }
      if (missingPolicy === 'useDefault') {
        path.push({
          ruleId: rule.id,
          matched: false,
          skippedMissing: true,
          description: `${describeRule(rule)} → 값 없음, 기본값 '${defaultLabel}' 후보로 넘김`,
        })
        continue
      }
      // skipRule
      path.push({
        ruleId: rule.id,
        matched: false,
        skippedMissing: true,
        description: `${describeRule(rule)} → 값이 비어 건너뜀`,
      })
      continue
    }

    const hit = compareValues(raw as number | SoilHue, rule.op, rule.value)
    path.push({
      ruleId: rule.id,
      matched: hit,
      skippedMissing: false,
      description: `${describeRule(rule)} → ${hit ? '맞음' : '아님'} (실제 ${FEATURE_LABEL[rule.feature]}=${formatValue(raw)})`,
    })
    if (hit) matched.push(rule)

    if (conflictPolicy === 'firstMatch' && hit) {
      return {
        label: rule.label,
        path,
        explanation: `${plant.name}: 규칙 ${rule.id}이(가) 먼저 맞아 '${rule.label}'입니다. (${describeRule(rule)})`,
      }
    }
  }

  if (matched.length === 0) {
    const fallback = missingPolicy === 'useDefault' ? defaultLabel : null
    return {
      label: fallback,
      path,
      explanation:
        fallback === null
          ? `${plant.name}: 맞는 규칙이 없어 답을 내지 못했습니다.`
          : `${plant.name}: 맞는 규칙이 없어 기본값 '${fallback}'을(를) 씁니다.`,
    }
  }

  if (conflictPolicy === 'highestPriority') {
    const winner = matched[0]
    const note =
      matched.length > 1
        ? `맞은 규칙 ${matched.length}개 중 우선순위가 가장 높은 ${winner.id}을(를) 골랐습니다.`
        : undefined
    return {
      label: winner.label,
      path,
      explanation: `${plant.name}: ${describeRule(winner)} → '${winner.label}'`,
      conflictNote: note,
    }
  }

  // majorityVote
  const counts: Record<Label, number> = { 식용: 0, 독성: 0 }
  matched.forEach(rule => {
    counts[rule.label] += 1
  })
  let winnerLabel: Label = matched[0].label
  if (counts.식용 !== counts.독성) {
    winnerLabel = counts.식용 > counts.독성 ? '식용' : '독성'
  }
  return {
    label: winnerLabel,
    path,
    explanation: `${plant.name}: 맞은 규칙 ${matched.length}개의 다수결로 '${winnerLabel}' (식용 ${counts.식용} / 독성 ${counts.독성})`,
    conflictNote:
      matched.length > 1
        ? `충돌한 규칙: ${matched.map(rule => rule.id).join(', ')}`
        : undefined,
  }
}

function distance(a: Plant, b: Plant): number {
  let sum = 0
  let used = 0

  NUMERIC_KEYS.forEach(key => {
    const av = a[key]
    const bv = b[key]
    if (isMissing(av) || isMissing(bv)) return
    const span = key === 'height' ? 19 : key === 'spikes' ? 8 : 10
    const diff = ((av as number) - (bv as number)) / span
    sum += diff * diff
    used += 1
  })

  if (!isMissing(a.soil) && !isMissing(b.soil)) {
    sum += a.soil === b.soil ? 0 : 1
    used += 1
  }

  if (used === 0) return Number.POSITIVE_INFINITY
  return Math.sqrt(sum / used)
}

function majorityLabel(neighbors: NeighborInfo[]): Label | null {
  if (neighbors.length === 0) return null
  let edible = 0
  let toxic = 0
  neighbors.forEach(item => {
    if (item.plant.label === '식용') edible += 1
    else toxic += 1
  })
  if (edible > toxic) return '식용'
  if (toxic > edible) return '독성'
  return neighbors[0].plant.label
}

/** 학습 기반(k-NN) 판별. 이웃과 거리 설명을 함께 반환합니다. */
export function predictWithKnn(plant: Plant, train: Plant[], k: number): KnnPrediction {
  const neighbors = train
    .filter(row => row.id !== plant.id)
    .map(row => ({ plant: row, distance: distance(plant, row) }))
    .filter(item => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, Math.max(1, k))

  const label = majorityLabel(neighbors)
  if (neighbors.length === 0 || label === null) {
    return {
      label: null,
      neighbors: [],
      explanation: `${plant.name}: 비교할 학습 예시가 없습니다.`,
    }
  }

  const neighborText = neighbors
    .map(
      item =>
        `${item.plant.name}(${item.plant.label}, 거리 ${item.distance.toFixed(2)})`
    )
    .join(', ')

  return {
    label,
    neighbors,
    explanation: `${plant.name}: 가장 가까운 ${neighbors.length}개 이웃 → ${neighborText}. 다수결로 '${label}'.`,
  }
}

export function compareCase(
  plant: Plant,
  rules: Rule[],
  train: Plant[],
  k: number,
  conflictPolicy: ConflictPolicy = 'firstMatch',
  missingPolicy: MissingPolicy = 'skipRule'
): CaseComparison {
  const rule = predictWithRules(plant, rules, conflictPolicy, missingPolicy)
  const knn = predictWithKnn(plant, train, k)
  return {
    plant,
    rule,
    knn,
    agree: rule.label !== null && knn.label !== null && rule.label === knn.label,
  }
}

export function compareAll(
  cases: Plant[],
  rules: Rule[],
  train: Plant[],
  k: number,
  conflictPolicy: ConflictPolicy = 'firstMatch',
  missingPolicy: MissingPolicy = 'skipRule'
): CaseComparison[] {
  return cases.map(plant =>
    compareCase(plant, rules, train, k, conflictPolicy, missingPolicy)
  )
}

export function computeMetrics(comparisons: CaseComparison[]): CompareMetrics {
  const total = comparisons.length
  let agree = 0
  let ruleCorrect = 0
  let knnCorrect = 0
  let ruleAnswered = 0
  let knnAnswered = 0

  comparisons.forEach(item => {
    if (item.agree) agree += 1
    if (item.rule.label !== null) {
      ruleAnswered += 1
      if (item.rule.label === item.plant.label) ruleCorrect += 1
    }
    if (item.knn.label !== null) {
      knnAnswered += 1
      if (item.knn.label === item.plant.label) knnCorrect += 1
    }
  })

  return {
    total,
    agreementRate: total === 0 ? 0 : agree / total,
    ruleAccuracy: ruleAnswered === 0 ? 0 : ruleCorrect / ruleAnswered,
    knnAccuracy: knnAnswered === 0 ? 0 : knnCorrect / knnAnswered,
    disagreeCount: total - agree,
    ruleCorrect,
    knnCorrect,
  }
}

export function toPercent(value: number): number {
  return Math.round(value * 1000) / 10
}

/** 규칙 문장을 학생용 한글로 짧게 씁니다. */
export function ruleToSentence(rule: Rule): string {
  return describeRule(rule)
}

export function plantFeatureSummary(plant: Plant): string {
  return [
    `잎빛 ${formatValue(plant.glow)}`,
    `가시 ${formatValue(plant.spikes)}`,
    `키 ${formatValue(plant.height)}`,
    `꿀 ${formatValue(plant.nectar)}`,
    `토양 ${formatValue(plant.soil)}`,
  ].join(' · ')
}
