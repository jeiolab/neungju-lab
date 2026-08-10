'use client'

import { useCallback, useEffect, useState } from 'react'
import { Redo2, RotateCcw, SkipForward } from 'lucide-react'
import { Button, Callout, ExplainBox, Panel, StatCard } from '../../_ai-lab-shared'
import { INTERMEDIATE_PRESETS } from '../data'
import {
  ALGORITHM_HINT,
  ALGORITHM_LABEL,
  applyEdit,
  cloneMap,
  createSearch,
  stepSearch,
} from '../logic'
import type { Algorithm, EditTool, GridMap, SearchState } from '../types'
import MazeGrid, { TerrainLegend } from './MazeGrid'

const EDIT_TOOLS: Array<{ id: EditTool; label: string }> = [
  { id: 'wall', label: '벽' },
  { id: 'plain', label: '지우기(평지)' },
  { id: 'start', label: '시작(S)' },
  { id: 'goal', label: '목표(G)' },
]

export default function IntermediateLab({
  onUpdate,
}: {
  onUpdate: (payload: {
    map: GridMap
    algorithm: Algorithm
    state: SearchState | null
  }) => void
}) {
  const [presetId, setPresetId] = useState(INTERMEDIATE_PRESETS[1].id)
  const [map, setMap] = useState<GridMap>(() =>
    cloneMap(INTERMEDIATE_PRESETS[1].map)
  )
  const [tool, setTool] = useState<EditTool>('wall')
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs')
  const [state, setState] = useState<SearchState | null>(null)

  const resetSearch = useCallback(() => {
    setState(null)
  }, [])

  const loadPreset = useCallback((id: string) => {
    const preset = INTERMEDIATE_PRESETS.find(item => item.id === id) ?? INTERMEDIATE_PRESETS[0]
    setPresetId(preset.id)
    setMap(cloneMap(preset.map))
    setState(null)
  }, [])

  useEffect(() => {
    onUpdate({ map, algorithm, state })
  }, [map, algorithm, state, onUpdate])

  const handleCell = useCallback(
    (r: number, c: number) => {
      setMap(prev => applyEdit(prev, r, c, tool))
      setState(null)
    },
    [tool]
  )

  const handleInit = useCallback(() => {
    setState(createSearch(map, algorithm))
  }, [map, algorithm])

  const handleStep = useCallback(() => {
    setState(prev => {
      if (!prev) return createSearch(map, algorithm)
      return stepSearch(map, prev)
    })
  }, [map, algorithm])

  const frontierLabel = algorithm === 'dfs' ? '스택(나중에 넣은 칸이 먼저)' : '큐(먼저 넣은 칸이 먼저)'

  return (
    <div className="space-y-4">
      <Panel
        title="1단계. 미로 그리기"
        description="칸을 눌러 벽·시작·목표를 배치한 뒤, 한 칸씩 탐색을 진행합니다."
      >
        <div className="flex flex-wrap gap-2">
          {INTERMEDIATE_PRESETS.map(item => (
            <Button
              key={item.id}
              variant={item.id === presetId ? 'primary' : 'secondary'}
              onClick={() => loadPreset(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EDIT_TOOLS.map(item => (
            <Button
              key={item.id}
              variant={tool === item.id ? 'primary' : 'secondary'}
              onClick={() => setTool(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          선택한 도구로 칸을 누릅니다. 시작과 목표는 겹칠 수 없습니다.
        </p>
      </Panel>

      <Panel title="2단계. 한 칸씩 탐색하기">
        <div className="mb-3 flex flex-wrap gap-2">
          {(['dfs', 'bfs'] as const).map(id => (
            <Button
              key={id}
              variant={algorithm === id ? 'primary' : 'secondary'}
              onClick={() => {
                setAlgorithm(id)
                setState(null)
              }}
            >
              {ALGORITHM_LABEL[id]}
            </Button>
          ))}
        </div>
        <Callout tone="info">{ALGORITHM_HINT[algorithm]}</Callout>

        <div className="mt-3">
          <TerrainLegend />
        </div>

        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_240px]">
          <MazeGrid map={map} state={state} showVisitOrder interactive onCellClick={handleCell} />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={handleStep}>
                <SkipForward className="h-4 w-4" aria-hidden />
                한 칸 진행
              </Button>
              <Button onClick={handleInit}>
                <Redo2 className="h-4 w-4" aria-hidden />
                처음부터 준비
              </Button>
              <Button variant="ghost" onClick={resetSearch}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                탐색만 지우기
              </Button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold text-slate-700">{frontierLabel}</p>
              {state && state.frontier.length > 0 ? (
                <ol className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs text-slate-700">
                  {(algorithm === 'dfs' ? [...state.frontier].reverse() : state.frontier).map(
                    (node, index) => (
                      <li
                        key={`${node.r}-${node.c}-${index}`}
                        className="rounded bg-white px-2 py-1 tabular-nums"
                      >
                        {index === 0 ? '→ ' : ''}({node.r + 1}, {node.c + 1})
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <p className="mt-2 text-xs text-slate-500">비어 있습니다. ‘한 칸 진행’을 눌러 보세요.</p>
              )}
            </div>

            {state && (
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="방문한 칸" value={state.visitedCount} unit="칸" />
                <StatCard
                  label="상태"
                  value={
                    state.status === 'found'
                      ? '도착'
                      : state.status === 'failed'
                        ? '실패'
                        : state.status === 'ready'
                          ? '준비'
                          : '탐색 중'
                  }
                />
              </div>
            )}
          </div>
        </div>

        {state?.status === 'found' && (
          <div className="mt-3 space-y-3">
            <Callout tone="info" title="경로를 찾았습니다">
              칸 위의 숫자는 방문 순서입니다. {frontierLabel.split('(')[0].trim()}에 쌓였던 칸과
              지도의 하늘색 칸을 비교해 보세요.
            </Callout>
            <ExplainBox
              analogy={
                algorithm === 'dfs'
                  ? '복도에서 한쪽 끝까지 들어가 본 뒤, 막히면 직전 갈림길로 되돌아오는 방식입니다.'
                  : '엘리베이터 앞에서 가까운 층부터 차례로 확인하듯, 시작점에서 가까운 칸부터 봅니다.'
              }
              steps={
                algorithm === 'dfs'
                  ? [
                      '깊이 우선은 “나중에 넣은 칸을 먼저” 보는 스택을 씁니다.',
                      `이번 탐색은 ${state.visitedCount}칸을 들른 뒤 도착했습니다.`,
                      '한 길로 깊게 가다 보니, 목표와 반대쪽을 오래 헤맬 수 있습니다.',
                    ]
                  : [
                      '너비 우선은 “먼저 넣은 칸을 먼저” 보는 큐를 씁니다.',
                      `이번 탐색은 ${state.visitedCount}칸을 들른 뒤 도착했습니다.`,
                      '가까운 칸부터 넓게 보기 때문에, 평지에서는 칸 수가 가장 짧은 길을 찾습니다.',
                    ]
              }
              takeaway={
                algorithm === 'dfs'
                  ? 'DFS는 깊게 파고들기 때문에 방문 순서가 한쪽으로 길게 늘어질 수 있습니다.'
                  : 'BFS는 물결처럼 퍼지며, 평지에서는 가장 짧은 칸 수 경로를 보장합니다.'
              }
            />
          </div>
        )}
      </Panel>
    </div>
  )
}
