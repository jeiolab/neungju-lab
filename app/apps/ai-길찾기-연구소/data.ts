/**
 * 교육용 합성 미로 프리셋.
 * 실제 지도·내비게이션 데이터가 아닙니다.
 */
import { parseAsciiMap } from './logic'
import type { PresetMap } from './types'

export const DATA_VERSION = '1.0.0'
export const DATA_SEED = 20260810

/** 초급: 작은 고정 미로 */
export const BEGINNER_PRESETS: PresetMap[] = [
  {
    id: 'beginner-room',
    name: '교실 미로',
    description: '시작에서 목표까지 길이 두 갈래로 갈라집니다.',
    map: parseAsciiMap([
      'S....',
      '.###.',
      '.....',
      '.###.',
      '....G',
    ]),
  },
  {
    id: 'beginner-corridor',
    name: '복도 미로',
    description: '좁은 복도가 있어 깊이 우선이 멀리 돌아가기 쉽습니다.',
    map: parseAsciiMap([
      'S#...',
      '.#.#.',
      '.#.#.',
      '...#.',
      '###.G',
    ]),
  },
]

/** 중급: 편집용 시작 지도 */
export const INTERMEDIATE_PRESETS: PresetMap[] = [
  {
    id: 'intermediate-blank',
    name: '빈 운동장',
    description: '벽을 직접 세워 나만의 미로를 만듭니다.',
    map: parseAsciiMap([
      'S.......',
      '........',
      '........',
      '........',
      '........',
      '.......G',
    ]),
  },
  {
    id: 'intermediate-school',
    name: '학교 안뜰',
    description: '벽이 조금 있는 상태에서 시작·목표를 옮겨 보세요.',
    map: parseAsciiMap([
      'S..#....',
      '##.#.##.',
      '...#....',
      '.####.#.',
      '......#.',
      '.####.#.',
      '......#G',
    ]),
  },
]

/**
 * 고급 프리셋.
 * - detour-trap: 최상 우선이 겉보기에 가까운 숲 길로 들어가 비용이 큰 길을 고르기 쉽습니다.
 * - open-field: A*가 BFS보다 적게 방문하기 쉬운 탁 트인 지형입니다.
 */
export const ADVANCED_PRESETS: PresetMap[] = [
  {
    id: 'advanced-open',
    name: '넓은 운동장',
    description: '장애물이 거의 없습니다. A*가 BFS보다 적게 둘러보는 경우가 많습니다.',
    map: parseAsciiMap([
      'S.........',
      '..........',
      '..FFFF....',
      '..........',
      '....WW....',
      '..........',
      '..........',
      '.........G',
    ]),
  },
  {
    id: 'advanced-greedy-trap',
    name: '숲 함정',
    description:
      '목표 쪽으로 곧장 보이는 숲 길이 있습니다. 최상 우선은 그쪽으로 끌려가 비용이 큰 길을 고를 수 있습니다.',
    map: parseAsciiMap([
      'SFFFFFG',
      '.......',
      '.......',
    ]),
  },
  {
    id: 'advanced-swamp',
    name: '늪과 숲',
    description: '지형 비용이 섞여 있어 경로 길이와 총비용이 달라질 수 있습니다.',
    map: parseAsciiMap([
      'S..WW.....',
      '#..WW..#..',
      '#..FF..#..',
      '....FF....',
      '##.####.##',
      '....FF....',
      '..#.WW.#..',
      '..#.WW.#..',
      '.........G',
    ]),
  },
]

export const MISSION = {
  title: '지도 설계 미션',
  description:
    '아래 중 하나를 만족하는 지도를 만들어 보세요. 네 알고리즘을 모두 실행한 뒤 표에서 확인합니다.',
  goals: [
    'A*가 방문한 칸 수가 BFS보다 적다',
    '최상 우선이 찾은 경로의 총비용이 A*보다 크다(최적 경로를 못 찾은 경우)',
  ],
}
