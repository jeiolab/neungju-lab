/** 창작 콘텐츠 카드의 장르 */
export type Genre = '모험' | '과학' | '음악' | '스포츠' | '이야기' | '퍼즐'

/** 분위기 */
export type Mood = '밝음' | '잔잔' | '긴장' | '유쾌'

/** 좋아요 / 보통 / 싫어요. null이면 아직 평가하지 않음 */
export type RatingValue = 1 | 0 | -1

export type RecommendMethod = 'popularity' | 'content' | 'collaborative'

/** 가상의 창작 콘텐츠 한 장 */
export interface ContentItem {
  id: string
  title: string
  genre: Genre
  mood: Mood
  /** 분 단위 길이 */
  lengthMin: number
  /** 1(쉬움) ~ 5(어려움) */
  difficulty: number
  year: number
  /** 0~1. 교육용으로 정한 인기도 */
  popularity: number
  blurb: string
}

/** 가상 사용자. 실제 계정과 무관합니다. */
export interface VirtualUser {
  id: string
  label: string
  /** 콘텐츠 id → 평가 */
  ratings: Record<string, RatingValue>
}

export interface ScoredItem {
  item: ContentItem
  score: number
  /** 학생에게 보여 줄 추천 이유 */
  reason: string
  /** 중·고급에서 펼쳐 보는 데이터 근거 */
  evidence: string[]
  /** 고급: 계산에 쓴 유사도 숫자 */
  similarity?: number
  /** 이웃 사용자 id (협업 필터링) */
  neighbors?: string[]
}

export interface RecommendMetrics {
  /** 상위 추천의 평균 예상 선호도 (0~1) */
  relevance: number
  /** 장르 다양성 (고유 장르 수 / 목록 길이) */
  diversity: number
  /** 새로움: 인기도가 낮은 항목 비율 */
  novelty: number
  /** 전체 카탈로그 대비 추천에 올라온 항목 비율 */
  coverage: number
  /** 목록에 등장한 고유 장르 수 */
  genreCount: number
}

export interface NeighborInfo {
  userId: string
  label: string
  similarity: number
  sharedCount: number
}

/** 필터 버블 미션 목표 */
export interface BubbleMission {
  /** 예상 선호도 하한 */
  minRelevance: number
  /** 장르 다양성 하한 */
  minDiversity: number
}
