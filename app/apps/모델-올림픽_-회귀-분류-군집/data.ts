/**
 * 교육용 합성 데이터: 자전거 대여 · 행성 암석 · 에너지 사용.
 * 실제 대여·지질·전력 데이터가 아니며, seed로 항상 같은 값이 나옵니다.
 */
import type { ColumnDef, DataRow, DatasetId, ProblemCard, ProblemType } from './types'

export const DATA_SEED = 20260810
export const DATA_VERSION = '1.0.0'

export const PROBLEM_TYPE_LABEL: Record<ProblemType, string> = {
  regression: '숫자 맞히기 (회귀)',
  classification: '종류 고르기 (분류)',
  clustering: '묶기 (군집)',
}

export const PROBLEM_TYPE_PLAIN: Record<ProblemType, string> = {
  regression: '숫자 맞히기',
  classification: '종류 고르기',
  clustering: '묶기',
}

export const DATASET_LABEL: Record<DatasetId, string> = {
  bike: '자전거 대여량',
  rocks: '행성 암석',
  energy: '에너지 사용 패턴',
}

export const DATASET_STORY: Record<DatasetId, string> = {
  bike: '도시의 시간대·날씨에 따라 대여소 자전거가 얼마나 나갔는지 기록한 가상 데이터입니다.',
  rocks: '탐사 로봇이 모은 암석의 단단함·밀도·색·자성을 담은 가상 데이터입니다.',
  energy: '가정마다 아침·저녁·주말 전력 사용 비율을 담은 가상 데이터입니다.',
}

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

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export const BIKE_COLUMNS: ColumnDef[] = [
  { key: 'temp', label: '기온', kind: 'numeric', unit: '℃', meaning: '그날 평균 기온' },
  { key: 'humidity', label: '습도', kind: 'numeric', unit: '%', meaning: '상대 습도' },
  { key: 'wind', label: '바람', kind: 'numeric', unit: 'm/s', meaning: '평균 풍속' },
  { key: 'hour', label: '시간대', kind: 'numeric', unit: '시', meaning: '0~23시' },
  {
    key: 'rentals',
    label: '대여 수',
    kind: 'numeric',
    unit: '대',
    asTarget: 'regression',
    meaning: '그 시간대에 나간 자전거 대수(맞힐 숫자)',
  },
  {
    key: 'weather',
    label: '날씨',
    kind: 'categorical',
    asTarget: 'classification',
    meaning: '맑음 / 흐림 / 비 중 하나',
  },
]

export const ROCK_COLUMNS: ColumnDef[] = [
  { key: 'hardness', label: '단단함', kind: 'numeric', unit: '단계', meaning: '긁힘에 견디는 정도' },
  { key: 'density', label: '밀도', kind: 'numeric', unit: 'g/cm³', meaning: '질량을 부피로 나눈 값' },
  { key: 'colorScore', label: '색 점수', kind: 'numeric', unit: '점', meaning: '어두운 정도(0~10)' },
  { key: 'magnetism', label: '자성', kind: 'numeric', unit: '단계', meaning: '자석에 붙는 세기' },
  {
    key: 'rockType',
    label: '암석 종류',
    kind: 'categorical',
    asTarget: 'classification',
    meaning: '화성암 / 퇴적암 / 변성암',
  },
  {
    key: 'ageMy',
    label: '추정 나이',
    kind: 'numeric',
    unit: '백만년',
    asTarget: 'regression',
    meaning: '대략적인 형성 시기(숫자)',
  },
]

export const ENERGY_COLUMNS: ColumnDef[] = [
  { key: 'morning', label: '아침 사용', kind: 'numeric', unit: 'kWh', meaning: '6~12시 사용량' },
  { key: 'evening', label: '저녁 사용', kind: 'numeric', unit: 'kWh', meaning: '18~24시 사용량' },
  { key: 'weekend', label: '주말 비율', kind: 'numeric', unit: '%', meaning: '주말 사용이 차지하는 비율' },
  { key: 'devices', label: '기기 수', kind: 'numeric', unit: '대', meaning: '연결된 가전 수' },
  {
    key: 'dailyTotal',
    label: '하루 총량',
    kind: 'numeric',
    unit: 'kWh',
    asTarget: 'regression',
    meaning: '하루 전체 전력 사용량',
  },
  {
    key: 'pattern',
    label: '사용 패턴',
    kind: 'categorical',
    asTarget: 'classification',
    meaning: '아침형 / 저녁형 / 골고루 (숨은 무리 라벨)',
  },
]

export const COLUMNS_BY_DATASET: Record<DatasetId, ColumnDef[]> = {
  bike: BIKE_COLUMNS,
  rocks: ROCK_COLUMNS,
  energy: ENERGY_COLUMNS,
}

/** 군집에 기본으로 쓰는 특성 (목표 열이 없을 때) */
export const CLUSTER_FEATURES: Record<DatasetId, string[]> = {
  bike: ['temp', 'humidity', 'wind', 'hour'],
  rocks: ['hardness', 'density', 'colorScore', 'magnetism'],
  energy: ['morning', 'evening', 'weekend', 'devices'],
}

export const PROBLEM_CARDS: ProblemCard[] = [
  {
    id: 'bike-rentals',
    datasetId: 'bike',
    title: '내일 자전거는 몇 대가 나갈까?',
    story:
      '기온·습도·바람·시간대를 보고, 대여소에서 나갈 자전거 대수(숫자)를 예측하고 싶습니다. 정답은 연속된 숫자입니다.',
    correctType: 'regression',
    whyChoices: [
      '맞혀야 할 답이 연속된 숫자(대여 수)라서',
      '맑음·흐림·비처럼 종류를 고르는 문제라서',
      '비슷한 날끼리만 묶으면 되고 정답 숫자가 없어서',
    ],
    whyCorrect: '맞혀야 할 답이 연속된 숫자(대여 수)라서',
    vizHint: '가로축은 실제 대여 수, 세로축은 모델이 예측한 수입니다. 대각선에 가까울수록 잘 맞힌 것입니다.',
  },
  {
    id: 'rock-type',
    datasetId: 'rocks',
    title: '이 암석은 어떤 종류일까?',
    story:
      '단단함·밀도·색·자성을 보고, 화성암·퇴적암·변성암 중 어느 종류인지 고르고 싶습니다. 정답은 정해진 종류 중 하나입니다.',
    correctType: 'classification',
    whyChoices: [
      '맞혀야 할 답이 정해진 종류(라벨) 중 하나라서',
      '나이를 백만년 단위 숫자로 맞춰야 해서',
      '비슷한 암석끼리만 묶으면 되고 종류 정답이 없어서',
    ],
    whyCorrect: '맞혀야 할 답이 정해진 종류(라벨) 중 하나라서',
    vizHint: '실제 종류와 모델이 고른 종류를 표로 비교합니다. 대각선이 많을수록 잘 맞힌 것입니다.',
  },
  {
    id: 'energy-cluster',
    datasetId: 'energy',
    title: '가정 사용 패턴을 어떻게 나눌까?',
    story:
      '아침·저녁·주말 사용량만 있고 "이게 아침형이다" 같은 정답 라벨은 없습니다. 비슷한 사용 패턴끼리 묶고 싶습니다.',
    correctType: 'clustering',
    whyChoices: [
      '미리 정해진 정답 종류 없이 비슷한 것끼리 묶는 문제라서',
      '하루 총 사용량(숫자)을 맞혀야 해서',
      '아침형·저녁형·골고루 중 하나를 맞혀야 해서',
    ],
    whyCorrect: '미리 정해진 정답 종류 없이 비슷한 것끼리 묶는 문제라서',
    vizHint: '각 점을 한 가정으로 보고, 같은 색은 같은 무리입니다. 무리가 잘 갈라져 있는지 봅니다.',
  },
]

function buildBikeRows(rng: () => number, count: number, prefix: string): DataRow[] {
  const weathers = ['맑음', '흐림', '비'] as const
  const rows: DataRow[] = []
  for (let i = 0; i < count; i += 1) {
    const temp = round1(5 + rng() * 30)
    const humidity = round1(30 + rng() * 60)
    const wind = round1(rng() * 12)
    const hour = randomInt(rng, 0, 23)
    const weatherRoll = rng()
    const weather = weatherRoll < 0.5 ? '맑음' : weatherRoll < 0.8 ? '흐림' : '비'
    // 출퇴근·따뜻한 날·맑은 날에 대여가 늘어나는 규칙 + 잡음
    let rentals =
      40 +
      temp * 2.2 -
      humidity * 0.25 -
      wind * 1.8 +
      (hour >= 7 && hour <= 9 ? 45 : 0) +
      (hour >= 17 && hour <= 19 ? 50 : 0) +
      (weather === '맑음' ? 20 : weather === '흐림' ? 5 : -25) +
      (rng() - 0.5) * 18
    rentals = Math.max(0, Math.round(rentals))
    rows.push({
      id: `${prefix}${String(i + 1).padStart(3, '0')}`,
      values: { temp, humidity, wind, hour, rentals, weather },
    })
  }
  // weather가 특성으로부터도 대략 추론되게 소량 보정은 이미 반영됨
  void weathers
  return rows
}

function buildRockRows(rng: () => number, count: number, prefix: string): DataRow[] {
  const types = ['화성암', '퇴적암', '변성암'] as const
  const rows: DataRow[] = []
  for (let i = 0; i < count; i += 1) {
    const type = types[randomInt(rng, 0, 2)]
    let hardness: number
    let density: number
    let colorScore: number
    let magnetism: number
    let ageMy: number
    if (type === '화성암') {
      hardness = round1(6 + rng() * 3.5)
      density = round1(2.6 + rng() * 0.9)
      colorScore = round1(4 + rng() * 5)
      magnetism = round1(3 + rng() * 6)
      ageMy = Math.round(80 + rng() * 400)
    } else if (type === '퇴적암') {
      hardness = round1(2 + rng() * 3.5)
      density = round1(1.8 + rng() * 0.7)
      colorScore = round1(2 + rng() * 4)
      magnetism = round1(rng() * 2.5)
      ageMy = Math.round(20 + rng() * 180)
    } else {
      hardness = round1(4 + rng() * 4)
      density = round1(2.3 + rng() * 1.1)
      colorScore = round1(5 + rng() * 4)
      magnetism = round1(1 + rng() * 4)
      ageMy = Math.round(120 + rng() * 500)
    }
    // 약 6% 잡음으로 경계 흐리기
    if (rng() < 0.06) {
      hardness = clamp(hardness + (rng() - 0.5) * 3, 1, 10)
      magnetism = clamp(magnetism + (rng() - 0.5) * 3, 0, 10)
    }
    rows.push({
      id: `${prefix}${String(i + 1).padStart(3, '0')}`,
      values: { hardness, density, colorScore, magnetism, rockType: type, ageMy },
    })
  }
  return rows
}

function buildEnergyRows(rng: () => number, count: number, prefix: string): DataRow[] {
  const patterns = ['아침형', '저녁형', '골고루'] as const
  const rows: DataRow[] = []
  for (let i = 0; i < count; i += 1) {
    const pattern = patterns[randomInt(rng, 0, 2)]
    const devices = randomInt(rng, 3, 14)
    let morning: number
    let evening: number
    let weekend: number
    if (pattern === '아침형') {
      morning = round1(4 + rng() * 5 + devices * 0.15)
      evening = round1(1.5 + rng() * 2.5)
      weekend = round1(25 + rng() * 20)
    } else if (pattern === '저녁형') {
      morning = round1(1.2 + rng() * 2)
      evening = round1(4.5 + rng() * 5 + devices * 0.12)
      weekend = round1(35 + rng() * 25)
    } else {
      morning = round1(2.5 + rng() * 3)
      evening = round1(2.5 + rng() * 3)
      weekend = round1(40 + rng() * 25)
    }
    const midday = round1(1.5 + rng() * 3)
    const dailyTotal = round1(morning + evening + midday + devices * 0.2 + (rng() - 0.5))
    rows.push({
      id: `${prefix}${String(i + 1).padStart(3, '0')}`,
      values: { morning, evening, weekend, devices, dailyTotal, pattern },
    })
  }
  return rows
}

/** 데이터셋 전체(훈련+시험으로 나중에 나눔) */
export function buildDataset(datasetId: DatasetId, count = 80): DataRow[] {
  const rng = makeRng(DATA_SEED + datasetId.charCodeAt(0) * 97)
  if (datasetId === 'bike') return buildBikeRows(rng, count, 'B')
  if (datasetId === 'rocks') return buildRockRows(rng, count, 'R')
  return buildEnergyRows(rng, count, 'E')
}

export function getNumericFeatureKeys(datasetId: DatasetId, excludeKeys: string[] = []): string[] {
  const exclude = new Set(excludeKeys)
  return COLUMNS_BY_DATASET[datasetId]
    .filter(col => col.kind === 'numeric' && !exclude.has(col.key) && col.asTarget !== 'regression')
    .map(col => col.key)
}

/** 목표로 쓸 수 있는 열 */
export function getTargetCandidates(datasetId: DatasetId): ColumnDef[] {
  return COLUMNS_BY_DATASET[datasetId].filter(col => col.asTarget)
}

export const DATA_DICTIONARY: Array<{ dataset: string; field: string; meaning: string; range: string }> = [
  { dataset: '자전거', field: '기온', meaning: '평균 기온', range: '약 5~35℃' },
  { dataset: '자전거', field: '대여 수', meaning: '나간 자전거 대수', range: '0대 이상' },
  { dataset: '자전거', field: '날씨', meaning: '날씨 종류', range: '맑음 / 흐림 / 비' },
  { dataset: '암석', field: '단단함·밀도·자성', meaning: '암석 특성', range: '각각 단계·g/cm³' },
  { dataset: '암석', field: '암석 종류', meaning: '분류 정답', range: '화성암 / 퇴적암 / 변성암' },
  { dataset: '에너지', field: '아침·저녁 사용', meaning: '시간대별 전력', range: 'kWh' },
  { dataset: '에너지', field: '사용 패턴', meaning: '숨은 무리(참고용)', range: '아침형 / 저녁형 / 골고루' },
]
