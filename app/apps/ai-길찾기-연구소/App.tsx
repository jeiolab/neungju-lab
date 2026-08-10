'use client'

import { useCallback, useState } from 'react'
import {
  ModuleFrame,
  Panel,
  ReflectionPanel,
  ResultActions,
  buildResult,
  downloadCsv,
  downloadJson,
  printReport,
  resultToCsvRows,
  PATHFINDING_STAGE_GUIDES,
  PATHFINDING_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import AdvancedLab from './components/AdvancedLab'
import BeginnerLab from './components/BeginnerLab'
import IntermediateLab from './components/IntermediateLab'
import { DATA_SEED, DATA_VERSION } from './data'
import { ALGORITHM_LABEL } from './logic'
import type { Algorithm, GridMap, SearchState, SearchSummary } from './types'

const MODULE_ID = 'ai-길찾기-연구소'
const MODULE_NAME = 'AI 길찾기 연구소'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary:
      '같은 미로를 두 가지 방법으로 풀어 보고, 지나간 칸이 어떻게 다른지 눈으로 비교합니다.',
    points: ['깊이 우선과 너비 우선을 버튼으로 실행', '지나간 칸 수 비교', '수식 없이 그림으로 관찰'],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary: '미로를 직접 그리고 한 칸씩 실행하면서 스택과 큐에 무엇이 쌓이는지 확인합니다.',
    points: ['벽·시작·목표 직접 배치', '한 단계씩 실행과 초기화', '방문 순서 번호 표시'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary:
      '숲과 늪처럼 비용이 다른 지형을 넣고 최상 우선 탐색과 A*까지 네 가지를 겨루게 합니다.',
    points: ['g, h, f 값 실시간 표시', '방문 노드 수와 총비용 비교', '특정 알고리즘이 불리한 지도 만들기'],
    minutes: 45,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'whyDifferent',
      prompt: '같은 미로인데 지나간 칸이 달랐던 가장 큰 이유는 무엇일까요?',
      choices: [
        '한쪽은 깊게, 한쪽은 넓게 찾아가서',
        '컴퓨터 성능이 달라서',
        '목표 위치가 중간에 바뀌어서',
      ],
    },
    {
      id: 'learned',
      prompt: '이 실험에서 알게 된 점을 한 문장으로 써 보세요.',
      sentences: 1,
      placeholder: '예) 길을 찾는 순서만 달라도 들러 보는 칸이 ...',
    },
  ],
  intermediate: [
    {
      id: 'stackQueue',
      prompt: '스택과 큐에 칸이 쌓이는 방식이 탐색 모습에 어떻게 영향을 주었나요?',
      sentences: 2,
    },
    {
      id: 'editEffect',
      prompt: '벽을 세우거나 시작·목표를 옮기니 방문 순서가 어떻게 달라졌나요?',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'costVsLength',
      prompt: '경로 길이가 짧아도 총비용이 커질 수 있나요? 지형 비용을 근거로 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'mission',
      prompt:
        '미션(A*가 BFS보다 적게 방문, 또는 최상 우선이 최적보다 비싼 경로)을 어떻게 만들었거나, 만들지 못했다면 어떤 지도가 필요할까요?',
      sentences: 3,
    },
    {
      id: 'limit',
      prompt: '이 격자 실험만으로는 알 수 없어서, 실제 내비게이션에서 더 확인해야 할 조건은 무엇인가요?',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

interface BeginnerResult {
  presetId: string
  dfs: SearchState
  bfs: SearchState
}

interface IntermediateSnapshot {
  map: GridMap
  algorithm: Algorithm
  state: SearchState | null
}

interface AdvancedSnapshot {
  map: GridMap
  algorithm: Algorithm
  state: SearchState | null
  summaries: SearchSummary[]
  missionAStarLessThanBfs: boolean
  missionGreedySuboptimal: boolean
}

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [beginnerResult, setBeginnerResult] = useState<BeginnerResult | null>(null)
  const [intermediate, setIntermediate] = useState<IntermediateSnapshot | null>(null)
  const [advanced, setAdvanced] = useState<AdvancedSnapshot | null>(null)
  const [reflection, setReflection] = useState<Record<string, string>>({})
  const [labKey, setLabKey] = useState(0)

  const handleReset = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setBeginnerResult(null)
    setIntermediate(null)
    setAdvanced(null)
    setReflection({})
    setLabKey(k => k + 1)
  }, [])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setReflection(prev => ({ ...prev, [id]: value }))
  }, [])

  const handleBeginnerCompared = useCallback((payload: BeginnerResult) => {
    setBeginnerResult(payload)
  }, [])

  const handleIntermediateUpdate = useCallback((payload: IntermediateSnapshot) => {
    setIntermediate(payload)
  }, [])

  const handleAdvancedUpdate = useCallback((payload: AdvancedSnapshot) => {
    setAdvanced(payload)
  }, [])

  const buildExport = useCallback(
    (current: Difficulty) => {
      if (current === 'beginner') {
        return buildResult({
          moduleId: MODULE_ID,
          moduleName: MODULE_NAME,
          difficulty: current,
          version: DATA_VERSION,
          inputs: {
            지도: beginnerResult?.presetId ?? null,
            데이터seed: DATA_SEED,
          },
          observations: {
            DFS방문칸: beginnerResult?.dfs.visitedCount ?? null,
            BFS방문칸: beginnerResult?.bfs.visitedCount ?? null,
            DFS경로길이: beginnerResult?.dfs.pathLength ?? null,
            BFS경로길이: beginnerResult?.bfs.pathLength ?? null,
          },
          metrics: {
            DFS방문: beginnerResult?.dfs.visitedCount ?? 0,
            BFS방문: beginnerResult?.bfs.visitedCount ?? 0,
            DFS경로길이: beginnerResult?.dfs.pathLength ?? 0,
            BFS경로길이: beginnerResult?.bfs.pathLength ?? 0,
          },
          reflection,
        })
      }

      if (current === 'intermediate') {
        return buildResult({
          moduleId: MODULE_ID,
          moduleName: MODULE_NAME,
          difficulty: current,
          version: DATA_VERSION,
          inputs: {
            알고리즘: intermediate ? ALGORITHM_LABEL[intermediate.algorithm] : null,
            지도크기: intermediate
              ? `${intermediate.map.rows}x${intermediate.map.cols}`
              : null,
            데이터seed: DATA_SEED,
          },
          observations: {
            방문칸: intermediate?.state?.visitedCount ?? null,
            경로길이: intermediate?.state?.pathLength ?? null,
            상태: intermediate?.state?.status ?? null,
            프론티어크기: intermediate?.state?.frontier.length ?? null,
          },
          metrics: {
            방문칸: intermediate?.state?.visitedCount ?? 0,
            경로길이: intermediate?.state?.pathLength ?? 0,
            단계수: intermediate?.state?.stepCount ?? 0,
          },
          reflection,
        })
      }

      const summaryMetrics: Record<string, number | string> = {}
      advanced?.summaries.forEach(row => {
        const label = ALGORITHM_LABEL[row.algorithm]
        summaryMetrics[`${label}_방문`] = row.visitedCount
        summaryMetrics[`${label}_경로길이`] = row.status === 'found' ? row.pathLength : '실패'
        summaryMetrics[`${label}_총비용`] = row.status === 'found' ? row.pathCost : '실패'
      })

      return buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          보고있는알고리즘: advanced ? ALGORITHM_LABEL[advanced.algorithm] : null,
          지도크기: advanced ? `${advanced.map.rows}x${advanced.map.cols}` : null,
          데이터seed: DATA_SEED,
        },
        observations: {
          미션_A스타가BFS보다적게방문: advanced?.missionAStarLessThanBfs ?? false,
          미션_최상우선이비최적: advanced?.missionGreedySuboptimal ?? false,
          비교표행수: advanced?.summaries.length ?? 0,
        },
        metrics: {
          ...summaryMetrics,
          현재방문: advanced?.state?.visitedCount ?? 0,
          현재총비용: advanced?.state?.pathCost ?? 0,
        },
        reflection,
      })
    },
    [beginnerResult, intermediate, advanced, reflection]
  )

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(reflection).some(value => value.trim().length > 0)
      if (answered) return 'reflect'

      if (current === 'beginner') {
        if (!beginnerResult) return 'intro'
        return 'result'
      }

      if (current === 'intermediate') {
        if (!intermediate?.state) return 'explore'
        if (intermediate.state.status === 'found' || intermediate.state.status === 'failed') {
          return 'result'
        }
        if (intermediate.state.visitedCount > 0) return 'challenge'
        return 'explore'
      }

      if (advanced?.summaries.length) return 'result'
      if (advanced?.state && advanced.state.stepCount > 0) return 'challenge'
      return 'explore'
    },
    [reflection, beginnerResult, intermediate, advanced]
  )

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="같은 미로인데 왜 알고리즘마다 지나가는 길이 다를까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={PATHFINDING_STAGE_GUIDES}
      learningSupport={PATHFINDING_LEARNING}
      notice="교육용으로 단순화한 격자 지도를 사용합니다. 실제 내비게이션은 훨씬 복잡한 조건을 함께 계산합니다."
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div key={`${current}-${labKey}`} className="space-y-4">
          {current === 'beginner' && <BeginnerLab onCompared={handleBeginnerCompared} />}
          {current === 'intermediate' && (
            <IntermediateLab onUpdate={handleIntermediateUpdate} />
          )}
          {current === 'advanced' && <AdvancedLab onUpdate={handleAdvancedUpdate} />}

          <ReflectionPanel
            difficulty={current}
            questions={REFLECTION_QUESTIONS[current]}
            answers={reflection}
            onChange={handleReflectionChange}
          />

          <Panel title="결과 저장하기">
            <ResultActions
              onDownloadJson={() => downloadJson(MODULE_ID, buildExport(current))}
              onDownloadCsv={() =>
                downloadCsv(MODULE_ID, resultToCsvRows(buildExport(current)))
              }
              onPrint={printReport}
            />
          </Panel>
        </div>
      )}
    </ModuleFrame>
  )
}
