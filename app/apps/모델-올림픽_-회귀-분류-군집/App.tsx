'use client'

import { useCallback, useMemo, useState } from 'react'
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
  MODEL_OLYMPICS_STAGE_GUIDES,
  MODEL_OLYMPICS_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import {
  CLUSTER_FEATURES,
  COLUMNS_BY_DATASET,
  DATA_DICTIONARY,
  DATA_SEED,
  DATA_VERSION,
  DATASET_LABEL,
  DATASET_STORY,
  PROBLEM_CARDS,
  PROBLEM_TYPE_LABEL,
  PROBLEM_TYPE_PLAIN,
  buildDataset,
  getTargetCandidates,
} from './data'
import {
  beginnerDemo,
  columnLabel,
  inferProblemType,
  runExperiment,
  toPercent,
} from './logic'
import type {
  ClassificationMetrics,
  ClusteringMetrics,
  DatasetId,
  MetricsBundle,
  ModelCardDraft,
  ModelKind,
  OverfitReport,
  ProblemType,
  RegressionMetrics,
} from './types'

const MODULE_ID = '모델-올림픽'
const MODULE_NAME = '모델 올림픽'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary: '문제 카드를 읽고 이것이 숫자 맞히기인지, 종류 고르기인지, 묶기인지 판단합니다.',
    points: ['세 가지 문제 유형 구분하기', '문제마다 결과 그림 살펴보기', '왜 그렇게 분류했는지 고르기'],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary: '목표 열과 특성을 직접 고르고 기준 모델과 성적을 비교합니다.',
    points: ['목표 열을 바꿔 문제 유형 변화 확인', '훈련·테스트 분할 비율 선택', '평균 기준선보다 나은지 판단'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary: '선형회귀, k-NN, 의사결정나무, k-평균을 설정까지 조절해 비교하고 모델 카드를 씁니다.',
    points: ['MAE와 결정계수, 범주별 재현율 해석', '과적합 사례 찾기', '한계와 오용 주의를 담은 모델 카드 작성'],
    minutes: 50,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'whyType',
      prompt: '문제 유형을 고를 때 가장 중요하게 본 것은 무엇인가요?',
      choices: [
        '맞혀야 할 답이 숫자인지 종류인지, 아니면 정답이 없는지',
        '데이터가 많으면 무조건 회귀',
        '어려운 말이 들어간 쪽이 정답',
      ],
    },
    {
      id: 'learned',
      prompt: '이 실험에서 알게 된 점을 한 문장으로 써 보세요.',
      sentences: 1,
      placeholder: '예) 같은 데이터라도 무엇을 맞히느냐에 따라 ...',
    },
  ],
  intermediate: [
    {
      id: 'baseline',
      prompt: '내가 고른 모델이 기준 모델보다 나았나요? 어떤 지표로 판단했나요?',
      sentences: 2,
    },
    {
      id: 'targetChange',
      prompt: '목표 열을 바꾸면 문제 유형이 어떻게 달라졌나요?',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'metric',
      prompt: '어떤 지표를 가장 중요하게 봤으며, 그 이유는 무엇인가요?',
      sentences: 3,
    },
    {
      id: 'overfit',
      prompt: '과적합처럼 보인 설정이 있었다면, 훈련과 시험 성적의 차이를 근거로 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'card',
      prompt: '모델 카드에 적은 한계·오용 주의 중 실제로 가장 걱정되는 점은 무엇인가요?',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

const MODEL_OPTIONS: Array<{ id: ModelKind; label: string; for: ProblemType[] }> = [
  { id: 'linear', label: '선형 회귀', for: ['regression'] },
  { id: 'knn', label: 'k-최근접 이웃', for: ['regression', 'classification'] },
  { id: 'stump', label: '의사결정 그루터기', for: ['classification'] },
  { id: 'tree', label: '얕은 의사결정나무', for: ['classification'] },
  { id: 'kmeans', label: 'k-평균', for: ['clustering'] },
]

const CLUSTER_COLORS = ['#2563eb', '#059669', '#d97706', '#db2777', '#7c3aed', '#0891b2']

function RegressionViz({
  model,
  baseline,
}: {
  model: RegressionMetrics
  baseline: RegressionMetrics
}) {
  const maxVal = Math.max(
    1,
    ...model.samples.map(s => Math.max(s.actual, s.predicted)),
    ...baseline.samples.map(s => Math.max(s.actual, s.predicted))
  )

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label="모델 평균절대오차(MAE)"
          value={model.mae}
          hint="작을수록 좋습니다. 실제와 예측의 평균 차이입니다."
          tone={model.mae <= baseline.mae ? 'good' : 'warn'}
        />
        <StatCard
          label="기준 모델 MAE (평균값)"
          value={baseline.mae}
          hint="훈련 목표의 평균으로만 맞힌 성적입니다."
        />
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs font-bold text-slate-700">실제 vs 예측 (일부)</p>
        <div className="relative mx-auto h-48 w-full max-w-md">
          <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="실제와 예측 산점도">
            <line x1="10" y1="90" x2="90" y2="90" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="10" y1="90" x2="10" y2="10" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="10" y1="90" x2="90" y2="10" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2 2" />
            {model.samples.map((s, i) => {
              const x = 10 + (s.actual / maxVal) * 80
              const y = 90 - (s.predicted / maxVal) * 80
              return <circle key={i} cx={x} cy={y} r="1.6" fill="#2563eb" opacity="0.85" />
            })}
          </svg>
          <p className="mt-1 text-center text-[11px] text-slate-500">점선 = 완벽한 예측선 · 파란 점 = 모델 예측</p>
        </div>
      </div>
    </div>
  )
}

function ClassificationViz({
  model,
  baseline,
}: {
  model: ClassificationMetrics
  baseline: ClassificationMetrics
}) {
  const labels = Object.keys(model.confusion)

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label="모델 맞힌 수"
          value={`${model.correct}/${model.total}`}
          hint={`정확도 ${toPercent(model.accuracy)}%`}
          tone={model.accuracy >= baseline.accuracy ? 'good' : 'warn'}
        />
        <StatCard
          label="기준 모델 (다수 종류)"
          value={`${baseline.correct}/${baseline.total}`}
          hint={`정확도 ${toPercent(baseline.accuracy)}% · 가장 흔한 종류만 고른 경우`}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-xs">
          <caption className="mb-2 text-left text-xs text-slate-600">
            혼동행렬 · 행=실제, 열=예측
          </caption>
          <thead>
            <tr>
              <th className="border-b border-slate-200 px-2 py-1.5 text-left font-bold text-slate-700">실제 \ 예측</th>
              {labels.map(label => (
                <th key={label} className="border-b border-slate-200 px-2 py-1.5 text-left font-bold text-slate-700">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map(actual => (
              <tr key={actual}>
                <th scope="row" className="border-b border-slate-100 px-2 py-1.5 text-left font-medium text-slate-800">
                  {actual}
                </th>
                {labels.map(pred => (
                  <td
                    key={pred}
                    className={`border-b border-slate-100 px-2 py-1.5 tabular-nums ${
                      actual === pred ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-slate-600'
                    }`}
                  >
                    {model.confusion[actual][pred]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(model.recallByClass).map(([label, recall]) => (
          <span
            key={label}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
          >
            {label} 재현율 {toPercent(recall)}%
          </span>
        ))}
      </div>
    </div>
  )
}

function ClusteringViz({
  model,
  baseline,
}: {
  model: ClusteringMetrics
  baseline: ClusteringMetrics
}) {
  const xs = model.points.map(p => p.x)
  const ys = model.points.map(p => p.y)
  const minX = Math.min(...xs, 0)
  const maxX = Math.max(...xs, 1)
  const minY = Math.min(...ys, 0)
  const maxY = Math.max(...ys, 1)
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label="모델 실루엣(단순화)"
          value={model.silhouette}
          hint="1에 가까울수록 무리가 잘 갈라진 편입니다."
          tone={model.silhouette >= baseline.silhouette ? 'good' : 'warn'}
        />
        <StatCard
          label="기준 (전부 한 무리, k=1)"
          value={baseline.silhouette}
          hint={`관성 ${baseline.inertia} · 묶지 않은 것과 비슷합니다.`}
        />
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs font-bold text-slate-700">무리 산점도 (앞의 두 특성)</p>
        <svg viewBox="0 0 100 100" className="mx-auto h-48 w-full max-w-md" role="img" aria-label="군집 산점도">
          <rect x="8" y="8" width="84" height="84" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
          {model.points.map((p, i) => {
            const x = 12 + ((p.x - minX) / spanX) * 76
            const y = 88 - ((p.y - minY) / spanY) * 76
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.8"
                fill={CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]}
                opacity="0.9"
              />
            )
          })}
        </svg>
        <p className="mt-1 text-center text-[11px] text-slate-500">같은 색 = 같은 무리 · 무리 개수 k={model.k}</p>
      </div>
    </div>
  )
}

function MetricsPanel({ bundle }: { bundle: MetricsBundle }) {
  if (bundle.type === 'regression') {
    return <RegressionViz model={bundle.model} baseline={bundle.baseline} />
  }
  if (bundle.type === 'classification') {
    return <ClassificationViz model={bundle.model} baseline={bundle.baseline} />
  }
  return <ClusteringViz model={bundle.model} baseline={bundle.baseline} />
}

function OlympicsExplainBox({
  difficulty,
  problemType,
  bundle,
  overfit,
  showOverfit,
  datasetLabel,
  targetLabel,
}: {
  difficulty: Difficulty
  problemType: ProblemType
  bundle: MetricsBundle
  overfit?: OverfitReport | null
  showOverfit?: boolean
  datasetLabel?: string
  targetLabel?: string
}) {
  const typePlain = PROBLEM_TYPE_PLAIN[problemType]

  if (difficulty === 'beginner') {
    const typeWhy: Record<ProblemType, string> = {
      regression: '맞혀야 할 답이 숫자(몇 개, 얼마나)이기 때문입니다.',
      classification: '맞혀야 할 답이 정해진 종류(어느 쪽)이기 때문입니다.',
      clustering: '정답 라벨 없이 “비슷한 것끼리 묶기”가 목표이기 때문입니다.',
    }
    const baselineStep =
      bundle.type === 'regression'
        ? `기준 모델은 “그냥 평균”입니다. 모델 MAE ${bundle.model.mae} vs 기준 ${bundle.baseline.mae}.`
        : bundle.type === 'classification'
          ? `기준 모델은 “가장 많은 종류만 고르기”입니다. 모델 정확도 ${toPercent(bundle.model.accuracy)}% vs 기준 ${toPercent(bundle.baseline.accuracy)}%.`
          : `기준은 “전부 한 무리”입니다. 모델 실루엣 ${bundle.model.silhouette} vs 기준 ${bundle.baseline.silhouette}.`

    return (
      <ExplainBox
        analogy="시험 문제가 ‘숫자 쓰기’인지, ‘보기에서 고르기’인지, ‘비슷한 것끼리 모으기’인지 먼저 정하는 것과 같습니다."
        steps={[
          `이 문제는 ${typePlain}(${PROBLEM_TYPE_LABEL[problemType]})에 가깝습니다.`,
          typeWhy[problemType],
          baselineStep,
        ]}
        takeaway="같은 표라도 ‘무엇을 맞히느냐’에 따라 회귀·분류·군집이 달라집니다."
      />
    )
  }

  const beatsBaseline =
    bundle.type === 'regression'
      ? bundle.model.mae <= bundle.baseline.mae
      : bundle.type === 'classification'
        ? bundle.model.accuracy >= bundle.baseline.accuracy
        : bundle.model.silhouette >= bundle.baseline.silhouette

  const baselineCompare =
    bundle.type === 'regression'
      ? `모델 MAE ${bundle.model.mae}, 기준(평균) MAE ${bundle.baseline.mae}. ${
          beatsBaseline ? '평균만 말하는 것보다 낫습니다.' : '아직 평균보다 못하거나 비슷합니다.'
        }`
      : bundle.type === 'classification'
        ? `모델 정확도 ${toPercent(bundle.model.accuracy)}%, 기준(다수 종류) ${toPercent(bundle.baseline.accuracy)}%. ${
            beatsBaseline ? '그냥 흔한 답만 고르는 것보다 낫습니다.' : '아직 다수 종류 기준을 넘지 못했습니다.'
          }`
        : `모델 실루엣 ${bundle.model.silhouette}, 기준(한 무리) ${bundle.baseline.silhouette}. ${
            beatsBaseline ? '안 나눈 것보다 무리가 더 갈라진 편입니다.' : '아직 한 무리 기준과 비슷합니다.'
          }`

  if (difficulty === 'intermediate') {
    return (
      <ExplainBox
        analogy="친구에게 “그냥 평균만 말해”라고 했을 때보다, 내 모델이 더 나은지 겨뤄 보는 것입니다."
        steps={[
          datasetLabel && targetLabel
            ? `「${datasetLabel}」에서 목표「${targetLabel}」은 ${typePlain} 문제입니다.`
            : `지금 문제는 ${typePlain}입니다. 목표를 바꾸면 유형도 바뀝니다.`,
          baselineCompare,
          '기준보다 나아야 “학습이 도움이 됐다”고 말할 수 있습니다. 숫자만 보지 말고 기준과 나란히 보세요.',
        ]}
        takeaway="기준 모델과 비교해야, 내 모델이 정말 쓸모 있는지 알 수 있습니다."
      />
    )
  }

  return (
    <ExplainBox
      analogy="숙제를 달달 외우면 연습 점수는 오르지만, 진짜 시험에서는 틀리기 쉽습니다."
      steps={[
        `이 경기는 ${typePlain}입니다. 회귀는 숫자, 분류는 종류, 군집은 정답 없이 묶기입니다.`,
        baselineCompare,
        showOverfit && overfit
          ? `과적합 실험에서 훈련 ${overfit.trainScore} vs 시험 ${overfit.testScore}. 연습만 잘 맞으면 규칙을 너무 세게 외운 신호입니다.`
          : '설정을 너무 세게 맞추면 연습만 잘 맞고 시험이 떨어질 수 있습니다. 아래 과적합 실험으로 확인해 보세요.',
      ]}
      takeaway="기준보다 나은지 보고, 연습만 외운 과적합도 함께 경계하세요."
    />
  )
}

function DataPreview({ datasetId, limit = 5 }: { datasetId: DatasetId; limit?: number }) {
  const rows = useMemo(() => buildDataset(datasetId, 80).slice(0, limit), [datasetId, limit])
  const columns = COLUMNS_BY_DATASET[datasetId]

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-xs">
        <caption className="mb-2 text-left text-xs text-slate-600">
          {DATASET_LABEL[datasetId]} 미리보기 (처음 {rows.length}줄)
        </caption>
        <thead>
          <tr>
            <th className="border-b border-slate-200 px-2 py-1.5 text-left font-bold text-slate-700">번호</th>
            {columns.map(col => (
              <th key={col.key} className="border-b border-slate-200 px-2 py-1.5 text-left font-bold text-slate-700">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td className="border-b border-slate-100 px-2 py-1 tabular-nums text-slate-700">{row.id}</td>
              {columns.map(col => (
                <td key={col.key} className="border-b border-slate-100 px-2 py-1 tabular-nums text-slate-600">
                  {row.values[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')

  // 초급
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [pickedType, setPickedType] = useState<ProblemType | null>(null)
  const [whyAnswer, setWhyAnswer] = useState('')
  const [checkedCards, setCheckedCards] = useState<string[]>([])

  // 중급·고급 공통
  const [datasetId, setDatasetId] = useState<DatasetId>('bike')
  const [targetKey, setTargetKey] = useState<string | null>('rentals')
  const [features, setFeatures] = useState<string[]>(['temp', 'humidity', 'wind', 'hour'])
  const [trainRatio, setTrainRatio] = useState(0.7)
  const [modelKind, setModelKind] = useState<ModelKind>('linear')
  const [k, setK] = useState(3)
  const [treeDepth, setTreeDepth] = useState(2)
  const [hasRun, setHasRun] = useState(false)
  const [showOverfit, setShowOverfit] = useState(false)
  const [modelCard, setModelCard] = useState<ModelCardDraft>({
    purpose: '',
    limits: '',
    misuse: '',
  })
  const [reflection, setReflection] = useState<Record<string, string>>({})

  const columns = COLUMNS_BY_DATASET[datasetId]
  const problemType = inferProblemType(targetKey, columns)

  const rows = useMemo(() => buildDataset(datasetId, 80), [datasetId])

  const experiment = useMemo(() => {
    if (!hasRun) return null
    const feat =
      features.length > 0
        ? features
        : problemType === 'clustering'
          ? CLUSTER_FEATURES[datasetId]
          : CLUSTER_FEATURES[datasetId].filter(key => key !== targetKey)

    let kind = modelKind
    if (problemType === 'regression' && kind !== 'linear' && kind !== 'knn') kind = 'linear'
    if (problemType === 'classification' && kind === 'linear') kind = 'knn'
    if (problemType === 'classification' && kind === 'kmeans') kind = 'knn'
    if (problemType === 'clustering') kind = 'kmeans'
    if (problemType === 'regression' && kind === 'kmeans') kind = 'linear'

    return runExperiment({
      problemType,
      modelKind: kind,
      rows,
      features: feat,
      targetKey,
      trainRatio,
      k,
      treeDepth,
    })
  }, [hasRun, features, problemType, datasetId, targetKey, modelKind, rows, trainRatio, k, treeDepth])

  const activeCard = PROBLEM_CARDS.find(c => c.id === activeCardId) ?? null

  const beginnerResult = useMemo(() => {
    if (!activeCard || pickedType !== activeCard.correctType) return null
    const ds = buildDataset(activeCard.datasetId, 80)
    const cols = COLUMNS_BY_DATASET[activeCard.datasetId]
    const target = cols.find(c => c.asTarget === activeCard.correctType)?.key ?? null
    const feat = CLUSTER_FEATURES[activeCard.datasetId].filter(key => key !== target)
    return beginnerDemo(activeCard.correctType, ds, feat, target)
  }, [activeCard, pickedType])

  const handleReset = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setActiveCardId(null)
    setPickedType(null)
    setWhyAnswer('')
    setCheckedCards([])
    setDatasetId('bike')
    setTargetKey('rentals')
    setFeatures(['temp', 'humidity', 'wind', 'hour'])
    setTrainRatio(0.7)
    setModelKind('linear')
    setK(3)
    setTreeDepth(2)
    setHasRun(false)
    setShowOverfit(false)
    setModelCard({ purpose: '', limits: '', misuse: '' })
    setReflection({})
  }, [])

  const handleDatasetChange = useCallback((id: DatasetId) => {
    setDatasetId(id)
    setHasRun(false)
    setShowOverfit(false)
    const targets = getTargetCandidates(id)
    const defaultTarget = targets[0]?.key ?? null
    setTargetKey(defaultTarget)
    const feat = CLUSTER_FEATURES[id].filter(key => key !== defaultTarget)
    setFeatures(feat)
    const inferred = inferProblemType(defaultTarget, COLUMNS_BY_DATASET[id])
    if (inferred === 'regression') setModelKind('linear')
    else if (inferred === 'classification') setModelKind('knn')
    else setModelKind('kmeans')
  }, [])

  const handleTargetChange = useCallback(
    (key: string | null) => {
      setTargetKey(key)
      setHasRun(false)
      setShowOverfit(false)
      const inferred = inferProblemType(key, COLUMNS_BY_DATASET[datasetId])
      if (inferred === 'clustering') {
        setFeatures(CLUSTER_FEATURES[datasetId])
        setModelKind('kmeans')
      } else {
        setFeatures(CLUSTER_FEATURES[datasetId].filter(f => f !== key))
        setModelKind(inferred === 'regression' ? 'linear' : 'knn')
      }
    },
    [datasetId]
  )

  const toggleFeature = useCallback((key: string) => {
    setFeatures(prev => {
      if (prev.includes(key)) {
        if (prev.length <= 1) return prev
        return prev.filter(f => f !== key)
      }
      return [...prev, key]
    })
    setHasRun(false)
  }, [])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setReflection(prev => ({ ...prev, [id]: value }))
  }, [])

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(reflection).some(v => v.trim().length > 0)
      if (answered) return 'reflect'

      if (current === 'beginner') {
        if (!activeCardId) return 'intro'
        if (!pickedType) return 'explore'
        if (pickedType && whyAnswer) return 'result'
        return 'explore'
      }

      if (hasRun) {
        if (current === 'advanced' && (showOverfit || modelCard.purpose.trim())) return 'challenge'
        return 'result'
      }
      if (features.length > 0 || targetKey) return 'explore'
      return 'intro'
    },
    [reflection, activeCardId, pickedType, whyAnswer, hasRun, showOverfit, modelCard.purpose, features, targetKey]
  )

  const buildExport = useCallback(
    (current: Difficulty) => {
      if (current === 'beginner') {
        return buildResult({
          moduleId: MODULE_ID,
          moduleName: MODULE_NAME,
          difficulty: current,
          version: DATA_VERSION,
          inputs: {
            확인한문제카드: checkedCards,
            마지막카드: activeCardId,
            고른유형: pickedType,
            이유선택: whyAnswer,
            데이터seed: DATA_SEED,
          },
          observations: {
            정답유형: activeCard?.correctType ?? null,
            유형일치: activeCard ? pickedType === activeCard.correctType : null,
          },
          metrics: beginnerResult
            ? beginnerResult.type === 'regression'
              ? {
                  모델MAE: beginnerResult.model.mae,
                  기준MAE: beginnerResult.baseline.mae,
                }
              : beginnerResult.type === 'classification'
                ? {
                    모델정확도: toPercent(beginnerResult.model.accuracy),
                    기준정확도: toPercent(beginnerResult.baseline.accuracy),
                  }
                : {
                    모델실루엣: beginnerResult.model.silhouette,
                    기준실루엣: beginnerResult.baseline.silhouette,
                  }
            : {},
          reflection,
        })
      }

      const metrics: Record<string, number | string> = {}
      if (experiment) {
        if (experiment.metrics.type === 'regression') {
          metrics.모델MAE = experiment.metrics.model.mae
          metrics.모델R2 = experiment.metrics.model.r2
          metrics.기준MAE = experiment.metrics.baseline.mae
        } else if (experiment.metrics.type === 'classification') {
          metrics.모델정확도 = toPercent(experiment.metrics.model.accuracy)
          metrics.기준정확도 = toPercent(experiment.metrics.baseline.accuracy)
          Object.entries(experiment.metrics.model.recallByClass).forEach(([label, v]) => {
            metrics[`재현율_${label}`] = toPercent(v)
          })
        } else {
          metrics.모델실루엣 = experiment.metrics.model.silhouette
          metrics.모델관성 = experiment.metrics.model.inertia
          metrics.기준실루엣 = experiment.metrics.baseline.silhouette
        }
        if (experiment.overfit && showOverfit) {
          metrics.과적합_훈련 = experiment.overfit.trainScore
          metrics.과적합_시험 = experiment.overfit.testScore
          metrics.과적합_격차 = experiment.overfit.gap
        }
      }

      return buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          데이터셋: DATASET_LABEL[datasetId],
          문제유형: PROBLEM_TYPE_LABEL[problemType],
          목표열: targetKey ? columnLabel(columns, targetKey) : '없음(군집)',
          특성: features.map(f => columnLabel(columns, f)),
          훈련비율: trainRatio,
          모델: modelKind,
          이웃수k: k,
          나무깊이: treeDepth,
          데이터seed: DATA_SEED,
          ...(current === 'advanced'
            ? {
                모델카드_목적: modelCard.purpose,
                모델카드_한계: modelCard.limits,
                모델카드_오용주의: modelCard.misuse,
              }
            : {}),
        },
        observations: {
          실행여부: hasRun,
          과적합실험: showOverfit,
        },
        metrics,
        reflection,
      })
    },
    [
      checkedCards,
      activeCardId,
      pickedType,
      whyAnswer,
      activeCard,
      beginnerResult,
      reflection,
      experiment,
      showOverfit,
      datasetId,
      problemType,
      targetKey,
      columns,
      features,
      trainRatio,
      modelKind,
      k,
      treeDepth,
      modelCard,
      hasRun,
    ]
  )

  const availableModels = MODEL_OPTIONS.filter(m => m.for.includes(problemType))
  const featureCandidates = columns.filter(
    col => col.kind === 'numeric' && col.key !== targetKey && col.asTarget !== 'regression'
  )

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="이 문제에는 어떤 종류의 기계학습이 어울릴까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={MODEL_OLYMPICS_STAGE_GUIDES}
      learningSupport={MODEL_OLYMPICS_LEARNING}
      notice={`자전거 대여량, 행성 암석, 에너지 사용 패턴 모두 교육용으로 만든 가상 데이터입니다(seed ${DATA_SEED}). 실제 대여·지질·전력 기록이 아닙니다.`}
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div className="space-y-4">
          {current === 'beginner' ? (
            <>
              <Panel
                title="1단계. 문제 카드 읽기"
                description="상황을 읽고, 숫자 맞히기·종류 고르기·묶기 중 어디에 가까운지 고릅니다."
              >
                <div className="grid gap-2 sm:grid-cols-3">
                  {PROBLEM_CARDS.map(card => (
                    <ChoiceCard
                      key={card.id}
                      selected={activeCardId === card.id}
                      title={card.title}
                      description={DATASET_LABEL[card.datasetId]}
                      onClick={() => {
                        setActiveCardId(card.id)
                        setPickedType(null)
                        setWhyAnswer('')
                        setCheckedCards(prev => (prev.includes(card.id) ? prev : [...prev, card.id]))
                      }}
                    />
                  ))}
                </div>
              </Panel>

              {activeCard && (
                <Panel title="2단계. 유형 고르기" description={activeCard.story}>
                  <DataPreview datasetId={activeCard.datasetId} />
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {(['regression', 'classification', 'clustering'] as ProblemType[]).map(type => (
                      <ChoiceCard
                        key={type}
                        selected={pickedType === type}
                        title={PROBLEM_TYPE_PLAIN[type]}
                        description={PROBLEM_TYPE_LABEL[type]}
                        onClick={() => {
                          setPickedType(type)
                          setWhyAnswer('')
                        }}
                      />
                    ))}
                  </div>

                  {pickedType && pickedType !== activeCard.correctType && (
                    <div className="mt-3">
                      <Callout tone="warn" title="다시 생각해 볼까요?">
                        맞혀야 할 답이 <strong>숫자</strong>인지, <strong>정해진 종류</strong>인지, 아니면{' '}
                        <strong>정답 라벨 없이 묶기</strong>인지 카드 문장을 한 번 더 읽어 보세요.
                      </Callout>
                    </div>
                  )}

                  {pickedType === activeCard.correctType && (
                    <div className="mt-4 space-y-3">
                      <Callout tone="info" title="맞았습니다">
                        이 문제는 {PROBLEM_TYPE_LABEL[activeCard.correctType]}에 가깝습니다. 아래에서 왜 그런지 고르고,
                        결과 그림을 살펴보세요.
                      </Callout>
                      <p className="text-sm font-semibold text-slate-900">왜 그렇게 분류했나요?</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {activeCard.whyChoices.map(choice => (
                          <ChoiceCard
                            key={choice}
                            selected={whyAnswer === choice}
                            title={choice}
                            onClick={() => setWhyAnswer(choice)}
                          />
                        ))}
                      </div>
                      {whyAnswer && whyAnswer !== activeCard.whyCorrect && (
                        <Callout tone="warn" title="힌트">
                          정답 라벨의 형태(숫자 / 종류 / 없음)를 기준으로 다시 골라 보세요.
                        </Callout>
                      )}
                      {whyAnswer === activeCard.whyCorrect && beginnerResult && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-slate-900">결과 그림</p>
                          <p className="text-xs text-slate-600">{activeCard.vizHint}</p>
                          <p className="text-xs text-slate-500">
                            모델과 <TermHelp term="기준 모델">아무 학습도 거의 하지 않은 단순한 예측(평균·다수·한 무리)</TermHelp>
                            을 항상 나란히 봅니다.
                          </p>
                          <MetricsPanel
                            bundle={
                              beginnerResult.type === 'regression'
                                ? {
                                    type: 'regression',
                                    model: beginnerResult.model,
                                    baseline: beginnerResult.baseline,
                                  }
                                : beginnerResult.type === 'classification'
                                  ? {
                                      type: 'classification',
                                      model: beginnerResult.model,
                                      baseline: beginnerResult.baseline,
                                    }
                                  : {
                                      type: 'clustering',
                                      model: beginnerResult.model,
                                      baseline: beginnerResult.baseline,
                                    }
                            }
                          />
                          <OlympicsExplainBox
                            difficulty="beginner"
                            problemType={activeCard.correctType}
                            bundle={
                              beginnerResult.type === 'regression'
                                ? {
                                    type: 'regression',
                                    model: beginnerResult.model,
                                    baseline: beginnerResult.baseline,
                                  }
                                : beginnerResult.type === 'classification'
                                  ? {
                                      type: 'classification',
                                      model: beginnerResult.model,
                                      baseline: beginnerResult.baseline,
                                    }
                                  : {
                                      type: 'clustering',
                                      model: beginnerResult.model,
                                      baseline: beginnerResult.baseline,
                                    }
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Panel>
              )}
            </>
          ) : (
            <>
              <Panel
                title="경기장 고르기"
                description="데이터셋을 고르고, 목표 열에 따라 문제 유형이 바뀝니다. 항상 기준 모델과 겨룹니다."
              >
                <div className="grid gap-2 sm:grid-cols-3">
                  {(['bike', 'rocks', 'energy'] as DatasetId[]).map(id => (
                    <ChoiceCard
                      key={id}
                      selected={datasetId === id}
                      title={DATASET_LABEL[id]}
                      description={DATASET_STORY[id]}
                      onClick={() => handleDatasetChange(id)}
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <DataPreview datasetId={datasetId} />
                </div>
              </Panel>

              <Panel
                title="목표와 특성"
                description="목표 열을 바꾸면 회귀·분류로 바뀌고, 목표를 비우면 군집입니다."
              >
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 text-xs font-bold text-slate-700">목표 열</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={targetKey === null ? 'primary' : 'secondary'}
                        onClick={() => handleTargetChange(null)}
                      >
                        없음 (묶기)
                      </Button>
                      {getTargetCandidates(datasetId).map(col => (
                        <Button
                          key={col.key}
                          variant={targetKey === col.key ? 'primary' : 'secondary'}
                          onClick={() => handleTargetChange(col.key)}
                        >
                          {col.label}
                          <span className="ml-1 text-[11px] font-normal opacity-80">
                            {col.asTarget === 'regression' ? '숫자' : '종류'}
                          </span>
                        </Button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      현재 문제 유형:{' '}
                      <strong className="text-primary">{PROBLEM_TYPE_LABEL[problemType]}</strong>
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold text-slate-700">쓸 특성 (숫자)</p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {featureCandidates.map(col => (
                        <ChoiceCard
                          key={col.key}
                          selected={features.includes(col.key)}
                          title={col.label}
                          description={col.meaning}
                          onClick={() => toggleFeature(col.key)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="train-ratio" className="text-xs font-bold text-slate-700">
                      훈련 비율 {Math.round(trainRatio * 100)}% / 시험 {Math.round((1 - trainRatio) * 100)}%
                    </label>
                    <input
                      id="train-ratio"
                      type="range"
                      min={50}
                      max={85}
                      step={5}
                      value={Math.round(trainRatio * 100)}
                      onChange={e => {
                        setTrainRatio(Number(e.target.value) / 100)
                        setHasRun(false)
                      }}
                      className="mt-1 w-full accent-primary"
                      disabled={problemType === 'clustering'}
                    />
                    {problemType === 'clustering' && (
                      <p className="mt-1 text-xs text-slate-500">
                        묶기(군집)는 정답 라벨 없이 전체 데이터를 나누므로 훈련·시험 분할을 쓰지 않습니다.
                      </p>
                    )}
                  </div>
                </div>
              </Panel>

              <Panel
                title={current === 'advanced' ? '모델 고르기' : '모델 실행'}
                description={
                  current === 'advanced'
                    ? '문제에 맞는 모델을 고르고 설정을 조절한 뒤 기준 모델과 비교합니다.'
                    : '기본 모델로 학습하고, 평균·다수·한 무리 기준과 성적을 비교합니다.'
                }
              >
                {current === 'advanced' && (
                  <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {availableModels.map(opt => (
                      <ChoiceCard
                        key={opt.id}
                        selected={modelKind === opt.id}
                        title={opt.label}
                        onClick={() => {
                          setModelKind(opt.id)
                          setHasRun(false)
                        }}
                      />
                    ))}
                  </div>
                )}

                {current === 'advanced' && (modelKind === 'knn' || problemType === 'clustering' || modelKind === 'kmeans') && (
                  <div className="mb-3">
                    <label htmlFor="k-slider" className="text-xs font-bold text-slate-700">
                      {problemType === 'clustering' ? '무리 개수 k' : '이웃 수 k'}: {k}
                    </label>
                    <input
                      id="k-slider"
                      type="range"
                      min={1}
                      max={9}
                      step={1}
                      value={k}
                      onChange={e => {
                        setK(Number(e.target.value))
                        setHasRun(false)
                      }}
                      className="mt-1 w-full accent-primary"
                    />
                  </div>
                )}

                {current === 'advanced' && modelKind === 'tree' && (
                  <div className="mb-3">
                    <label htmlFor="depth-slider" className="text-xs font-bold text-slate-700">
                      나무 깊이: {treeDepth}
                    </label>
                    <input
                      id="depth-slider"
                      type="range"
                      min={1}
                      max={4}
                      step={1}
                      value={treeDepth}
                      onChange={e => {
                        setTreeDepth(Number(e.target.value))
                        setHasRun(false)
                      }}
                      className="mt-1 w-full accent-primary"
                    />
                  </div>
                )}

                {current === 'intermediate' && (
                  <Callout tone="info" title="이 난이도에서 쓰는 모델">
                    {problemType === 'regression' && '선형 회귀로 숫자를 맞히고, 기준은 훈련 평균입니다.'}
                    {problemType === 'classification' && 'k-NN(이웃 3)으로 종류를 고르고, 기준은 가장 많은 종류입니다.'}
                    {problemType === 'clustering' && 'k-평균(k=3)으로 묶고, 기준은 전부 한 무리(k=1)입니다.'}
                  </Callout>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (current === 'intermediate') {
                        if (problemType === 'regression') setModelKind('linear')
                        else if (problemType === 'classification') {
                          setModelKind('knn')
                          setK(3)
                        } else {
                          setModelKind('kmeans')
                          setK(3)
                        }
                      }
                      setHasRun(true)
                    }}
                    disabled={features.length === 0 && problemType !== 'clustering'}
                  >
                    모델 vs 기준 실행
                  </Button>
                </div>
              </Panel>

              {experiment && (
                <>
                  <Panel title="성적표" description="모델과 기준 모델을 같은 시험 데이터로 비교합니다.">
                    <MetricsPanel bundle={experiment.metrics} />
                    {experiment.metrics.type === 'regression' && (
                      <p className="mt-3 text-xs text-slate-600">
                        <TermHelp term="결정계수 R²">1에 가까울수록 분산을 잘 설명합니다. 음수면 평균보다 못한 경우입니다.</TermHelp>
                        : {experiment.metrics.model.r2} (기준 {experiment.metrics.baseline.r2})
                      </p>
                    )}
                  </Panel>

                  <OlympicsExplainBox
                    difficulty={current}
                    problemType={problemType}
                    bundle={experiment.metrics}
                    overfit={experiment.overfit}
                    showOverfit={showOverfit}
                    datasetLabel={DATASET_LABEL[datasetId]}
                    targetLabel={
                      targetKey ? columnLabel(columns, targetKey) : '없음(묶기)'
                    }
                  />
                </>
              )}

              {current === 'advanced' && experiment?.overfit && (
                <Panel
                  title="과적합 사례 찾기"
                  description="훈련에만 잘 맞고 시험에서는 흔들리는 설정을 일부러 만들어 봅니다."
                  actions={
                    <Button variant="secondary" onClick={() => setShowOverfit(true)}>
                      과적합 실험 보기
                    </Button>
                  }
                >
                  {showOverfit ? (
                    <>
                      <OverfitView report={experiment.overfit} />
                      <div className="mt-3">
                        <ExplainBox
                          analogy="숙제만 달달 외우면 연습 점수는 오르고, 진짜 시험은 흔들립니다."
                          steps={[
                            experiment.overfit.setup,
                            `훈련 ${experiment.overfit.scoreLabel} ${experiment.overfit.trainScore} → 시험 ${experiment.overfit.testScore}.`,
                            `격차 ${experiment.overfit.gap}. 연습만 잘 맞으면 규칙을 너무 세게 외운 신호입니다.`,
                          ]}
                          takeaway="과적합은 ‘숙제는 만점, 시험은 약함’과 같습니다. 설정을 조금 단순하게 바꿔 보세요."
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-600">
                      버튼을 누르면 k=1 이웃·깊은 나무·너무 큰 k처럼 과한 설정의 훈련/시험 차이를 보여 줍니다.
                    </p>
                  )}
                </Panel>
              )}

              {current === 'advanced' && (
                <Panel
                  title="모델 카드 쓰기"
                  description="목적·한계·오용 주의를 적습니다. 점수용이 아니라 책임 있는 사용을 연습하는 칸입니다."
                >
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="card-purpose" className="text-xs font-bold text-slate-700">
                        목적 (무엇을 위해 쓰나)
                      </label>
                      <textarea
                        id="card-purpose"
                        rows={2}
                        value={modelCard.purpose}
                        onChange={e => setModelCard(prev => ({ ...prev, purpose: e.target.value }))}
                        placeholder="예) 날씨와 시간대로 대여소 재배치에 참고할 대략적인 대여 수 예측"
                        className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-limits" className="text-xs font-bold text-slate-700">
                        한계 (무엇을 못하나)
                      </label>
                      <textarea
                        id="card-limits"
                        rows={2}
                        value={modelCard.limits}
                        onChange={e => setModelCard(prev => ({ ...prev, limits: e.target.value }))}
                        placeholder="예) 축제·사고처럼 데이터에 없는 사건은 맞히지 못함. 가상 데이터로 학습함."
                        className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-misuse" className="text-xs font-bold text-slate-700">
                        오용 주의 (하면 안 되는 쓰임)
                      </label>
                      <textarea
                        id="card-misuse"
                        rows={2}
                        value={modelCard.misuse}
                        onChange={e => setModelCard(prev => ({ ...prev, misuse: e.target.value }))}
                        placeholder="예) 이 점수만으로 사람을 평가하거나, 실제 운영을 자동으로 결정하면 안 됨"
                        className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </Panel>
              )}
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

          {current !== 'beginner' && (
            <Panel title="데이터 사전">
              <table className="w-full border-collapse text-sm">
                <caption className="mb-2 text-left text-xs text-slate-600">
                  실험에 쓰인 항목의 뜻입니다. 모두 가상 값입니다.
                </caption>
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">데이터</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">항목</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">뜻</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">범위</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_DICTIONARY.map(entry => (
                    <tr key={`${entry.dataset}-${entry.field}`}>
                      <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{entry.dataset}</td>
                      <th scope="row" className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-800">
                        {entry.field}
                      </th>
                      <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{entry.meaning}</td>
                      <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{entry.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}
        </div>
      )}
    </ModuleFrame>
  )
}

function OverfitView({ report }: { report: OverfitReport }) {
  const worseOnTest = report.higherIsBetter
    ? report.testScore < report.trainScore
    : report.testScore > report.trainScore

  return (
    <div className="space-y-3">
      <Callout tone={worseOnTest ? 'warn' : 'info'} title="실험 설정">
        {report.setup}
      </Callout>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={`훈련 ${report.scoreLabel}`} value={report.trainScore} />
        <StatCard
          label={`시험 ${report.scoreLabel}`}
          value={report.testScore}
          tone={worseOnTest ? 'warn' : 'neutral'}
        />
        <StatCard
          label="격차"
          value={report.gap}
          hint={
            report.higherIsBetter
              ? '훈련 − 시험 (클수록 과적합 의심)'
              : '시험 − 훈련 (클수록 과적합 의심)'
          }
        />
      </div>
    </div>
  )
}
