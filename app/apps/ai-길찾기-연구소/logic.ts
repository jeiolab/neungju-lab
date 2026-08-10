/**
 * 격자 길찾기 순수 함수.
 * DFS / BFS / 최상 우선(GBFS) / A* 를 한 단계씩 진행하는 상태 기계를 제공합니다.
 */
import type {
  Algorithm,
  EditTool,
  FrontierNode,
  GridMap,
  Point,
  SearchState,
  SearchSummary,
  Terrain,
} from './types'

export const TERRAIN_COST: Record<Exclude<Terrain, 'wall'>, number> = {
  plain: 1,
  forest: 3,
  swamp: 5,
}

export const TERRAIN_LABEL: Record<Terrain, string> = {
  plain: '평지',
  forest: '숲',
  swamp: '늪',
  wall: '벽',
}

export const ALGORITHM_LABEL: Record<Algorithm, string> = {
  dfs: '깊이 우선(DFS)',
  bfs: '너비 우선(BFS)',
  gbfs: '최상 우선',
  astar: 'A*',
}

export const ALGORITHM_HINT: Record<Algorithm, string> = {
  dfs: '한 방향으로 깊게 들어갔다가, 막히면 되돌아옵니다. 스택을 씁니다.',
  bfs: '가까운 칸부터 넓게 퍼져 나갑니다. 큐를 씁니다.',
  gbfs: '목표에 가까워 보이는 칸을 먼저 봅니다. 휴리스틱(h)만 봅니다.',
  astar: '지금까지 든 비용(g)과 남은 거리 추정(h)을 더해(f) 가장 유망한 칸을 봅니다.',
}

/** 상 → 우 → 하 → 좌. 같은 규칙이면 언제나 같은 탐색 순서가 나옵니다. */
const DIRS: Point[] = [
  { r: -1, c: 0 },
  { r: 0, c: 1 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
]

export function cellKey(r: number, c: number): string {
  return `${r},${c}`
}

export function parseKey(key: string): Point {
  const [r, c] = key.split(',').map(Number)
  return { r, c }
}

export function pointsEqual(a: Point, b: Point): boolean {
  return a.r === b.r && a.c === b.c
}

export function inBounds(map: GridMap, r: number, c: number): boolean {
  return r >= 0 && c >= 0 && r < map.rows && c < map.cols
}

export function isWalkable(map: GridMap, r: number, c: number): boolean {
  return inBounds(map, r, c) && map.cells[r][c] !== 'wall'
}

export function terrainCost(map: GridMap, r: number, c: number): number {
  const terrain = map.cells[r][c]
  if (terrain === 'wall') return Number.POSITIVE_INFINITY
  return TERRAIN_COST[terrain]
}

/** 맨해튼 거리. 대각선 없이 네 방향만 움직일 때의 최소 칸 수입니다. */
export function manhattan(a: Point, b: Point): number {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c)
}

export function cloneMap(map: GridMap): GridMap {
  return {
    rows: map.rows,
    cols: map.cols,
    cells: map.cells.map(row => [...row]),
    start: { ...map.start },
    goal: { ...map.goal },
  }
}

/** 문자열 배열로 지도를 만듭니다. S=시작, G=목표, #=벽, .=평지, F=숲, W=늪 */
export function parseAsciiMap(lines: string[]): GridMap {
  const rows = lines.length
  const cols = lines[0]?.length ?? 0
  const cells: Terrain[][] = []
  let start: Point = { r: 0, c: 0 }
  let goal: Point = { r: 0, c: 0 }

  for (let r = 0; r < rows; r += 1) {
    const row: Terrain[] = []
    for (let c = 0; c < cols; c += 1) {
      const ch = lines[r][c]
      if (ch === 'S') {
        start = { r, c }
        row.push('plain')
      } else if (ch === 'G') {
        goal = { r, c }
        row.push('plain')
      } else if (ch === '#') {
        row.push('wall')
      } else if (ch === 'F') {
        row.push('forest')
      } else if (ch === 'W') {
        row.push('swamp')
      } else {
        row.push('plain')
      }
    }
    cells.push(row)
  }

  return { rows, cols, cells, start, goal }
}

function makeNode(map: GridMap, r: number, c: number, g: number): FrontierNode {
  const h = manhattan({ r, c }, map.goal)
  return { r, c, g, h, f: g + h }
}

function reconstructPath(cameFrom: Record<string, string>, end: Point): Point[] {
  const path: Point[] = [end]
  let key = cellKey(end.r, end.c)
  while (cameFrom[key] !== undefined) {
    key = cameFrom[key]
    path.push(parseKey(key))
  }
  path.reverse()
  return path
}

function pathCostOf(map: GridMap, path: Point[]): number {
  // 시작 칸 비용은 0으로 두고, 들어간 칸의 지형 비용만 합산합니다.
  let total = 0
  for (let i = 1; i < path.length; i += 1) {
    total += terrainCost(map, path[i].r, path[i].c)
  }
  return total
}

function neighbors(map: GridMap, r: number, c: number): Point[] {
  const result: Point[] = []
  DIRS.forEach(dir => {
    const nr = r + dir.r
    const nc = c + dir.c
    if (isWalkable(map, nr, nc)) result.push({ r: nr, c: nc })
  })
  return result
}

/** 탐색 초기 상태. 시작 칸만 프론티어에 넣어 둡니다. */
export function createSearch(map: GridMap, algorithm: Algorithm): SearchState {
  const startNode = makeNode(map, map.start.r, map.start.c, 0)
  const startKey = cellKey(map.start.r, map.start.c)
  return {
    algorithm,
    status: 'ready',
    frontier: [startNode],
    visitOrder: {},
    cameFrom: {},
    gScore: { [startKey]: 0 },
    current: null,
    path: null,
    visitedCount: 0,
    pathLength: 0,
    pathCost: 0,
    stepCount: 0,
  }
}

function popFrontier(state: SearchState): FrontierNode | null {
  if (state.frontier.length === 0) return null
  if (state.algorithm === 'dfs') {
    return state.frontier[state.frontier.length - 1]
  }
  if (state.algorithm === 'bfs') {
    return state.frontier[0]
  }
  // gbfs: h 최소, astar: f 최소. 동점이면 먼저 들어온 쪽을 유지(안정)
  let bestIndex = 0
  for (let i = 1; i < state.frontier.length; i += 1) {
    const a = state.frontier[i]
    const b = state.frontier[bestIndex]
    const better =
      state.algorithm === 'gbfs'
        ? a.h < b.h || (a.h === b.h && a.g < b.g)
        : a.f < b.f || (a.f === b.f && a.h < b.h)
    if (better) bestIndex = i
  }
  return state.frontier[bestIndex]
}

function removeFrontierAt(frontier: FrontierNode[], node: FrontierNode): FrontierNode[] {
  const index = frontier.findIndex(item => item.r === node.r && item.c === node.c && item.g === node.g)
  if (index < 0) return frontier
  return [...frontier.slice(0, index), ...frontier.slice(index + 1)]
}

/**
 * 탐색을 한 칸 진행합니다.
 * DFS/BFS는 방문한 칸을 다시 넣지 않고,
 * GBFS/A*는 더 좋은 g로 다시 발견되면 프론티어를 갱신합니다.
 */
export function stepSearch(map: GridMap, state: SearchState): SearchState {
  if (state.status === 'found' || state.status === 'failed') return state
  if (state.frontier.length === 0) {
    return { ...state, status: 'failed', current: null, stepCount: state.stepCount + 1 }
  }

  const current = popFrontier(state)
  if (!current) {
    return { ...state, status: 'failed', current: null, stepCount: state.stepCount + 1 }
  }

  const key = cellKey(current.r, current.c)
  let frontier = removeFrontierAt(state.frontier, current)

  // 이미 방문한 칸이면(더 나쁜 경로로 다시 나온 경우) 건너뜁니다.
  if (state.visitOrder[key] !== undefined) {
    return {
      ...state,
      status: 'running',
      frontier,
      current: { r: current.r, c: current.c },
      stepCount: state.stepCount + 1,
    }
  }

  const visitOrder = { ...state.visitOrder, [key]: state.visitedCount + 1 }
  const visitedCount = state.visitedCount + 1
  const cameFrom = { ...state.cameFrom }
  const gScore = { ...state.gScore }

  if (pointsEqual(current, map.goal)) {
    const path = reconstructPath(cameFrom, map.goal)
    return {
      ...state,
      status: 'found',
      frontier,
      visitOrder,
      visitedCount,
      current: { r: current.r, c: current.c },
      path,
      pathLength: path.length,
      pathCost: pathCostOf(map, path),
      stepCount: state.stepCount + 1,
    }
  }

  const nextNeighbors = neighbors(map, current.r, current.c)
  // DFS는 스택이므로 나중에 넣을수록 먼저 나옵니다. 상·우·하·좌 우선을 위해 역순 push.
  const ordered =
    state.algorithm === 'dfs' ? [...nextNeighbors].reverse() : nextNeighbors

  ordered.forEach(nb => {
    const nbKey = cellKey(nb.r, nb.c)
    const stepCost = terrainCost(map, nb.r, nb.c)
    const tentativeG = current.g + stepCost

    if (state.algorithm === 'dfs' || state.algorithm === 'bfs') {
      if (visitOrder[nbKey] !== undefined) return
      if (frontier.some(item => item.r === nb.r && item.c === nb.c)) return
      if (gScore[nbKey] !== undefined) return
      cameFrom[nbKey] = key
      gScore[nbKey] = tentativeG
      frontier =
        state.algorithm === 'dfs'
          ? [...frontier, makeNode(map, nb.r, nb.c, tentativeG)]
          : [...frontier, makeNode(map, nb.r, nb.c, tentativeG)]
      return
    }

    // GBFS / A*: 더 좋은 g를 찾으면 갱신
    const known = gScore[nbKey]
    if (known !== undefined && tentativeG >= known) return
    cameFrom[nbKey] = key
    gScore[nbKey] = tentativeG
    frontier = frontier.filter(item => !(item.r === nb.r && item.c === nb.c))
    frontier = [...frontier, makeNode(map, nb.r, nb.c, tentativeG)]
  })

  return {
    ...state,
    status: 'running',
    frontier,
    visitOrder,
    cameFrom,
    gScore,
    current: { r: current.r, c: current.c },
    visitedCount,
    stepCount: state.stepCount + 1,
  }
}

/** 끝날 때까지 한 번에 실행합니다. */
export function runSearch(map: GridMap, algorithm: Algorithm, maxSteps = 10_000): SearchState {
  let state = createSearch(map, algorithm)
  for (let i = 0; i < maxSteps; i += 1) {
    state = stepSearch(map, state)
    if (state.status === 'found' || state.status === 'failed') break
  }
  return state
}

export function toSummary(state: SearchState): SearchSummary {
  return {
    algorithm: state.algorithm,
    status: state.status,
    visitedCount: state.visitedCount,
    pathLength: state.pathLength,
    pathCost: state.pathCost,
    path: state.path,
    visitOrder: state.visitOrder,
  }
}

/** 격자 편집. 시작/목표는 서로 겹치지 않게 옮깁니다. */
export function applyEdit(map: GridMap, r: number, c: number, tool: EditTool): GridMap {
  if (!inBounds(map, r, c)) return map
  const next = cloneMap(map)

  if (tool === 'start') {
    if (pointsEqual(next.goal, { r, c })) return map
    next.cells[r][c] = next.cells[r][c] === 'wall' ? 'plain' : next.cells[r][c]
    next.start = { r, c }
    return next
  }

  if (tool === 'goal') {
    if (pointsEqual(next.start, { r, c })) return map
    next.cells[r][c] = next.cells[r][c] === 'wall' ? 'plain' : next.cells[r][c]
    next.goal = { r, c }
    return next
  }

  if (pointsEqual(next.start, { r, c }) || pointsEqual(next.goal, { r, c })) return map
  next.cells[r][c] = tool
  return next
}

/** 빈 평지 격자 */
export function emptyMap(rows: number, cols: number): GridMap {
  const cells: Terrain[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'plain' as Terrain)
  )
  return {
    rows,
    cols,
    cells,
    start: { r: 0, c: 0 },
    goal: { r: rows - 1, c: cols - 1 },
  }
}

/** 프론티어에 있는 칸의 g/h/f 조회용 맵 */
export function frontierLookup(frontier: FrontierNode[]): Record<string, FrontierNode> {
  const lookup: Record<string, FrontierNode> = {}
  frontier.forEach(node => {
    lookup[cellKey(node.r, node.c)] = node
  })
  return lookup
}

export function pathSet(path: Point[] | null): Set<string> {
  const set = new Set<string>()
  path?.forEach(p => set.add(cellKey(p.r, p.c)))
  return set
}
