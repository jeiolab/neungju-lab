/**
 * 의사결정나무: 지니 불순도, 분할, 예측, 자동 성장.
 * 화면과 분리된 순수 함수입니다.
 */
import { FEATURE_KEYS, FEATURE_RANGE, HABITATS } from './data'
import type {
  AccuracyReport,
  Creature,
  FeatureKey,
  Habitat,
  HabitatCounts,
  NodeStats,
  QuestionCard,
  SplitCandidate,
  TreeNode,
} from './types'

let nextNodeSeq = 1

export function resetNodeIds(start = 1): void {
  nextNodeSeq = start
}

function newNodeId(): string {
  const id = `n${nextNodeSeq}`
  nextNodeSeq += 1
  return id
}

export function emptyCounts(): HabitatCounts {
  return { 습한동굴: 0, 건조사막: 0, 빛나숲: 0 }
}

export function countHabitats(rows: Creature[]): HabitatCounts {
  const counts = emptyCounts()
  rows.forEach(row => {
    counts[row.habitat] += 1
  })
  return counts
}

export function majorityHabitat(counts: HabitatCounts): Habitat {
  let best: Habitat = '빛나숲'
  let bestCount = -1
  HABITATS.forEach(habitat => {
    if (counts[habitat] > bestCount) {
      best = habitat
      bestCount = counts[habitat]
    }
  })
  return best
}

/** 지니 불순도. 한 종류만 있으면 0, 고르게 섞이면 커집니다. */
export function giniImpurity(counts: HabitatCounts): number {
  const total = HABITATS.reduce((sum, h) => sum + counts[h], 0)
  if (total === 0) return 0
  let sumSq = 0
  HABITATS.forEach(h => {
    const p = counts[h] / total
    sumSq += p * p
  })
  return 1 - sumSq
}

export function nodeStats(rows: Creature[]): NodeStats {
  const counts = countHabitats(rows)
  const total = rows.length
  return {
    counts,
    total,
    gini: giniImpurity(counts),
    majority: majorityHabitat(counts),
  }
}

export function goesLeft(creature: Creature, feature: FeatureKey, threshold: number): boolean {
  return creature[feature] >= threshold
}

/** 질문 카드 순서만으로 만든 '연쇄 나무'의 잎 예측을 학습합니다. */
export function buildChainFromQuestions(
  train: Creature[],
  questions: QuestionCard[]
): Map<string, Habitat> {
  // key: 'Y'/'N' 경로 문자열
  const buckets = new Map<string, Creature[]>()

  train.forEach(creature => {
    let path = ''
    questions.forEach(q => {
      path += goesLeft(creature, q.feature, q.threshold) ? 'Y' : 'N'
    })
    const list = buckets.get(path) ?? []
    list.push(creature)
    buckets.set(path, list)
  })

  const leafPredictions = new Map<string, Habitat>()
  buckets.forEach((rows, path) => {
    leafPredictions.set(path, nodeStats(rows).majority)
  })
  // 훈련에 없던 경로: 전체 다수 클래스
  const fallback = nodeStats(train).majority
  leafPredictions.set('__fallback__', fallback)
  return leafPredictions
}

export function predictWithQuestionChain(
  creature: Creature,
  questions: QuestionCard[],
  leafPredictions: Map<string, Habitat>
): Habitat {
  let path = ''
  questions.forEach(q => {
    path += goesLeft(creature, q.feature, q.threshold) ? 'Y' : 'N'
  })
  return leafPredictions.get(path) ?? leafPredictions.get('__fallback__') ?? '빛나숲'
}

export function evaluatePredictions(
  rows: Creature[],
  predicted: Habitat[]
): AccuracyReport {
  const byHabitat = {
    습한동굴: { correct: 0, total: 0 },
    건조사막: { correct: 0, total: 0 },
    빛나숲: { correct: 0, total: 0 },
  }
  let correct = 0
  rows.forEach((row, index) => {
    byHabitat[row.habitat].total += 1
    if (predicted[index] === row.habitat) {
      correct += 1
      byHabitat[row.habitat].correct += 1
    }
  })
  return {
    correct,
    total: rows.length,
    accuracy: rows.length === 0 ? 0 : correct / rows.length,
    byHabitat,
  }
}

export function evaluateQuestionOrder(
  train: Creature[],
  test: Creature[],
  questions: QuestionCard[]
): { train: AccuracyReport; test: AccuracyReport } {
  const leaves = buildChainFromQuestions(train, questions)
  const trainPred = train.map(c => predictWithQuestionChain(c, questions, leaves))
  const testPred = test.map(c => predictWithQuestionChain(c, questions, leaves))
  return {
    train: evaluatePredictions(train, trainPred),
    test: evaluatePredictions(test, testPred),
  }
}

/** 빈 뿌리만 있는 나무 */
export function createRootTree(train: Creature[]): { nodes: TreeNode[]; rootId: string } {
  resetNodeIds(1)
  const stats = nodeStats(train)
  const rootId = newNodeId()
  const root: TreeNode = {
    id: rootId,
    parentId: null,
    leftId: null,
    rightId: null,
    feature: null,
    threshold: null,
    prediction: stats.majority,
    depth: 0,
  }
  return { nodes: [root], rootId }
}

export function getNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  return nodes.find(n => n.id === id)
}

export function isLeaf(node: TreeNode): boolean {
  return node.leftId === null && node.rightId === null
}

/** 특정 노드에 도달하는 행만 걸러냅니다. */
export function rowsAtNode(
  rows: Creature[],
  nodes: TreeNode[],
  rootId: string,
  targetId: string
): Creature[] {
  const byId = new Map(nodes.map(n => [n.id, n]))
  return rows.filter(creature => {
    let current = byId.get(rootId)
    if (!current) return false
    while (current) {
      if (current.id === targetId) return true
      if (isLeaf(current) || current.feature === null || current.threshold === null) return false
      const nextId = goesLeft(creature, current.feature, current.threshold)
        ? current.leftId
        : current.rightId
      if (!nextId) return false
      current = byId.get(nextId)
    }
    return false
  })
}

export function predictOne(
  creature: Creature,
  nodes: TreeNode[],
  rootId: string
): Habitat {
  const byId = new Map(nodes.map(n => [n.id, n]))
  let current = byId.get(rootId)
  while (current) {
    if (isLeaf(current) || current.feature === null || current.threshold === null) {
      return current.prediction
    }
    const nextId = goesLeft(creature, current.feature, current.threshold)
      ? current.leftId
      : current.rightId
    if (!nextId) return current.prediction
    current = byId.get(nextId)
  }
  return '빛나숲'
}

export function evaluateTree(
  rows: Creature[],
  nodes: TreeNode[],
  rootId: string
): AccuracyReport {
  const predicted = rows.map(c => predictOne(c, nodes, rootId))
  return evaluatePredictions(rows, predicted)
}

/** 가능한 임계값 후보 (데이터에 나타나는 값) */
function thresholdCandidates(rows: Creature[], feature: FeatureKey): number[] {
  const values = Array.from(new Set(rows.map(r => r[feature]))).sort((a, b) => a - b)
  if (values.length <= 1) return []
  const candidates: number[] = []
  for (let i = 1; i < values.length; i += 1) {
    // 이상 갈래: 중간 경계의 위쪽 값을 임계값으로
    candidates.push(values[i])
  }
  return candidates
}

export function evaluateSplit(
  rows: Creature[],
  feature: FeatureKey,
  threshold: number
): SplitCandidate | null {
  if (rows.length === 0) return null
  const left: Creature[] = []
  const right: Creature[] = []
  rows.forEach(row => {
    if (goesLeft(row, feature, threshold)) left.push(row)
    else right.push(row)
  })
  if (left.length === 0 || right.length === 0) return null

  const before = giniImpurity(countHabitats(rows))
  const giniLeft = giniImpurity(countHabitats(left))
  const giniRight = giniImpurity(countHabitats(right))
  const giniAfter =
    (left.length / rows.length) * giniLeft + (right.length / rows.length) * giniRight

  return {
    feature,
    threshold,
    giniBefore: before,
    giniLeft,
    giniRight,
    giniAfter,
    improvement: before - giniAfter,
    leftCount: left.length,
    rightCount: right.length,
  }
}

/** 주어진 행에서 지니 개선이 가장 큰 분할을 찾습니다. */
export function findBestSplit(
  rows: Creature[],
  features: FeatureKey[] = FEATURE_KEYS
): SplitCandidate | null {
  let best: SplitCandidate | null = null
  features.forEach(feature => {
    thresholdCandidates(rows, feature).forEach(threshold => {
      const candidate = evaluateSplit(rows, feature, threshold)
      if (!candidate) return
      if (!best || candidate.improvement > best.improvement + 1e-12) {
        best = candidate
      } else if (
        best &&
        Math.abs(candidate.improvement - best.improvement) < 1e-12
      ) {
        // 동점이면 특성 이름·임계값으로 안정적으로 고름
        if (
          candidate.feature < best.feature ||
          (candidate.feature === best.feature && candidate.threshold < best.threshold)
        ) {
          best = candidate
        }
      }
    })
  })
  return best
}

/** 잎 노드에 분할을 추가합니다. */
export function addSplit(
  nodes: TreeNode[],
  rootId: string,
  train: Creature[],
  leafId: string,
  feature: FeatureKey,
  threshold: number
): TreeNode[] | null {
  const leaf = getNode(nodes, leafId)
  if (!leaf || !isLeaf(leaf)) return null

  const atLeaf = rowsAtNode(train, nodes, rootId, leafId)
  const leftRows = atLeaf.filter(r => goesLeft(r, feature, threshold))
  const rightRows = atLeaf.filter(r => !goesLeft(r, feature, threshold))
  if (leftRows.length === 0 || rightRows.length === 0) return null

  const leftId = newNodeId()
  const rightId = newNodeId()
  const leftStats = nodeStats(leftRows)
  const rightStats = nodeStats(rightRows)

  const next = nodes.map(n =>
    n.id === leafId
      ? {
          ...n,
          feature,
          threshold,
          leftId,
          rightId,
          prediction: nodeStats(atLeaf).majority,
        }
      : { ...n }
  )

  next.push(
    {
      id: leftId,
      parentId: leafId,
      leftId: null,
      rightId: null,
      feature: null,
      threshold: null,
      prediction: leftStats.majority,
      depth: leaf.depth + 1,
    },
    {
      id: rightId,
      parentId: leafId,
      leftId: null,
      rightId: null,
      feature: null,
      threshold: null,
      prediction: rightStats.majority,
      depth: leaf.depth + 1,
    }
  )
  return next
}

/** 잎을 다시 합쳐 가지치기합니다. */
export function pruneToLeaf(
  nodes: TreeNode[],
  nodeId: string,
  train: Creature[],
  rootId: string
): TreeNode[] {
  const target = getNode(nodes, nodeId)
  if (!target) return nodes

  const removeIds = new Set<string>()
  const collect = (id: string) => {
    const node = getNode(nodes, id)
    if (!node) return
    if (node.leftId) {
      removeIds.add(node.leftId)
      collect(node.leftId)
    }
    if (node.rightId) {
      removeIds.add(node.rightId)
      collect(node.rightId)
    }
  }
  collect(nodeId)

  const atNode = rowsAtNode(train, nodes, rootId, nodeId)
  const stats = nodeStats(atNode)

  return nodes
    .filter(n => !removeIds.has(n.id))
    .map(n =>
      n.id === nodeId
        ? {
            ...n,
            leftId: null,
            rightId: null,
            feature: null,
            threshold: null,
            prediction: stats.majority,
          }
        : n
    )
}

export interface GrowOptions {
  maxDepth: number
  minSamples: number
  /** 개선량이 이보다 작으면 분할하지 않음 */
  minImprovement: number
}

const DEFAULT_GROW: GrowOptions = {
  maxDepth: 4,
  minSamples: 3,
  minImprovement: 0.01,
}

/**
 * CART 스타일로 나무를 자동 성장시킵니다.
 * maxDepth를 크게 하면 훈련 성적은 좋아지지만 시험 성적이 떨어질 수 있습니다(과적합).
 */
export function autoGrowTree(
  train: Creature[],
  options: Partial<GrowOptions> = {}
): { nodes: TreeNode[]; rootId: string } {
  const opts = { ...DEFAULT_GROW, ...options }
  const { nodes: initial, rootId } = createRootTree(train)
  let nodes = initial

  const growLeaf = (leafId: string) => {
    const leaf = getNode(nodes, leafId)
    if (!leaf || !isLeaf(leaf)) return
    if (leaf.depth >= opts.maxDepth) return

    const atLeaf = rowsAtNode(train, nodes, rootId, leafId)
    if (atLeaf.length < opts.minSamples * 2) return
    const stats = nodeStats(atLeaf)
    if (stats.gini < 1e-9) return

    const best = findBestSplit(atLeaf)
    if (!best || best.improvement < opts.minImprovement) return
    if (best.leftCount < opts.minSamples || best.rightCount < opts.minSamples) return

    const grown = addSplit(nodes, rootId, train, leafId, best.feature, best.threshold)
    if (!grown) return
    nodes = grown

    const updated = getNode(nodes, leafId)
    if (updated?.leftId) growLeaf(updated.leftId)
    if (updated?.rightId) growLeaf(updated.rightId)
  }

  growLeaf(rootId)
  return { nodes, rootId }
}

/** 나무 깊이(가장 깊은 잎) */
export function treeDepth(nodes: TreeNode[]): number {
  return nodes.reduce((max, n) => Math.max(max, n.depth), 0)
}

export function leafCount(nodes: TreeNode[]): number {
  return nodes.filter(isLeaf).length
}

export function toPercent(value: number): number {
  return Math.round(value * 1000) / 10
}

export function formatGini(value: number): string {
  return (Math.round(value * 1000) / 1000).toFixed(3)
}

/** 중급 UI용: 선택한 특성의 슬라이더 기본값 */
export function defaultThreshold(feature: FeatureKey): number {
  const range = FEATURE_RANGE[feature]
  return Math.ceil((range.min + range.max) / 2)
}

/** 분할 후보를 개선량 순으로 상위 N개 */
export function topSplitCandidates(
  rows: Creature[],
  limit = 5
): SplitCandidate[] {
  const all: SplitCandidate[] = []
  FEATURE_KEYS.forEach(feature => {
    thresholdCandidates(rows, feature).forEach(threshold => {
      const candidate = evaluateSplit(rows, feature, threshold)
      if (candidate) all.push(candidate)
    })
  })
  return all
    .sort((a, b) => b.improvement - a.improvement)
    .slice(0, limit)
}
