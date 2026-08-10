'use client'

import {
  ALGORITHM_LABEL,
  TERRAIN_COST,
  TERRAIN_LABEL,
  cellKey,
  frontierLookup,
  pathSet,
} from '../logic'
import type { FrontierNode, GridMap, Point, SearchState, Terrain } from '../types'

const TERRAIN_STYLE: Record<Terrain, string> = {
  plain: 'bg-stone-100',
  forest: 'bg-emerald-200',
  swamp: 'bg-teal-300',
  wall: 'bg-slate-700',
}

function cellLabel(map: GridMap, r: number, c: number): string {
  if (map.start.r === r && map.start.c === c) return '시작'
  if (map.goal.r === r && map.goal.c === c) return '목표'
  const terrain = map.cells[r][c]
  if (terrain === 'wall') return '벽'
  return TERRAIN_LABEL[terrain]
}

export default function MazeGrid({
  map,
  state,
  showCosts = false,
  showVisitOrder = false,
  showTerrainCost = false,
  interactive = false,
  onCellClick,
  compareVisit,
  comparePath,
  dense = false,
}: {
  map: GridMap
  state?: SearchState | null
  /** 프론티어/선택 칸에 g,h,f 표시 */
  showCosts?: boolean
  showVisitOrder?: boolean
  showTerrainCost?: boolean
  interactive?: boolean
  onCellClick?: (r: number, c: number) => void
  /** 비교용: 다른 실행의 방문 칸 */
  compareVisit?: Record<string, number>
  comparePath?: Point[] | null
  dense?: boolean
}) {
  const path = pathSet(state?.path ?? null)
  const comparePathKeys = pathSet(comparePath ?? null)
  const frontier = frontierLookup(state?.frontier ?? [])
  const currentKey = state?.current ? cellKey(state.current.r, state.current.c) : null
  const cellSize = dense ? 'h-8 w-8 text-[9px]' : 'h-10 w-10 text-[10px] sm:h-11 sm:w-11 sm:text-[11px]'

  return (
    <div className="overflow-x-auto">
      <div
        role="grid"
        aria-label="격자 지도"
        className="inline-grid gap-0.5 rounded-lg border border-slate-200 bg-slate-200 p-0.5"
        style={{ gridTemplateColumns: `repeat(${map.cols}, minmax(0, 1fr))` }}
      >
        {map.cells.map((row, r) =>
          row.map((terrain, c) => {
            const key = cellKey(r, c)
            const isStart = map.start.r === r && map.start.c === c
            const isGoal = map.goal.r === r && map.goal.c === c
            const visited = state?.visitOrder[key]
            const inPath = path.has(key)
            const inComparePath = comparePathKeys.has(key)
            const inCompareVisit = compareVisit?.[key] !== undefined
            const front: FrontierNode | undefined = frontier[key]
            const isCurrent = currentKey === key

            let overlay = ''
            if (terrain === 'wall') overlay = TERRAIN_STYLE.wall
            else if (inPath) overlay = 'bg-amber-300 ring-2 ring-amber-500'
            else if (isCurrent) overlay = 'bg-violet-300 ring-2 ring-violet-500'
            else if (front) overlay = 'bg-sky-200'
            else if (visited) overlay = 'bg-blue-100'
            else overlay = TERRAIN_STYLE[terrain]

            if (!inPath && inComparePath) overlay = `${overlay} outline outline-2 outline-rose-400`
            else if (!visited && inCompareVisit && !front) overlay = `${overlay} outline outline-1 outline-rose-300`

            const costBits: string[] = []
            if (showCosts && (front || isCurrent || visited)) {
              const g = state?.gScore[key]
              const h = Math.abs(r - map.goal.r) + Math.abs(c - map.goal.c)
              if (g !== undefined) costBits.push(`g${g}`)
              if (front || isCurrent) {
                costBits.push(`h${front?.h ?? h}`)
                if (front) costBits.push(`f${front.f}`)
                else if (g !== undefined) costBits.push(`f${g + h}`)
              }
            }

            const titleParts = [
              cellLabel(map, r, c),
              terrain !== 'wall' && showTerrainCost
                ? `비용 ${TERRAIN_COST[terrain as Exclude<Terrain, 'wall'>]}`
                : null,
              visited ? `방문 ${visited}번째` : null,
              front ? '다음에 볼 칸' : null,
              inPath ? '찾은 경로' : null,
            ].filter(Boolean)

            const content = (
              <>
                {isStart && <span className="font-bold">S</span>}
                {isGoal && <span className="font-bold">G</span>}
                {!isStart && !isGoal && terrain === 'wall' && <span className="text-white">■</span>}
                {!isStart &&
                  !isGoal &&
                  terrain !== 'wall' &&
                  showVisitOrder &&
                  visited && <span className="font-semibold tabular-nums text-slate-700">{visited}</span>}
                {!isStart && !isGoal && terrain === 'forest' && !visited && !showVisitOrder && (
                  <span aria-hidden>숲</span>
                )}
                {!isStart && !isGoal && terrain === 'swamp' && !visited && !showVisitOrder && (
                  <span aria-hidden>늪</span>
                )}
                {costBits.length > 0 && (
                  <span className="absolute bottom-0 left-0 right-0 truncate px-0.5 text-[8px] leading-tight text-slate-700">
                    {costBits.join(' ')}
                  </span>
                )}
              </>
            )

            const className = `relative flex ${cellSize} items-center justify-center overflow-hidden rounded-sm ${overlay} ${
              interactive ? 'cursor-pointer hover:brightness-95' : ''
            }`

            if (interactive && onCellClick) {
              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  title={titleParts.join(' · ')}
                  aria-label={`${r + 1}행 ${c + 1}열, ${titleParts.join(', ')}`}
                  className={className}
                  onClick={() => onCellClick(r, c)}
                >
                  {content}
                </button>
              )
            }

            return (
              <div
                key={key}
                role="gridcell"
                title={titleParts.join(' · ')}
                aria-label={`${r + 1}행 ${c + 1}열, ${titleParts.join(', ')}`}
                className={className}
              >
                {content}
              </div>
            )
          })
        )}
      </div>
      {state && (
        <p className="mt-2 text-xs text-slate-500">
          {ALGORITHM_LABEL[state.algorithm]} · 방문 {state.visitedCount}칸
          {state.status === 'found' &&
            ` · 경로 ${state.pathLength}칸 · 총비용 ${state.pathCost}`}
          {state.status === 'failed' && ' · 길을 찾지 못했습니다'}
        </p>
      )}
    </div>
  )
}

export function TerrainLegend({ showCost = false }: { showCost?: boolean }) {
  const items: Array<{ key: Terrain; label: string }> = [
    { key: 'plain', label: showCost ? '평지(1)' : '평지' },
    { key: 'forest', label: showCost ? '숲(3)' : '숲' },
    { key: 'swamp', label: showCost ? '늪(5)' : '늪' },
    { key: 'wall', label: '벽' },
  ]
  return (
    <ul className="flex flex-wrap gap-3 text-xs text-slate-600">
      {items.map(item => (
        <li key={item.key} className="flex items-center gap-1.5">
          <span className={`inline-block h-3.5 w-3.5 rounded-sm ${TERRAIN_STYLE[item.key]}`} aria-hidden />
          {item.label}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3.5 w-3.5 rounded-sm bg-blue-100" aria-hidden />
        방문함
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3.5 w-3.5 rounded-sm bg-sky-200" aria-hidden />
        다음에 볼 칸
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3.5 w-3.5 rounded-sm bg-amber-300" aria-hidden />
        찾은 경로
      </li>
    </ul>
  )
}
