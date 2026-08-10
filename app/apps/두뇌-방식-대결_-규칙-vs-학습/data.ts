/**
 * 제타-7 식물원 가상 데이터.
 * 실제 생물·사람 정보가 아니며, 규칙 vs 학습을 비교하기 위한 교육용 설정입니다.
 */
import type { FeatureMeta, Label, Plant, Rule, SoilHue } from './types'

export const DATA_SEED = 20260810
export const DATA_VERSION = '1.0.0'

export const SOIL_OPTIONS: SoilHue[] = ['보라', '청록', '황금']
export const LABEL_OPTIONS: Label[] = ['식용', '독성']

export const FEATURE_META: FeatureMeta[] = [
  {
    key: 'glow',
    label: '잎빛 세기',
    meaning: '잎이 스스로 빛나는 정도',
    range: '0 ~ 10',
    kind: 'number',
  },
  {
    key: 'spikes',
    label: '가시 개수',
    meaning: '줄기에 난 가시의 수',
    range: '0 ~ 8',
    kind: 'number',
  },
  {
    key: 'height',
    label: '키(손뼘)',
    meaning: '손뼘으로 잰 키',
    range: '1 ~ 20',
    kind: 'number',
  },
  {
    key: 'nectar',
    label: '꿀 달콤함',
    meaning: '꿀맛이 얼마나 달콤한지',
    range: '0 ~ 10',
    kind: 'number',
  },
  {
    key: 'soil',
    label: '토양 빛깔',
    meaning: '식물이 자란 흙의 빛깔',
    range: '보라 / 청록 / 황금',
    kind: 'category',
  },
]

export const FEATURE_LABEL: Record<string, string> = {
  glow: '잎빛 세기',
  spikes: '가시 개수',
  height: '키(손뼘)',
  nectar: '꿀 달콤함',
  soil: '토양 빛깔',
  label: '안전성',
}

/**
 * 데이터 생성에 쓰는 '진짜 기준'.
 * 학생에게는 숨기고, 규칙·학습이 이 기준을 얼마나 잘 따라가는지 평가합니다.
 */
export function trueLabel(plant: Pick<Plant, 'glow' | 'spikes' | 'height' | 'nectar' | 'soil'>): Label {
  const spikes = plant.spikes ?? 0
  const nectar = plant.nectar ?? 0
  const glow = plant.glow ?? 0
  const height = plant.height ?? 10
  const soil = plant.soil

  if (spikes >= 5) return '독성'
  if (soil === '황금' && nectar <= 2) return '독성'
  if (nectar >= 6 && glow >= 4) return '식용'
  if (height <= 3) return '독성'
  if (glow >= 7 && spikes <= 1) return '식용'
  return '독성'
}

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

const NAME_POOL = [
  '루멘잎',
  '가시덩굴',
  '안개열매',
  '청록줄기',
  '황금꽃',
  '보라버섯',
  '별빛풀',
  '수정가시',
  '달콤이끼',
  '서리꽃',
  '노을잎',
  '운석열매',
  '수정덩굴',
  '은빛촉수',
  '모래꽃',
  '오로라풀',
  '크리스탈잎',
  '안개가시',
  '무지개줄기',
  '심해꽃',
]

function makePlant(
  rng: () => number,
  id: string,
  name: string,
  overrides?: Partial<Plant>
): Plant {
  const base: Plant = {
    id,
    name,
    glow: randomInt(rng, 0, 10),
    spikes: randomInt(rng, 0, 8),
    height: randomInt(rng, 1, 20),
    nectar: randomInt(rng, 0, 10),
    soil: SOIL_OPTIONS[randomInt(rng, 0, SOIL_OPTIONS.length - 1)],
    label: '식용',
  }
  const plant = { ...base, ...overrides }
  plant.label = trueLabel(plant)
  return plant
}

/** 초급에서 미리 보여 주는 IF-THEN 규칙 */
export const DEFAULT_RULES: Rule[] = [
  {
    id: 'R1',
    feature: 'spikes',
    op: '>=',
    value: 5,
    label: '독성',
    priority: 1,
    enabled: true,
  },
  {
    id: 'R2',
    feature: 'nectar',
    op: '>=',
    value: 6,
    label: '식용',
    priority: 2,
    enabled: true,
  },
  {
    id: 'R3',
    feature: 'height',
    op: '<=',
    value: 3,
    label: '독성',
    priority: 3,
    enabled: true,
  },
  {
    id: 'R4',
    feature: 'glow',
    op: '>=',
    value: 7,
    label: '식용',
    priority: 4,
    enabled: true,
  },
]

/** 초급에서 두 로봇에게 물어볼 고정 사례 */
export const BEGINNER_CASES: Plant[] = [
  {
    id: 'Q01',
    name: '반짝이끼',
    glow: 8,
    spikes: 1,
    height: 12,
    nectar: 3,
    soil: '청록',
    label: trueLabel({ glow: 8, spikes: 1, height: 12, nectar: 3, soil: '청록' }),
  },
  {
    id: 'Q02',
    name: '가시방패',
    glow: 4,
    spikes: 6,
    height: 9,
    nectar: 7,
    soil: '보라',
    label: trueLabel({ glow: 4, spikes: 6, height: 9, nectar: 7, soil: '보라' }),
  },
  {
    id: 'Q03',
    name: '달콤난쟁이',
    glow: 5,
    spikes: 2,
    height: 2,
    nectar: 8,
    soil: '황금',
    label: trueLabel({ glow: 5, spikes: 2, height: 2, nectar: 8, soil: '황금' }),
  },
  {
    id: 'Q04',
    name: '옅은안개',
    glow: 2,
    spikes: 3,
    height: 11,
    nectar: 4,
    soil: '보라',
    label: trueLabel({ glow: 2, spikes: 3, height: 11, nectar: 4, soil: '보라' }),
  },
]

/** k-NN이 배울 기본 훈련 예시 */
export function buildTrainingSet(): Plant[] {
  const rng = makeRng(DATA_SEED)
  const rows: Plant[] = []
  for (let i = 0; i < 18; i += 1) {
    rows.push(makePlant(rng, `T${String(i + 1).padStart(2, '0')}`, NAME_POOL[i % NAME_POOL.length]))
  }
  // 초급·중급에서 직관적으로 읽히도록 대표 사례를 몇 개 고정합니다.
  const anchors: Plant[] = [
    {
      id: 'T19',
      name: '안전루멘',
      glow: 9,
      spikes: 0,
      height: 14,
      nectar: 7,
      soil: '청록',
      label: '식용',
    },
    {
      id: 'T20',
      name: '위험가시',
      glow: 3,
      spikes: 7,
      height: 8,
      nectar: 2,
      soil: '보라',
      label: '독성',
    },
    {
      id: 'T21',
      name: '달콤황금',
      glow: 6,
      spikes: 1,
      height: 10,
      nectar: 9,
      soil: '황금',
      label: '식용',
    },
    {
      id: 'T22',
      name: '쓴황금',
      glow: 4,
      spikes: 2,
      height: 7,
      nectar: 1,
      soil: '황금',
      label: '독성',
    },
  ]
  return [...rows, ...anchors.map(row => ({ ...row, label: trueLabel(row) }))]
}

/** 중·고급에서 비교에 쓰는 시험 사례 (결측 포함) */
export function buildTestSet(): Plant[] {
  const rng = makeRng(DATA_SEED + 991)
  const rows: Plant[] = []
  for (let i = 0; i < 12; i += 1) {
    rows.push(
      makePlant(rng, `E${String(i + 1).padStart(2, '0')}`, `${NAME_POOL[(i + 5) % NAME_POOL.length]}·시험`)
    )
  }
  // 결측 사례: 고급에서 결측 정책을 실험합니다.
  rows.push({
    id: 'E13',
    name: '기록누락·가시',
    glow: 5,
    spikes: null,
    height: 9,
    nectar: 6,
    soil: '보라',
    label: '식용',
  })
  rows.push({
    id: 'E14',
    name: '기록누락·토양',
    glow: 3,
    spikes: 2,
    height: 4,
    nectar: 3,
    soil: null,
    label: trueLabel({ glow: 3, spikes: 2, height: 4, nectar: 3, soil: '보라' }),
  })
  return rows
}

/** 빈 규칙 템플릿 */
export function createEmptyRule(index: number): Rule {
  return {
    id: `R${Date.now().toString(36)}${index}`,
    feature: 'spikes',
    op: '>=',
    value: 5,
    label: '독성',
    priority: index + 1,
    enabled: true,
  }
}

/** 훈련 예시 한 줄 템플릿 */
export function createEmptyPlant(index: number): Plant {
  return {
    id: `U${index + 1}`,
    name: `새식물${index + 1}`,
    glow: 5,
    spikes: 2,
    height: 10,
    nectar: 5,
    soil: '청록',
    label: '식용',
  }
}
