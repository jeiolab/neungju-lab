/**
 * 교육용 합성 데이터입니다.
 * 생물학적 뉴런을 그대로 옮긴 것이 아니라, 계산을 위해 크게 단순화한 모형입니다.
 */
import type { GateChallenge, SamplePoint, Weights } from './types'

export const DATA_SEED = 20260810
export const DATA_VERSION = '1.0.0'

export const MODULE_ID = '뉴런-조율사'
export const MODULE_NAME = '뉴런 조율사'

/** 슬라이더 범위 */
export const WEIGHT_RANGE = { min: -3, max: 3, step: 0.1 } as const
export const BIAS_RANGE = { min: -3, max: 3, step: 0.1 } as const
export const LR_RANGE = { min: 0.05, max: 1, step: 0.05 } as const

/** 초급에서 '대부분 나뉨'으로 볼 정확도 기준 */
export const BEGINNER_SUCCESS_ACCURACY = 0.9

/** 산점도 기본 좌표 범위 */
export const PLOT_BOUNDS = { minX: -0.5, maxX: 4.5, minY: -0.5, maxY: 4.5 } as const
export const GATE_BOUNDS = { minX: -0.3, maxX: 1.3, minY: -0.3, maxY: 1.3 } as const

/** 재현 가능한 난수 */
function makeRng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function jitter(rng: () => number, center: number, spread: number): number {
  return center + (rng() * 2 - 1) * spread
}

/**
 * 초급용 두 무리.
 * 왼쪽 아래(파랑=0)와 오른쪽 위(주황=1)로 나뉘어 직선으로 가를 수 있습니다.
 */
export function buildClusterPoints(): SamplePoint[] {
  const rng = makeRng(DATA_SEED)
  const points: SamplePoint[] = []

  for (let i = 0; i < 12; i += 1) {
    points.push({
      id: `A${i + 1}`,
      x1: jitter(rng, 1.0, 0.55),
      x2: jitter(rng, 1.1, 0.55),
      label: 0,
    })
  }
  for (let i = 0; i < 12; i += 1) {
    points.push({
      id: `B${i + 1}`,
      x1: jitter(rng, 3.2, 0.55),
      x2: jitter(rng, 3.1, 0.55),
      label: 1,
    })
  }
  return points
}

/** 처음에 잘 안 나뉘도록 둔 기본 가중치 */
export const DEFAULT_WEIGHTS: Weights = { w1: 0.4, w2: -0.2, b: -0.5 }

/** 학습 실험용 초기 가중치 */
export const LEARNING_START_WEIGHTS: Weights = { w1: 0, w2: 0, b: 0 }

export const DEFAULT_LEARNING_RATE = 0.3
export const MAX_EPOCHS = 40

/** 논리 게이트 네 점 */
function gatePoints(truth: Array<[number, number, 0 | 1]>, prefix: string): SamplePoint[] {
  return truth.map(([x1, x2, label], index) => ({
    id: `${prefix}${index}`,
    x1,
    x2,
    label,
  }))
}

export const GATE_CHALLENGES: GateChallenge[] = [
  {
    id: 'AND',
    name: 'AND 게이트',
    description: '두 입력이 모두 1일 때만 1이 나와야 합니다.',
    linearlySeparable: true,
    points: gatePoints(
      [
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      'AND'
    ),
  },
  {
    id: 'OR',
    name: 'OR 게이트',
    description: '둘 중 하나라도 1이면 1이 나와야 합니다.',
    linearlySeparable: true,
    points: gatePoints(
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      'OR'
    ),
  },
  {
    id: 'XOR',
    name: 'XOR 게이트',
    description: '두 입력이 서로 다를 때만 1이 나와야 합니다. 직선 하나로는 나눌 수 없습니다.',
    linearlySeparable: false,
    points: gatePoints(
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
      ],
      'XOR'
    ),
  },
]

/** 중급 활성화 비교에 쓸 예시 점 */
export const DEMO_POINT: SamplePoint = {
  id: 'demo',
  x1: 1,
  x2: 0,
  label: 1,
}

export const LABEL_COLOR = {
  0: { fill: '#2563eb', name: '무리 A (0)' },
  1: { fill: '#ea580c', name: '무리 B (1)' },
} as const
