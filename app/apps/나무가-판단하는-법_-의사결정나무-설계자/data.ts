/**
 * 교육용 합성 데이터: 외계 생물 서식 환경 분류.
 * 실제 생물·사람 정보는 사용하지 않습니다.
 */
import type { Creature, FeatureKey, Habitat, QuestionCard } from './types'

export const DATA_SEED = 20260810
export const DATA_VERSION = '1.0.0'

export const HABITATS: Habitat[] = ['습한동굴', '건조사막', '빛나숲']

export const HABITAT_LABEL: Record<Habitat, string> = {
  습한동굴: '습한 동굴',
  건조사막: '건조한 사막',
  빛나숲: '빛나는 숲',
}

export const HABITAT_COLOR: Record<Habitat, string> = {
  습한동굴: 'bg-sky-100 text-sky-900 border-sky-200',
  건조사막: 'bg-amber-100 text-amber-900 border-amber-200',
  빛나숲: 'bg-emerald-100 text-emerald-900 border-emerald-200',
}

export const FEATURE_KEYS: FeatureKey[] = ['bodySize', 'antennae', 'glow', 'humidity', 'temp']

export const FEATURE_LABEL: Record<FeatureKey, string> = {
  bodySize: '몸길이',
  antennae: '더듬이 수',
  glow: '발광 세기',
  humidity: '선호 습도',
  temp: '선호 온도',
}

export const FEATURE_UNIT: Record<FeatureKey, string> = {
  bodySize: '칸',
  antennae: '개',
  glow: '단계',
  humidity: '단계',
  temp: '단계',
}

export const FEATURE_RANGE: Record<FeatureKey, { min: number; max: number; step: number }> = {
  bodySize: { min: 1, max: 10, step: 1 },
  antennae: { min: 0, max: 6, step: 1 },
  glow: { min: 0, max: 10, step: 1 },
  humidity: { min: 0, max: 10, step: 1 },
  temp: { min: 0, max: 10, step: 1 },
}

export const DATA_DICTIONARY: Array<{ field: string; meaning: string; range: string }> = [
  { field: '몸길이', meaning: '생물의 상대적 크기', range: '1 ~ 10칸' },
  { field: '더듬이 수', meaning: '머리에 달린 더듬이 개수', range: '0 ~ 6개' },
  { field: '발광 세기', meaning: '몸에서 나는 빛의 세기', range: '0 ~ 10단계' },
  { field: '선호 습도', meaning: '편안하게 느끼는 습도', range: '0 ~ 10단계' },
  { field: '선호 온도', meaning: '편안하게 느끼는 온도', range: '0 ~ 10단계' },
  { field: '서식 환경', meaning: '실제로 사는 곳(정답 레이블)', range: '습한 동굴 / 건조한 사막 / 빛나는 숲' },
]

/** 재현 가능한 난수 */
function makeRng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function randomInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

/**
 * 서식지를 정하는 '진짜 규칙'.
 * 학생에게는 숨기고, 질문·분할로 규칙을 찾아가게 합니다.
 * 약간의 잡음을 넣어 완벽한 분리가 어렵게 만듭니다.
 */
function trueHabitat(
  humidity: number,
  temp: number,
  glow: number,
  bodySize: number,
  rng: () => number
): Habitat {
  // 잡음: 약 8%는 규칙을 무시하고 임의 서식지
  if (rng() < 0.08) {
    return HABITATS[randomInt(rng, 0, 2)]
  }

  if (humidity >= 6 && temp <= 5) return '습한동굴'
  if (humidity <= 4 && temp >= 5) return '건조사막'
  if (glow >= 6 || (glow >= 4 && bodySize <= 5)) return '빛나숲'
  // 애매한 영역: 습도와 온도 우세로 결정
  if (humidity - temp >= 2) return '습한동굴'
  if (temp - humidity >= 2) return '건조사막'
  return '빛나숲'
}

function makeCreature(rng: () => number, id: string): Creature {
  const bodySize = randomInt(rng, 1, 10)
  const antennae = randomInt(rng, 0, 6)
  const glow = randomInt(rng, 0, 10)
  const humidity = randomInt(rng, 0, 10)
  const temp = randomInt(rng, 0, 10)
  return {
    id,
    bodySize,
    antennae,
    glow,
    humidity,
    temp,
    habitat: trueHabitat(humidity, temp, glow, bodySize, rng),
  }
}

function buildSet(seed: number, prefix: string, count: number): Creature[] {
  const rng = makeRng(seed)
  const rows: Creature[] = []
  for (let i = 0; i < count; i += 1) {
    rows.push(makeCreature(rng, `${prefix}${String(i + 1).padStart(2, '0')}`))
  }
  return rows
}

/** 훈련용 생물 (나무 학습·질문 순서 평가에 사용) */
export function buildTrainingSet(): Creature[] {
  return buildSet(DATA_SEED, 'T', 60)
}

/** 시험용 생물 (처음 보는 사례로 일반화 성능 측정) */
export function buildTestSet(): Creature[] {
  return buildSet(DATA_SEED + 991, 'E', 24)
}

/**
 * 초급용 질문 카드.
 * 임계값은 데이터 분포를 고려해 갈래가 비지 않도록 골랐습니다.
 */
export const QUESTION_CARDS: QuestionCard[] = [
  {
    id: 'q-humidity-6',
    prompt: '선호 습도가 6 이상인가요?',
    feature: 'humidity',
    threshold: 6,
    hint: '습한 곳에 사는 생물일수록 습도를 높게 선호합니다.',
  },
  {
    id: 'q-temp-5',
    prompt: '선호 온도가 5 이상인가요?',
    feature: 'temp',
    threshold: 5,
    hint: '더운 사막과 서늘한 동굴을 가르는 질문입니다.',
  },
  {
    id: 'q-glow-6',
    prompt: '발광 세기가 6 이상인가요?',
    feature: 'glow',
    threshold: 6,
    hint: '빛나는 숲 생물은 몸을 밝게 빛내는 경우가 많습니다.',
  },
  {
    id: 'q-size-5',
    prompt: '몸길이가 5 이상인가요?',
    feature: 'bodySize',
    threshold: 5,
    hint: '크기만으로는 서식지가 잘 갈리지 않을 수도 있습니다.',
  },
  {
    id: 'q-antennae-3',
    prompt: '더듬이가 3개 이상인가요?',
    feature: 'antennae',
    threshold: 3,
    hint: '더듬이 수는 서식지와 약한 관계만 있을 수 있습니다.',
  },
  {
    id: 'q-humidity-4',
    prompt: '선호 습도가 4 이상인가요?',
    feature: 'humidity',
    threshold: 4,
    hint: '습도 기준을 조금 낮춘 질문입니다.',
  },
]
