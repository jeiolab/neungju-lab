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
  RULE_VS_LEARN_STAGE_GUIDES,
  RULE_VS_LEARN_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import BeginnerLab from './components/BeginnerLab'
import ExperimentLab from './components/ExperimentLab'
import {
  BEGINNER_CASES,
  DATA_SEED,
  DATA_VERSION,
  DEFAULT_RULES,
  FEATURE_META,
  buildTestSet,
  buildTrainingSet,
} from './data'
import { compareAll, computeMetrics, toPercent } from './logic'
import type { ConflictPolicy, MissingPolicy, Plant, Rule } from './types'

const MODULE_ID = '두뇌-방식-대결'
const MODULE_NAME = '두뇌 방식 대결'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary:
      '똑같은 문제를 규칙으로 푸는 로봇과 예시로 배우는 로봇에게 각각 물어보고 답을 비교합니다.',
    points: [
      '미리 만들어 둔 규칙 살펴보기',
      '두 로봇의 답 나란히 보기',
      '어느 쪽이 이유를 설명하기 쉬운지 고르기',
    ],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary:
      '규칙을 직접 만들어 붙이고, 학습 데이터를 바꿔 가며 두 방식의 판단이 언제 갈라지는지 찾습니다.',
    points: ['IF-THEN 규칙 추가와 수정', 'k-NN의 이웃과 거리 보기', '결과가 다른 사례 모으기'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary:
      '규칙 충돌과 결측을 다루고, 예외가 섞인 사례에서 어느 방식을 쓸지 근거를 들어 결정합니다.',
    points: [
      '규칙 우선순위와 충돌 해결 방식 선택',
      '결측 특성 처리 정책 비교',
      '하이브리드 방식 제안하기',
    ],
    minutes: 45,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'easierExplain',
      prompt: '두 로봇 중 이유를 설명하기 더 쉬웠던 쪽은 어디인가요?',
      choices: [
        '규칙 로봇 (IF-THEN 문장)',
        '학습 로봇 (비슷한 이웃)',
        '사례마다 달랐다',
      ],
    },
    {
      id: 'learned',
      prompt: '이 실험에서 알게 된 점을 한 문장으로 써 보세요.',
      sentences: 1,
      placeholder: '예) 규칙은 이유를 말하기 쉽지만 ...',
    },
  ],
  intermediate: [
    {
      id: 'disagreeCause',
      prompt: '두 방식이 다른 답을 낸 사례가 있었다면, 그 이유는 무엇이었나요?',
      sentences: 2,
    },
    {
      id: 'changeEffect',
      prompt: '규칙을 고치거나 학습 예시를 바꾼 뒤 무엇이 달라졌나요?',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'conflictPolicy',
      prompt: '규칙 충돌·결측 정책을 바꾼 뒤 일치율이나 설명이 어떻게 달라졌나요? 근거를 적어 보세요.',
      sentences: 3,
    },
    {
      id: 'whenHybrid',
      prompt: '규칙만, 학습만, 하이브리드 중 언제 무엇을 쓰겠는지 제안해 보세요.',
      sentences: 3,
    },
    {
      id: 'limit',
      prompt: '이 가상 식물 데이터만으로는 알 수 없어서 더 확인해야 할 정보는 무엇인가요?',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

function cloneRules(source: Rule[]): Rule[] {
  return source.map(rule => ({ ...rule }))
}

function clonePlants(source: Plant[]): Plant[] {
  return source.map(row => ({ ...row }))
}

export default function App() {
  const initialTrain = useMemo(() => buildTrainingSet(), [])
  const testCases = useMemo(() => buildTestSet(), [])

  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [askedIds, setAskedIds] = useState<string[]>([])
  const [easierSide, setEasierSide] = useState<'rule' | 'knn' | null>(null)
  const [rules, setRules] = useState<Rule[]>(() => cloneRules(DEFAULT_RULES))
  const [train, setTrain] = useState<Plant[]>(() => clonePlants(initialTrain))
  const [k, setK] = useState(3)
  const [conflictPolicy, setConflictPolicy] = useState<ConflictPolicy>('firstMatch')
  const [missingPolicy, setMissingPolicy] = useState<MissingPolicy>('skipRule')
  const [hasRun, setHasRun] = useState(false)
  const [hybridChoice, setHybridChoice] = useState<string | null>(null)
  const [reflection, setReflection] = useState<Record<string, string>>({})

  const handleReset = useCallback(
    (next: Difficulty) => {
      setDifficulty(next)
      setAskedIds([])
      setEasierSide(null)
      setRules(cloneRules(DEFAULT_RULES))
      setTrain(clonePlants(initialTrain))
      setK(3)
      setConflictPolicy('firstMatch')
      setMissingPolicy('skipRule')
      setHasRun(false)
      setHybridChoice(null)
      setReflection({})
    },
    [initialTrain]
  )

  const handleAsk = useCallback((id: string) => {
    setAskedIds(prev => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setReflection(prev => ({ ...prev, [id]: value }))
  }, [])

  const markDirty = useCallback(() => {
    setHasRun(false)
  }, [])

  const buildExport = useCallback(
    (current: Difficulty) => {
      if (current === 'beginner') {
        const comparisons = compareAll(
          BEGINNER_CASES.filter(item => askedIds.includes(item.id)),
          DEFAULT_RULES,
          train,
          3
        )
        const metrics = computeMetrics(comparisons)
        return buildResult({
          moduleId: MODULE_ID,
          moduleName: MODULE_NAME,
          difficulty: current,
          version: DATA_VERSION,
          inputs: {
            물어본사례: askedIds,
            설명쉬운쪽: easierSide,
            데이터seed: DATA_SEED,
          },
          observations: {
            일치한사례: metrics.total - metrics.disagreeCount,
            갈린사례: metrics.disagreeCount,
          },
          metrics: {
            물어본수: metrics.total,
            일치율: toPercent(metrics.agreementRate),
          },
          reflection,
        })
      }

      const comparisons = compareAll(testCases, rules, train, k, conflictPolicy, missingPolicy)
      const metrics = computeMetrics(comparisons)
      const disagreeNames = comparisons
        .filter(item => !item.agree)
        .map(item => item.plant.name)

      return buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          규칙수: rules.filter(rule => rule.enabled).length,
          학습예시수: train.length,
          이웃수k: k,
          충돌정책: conflictPolicy,
          결측정책: missingPolicy,
          하이브리드선택: hybridChoice,
          데이터seed: DATA_SEED,
        },
        observations: {
          의견갈린식물: disagreeNames,
          규칙경로예시: comparisons[0]?.rule.explanation ?? '',
          이웃예시: comparisons[0]?.knn.explanation ?? '',
        },
        metrics: {
          일치율: toPercent(metrics.agreementRate),
          규칙정확도: toPercent(metrics.ruleAccuracy),
          학습정확도: toPercent(metrics.knnAccuracy),
          갈린사례수: metrics.disagreeCount,
        },
        reflection,
      })
    },
    [
      askedIds,
      easierSide,
      train,
      testCases,
      rules,
      k,
      conflictPolicy,
      missingPolicy,
      hybridChoice,
      reflection,
    ]
  )

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(reflection).some(value => value.trim().length > 0)
      if (answered) return 'reflect'

      if (current === 'beginner') {
        if (askedIds.length === 0) return 'intro'
        if (askedIds.length < BEGINNER_CASES.length) return 'explore'
        if (easierSide) return 'result'
        return 'explore'
      }

      if (hasRun) return 'result'
      if (
        rules.length !== DEFAULT_RULES.length ||
        train.length !== initialTrain.length ||
        conflictPolicy !== 'firstMatch' ||
        missingPolicy !== 'skipRule'
      ) {
        return 'challenge'
      }
      return 'explore'
    },
    [
      reflection,
      askedIds,
      easierSide,
      hasRun,
      rules,
      train,
      initialTrain,
      conflictPolicy,
      missingPolicy,
    ]
  )

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="사람이 규칙을 알려 주는 것과 데이터로 배우게 하는 것, 언제 무엇이 나을까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={RULE_VS_LEARN_STAGE_GUIDES}
      learningSupport={RULE_VS_LEARN_LEARNING}
      notice={`가상의 외계 식물 분류 문제를 사용합니다(seed ${DATA_SEED}). 사람에 관한 민감한 판단 문제는 다루지 않습니다.`}
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div className="space-y-4">
          {current === 'beginner' ? (
            <BeginnerLab
              cases={BEGINNER_CASES}
              train={train}
              askedIds={askedIds}
              onAsk={handleAsk}
              easierSide={easierSide}
              onPickEasier={setEasierSide}
            />
          ) : (
            <ExperimentLab
              difficulty={current}
              rules={rules}
              onChangeRules={next => {
                setRules(next)
                markDirty()
              }}
              train={train}
              onChangeTrain={next => {
                setTrain(next)
                markDirty()
              }}
              testCases={testCases}
              k={k}
              onChangeK={value => {
                setK(value)
                markDirty()
              }}
              conflictPolicy={conflictPolicy}
              onChangeConflict={value => {
                setConflictPolicy(value)
                markDirty()
              }}
              missingPolicy={missingPolicy}
              onChangeMissing={value => {
                setMissingPolicy(value)
                markDirty()
              }}
              hasRun={hasRun}
              onRun={() => setHasRun(true)}
              hybridChoice={hybridChoice}
              onPickHybrid={setHybridChoice}
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
              onDownloadCsv={() =>
                downloadCsv(MODULE_ID, resultToCsvRows(buildExport(current)))
              }
              onPrint={printReport}
            />
          </Panel>

          {current !== 'beginner' && (
            <Panel title="특성 사전">
              <table className="w-full border-collapse text-sm">
                <caption className="mb-2 text-left text-xs text-slate-600">
                  제타-7 식물원의 기록 항목입니다. 모두 교육용으로 만든 가상 값입니다.
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                    >
                      항목
                    </th>
                    <th
                      scope="col"
                      className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                    >
                      뜻
                    </th>
                    <th
                      scope="col"
                      className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                    >
                      값의 범위
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_META.map(entry => (
                    <tr key={entry.key}>
                      <th
                        scope="row"
                        className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-800"
                      >
                        {entry.label}
                      </th>
                      <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                        {entry.meaning}
                      </td>
                      <td className="border-b border-slate-100 px-3 py-2 tabular-nums text-slate-600">
                        {entry.range}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th
                      scope="row"
                      className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-800"
                    >
                      안전성
                    </th>
                    <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                      식용 가능 여부 (가상 기준)
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                      식용 / 독성
                    </td>
                  </tr>
                </tbody>
              </table>
            </Panel>
          )}
        </div>
      )}
    </ModuleFrame>
  )
}
