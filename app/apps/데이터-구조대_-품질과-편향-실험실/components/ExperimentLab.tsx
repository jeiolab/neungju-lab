'use client'

import { useMemo, useState } from 'react'
import { Play, Target, Undo2 } from 'lucide-react'
import { Button, Callout, ChoiceCard, ExplainBox, Panel, StatCard, TermHelp } from '../../_ai-lab-shared'
import type { Difficulty } from '../../_ai-lab-shared'
import { MISSION, PREPROCESS_CARDS } from '../data'
import { applyPreprocess, detectQuality, evaluate, knnPredict, toPercent } from '../logic'
import type { IssueKind, PreprocessId, Student } from '../types'
import DataTable, { IssueLegend } from './DataTable'
import MetricsView from './MetricsView'

const ISSUE_TABS: Array<{ kind: IssueKind; label: string }> = [
  { kind: 'missing', label: '빈칸' },
  { kind: 'outlier', label: '이상한 값' },
  { kind: 'duplicate', label: '중복' },
  { kind: 'suspiciousLabel', label: '의심스러운 결과' },
]

export default function ExperimentLab({
  difficulty,
  trainRows,
  testRows,
  selected,
  onToggle,
  onClear,
  k,
  onChangeK,
  hasRun,
  onRun,
}: {
  difficulty: Difficulty
  trainRows: Student[]
  testRows: Student[]
  selected: Set<PreprocessId>
  onToggle: (id: PreprocessId) => void
  onClear: () => void
  k: number
  onChangeK: (k: number) => void
  hasRun: boolean
  onRun: () => void
}) {
  const [activeTab, setActiveTab] = useState<IssueKind>('missing')
  const isAdvanced = difficulty === 'advanced'

  const quality = useMemo(() => detectQuality(trainRows), [trainRows])

  const cards = useMemo(
    () => PREPROCESS_CARDS.filter(card => (isAdvanced ? true : card.level === 'intermediate')),
    [isAdvanced]
  )

  const processed = useMemo(() => applyPreprocess(trainRows, selected), [trainRows, selected])

  const baseline = useMemo(
    () => evaluate(testRows, knnPredict(trainRows, testRows, 3, false)),
    [trainRows, testRows]
  )

  const current = useMemo(() => {
    if (processed.blockedReason) return null
    return evaluate(
      testRows,
      knnPredict(processed.rows, testRows, k, processed.normalized, processed.excluded)
    )
  }, [processed, testRows, k])

  const spentBudget = useMemo(
    () =>
      cards
        .filter(card => selected.has(card.id))
        .reduce((sum, card) => sum + card.cost, 0),
    [cards, selected]
  )

  const overBudget = spentBudget > MISSION.budget
  const missionCleared =
    current !== null &&
    !overBudget &&
    current.recall >= MISSION.targetRecall &&
    current.recallGap <= MISSION.maxGap

  const visibleIssues = quality.issues.filter(issue => issue.kind === activeTab)

  return (
    <div className="space-y-4">
      <Panel
        title="1단계. 데이터에 어떤 문제가 있는지 찾기"
        description="모델을 고치기 전에 데이터를 먼저 봅니다."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="빈칸" value={quality.missingCount} unit="개" hint="값이 기록되지 않은 칸" />
          <StatCard label="이상한 값" value={quality.outlierCount} unit="개" hint="정해진 범위를 벗어난 값" />
          <StatCard label="중복된 줄" value={quality.duplicateCount} unit="줄" hint="내용이 완전히 같은 줄" />
          <StatCard
            label="그룹 수 차이"
            value={`${quality.groupCounts.A} : ${quality.groupCounts.B}`}
            hint="A 그룹과 B 그룹의 줄 수. 한쪽이 너무 적으면 그쪽을 잘 배우지 못합니다."
            tone={
              Math.abs(quality.groupCounts.A - quality.groupCounts.B) > 10 ? 'warn' : 'neutral'
            }
          />
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="품질 문제 종류">
            {ISSUE_TABS.map(tab => {
              const count = quality.issues.filter(issue => issue.kind === tab.kind).length
              const active = tab.kind === activeTab
              return (
                <button
                  key={tab.kind}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.kind)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                  <span className="ml-1 tabular-nums">{count}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-3 space-y-3">
            <IssueLegend kinds={[activeTab]} />
            {visibleIssues.length === 0 ? (
              <Callout>이 종류의 문제는 발견되지 않았습니다.</Callout>
            ) : (
              <DataTable
                rows={trainRows.filter(row =>
                  visibleIssues.some(issue => issue.rowId === row.id)
                )}
                issues={visibleIssues}
                caption={`${ISSUE_TABS.find(tab => tab.kind === activeTab)?.label} 문제가 있는 행 목록`}
              />
            )}
            {activeTab === 'suspiciousLabel' && (
              <p className="text-xs leading-relaxed text-slate-600">
                의심스러운 결과는 <strong>확실한 오류가 아니라 추측</strong>입니다. 비슷한 사례들과 결과가 다르다는 뜻일 뿐,
                진짜 예외적인 학생이었을 수도 있습니다.
              </p>
            )}
          </div>
        </div>
      </Panel>

      <Panel
        title="2단계. 어떻게 고칠지 고르기"
        description="고치는 방법마다 좋은 점과 잃는 것이 함께 있습니다."
        actions={
          <Button variant="ghost" onClick={onClear} disabled={selected.size === 0}>
            <Undo2 className="h-4 w-4" aria-hidden />
            모두 해제
          </Button>
        }
      >
        {isAdvanced && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                <Target className="h-4 w-4 text-primary" aria-hidden />
                정비 미션
              </p>
              <p className={`text-sm font-bold tabular-nums ${overBudget ? 'text-rose-600' : 'text-slate-700'}`}>
                사용한 비용 {spentBudget} / {MISSION.budget}점
              </p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              비용 {MISSION.budget}점 안에서 재현율을 {toPercent(MISSION.targetRecall)}% 이상으로 올리고,
              두 그룹의 재현율 격차를 {toPercent(MISSION.maxGap)}%p 이하로 줄여 보세요.
            </p>
            {overBudget && (
              <p className="mt-2 text-xs font-semibold text-rose-600">
                비용을 초과했습니다. 실험은 계속할 수 있지만 미션은 달성으로 보지 않습니다.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {cards.map(card => (
            <div key={card.id} className="space-y-1.5">
              <ChoiceCard
                selected={selected.has(card.id)}
                title={
                  isAdvanced ? `${card.name} (비용 ${card.cost}점)` : card.plainName
                }
                description={card.description}
                onClick={() => onToggle(card.id)}
              />
              {selected.has(card.id) && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs leading-relaxed">
                  <p className="text-slate-700">
                    <span className="font-semibold">언제 쓰나요</span> · {card.whenToUse}
                  </p>
                  <p className="mt-1 text-amber-800">
                    <span className="font-semibold">주의</span> · {card.caution}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {isAdvanced && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="mb-2 text-sm font-semibold text-slate-900">
              <TermHelp term="이웃 수 k">
                가장 가까운 몇 명에게 물어볼지 정합니다. k가 작으면 특이한 이웃 한 명에게 크게 흔들리고,
                k가 크면 주변을 넓게 보지만 세밀한 차이를 놓칩니다.
              </TermHelp>
            </p>
            <div className="flex gap-2">
              {[1, 3, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChangeK(value)}
                  aria-pressed={k === value}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    k === value
                      ? 'border-primary bg-blue-50 text-primary'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  k = {value}
                </button>
              ))}
            </div>
          </div>
        )}

        {processed.log.length > 0 && (
          <ul className="mt-4 space-y-1 rounded-lg bg-blue-50 p-3">
            {processed.log.map(line => (
              <li key={line} className="text-xs text-slate-700">
                • {line}
              </li>
            ))}
          </ul>
        )}

        {processed.blockedReason && (
          <div className="mt-3">
            <Callout tone="error" title="지금 상태로는 학습할 수 없습니다">
              {processed.blockedReason}
            </Callout>
          </div>
        )}

        <div className="mt-4">
          <Button variant="primary" onClick={onRun} disabled={Boolean(processed.blockedReason)}>
            <Play className="h-4 w-4" aria-hidden />
            이 설정으로 다시 학습시키기
          </Button>
          <p className="mt-2 text-xs text-slate-500">
            시험 데이터 {testRows.length}줄은 전처리 대상이 아닙니다. 고친 데이터로 공부시킨 뒤 같은 시험지로 채점해야
            공정한 비교가 됩니다.
          </p>
        </div>
      </Panel>

      {hasRun && current && (
        <Panel title="3단계. 고치기 전과 후 비교하기">
          {missionCleared && isAdvanced && (
            <div className="mb-4">
              <Callout tone="info" title="미션 달성">
                예산 안에서 재현율과 그룹 격차를 함께 개선했습니다. 어떤 조치가 어느 쪽에 도움이 되었는지 아래 성찰에
                적어 보세요.
              </Callout>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-600">고치기 전 (아무것도 하지 않은 상태)</h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="정확도"
                  value={toPercent(baseline.accuracy)}
                  unit="%"
                  hint={`${baseline.total}명 중 ${baseline.correct}명`}
                />
                {isAdvanced && (
                  <>
                    <StatCard label="재현율" value={toPercent(baseline.recall)} unit="%" />
                    <StatCard
                      label="그룹 간 격차"
                      value={toPercent(baseline.recallGap)}
                      unit="%p"
                      tone={baseline.recallGap > 0.15 ? 'warn' : 'neutral'}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h4 className="mb-2 text-sm font-bold text-slate-900">고친 뒤</h4>
              <MetricsView difficulty={difficulty} metrics={current} compareWith={baseline} />
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            정확도가 올랐다고 해서 문제가 모두 해결된 것은 아닙니다. 누가 더 잘 찾아지게 되었고 누가 여전히 놓치고
            있는지, 그리고 그 대가로 무엇을 잃었는지 함께 확인해야 합니다.
          </div>

          <div className="mt-4">
            <ExperimentExplain
              selected={selected}
              baseline={baseline}
              current={current}
              isAdvanced={isAdvanced}
            />
          </div>
        </Panel>
      )}
    </div>
  )
}

function ExperimentExplain({
  selected,
  baseline,
  current,
  isAdvanced,
}: {
  selected: Set<PreprocessId>
  baseline: ReturnType<typeof evaluate>
  current: ReturnType<typeof evaluate>
  isAdvanced: boolean
}) {
  const droppedProxy = selected.has('dropProxyFeature')
  const resampled = selected.has('resampleMinority')
  const accuracyDelta = toPercent(current.accuracy - baseline.accuracy)
  const gapDelta = toPercent(current.recallGap - baseline.recallGap)

  const steps: string[] = [
    '지저분한 데이터(빈칸·이상한 값·잘못된 기록)로 배우면, 비슷한 학생을 잘못 고르게 되어 정확도가 떨어지기 쉽습니다.',
  ]

  if (droppedProxy) {
    steps.push(
      gapDelta < 0
        ? `사전 활동 횟수를 빼니 그룹 격차가 ${Math.abs(gapDelta)}%p 줄었습니다. 이 값은 준비도보다 A/B 그룹을 가르는 이름표에 가깝기 때문입니다.`
        : '사전 활동 횟수를 뺐습니다. 이 값은 준비도와 직접 상관이 적고, 그룹을 가르는 이름표처럼 쓰일 수 있습니다.'
    )
  } else {
    steps.push(
      '사전 활동 횟수는 준비도보다 “어느 그룹인지”를 더 잘 알려 줄 수 있어, 그대로 두면 그룹 격차가 커질 수 있습니다.'
    )
  }

  if (resampled) {
    steps.push(
      '수가 적은 쪽을 복제해 늘리면 겉으로는 균형이 맞아 보이지만, 그 쪽 기록이 잘못되어 있으면 잘못된 답이 더 많이 복사됩니다.'
    )
  }

  if (accuracyDelta !== 0) {
    steps.push(
      `지금 정확도는 처음보다 ${accuracyDelta > 0 ? '+' : ''}${accuracyDelta}%p 변했습니다.`
    )
  }

  if (isAdvanced && gapDelta !== 0) {
    steps.push(
      `그룹 간 재현율 격차는 처음보다 ${gapDelta > 0 ? '+' : ''}${gapDelta}%p 변했습니다.`
    )
  }

  const takeaway = droppedProxy && gapDelta < 0
    ? '편견을 키우는 값을 빼면 그룹 격차가 줄어들 수 있습니다. 다만 수를 늘리는 것만으로는 틀린 기록이 고쳐지지 않습니다.'
    : resampled
      ? '데이터 수를 맞추는 것과, 기록이 올바른 것은 다른 문제입니다.'
      : '데이터를 고친 뒤에는 “전체 점수”와 “누가 놓쳤는지”를 함께 봐야 합니다.'

  return (
    <ExplainBox
      analogy="시험지가 더러우면 점수가 떨어지고, 편견이 적힌 메모를 그대로 외우면 불공평한 판단을 반복합니다."
      steps={steps}
      takeaway={takeaway}
    />
  )
}
