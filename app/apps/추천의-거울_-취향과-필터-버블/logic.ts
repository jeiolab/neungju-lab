/**
 * 추천 점수·유사도·지표 계산.
 * 화면과 분리된 순수 함수라 같은 입력이면 언제나 같은 결과가 나옵니다.
 */
import { CONTENT_CATALOG, GENRES, MIN_SHARED, TOP_N } from './data'
import type {
  ContentItem,
  Genre,
  Mood,
  NeighborInfo,
  RatingValue,
  RecommendMethod,
  RecommendMetrics,
  ScoredItem,
  VirtualUser,
} from './types'

const MOODS: Mood[] = ['밝음', '잔잔', '긴장', '유쾌']

/** 특성 벡터: 장르 one-hot + 분위기 one-hot + 정규화 길이·난이도·연도 */
export function itemFeatureVector(item: ContentItem): number[] {
  const genre = GENRES.map(g => (g === item.genre ? 1 : 0))
  const mood = MOODS.map(m => (m === item.mood ? 1 : 0))
  const length = item.lengthMin / 30
  const difficulty = item.difficulty / 5
  const year = (item.year - 2020) / 6
  return [...genre, ...mood, length, difficulty, year]
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i += 1) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

/** 좋아요·보통·싫어요를 가중치로 합쳐 선호 벡터를 만듭니다. */
export function buildPreferenceVector(
  ratings: Record<string, RatingValue>,
  catalog: ContentItem[] = CONTENT_CATALOG
): number[] | null {
  const dim = itemFeatureVector(catalog[0]).length
  const vec = new Array(dim).fill(0)
  let weightSum = 0

  Object.entries(ratings).forEach(([id, value]) => {
    if (value === 0) return
    const item = catalog.find(c => c.id === id)
    if (!item) return
    const features = itemFeatureVector(item)
    const weight = value === 1 ? 1 : -0.5
    features.forEach((v, i) => {
      vec[i] += v * weight
    })
    weightSum += Math.abs(weight)
  })

  if (weightSum === 0) return null
  return vec.map(v => v / weightSum)
}

function ratedIds(ratings: Record<string, RatingValue>): Set<string> {
  return new Set(Object.keys(ratings))
}

function scoreToUnit(score: number): number {
  // 예상 선호도를 0~1로 접습니다.
  return Math.max(0, Math.min(1, (score + 0.2) / 1.4))
}

/** 인기 기반: 아직 평가하지 않은 항목을 인기도 순으로 올립니다. */
export function recommendPopularity(
  ratings: Record<string, RatingValue>,
  catalog: ContentItem[] = CONTENT_CATALOG,
  topN = TOP_N
): ScoredItem[] {
  const seen = ratedIds(ratings)
  return catalog
    .filter(item => !seen.has(item.id))
    .map(item => ({
      item,
      score: item.popularity,
      reason: `많은 가상 사용자가 본 인기 콘텐츠입니다(인기도 ${(item.popularity * 100).toFixed(0)}%).`,
      evidence: [
        `인기도 점수: ${item.popularity.toFixed(2)}`,
        '개인 취향 벡터는 쓰지 않았습니다.',
        '이미 평가한 항목은 목록에서 뺐습니다.',
      ],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
}

/** 콘텐츠 기반: 선호 벡터와 항목 특성의 코사인 유사도 */
export function recommendContentBased(
  ratings: Record<string, RatingValue>,
  catalog: ContentItem[] = CONTENT_CATALOG,
  topN = TOP_N
): ScoredItem[] {
  const pref = buildPreferenceVector(ratings, catalog)
  const seen = ratedIds(ratings)
  if (!pref) return []

  const liked = Object.entries(ratings)
    .filter(([, v]) => v === 1)
    .map(([id]) => catalog.find(c => c.id === id)?.title)
    .filter((t): t is string => Boolean(t))

  return catalog
    .filter(item => !seen.has(item.id))
    .map(item => {
      const sim = cosineSimilarity(pref, itemFeatureVector(item))
      const likedGenres = liked.length > 0 ? liked.slice(0, 2).join(', ') : '좋아하는 카드'
      return {
        item,
        score: sim,
        similarity: Math.round(sim * 1000) / 1000,
        reason: `좋아요를 누른 카드(${likedGenres})와 장르·분위기 특성이 비슷합니다.`,
        evidence: [
          `코사인 유사도: ${sim.toFixed(3)}`,
          `장르 ${item.genre}, 분위기 ${item.mood}`,
          `길이 ${item.lengthMin}분, 난이도 ${item.difficulty}/5`,
          '선호 벡터는 좋아요(+1)·싫어요(-0.5) 가중 평균으로 만들었습니다.',
        ],
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
}

/** 두 사용자의 평점 벡터 코사인 유사도 (공통 항목 기준) */
export function userSimilarity(
  a: Record<string, RatingValue>,
  b: Record<string, RatingValue>
): { similarity: number; sharedCount: number } {
  const shared = Object.keys(a).filter(id => id in b)
  if (shared.length < MIN_SHARED) return { similarity: 0, sharedCount: shared.length }

  const va = shared.map(id => a[id])
  const vb = shared.map(id => b[id])
  return { similarity: cosineSimilarity(va, vb), sharedCount: shared.length }
}

export function findNeighbors(
  myRatings: Record<string, RatingValue>,
  users: VirtualUser[],
  k: number
): NeighborInfo[] {
  return users
    .map(user => {
      const { similarity, sharedCount } = userSimilarity(myRatings, user.ratings)
      return {
        userId: user.id,
        label: user.label,
        similarity,
        sharedCount,
      }
    })
    .filter(n => n.sharedCount >= MIN_SHARED && n.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k)
}

/**
 * 사용자 기반 협업 필터링.
 * 이웃이 높게 평가한 미평가 항목을 유사도 가중 평균으로 점수를 매깁니다.
 */
export function recommendCollaborative(
  ratings: Record<string, RatingValue>,
  users: VirtualUser[],
  k: number,
  catalog: ContentItem[] = CONTENT_CATALOG,
  topN = TOP_N
): ScoredItem[] {
  const neighbors = findNeighbors(ratings, users, k)
  const seen = ratedIds(ratings)
  if (neighbors.length === 0) return []

  const scores = new Map<string, { weighted: number; weight: number; voters: string[] }>()

  neighbors.forEach(neighbor => {
    const user = users.find(u => u.id === neighbor.userId)
    if (!user) return
    Object.entries(user.ratings).forEach(([itemId, value]) => {
      if (seen.has(itemId) || value <= 0) return
      const prev = scores.get(itemId) ?? { weighted: 0, weight: 0, voters: [] }
      prev.weighted += neighbor.similarity * value
      prev.weight += neighbor.similarity
      prev.voters.push(neighbor.label)
      scores.set(itemId, prev)
    })
  })

  const ranked: ScoredItem[] = []

  scores.forEach((agg, itemId) => {
    const item = catalog.find(c => c.id === itemId)
    if (!item || agg.weight === 0) return
    const score = agg.weighted / agg.weight
    const topVoters = agg.voters.slice(0, 3).join(', ')
    ranked.push({
      item,
      score,
      similarity: Math.round(score * 1000) / 1000,
      neighbors: neighbors.map(n => n.userId),
      reason: `나와 평가가 비슷한 이웃(${topVoters})이 좋아한 카드입니다.`,
      evidence: [
        `이웃 ${neighbors.length}명의 유사도 가중 평균: ${score.toFixed(3)}`,
        ...neighbors.slice(0, 3).map(
          n => `${n.label}: 유사도 ${n.similarity.toFixed(2)} (공통 ${n.sharedCount}개)`
        ),
        `최소 공통 평가 ${MIN_SHARED}개 이상인 이웃만 사용했습니다.`,
      ],
    })
  })

  return ranked.sort((a, b) => b.score - a.score).slice(0, topN)
}

/**
 * 다양성 슬라이더: 0이면 점수 순, 1에 가까울수록 아직 목록에 없는 장르를 우대합니다.
 * 교육용 재정렬이며 실제 상용 알고리즘 전체를 재현하지 않습니다.
 */
export function applyDiversityRerank(items: ScoredItem[], diversityWeight: number): ScoredItem[] {
  if (items.length === 0 || diversityWeight <= 0) return items

  const remaining = [...items]
  const picked: ScoredItem[] = []
  const usedGenres = new Set<Genre>()

  while (remaining.length > 0 && picked.length < items.length) {
    let bestIndex = 0
    let bestValue = Number.NEGATIVE_INFINITY

    remaining.forEach((candidate, index) => {
      const noveltyBonus = usedGenres.has(candidate.item.genre) ? 0 : 1
      const value = (1 - diversityWeight) * candidate.score + diversityWeight * noveltyBonus
      if (value > bestValue) {
        bestValue = value
        bestIndex = index
      }
    })

    const [chosen] = remaining.splice(bestIndex, 1)
    usedGenres.add(chosen.item.genre)
    picked.push({
      ...chosen,
      reason:
        diversityWeight >= 0.4 && !picked.some(p => p.item.genre === chosen.item.genre)
          ? `${chosen.reason} (다양성 슬라이더가 새 장르를 조금 더 올렸습니다.)`
          : chosen.reason,
    })
  }

  return picked
}

export function recommend(
  method: RecommendMethod,
  ratings: Record<string, RatingValue>,
  users: VirtualUser[],
  options: { k?: number; diversity?: number; topN?: number; catalog?: ContentItem[] } = {}
): ScoredItem[] {
  const { k = 3, diversity = 0, topN = TOP_N, catalog = CONTENT_CATALOG } = options
  let list: ScoredItem[]
  if (method === 'popularity') list = recommendPopularity(ratings, catalog, topN * 2)
  else if (method === 'content') list = recommendContentBased(ratings, catalog, topN * 2)
  else list = recommendCollaborative(ratings, users, k, catalog, topN * 2)

  return applyDiversityRerank(list, diversity).slice(0, topN)
}

export function computeMetrics(
  list: ScoredItem[],
  catalog: ContentItem[] = CONTENT_CATALOG
): RecommendMetrics {
  if (list.length === 0) {
    return { relevance: 0, diversity: 0, novelty: 0, coverage: 0, genreCount: 0 }
  }

  const relevance =
    list.reduce((sum, row) => sum + scoreToUnit(row.score), 0) / list.length
  const genres = new Set(list.map(row => row.item.genre))
  const diversity = genres.size / list.length
  const novelty =
    list.filter(row => row.item.popularity < 0.5).length / list.length
  const coverage = list.length / catalog.length

  return {
    relevance: Math.round(relevance * 1000) / 1000,
    diversity: Math.round(diversity * 1000) / 1000,
    novelty: Math.round(novelty * 1000) / 1000,
    coverage: Math.round(coverage * 1000) / 1000,
    genreCount: genres.size,
  }
}

/** 순위 변화 비교용: 이전 목록 대비 새 순위 */
export function rankChanges(
  before: ScoredItem[],
  after: ScoredItem[]
): Array<{ id: string; title: string; beforeRank: number | null; afterRank: number | null }> {
  const ids = new Set([...before.map(r => r.item.id), ...after.map(r => r.item.id)])
  return Array.from(ids).map(id => {
    const b = before.findIndex(r => r.item.id === id)
    const a = after.findIndex(r => r.item.id === id)
    const title =
      before.find(r => r.item.id === id)?.item.title ??
      after.find(r => r.item.id === id)?.item.title ??
      id
    return {
      id,
      title,
      beforeRank: b >= 0 ? b + 1 : null,
      afterRank: a >= 0 ? a + 1 : null,
    }
  })
}

export function ratingCount(ratings: Record<string, RatingValue>): number {
  return Object.keys(ratings).length
}

export function likedGenreCounts(
  ratings: Record<string, RatingValue>,
  catalog: ContentItem[] = CONTENT_CATALOG
): Record<Genre, number> {
  const counts = Object.fromEntries(GENRES.map(g => [g, 0])) as Record<Genre, number>
  Object.entries(ratings).forEach(([id, value]) => {
    if (value !== 1) return
    const item = catalog.find(c => c.id === id)
    if (item) counts[item.genre] += 1
  })
  return counts
}

/** 한 장르에 좋아요가 몰렸는지 (필터 버블 관찰용) */
export function isGenreConcentrated(ratings: Record<string, RatingValue>): boolean {
  const counts = likedGenreCounts(ratings)
  const likes = Object.values(counts).reduce((a, b) => a + b, 0)
  if (likes < 3) return false
  const max = Math.max(...Object.values(counts))
  return max / likes >= 0.75
}

export function toPercent(value: number): number {
  return Math.round(value * 1000) / 10
}

export function coldStartNote(ratings: Record<string, RatingValue>): string | null {
  const count = ratingCount(ratings)
  if (count === 0) {
    return '아직 평가가 없어 취향을 알 수 없습니다(콜드 스타트). 인기 기반만 쓸 수 있습니다.'
  }
  if (count < 2) {
    return '평가가 거의 없어 콘텐츠 기반·협업 필터링이 불안정합니다. 카드를 더 평가해 보세요.'
  }
  return null
}
