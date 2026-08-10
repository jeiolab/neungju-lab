'use client'

import { useCallback, useMemo, useState } from 'react'
import { CheckCircle2, Play, SkipForward, RotateCcw } from 'lucide-react'
import {
  Button,
  Callout,
  ChoiceCard,
  ExplainBox,
  ModuleFrame,
  Panel,
  ReflectionPanel,
  ResultActions,
  StatCard,
  TermHelp,
  buildResult,
  downloadCsv,
  downloadJson,
  printReport,
  resultToCsvRows,
  NEURON_STAGE_GUIDES,
  NEURON_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import ScatterPlot from './components/ScatterPlot'
import {
  BEGINNER_SUCCESS_ACCURACY,
  BIAS_RANGE,
  DATA_SEED,
  DATA_VERSION,
  DEFAULT_LEARNING_RATE,
  DEFAULT_WEIGHTS,
  DEMO_POINT,
  GATE_BOUNDS,
  GATE_CHALLENGES,
  LEARNING_START_WEIGHTS,
  LR_RANGE,
  MAX_EPOCHS,
  MODULE_ID,
  MODULE_NAME,
  PLOT_BOUNDS,
  WEIGHT_RANGE,
  buildClusterPoints,
} from './data'
import {
  classifyPoints,
  formatWeight,
  predictStep,
  runLearningStep,
  sigmoidActivate,
  sigmoidCurve,
  toPercent,
  trainPerceptron,
  weightedSum,
} from './logic'
import type { ActivationKind, GateId, LearningStep, Weights } from './types'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary: '손잡이를 움직여 직선을 옮기고, 두 무리의 점을 깔끔하게 나눠 봅니다.',
    points: ['가중치와 편향 슬라이더 조절', '직선이 움직이는 모습 관찰', '수식 대신 그림으로 이해'],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary: '가중합이 어떻게 계산되는지 항별로 보고, AND와 OR 게이트를 직접 풀어 봅니다.',
    points: ['z = w1x1 + w2x2 + b 항별 표시', '계단·시그모이드 활성화 비교', '논리 게이트 도전'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary: '퍼셉트론이 오차를 줄여 가며 스스로 학습하는 과정을 한 단계씩 따라가고, XOR의 한계를 확인합니다.',
    points: ['학습률에 따른 수렴 과정 비교', 'epoch별 오류 수 그래프', 'XOR을 직선으로 못 나누는 이유 설명'],
    minutes: 45,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'whatMoved',
      prompt: '슬라이더를 돌렸을 때 무엇이 가장 크게 달라졌나요?',
      choices: [
        '직선의 기울기나 위치가 바뀌었다',
        '점들의 색깔이 바뀌었다',
        '점들이 화면 밖으로 사라졌다',
      ],
    },
    {
      id: 'learned',
      prompt: '이 실험에서 알게 된 점을 한 문장으로 써 보세요.',
      sentences: 1,
      placeholder: '예) 숫자 몇 개만 바꿔도 두 무리를 가르는 선이 ...',
    },
  ],
  intermediate: [
    {
      id: 'activation',
      prompt: '계단 함수와 시그모이드를 비교했을 때, 어떤 차이가 보였나요?',
      sentences: 2,
    },
    {
      id: 'gates',
      prompt: 'AND와 OR를 맞추기 위해 가중치·편향을 어떻게 조절했나요?',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'learningRate',
      prompt: '학습률을 크게/작게 했을 때 수렴이 어떻게 달라졌는지, 오류 그래프를 근거로 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'xor',
      prompt: 'XOR을 직선 하나로 나눌 수 없는 이유를 자신의 말로 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'limit',
      prompt: '이 단순 퍼셉트론 모형만으로는 알 수 없어서 더 배워야 할 점은 무엇인가요?',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

function cloneWeights(w: Weights): Weights {
  return { w1: w.w1, w2: w.w2, b: w.b }
}

function WeightSliders({
  weights,
  onChange,
  showFormula,
}: {
  weights: Weights
  onChange: (next: Weights) => void
  showFormula?: boolean
}) {
  const row = (
    key: keyof Weights,
    label: string,
    range: { min: number; max: number; step: number },
    hint: string
  ) => (
    <label key={key} className="block space-y-1">
      <span className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="tabular-nums text-slate-600">{formatWeight(weights[key])}</span>
      </span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={weights[key]}
        onChange={e => onChange({ ...weights, [key]: Number(e.target.value) })}
        className="w-full accent-primary"
        aria-label={label}
      />
      <span className="block text-xs text-slate-500">{hint}</span>
    </label>
  )

  return (
    <div className="space-y-4">
      {showFormula && (
        <p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
          z = {formatWeight(weights.w1)}·x₁ + {formatWeight(weights.w2)}·x₂ + ({formatWeight(weights.b)})
        </p>
      )}
      {row('w1', '가중치 w₁', WEIGHT_RANGE, 'x₁ 방향 영향. 바꾸면 직선의 기울기가 달라집니다.')}
      {row('w2', '가중치 w₂', WEIGHT_RANGE, 'x₂ 방향 영향. 바꾸면 직선의 기울기가 달라집니다.')}
      {row('b', '편향 b', BIAS_RANGE, '전체를 밀거나 당깁니다. 바꾸면 직선이 평행 이동합니다.')}
    </div>
  )
}

function EpochErrorBars({
  epochs,
}: {
  epochs: Array<{ epoch: number; errors: number }>
}) {
  if (epochs.length === 0) {
    return <p className="text-sm text-slate-500">아직 학습을 돌리지 않았습니다.</p>
  }
  const maxErr = Math.max(...epochs.map(e => e.errors), 1)
  return (
    <div className="space-y-1.5" role="img" aria-label="epoch별 오류 개수">
      {epochs.map(row => (
        <div key={row.epoch} className="flex items-center gap-2 text-xs">
          <span className="w-14 shrink-0 tabular-nums text-slate-600">epoch {row.epoch}</span>
          <div className="h-3 flex-1 overflow-hidden rounded bg-slate-100">
            <div
              className={`h-full rounded ${row.errors === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${(row.errors / maxErr) * 100}%`, minWidth: row.errors > 0 ? 4 : 0 }}
            />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums font-semibold text-slate-800">
            {row.errors}
          </span>
        </div>
      ))}
      <p className="pt-1 text-xs text-slate-500">오른쪽 숫자 = 그 epoch에서 틀린 샘플 수</p>
    </div>
  )
}

function ActivationCompare({
  weights,
  point,
  activation,
  onActivationChange,
}: {
  weights: Weights
  point: { x1: number; x2: number }
  activation: ActivationKind
  onActivationChange: (next: ActivationKind) => void
}) {
  const breakdown = weightedSum(weights, point.x1, point.x2)
  const stepOut = predictStep(weights, point.x1, point.x2)
  const sigOut = sigmoidActivate(breakdown.z)
  const curve = useMemo(() => sigmoidCurve(-6, 6, 49), [])

  const plotW = 280
  const plotH = 120
  const pad = 8
  const xOf = (z: number) => pad + ((z + 6) / 12) * (plotW - pad * 2)
  const yOf = (y: number) => plotH - pad - y * (plotH - pad * 2)

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-xs">
          <p className="text-slate-500">w₁·x₁</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-slate-900">{formatWeight(breakdown.w1x1)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-xs">
          <p className="text-slate-500">w₂·x₂</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-slate-900">{formatWeight(breakdown.w2x2)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-xs">
          <p className="text-slate-500">b</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-slate-900">{formatWeight(breakdown.b)}</p>
        </div>
      </div>
      <p className="text-center font-mono text-sm text-slate-800">
        z = {formatWeight(breakdown.w1x1)} + {formatWeight(breakdown.w2x2)} + ({formatWeight(breakdown.b)}) ={' '}
        <strong>{formatWeight(breakdown.z)}</strong>
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'step' as const, title: '계단 함수', desc: 'z ≥ 0 → 1, 아니면 0' },
            { id: 'sigmoid' as const, title: '시그모이드', desc: '부드러운 0~1 값' },
          ] as const
        ).map(opt => (
          <div key={opt.id} className="min-w-[10rem] flex-1">
            <ChoiceCard
              selected={activation === opt.id}
              title={opt.title}
              description={opt.desc}
              onClick={() => onActivationChange(opt.id)}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs font-semibold text-slate-600">활성화 결과</p>
          {activation === 'step' ? (
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{stepOut}</p>
          ) : (
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{sigOut.toFixed(3)}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            {activation === 'step'
              ? '딱 잘라 0 또는 1로 판단합니다.'
              : '확신이 약한 중간값을 남길 수 있습니다.'}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-1 text-xs font-semibold text-slate-600">모양 비교 (z축)</p>
          <svg viewBox={`0 0 ${plotW} ${plotH}`} className="h-auto w-full" aria-hidden>
            <rect width={plotW} height={plotH} fill="#f8fafc" rx={6} />
            <line x1={xOf(0)} y1={pad} x2={xOf(0)} y2={plotH - pad} stroke="#cbd5e1" />
            <line x1={pad} y1={yOf(0.5)} x2={plotW - pad} y2={yOf(0.5)} stroke="#e2e8f0" strokeDasharray="3 3" />
            {/* step */}
            <path
              d={`M ${xOf(-6)} ${yOf(0)} L ${xOf(0)} ${yOf(0)} L ${xOf(0)} ${yOf(1)} L ${xOf(6)} ${yOf(1)}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2}
              opacity={activation === 'step' ? 1 : 0.35}
            />
            {/* sigmoid */}
            <polyline
              points={curve.map(p => `${xOf(p.z)},${yOf(p.y)}`).join(' ')}
              fill="none"
              stroke="#ea580c"
              strokeWidth={2}
              opacity={activation === 'sigmoid' ? 1 : 0.35}
            />
            <circle cx={xOf(breakdown.z)} cy={yOf(activation === 'step' ? stepOut : sigOut)} r={4} fill="#0f766e" />
          </svg>
          <p className="mt-1 text-xs text-slate-500">
            파랑=계단, 주황=시그모이드, 초록 점=현재 z
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const clusterPoints = useMemo(() => buildClusterPoints(), [])

  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [weights, setWeights] = useState<Weights>(() => cloneWeights(DEFAULT_WEIGHTS))
  const [touched, setTouched] = useState(false)
  const [activation, setActivation] = useState<ActivationKind>('step')
  const [gateId, setGateId] = useState<GateId>('AND')
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [learningRate, setLearningRate] = useState(DEFAULT_LEARNING_RATE)
  const [learnWeights, setLearnWeights] = useState<Weights>(() => cloneWeights(LEARNING_START_WEIGHTS))
  const [learnCursor, setLearnCursor] = useState(0)
  const [learnEpoch, setLearnEpoch] = useState(1)
  const [lastStep, setLastStep] = useState<LearningStep | null>(null)
  const [epochErrors, setEpochErrors] = useState<Array<{ epoch: number; errors: number }>>([])
  const [epochErrorBuffer, setEpochErrorBuffer] = useState(0)
  const [autoRan, setAutoRan] = useState(false)
  const [xorExplored, setXorExplored] = useState(false)
  const [reflection, setReflection] = useState<Record<string, string>>({})

  const handleReset = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setWeights(cloneWeights(DEFAULT_WEIGHTS))
    setTouched(false)
    setActivation('step')
    setGateId('AND')
    setSelectedPointId(null)
    setLearningRate(DEFAULT_LEARNING_RATE)
    setLearnWeights(cloneWeights(LEARNING_START_WEIGHTS))
    setLearnCursor(0)
    setLearnEpoch(1)
    setLastStep(null)
    setEpochErrors([])
    setEpochErrorBuffer(0)
    setAutoRan(false)
    setXorExplored(false)
    setReflection({})
  }, [])

  const handleWeights = useCallback((next: Weights) => {
    setWeights(next)
    setTouched(true)
  }, [])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setReflection(prev => ({ ...prev, [id]: value }))
  }, [])

  const activePoints = useMemo(() => {
    if (difficulty === 'beginner') return clusterPoints
    const gate = GATE_CHALLENGES.find(g => g.id === gateId) ?? GATE_CHALLENGES[0]
    return gate.points
  }, [difficulty, clusterPoints, gateId])

  const plotBounds = difficulty === 'beginner' ? PLOT_BOUNDS : GATE_BOUNDS
  const metrics = useMemo(() => classifyPoints(weights, activePoints), [weights, activePoints])
  const beginnerSuccess = metrics.accuracy >= BEGINNER_SUCCESS_ACCURACY

  const learnDataset = useMemo(() => {
    const andGate = GATE_CHALLENGES.find(g => g.id === 'AND')!
    return andGate.points
  }, [])

  const learnMetrics = useMemo(
    () => classifyPoints(learnWeights, learnDataset),
    [learnWeights, learnDataset]
  )

  const xorGate = GATE_CHALLENGES.find(g => g.id === 'XOR')!
  const xorMetrics = useMemo(() => classifyPoints(weights, xorGate.points), [weights])

  const resetLearning = useCallback(() => {
    setLearnWeights(cloneWeights(LEARNING_START_WEIGHTS))
    setLearnCursor(0)
    setLearnEpoch(1)
    setLastStep(null)
    setEpochErrors([])
    setEpochErrorBuffer(0)
    setAutoRan(false)
  }, [])

  const stepOnce = useCallback(() => {
    const point = learnDataset[learnCursor]
    if (!point) return
    const step = runLearningStep(learnWeights, point, learnCursor, learnEpoch, learningRate)
    setLastStep(step)
    setLearnWeights(step.weightsAfter)
    const nextErrorBuf = epochErrorBuffer + (step.error !== 0 ? 1 : 0)
    const nextCursor = learnCursor + 1
    if (nextCursor >= learnDataset.length) {
      setEpochErrors(prev => [...prev, { epoch: learnEpoch, errors: nextErrorBuf }])
      setEpochErrorBuffer(0)
      setLearnCursor(0)
      if (nextErrorBuf === 0) {
        // 수렴
      } else if (learnEpoch < MAX_EPOCHS) {
        setLearnEpoch(e => e + 1)
      }
    } else {
      setEpochErrorBuffer(nextErrorBuf)
      setLearnCursor(nextCursor)
    }
  }, [learnDataset, learnCursor, learnWeights, learnEpoch, learningRate, epochErrorBuffer])

  const runAll = useCallback(() => {
    const result = trainPerceptron(
      LEARNING_START_WEIGHTS,
      learnDataset,
      learningRate,
      MAX_EPOCHS
    )
    setLearnWeights(result.weights)
    setEpochErrors(result.epochErrors)
    setLearnEpoch(result.epochErrors.length || 1)
    setLearnCursor(0)
    setEpochErrorBuffer(0)
    setLastStep(result.steps[result.steps.length - 1] ?? null)
    setAutoRan(true)
  }, [learnDataset, learningRate])

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(reflection).some(v => v.trim().length > 0)
      if (answered) return 'reflect'
      if (current === 'beginner') {
        if (!touched) return 'intro'
        if (!beginnerSuccess) return 'explore'
        return 'result'
      }
      if (current === 'intermediate') {
        if (metrics.accuracy === 1 && (gateId === 'AND' || gateId === 'OR')) return 'result'
        if (touched || selectedPointId) return 'challenge'
        return 'explore'
      }
      // advanced
      if (xorExplored && (autoRan || epochErrors.length > 0)) return 'result'
      if (autoRan || epochErrors.length > 0 || lastStep) return 'challenge'
      return 'explore'
    },
    [
      reflection,
      touched,
      beginnerSuccess,
      metrics.accuracy,
      gateId,
      selectedPointId,
      xorExplored,
      autoRan,
      epochErrors.length,
      lastStep,
    ]
  )

  const buildExport = useCallback(
    (current: Difficulty) => {
      if (current === 'beginner') {
        return buildResult({
          moduleId: MODULE_ID,
          moduleName: MODULE_NAME,
          difficulty: current,
          version: DATA_VERSION,
          inputs: { w1: weights.w1, w2: weights.w2, b: weights.b, 데이터seed: DATA_SEED },
          observations: {
            맞힌점: `${metrics.correct}/${metrics.total}`,
            성공여부: beginnerSuccess ? '대부분 분리' : '아직 미분리',
          },
          metrics: { 정확도: toPercent(metrics.accuracy) },
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
            w1: weights.w1,
            w2: weights.w2,
            b: weights.b,
            활성화: activation,
            게이트: gateId,
          },
          observations: {
            맞힌점: `${metrics.correct}/${metrics.total}`,
            선택점: selectedPointId,
          },
          metrics: { 정확도: toPercent(metrics.accuracy) },
          reflection,
        })
      }
      return buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          학습률: learningRate,
          최종가중치: learnWeights,
          XOR탐색가중치: weights,
        },
        observations: {
          epoch오류: epochErrors,
          수렴여부: learnMetrics.accuracy === 1,
          XOR정확도: toPercent(xorMetrics.accuracy),
        },
        metrics: {
          AND학습정확도: toPercent(learnMetrics.accuracy),
          XOR정확도: toPercent(xorMetrics.accuracy),
          학습epoch수: epochErrors.length,
        },
        reflection,
      })
    },
    [
      weights,
      metrics,
      beginnerSuccess,
      reflection,
      activation,
      gateId,
      selectedPointId,
      learningRate,
      learnWeights,
      epochErrors,
      learnMetrics.accuracy,
      xorMetrics.accuracy,
    ]
  )

  const selectedPoint =
    activePoints.find(p => p.id === selectedPointId) ?? activePoints[0] ?? DEMO_POINT

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="숫자 몇 개를 바꿨을 뿐인데 판단이 왜 이렇게 달라질까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={NEURON_STAGE_GUIDES}
      learningSupport={NEURON_LEARNING}
      notice="인공 뉴런은 생물학적 뉴런을 그대로 옮긴 것이 아니라, 계산을 위해 크게 단순화한 모형입니다."
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div className="space-y-4">
          {current === 'beginner' && (
            <>
              <ExplainBox
                title="지금 배울 것"
                analogy="시험 점수를 볼 때 ‘수학을 얼마나 중요하게 볼지’와 ‘합격 기준이 어디인지’가 있으면, 합격·불합격이 갈립니다."
                steps={[
                  '가중치는 각 입력(가로·세로)을 얼마나 중요하게 볼지입니다.',
                  '편향은 판단이 뒤집히는 기준선, 즉 기울어지는 지점입니다.',
                  '손잡이를 움직이면 초록 직선이 바뀌고, 점들이 어느 쪽에 속하는지 따라 바뀝니다.',
                ]}
                takeaway="숫자 몇 개만 바꿔도 ‘가르는 선’이 움직이고, 판단이 달라집니다."
              />

              <Panel
                title="손잡이로 직선을 옮겨 보기"
                description="파란 무리와 주황 무리를 초록 직선이 갈라 줍니다. 수식 없이도 손잡이만으로 실험해 보세요."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <WeightSliders weights={weights} onChange={handleWeights} />
                  <ScatterPlot
                    points={clusterPoints}
                    weights={weights}
                    bounds={PLOT_BOUNDS}
                    showPredictions
                  />
                </div>
              </Panel>

              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard
                  label="맞힌 점"
                  value={`${metrics.correct}/${metrics.total}`}
                  hint="직선 기준으로 올바르게 나뉜 점"
                  tone={beginnerSuccess ? 'good' : 'neutral'}
                />
                <StatCard
                  label="정확도"
                  value={toPercent(metrics.accuracy)}
                  unit="%"
                  hint={`목표: ${toPercent(BEGINNER_SUCCESS_ACCURACY)}% 이상`}
                  tone={beginnerSuccess ? 'good' : 'warn'}
                />
                <StatCard
                  label="상태"
                  value={beginnerSuccess ? '성공' : '조절 중'}
                  hint={
                    beginnerSuccess
                      ? '두 무리가 대체로 나뉘었습니다.'
                      : '틀린 점(×)이 적어지도록 손잡이를 움직여 보세요.'
                  }
                  tone={beginnerSuccess ? 'good' : 'neutral'}
                />
              </div>

              {beginnerSuccess && (
                <>
                  <Callout tone="info" title="잘 나뉘었습니다">
                    가중치와 편향은 점을 가르는 직선의 기울기와 위치를 정합니다. 다음 단계에서는 그 숫자가
                    어떻게 계산되는지 항별로 볼 수 있습니다.
                  </Callout>
                  <ExplainBox
                    analogy="친구에게 ‘숙제 점수’와 ‘출석’을 얼마나 중요하게 볼지 정하고, 합격 점수를 정해 두는 것과 비슷합니다."
                    steps={[
                      `지금 w₁=${formatWeight(weights.w1)}, w₂=${formatWeight(weights.w2)}라서 가로·세로 방향의 중요도가 이렇게 잡혔습니다.`,
                      `편향 b=${formatWeight(weights.b)}는 선을 통째로 밀거나 당겨, 어디에 선을 둘지 정합니다.`,
                      `그 결과 ${metrics.correct}/${metrics.total}개 점(정확도 ${toPercent(metrics.accuracy)}%)이 올바른 쪽에 놓였습니다.`,
                    ]}
                    takeaway="가중치=각 입력의 중요도, 편향=판단을 뒤집는 기준점. 둘을 바꾸면 직선과 결과가 함께 움직입니다."
                  />
                </>
              )}
            </>
          )}

          {current === 'intermediate' && (
            <>
              <ExplainBox
                title="지금 배울 것"
                analogy="장바구니에 물건 값(입력)을 넣고, 할인·우대(가중치)를 곱한 뒤, ‘이 금액이면 사도 될까?’ 기준(편향)을 더하는 셈입니다."
                steps={[
                  '가중합 z = (입력 × 중요도)들을 더한 뒤 편향을 붙인 값입니다.',
                  '계단 함수는 z를 딱 잘라 0/1로, 시그모이드는 부드러운 0~1로 바꿉니다.',
                  'AND·OR는 네 점을 직선 하나로 가를 수 있어, 손잡이만으로 맞출 수 있습니다.',
                ]}
                takeaway="숫자의 곱·합이 선을 만들고, 그 선이 AND·OR 같은 규칙을 표현할 수 있습니다."
              />

              <Panel
                title="가중합을 항별로 보기"
                description="각 입력에 가중치를 곱하고 편향을 더한 z가 활성화 함수로 들어가 최종 0/1 판단이 됩니다."
              >
                <p className="mb-3 text-sm text-slate-600">
                  <TermHelp term="가중합 z">
                    각 입력에 가중치를 곱하고 편향을 더한 값입니다. z = w₁x₁ + w₂x₂ + b
                  </TermHelp>
                  를 항별로 펼쳐 보고, 계단·시그모이드가 z를 어떻게 바꾸는지 비교하세요.
                </p>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <WeightSliders weights={weights} onChange={handleWeights} showFormula />
                    <div>
                      <p className="mb-1.5 text-xs font-semibold text-slate-600">계산에 쓸 점 고르기</p>
                      <div className="flex flex-wrap gap-1.5">
                        {activePoints.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPointId(p.id)}
                            className={`rounded-md border px-2 py-1 text-xs font-semibold tabular-nums ${
                              selectedPoint.id === p.id
                                ? 'border-primary bg-blue-50 text-primary'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            ({p.x1}, {p.x2}) → {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ScatterPlot
                    points={activePoints}
                    weights={weights}
                    bounds={plotBounds}
                    highlightId={selectedPoint.id}
                    showPredictions
                  />
                </div>

                <div className="mt-4">
                  <ActivationCompare
                    weights={weights}
                    point={selectedPoint}
                    activation={activation}
                    onActivationChange={setActivation}
                  />
                </div>
              </Panel>

              <Panel
                title="논리 게이트 도전"
                description="네 점으로 AND 또는 OR를 맞혀 보세요. (XOR은 고급에서 다룹니다.)"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  {GATE_CHALLENGES.filter(g => g.id !== 'XOR').map(g => (
                    <Button
                      key={g.id}
                      variant={gateId === g.id ? 'primary' : 'secondary'}
                      onClick={() => {
                        setGateId(g.id)
                        setSelectedPointId(null)
                        setTouched(true)
                      }}
                    >
                      {g.name}
                    </Button>
                  ))}
                </div>
                <p className="mb-3 text-sm text-slate-600">
                  {(GATE_CHALLENGES.find(g => g.id === gateId) ?? GATE_CHALLENGES[0]).description}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard
                    label="맞힌 점"
                    value={`${metrics.correct}/${metrics.total}`}
                    tone={metrics.accuracy === 1 ? 'good' : 'warn'}
                  />
                  <StatCard
                    label="정확도"
                    value={toPercent(metrics.accuracy)}
                    unit="%"
                    tone={metrics.accuracy === 1 ? 'good' : 'neutral'}
                  />
                  <StatCard
                    label="도전 상태"
                    value={metrics.accuracy === 1 ? '통과' : '도전 중'}
                    hint={metrics.accuracy === 1 ? '네 점을 모두 맞혔습니다.' : '네 점을 모두 맞춰 보세요.'}
                    tone={metrics.accuracy === 1 ? 'good' : 'neutral'}
                  />
                </div>
                {metrics.accuracy === 1 && (
                  <div className="mt-3 space-y-3">
                    <Callout tone="info" title={`${gateId} 성공`}>
                      직선 하나로 네 점을 나눌 수 있었습니다. 고급에서는 스스로 가중치를 고치는 학습 규칙을
                      보고, XOR처럼 직선으로 안 되는 경우도 확인합니다.
                    </Callout>
                    <ExplainBox
                      analogy={
                        gateId === 'AND'
                          ? '둘 다 켜져야 불이 들어오는 스위치 두 개와 같습니다. 하나만 켜져 있으면 아직 부족합니다.'
                          : '둘 중 하나만 켜져도 불이 들어오는 스위치와 같습니다. 둘 다 꺼져 있을 때만 꺼집니다.'
                      }
                      steps={[
                        gateId === 'AND'
                          ? 'AND는 (1,1)만 1이고 나머지는 0이라, 오른쪽 위만 ‘통과’ 쪽에 두면 됩니다.'
                          : 'OR는 (0,0)만 0이고 나머지는 1이라, 왼쪽 아래만 ‘탈락’ 쪽에 두면 됩니다.',
                        `지금 선은 w₁=${formatWeight(weights.w1)}, w₂=${formatWeight(weights.w2)}, b=${formatWeight(weights.b)}로 잡혀 네 점을 모두 맞혔습니다.`,
                        '같은 레이블끼리 한쪽에 모일 수 있으면, 직선(한 뉴런)만으로도 규칙을 표현할 수 있습니다.',
                      ]}
                      takeaway={`${gateId}는 직선 하나로 나눌 수 있는 문제라서, 가중치·편향만으로 해결됩니다.`}
                    />
                  </div>
                )}
              </Panel>
            </>
          )}

          {current === 'advanced' && (
            <>
              <ExplainBox
                title="지금 배울 것"
                analogy="틀린 문제를 만날 때마다 연필로 답을 조금조금 고치는 연습과 같습니다. 한 번에 다 바꾸지 않습니다."
                steps={[
                  '학습은 틀린 샘플을 보면 가중치·편향을 조금씩 고쳐 오차를 줄이는 과정입니다.',
                  '학습률이 크면 한 걸음이 크고, 작으면 천천히 다가갑니다.',
                  'AND·OR는 직선으로 되지만, XOR은 같은 답이 대각선에 있어 선 하나로는 안 됩니다.',
                ]}
                takeaway="배우는 뉴런은 ‘실수 → 조금씩 수정’으로 선을 옮기고, 선으로 안 되는 문제는 더 복잡한 구조가 필요합니다."
              />

              <Panel
                title="퍼셉트론 학습 규칙 (AND로 연습)"
                description="틀린 샘플을 만나면 가중치를 조금씩 고칩니다. 한 걸음씩 또는 한 번에 실행해 보세요."
              >
                <p className="mb-3 text-sm text-slate-600">
                  <TermHelp term="학습 규칙">
                    w ← w + η·(y − ŷ)·x , b ← b + η·(y − ŷ). η는 학습률입니다.
                  </TermHelp>
                  을 따라 오차를 줄입니다. 학습률을 바꿔 수렴 속도 차이를 비교해 보세요.
                </p>
                <div className="mb-4 space-y-2">
                  <label className="block space-y-1">
                    <span className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-800">학습률 η</span>
                      <span className="tabular-nums text-slate-600">{formatWeight(learningRate)}</span>
                    </span>
                    <input
                      type="range"
                      min={LR_RANGE.min}
                      max={LR_RANGE.max}
                      step={LR_RANGE.step}
                      value={learningRate}
                      onChange={e => {
                        setLearningRate(Number(e.target.value))
                        resetLearning()
                      }}
                      className="w-full accent-primary"
                      aria-label="학습률"
                    />
                    <span className="block text-xs text-slate-500">
                      크면 한 번에 많이 움직이고, 작으면 천천히 다가갑니다. 값을 바꾸면 학습이 처음부터
                      다시 시작됩니다.
                    </span>
                  </label>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <Button variant="primary" onClick={stepOnce}>
                    <SkipForward className="h-4 w-4" aria-hidden />
                    한 샘플 학습
                  </Button>
                  <Button onClick={runAll}>
                    <Play className="h-4 w-4" aria-hidden />
                    끝까지 학습
                  </Button>
                  <Button variant="ghost" onClick={resetLearning}>
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    학습 초기화
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                      <p className="font-semibold text-slate-800">
                        현재: epoch {learnEpoch}, 샘플 {learnCursor + 1}/{learnDataset.length}
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-700">
                        w₁={formatWeight(learnWeights.w1)}, w₂={formatWeight(learnWeights.w2)}, b=
                        {formatWeight(learnWeights.b)}
                      </p>
                      {lastStep && (
                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          <p>
                            직전: ({lastStep.x1}, {lastStep.x2}) 정답 {lastStep.label} / 예측{' '}
                            {lastStep.prediction}
                            {lastStep.updated ? (
                              <span className="ml-1 font-semibold text-amber-700">→ 갱신됨</span>
                            ) : (
                              <span className="ml-1 font-semibold text-emerald-700">→ 이미 맞음</span>
                            )}
                          </p>
                          {lastStep.updated && (
                            <p className="font-mono">
                              Δ = η·({lastStep.label}−{lastStep.prediction}) ={' '}
                              {formatWeight(learningRate * lastStep.error)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <StatCard
                        label="AND 정확도"
                        value={toPercent(learnMetrics.accuracy)}
                        unit="%"
                        tone={learnMetrics.accuracy === 1 ? 'good' : 'warn'}
                      />
                      <StatCard
                        label="완료 epoch"
                        value={epochErrors.length}
                        hint={
                          learnMetrics.accuracy === 1
                            ? '오류 0으로 수렴했습니다.'
                            : '계속 학습하거나 학습률을 바꿔 보세요.'
                        }
                        tone={learnMetrics.accuracy === 1 ? 'good' : 'neutral'}
                      />
                    </div>
                    <EpochErrorBars epochs={epochErrors} />
                  </div>
                  <ScatterPlot
                    points={learnDataset}
                    weights={learnWeights}
                    bounds={GATE_BOUNDS}
                    showPredictions
                    title="학습 중인 결정 경계 (AND)"
                  />
                </div>

                <div className="mt-3">
                  <Callout tone="info" title="학습률 관찰 팁">
                    η를 0.1과 0.8처럼 크게 다르게 두고 &apos;끝까지 학습&apos;을 비교해 보세요. 너무 크면
                    경계가 크게 흔들리고, 너무 작으면 epoch가 많이 필요합니다.
                  </Callout>
                </div>

                {(autoRan || epochErrors.length > 0) && (
                  <div className="mt-3">
                    <ExplainBox
                      analogy="줄넘기 연습을 할 때, 한 번에 크게 고치면 넘어지고 조금씩 고치면 점점 맞춰 지는 것과 비슷합니다."
                      steps={[
                        lastStep
                          ? lastStep.updated
                            ? `직전에 (${lastStep.x1}, ${lastStep.x2})를 틀려서, 정답 ${lastStep.label}과 예측 ${lastStep.prediction}의 차이만큼 가중치를 고쳤습니다.`
                            : `직전에 (${lastStep.x1}, ${lastStep.x2})는 이미 맞춰서 가중치를 건드리지 않았습니다.`
                          : '틀린 샘플을 만날 때만 가중치가 조금 바뀝니다.',
                        `학습률 η=${formatWeight(learningRate)}이라서, 한 번 고칠 때 움직이는 크기가 ${
                          learningRate >= 0.5 ? '꽤 큽니다' : learningRate <= 0.2 ? '작습니다' : '적당합니다'
                        }.`,
                        learnMetrics.accuracy === 1
                          ? `지금은 AND를 ${toPercent(learnMetrics.accuracy)}%로 맞춰, ${epochErrors.length} epoch 만에 오류 0에 가까워졌습니다.`
                          : `아직 AND 정확도는 ${toPercent(learnMetrics.accuracy)}%입니다. 더 돌리거나 학습률을 바꿔 보세요.`,
                      ]}
                      takeaway="학습은 ‘틀릴 때마다 조금씩 고치는’ 과정입니다. 한 번에 정답을 외우는 게 아닙니다."
                    />
                  </div>
                )}
              </Panel>

              <Panel
                title="XOR 불가능 — 직선 하나의 한계"
                description="XOR은 입력이 서로 다를 때만 1입니다. 네 점을 직선 하나로 가를 수 있는지 직접 확인해 보세요."
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setGateId('XOR')
                      setXorExplored(true)
                    }}
                  >
                    XOR 점으로 실험하기
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <WeightSliders
                    weights={weights}
                    onChange={next => {
                      handleWeights(next)
                      setXorExplored(true)
                    }}
                    showFormula
                  />
                  <ScatterPlot
                    points={xorGate.points}
                    weights={weights}
                    bounds={GATE_BOUNDS}
                    showPredictions
                    title="XOR 네 점"
                  />
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <StatCard
                    label="XOR 맞힌 점"
                    value={`${xorMetrics.correct}/${xorMetrics.total}`}
                    hint="단일 직선으로는 4/4가 불가능합니다."
                    tone={xorMetrics.accuracy === 1 ? 'good' : 'warn'}
                  />
                  <StatCard
                    label="선형 분리"
                    value="불가능"
                    hint="같은 레이블이 대각선으로 떨어져 있습니다."
                    tone="warn"
                  />
                </div>

                <div className="mt-3 space-y-3">
                  <Callout tone="warn" title="왜 안 될까?">
                    (0,0)과 (1,1)은 0이고, (0,1)과 (1,0)은 1입니다. 같은 답이 대각선에 있어 하나의
                    직선으로 두 무리를 가를 수 없습니다. 이런 문제는 층을 더 쌓거나(다층 퍼셉트론), 입력을
                    변환해야 풀 수 있습니다.
                  </Callout>

                  {xorExplored && (
                    <ExplainBox
                      analogy="체스판처럼 검정·하양이 엇갈려 있으면, 자로 한 번만 그어서 같은 색끼리 모을 수 없습니다."
                      steps={[
                        'AND·OR는 같은 답이 한쪽에 모여 직선으로 가를 수 있습니다.',
                        'XOR은 (0,0)·(1,1)이 0이고 (0,1)·(1,0)이 1이라, 같은 답이 대각선으로 떨어져 있습니다.',
                        `지금 손잡이로는 ${xorMetrics.correct}/${xorMetrics.total}개만 맞습니다. 4/4는 직선 하나로는 불가능합니다.`,
                        '이럴 때는 뉴런을 여러 층으로 쌓거나, 입력을 다른 모양으로 바꿔야 합니다.',
                      ]}
                      takeaway="선 하나로 되는 문제(AND·OR)와 안 되는 문제(XOR)가 있습니다. XOR은 ‘더 복잡한 뇌’가 필요합니다."
                    />
                  )}
                </div>

                {xorExplored && xorMetrics.accuracy < 1 && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />
                    XOR을 직접 만져 보며 한계를 확인했습니다.
                  </p>
                )}
              </Panel>
            </>
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
        </div>
      )}
    </ModuleFrame>
  )
}
