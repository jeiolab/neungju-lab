'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Play, RotateCcw, SkipForward } from 'lucide-react'
import { Button, Callout, ExplainBox, Panel, StatCard } from '../../_ai-lab-shared'
import { ADVANCED_PRESETS, MISSION } from '../data'
import {
  ALGORITHM_HINT,
  ALGORITHM_LABEL,
  applyEdit,
  cloneMap,
  createSearch,
  runSearch,
  stepSearch,
  toSummary,
} from '../logic'
import type { Algorithm, EditTool, GridMap, SearchState, SearchSummary } from '../types'
import MazeGrid, { TerrainLegend } from './MazeGrid'

const ALL_ALGORITHMS: Algorithm[] = ['dfs', 'bfs', 'gbfs', 'astar']

const EDIT_TOOLS: Array<{ id: EditTool; label: string }> = [
  { id: 'plain', label: '평지(1)' },
  { id: 'forest', label: '숲(3)' },
  { id: 'swamp', label: '늪(5)' },
  { id: 'wall', label: '벽' },
  { id: 'start', label: '시작' },
  { id: 'goal', label: '목표' },
]

export default function AdvancedLab({
  onUpdate,
}: {
  onUpdate: (payload: {
    map: GridMap
    algorithm: Algorithm
    state: SearchState | null
    summaries: SearchSummary[]
    missionAStarLessThanBfs: boolean
    missionGreedySuboptimal: boolean
  }) => void
}) {
  const [presetId, setPresetId] = useState(ADVANCED_PRESETS[0].id)
  const [map, setMap] = useState<GridMap>(() => cloneMap(ADVANCED_PRESETS[0].map))
  const [tool, setTool] = useState<EditTool>('forest')
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar')
  const [state, setState] = useState<SearchState | null>(null)
  const [summaries, setSummaries] = useState<SearchSummary[]>([])

  const loadPreset = useCallback((id: string) => {
    const preset = ADVANCED_PRESETS.find(item => item.id === id) ?? ADVANCED_PRESETS[0]
    setPresetId(preset.id)
    setMap(cloneMap(preset.map))
    setState(null)
    setSummaries([])
  }, [])

  const missionAStarLessThanBfs = useMemo(() => {
    const bfs = summaries.find(item => item.algorithm === 'bfs')
    const astar = summaries.find(item => item.algorithm === 'astar')
    if (!bfs || !astar || bfs.status !== 'found' || astar.status !== 'found') return false
    return astar.visitedCount < bfs.visitedCount
  }, [summaries])

  const missionGreedySuboptimal = useMemo(() => {
    const gbfs = summaries.find(item => item.algorithm === 'gbfs')
    const astar = summaries.find(item => item.algorithm === 'astar')
    if (!gbfs || !astar || gbfs.status !== 'found' || astar.status !== 'found') return false
    return gbfs.pathCost > astar.pathCost
  }, [summaries])

  useEffect(() => {
    onUpdate({
      map,
      algorithm,
      state,
      summaries,
      missionAStarLessThanBfs,
      missionGreedySuboptimal,
    })
  }, [map, algorithm, state, summaries, missionAStarLessThanBfs, missionGreedySuboptimal, onUpdate])

  const handleCell = useCallback(
    (r: number, c: number) => {
      setMap(prev => applyEdit(prev, r, c, tool))
      setState(null)
      setSummaries([])
    },
    [tool]
  )

  const handleStep = useCallback(() => {
    setState(prev => {
      if (!prev || prev.algorithm !== algorithm) return createSearch(map, algorithm)
      return stepSearch(map, prev)
    })
  }, [map, algorithm])

  const handleRunOne = useCallback(() => {
    const done = runSearch(map, algorithm)
    setState(done)
  }, [map, algorithm])

  const handleCompareAll = useCallback(() => {
    const next = ALL_ALGORITHMS.map(id => toSummary(runSearch(map, id)))
    setSummaries(next)
    const focused = next.find(item => item.algorithm === algorithm)
    if (focused) {
      setState(runSearch(map, algorithm))
    }
  }, [map, algorithm])

  const showCosts = algorithm === 'gbfs' || algorithm === 'astar'

  return (
    <div className="space-y-4">
      <Panel
        title="1단계. 비용이 다른 지형 만들기"
        description="평지·숲·늪의 통과 비용이 다릅니다. 같은 ‘짧은 길’이라도 총비용은 달라질 수 있습니다."
      >
        <div className="flex flex-wrap gap-2">
          {ADVANCED_PRESETS.map(item => (
            <Button
              key={item.id}
              variant={item.id === presetId ? 'primary' : 'secondary'}
              onClick={() => loadPreset(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {ADVANCED_PRESETS.find(item => item.id === presetId)?.description}
        </p>
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
      </Panel>

      <Panel title="2단계. 네 가지 알고리즘 실험">
        <div className="mb-3 flex flex-wrap gap-2">
          {ALL_ALGORITHMS.map(id => (
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
        {showCosts && (
          <p className="mt-2 text-xs text-slate-600">
            하늘색(다음에 볼 칸)과 보라색(지금 펼친 칸)에 g(지금까지 비용), h(남은 거리 추정),
            {algorithm === 'astar' ? ' f(g+h)' : ' h만으로 고름'}가 표시됩니다.
          </p>
        )}

        <div className="mt-3">
          <TerrainLegend showCost />
        </div>

        <div className="mt-3">
          <MazeGrid
            map={map}
            state={state}
            showVisitOrder
            showCosts={showCosts}
            showTerrainCost
            interactive
            onCellClick={handleCell}
            dense
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="primary" onClick={handleStep}>
            <SkipForward className="h-4 w-4" aria-hidden />
            한 칸 진행
          </Button>
          <Button onClick={handleRunOne}>
            <Play className="h-4 w-4" aria-hidden />
            이 알고리즘 끝까지
          </Button>
          <Button onClick={handleCompareAll}>네 가지 비교표 만들기</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setState(null)
              setSummaries([])
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            결과 지우기
          </Button>
        </div>

        {state?.status === 'found' && (
          <div className="mt-3 space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <StatCard label="방문 노드" value={state.visitedCount} unit="칸" />
              <StatCard label="경로 길이" value={state.pathLength} unit="칸" />
              <StatCard label="총비용" value={state.pathCost} tone="good" />
            </div>
            <AlgorithmExplain algorithm={algorithm} state={state} />
          </div>
        )}
      </Panel>

      {summaries.length > 0 && (
        <Panel title="3단계. 비교표">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="mb-2 text-left text-xs text-slate-600">
                같은 지도에서 네 알고리즘을 끝까지 실행한 결과입니다.
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                  >
                    알고리즘
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-200 px-3 py-2 text-right text-xs font-bold text-slate-700"
                  >
                    방문 노드
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-200 px-3 py-2 text-right text-xs font-bold text-slate-700"
                  >
                    경로 길이
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-200 px-3 py-2 text-right text-xs font-bold text-slate-700"
                  >
                    총비용
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                  >
                    결과
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaries.map(row => (
                  <tr key={row.algorithm}>
                    <th
                      scope="row"
                      className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-800"
                    >
                      {ALGORITHM_LABEL[row.algorithm]}
                    </th>
                    <td className="border-b border-slate-100 px-3 py-2 text-right tabular-nums text-slate-700">
                      {row.visitedCount}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right tabular-nums text-slate-700">
                      {row.status === 'found' ? row.pathLength : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right tabular-nums text-slate-700">
                      {row.status === 'found' ? row.pathCost : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                      {row.status === 'found' ? '도착' : '실패'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <CompareExplain summaries={summaries} />
          </div>
        </Panel>
      )}

      <Panel title={MISSION.title} description={MISSION.description}>
        <ul className="space-y-2 text-sm text-slate-700">
          {MISSION.goals.map((goal, index) => {
            const ok = index === 0 ? missionAStarLessThanBfs : missionGreedySuboptimal
            return (
              <li
                key={goal}
                className={`rounded-lg border px-3 py-2 ${
                  ok ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
              >
                <span className="font-semibold">{ok ? '달성 · ' : '미달성 · '}</span>
                {goal}
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          팁: ‘넓은 운동장’에서는 A*가 BFS보다 적게 방문하기 쉽고, ‘숲 함정’에서는 최상 우선이
          비싼 길을 고르기 쉽습니다. 지도를 살짝 고쳐 가며 확인해 보세요.
        </p>
      </Panel>
    </div>
  )
}

function AlgorithmExplain({
  algorithm,
  state,
}: {
  algorithm: Algorithm
  state: SearchState
}) {
  if (algorithm === 'astar') {
    return (
      <ExplainBox
        analogy="네비게이션이 ‘지금까지 온 거리’와 ‘앞으로 남았을 것 같은 거리’를 더해 가장 유망한 길을 고르는 것과 비슷합니다."
        steps={[
          'g는 시작점에서 여기까지 실제로 든 비용(평지·숲·늪 합)입니다.',
          'h는 목표까지 남은 거리를 대충 짐작한 값입니다.',
          'f = g + h 로, “이미 든 값 + 앞으로 들 것 같은 값”이 작은 칸을 먼저 봅니다.',
          `이번 결과는 방문 ${state.visitedCount}칸, 총비용 ${state.pathCost}입니다.`,
        ]}
        takeaway="A*는 지금까지 비용과 남은 거리 짐작을 함께 보아서, 싼 길을 비교적 효율적으로 찾습니다."
      />
    )
  }

  if (algorithm === 'gbfs') {
    return (
      <ExplainBox
        analogy="목표 쪽을 향해 보이는 길로만 서둘러 가면, 중간에 숲·늪처럼 비싼 길을 고를 수 있습니다."
        steps={[
          '최상 우선은 h(목표에 가까워 보이는 정도)만 보고 다음 칸을 고릅니다.',
          '이미 든 비용 g는 보지 않아서, 짧아 보여도 비싼 길을 탈 수 있습니다.',
          `이번 결과는 방문 ${state.visitedCount}칸, 총비용 ${state.pathCost}입니다.`,
        ]}
        takeaway="목표에만 급하게 다가가면, 총비용이 더 큰 길을 찾을 수 있습니다."
      />
    )
  }

  if (algorithm === 'bfs') {
    return (
      <ExplainBox
        analogy="가까운 칸부터 넓게 확인하는 방식입니다. 칸마다 비용이 다르면 ‘짧은 칸 수’와 ‘싼 총비용’이 다를 수 있습니다."
        steps={[
          '너비 우선은 시작에서 가까운 칸부터 순서대로 봅니다.',
          '평지에서는 칸 수가 가장 짧은 길을 찾지만, 숲·늪이 있으면 총비용은 더 클 수 있습니다.',
          `이번 결과는 방문 ${state.visitedCount}칸, 경로 ${state.pathLength}칸, 총비용 ${state.pathCost}입니다.`,
        ]}
        takeaway="BFS는 ‘칸 수’에는 강하지만, 지형 비용까지 싸게 만든다는 뜻은 아닙니다."
      />
    )
  }

  return (
    <ExplainBox
      analogy="한 복도로 깊게 들어갔다가, 막히면 되돌아오는 방식입니다."
      steps={[
        '깊이 우선은 한 방향으로 깊게 파고듭니다.',
        '막다른 길이 많으면 방문 칸이 늘어나고, 찾은 길이 가장 싸다는 보장도 없습니다.',
        `이번 결과는 방문 ${state.visitedCount}칸, 총비용 ${state.pathCost}입니다.`,
      ]}
      takeaway="DFS는 길을 찾을 수 있지만, 가장 짧거나 가장 싼 길을 보장하지는 않습니다."
    />
  )
}

function CompareExplain({ summaries }: { summaries: SearchSummary[] }) {
  const found = summaries.filter(item => item.status === 'found')
  const dfs = found.find(item => item.algorithm === 'dfs')
  const bfs = found.find(item => item.algorithm === 'bfs')
  const gbfs = found.find(item => item.algorithm === 'gbfs')
  const astar = found.find(item => item.algorithm === 'astar')

  const steps: string[] = [
    '같은 지도라도, 다음에 볼 칸을 고르는 규칙이 다르면 방문 수·경로·총비용이 달라집니다.',
  ]

  if (dfs && bfs) {
    if (dfs.visitedCount > bfs.visitedCount) {
      steps.push(
        `DFS(${dfs.visitedCount}칸)가 BFS(${bfs.visitedCount}칸)보다 더 많이 들렀습니다. 깊게 들어가다 멀리 헤맬 수 있기 때문입니다.`
      )
    } else if (bfs.visitedCount > dfs.visitedCount) {
      steps.push(
        `BFS(${bfs.visitedCount}칸)가 DFS(${dfs.visitedCount}칸)보다 더 많이 들렀습니다. 넓게 퍼지며 주변을 먼저 확인하기 때문입니다.`
      )
    }
  }

  if (astar && bfs && astar.visitedCount < bfs.visitedCount) {
    steps.push(
      `A*(${astar.visitedCount}칸)가 BFS(${bfs.visitedCount}칸)보다 적게 방문했습니다. g와 h를 함께 보아 유망한 쪽을 먼저 보기 때문입니다.`
    )
  }

  if (gbfs && astar && gbfs.pathCost > astar.pathCost) {
    steps.push(
      `최상 우선 총비용 ${gbfs.pathCost}이 A* ${astar.pathCost}보다 큽니다. 목표만 보고 가면 비싼 지형을 탈 수 있습니다.`
    )
  } else if (astar) {
    steps.push(
      `A* 총비용은 ${astar.pathCost}입니다. g(지금까지)와 h(남은 짐작)를 더한 f가 작은 칸을 고릅니다.`
    )
  }

  return (
    <ExplainBox
      analogy="같은 학교에서 출구를 찾더라도, ‘깊게’·‘넓게’·‘목표가 가까워 보이는 쪽’·‘지금까지+앞으로’를 보면 걸음 수와 비용이 달라집니다."
      steps={steps}
      takeaway="방문이 많다고 나쁜 것만은 아니고, 총비용이 낮다고 항상 방문이 적은 것도 아닙니다. 무엇을 최적화했는지 함께 보세요."
    />
  )
}
