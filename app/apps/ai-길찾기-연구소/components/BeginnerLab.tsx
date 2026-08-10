'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Zap } from 'lucide-react'
import { Button, Callout, ExplainBox, Panel, StatCard } from '../../_ai-lab-shared'
import { BEGINNER_PRESETS } from '../data'
import { ALGORITHM_LABEL, createSearch, runSearch, stepSearch } from '../logic'
import type { Algorithm, GridMap, SearchState } from '../types'
import MazeGrid, { TerrainLegend } from './MazeGrid'

type RunMode = 'animate' | 'instant'

export default function BeginnerLab({
  onCompared,
}: {
  onCompared: (payload: {
    presetId: string
    dfs: SearchState
    bfs: SearchState
  }) => void
}) {
  const [presetId, setPresetId] = useState(BEGINNER_PRESETS[0].id)
  const preset = BEGINNER_PRESETS.find(item => item.id === presetId) ?? BEGINNER_PRESETS[0]
  const map: GridMap = preset.map

  const [dfsState, setDfsState] = useState<SearchState | null>(null)
  const [bfsState, setBfsState] = useState<SearchState | null>(null)
  const [running, setRunning] = useState<Algorithm | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dfsRef = useRef<SearchState | null>(null)
  const bfsRef = useRef<SearchState | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setRunning(null)
  }, [])

  useEffect(() => () => stopTimer(), [stopTimer])

  useEffect(() => {
    stopTimer()
    dfsRef.current = null
    bfsRef.current = null
    setDfsState(null)
    setBfsState(null)
  }, [presetId, stopTimer])

  const tryReport = useCallback(
    (dfs: SearchState | null, bfs: SearchState | null) => {
      if (dfs?.status === 'found' && bfs?.status === 'found') {
        onCompared({ presetId, dfs, bfs })
      }
    },
    [onCompared, presetId]
  )

  const runAlgorithm = useCallback(
    (algorithm: Algorithm, mode: RunMode) => {
      stopTimer()
      const setter = algorithm === 'dfs' ? setDfsState : setBfsState
      const ref = algorithm === 'dfs' ? dfsRef : bfsRef

      if (mode === 'instant') {
        const done = runSearch(map, algorithm)
        ref.current = done
        setter(done)
        tryReport(dfsRef.current, bfsRef.current)
        return
      }

      let state = createSearch(map, algorithm)
      ref.current = state
      setter(state)
      setRunning(algorithm)
      timerRef.current = setInterval(() => {
        state = stepSearch(map, state)
        ref.current = state
        setter({ ...state })
        if (state.status === 'found' || state.status === 'failed') {
          stopTimer()
          tryReport(dfsRef.current, bfsRef.current)
        }
      }, 120)
    },
    [map, stopTimer, tryReport]
  )

  const bothDone = dfsState?.status === 'found' && bfsState?.status === 'found'
  const visitGap =
    bothDone && dfsState && bfsState ? Math.abs(dfsState.visitedCount - bfsState.visitedCount) : 0

  return (
    <div className="space-y-4">
      <Panel
        title="1단계. 미로 고르기"
        description="같은 미로를 두 가지 방법으로 풀어 보며, 지나간 칸이 어떻게 다른지 눈으로 비교합니다."
      >
        <div className="flex flex-wrap gap-2">
          {BEGINNER_PRESETS.map(item => (
            <Button
              key={item.id}
              variant={item.id === presetId ? 'primary' : 'secondary'}
              onClick={() => setPresetId(item.id)}
              disabled={running !== null}
            >
              {item.name}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-600">{preset.description}</p>
      </Panel>

      <Panel title="2단계. 깊이 우선과 너비 우선 실행하기">
        <div className="mb-3">
          <TerrainLegend />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {(
            [
              {
                algorithm: 'dfs' as const,
                state: dfsState,
                title: '깊이 우선(DFS)',
                hint: '한 길로 깊게',
              },
              {
                algorithm: 'bfs' as const,
                state: bfsState,
                title: '너비 우선(BFS)',
                hint: '가까운 칸부터 넓게',
              },
            ] as const
          ).map(block => (
            <div key={block.algorithm} className="rounded-lg border border-slate-200 p-3">
              <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
              <p className="mt-0.5 text-xs text-slate-600">{block.hint}</p>
              <div className="mt-3">
                <MazeGrid
                  map={map}
                  state={block.state}
                  showVisitOrder
                  compareVisit={
                    block.algorithm === 'dfs' ? bfsState?.visitOrder : dfsState?.visitOrder
                  }
                  comparePath={block.algorithm === 'dfs' ? bfsState?.path : dfsState?.path}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  disabled={running !== null}
                  onClick={() => runAlgorithm(block.algorithm, 'animate')}
                >
                  <Play className="h-4 w-4" aria-hidden />
                  천천히 보기
                </Button>
                <Button
                  disabled={running !== null}
                  onClick={() => runAlgorithm(block.algorithm, 'instant')}
                >
                  <Zap className="h-4 w-4" aria-hidden />
                  바로 결과
                </Button>
              </div>
              {block.state?.status === 'found' && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <StatCard
                    label="지나간 칸"
                    value={block.state.visitedCount}
                    unit="칸"
                    hint="목표를 찾을 때까지 펼쳐 본 칸"
                  />
                  <StatCard
                    label="경로 길이"
                    value={block.state.pathLength}
                    unit="칸"
                    hint="시작부터 목표까지 이은 칸 수"
                    tone="good"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {running && (
          <p className="mt-3 text-xs font-medium text-primary">
            {ALGORITHM_LABEL[running]}을(를) 한 칸씩 보여 주는 중입니다…
          </p>
        )}
      </Panel>

      {bothDone && dfsState && bfsState && (
        <Panel title="3단계. 무엇이 달랐을까?">
          <div className="grid gap-2 sm:grid-cols-3">
            <StatCard label="DFS 방문" value={dfsState.visitedCount} unit="칸" />
            <StatCard label="BFS 방문" value={bfsState.visitedCount} unit="칸" />
            <StatCard
              label="방문 칸 차이"
              value={visitGap}
              unit="칸"
              tone={visitGap > 0 ? 'warn' : 'neutral'}
              hint={
                bfsState.pathLength <= dfsState.pathLength
                  ? 'BFS는 칸 수가 가장 짧은 경로를 찾습니다(평지일 때).'
                  : '두 경로의 길이를 지도에서 비교해 보세요.'
              }
            />
          </div>
          <div className="mt-3">
            <Callout tone="info" title="관찰 포인트">
              노란 칸이 찾은 경로입니다. 파란 칸은 길을 찾는 동안 들러 본 칸입니다. 같은 목표인데도
              들러 본 칸의 모양과 개수가 다를 수 있습니다.
            </Callout>
          </div>

          <div className="mt-4">
            <ExplainBox
              analogy="학교 복도에서 출구를 찾을 때, 한 갈래로 끝까지 들어가 보는 사람과 가까운 갈래부터 순서대로 확인하는 사람이 있습니다."
              steps={[
                '깊이 우선(DFS)은 한 길로 깊게 들어갔다가, 막히면 되돌아옵니다.',
                '너비 우선(BFS)은 시작점에서 가까운 칸부터 넓게 퍼져 나갑니다.',
                dfsState.visitedCount > bfsState.visitedCount
                  ? `이번엔 DFS가 ${dfsState.visitedCount}칸, BFS가 ${bfsState.visitedCount}칸을 들렀습니다. DFS는 깊게 들어가다 보니 더 멀리 헤맬 수 있습니다.`
                  : bfsState.visitedCount > dfsState.visitedCount
                    ? `이번엔 BFS가 ${bfsState.visitedCount}칸, DFS가 ${dfsState.visitedCount}칸을 들렀습니다. 미로 모양에 따라 넓게 퍼지는 쪽이 더 많이 볼 수도 있습니다.`
                    : `이번엔 둘 다 ${dfsState.visitedCount}칸을 들렀습니다. 방문 수는 같아도 지나간 모양은 다를 수 있습니다.`,
                bfsState.pathLength < dfsState.pathLength
                  ? `경로 길이는 BFS ${bfsState.pathLength}칸, DFS ${dfsState.pathLength}칸입니다. 평지에서는 BFS가 칸 수가 가장 짧은 길을 찾습니다.`
                  : bfsState.pathLength === dfsState.pathLength
                    ? `둘 다 경로 길이 ${bfsState.pathLength}칸을 찾았습니다. 도착 길은 같아도, 찾는 도중에 본 칸은 다를 수 있습니다.`
                    : `경로 길이는 DFS ${dfsState.pathLength}칸, BFS ${bfsState.pathLength}칸입니다. 지도에서 노란 길을 비교해 보세요.`,
              ]}
              takeaway="같은 미로라도 ‘깊게’ 찾을지 ‘넓게’ 찾을지에 따라 들러 본 칸과 찾은 길이 달라집니다."
            />
          </div>
        </Panel>
      )}
    </div>
  )
}
