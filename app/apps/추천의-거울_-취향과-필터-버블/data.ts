/**
 * 모두 교육용으로 만든 가상 데이터입니다.
 * 실제 계정·시청 기록·검색 기록과 무관합니다.
 */
import type { BubbleMission, ContentItem, Genre, VirtualUser } from './types'

export const DATA_SEED = 20260810
export const DATA_VERSION = '1.0.0'

/** 학생이 평가할 최소 카드 수 */
export const MIN_RATINGS = 4

/** 한 번에 보여 줄 추천 개수 */
export const TOP_N = 5

/** 협업 필터링에서 이웃으로 인정할 최소 공통 평가 수 */
export const MIN_SHARED = 2

export const GENRES: Genre[] = ['모험', '과학', '음악', '스포츠', '이야기', '퍼즐']

export const CONTENT_CATALOG: ContentItem[] = [
  {
    id: 'C01',
    title: '구름 위의 레이스',
    genre: '모험',
    mood: '밝음',
    lengthMin: 12,
    difficulty: 2,
    year: 2024,
    popularity: 0.92,
    blurb: '하늘을 나는 보트 경주에 도전하는 짧은 이야기입니다.',
  },
  {
    id: 'C02',
    title: '별똥별 실험실',
    genre: '과학',
    mood: '잔잔',
    lengthMin: 18,
    difficulty: 3,
    year: 2023,
    popularity: 0.55,
    blurb: '가상 실험실에서 별의 성분을 조사하는 탐구 카드입니다.',
  },
  {
    id: 'C03',
    title: '리듬 퍼레이드',
    genre: '음악',
    mood: '유쾌',
    lengthMin: 8,
    difficulty: 1,
    year: 2025,
    popularity: 0.88,
    blurb: '박자에 맞춰 발걸음을 맞추는 가벼운 리듬 게임입니다.',
  },
  {
    id: 'C04',
    title: '골대 뒤의 비밀',
    genre: '스포츠',
    mood: '긴장',
    lengthMin: 15,
    difficulty: 3,
    year: 2022,
    popularity: 0.7,
    blurb: '마지막 슛을 준비하는 순간을 따라가는 스포츠 이야기입니다.',
  },
  {
    id: 'C05',
    title: '도서관의 쪽지',
    genre: '이야기',
    mood: '잔잔',
    lengthMin: 20,
    difficulty: 2,
    year: 2021,
    popularity: 0.48,
    blurb: '책갈피 사이 쪽지를 따라 친구를 찾는 이야기입니다.',
  },
  {
    id: 'C06',
    title: '문양 맞추기: 고대 유적',
    genre: '퍼즐',
    mood: '긴장',
    lengthMin: 14,
    difficulty: 4,
    year: 2024,
    popularity: 0.4,
    blurb: '유적의 문양을 규칙에 맞게 맞추는 논리 퍼즐입니다.',
  },
  {
    id: 'C07',
    title: '심해 탐험 일지',
    genre: '모험',
    mood: '긴장',
    lengthMin: 22,
    difficulty: 4,
    year: 2023,
    popularity: 0.62,
    blurb: '잠수정으로 깊은 바다를 탐험하는 모험 카드입니다.',
  },
  {
    id: 'C08',
    title: '로봇의 하루',
    genre: '과학',
    mood: '유쾌',
    lengthMin: 10,
    difficulty: 2,
    year: 2025,
    popularity: 0.75,
    blurb: '배달 로봇이 하루 동안 겪는 작은 사건을 따라갑니다.',
  },
  {
    id: 'C09',
    title: '숲속 합주회',
    genre: '음악',
    mood: '잔잔',
    lengthMin: 16,
    difficulty: 2,
    year: 2022,
    popularity: 0.35,
    blurb: '자연 소리와 악기가 섞이는 합주 이야기입니다.',
  },
  {
    id: 'C10',
    title: '릴레이의 마지막 주자',
    genre: '스포츠',
    mood: '밝음',
    lengthMin: 11,
    difficulty: 2,
    year: 2024,
    popularity: 0.8,
    blurb: '바통을 이어받는 순간의 긴장과 응원을 담았습니다.',
  },
  {
    id: 'C11',
    title: '이삿날의 편지',
    genre: '이야기',
    mood: '잔잔',
    lengthMin: 17,
    difficulty: 1,
    year: 2020,
    popularity: 0.3,
    blurb: '이삿짐 상자에서 나온 오래된 편지를 읽는 이야기입니다.',
  },
  {
    id: 'C12',
    title: '암호 열차',
    genre: '퍼즐',
    mood: '유쾌',
    lengthMin: 13,
    difficulty: 3,
    year: 2025,
    popularity: 0.58,
    blurb: '정거장마다 암호를 풀어 목적지를 찾는 퍼즐입니다.',
  },
  {
    id: 'C13',
    title: '사막의 나침반',
    genre: '모험',
    mood: '잔잔',
    lengthMin: 19,
    difficulty: 3,
    year: 2021,
    popularity: 0.45,
    blurb: '별을 보고 방향을 찾는 사막 여행 이야기입니다.',
  },
  {
    id: 'C14',
    title: '날씨 예보 공작소',
    genre: '과학',
    mood: '밝음',
    lengthMin: 12,
    difficulty: 3,
    year: 2024,
    popularity: 0.5,
    blurb: '구름과 바람 데이터를 맞춰 날씨를 예측해 봅니다.',
  },
  {
    id: 'C15',
    title: '비트박스 교실',
    genre: '음악',
    mood: '밝음',
    lengthMin: 9,
    difficulty: 2,
    year: 2023,
    popularity: 0.68,
    blurb: '박자와 리듬 패턴을 조합해 짧은 곡을 만듭니다.',
  },
  {
    id: 'C16',
    title: '스케이트보드 코스',
    genre: '스포츠',
    mood: '유쾌',
    lengthMin: 10,
    difficulty: 3,
    year: 2025,
    popularity: 0.72,
    blurb: '가상의 공원 코스를 완주하는 스포츠 미니게임입니다.',
  },
  {
    id: 'C17',
    title: '달빛 서점',
    genre: '이야기',
    mood: '잔잔',
    lengthMin: 21,
    difficulty: 2,
    year: 2022,
    popularity: 0.28,
    blurb: '밤에만 문을 여는 서점에서 벌어지는 조용한 이야기입니다.',
  },
  {
    id: 'C18',
    title: '도형 정원',
    genre: '퍼즐',
    mood: '잔잔',
    lengthMin: 15,
    difficulty: 4,
    year: 2023,
    popularity: 0.33,
    blurb: '도형을 회전·배치해 정원을 완성하는 퍼즐입니다.',
  },
]

/**
 * 가상 사용자 12명의 평가.
 * 일부는 한 장르에 치우쳐 있어 필터 버블을 관찰하기 좋게 만들어 두었습니다.
 */
export const VIRTUAL_USERS: VirtualUser[] = [
  {
    id: 'U01',
    label: '모험 팬 A',
    ratings: {
      C01: 1, C07: 1, C13: 1, C04: 0, C03: -1, C06: 0, C08: 0, C10: 1,
    },
  },
  {
    id: 'U02',
    label: '모험 팬 B',
    ratings: {
      C01: 1, C07: 1, C13: 0, C16: 1, C05: -1, C09: -1, C02: 0, C10: 1,
    },
  },
  {
    id: 'U03',
    label: '과학 탐구가',
    ratings: {
      C02: 1, C08: 1, C14: 1, C06: 1, C01: 0, C03: -1, C11: 0, C18: 1,
    },
  },
  {
    id: 'U04',
    label: '과학·퍼즐형',
    ratings: {
      C02: 1, C06: 1, C12: 1, C18: 1, C14: 0, C04: -1, C09: 0, C08: 1,
    },
  },
  {
    id: 'U05',
    label: '음악 애호가',
    ratings: {
      C03: 1, C09: 1, C15: 1, C05: 0, C01: -1, C07: -1, C11: 1, C17: 0,
    },
  },
  {
    id: 'U06',
    label: '리듬·스포츠형',
    ratings: {
      C03: 1, C15: 1, C04: 1, C10: 1, C16: 1, C02: 0, C17: -1, C06: 0,
    },
  },
  {
    id: 'U07',
    label: '스포츠 팬',
    ratings: {
      C04: 1, C10: 1, C16: 1, C01: 0, C07: 1, C09: -1, C05: 0, C03: 0,
    },
  },
  {
    id: 'U08',
    label: '이야기 수집가',
    ratings: {
      C05: 1, C11: 1, C17: 1, C09: 1, C13: 0, C04: -1, C12: 0, C15: 0,
    },
  },
  {
    id: 'U09',
    label: '퍼즐 마니아',
    ratings: {
      C06: 1, C12: 1, C18: 1, C02: 1, C14: 0, C03: -1, C10: -1, C08: 0,
    },
  },
  {
    id: 'U10',
    label: '골고루형',
    ratings: {
      C01: 1, C02: 0, C03: 1, C05: 1, C08: 0, C12: 1, C16: 0, C17: 1,
    },
  },
  {
    id: 'U11',
    label: '인기작 위주',
    ratings: {
      C01: 1, C03: 1, C10: 1, C08: 1, C16: 1, C04: 0, C11: -1, C18: -1,
    },
  },
  {
    id: 'U12',
    label: '잔잔한 취향',
    ratings: {
      C05: 1, C09: 1, C11: 1, C17: 1, C13: 1, C02: 0, C04: -1, C16: -1,
    },
  },
]

/** 학생이 쓰는 익명 프로필 id */
export const ME_ID = 'ME'

export const BUBBLE_MISSION: BubbleMission = {
  minRelevance: 0.45,
  minDiversity: 0.6,
}

/** 개인정보 최소화 활동용 카드 */
export const PRIVACY_ITEMS: Array<{ id: string; label: string; needed: boolean; hint: string }> = [
  { id: 'genreLike', label: '좋아하는 장르', needed: true, hint: '취향을 파악하는 데 직접 쓰입니다.' },
  { id: 'ratings', label: '콘텐츠 좋아요·싫어요', needed: true, hint: '추천 점수를 계산하는 핵심 입력입니다.' },
  { id: 'realName', label: '실명과 학번', needed: false, hint: '추천 계산에는 필요하지 않습니다.' },
  { id: 'phone', label: '휴대전화 번호', needed: false, hint: '연락처는 취향과 무관합니다.' },
  { id: 'gps', label: '실시간 위치', needed: false, hint: '이 실험의 추천에는 쓰이지 않습니다.' },
  { id: 'friendList', label: '친구 목록 전체', needed: false, hint: '비슷한 취향 이웃만 익명으로 있으면 충분합니다.' },
]

export const METHOD_LABEL: Record<string, string> = {
  popularity: '인기 기반',
  content: '콘텐츠 기반',
  collaborative: '협업 필터링',
}

export const RATING_LABEL: Record<string, string> = {
  '1': '좋아요',
  '0': '보통',
  '-1': '싫어요',
}
