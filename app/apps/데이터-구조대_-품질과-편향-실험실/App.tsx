'use client'

import { useCallback, useMemo, useState } from 'react'
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
  DATA_RESCUE_STAGE_GUIDES,
  DATA_RESCUE_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import BeginnerLab from './components/BeginnerLab'
import ExperimentLab from './components/ExperimentLab'
import {
  DATA_DICTIONARY,
  DATA_SEED,
  DATA_VERSION,
  MISSION,
  PREPROCESS_CARDS,
  buildCleanTrainingSet,
  buildMessyTrainingSet,
  buildTestSet,
} from './data'
import { applyPreprocess, detectQuality, evaluate, knnPredict, toPercent } from './logic'
import type { PreprocessId } from './types'

const MODULE_ID = '데이터-구조대'
const MODULE_NAME = '데이터 구조대'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary:
      '잘 정리된 데이터와 문제가 섞인 데이터를 같은 인공지능에게 각각 주고, 시험 성적이 얼마나 달라지는지 봅니다.',
    points: ['버튼 두 개로 실험', '맞힌 개수로 결과 확인', '빈칸과 이상한 값 찾아보기'],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary:
      '데이터의 문제를 직접 찾아내고 고치는 방법을 골라 적용한 뒤, 고치기 전과 후를 비교합니다.',
    points: ['빈칸·이상값·중복 확인', '전처리 카드 네 장 적용', '혼동행렬과 그룹별로 놓친 학생 수 보기'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary:
      '전처리 아홉 가지와 이웃 수를 조절하며 전체 성능과 그룹 간 격차를 함께 개선하는 미션에 도전합니다.',
    points: ['정밀도·재현율과 그룹별 성능', `비용 ${MISSION.budget}점 정비 미션`, '공정성 지표의 한계 이해'],
    minutes: 45,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'cause',
      prompt: '두 인공지능의 성적이 달랐던 가장 큰 이유는 무엇일까요?',
      choices: ['데이터에 빈칸과 이상한 값이 있어서', '컴퓨터의 성능이 달라서', '시험 문제가 더 어려워서'],
    },
    {
      id: 'learned',
      prompt: '이 실험에서 알게 된 점을 한 문장으로 써 보세요.',
      sentences: 1,
      placeholder: '예) 인공지능이 똑똑해지려면 프로그램만 좋아서는 안 되고 ...',
    },
  ],
  intermediate: [
    {
      id: 'biggest',
      prompt: '가장 큰 영향을 준 데이터 문제는 무엇이었나요?',
      sentences: 2,
    },
    {
      id: 'change',
      prompt: '데이터를 고친 뒤 결과가 어떻게 달라졌나요? 좋아진 점과 아쉬운 점을 함께 써 보세요.',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'biggest',
      prompt: '가장 큰 영향을 준 데이터 문제는 무엇이며, 그렇게 판단한 근거는 무엇인가요?',
      sentences: 3,
    },
    {
      id: 'whoBenefits',
      prompt: '전처리를 적용한 뒤 누가 이익을 얻었고 누가 불이익을 얻었나요? 그룹별 지표를 근거로 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'unknown',
      prompt: '이 데이터만으로는 알 수 없어서 더 확인해야 할 정보는 무엇인가요?',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

type DatasetKey = 'clean' | 'messy'

export default function App() {
  const cleanRows = useMemo(() => buildCleanTrainingSet(), [])
  const messyRows = useMemo(() => buildMessyTrainingSet(), [])
  const testRows = useMemo(() => buildTestSet(), [])

  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [ranSets, setRanSets] = useState<DatasetKey[]>([])
  const [selected, setSelected] = useState<Set<PreprocessId>>(new Set())
  const [k, setK] = useState(3)
  const [hasRun, setHasRun] = useState(false)
  const [reflection, setReflection] = useState<Record<string, string>>({})

  const handleReset = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setRanSets([])
    setSelected(new Set())
    setK(3)
    setHasRun(false)
    setReflection({})
  }, [])

  const handleRunBeginner = useCallback((key: DatasetKey) => {
    setRanSets(prev => (prev.includes(key) ? prev : [...prev, key]))
  }, [])

  const handleToggle = useCallback((id: PreprocessId) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setHasRun(false)
  }, [])

  const handleClear = useCallback(() => {
    setSelected(new Set())
    setHasRun(false)
  }, [])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setReflection(prev => ({ ...prev, [id]: value }))
  }, [])

  /** 현재 화면에서 얻은 결과를 공통 스키마로 정리합니다. */
  const buildExport = useCallback(
    (current: Difficulty) => {
      const baseline = evaluate(testRows, knnPredict(messyRows, testRows, 3, false))

      if (current === 'beginner') {
        const cleanMetrics = evaluate(testRows, knnPredict(cleanRows, testRows, 3, false))
        return buildResult({
          moduleId: MODULE_ID,
          moduleName: MODULE_NAME,
          difficulty: current,
          version: DATA_VERSION,
          inputs: { 실행한실험: ranSets, 데이터seed: DATA_SEED },
          observations: {
            정리된데이터_맞힌수: `${cleanMetrics.correct}/${cleanMetrics.total}`,
            문제있는데이터_맞힌수: `${baseline.correct}/${baseline.total}`,
          },
          metrics: {
            정리된데이터_정확도: toPercent(cleanMetrics.accuracy),
            문제있는데이터_정확도: toPercent(baseline.accuracy),
            차이: toPercent(cleanMetrics.accuracy - baseline.accuracy),
          },
          reflection,
        })
      }

      const processed = applyPreprocess(messyRows, selected)
      const metrics = processed.blockedReason
        ? null
        : evaluate(
            testRows,
            knnPredict(processed.rows, testRows, k, processed.normalized, processed.excluded)
          )
      const appliedNames = PREPROCESS_CARDS.filter(card => selected.has(card.id)).map(
        card => card.name
      )
      const spent = PREPROCESS_CARDS.filter(card => selected.has(card.id)).reduce(
        (sum, card) => sum + card.cost,
        0
      )

      return buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          적용한전처리: appliedNames,
          이웃수k: k,
          사용한비용: spent,
          데이터seed: DATA_SEED,
        },
        observations: {
          학습에쓴줄수: processed.rows.length,
          제외한특성: Array.from(processed.excluded),
          처리요약: processed.log,
        },
        metrics: metrics
          ? {
              정확도: toPercent(metrics.accuracy),
              재현율: toPercent(metrics.recall),
              정밀도: toPercent(metrics.precision),
              그룹A재현율: toPercent(metrics.recallByGroup.A),
              그룹B재현율: toPercent(metrics.recallByGroup.B),
              그룹간격차: toPercent(metrics.recallGap),
              기준모델정확도: toPercent(baseline.accuracy),
            }
          : { 상태: '학습 불가' },
        reflection,
      })
    },
    [cleanRows, messyRows, testRows, ranSets, selected, k, reflection]
  )

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(reflection).some(value => value.trim().length > 0)
      if (answered) return 'reflect'
      if (current === 'beginner') {
        if (ranSets.length === 0) return 'intro'
        if (ranSets.length === 1) return 'explore'
        return 'result'
      }
      if (hasRun) return 'result'
      if (selected.size > 0) return 'challenge'
      return 'explore'
    },
    [reflection, ranSets, hasRun, selected]
  )

  const messyQuality = useMemo(() => detectQuality(messyRows), [messyRows])

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="데이터가 많기만 하면 언제나 좋은 인공지능이 만들어질까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={DATA_RESCUE_STAGE_GUIDES}
      learningSupport={DATA_RESCUE_LEARNING}
      getSnapshot={diff => {
        if (diff === 'beginner') {
          if (ranSets.length === 0) return null
          const cleanMetrics = evaluate(testRows, knnPredict(cleanRows, testRows, 3, false))
          const baseline = evaluate(testRows, knnPredict(messyRows, testRows, 3, false))
          const metrics: Record<string, string | number> = {
            정리된_정확도: ranSets.includes('clean') ? toPercent(cleanMetrics.accuracy) : '-',
            문제있는_정확도: ranSets.includes('messy') ? toPercent(baseline.accuracy) : '-',
          }
          return { label: `초급 · 실행 ${ranSets.join('+')}`, metrics }
        }
        if (!hasRun) return null
        const processed = applyPreprocess(messyRows, selected)
        if (processed.blockedReason) {
          return {
            label: '전처리 차단',
            metrics: { 사유: processed.blockedReason } as Record<string, string | number>,
          }
        }
        const evaluated = evaluate(
          testRows,
          knnPredict(processed.rows, testRows, k, processed.normalized, processed.excluded)
        )
        return {
          label: `전처리 ${selected.size}장 · k=${k}`,
          metrics: {
            정확도: toPercent(evaluated.accuracy),
            맞힌수: `${evaluated.correct}/${evaluated.total}`,
            비용: PREPROCESS_CARDS.filter(c => selected.has(c.id)).reduce((s, c) => s + c.cost, 0),
          } as Record<string, string | number>,
        }
      }}
      notice={`모두 교육용으로 만든 가상 데이터입니다(seed ${DATA_SEED}). 실제 학생 정보가 아니며, 지원 그룹 A와 B도 실제 속성이 아닌 가상의 구분입니다.`}
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div className="space-y-4">
          {current === 'beginner' ? (
            <BeginnerLab
              cleanRows={cleanRows}
              messyRows={messyRows}
              testRows={testRows}
              ranSets={ranSets}
              onRun={handleRunBeginner}
            />
          ) : (
            <ExperimentLab
              difficulty={current}
              trainRows={messyRows}
              testRows={testRows}
              selected={selected}
              onToggle={handleToggle}
              onClear={handleClear}
              k={k}
              onChangeK={value => {
                setK(value)
                setHasRun(false)
              }}
              hasRun={hasRun}
              onRun={() => setHasRun(true)}
            />
          )}

          <ReflectionPanel
            difficulty={current}
            questions={REFLECTION_QUESTIONS[current]}
            answers={reflection}
            onChange={handleReflectionChange}
          />

          <Panel title="결과 저장하기">
            <ResultActions
              onDownloadJson={() => downloadJson(MODULE_ID, buildExport(current))}
              onDownloadCsv={() => downloadCsv(MODULE_ID, resultToCsvRows(buildExport(current)))}
              onPrint={printReport}
            />
          </Panel>

          {current !== 'beginner' && (
            <Panel title="데이터 사전">
              <table className="w-full border-collapse text-sm">
                <caption className="mb-2 text-left text-xs text-slate-600">
                  이 실험에 쓰인 항목의 뜻과 정상 범위입니다. 범위를 벗어난 값이 이상값으로 표시됩니다.
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                      항목
                    </th>
                    <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                      뜻
                    </th>
                    <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                      값의 범위
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_DICTIONARY.map(entry => (
                    <tr key={entry.field}>
                      <th scope="row" className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-800">
                        {entry.field}
                      </th>
                      <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{entry.meaning}</td>
                      <td className="border-b border-slate-100 px-3 py-2 tabular-nums text-slate-600">{entry.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-slate-500">
                훈련 데이터 {messyRows.length}줄, 시험 데이터 {testRows.length}줄, 발견된 품질 문제{' '}
                {messyQuality.issues.length}건. 같은 seed를 쓰면 언제나 같은 데이터가 만들어집니다.
              </p>
            </Panel>
          )}
        </div>
      )}
    </ModuleFrame>
  )
}
