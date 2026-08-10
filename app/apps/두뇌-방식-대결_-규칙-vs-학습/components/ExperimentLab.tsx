'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Play, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  Callout,
  ChoiceCard,
  ExplainBox,
  Panel,
  StatCard,
  TermHelp,
  type Difficulty,
} from '../../_ai-lab-shared'
import {
  FEATURE_LABEL,
  FEATURE_META,
  LABEL_OPTIONS,
  SOIL_OPTIONS,
  createEmptyPlant,
  createEmptyRule,
} from '../data'
import {
  compareAll,
  computeMetrics,
  plantFeatureSummary,
  ruleToSentence,
  toPercent,
} from '../logic'
import type {
  CompareOp,
  ConflictPolicy,
  FeatureKey,
  Label,
  MissingPolicy,
  Plant,
  Rule,
  SoilHue,
} from '../types'

const OPS: CompareOp[] = ['>=', '<=', '>', '<', '==', '!=']

const CONFLICT_OPTIONS: Array<{ id: ConflictPolicy; title: string; description: string }> = [
  {
    id: 'firstMatch',
    title: '먼저 맞은 규칙',
    description: '위에서부터 내려오며 처음 맞는 규칙의 답을 씁니다.',
  },
  {
    id: 'highestPriority',
    title: '우선순위 최상위',
    description: '맞은 규칙 중 우선순위 숫자가 가장 작은 것을 고릅니다.',
  },
  {
    id: 'majorityVote',
    title: '다수결',
    description: '맞은 규칙들의 레이블을 모아 더 많은 쪽을 따릅니다.',
  },
]

const MISSING_OPTIONS: Array<{ id: MissingPolicy; title: string; description: string }> = [
  {
    id: 'skipRule',
    title: '그 규칙 건너뛰기',
    description: '비어 있는 특성이 쓰인 규칙만 무시하고 다음 규칙을 봅니다.',
  },
  {
    id: 'failSafeToxic',
    title: '안전 우선(독성)',
    description: '값이 비어 있으면 바로 독성으로 판단합니다.',
  },
  {
    id: 'useDefault',
    title: '기본값 사용',
    description: '맞는 규칙이 없으면 기본값(독성)으로 답합니다.',
  },
]

const HYBRID_HINTS = [
  {
    id: 'rules',
    title: '규칙이 더 나을 때',
    description: '안전 기준이 법·규정처럼 명확하고, 이유를 문장으로 남겨야 할 때',
  },
  {
    id: 'learning',
    title: '학습이 더 나을 때',
    description: '예외가 많고 사람이 규칙을 다 쓰기 어려울 때, 비슷한 사례가 충분히 있을 때',
  },
  {
    id: 'hybrid',
    title: '하이브리드가 나을 때',
    description: '위험할 수 있는 조건은 규칙으로 막고, 애매한 중간 지대만 학습으로 판단할 때',
  },
]

export default function ExperimentLab({
  difficulty,
  rules,
  onChangeRules,
  train,
  onChangeTrain,
  testCases,
  k,
  onChangeK,
  conflictPolicy,
  onChangeConflict,
  missingPolicy,
  onChangeMissing,
  hasRun,
  onRun,
  hybridChoice,
  onPickHybrid,
}: {
  difficulty: Difficulty
  rules: Rule[]
  onChangeRules: (rules: Rule[]) => void
  train: Plant[]
  onChangeTrain: (rows: Plant[]) => void
  testCases: Plant[]
  k: number
  onChangeK: (k: number) => void
  conflictPolicy: ConflictPolicy
  onChangeConflict: (policy: ConflictPolicy) => void
  missingPolicy: MissingPolicy
  onChangeMissing: (policy: MissingPolicy) => void
  hasRun: boolean
  onRun: () => void
  hybridChoice: string | null
  onPickHybrid: (id: string) => void
}) {
  const isAdvanced = difficulty === 'advanced'
  const [focusId, setFocusId] = useState(testCases[0]?.id ?? '')

  const comparisons = useMemo(
    () => compareAll(testCases, rules, train, k, conflictPolicy, missingPolicy),
    [testCases, rules, train, k, conflictPolicy, missingPolicy]
  )

  const metrics = useMemo(() => computeMetrics(comparisons), [comparisons])
  const disagreements = comparisons.filter(item => !item.agree)
  const focus = comparisons.find(item => item.plant.id === focusId) ?? comparisons[0]

  const updateRule = (id: string, patch: Partial<Rule>) => {
    onChangeRules(rules.map(rule => (rule.id === id ? { ...rule, ...patch } : rule)))
  }

  const updateTrain = (id: string, patch: Partial<Plant>) => {
    onChangeTrain(train.map(row => (row.id === id ? { ...row, ...patch } : row)))
  }

  return (
    <div className="space-y-4">
      <Panel
        title="규칙 편집기"
        description="IF 특성 비교값 THEN 레이블 형식의 규칙을 추가·수정합니다."
        actions={
          <Button
            onClick={() => onChangeRules([...rules, createEmptyRule(rules.length)])}
          >
            <Plus className="h-4 w-4" aria-hidden />
            규칙 추가
          </Button>
        }
      >
        <div className="space-y-3">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[auto_1fr_auto_1fr_auto_auto_auto] sm:items-end"
            >
              <label className="text-xs text-slate-600">
                사용
                <input
                  type="checkbox"
                  className="mt-1 block"
                  checked={rule.enabled}
                  onChange={event => updateRule(rule.id, { enabled: event.target.checked })}
                />
              </label>
              <FieldSelect
                label="특성"
                value={rule.feature}
                onChange={value => {
                  const feature = value as FeatureKey
                  const nextValue =
                    feature === 'soil'
                      ? '보라'
                      : typeof rule.value === 'number'
                        ? rule.value
                        : 5
                  updateRule(rule.id, { feature, value: nextValue })
                }}
                options={FEATURE_META.map(meta => ({ value: meta.key, label: meta.label }))}
              />
              <FieldSelect
                label="비교"
                value={rule.op}
                onChange={value => updateRule(rule.id, { op: value as CompareOp })}
                options={OPS.map(op => ({ value: op, label: op }))}
              />
              {rule.feature === 'soil' ? (
                <FieldSelect
                  label="값"
                  value={String(rule.value)}
                  onChange={value => updateRule(rule.id, { value: value as SoilHue })}
                  options={SOIL_OPTIONS.map(soil => ({ value: soil, label: soil }))}
                />
              ) : (
                <label className="text-xs text-slate-600">
                  값
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={Number(rule.value)}
                    onChange={event =>
                      updateRule(rule.id, { value: Number(event.target.value) })
                    }
                  />
                </label>
              )}
              <FieldSelect
                label="결과"
                value={rule.label}
                onChange={value => updateRule(rule.id, { label: value as Label })}
                options={LABEL_OPTIONS.map(label => ({ value: label, label }))}
              />
              {isAdvanced && (
                <label className="text-xs text-slate-600">
                  우선순위
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={rule.priority}
                    onChange={event =>
                      updateRule(rule.id, { priority: Number(event.target.value) || 1 })
                    }
                  />
                </label>
              )}
              <Button
                variant="ghost"
                className="self-end"
                onClick={() => onChangeRules(rules.filter(item => item.id !== rule.id))}
                aria-label={`${rule.id} 삭제`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
              <p className="sm:col-span-full text-xs text-slate-500">{ruleToSentence(rule)}</p>
            </div>
          ))}
          {rules.length === 0 && (
            <Callout tone="warn">규칙이 하나도 없습니다. 규칙을 추가해 보세요.</Callout>
          )}
        </div>
      </Panel>

      <Panel
        title="학습 예시 (k-NN 이웃)"
        description="학습 로봇이 참고할 예시입니다. 값을 바꾸면 이웃과 답이 달라집니다."
        actions={
          <Button onClick={() => onChangeTrain([...train, createEmptyPlant(train.length)])}>
            <Plus className="h-4 w-4" aria-hidden />
            예시 추가
          </Button>
        }
      >
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <label className="text-xs font-medium text-slate-600">
            이웃 수 k
            <input
              type="range"
              min={1}
              max={7}
              value={k}
              onChange={event => onChangeK(Number(event.target.value))}
              className="mt-1 block w-40"
            />
            <span className="ml-2 tabular-nums text-sm text-slate-800">{k}</span>
          </label>
          <p className="text-xs text-slate-500">
            <TermHelp term="k-NN">
              새 사례와 가장 가까운 k개 예시를 찾아, 그 예시들의 다수 레이블을 답으로 씁니다.
            </TermHelp>
          </p>
        </div>

        <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[40rem] border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100">
              <tr>
                <th className="px-2 py-2 text-left">이름</th>
                {FEATURE_META.map(meta => (
                  <th key={meta.key} className="px-2 py-2 text-left">
                    {meta.label}
                  </th>
                ))}
                <th className="px-2 py-2 text-left">레이블</th>
                <th className="px-2 py-2 text-left">삭제</th>
              </tr>
            </thead>
            <tbody>
              {train.map(row => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-2 py-1">
                    <input
                      className="w-24 rounded border border-slate-200 px-1 py-0.5"
                      value={row.name}
                      onChange={event => updateTrain(row.id, { name: event.target.value })}
                    />
                  </td>
                  {FEATURE_META.map(meta => (
                    <td key={meta.key} className="px-2 py-1">
                      {meta.kind === 'category' ? (
                        <select
                          className="rounded border border-slate-200 px-1 py-0.5"
                          value={row.soil ?? ''}
                          onChange={event =>
                            updateTrain(row.id, {
                              soil: (event.target.value || null) as SoilHue | null,
                            })
                          }
                        >
                          <option value="">(없음)</option>
                          {SOIL_OPTIONS.map(soil => (
                            <option key={soil} value={soil}>
                              {soil}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          className="w-16 rounded border border-slate-200 px-1 py-0.5"
                          value={row[meta.key] ?? ''}
                          onChange={event => {
                            const raw = event.target.value
                            updateTrain(row.id, {
                              [meta.key]: raw === '' ? null : Number(raw),
                            } as Partial<Plant>)
                          }}
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <select
                      className="rounded border border-slate-200 px-1 py-0.5"
                      value={row.label}
                      onChange={event =>
                        updateTrain(row.id, { label: event.target.value as Label })
                      }
                    >
                      {LABEL_OPTIONS.map(label => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <Button
                      variant="ghost"
                      onClick={() => onChangeTrain(train.filter(item => item.id !== row.id))}
                      aria-label={`${row.name} 삭제`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {isAdvanced && (
        <Panel
          title="고급 정책"
          description="규칙이 여러 개 맞거나 값이 비어 있을 때 어떻게 할지 고릅니다."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">충돌 해결</p>
              {CONFLICT_OPTIONS.map(option => (
                <ChoiceCard
                  key={option.id}
                  selected={conflictPolicy === option.id}
                  title={option.title}
                  description={option.description}
                  onClick={() => onChangeConflict(option.id)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">결측 특성 정책</p>
              {MISSING_OPTIONS.map(option => (
                <ChoiceCard
                  key={option.id}
                  selected={missingPolicy === option.id}
                  title={option.title}
                  description={option.description}
                  onClick={() => onChangeMissing(option.id)}
                />
              ))}
            </div>
          </div>
        </Panel>
      )}

      <Panel
        title="두 방식 비교 실행"
        description="시험 식물에 규칙을 적용하고, 같은 식물을 k-NN으로도 판별합니다."
        actions={
          <Button variant="primary" onClick={onRun}>
            <Play className="h-4 w-4" aria-hidden />
            비교 실행
          </Button>
        }
      >
        {!hasRun && (
          <p className="text-sm text-slate-600">규칙을 다듬었으면 비교 실행을 눌러 결과를 확인하세요.</p>
        )}

        {hasRun && (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="일치율"
                value={toPercent(metrics.agreementRate)}
                unit="%"
                hint={`의견이 같은 사례 ${metrics.total - metrics.disagreeCount}/${metrics.total}`}
                tone={metrics.agreementRate >= 0.7 ? 'good' : 'warn'}
              />
              <StatCard
                label="의견 갈림"
                value={metrics.disagreeCount}
                unit="개"
                tone={metrics.disagreeCount > 0 ? 'warn' : 'good'}
              />
              <StatCard
                label="규칙 정확도"
                value={toPercent(metrics.ruleAccuracy)}
                unit="%"
                hint={`정답 ${metrics.ruleCorrect}개`}
              />
              <StatCard
                label="학습 정확도"
                value={toPercent(metrics.knnAccuracy)}
                unit="%"
                hint={`정답 ${metrics.knnCorrect}개 · k=${k}`}
              />
            </div>

            <Callout tone={metrics.disagreeCount > 0 ? 'warn' : 'info'}>
              {metrics.disagreeCount > 0
                ? `두 방식이 ${metrics.disagreeCount}개 사례에서 다른 답을 냈습니다. 아래에서 규칙 경로와 이웃을 비교해 보세요.`
                : '이번 설정에서는 두 방식이 모든 시험 사례에서 같은 답을 냈습니다. 규칙을 바꾸거나 학습 예시를 줄여 갈등을 만들어 보세요.'}
            </Callout>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {comparisons.map(item => (
                <button
                  key={item.plant.id}
                  type="button"
                  onClick={() => setFocusId(item.plant.id)}
                  className={`rounded-lg border p-3 text-left text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    focus?.plant.id === item.plant.id
                      ? 'border-primary bg-blue-50 ring-1 ring-primary'
                      : item.agree
                        ? 'border-slate-200 bg-white'
                        : 'border-amber-300 bg-amber-50'
                  }`}
                >
                  <span className="font-bold text-slate-900">{item.plant.name}</span>
                  <span className="mt-1 block text-xs text-slate-600">
                    규칙 {item.rule.label ?? '모름'} · 학습 {item.knn.label ?? '모름'}
                    {item.agree ? ' · 같음' : ' · 다름'}
                  </span>
                </button>
              ))}
            </div>

            {focus && (
              <div className="grid gap-3 md:grid-cols-2">
                <DetailCard
                  title="규칙 경로"
                  subtitle={`${focus.plant.name} · ${plantFeatureSummary(focus.plant)}`}
                >
                  <p className="text-lg font-bold text-slate-900">
                    답: {focus.rule.label ?? '모름'}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{focus.rule.explanation}</p>
                  {focus.rule.conflictNote && (
                    <p className="mt-1 text-xs font-medium text-amber-800">
                      {focus.rule.conflictNote}
                    </p>
                  )}
                  <ol className="mt-2 space-y-1 text-xs text-slate-600">
                    {focus.rule.path.map(step => (
                      <li key={`${step.ruleId}-${step.description}`}>
                        <span className={step.matched ? 'font-semibold text-emerald-700' : ''}>
                          {step.description}
                        </span>
                      </li>
                    ))}
                  </ol>
                </DetailCard>
                <DetailCard title="사용한 이웃" subtitle={`k=${k}`}>
                  <p className="text-lg font-bold text-slate-900">
                    답: {focus.knn.label ?? '모름'}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{focus.knn.explanation}</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {focus.knn.neighbors.map(item => (
                      <li key={item.plant.id}>
                        {item.plant.name} ({FEATURE_LABEL.label}: {item.plant.label}) · 거리{' '}
                        {item.distance.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </DetailCard>
              </div>
            )}

            {disagreements.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-bold text-slate-900">의견이 갈린 사례 모음</h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {disagreements.map(item => (
                    <li
                      key={item.plant.id}
                      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"
                    >
                      <strong>{item.plant.name}</strong>: 규칙={item.rule.label ?? '모름'}, 학습=
                      {item.knn.label ?? '모름'} (기록상 정답 {item.plant.label})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ExperimentExplain
              focus={focus}
              metrics={metrics}
              k={k}
              isAdvanced={isAdvanced}
              conflictPolicy={conflictPolicy}
              missingPolicy={missingPolicy}
            />
          </div>
        )}
      </Panel>

      {isAdvanced && hasRun && (
        <Panel
          title="언제 규칙을, 언제 학습을, 언제 섞을까?"
          description="관찰한 일치율·갈림·설명 경로를 근거로 전략을 골라 보세요."
        >
          <div className="grid gap-2 sm:grid-cols-3">
            {HYBRID_HINTS.map(option => (
              <ChoiceCard
                key={option.id}
                selected={hybridChoice === option.id}
                title={option.title}
                description={option.description}
                onClick={() => onPickHybrid(option.id)}
              />
            ))}
          </div>
          {hybridChoice && (
            <Callout tone="info" title="제안 정리">
              {hybridChoice === 'rules' &&
                '명확한 금지 조건(예: 가시 ≥ 5)은 규칙으로 고정하면 설명과 승인에 유리합니다.'}
              {hybridChoice === 'learning' &&
                '애매한 중간 사례가 많다면, 충분한 예시로 k-NN을 쓰는 편이 규칙을 계속 고치는 부담을 줄입니다.'}
              {hybridChoice === 'hybrid' &&
                '위험 조건은 규칙으로 먼저 걸러 내고, 남은 사례만 학습으로 분류하는 하이브리드가 실무에서 자주 쓰입니다.'}
            </Callout>
          )}
        </Panel>
      )}
    </div>
  )
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="text-xs text-slate-600">
      {label}
      <select
        className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        value={value}
        onChange={event => onChange(event.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function DetailCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      <div className="mt-2">{children}</div>
    </div>
  )
}

function ExperimentExplain({
  focus,
  metrics,
  k,
  isAdvanced,
  conflictPolicy,
  missingPolicy,
}: {
  focus: ReturnType<typeof compareAll>[number] | undefined
  metrics: ReturnType<typeof computeMetrics>
  k: number
  isAdvanced: boolean
  conflictPolicy: ConflictPolicy
  missingPolicy: MissingPolicy
}) {
  if (!focus) return null

  const steps: string[] = [
    `규칙 경로: “IF … THEN …”을 순서대로 확인하다 ${focus.plant.name}에 대해 ‘${focus.rule.label ?? '모름'}’을 냈습니다.`,
    `학습(k-NN): 비슷한 이웃 ${k}명에게 물어 다수결로 ‘${focus.knn.label ?? '모름'}’을 냈습니다.`,
  ]

  if (focus.agree) {
    steps.push(
      `지금 고른 식물에서는 답이 같았습니다. 전체 일치율은 ${toPercent(metrics.agreementRate)}%입니다.`
    )
  } else {
    steps.push(
      `지금 고른 식물에서는 규칙 ‘${focus.rule.label ?? '모름'}’과 학습 ‘${focus.knn.label ?? '모름'}’이 갈렸습니다.`
    )
    steps.push(
      '규칙이 예외를 못 잡았거나, 이웃 쪽에 다른 기록이 많을 때 이런 갈등이 납니다.'
    )
  }

  if (isAdvanced) {
    const conflictLabel =
      conflictPolicy === 'firstMatch'
        ? '먼저 맞은 규칙'
        : conflictPolicy === 'highestPriority'
          ? '우선순위 최상위'
          : '다수결'
    const missingLabel =
      missingPolicy === 'skipRule'
        ? '그 규칙 건너뛰기'
        : missingPolicy === 'failSafeToxic'
          ? '안전 우선(독성)'
          : '기본값 사용'
    steps.push(
      `고급 설정: 규칙이 여러 개 맞으면 ‘${conflictLabel}’, 값이 비면 ‘${missingLabel}’을 씁니다.`
    )
  }

  if (metrics.disagreeCount > 0) {
    steps.push(
      `전체 ${metrics.total}개 중 ${metrics.disagreeCount}개에서 의견이 갈렸고, 규칙 정확도 ${toPercent(metrics.ruleAccuracy)}% · 학습 정확도 ${toPercent(metrics.knnAccuracy)}%입니다.`
    )
  }

  return (
    <ExplainBox
      analogy="규칙집은 ‘이런 조건이면 이렇게’라고 말하고, 학습은 ‘비슷한 이웃에게 물어본다’고 말합니다."
      steps={steps}
      takeaway={
        metrics.disagreeCount > 0
          ? '갈린 사례를 보면, 규칙의 막을 위험과 학습이 따라갈 예외를 나누어 생각할 수 있습니다.'
          : '지금은 모두 같았습니다. 규칙을 바꾸거나 이웃·k를 바꾸면 갈등이 나타날 수 있습니다.'
      }
    />
  )
}
