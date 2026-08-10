'use client'

import { useCallback, useMemo, useState } from 'react'
import { Eye, Scale, Shield, Users } from 'lucide-react'
import {
  Button,
  Callout,
  ChoiceCard,
  ExplainBox,
  ModuleFrame,
  Panel,
  ReflectionPanel,
  ResultActions,
  TermHelp,
  buildResult,
  downloadCsv,
  downloadJson,
  printReport,
  resultToCsvRows,
  CITIZEN_JURY_STAGE_GUIDES,
  CITIZEN_JURY_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import { CASES, DATA_SEED, DATA_VERSION, MODULE_ID, MODULE_NAME } from './data'
import {
  CHECKLIST_ITEMS,
  JUDGMENT_HINT,
  JUDGMENT_LABEL,
  PRINCIPLE_HELP,
  PRINCIPLE_LABEL,
  ROLE_LABEL,
  SIDE_LABEL,
  type ChecklistId,
  type Judgment,
  type PrincipleId,
  type ResponsibilityRole,
} from './types'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary: '가상의 학교 사례를 읽고 누가 이익을 얻고 누가 걱정하게 되는지 찾아봅니다.',
    points: ['이해관계자 카드 살펴보기', '찬성·반대·조건부 중 고르기', '고른 이유를 한 문장으로 쓰기'],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary: '먼저 판단한 뒤 추가 증거를 하나씩 열어 보고, 생각이 바뀌었는지 확인합니다.',
    points: ['1차 판단과 최종 판단 비교', '증거의 신뢰도와 빠진 정보 확인', '조건부 도입이라면 보호 조치 고르기'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary: '원칙이 서로 충돌하는 상황을 다루고, 책임을 어떻게 나눌지 근거를 갖춰 의견서를 씁니다.',
    points: ['공정성·투명성·안전 원칙의 충돌 다루기', '개발자·학교·감독기관의 책임 배분', '남은 불확실성까지 담은 배심원 의견서'],
    minutes: 50,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'who',
      prompt: '이 도입에서 가장 크게 영향을 받을 사람은 누구라고 생각했나요?',
      choices: ['학생', '교사·학교', '보호자·지역사회'],
    },
    {
      id: 'learned',
      prompt: '찬성·반대·조건부를 고른 이유를 한 문장으로 정리해 보세요.',
      sentences: 1,
      placeholder: '예) 편리하지만 얼굴 데이터가 오래 남아서 ...',
    },
  ],
  intermediate: [
    {
      id: 'change',
      prompt: '증거를 본 뒤 판단이 바뀌었나요? 바뀌었다면 어떤 증거가 가장 컸나요?',
      sentences: 2,
    },
    {
      id: 'missing',
      prompt: '더 알고 싶었지만 없었던 정보는 무엇인가요?',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'priority',
      prompt: '원칙이 충돌할 때 무엇을 더 우선했고, 그 이유는 무엇인가요?',
      sentences: 3,
    },
    {
      id: 'duty',
      prompt: '사고나 피해가 났을 때 누가 먼저 책임져야 한다고 보았나요? 근거를 함께 써 보세요.',
      sentences: 3,
    },
    {
      id: 'uncertain',
      prompt: '의견서에 남긴 불확실성 중, 실제로 더 조사해야 할 것을 적어 보세요.',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

const JUDGMENTS: Judgment[] = ['찬성', '반대', '조건부']
const TRUST_LEVELS = ['높음', '보통', '낮음'] as const
type TrustLevel = (typeof TRUST_LEVELS)[number]

type DeliberationState = {
  caseId: string
  /** 열어 본 이해관계자 */
  openedStakeholders: string[]
  initialJudgment: Judgment | null
  finalJudgment: Judgment | null
  reason: string
  revealedEvidence: string[]
  evidenceTrust: Record<string, TrustLevel>
  selectedMeasures: string[]
  missingNote: string
  principlePriority: PrincipleId | null
  conflictNotes: Record<string, string>
  responsibilityMap: Partial<Record<ResponsibilityRole, string>>
  juryOpinion: string
  uncertainty: string
  checklist: ChecklistId[]
  reflection: Record<string, string>
}

function createInitialState(caseId: string = CASES[0].id): DeliberationState {
  return {
    caseId,
    openedStakeholders: [],
    initialJudgment: null,
    finalJudgment: null,
    reason: '',
    revealedEvidence: [],
    evidenceTrust: {},
    selectedMeasures: [],
    missingNote: '',
    principlePriority: null,
    conflictNotes: {},
    responsibilityMap: {},
    juryOpinion: '',
    uncertainty: '',
    checklist: [],
    reflection: {},
  }
}

function JudgmentPicker({
  value,
  onChange,
  label,
}: {
  value: Judgment | null
  onChange: (next: Judgment) => void
  label: string
}) {
  return (
    <div className="space-y-2" role="group" aria-label={label}>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {JUDGMENTS.map(j => (
          <ChoiceCard
            key={j}
            selected={value === j}
            title={JUDGMENT_LABEL[j]}
            description={JUDGMENT_HINT[j]}
            onClick={() => onChange(j)}
          />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [state, setState] = useState<DeliberationState>(() => createInitialState())

  const currentCase = useMemo(
    () => CASES.find(c => c.id === state.caseId) ?? CASES[0],
    [state.caseId]
  )

  const handleReset = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setState(createInitialState())
  }, [])

  const patch = useCallback((partial: Partial<DeliberationState>) => {
    setState(prev => ({ ...prev, ...partial }))
  }, [])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setState(prev => ({
      ...prev,
      reflection: { ...prev.reflection, [id]: value },
    }))
  }, [])

  const toggleStakeholder = useCallback((id: string) => {
    setState(prev => {
      const opened = prev.openedStakeholders.includes(id)
        ? prev.openedStakeholders
        : [...prev.openedStakeholders, id]
      return { ...prev, openedStakeholders: opened }
    })
  }, [])

  const revealNextEvidence = useCallback(() => {
    setState(prev => {
      const caseData = CASES.find(c => c.id === prev.caseId) ?? CASES[0]
      const next = caseData.evidence.find(e => !prev.revealedEvidence.includes(e.id))
      if (!next) return prev
      return { ...prev, revealedEvidence: [...prev.revealedEvidence, next.id] }
    })
  }, [])

  const toggleMeasure = useCallback((id: string) => {
    setState(prev => {
      const has = prev.selectedMeasures.includes(id)
      return {
        ...prev,
        selectedMeasures: has
          ? prev.selectedMeasures.filter(m => m !== id)
          : [...prev.selectedMeasures, id],
      }
    })
  }, [])

  const toggleChecklist = useCallback((id: ChecklistId) => {
    setState(prev => {
      const has = prev.checklist.includes(id)
      return {
        ...prev,
        checklist: has ? prev.checklist.filter(c => c !== id) : [...prev.checklist, id],
      }
    })
  }, [])

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(state.reflection).some(v => v.trim().length > 0)
      if (answered) return 'reflect'

      if (current === 'beginner') {
        if (!state.finalJudgment) {
          return state.openedStakeholders.length === 0 ? 'intro' : 'explore'
        }
        return 'result'
      }

      if (current === 'intermediate') {
        if (!state.initialJudgment) return 'intro'
        if (state.revealedEvidence.length < currentCase.evidence.length) return 'explore'
        if (!state.finalJudgment) return 'challenge'
        return 'result'
      }

      // advanced
      if (!state.initialJudgment) return 'intro'
      if (state.revealedEvidence.length === 0) return 'explore'
      if (!state.juryOpinion.trim()) return 'challenge'
      return 'result'
    },
    [state, currentCase.evidence.length]
  )

  const judgmentForExport = state.finalJudgment ?? state.initialJudgment

  const buildExport = useCallback(
    (current: Difficulty) => {
      const trustEntries = Object.entries(state.evidenceTrust).map(
        ([id, level]) => `${id}:${level}`
      )
      return buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          사례: currentCase.title,
          사례ID: currentCase.id,
          데이터seed: DATA_SEED,
          열어본이해관계자: state.openedStakeholders,
          열어본증거: state.revealedEvidence,
          선택한보호조치: state.selectedMeasures,
          원칙우선순위: state.principlePriority
            ? PRINCIPLE_LABEL[state.principlePriority]
            : '',
          책임배분: state.responsibilityMap,
        },
        observations: {
          일차판단: state.initialJudgment ?? '',
          최종판단: state.finalJudgment ?? '',
          판단변경여부:
            state.initialJudgment && state.finalJudgment
              ? state.initialJudgment === state.finalJudgment
                ? '유지'
                : '변경'
              : '',
          이유한문장: state.reason,
          증거신뢰도: trustEntries,
          빠진정보메모: state.missingNote,
          원칙충돌메모: state.conflictNotes,
          배심원의견: state.juryOpinion,
          남은불확실성: state.uncertainty,
        },
        metrics: {
          열어본이해관계자수: state.openedStakeholders.length,
          열어본증거수: state.revealedEvidence.length,
          선택한보호조치수: state.selectedMeasures.length,
          체크리스트완료수: state.checklist.length,
          체크리스트전체: CHECKLIST_ITEMS.length,
          // 점수가 아니라 완료 개수입니다.
          점수아님안내: '이 숫자는 등급이 아니라 스스로 확인한 항목 수입니다',
        },
        reflection: state.reflection,
      })
    },
    [state, currentCase]
  )

  const canExport = Boolean(judgmentForExport) || state.juryOpinion.trim().length > 0

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="이 인공지능을 도입해도 될까, 도입한다면 어떤 조건이 필요할까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={CITIZEN_JURY_STAGE_GUIDES}
      learningSupport={CITIZEN_JURY_LEARNING}
      notice="사람을 재판하는 활동이 아니라, 가상의 인공지능 시스템 도입 조건을 검토하는 숙의입니다. 모든 사례·증거·수치는 교육용으로 만든 것이며 점수를 매기지 않습니다."
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div className="space-y-4">
          <Panel
            title="안건 고르기"
            description="아래에서 검토할 가상 도입 사례를 고르세요. 사례를 바꾸면 이 안건의 기록은 초기화됩니다."
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {CASES.map(c => (
                <ChoiceCard
                  key={c.id}
                  selected={state.caseId === c.id}
                  title={c.title}
                  description={c.headline}
                  onClick={() => {
                    if (c.id !== state.caseId) setState(createInitialState(c.id))
                  }}
                />
              ))}
            </div>
          </Panel>

          <Panel
            title={currentCase.title}
            description={`${currentCase.setting} · ${currentCase.aiSystem}`}
          >
            <Callout tone="info" title="도입 제안 (가상)">
              {currentCase.proposal}
            </Callout>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{currentCase.headline}</p>
          </Panel>

          {/* —— 이해관계자 —— */}
          <Panel
            title="이해관계자 카드"
            description="카드를 열어 누가 이익을 얻고 누가 걱정하는지 확인하세요. 한쪽에만 유리한지 함께 봅니다."
            actions={
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <Users className="h-3.5 w-3.5" aria-hidden />
                {state.openedStakeholders.length}/{currentCase.stakeholders.length}명 열람
              </span>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {currentCase.stakeholders.map(s => {
                const open = state.openedStakeholders.includes(s.id)
                return (
                  <div
                    key={s.id}
                    className={`rounded-lg border p-3 ${
                      open ? 'border-primary bg-blue-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500">
                          {s.role} · {SIDE_LABEL[s.side]}
                        </p>
                      </div>
                      <Button
                        variant={open ? 'secondary' : 'primary'}
                        onClick={() => toggleStakeholder(s.id)}
                      >
                        <Eye className="h-4 w-4" aria-hidden />
                        {open ? '다시 보기' : '카드 열기'}
                      </Button>
                    </div>
                    {open && (
                      <dl className="mt-3 space-y-2 text-sm">
                        <div>
                          <dt className="font-semibold text-emerald-800">이익</dt>
                          <dd className="text-slate-700">{s.benefits}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-amber-800">걱정</dt>
                          <dd className="text-slate-700">{s.worries}</dd>
                        </div>
                      </dl>
                    )}
                  </div>
                )
              })}
            </div>
          </Panel>

          {/* —— 초급: 바로 최종 판단 —— */}
          {current === 'beginner' && (
            <>
              <ExplainBox
                title="지금 배울 것"
                analogy="학급 규칙을 정할 때, ‘편리한 사람’과 ‘불편한 사람’이 동시에 있을 수 있습니다."
                steps={[
                  '이해관계자 카드로 누가 이익을 얻고 누가 걱정하는지 먼저 봅니다.',
                  '찬성·반대·조건부 중 하나를 고르고, 이유를 한 문장으로 남깁니다.',
                  '정답 점수는 없습니다. 한쪽만 보지 않았는지가 중요합니다.',
                ]}
                takeaway="인공지능 도입은 ‘기술만’의 문제가 아니라, 사람마다 다른 영향까지 함께 보는 일입니다."
              />

              <Panel title="배심원 판단" description="정답이 없습니다. 이해관계자를 본 뒤 지금 생각을 고르세요.">
                <JudgmentPicker
                  label="이 인공지능 도입에 대해"
                  value={state.finalJudgment}
                  onChange={j => patch({ finalJudgment: j, initialJudgment: j })}
                />
                <div className="mt-4 space-y-2">
                  <label htmlFor="reason-beginner" className="text-sm font-semibold text-slate-900">
                    이유를 한 문장으로
                  </label>
                  <textarea
                    id="reason-beginner"
                    value={state.reason}
                    onChange={e => patch({ reason: e.target.value })}
                    rows={2}
                    placeholder="예) 안전에는 도움이 되지만, 거부할 다른 출입 수단이 없어서 ..."
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {state.finalJudgment === '조건부' && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-900">붙이고 싶은 보호 조치 (선택)</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {currentCase.measures.slice(0, 3).map(m => (
                        <ChoiceCard
                          key={m.id}
                          selected={state.selectedMeasures.includes(m.id)}
                          title={m.title}
                          description={m.description}
                          onClick={() => toggleMeasure(m.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Panel>

              {state.finalJudgment && (
                <ExplainBox
                  analogy="반장 선거처럼, 한 사람의 편리함만 보면 다른 친구의 걱정이 가려질 수 있습니다."
                  steps={[
                    `이해관계자 ${state.openedStakeholders.length}/${currentCase.stakeholders.length}명의 카드를 열어 보았습니다.`,
                    `지금은 「${JUDGMENT_LABEL[state.finalJudgment]}」을 골랐습니다.${
                      state.finalJudgment === '조건부' && state.selectedMeasures.length > 0
                        ? ` 보호 조치 ${state.selectedMeasures.length}개도 붙였습니다.`
                        : ''
                    }`,
                    state.openedStakeholders.length < currentCase.stakeholders.length
                      ? '아직 안 연 카드가 있다면, 반대쪽 걱정도 한 번 더 확인해 보세요.'
                      : '이익과 걱정을 양쪽 다 본 뒤 판단한 점이 중요합니다.',
                  ]}
                  takeaway="좋은 판단은 ‘누가 이득인지’만이 아니라 ‘누가 부담을 지는지’까지 함께 본 판단입니다."
                />
              )}
            </>
          )}

          {/* —— 중·고급: 1차 판단 —— */}
          {current === 'intermediate' && (
            <ExplainBox
              title="지금 배울 것"
              analogy="친구가 먼저 말한 뒤 증거가 나오면, 처음 생각과 나중 생각이 달라질 수 있습니다."
              steps={[
                '증거를 보기 전에 1차 판단을 먼저 고릅니다.',
                '증거 카드를 한 장씩 열고, 출처와 한계·신뢰도를 스스로 표시합니다.',
                '최종 판단이 바뀌었는지 비교하고, 조건부라면 보호 조치를 고릅니다.',
              ]}
              takeaway="증거는 ‘정답 버튼’이 아니라, 생각을 다시 점검하게 만드는 재료입니다."
            />
          )}

          {current === 'advanced' && (
            <ExplainBox
              title="지금 배울 것"
              analogy="친구끼리 ‘공평해야 해’와 ‘빨리 안전을 지켜야 해’가 동시에 부딪힐 때, 둘 다 100점은 어렵습니다."
              steps={[
                '공정성·투명성·안전이 서로 충돌하는 지점을 읽고, 우선할 원칙을 고릅니다.',
                '개발자·학교·감독기관의 책임을 나누고, 의견서에 근거와 불확실성을 적습니다.',
                '체크리스트는 점수가 아니라 ‘꼼꼼히 생각했는지’를 스스로 확인하는 목록입니다.',
              ]}
              takeaway="어려운 선택은 ‘완벽한 정답’보다, 충돌을 인정하고 조건을 적는 데서 출발합니다."
            />
          )}

          {current !== 'beginner' && (
            <Panel
              title="1차 판단"
              description="증거를 보기 전에 먼저 고릅니다. 나중에 최종 판단과 비교합니다."
            >
              <JudgmentPicker
                label="지금 생각 (증거 공개 전)"
                value={state.initialJudgment}
                onChange={j => patch({ initialJudgment: j })}
              />
              {!state.initialJudgment && (
                <p className="mt-3 text-xs font-medium text-amber-700">
                  1차 판단을 고른 뒤에 증거 카드를 열 수 있습니다.
                </p>
              )}
            </Panel>
          )}

          {/* —— 중·고급: 증거 순차 공개 —— */}
          {current !== 'beginner' && (
            <Panel
              title="증거 카드"
              description="카드를 한 장씩 열어 보세요. 출처와 한계를 함께 읽고, 신뢰도를 스스로 표시합니다."
              actions={
                <Button
                  variant="primary"
                  onClick={revealNextEvidence}
                  disabled={
                    !state.initialJudgment ||
                    state.revealedEvidence.length >= currentCase.evidence.length
                  }
                >
                  <Eye className="h-4 w-4" aria-hidden />
                  {state.revealedEvidence.length >= currentCase.evidence.length
                    ? '모두 열림'
                    : `다음 증거 열기 (${state.revealedEvidence.length}/${currentCase.evidence.length})`}
                </Button>
              }
            >
              {state.revealedEvidence.length === 0 ? (
                <Callout tone="info" title="아직 열린 증거가 없습니다">
                  1차 판단을 고른 뒤 「다음 증거 열기」를 누르세요. 한꺼번에 보지 않고 순서대로 읽습니다.
                </Callout>
              ) : (
                <ol className="space-y-3">
                  {currentCase.evidence
                    .filter(e => state.revealedEvidence.includes(e.id))
                    .map((e, index) => (
                      <li key={e.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                        <p className="text-sm font-bold text-slate-900">
                          <span className="mr-2 tabular-nums text-primary">{index + 1}.</span>
                          {e.title}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{e.summary}</p>
                        <p className="mt-2 text-xs text-slate-500">출처 성격: {e.sourceNote}</p>
                        <p className="mt-1 text-xs text-amber-800">한계 힌트: {e.trustHint}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium text-slate-600">이 증거의 신뢰도</span>
                          {TRUST_LEVELS.map(level => {
                            const selected = state.evidenceTrust[e.id] === level
                            return (
                              <button
                                key={level}
                                type="button"
                                aria-pressed={selected}
                                onClick={() =>
                                  patch({
                                    evidenceTrust: { ...state.evidenceTrust, [e.id]: level },
                                  })
                                }
                                className={`rounded-md border px-2.5 py-1 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                  selected
                                    ? 'border-primary bg-blue-50 text-primary'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {level}
                              </button>
                            )
                          })}
                        </div>
                      </li>
                    ))}
                </ol>
              )}

              {(current === 'intermediate' || current === 'advanced') &&
                state.revealedEvidence.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label htmlFor="missing-note" className="text-sm font-semibold text-slate-900">
                      빠져 있다고 느낀 정보
                    </label>
                    <p className="text-xs text-slate-500">
                      힌트 예: {currentCase.missingInfoHints[0]}
                    </p>
                    <textarea
                      id="missing-note"
                      value={state.missingNote}
                      onChange={e => patch({ missingNote: e.target.value })}
                      rows={2}
                      placeholder="예) 특정 집단의 오인식률이 나와 있지 않다 ..."
                      className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}
            </Panel>
          )}

          {/* —— 중급: 최종 판단 + 보호 조치 —— */}
          {current === 'intermediate' && state.revealedEvidence.length > 0 && (
            <Panel
              title="최종 판단과 보호 조치"
              description="증거를 본 뒤 판단을 다시 고르세요. 조건부를 고르면 보호 조치를 고릅니다."
            >
              <JudgmentPicker
                label="최종 판단"
                value={state.finalJudgment}
                onChange={j => patch({ finalJudgment: j })}
              />

              {state.initialJudgment && state.finalJudgment && (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-900">1차 ↔ 최종 비교</p>
                  <p className="mt-1 text-slate-700">
                    1차: {JUDGMENT_LABEL[state.initialJudgment]} → 최종:{' '}
                    {JUDGMENT_LABEL[state.finalJudgment]}
                    {state.initialJudgment === state.finalJudgment
                      ? ' (유지)'
                      : ' (변경됨)'}
                  </p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <label htmlFor="reason-mid" className="text-sm font-semibold text-slate-900">
                  최종 이유를 적어 보세요
                </label>
                <textarea
                  id="reason-mid"
                  value={state.reason}
                  onChange={e => patch({ reason: e.target.value })}
                  rows={3}
                  placeholder="어떤 증거가 판단을 지지했는지 적어 보세요."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {(state.finalJudgment === '조건부' || state.initialJudgment === '조건부') && (
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <Shield className="h-4 w-4 text-primary" aria-hidden />
                    보호 조치 고르기
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentCase.measures.map(m => (
                      <ChoiceCard
                        key={m.id}
                        selected={state.selectedMeasures.includes(m.id)}
                        title={m.title}
                        description={m.description}
                        onClick={() => toggleMeasure(m.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {state.finalJudgment && state.initialJudgment && (
                <div className="mt-4">
                  <ExplainBox
                    analogy="뉴스 한 꼭지를 더 읽었더니 생각이 바뀌는 것처럼, 증거는 판단을 ‘다시 써 보게’ 만듭니다."
                    steps={[
                      `증거 ${state.revealedEvidence.length}장을 열었습니다.${
                        Object.keys(state.evidenceTrust).length > 0
                          ? ` 그중 신뢰도를 표시한 증거는 ${Object.keys(state.evidenceTrust).length}장입니다.`
                          : ' 각 증거의 신뢰도도 표시해 보세요.'
                      }`,
                      state.initialJudgment === state.finalJudgment
                        ? `1차와 최종이 모두 「${JUDGMENT_LABEL[state.finalJudgment]}」으로 같았습니다. 유지해도 괜찮지만, 어떤 증거가 그 생각을 뒷받침했는지 적어 보세요.`
                        : `1차 「${JUDGMENT_LABEL[state.initialJudgment]}」→ 최종 「${JUDGMENT_LABEL[state.finalJudgment]}」로 바뀌었습니다. 바뀌게 만든 증거를 이유에 연결해 보세요.`,
                      state.missingNote.trim()
                        ? '빠져 있다고 느낀 정보도 적어두었습니다. 모르는 점을 인정하는 것도 신중한 판단입니다.'
                        : '아직 없는 정보(빠진 점)를 메모하면, 성급한 결론을 줄일 수 있습니다.',
                    ]}
                    takeaway="증거가 판단을 바꿀 수도, 처음 생각을 더 단단하게 만들 수도 있습니다. 중요한 건 ‘왜’를 남기는 일입니다."
                  />
                </div>
              )}
            </Panel>
          )}

          {/* —— 고급: 원칙 충돌 · 책임 · 의견서 · 체크리스트 —— */}
          {current === 'advanced' && (
            <>
              <Panel
                title="원칙 충돌"
                description="세 원칙이 동시에 완벽할 수는 없습니다. 무엇이 부딪히는지 읽고, 우선할 원칙을 고르세요."
              >
                <div className="mb-4 flex flex-wrap gap-3 text-sm">
                  {(Object.keys(PRINCIPLE_LABEL) as PrincipleId[]).map(pid => (
                    <TermHelp key={pid} term={PRINCIPLE_LABEL[pid]}>
                      {PRINCIPLE_HELP[pid]}
                    </TermHelp>
                  ))}
                </div>

                <div className="space-y-3">
                  {currentCase.principleConflicts.map(pc => (
                    <div key={pc.id} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-sm font-bold text-slate-900">
                        <Scale className="mr-1 inline h-4 w-4 text-primary" aria-hidden />
                        {PRINCIPLE_LABEL[pc.a]} ↔ {PRINCIPLE_LABEL[pc.b]}
                      </p>
                      <p className="mt-1.5 text-sm text-slate-700">{pc.tension}</p>
                      <ul className="mt-2 space-y-1 text-xs text-slate-600">
                        <li>· {PRINCIPLE_LABEL[pc.a]}만: {pc.ifOnlyA}</li>
                        <li>· {PRINCIPLE_LABEL[pc.b]}만: {pc.ifOnlyB}</li>
                      </ul>
                      <label className="mt-3 block text-xs font-medium text-slate-600" htmlFor={`conflict-${pc.id}`}>
                        이 충돌을 어떻게 균형 잡을지 (선택)
                      </label>
                      <textarea
                        id={`conflict-${pc.id}`}
                        value={state.conflictNotes[pc.id] ?? ''}
                        onChange={e =>
                          patch({
                            conflictNotes: { ...state.conflictNotes, [pc.id]: e.target.value },
                          })
                        }
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">이번에 더 우선할 원칙</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(Object.keys(PRINCIPLE_LABEL) as PrincipleId[]).map(pid => (
                      <ChoiceCard
                        key={pid}
                        selected={state.principlePriority === pid}
                        title={PRINCIPLE_LABEL[pid]}
                        description={PRINCIPLE_HELP[pid]}
                        onClick={() =>
                          patch({
                            principlePriority: state.principlePriority === pid ? null : pid,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel
                title="책임 지도"
                description="문제가 생겼을 때 누가 무엇을 맡을지 나눕니다. 한곳에만 책임을 몰지 마세요."
              >
                <div className="grid gap-3 lg:grid-cols-3">
                  {currentCase.responsibilities.map(block => (
                    <div key={block.role} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-sm font-bold text-slate-900">{ROLE_LABEL[block.role]}</p>
                      <ul className="mt-2 space-y-1 text-xs text-slate-600">
                        {block.duties.map(d => (
                          <li key={d}>· {d}</li>
                        ))}
                      </ul>
                      <label
                        className="mt-3 block text-xs font-medium text-slate-600"
                        htmlFor={`duty-${block.role}`}
                      >
                        이 역할에 맡기고 싶은 일
                      </label>
                      <textarea
                        id={`duty-${block.role}`}
                        value={state.responsibilityMap[block.role] ?? ''}
                        onChange={e =>
                          patch({
                            responsibilityMap: {
                              ...state.responsibilityMap,
                              [block.role]: e.target.value,
                            },
                          })
                        }
                        rows={2}
                        placeholder="예) 오인식 통계를 학기마다 공개한다"
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel
                title="배심원 의견서"
                description="최종 판단, 근거, 조건, 남은 불확실성을 한곳에 모읍니다. 사람을 비난하는 글이 아니라 시스템 조건을 적습니다."
              >
                <JudgmentPicker
                  label="최종 판단"
                  value={state.finalJudgment}
                  onChange={j => patch({ finalJudgment: j })}
                />

                {state.initialJudgment && state.finalJudgment && (
                  <p className="mt-3 text-sm text-slate-700">
                    1차 {JUDGMENT_LABEL[state.initialJudgment]} → 최종{' '}
                    {JUDGMENT_LABEL[state.finalJudgment]}
                    {state.initialJudgment === state.finalJudgment ? ' (유지)' : ' (변경)'}
                  </p>
                )}

                {(state.finalJudgment === '조건부' || state.initialJudgment === '조건부') && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-900">의견서에 넣을 보호 조치</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {currentCase.measures.map(m => (
                        <ChoiceCard
                          key={m.id}
                          selected={state.selectedMeasures.includes(m.id)}
                          title={m.title}
                          description={m.description}
                          onClick={() => toggleMeasure(m.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <label htmlFor="jury-opinion" className="text-sm font-semibold text-slate-900">
                    배심원 의견 (근거 포함)
                  </label>
                  <textarea
                    id="jury-opinion"
                    value={state.juryOpinion}
                    onChange={e => patch({ juryOpinion: e.target.value })}
                    rows={5}
                    placeholder="이해관계자, 열어 본 증거, 우선 원칙, 조건을 연결해 적어 보세요."
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <label htmlFor="uncertainty" className="text-sm font-semibold text-slate-900">
                    남은 불확실성
                  </label>
                  <textarea
                    id="uncertainty"
                    value={state.uncertainty}
                    onChange={e => patch({ uncertainty: e.target.value })}
                    rows={2}
                    placeholder="예) 아직 독립 시험 결과가 없어서 ..."
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </Panel>

              <Panel
                title="근거 충실도 체크리스트"
                description="점수가 아닙니다. 의견서를 다시 읽으며 빠진 칸이 있는지 스스로 표시하세요."
              >
                <ul className="space-y-2">
                  {CHECKLIST_ITEMS.map(item => {
                    const checked = state.checklist.includes(item.id)
                    // 조건부일 때만 조건 항목이 의미 있습니다.
                    const skipConditions =
                      item.id === 'conditions' &&
                      state.finalJudgment !== '조건부' &&
                      state.initialJudgment !== '조건부'
                    return (
                      <li key={item.id}>
                        <label
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                            checked ? 'border-primary bg-blue-50/50' : 'border-slate-200 bg-white'
                          } ${skipConditions ? 'opacity-60' : ''}`}
                        >
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                            checked={checked}
                            disabled={skipConditions}
                            onChange={() => toggleChecklist(item.id)}
                          />
                          <span>
                            <span className="block text-sm font-semibold text-slate-900">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-600">{item.hint}</span>
                            {skipConditions && (
                              <span className="mt-1 block text-xs font-medium text-slate-500">
                                최종 판단이 조건부가 아니면 이 항목은 해당 없습니다.
                              </span>
                            )}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-3 text-xs text-slate-500">
                  확인함 {state.checklist.length} / {CHECKLIST_ITEMS.length} · 등급·점수로 쓰지 마세요.
                </p>
              </Panel>

              {(state.juryOpinion.trim() || state.finalJudgment) && (
                <ExplainBox
                  analogy="운동회 점수표가 아니라, 출발 전 준비물을 체크하는 목록에 가깝습니다. 칸을 다 채워도 ‘등수’는 없습니다."
                  steps={[
                    state.principlePriority
                      ? `이번에 더 우선한 원칙은 「${PRINCIPLE_LABEL[state.principlePriority]}」입니다. 다른 원칙을 버린 게 아니라, 충돌 속에서 무게를 둔 것입니다.`
                      : '원칙이 부딪힐 때는 하나를 ‘절대 정답’으로 고르기보다, 무엇을 더 우선할지와 그 이유를 밝히는 게 중요합니다.',
                    state.initialJudgment && state.finalJudgment
                      ? state.initialJudgment === state.finalJudgment
                        ? `1차와 최종 판단이 「${JUDGMENT_LABEL[state.finalJudgment]}」으로 같았습니다.`
                        : `증거가 쌓인 뒤 「${JUDGMENT_LABEL[state.initialJudgment]}」→「${JUDGMENT_LABEL[state.finalJudgment]}」로 바뀌었습니다.`
                      : '최종 판단과 의견서에 근거·조건을 연결해 적어 보세요.',
                    `체크리스트는 ${state.checklist.length}/${CHECKLIST_ITEMS.length}항목을 확인했습니다. 이 숫자는 성적이 아니라 ‘꼼꼼히 생각했는지’를 스스로 돌아보는 표시입니다.`,
                    state.uncertainty.trim()
                      ? '남은 불확실성까지 적어 두었습니다. 모르는 점을 숨기지 않는 것이 책임 있는 의견입니다.'
                      : '아직 모르는 점(불확실성)을 적어 두면, 의견서가 더 정직해집니다.',
                  ]}
                  takeaway="원칙 충돌은 실패가 아닙니다. 체크리스트도 점수가 아니라, ‘충분히 생각했는지’를 확인하는 도구입니다."
                />
              )}
            </>
          )}

          {/* —— 결과 요약 —— */}
          {(state.finalJudgment || state.juryOpinion.trim()) && (
            <Panel title="숙의 요약" description="저장·인쇄용으로 지금까지의 선택을 모았습니다.">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs font-medium text-slate-500">사례</dt>
                  <dd className="font-semibold text-slate-900">{currentCase.title}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs font-medium text-slate-500">판단</dt>
                  <dd className="font-semibold text-slate-900">
                    {state.initialJudgment &&
                    state.finalJudgment &&
                    state.initialJudgment !== state.finalJudgment
                      ? `${state.initialJudgment} → ${state.finalJudgment}`
                      : judgmentForExport ?? '미선택'}
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">이유·의견</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-slate-800">
                    {state.juryOpinion.trim() || state.reason.trim() || '아직 적지 않았습니다.'}
                  </dd>
                </div>
              </dl>
            </Panel>
          )}

          <ReflectionPanel
            difficulty={current}
            questions={REFLECTION_QUESTIONS[current]}
            answers={state.reflection}
            onChange={handleReflectionChange}
          />

          <Panel title="결과 저장하기">
            <ResultActions
              onDownloadJson={() => downloadJson(MODULE_ID, buildExport(current))}
              onDownloadCsv={() => downloadCsv(MODULE_ID, resultToCsvRows(buildExport(current)))}
              onPrint={printReport}
              disabled={!canExport}
              disabledReason="판단을 고르거나 의견서를 조금 적은 뒤에 저장할 수 있습니다."
            />
          </Panel>
        </div>
      )}
    </ModuleFrame>
  )
}
