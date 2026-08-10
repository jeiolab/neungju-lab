/**
 * 모든 데이터는 교육용으로 만든 가상 데이터입니다.
 * 실제 학생 정보나 입시·채용 자료가 아닙니다.
 *
 * 시나리오: 'AI 동아리 체험 프로그램 참가 추천'
 * 교사가 값을 바꾸고 싶다면 이 파일의 상수만 수정하면 됩니다.
 */
import type { Interest, Label, PreprocessCard, Student, SupportGroup } from './types'

export const DATA_SEED = 20260810
export const DATA_VERSION = '1.0.0'

const INTERESTS: Interest[] = ['로봇', '데이터', '예술']

/** 재현 가능한 난수. 같은 seed면 항상 같은 데이터가 나옵니다. */
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
 * 참가 추천의 '진짜 기준'.
 * 프로그램을 따라올 준비가 되었는지는 기초 이해도와 참여 가능 시간으로 정해집니다.
 * 사전 활동 횟수는 이 기준에 들어가지 않습니다. 활동 기회 자체가 학생마다 달랐기 때문입니다.
 */
export const RECOMMEND_THRESHOLD = 9

function trueLabel(availableHours: number, quizScore: number): Label {
  const score = quizScore + availableHours * 0.5
  return score >= RECOMMEND_THRESHOLD ? '추천' : '보류'
}

function makeStudent(
  rng: () => number,
  id: string,
  group: SupportGroup
): Student {
  // B 그룹은 사전에 참여할 수 있는 활동 자체가 적었던 학생들입니다.
  // 준비도(퀴즈 점수, 가능 시간)는 A 그룹과 같은 분포입니다.
  const priorActivities = group === 'A' ? randomInt(rng, 4, 8) : randomInt(rng, 0, 3)
  const quizScore = randomInt(rng, 3, 10)
  const availableHours = randomInt(rng, 1, 9)
  const interest = INTERESTS[randomInt(rng, 0, INTERESTS.length - 1)]

  return {
    id,
    priorActivities,
    interest,
    availableHours,
    quizScore,
    group,
    label: trueLabel(availableHours, quizScore),
  }
}

function buildRows(
  rng: () => number,
  prefix: string,
  countA: number,
  countB: number
): Student[] {
  const rows: Student[] = []
  for (let i = 0; i < countA; i += 1) {
    rows.push(makeStudent(rng, `${prefix}${String(rows.length + 1).padStart(2, '0')}`, 'A'))
  }
  for (let i = 0; i < countB; i += 1) {
    rows.push(makeStudent(rng, `${prefix}${String(rows.length + 1).padStart(2, '0')}`, 'B'))
  }
  return rows
}

/** 깨끗한 훈련 데이터. A와 B가 고르게 들어 있습니다. */
export function buildCleanTrainingSet(): Student[] {
  const rng = makeRng(DATA_SEED)
  return buildRows(rng, 'T', 30, 30)
}

/**
 * 문제가 섞인 훈련 데이터.
 * 결측값, 이상값, 중복, 잘못된 레이블, 그룹 불균형을 의도적으로 넣었습니다.
 *
 * 핵심 설정: 과거 담당자가 '사전 활동 경험이 적으면 따라오기 어렵다'고 짐작해
 * B 그룹의 추천 사례 상당수를 보류로 기록해 두었습니다.
 * 이 잘못된 기록을 그대로 학습하면 인공지능도 같은 편견을 물려받습니다.
 */
export function buildMessyTrainingSet(): Student[] {
  const rng = makeRng(DATA_SEED + 7)
  // B 그룹 표본이 적습니다. 이것이 불균형 문제입니다.
  const rows = buildRows(rng, 'T', 38, 16).map(row => ({ ...row }))

  const byGroup = (group: SupportGroup) => rows.filter(row => row.group === group)
  const groupA = byGroup('A')
  const groupB = byGroup('B')

  // 잘못된 레이블: B 그룹의 추천 사례 대부분이 보류로 기록되었습니다.
  groupB
    .filter(row => row.label === '추천')
    .filter((_, index) => index % 4 !== 3)
    .forEach(row => {
      row.label = '보류'
    })

  // 결측값: 퀴즈 점수가 B 그룹에 더 많이 비어 있습니다.
  ;[groupB[1], groupB[4], groupB[9], groupA[3], groupA[11]].forEach(row => {
    if (row) row.quizScore = null
  })
  // 관심 분야 결측
  ;[groupA[6], groupB[3]].forEach(row => {
    if (row) row.interest = null
  })

  // 이상값: 참여 가능 시간이 현실적으로 불가능한 값
  if (groupA[1]) groupA[1].availableHours = 99
  if (groupA[9]) groupA[9].availableHours = 72
  if (groupB[6]) groupB[6].availableHours = 88

  // 중복 행
  const duplicates = [groupA[0], groupA[4]]
    .filter((row): row is Student => Boolean(row))
    .map((row, index) => ({ ...row, id: `T${90 + index}` }))

  return [...rows, ...duplicates]
}

/**
 * 고정 테스트 세트.
 * 전처리 대상이 아니며 A와 B가 같은 수로 들어 있어 그룹별 성능을 공정하게 비교할 수 있습니다.
 */
export function buildTestSet(): Student[] {
  const rng = makeRng(DATA_SEED + 991)
  return buildRows(rng, 'E', 15, 15)
}

/** 표 머리글과 데이터 사전 */
export const FIELD_LABEL: Record<string, string> = {
  id: '번호',
  priorActivities: '사전 활동 횟수',
  interest: '관심 분야',
  availableHours: '참여 가능 시간',
  quizScore: '기초 퀴즈 점수',
  group: '지원 그룹',
  label: '기록된 결과',
}

export const DATA_DICTIONARY: Array<{ field: string; meaning: string; range: string }> = [
  { field: '사전 활동 횟수', meaning: '지난 학기에 참여한 관련 활동 수', range: '0 ~ 8회' },
  { field: '관심 분야', meaning: '학생이 고른 관심 영역', range: '로봇 / 데이터 / 예술' },
  { field: '참여 가능 시간', meaning: '주당 참여 가능한 시간', range: '1 ~ 9시간' },
  { field: '기초 퀴즈 점수', meaning: '10문항 사전 이해도 퀴즈에서 맞힌 개수', range: '0 ~ 10개' },
  { field: '지원 그룹', meaning: '사전 활동 기회가 적었는지 나타내는 가상의 구분', range: 'A / B' },
  { field: '기록된 결과', meaning: '과거에 기록된 참가 추천 결과', range: '추천 / 보류' },
]

/** 전처리 카드 정의. 난이도에 따라 노출되는 카드가 달라집니다. */
export const PREPROCESS_CARDS: PreprocessCard[] = [
  {
    id: 'fillNumericMean',
    name: '수치 결측값 평균 대체',
    plainName: '빈칸을 평균으로 채우기',
    description: '비어 있는 숫자 칸을 그 열의 평균값으로 채웁니다.',
    whenToUse: '빈칸이 많지 않고, 그 열의 값이 한쪽으로 크게 치우치지 않았을 때',
    caution: '평균으로 채우면 원래 값의 다양함이 줄어듭니다. 언제나 최선인 방법은 아닙니다.',
    cost: 1,
    level: 'intermediate',
  },
  {
    id: 'clampOutliers',
    name: '이상값 범위 제한',
    plainName: '이상한 값을 정상 범위로 되돌리기',
    description: '있을 수 없는 값을 가능한 최대·최소 범위 안으로 줄입니다.',
    whenToUse: '입력 실수로 보이는 값이 있고, 그 행을 버리기는 아까울 때',
    caution: '진짜로 특별한 사례였다면 중요한 정보를 지우게 됩니다.',
    cost: 1,
    level: 'intermediate',
  },
  {
    id: 'resampleMinority',
    name: '소수 집단 재표집',
    plainName: '수가 적은 쪽을 늘리기',
    description: '수가 적은 그룹의 데이터를 복제해 양쪽 수를 비슷하게 맞춥니다.',
    whenToUse: '한 그룹의 사례가 너무 적어 모델이 그 그룹을 잘 배우지 못할 때',
    caution:
      '복제일 뿐 새로운 정보가 늘어난 것은 아닙니다. 그 그룹의 기록 자체가 잘못되어 있다면 잘못된 기록만 늘어납니다.',
    cost: 2,
    level: 'intermediate',
  },
  {
    id: 'dropProxyFeature',
    name: '대리 특성 제외',
    plainName: '사전 활동 횟수를 빼고 판단하기',
    description:
      '사전 활동 횟수를 학습에서 뺍니다. 이 값은 준비도와 직접 상관이 없지만 A 그룹과 B 그룹을 거의 그대로 갈라 놓습니다.',
    whenToUse:
      '어떤 특성이 결과의 원인이 아니면서 특정 집단을 구분하는 이름표 역할만 하고 있을 때',
    caution:
      '특성을 빼면 정보도 함께 줄어듭니다. 정말 결과와 관계없는지 근거가 필요하고, 뺀다고 편향이 완전히 사라지지도 않습니다.',
    cost: 2,
    level: 'intermediate',
  },
  {
    id: 'dropMissingRows',
    name: '결측 행 제외',
    plainName: '빈칸이 있는 줄 빼기',
    description: '값이 비어 있는 행을 학습에서 제외합니다.',
    whenToUse: '데이터가 충분히 많고 빈칸이 적을 때',
    caution: '빈칸이 특정 그룹에 몰려 있으면 그 그룹만 통째로 사라질 수 있습니다.',
    cost: 1,
    level: 'advanced',
  },
  {
    id: 'fillCategoryMode',
    name: '범주 최빈값 대체',
    plainName: '빈 분류를 가장 흔한 값으로 채우기',
    description: '비어 있는 범주형 칸을 가장 자주 나오는 값으로 채웁니다.',
    whenToUse: '범주형 칸의 빈칸이 적을 때',
    caution: '가장 흔한 값이 그 학생의 실제 관심 분야라는 보장은 없습니다.',
    cost: 1,
    level: 'advanced',
  },
  {
    id: 'fixSuspiciousLabels',
    name: '의심 레이블 수정',
    plainName: '이상해 보이는 결과 고치기',
    description: '비슷한 사례들과 결과가 다른 행을 이웃의 다수 결과로 바꿉니다.',
    whenToUse: '기록 실수로 보이는 레이블이 있을 때',
    caution: '진짜 예외 사례를 지워 버릴 수 있습니다. 근거 없이 많이 고치면 데이터를 왜곡합니다.',
    cost: 3,
    level: 'advanced',
  },
  {
    id: 'dropDuplicates',
    name: '중복 행 제거',
    plainName: '똑같이 겹친 줄 지우기',
    description: '내용이 완전히 같은 행을 하나만 남깁니다.',
    whenToUse: '같은 자료가 두 번 입력된 것이 확실할 때',
    caution: '우연히 값이 같은 서로 다른 사례일 수도 있습니다.',
    cost: 1,
    level: 'advanced',
  },
  {
    id: 'normalize',
    name: '수치 특성 정규화',
    plainName: '숫자 크기 맞추기',
    description: '단위가 다른 숫자들을 0~1 범위로 바꿔 거리 계산에서 공평하게 다룹니다.',
    whenToUse: '거리로 판단하는 모델을 쓸 때. 퀴즈 점수(0~100)와 활동 횟수(0~8)처럼 크기가 다를 때',
    caution: '정규화는 값의 크기만 바꿉니다. 데이터의 편향 자체를 없애 주지는 않습니다.',
    cost: 1,
    level: 'advanced',
  },
]

/** 고급 미션 목표 */
export const MISSION = {
  budget: 5,
  targetRecall: 0.8,
  maxGap: 0.15,
}
