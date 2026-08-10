/** 격자 한 칸의 지형. wall은 지나갈 수 없습니다. */
export type Terrain = 'plain' | 'forest' | 'swamp' | 'wall'

/** 탐색 알고리즘 */
export type Algorithm = 'dfs' | 'bfs' | 'gbfs' | 'astar'

export interface Point {
  r: number
  c: number
}

/** 편집·실행에 쓰는 격자 지도 */
export interface GridMap {
  rows: number
  cols: number
  /** cells[r][c] */
  cells: Terrain[][]
  start: Point
  goal: Point
}

/** 프론티어(다음에 볼 칸 목록)에 들어 있는 한 노드 */
export interface FrontierNode {
  r: number
  c: number
  /** 시작점에서 여기까지 온 실제 비용 */
  g: number
  /** 목표까지 남은 거리 추정(맨해튼) */
  h: number
  /** f = g + h (A*에서 사용) */
  f: number
}

export type SearchStatus = 'ready' | 'running' | 'found' | 'failed'

/**
 * 한 단계씩 진행할 수 있는 탐색 상태.
 * 화면 코드와 분리된 순수 구조라 stepSearch만 반복하면 결과가 고정됩니다.
 */
export interface SearchState {
  algorithm: Algorithm
  status: SearchStatus
  frontier: FrontierNode[]
  /** 이미 펼쳐 본 칸 → 방문 순서(1부터) */
  visitOrder: Record<string, number>
  /** 자식키 → 부모키. 경로 복원에 사용 */
  cameFrom: Record<string, string>
  /** 시작점에서 각 칸까지의 확정(또는 현재 최선) g값 */
  gScore: Record<string, number>
  /** 이번 단계에서 막 펼친 칸 */
  current: Point | null
  /** 목표에 도달했을 때 시작→목표 경로 */
  path: Point[] | null
  /** 펼친(방문한) 칸 수 */
  visitedCount: number
  /** 경로 칸 수(시작·목표 포함). 없으면 0 */
  pathLength: number
  /** 경로 총비용. 없으면 0 */
  pathCost: number
  stepCount: number
}

/** 알고리즘을 끝까지 돌린 요약 결과 */
export interface SearchSummary {
  algorithm: Algorithm
  status: SearchStatus
  visitedCount: number
  pathLength: number
  pathCost: number
  path: Point[] | null
  visitOrder: Record<string, number>
}

export type EditTool = 'wall' | 'plain' | 'forest' | 'swamp' | 'start' | 'goal'

export interface PresetMap {
  id: string
  name: string
  description: string
  map: GridMap
}
