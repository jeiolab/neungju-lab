'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Bot, HelpCircle, Play } from 'lucide-react'
import { Button, Callout, ChoiceCard, ExplainBox, Panel, StatCard, TermHelp } from '../../_ai-lab-shared'
import { DEFAULT_RULES, FEATURE_LABEL } from '../data'
import { compareCase, plantFeatureSummary, ruleToSentence } from '../logic'
import type { Plant, Rule } from '../types'

export default function BeginnerLab({
  cases,
  train,
  askedIds,
  onAsk,
  easierSide,
  onPickEasier,
}: {
  cases: Plant[]
  train: Plant[]
  askedIds: string[]
  onAsk: (id: string) => void
  easierSide: 'rule' | 'knn' | null
  onPickEasier: (side: 'rule' | 'knn') => void
}) {
  const [focusId, setFocusId] = useState(cases[0]?.id ?? '')
  const focus = cases.find(item => item.id === focusId) ?? cases[0]

  const comparisons = useMemo(() => {
    return cases
      .filter(item => askedIds.includes(item.id))
      .map(item => compareCase(item, DEFAULT_RULES, train, 3))
  }, [cases, train, askedIds])

  const focusResult = useMemo(() => {
    if (!focus || !askedIds.includes(focus.id)) return null
    return compareCase(focus, DEFAULT_RULES, train, 3)
  }, [focus, train, askedIds])

  const allAsked = askedIds.length >= cases.length
  const agreeCount = comparisons.filter(item => item.agree).length

  return (
    <div className="space-y-4">
      <Panel
        title="1단계. 규칙 로봇이 미리 알고 있는 IF-THEN"
        description="사람이 적어 둔 규칙을 순서대로 확인합니다. 조건이 맞으면 바로 답을 냅니다."
      >
        <p className="mb-3 text-sm text-slate-600">
          <TermHelp term="규칙 기반">
            사람이 “이런 조건이면 이렇게 하라”고 미리 적어 둔 방식으로 판단합니다. 왜 그렇게
            판단했는지 문장으로 보여 주기 쉽습니다.
          </TermHelp>
          과{' '}
          <TermHelp term="학습 기반(k-NN)">
            비슷한 예시를 여러 개 모아 두고, 새 식물이 오면 가장 가까운 이웃들의 답을 다수결로
            따르는 방식입니다. 규칙을 직접 쓰지 않아도 됩니다.
          </TermHelp>
          을 같은 사례에 물어봅니다.
        </p>
        <ol className="space-y-2">
          {DEFAULT_RULES.map((rule: Rule, index) => (
            <li
              key={rule.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{ruleToSentence(rule)}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {FEATURE_LABEL[rule.feature]} 값을 보고 '{rule.label}'인지 확인합니다.
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-slate-500">
          학습 로봇은 아래 규칙 대신, 식물원 기록 {train.length}개를 이웃으로 씁니다.
        </p>
      </Panel>

      <Panel
        title="2단계. 같은 식물을 두 로봇에게 물어보기"
        description="식물을 고른 뒤 ‘물어보기’를 누르면 규칙 로봇과 학습 로봇의 답이 나란히 나옵니다."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {cases.map(item => {
            const asked = askedIds.includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFocusId(item.id)}
                className={`rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  focusId === item.id
                    ? 'border-primary bg-blue-50 ring-1 ring-primary'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">{item.name}</span>
                  {asked ? (
                    <span className="text-xs font-semibold text-primary">물어봄</span>
                  ) : (
                    <span className="text-xs text-slate-400">아직</span>
                  )}
                </span>
                <span className="mt-1 block text-xs text-slate-600">{plantFeatureSummary(item)}</span>
              </button>
            )
          })}
        </div>

        {focus && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={() => onAsk(focus.id)}>
              <Play className="h-4 w-4" aria-hidden />
              {askedIds.includes(focus.id) ? '다시 물어보기' : `${focus.name}에게 물어보기`}
            </Button>
            <p className="text-xs text-slate-500">
              {askedIds.length}/{cases.length}개 물어봄
            </p>
          </div>
        )}

        {focusResult && (
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <RobotCard
                title="규칙 로봇"
                icon={<HelpCircle className="h-4 w-4" aria-hidden />}
                label={focusResult.rule.label}
                explanation={focusResult.rule.explanation}
                detail={
                  <ol className="mt-2 space-y-1 text-xs text-slate-600">
                    {focusResult.rule.path.map(step => (
                      <li key={`${step.ruleId}-${step.description}`}>
                        <span className={step.matched ? 'font-semibold text-emerald-700' : ''}>
                          {step.description}
                        </span>
                      </li>
                    ))}
                  </ol>
                }
              />
              <RobotCard
                title="학습 로봇 (k-NN)"
                icon={<Bot className="h-4 w-4" aria-hidden />}
                label={focusResult.knn.label}
                explanation={focusResult.knn.explanation}
                detail={
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {focusResult.knn.neighbors.map(item => (
                      <li key={item.plant.id}>
                        {item.plant.name} → {item.plant.label} (거리 {item.distance.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>
            <ExplainBox
              analogy="규칙 로봇은 ‘시험 규칙집’을 읽고, 학습 로봇은 ‘비슷한 친구 몇 명에게 물어보는’ 방식입니다."
              steps={[
                `규칙 로봇: “이런 조건이면 ${focusResult.rule.label ?? '모름'}”처럼 IF-THEN을 순서대로 확인합니다.`,
                `학습 로봇: 가장 비슷한 이웃 ${focusResult.knn.neighbors.length}명의 답을 모아 다수결로 정합니다.`,
                focusResult.agree
                  ? `이번 ${focus.name}에서는 둘 다 ‘${focusResult.rule.label ?? '모름'}’이라고 해서 의견이 같았습니다.`
                  : `이번 ${focus.name}에서는 규칙 ‘${focusResult.rule.label ?? '모름'}’, 학습 ‘${focusResult.knn.label ?? '모름'}’으로 의견이 갈렸습니다.`,
              ]}
              takeaway={
                focusResult.agree
                  ? '같은 답이어도 이유는 다릅니다. 규칙 문장과 이웃 목록을 비교해 보세요.'
                  : '규칙이 놓친 예외를 이웃이 잡거나, 이웃이 틀린 기록을 따라갈 때 의견이 갈립니다.'
              }
            />
          </div>
        )}
      </Panel>

      {allAsked && (
        <Panel title="3단계. 답을 나란히 비교하기">
          <div className="mb-3 grid gap-2 sm:grid-cols-3">
            <StatCard label="물어본 사례" value={comparisons.length} unit="개" />
            <StatCard
              label="두 로봇이 같은 답"
              value={agreeCount}
              unit="개"
              tone={agreeCount === comparisons.length ? 'good' : 'warn'}
            />
            <StatCard
              label="의견이 갈린 사례"
              value={comparisons.length - agreeCount}
              unit="개"
              tone={comparisons.length - agreeCount > 0 ? 'warn' : 'good'}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <caption className="mb-2 text-left text-xs text-slate-600">
                같은 식물에 대한 두 로봇의 답입니다. 정답 칸은 숨겨 두었으니, 먼저 설명력을 비교해 보세요.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                    식물
                  </th>
                  <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                    규칙 로봇
                  </th>
                  <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                    학습 로봇
                  </th>
                  <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                    일치
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map(item => (
                  <tr key={item.plant.id}>
                    <th scope="row" className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-800">
                      {item.plant.name}
                    </th>
                    <td className="border-b border-slate-100 px-3 py-2">{item.rule.label ?? '모름'}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{item.knn.label ?? '모름'}</td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {item.agree ? '같음' : '다름'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-5">
            <ExplainBox
              analogy="같은 숙제를 규칙집만 보고 푼 친구와, 비슷한 예시 답안을 보고 푼 친구가 있을 수 있습니다."
              steps={[
                `물어본 ${comparisons.length}개 중 ${agreeCount}개는 같은 답, ${comparisons.length - agreeCount}개는 다른 답이었습니다.`,
                '규칙 로봇은 “이 조건이 맞아서”라고 문장으로 말하기 쉽습니다.',
                '학습 로봇은 “비슷한 식물이 이렇게 생겨서”라고 이웃을 보여 주며 말합니다.',
                comparisons.length - agreeCount > 0
                  ? '의견이 갈린 식물은, 규칙이 예외를 못 잡았거나 이웃 기록이 규칙과 달랐기 때문입니다.'
                  : '이번엔 모두 같았습니다. 규칙을 바꾸거나 이웃을 줄이면 갈등이 생길 수 있습니다.',
              ]}
              takeaway="중요한 건 ‘누가 맞았나’만이 아니라, 친구에게 이유를 어떻게 설명할 수 있는가입니다."
            />
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              어느 로봇의 이유를 친구에게 설명하기 더 쉬웠나요?
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <ChoiceCard
                selected={easierSide === 'rule'}
                title="규칙 로봇"
                description="IF-THEN 문장으로 길을 따라가며 설명할 수 있어요."
                onClick={() => onPickEasier('rule')}
              />
              <ChoiceCard
                selected={easierSide === 'knn'}
                title="학습 로봇"
                description="비슷한 이웃 예시를 보여 주며 설명할 수 있어요."
                onClick={() => onPickEasier('knn')}
              />
            </div>
            {easierSide && (
              <Callout tone="info">
                {easierSide === 'rule'
                  ? '규칙 로봇은 “어떤 조건이 맞아서”라고 문장으로 말하기 쉽습니다. 다만 예외가 많으면 규칙을 계속 고쳐야 합니다.'
                  : '학습 로봇은 “비슷한 예시들이 이렇게 생겼어요”라고 말하기 쉽습니다. 다만 이웃이 바뀌면 이유도 함께 바뀝니다.'}
              </Callout>
            )}
          </div>
        </Panel>
      )}
    </div>
  )
}

function RobotCard({
  title,
  icon,
  label,
  explanation,
  detail,
}: {
  title: string
  icon: ReactNode
  label: string | null
  explanation: string
  detail: ReactNode
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{label ?? '모름'}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{explanation}</p>
      {detail}
    </div>
  )
}
