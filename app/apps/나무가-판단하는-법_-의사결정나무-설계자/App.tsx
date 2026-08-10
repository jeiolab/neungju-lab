'use client'

import { useCallback, useMemo, useState } from 'react'
import { GitBranch, Plus, Scissors, Sparkles, Trash2 } from 'lucide-react'
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
  DECISION_TREE_STAGE_GUIDES,
  DECISION_TREE_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import {
  DATA_DICTIONARY,
  DATA_SEED,
  DATA_VERSION,
  FEATURE_KEYS,
  FEATURE_LABEL,
  FEATURE_RANGE,
  FEATURE_UNIT,
  HABITAT_COLOR,
  HABITAT_LABEL,
  HABITATS,
  QUESTION_CARDS,
  buildTestSet,
  buildTrainingSet,
} from './data'
import {
  addSplit,
  autoGrowTree,
  createRootTree,
  defaultThreshold,
  evaluateQuestionOrder,
  evaluateSplit,
  evaluateTree,
  findBestSplit,
  formatGini,
  isLeaf,
  leafCount,
  nodeStats,
  pruneToLeaf,
  rowsAtNode,
  toPercent,
  topSplitCandidates,
  treeDepth,
} from './logic'
import type { FeatureKey, HabitatCounts, OrderTrial, QuestionCard, TreeNode } from './types'

const MODULE_ID = '나무가-판단하는-법'
const MODULE_NAME = '나무가 판단하는 법'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary: '스무고개처럼 질문을 순서대로 골라 외계 생물이 어떤 환경에 사는지 맞혀 봅니다.',
    points: ['질문 카드 두세 개 중에서 고르기', '고른 질문으로 몇 마리를 맞혔는지 보기', '질문 순서를 바꿔 결과 비교'],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary: '나무를 직접 그리고 임계값을 조절하면서 훈련 성적과 시험 성적이 어떻게 달라지는지 봅니다.',
    points: ['질문 노드 추가와 임계값 조절', '노드에 도달한 데이터 분포 보기', '훈련 정확도와 테스트 정확도 구분'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary: '지니 불순도로 분할을 평가하고, 가지치기와 과적합을 실험으로 확인합니다.',
    points: ['지니 불순도와 개선량 확인', '자동 생성 나무와 비교', '훈련만 잘 맞는 나무를 일부러 만들기'],
    minutes: 45,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'order',
      prompt: '질문 순서를 바꿨을 때 맞힌 수가 달라진 이유는 무엇일까요?',
      choices: [
        '먼저 던진 질문이 무리를 잘 갈라서',
        '질문이 많을수록 무조건 좋아서',
        '생물이 질문을 기억해서',
      ],
    },
    {
      id: 'learned',
      prompt: '이 실험에서 알게 된 점을 한 문장으로 써 보세요.',
      sentences: 1,
      placeholder: '예) 어떤 질문을 먼저 하느냐에 따라 ...',
    },
  ],
  intermediate: [
    {
      id: 'trainTest',
      prompt: '훈련 성적과 시험 성적이 달랐다면, 그 차이가 무엇을 말해 주나요?',
      sentences: 2,
    },
    {
      id: 'split',
      prompt: '가장 도움이 된 분할(특성과 임계값)은 무엇이었고, 왜 그렇게 생각하나요?',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'gini',
      prompt: '지니 불순도 개선량이 큰 분할이 실제로 시험 성적에도 도움이 되었나요? 근거와 함께 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'overfit',
      prompt: '깊은 나무가 훈련에서는 잘 맞고 시험에서는 덜 맞는 이유를 자신의 말로 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'prune',
      prompt: '깊이 제한이나 가지치기를 했을 때 무엇이 좋아지고 무엇이 아쉬웠나요?',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

function HabitatBars({ counts, total }: { counts: HabitatCounts; total: number }) {
  return (
    <div className="space-y-1.5">
      {HABITATS.map(habitat => {
        const n = counts[habitat]
        const pct = total === 0 ? 0 : Math.round((n / total) * 100)
        return (
          <div key={habitat} className="flex items-center gap-2 text-xs">
            <span className={`w-20 shrink-0 rounded border px-1.5 py-0.5 text-center font-medium ${HABITAT_COLOR[habitat]}`}>
              {HABITAT_LABEL[habitat]}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
            <span className="w-14 shrink-0 tabular-nums text-slate-600">
              {n}마리 ({pct}%)
            </span>
          </div>
        )
      })}
    </div>
  )
}

function CreaturePreview({ creatures, limit = 6 }: { creatures: ReturnType<typeof buildTrainingSet>; limit?: number }) {
  const sample = creatures.slice(0, limit)
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-xs">
        <caption className="mb-2 text-left text-xs text-slate-600">
          생물 일부 미리보기 (처음 {sample.length}마리)
        </caption>
        <thead>
          <tr>
            <th className="border-b border-slate-200 px-2 py-1.5 text-left font-bold text-slate-700">번호</th>
            {FEATURE_KEYS.map(key => (
              <th key={key} className="border-b border-slate-200 px-2 py-1.5 text-left font-bold text-slate-700">
                {FEATURE_LABEL[key]}
              </th>
            ))}
            <th className="border-b border-slate-200 px-2 py-1.5 text-left font-bold text-slate-700">서식지</th>
          </tr>
        </thead>
        <tbody>
          {sample.map(c => (
            <tr key={c.id}>
              <td className="border-b border-slate-100 px-2 py-1 tabular-nums text-slate-700">{c.id}</td>
              {FEATURE_KEYS.map(key => (
                <td key={key} className="border-b border-slate-100 px-2 py-1 tabular-nums text-slate-600">
                  {c[key]}
                </td>
              ))}
              <td className="border-b border-slate-100 px-2 py-1">
                <span className={`rounded border px-1.5 py-0.5 font-medium ${HABITAT_COLOR[c.habitat]}`}>
                  {HABITAT_LABEL[c.habitat]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BeginnerLab({
  train,
  test,
  selectedIds,
  onToggle,
  onMove,
  onClear,
  trials,
  onSaveTrial,
  onClearTrials,
}: {
  train: ReturnType<typeof buildTrainingSet>
  test: ReturnType<typeof buildTestSet>
  selectedIds: string[]
  onToggle: (id: string) => void
  onMove: (id: string, dir: -1 | 1) => void
  onClear: () => void
  trials: OrderTrial[]
  onSaveTrial: () => void
  onClearTrials: () => void
}) {
  const selectedQuestions = selectedIds
    .map(id => QUESTION_CARDS.find(q => q.id === id))
    .filter((q): q is QuestionCard => Boolean(q))

  const result = useMemo(() => {
    if (selectedQuestions.length === 0) return null
    return evaluateQuestionOrder(train, test, selectedQuestions)
  }, [train, test, selectedQuestions])

  const trainStats = useMemo(() => nodeStats(train), [train])

  return (
    <div className="space-y-4">
      <Panel
        title="1단계. 외계 생물 살펴보기"
        description="각 생물의 몸길이·더듬이·발광·습도·온도를 보고, 어느 환경에 사는지 질문으로 알아냅니다."
      >
        <HabitatBars counts={trainStats.counts} total={trainStats.total} />
        <div className="mt-3">
          <CreaturePreview creatures={train} />
        </div>
      </Panel>

      <Panel
        title="2단계. 질문 카드를 순서대로 고르기"
        description="스무고개처럼 질문을 쌓아 보세요. 같은 질문이라도 순서가 바뀌면 맞히는 수가 달라질 수 있습니다."
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {QUESTION_CARDS.map(card => {
            const order = selectedIds.indexOf(card.id)
            const picked = order >= 0
            return (
              <ChoiceCard
                key={card.id}
                selected={picked}
                title={picked ? `${order + 1}. ${card.prompt}` : card.prompt}
                description={card.hint}
                onClick={() => onToggle(card.id)}
              />
            )
          })}
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-700">고른 질문 순서</p>
            <ol className="mt-2 space-y-2">
              {selectedQuestions.map((q, index) => (
                <li key={q.id} className="flex flex-wrap items-center gap-2 text-sm text-slate-800">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="flex-1">{q.prompt}</span>
                  <Button variant="ghost" disabled={index === 0} onClick={() => onMove(q.id, -1)}>
                    위로
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={index === selectedQuestions.length - 1}
                    onClick={() => onMove(q.id, 1)}
                  >
                    아래로
                  </Button>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" onClick={onSaveTrial} disabled={!result}>
                이 순서로 결과 저장
              </Button>
              <Button variant="ghost" onClick={onClear}>
                <Trash2 className="h-4 w-4" aria-hidden />
                질문 비우기
              </Button>
            </div>
          </div>
        )}
      </Panel>

      {result && (
        <>
          <Panel title="3단계. 맞힌 수 확인">
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                label="처음 보는 생물(시험)"
                value={`${result.test.correct}/${result.test.total}`}
                unit="마리"
                hint={`정확도 ${toPercent(result.test.accuracy)}%`}
                tone={result.test.accuracy >= 0.7 ? 'good' : 'warn'}
              />
              <StatCard
                label="연습용 생물(훈련)"
                value={`${result.train.correct}/${result.train.total}`}
                unit="마리"
                hint={`정확도 ${toPercent(result.train.accuracy)}% · 규칙을 익힐 때 쓴 데이터`}
              />
            </div>
            <div className="mt-3">
              <Callout tone="info" title="읽는 법">
                시험 성적이 더 중요합니다. 연습용 데이터에만 잘 맞고 처음 보는 생물은 못 맞히면, 질문이 특수한 경우만
                외운 것일 수 있습니다.
              </Callout>
            </div>
          </Panel>

          <ExplainBox
            analogy="스무고개에서 첫 질문이 좋으면, 남은 후보가 빨리 줄어듭니다."
            steps={[
              `지금 첫 질문은「${selectedQuestions[0]?.prompt ?? '없음'}」입니다.`,
              `이 순서로 처음 보는 생물을 ${result.test.correct}/${result.test.total}마리 맞혔습니다(정확도 ${toPercent(result.test.accuracy)}%).`,
              result.train.accuracy - result.test.accuracy > 0.1
                ? '연습용에서는 더 잘 맞혔습니다. 질문이 연습 데이터에만 맞춰진 건 아닌지 순서를 바꿔 보세요.'
                : trials.length > 1
                  ? '저장한 다른 순서와 비교해 보세요. 같은 질문이라도 앞쪽이 바뀌면 점수가 달라질 수 있습니다.'
                  : '질문을 바꿔 순서를 저장하면, 첫 질문이 왜 중요한지 비교할 수 있습니다.',
            ]}
            takeaway="좋은 첫 질문은 무리를 잘 갈라서, 뒤에 오는 질문이 더 쉽게 맞히게 해 줍니다."
          />
        </>
      )}

      {trials.length > 0 && (
        <Panel
          title="질문 순서 비교"
          description="저장한 실험끼리 시험 성적을 나란히 봅니다."
          actions={
            <Button variant="ghost" onClick={onClearTrials}>
              비교 목록 지우기
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">실험</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">질문 순서</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">시험 맞힌 수</th>
                </tr>
              </thead>
              <tbody>
                {trials.map(trial => (
                  <tr key={trial.id}>
                    <td className="border-b border-slate-100 px-3 py-2 font-medium text-slate-800">{trial.label}</td>
                    <td className="border-b border-slate-100 px-3 py-2 text-xs text-slate-600">
                      {trial.questionIds
                        .map(id => QUESTION_CARDS.find(q => q.id === id)?.prompt ?? id)
                        .join(' → ')}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 tabular-nums text-slate-800">
                      {trial.correct}/{trial.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  )
}

function TreeNodeCard({
  node,
  selected,
  onSelect,
  showGini,
  stats,
  label,
}: {
  node: TreeNode
  selected: boolean
  onSelect: () => void
  showGini?: boolean
  stats: ReturnType<typeof nodeStats>
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        selected ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        {selected && <span className="text-xs font-bold text-primary">선택함</span>}
      </div>
      {node.feature && node.threshold !== null ? (
        <p className="mt-1 text-xs text-slate-700">
          {FEATURE_LABEL[node.feature]} ≥ {node.threshold}
          {FEATURE_UNIT[node.feature]} ?
        </p>
      ) : (
        <p className="mt-1 text-xs text-slate-600">잎 · 예측: {HABITAT_LABEL[node.prediction]}</p>
      )}
      <p className="mt-1 text-xs text-slate-500">
        {stats.total}마리 · 다수 {HABITAT_LABEL[stats.majority]}
        {showGini && ` · 지니 ${formatGini(stats.gini)}`}
      </p>
    </button>
  )
}

function TreeLab({
  difficulty,
  train,
  test,
  nodes,
  rootId,
  selectedNodeId,
  onSelectNode,
  draftFeature,
  draftThreshold,
  onChangeFeature,
  onChangeThreshold,
  onAddSplit,
  onPrune,
  onResetTree,
  onAutoGrow,
  maxDepth,
  onChangeMaxDepth,
  minImprovement,
  onChangeMinImprovement,
}: {
  difficulty: Difficulty
  train: ReturnType<typeof buildTrainingSet>
  test: ReturnType<typeof buildTestSet>
  nodes: TreeNode[]
  rootId: string
  selectedNodeId: string
  onSelectNode: (id: string) => void
  draftFeature: FeatureKey
  draftThreshold: number
  onChangeFeature: (f: FeatureKey) => void
  onChangeThreshold: (n: number) => void
  onAddSplit: () => void
  onPrune: () => void
  onResetTree: () => void
  onAutoGrow: () => void
  maxDepth: number
  onChangeMaxDepth: (n: number) => void
  minImprovement: number
  onChangeMinImprovement: (n: number) => void
}) {
  const selected = nodes.find(n => n.id === selectedNodeId) ?? nodes[0]
  const atSelected = useMemo(
    () => rowsAtNode(train, nodes, rootId, selected.id),
    [train, nodes, rootId, selected.id]
  )
  const selectedStats = useMemo(() => nodeStats(atSelected), [atSelected])
  const splitPreview = useMemo(
    () => evaluateSplit(atSelected, draftFeature, draftThreshold),
    [atSelected, draftFeature, draftThreshold]
  )
  const trainAcc = useMemo(() => evaluateTree(train, nodes, rootId), [train, nodes, rootId])
  const testAcc = useMemo(() => evaluateTree(test, nodes, rootId), [test, nodes, rootId])
  const best = useMemo(() => findBestSplit(atSelected), [atSelected])
  const topCandidates = useMemo(
    () => (difficulty === 'advanced' ? topSplitCandidates(atSelected, 5) : []),
    [difficulty, atSelected]
  )

  const sortedNodes = useMemo(
    () => [...nodes].sort((a, b) => a.depth - b.depth || a.id.localeCompare(b.id)),
    [nodes]
  )

  const overfitGap = trainAcc.accuracy - testAcc.accuracy
  const hasSplits = nodes.some(n => n.feature != null)
  const depth = treeDepth(nodes)
  const firstSplit = nodes.find(n => n.parentId === null && n.feature != null)

  return (
    <div className="space-y-4">
      <Panel
        title="의사결정나무 만들기"
        description="잎을 고른 뒤 특성과 임계값으로 둘로 나눕니다. '예'(이상)는 왼쪽, '아니오'는 오른쪽입니다."
        actions={
          <div className="flex flex-wrap gap-2">
            {difficulty === 'advanced' && (
              <Button variant="primary" onClick={onAutoGrow}>
                <Sparkles className="h-4 w-4" aria-hidden />
                자동으로 키우기
              </Button>
            )}
            <Button variant="ghost" onClick={onResetTree}>
              나무 초기화
            </Button>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="훈련 정확도"
            value={toPercent(trainAcc.accuracy)}
            unit="%"
            hint={`${trainAcc.correct}/${trainAcc.total}마리`}
            tone={trainAcc.accuracy >= 0.75 ? 'good' : 'neutral'}
          />
          <StatCard
            label="시험 정확도"
            value={toPercent(testAcc.accuracy)}
            unit="%"
            hint={`${testAcc.correct}/${testAcc.total}마리 · 처음 보는 생물`}
            tone={testAcc.accuracy >= 0.7 ? 'good' : 'warn'}
          />
          <StatCard label="나무 깊이" value={depth} unit="단" hint={`잎 ${leafCount(nodes)}개`} />
          <StatCard
            label="훈련−시험 차이"
            value={toPercent(overfitGap)}
            unit="%p"
            hint={overfitGap > 0.15 ? '과적합 신호가 보일 수 있습니다' : '차이가 크지 않습니다'}
            tone={overfitGap > 0.15 ? 'warn' : 'neutral'}
          />
        </div>
      </Panel>

      {hasSplits && (
        <ExplainBox
          analogy={
            difficulty === 'advanced'
              ? '숙제만 달달 외우면 연습 점수는 오르지만, 진짜 시험에서는 틀리기 쉽습니다.'
              : '숙제를 달달 외운 것과, 진짜 시험에서 푸는 것은 다릅니다.'
          }
          steps={
            difficulty === 'advanced'
              ? [
                  firstSplit
                    ? `첫 질문(뿌리)은「${FEATURE_LABEL[firstSplit.feature!]} ≥ ${firstSplit.threshold}${FEATURE_UNIT[firstSplit.feature!]}」입니다. 여기서 무리가 얼마나 갈라지는지가 중요합니다.`
                    : '뿌리에서 던진 첫 질문이 무리를 잘 갈라야, 뒤 질문이 더 쉬워집니다.',
                  best
                    ? `지니 개선량 ${formatGini(best.improvement)}은 “이 질문으로 섞인 정도가 얼마나 줄었는지”입니다. 클수록 무리가 더 깨끗해진 편입니다.`
                    : '지니 개선량은 “질문이 섞임을 얼마나 줄였는지”입니다. 클수록 더 잘 가른 것입니다.',
                  overfitGap > 0.12
                    ? `지금 나무는 깊이 ${depth}단입니다. 훈련 ${toPercent(trainAcc.accuracy)}%인데 시험은 ${toPercent(testAcc.accuracy)}%라, 연습 데이터만 외운 신호일 수 있습니다.`
                    : `지금 깊이 ${depth}단에서 훈련 ${toPercent(trainAcc.accuracy)}%, 시험 ${toPercent(testAcc.accuracy)}%입니다. 차이가 크지 않으면 규칙을 너무 깊게 외우지 않은 편입니다.`,
                ]
              : [
                  firstSplit
                    ? `첫 분할은「${FEATURE_LABEL[firstSplit.feature!]} ≥ ${firstSplit.threshold}${FEATURE_UNIT[firstSplit.feature!]}」입니다. 첫 질문이 좋으면 뒤가 쉬워집니다.`
                    : '첫 질문이 무리를 잘 갈라야, 뒤에 붙이는 질문이 더 잘 맞힙니다.',
                  `연습(훈련) ${toPercent(trainAcc.accuracy)}%, 처음 보는 생물(시험) ${toPercent(testAcc.accuracy)}%입니다.`,
                  overfitGap > 0.12
                    ? '연습만 잘 맞고 시험이 낮으면, 깊은 나무가 숙제 답만 외운 것일 수 있습니다. 가지를 줄여 보세요.'
                    : '두 성적이 비슷하면, 규칙을 일반화해 본 편에 가깝습니다.',
                ]
          }
          takeaway={
            difficulty === 'advanced'
              ? '지니 개선이 큰 질문이 더 잘 가르고, 너무 깊은 나무는 숙제만 외워 시험에 약해질 수 있습니다.'
              : '첫 질문이 중요하고, 연습만 잘 맞는 나무는 진짜 시험에서 흔들릴 수 있습니다.'
          }
        />
      )}

      {difficulty === 'advanced' && (
        <Panel
          title="자동 성장 · 깊이 제한 실험"
          description="깊이를 키우면 훈련 성적은 오르기 쉽지만, 시험 성적은 오히려 떨어질 수 있습니다."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">최대 깊이: {maxDepth}</span>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={maxDepth}
                onChange={e => onChangeMaxDepth(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">
                최소 개선량: {formatGini(minImprovement)}
              </span>
              <input
                type="range"
                min={0}
                max={0.1}
                step={0.005}
                value={minImprovement}
                onChange={e => onChangeMinImprovement(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <span className="mt-1 block text-xs text-slate-500">
                값이 클수록 분할을 아끼고, 작을수록 깊게 자랍니다.
              </span>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                onChangeMaxDepth(2)
                onChangeMinImprovement(0.02)
              }}
            >
              얕은 나무 설정
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                onChangeMaxDepth(8)
                onChangeMinImprovement(0)
              }}
            >
              깊은 나무(과적합) 설정
            </Button>
            <Button variant="primary" onClick={onAutoGrow}>
              이 설정으로 자동 성장
            </Button>
          </div>
        </Panel>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="나무 구조" description="노드를 누르면 그 자리에 도착한 생물 분포를 볼 수 있습니다.">
          <div className="space-y-2">
            {sortedNodes.map(node => {
              const rows = rowsAtNode(train, nodes, rootId, node.id)
              const stats = nodeStats(rows)
              const indent = node.depth
              const branch =
                node.parentId === null
                  ? '뿌리'
                  : (() => {
                      const parent = nodes.find(n => n.id === node.parentId)
                      if (!parent) return node.id
                      if (parent.leftId === node.id) return '예 (이상)'
                      if (parent.rightId === node.id) return '아니오 (미만)'
                      return node.id
                    })()
              return (
                <div key={node.id} style={{ marginLeft: `${indent * 12}px` }}>
                  <TreeNodeCard
                    node={node}
                    selected={node.id === selected.id}
                    onSelect={() => onSelectNode(node.id)}
                    showGini={difficulty === 'advanced'}
                    stats={stats}
                    label={`${branch} · ${node.id}`}
                  />
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel
          title="선택한 노드"
          description={
            isLeaf(selected)
              ? '잎에 분할을 추가해 나무를 키울 수 있습니다.'
              : '이미 갈라진 노드입니다. 가지치기로 잎으로 되돌릴 수 있습니다.'
          }
        >
          <HabitatBars counts={selectedStats.counts} total={selectedStats.total} />

          {difficulty === 'advanced' && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <p>
                <TermHelp term="지니 불순도">
                  한 묶음에 서식지가 얼마나 섞여 있는지를 나타냅니다. 0이면 한 종류만 있고, 값이 클수록 섞여 있습니다.
                </TermHelp>
                : <span className="font-bold tabular-nums">{formatGini(selectedStats.gini)}</span>
              </p>
              {best && (
                <p className="mt-1 text-xs text-slate-600">
                  추천 분할: {FEATURE_LABEL[best.feature]} ≥ {best.threshold} (개선량{' '}
                  {formatGini(best.improvement)})
                </p>
              )}
            </div>
          )}

          {isLeaf(selected) ? (
            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">특성</span>
                <select
                  value={draftFeature}
                  onChange={e => onChangeFeature(e.target.value as FeatureKey)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {FEATURE_KEYS.map(key => (
                    <option key={key} value={key}>
                      {FEATURE_LABEL[key]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">
                  임계값: {draftThreshold}
                  {FEATURE_UNIT[draftFeature]} 이상이면 &apos;예&apos;
                </span>
                <input
                  type="range"
                  min={FEATURE_RANGE[draftFeature].min}
                  max={FEATURE_RANGE[draftFeature].max}
                  step={FEATURE_RANGE[draftFeature].step}
                  value={draftThreshold}
                  onChange={e => onChangeThreshold(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>

              {splitPreview ? (
                <Callout tone="info" title="분할 미리보기">
                  왼쪽(예) {splitPreview.leftCount}마리 · 오른쪽(아니오) {splitPreview.rightCount}마리
                  {difficulty === 'advanced' && (
                    <>
                      <br />
                      분할 전 지니 {formatGini(splitPreview.giniBefore)} → 후{' '}
                      {formatGini(splitPreview.giniAfter)} (개선 {formatGini(splitPreview.improvement)})
                    </>
                  )}
                </Callout>
              ) : (
                <Callout tone="warn" title="이 임계값으로는 나눌 수 없습니다">
                  한쪽 갈래가 비게 됩니다. 임계값을 바꿔 보세요.
                </Callout>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={onAddSplit} disabled={!splitPreview}>
                  <Plus className="h-4 w-4" aria-hidden />
                  이 분할 추가
                </Button>
                {difficulty === 'advanced' && best && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      onChangeFeature(best.feature)
                      onChangeThreshold(best.threshold)
                    }}
                  >
                    <GitBranch className="h-4 w-4" aria-hidden />
                    추천값 채우기
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-slate-700">
                분할: {FEATURE_LABEL[selected.feature!]} ≥ {selected.threshold}
              </p>
              <Button variant="danger" className="mt-3" onClick={onPrune}>
                <Scissors className="h-4 w-4" aria-hidden />
                여기부터 가지치기(잎으로)
              </Button>
            </div>
          )}
        </Panel>
      </div>

      {difficulty === 'advanced' && topCandidates.length > 0 && isLeaf(selected) && (
        <Panel title="분할 후보 (지니 개선량 순)">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold">특성</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold">임계값</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold">개선량</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold">왼쪽/오른쪽</th>
                </tr>
              </thead>
              <tbody>
                {topCandidates.map(c => (
                  <tr key={`${c.feature}-${c.threshold}`}>
                    <td className="border-b border-slate-100 px-3 py-2">{FEATURE_LABEL[c.feature]}</td>
                    <td className="border-b border-slate-100 px-3 py-2 tabular-nums">≥ {c.threshold}</td>
                    <td className="border-b border-slate-100 px-3 py-2 tabular-nums font-semibold">
                      {formatGini(c.improvement)}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 tabular-nums text-slate-600">
                      {c.leftCount} / {c.rightCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {difficulty === 'advanced' && overfitGap > 0.12 && (
        <Callout tone="warn" title="과적합 관찰">
          훈련 정확도({toPercent(trainAcc.accuracy)}%)가 시험 정확도({toPercent(testAcc.accuracy)}%)보다 눈에 띄게
          높습니다. 나무가 연습 데이터의 세부 패턴까지 외웠을 수 있습니다. 깊이를 줄이거나 가지치기를 해 보세요.
        </Callout>
      )}
    </div>
  )
}

export default function App() {
  const train = useMemo(() => buildTrainingSet(), [])
  const test = useMemo(() => buildTestSet(), [])

  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [trials, setTrials] = useState<OrderTrial[]>([])
  const [reflection, setReflection] = useState<Record<string, string>>({})

  const initialTree = useMemo(() => createRootTree(train), [train])
  const [nodes, setNodes] = useState<TreeNode[]>(() => initialTree.nodes)
  const [rootId, setRootId] = useState(initialTree.rootId)
  const [selectedNodeId, setSelectedNodeId] = useState(initialTree.rootId)
  const [draftFeature, setDraftFeature] = useState<FeatureKey>('humidity')
  const [draftThreshold, setDraftThreshold] = useState(6)
  const [maxDepth, setMaxDepth] = useState(4)
  const [minImprovement, setMinImprovement] = useState(0.01)
  const [treeTouched, setTreeTouched] = useState(false)

  const resetTree = useCallback(() => {
    const fresh = createRootTree(train)
    setNodes(fresh.nodes)
    setRootId(fresh.rootId)
    setSelectedNodeId(fresh.rootId)
    setTreeTouched(false)
  }, [train])

  const handleReset = useCallback(
    (next: Difficulty) => {
      setDifficulty(next)
      setSelectedIds([])
      setTrials([])
      setReflection({})
      setDraftFeature('humidity')
      setDraftThreshold(6)
      setMaxDepth(4)
      setMinImprovement(0.01)
      const fresh = createRootTree(train)
      setNodes(fresh.nodes)
      setRootId(fresh.rootId)
      setSelectedNodeId(fresh.rootId)
      setTreeTouched(false)
    },
    [train]
  )

  const handleToggleQuestion = useCallback((id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }, [])

  const handleMoveQuestion = useCallback((id: string, dir: -1 | 1) => {
    setSelectedIds(prev => {
      const index = prev.indexOf(id)
      const nextIndex = index + dir
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev
      const copy = [...prev]
      ;[copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]]
      return copy
    })
  }, [])

  const handleSaveTrial = useCallback(() => {
    if (selectedIds.length === 0) return
    const questions = selectedIds
      .map(id => QUESTION_CARDS.find(q => q.id === id))
      .filter((q): q is QuestionCard => Boolean(q))
    const { test: testReport } = evaluateQuestionOrder(train, test, questions)
    setTrials(prev => [
      ...prev,
      {
        id: `trial-${Date.now()}`,
        label: `실험 ${prev.length + 1}`,
        questionIds: [...selectedIds],
        correct: testReport.correct,
        total: testReport.total,
      },
    ])
  }, [selectedIds, train, test])

  const handleAddSplit = useCallback(() => {
    const next = addSplit(nodes, rootId, train, selectedNodeId, draftFeature, draftThreshold)
    if (!next) return
    setNodes(next)
    setTreeTouched(true)
    const parent = next.find(n => n.id === selectedNodeId)
    if (parent?.leftId) setSelectedNodeId(parent.leftId)
  }, [nodes, rootId, train, selectedNodeId, draftFeature, draftThreshold])

  const handlePrune = useCallback(() => {
    setNodes(pruneToLeaf(nodes, selectedNodeId, train, rootId))
    setTreeTouched(true)
  }, [nodes, selectedNodeId, train, rootId])

  const handleAutoGrow = useCallback(() => {
    const grown = autoGrowTree(train, { maxDepth, minImprovement, minSamples: 3 })
    setNodes(grown.nodes)
    setRootId(grown.rootId)
    setSelectedNodeId(grown.rootId)
    setTreeTouched(true)
  }, [train, maxDepth, minImprovement])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setReflection(prev => ({ ...prev, [id]: value }))
  }, [])

  const handleFeatureChange = useCallback((feature: FeatureKey) => {
    setDraftFeature(feature)
    setDraftThreshold(defaultThreshold(feature))
  }, [])

  const buildExport = useCallback(
    (current: Difficulty) => {
      if (current === 'beginner') {
        const questions = selectedIds
          .map(id => QUESTION_CARDS.find(q => q.id === id))
          .filter((q): q is QuestionCard => Boolean(q))
        const evalResult =
          questions.length > 0 ? evaluateQuestionOrder(train, test, questions) : null
        return buildResult({
          moduleId: MODULE_ID,
          moduleName: MODULE_NAME,
          difficulty: current,
          version: DATA_VERSION,
          inputs: {
            질문순서: questions.map(q => q.prompt),
            비교실험수: trials.length,
            데이터seed: DATA_SEED,
          },
          observations: {
            저장한실험: trials.map(t => ({
              라벨: t.label,
              맞힌수: `${t.correct}/${t.total}`,
              질문: t.questionIds,
            })),
          },
          metrics: evalResult
            ? {
                시험정확도: toPercent(evalResult.test.accuracy),
                훈련정확도: toPercent(evalResult.train.accuracy),
                시험맞힌수: evalResult.test.correct,
              }
            : { 상태: '질문 없음' },
          reflection,
        })
      }

      const trainAcc = evaluateTree(train, nodes, rootId)
      const testAcc = evaluateTree(test, nodes, rootId)
      return buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          나무깊이: treeDepth(nodes),
          잎개수: leafCount(nodes),
          최대깊이설정: maxDepth,
          최소개선량: minImprovement,
          데이터seed: DATA_SEED,
        },
        observations: {
          노드수: nodes.length,
          분할목록: nodes
            .filter(n => n.feature && n.threshold !== null)
            .map(n => `${FEATURE_LABEL[n.feature!]}≥${n.threshold}`),
        },
        metrics: {
          훈련정확도: toPercent(trainAcc.accuracy),
          시험정확도: toPercent(testAcc.accuracy),
          훈련시험차이: toPercent(trainAcc.accuracy - testAcc.accuracy),
        },
        reflection,
      })
    },
    [selectedIds, trials, reflection, train, test, nodes, rootId, maxDepth, minImprovement]
  )

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(reflection).some(value => value.trim().length > 0)
      if (answered) return 'reflect'
      if (current === 'beginner') {
        if (selectedIds.length === 0) return 'intro'
        if (trials.length === 0) return 'explore'
        return 'result'
      }
      if (treeTouched && treeDepth(nodes) > 0) {
        const trainAcc = evaluateTree(train, nodes, rootId)
        const testAcc = evaluateTree(test, nodes, rootId)
        if (trainAcc.accuracy - testAcc.accuracy > 0.12 || leafCount(nodes) >= 4) return 'result'
        return 'challenge'
      }
      if (treeTouched) return 'explore'
      return 'intro'
    },
    [reflection, selectedIds, trials, treeTouched, nodes, train, test, rootId]
  )

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="어떤 질문을 먼저 던지느냐에 따라 판단이 얼마나 달라질까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={DECISION_TREE_STAGE_GUIDES}
      learningSupport={DECISION_TREE_LEARNING}
      notice={`가상의 외계 생물 서식 환경 데이터입니다(seed ${DATA_SEED}). 실제 사람의 정보는 사용하지 않습니다.`}
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div className="space-y-4">
          {current === 'beginner' ? (
            <BeginnerLab
              train={train}
              test={test}
              selectedIds={selectedIds}
              onToggle={handleToggleQuestion}
              onMove={handleMoveQuestion}
              onClear={() => setSelectedIds([])}
              trials={trials}
              onSaveTrial={handleSaveTrial}
              onClearTrials={() => setTrials([])}
            />
          ) : (
            <TreeLab
              difficulty={current}
              train={train}
              test={test}
              nodes={nodes}
              rootId={rootId}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              draftFeature={draftFeature}
              draftThreshold={draftThreshold}
              onChangeFeature={handleFeatureChange}
              onChangeThreshold={setDraftThreshold}
              onAddSplit={handleAddSplit}
              onPrune={handlePrune}
              onResetTree={resetTree}
              onAutoGrow={handleAutoGrow}
              maxDepth={maxDepth}
              onChangeMaxDepth={setMaxDepth}
              minImprovement={minImprovement}
              onChangeMinImprovement={setMinImprovement}
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
                  이 실험에 쓰인 항목의 뜻과 값의 범위입니다.
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
                      <th
                        scope="row"
                        className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-800"
                      >
                        {entry.field}
                      </th>
                      <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{entry.meaning}</td>
                      <td className="border-b border-slate-100 px-3 py-2 tabular-nums text-slate-600">
                        {entry.range}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-slate-500">
                훈련 {train.length}마리 · 시험 {test.length}마리 · 서식지{' '}
                {HABITATS.map(h => HABITAT_LABEL[h]).join(' / ')}. 같은 seed면 언제나 같은 데이터가 만들어집니다.
              </p>
            </Panel>
          )}
        </div>
      )}
    </ModuleFrame>
  )
}
