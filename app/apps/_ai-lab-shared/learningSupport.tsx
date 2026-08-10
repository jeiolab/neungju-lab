'use client'

import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  Camera,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Lightbulb,
  MessageSquareText,
  BookMarked,
} from 'lucide-react'
import { STAGE_LABEL, type StageId } from './types'
import type {
  ChecklistItem,
  GlossaryTerm,
  HintStep,
  LearningSupportConfig,
  MisconceptionItem,
  SentenceFrame,
  SnapshotEntry,
  TeacherMission,
} from './learningTypes'
import { Button, ChoiceCard, Panel } from './ui'

/** 접을 수 있는 학습 지원 섹션 껍데기 */
function SupportSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50/50">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-violet-950">
          {icon}
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-violet-600" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-violet-600" aria-hidden />
        )}
      </button>
      {open && <div className="space-y-3 border-t border-violet-200 px-4 py-3">{children}</div>}
    </section>
  )
}

/** 오늘의 핵심 용어 3개 */
export function GlossaryPanel({ terms }: { terms: GlossaryTerm[] }) {
  if (terms.length === 0) return null
  return (
    <SupportSection
      title={`오늘의 단어 ${Math.min(3, terms.length)}개`}
      icon={<BookMarked className="h-4 w-4 text-violet-700" aria-hidden />}
      defaultOpen
    >
      <ul className="space-y-2">
        {terms.slice(0, 5).map(item => (
          <li key={item.term} className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-violet-100">
            <p className="text-sm font-bold text-slate-900">{item.term}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{item.plain}</p>
          </li>
        ))}
      </ul>
    </SupportSection>
  )
}

/** 단계형 힌트 — 「다음 할 일」을 하나씩 열어 보여 줍니다. */
export function NextHintPanel({
  stage,
  hints,
}: {
  stage: StageId
  hints: HintStep[]
}) {
  const [index, setIndex] = useState(0)
  const safeHints = hints.length > 0 ? hints : []
  const current = safeHints[Math.min(index, safeHints.length - 1)]

  if (safeHints.length === 0) return null

  return (
    <SupportSection
      title={`${STAGE_LABEL[stage]} · 다음 할 일`}
      icon={<Lightbulb className="h-4 w-4 text-amber-600" aria-hidden />}
      defaultOpen
    >
      <p className="text-sm font-semibold leading-relaxed text-slate-900">{current.action}</p>
      {current.why && (
        <p className="text-xs leading-relaxed text-slate-600">
          <span className="font-semibold">왜요?</span> {current.why}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs tabular-nums text-slate-500">
          힌트 {Math.min(index + 1, safeHints.length)} / {safeHints.length}
        </span>
        <Button
          variant="secondary"
          className="!py-1.5 text-xs"
          disabled={index >= safeHints.length - 1}
          onClick={() => setIndex(i => Math.min(i + 1, safeHints.length - 1))}
        >
          다음 힌트
        </Button>
        <Button
          variant="ghost"
          className="!py-1.5 text-xs"
          disabled={index === 0}
          onClick={() => setIndex(i => Math.max(i - 1, 0))}
        >
          이전
        </Button>
      </div>
      <p className="text-xs text-slate-500">막힐 때만 다음 힌트를 열어 보세요. 먼저 스스로 눌러 보는 편이 공부에 좋습니다.</p>
    </SupportSection>
  )
}

/** 성찰 전 관찰 체크리스트 */
export function ObservationChecklist({
  items,
  checked,
  onToggle,
}: {
  items: ChecklistItem[]
  checked: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  const done = items.filter(item => checked[item.id]).length
  const ready = done === items.length && items.length > 0

  return (
    <SupportSection
      title={`관찰 체크리스트 (${done}/${items.length})`}
      icon={<CheckSquare className="h-4 w-4 text-emerald-700" aria-hidden />}
      defaultOpen
    >
      <p className="text-xs leading-relaxed text-slate-600">
        성찰을 쓰기 전에, 화면에서 직접 확인한 것만 체크하세요. 추측은 체크하지 않아도 됩니다.
      </p>
      <ul className="space-y-2">
        {items.map(item => {
          const on = Boolean(checked[item.id])
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-white/90 px-3 py-2 ring-1 ring-slate-200 hover:bg-white">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(item.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className={`text-sm leading-relaxed ${on ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
      <p className={`text-xs font-semibold ${ready ? 'text-emerald-700' : 'text-amber-700'}`}>
        {ready
          ? '관찰을 모두 확인했습니다. 이제 성찰을 적어도 좋습니다.'
          : '아직 확인하지 않은 항목이 있습니다. 실험 화면으로 돌아가 숫자·그림을 다시 보세요.'}
      </p>
    </SupportSection>
  )
}

/** 동료에게 설명할 때 쓰는 문장 틀 */
export function SentenceFramePanel({
  frames,
  values,
  onChange,
}: {
  frames: SentenceFrame[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
}) {
  if (frames.length === 0) return null
  return (
    <SupportSection
      title="친구에게 설명하는 문장"
      icon={<MessageSquareText className="h-4 w-4 text-sky-700" aria-hidden />}
      defaultOpen={false}
    >
      <p className="text-xs leading-relaxed text-slate-600">
        ___ 칸을 채워 한 문장으로 말해 보세요. 짝 활동이나 발표에 바로 쓸 수 있습니다.
      </p>
      <div className="space-y-3">
        {frames.map(frame => (
          <div key={frame.id} className="space-y-1.5">
            <p className="text-sm font-medium text-slate-800">{frame.template}</p>
            {frame.hint && <p className="text-xs text-slate-500">힌트: {frame.hint}</p>}
            <input
              type="text"
              value={values[frame.id] ?? ''}
              onChange={e => onChange(frame.id, e.target.value)}
              placeholder="빈칸에 들어갈 말을 적어 보세요"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
      </div>
    </SupportSection>
  )
}

/** 교사 모드 미션 카드 */
export function TeacherMissionPanel({
  missions,
  activeId,
  teacherMode,
  onTeacherMode,
  onSelect,
}: {
  missions: TeacherMission[]
  activeId: string | null
  teacherMode: boolean
  onTeacherMode: (on: boolean) => void
  onSelect: (id: string | null) => void
}) {
  const active = missions.find(m => m.id === activeId) ?? null

  return (
    <SupportSection
      title="교사 미션"
      icon={<GraduationCap className="h-4 w-4 text-indigo-700" aria-hidden />}
      defaultOpen={teacherMode}
    >
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
        <input
          type="checkbox"
          checked={teacherMode}
          onChange={e => {
            onTeacherMode(e.target.checked)
            if (!e.target.checked) onSelect(null)
          }}
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
        교사 모드 켜기 (미션 카드 고르기)
      </label>

      {!teacherMode && (
        <p className="text-xs text-slate-500">
          선생님이 미션을 정해 주시면 여기서 고릅니다. 혼자 탐구할 때는 꺼 두어도 됩니다.
        </p>
      )}

      {teacherMode && (
        <div className="grid gap-2 sm:grid-cols-2">
          {missions.map(mission => (
            <ChoiceCard
              key={mission.id}
              selected={activeId === mission.id}
              title={`${mission.title} · ${mission.minutes}분`}
              description={mission.goal}
              onClick={() => onSelect(activeId === mission.id ? null : mission.id)}
            />
          ))}
        </div>
      )}

      {active && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-950">
          <p className="font-bold">진행 중 미션 · {active.title}</p>
          <p className="mt-1 leading-relaxed">{active.goal}</p>
          {active.tips && active.tips.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs">
              {active.tips.map(tip => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </SupportSection>
  )
}

/** 오개념 체크 — 흔한 오해를 고르고 바로 피드백 */
export function MisconceptionQuiz({
  items,
  answers,
  onAnswer,
}: {
  items: MisconceptionItem[]
  answers: Record<string, boolean | null>
  onAnswer: (id: string, value: boolean) => void
}) {
  if (!items || items.length === 0) return null
  return (
    <SupportSection
      title="오개념 체크"
      icon={<Lightbulb className="h-4 w-4 text-rose-600" aria-hidden />}
      defaultOpen={false}
    >
      <p className="text-xs text-slate-600">아래 문장이 맞는지 틀리는지 고른 뒤, 짧은 설명을 읽으세요.</p>
      <div className="space-y-3">
        {items.map(item => {
          const ans = answers[item.id]
          const revealed = ans !== undefined && ans !== null
          const correct = revealed && ans === item.isCorrect
          return (
            <div key={item.id} className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-900">「{item.claim}」</p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant={ans === true ? 'primary' : 'secondary'}
                  className="!py-1.5 text-xs"
                  onClick={() => onAnswer(item.id, true)}
                >
                  맞다
                </Button>
                <Button
                  variant={ans === false ? 'primary' : 'secondary'}
                  className="!py-1.5 text-xs"
                  onClick={() => onAnswer(item.id, false)}
                >
                  틀리다
                </Button>
              </div>
              {revealed && (
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    correct ? 'text-emerald-800' : 'text-amber-900'
                  }`}
                >
                  {correct ? '잘 판단했습니다. ' : '다시 생각해 볼까요. '}
                  {item.explain}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </SupportSection>
  )
}

/** 비교 스냅샷 — 조작 전·후 지표를 저장해 나란히 봅니다. */
export function SnapshotPanel({
  snapshots,
  onCapture,
  onClear,
  canCapture,
  captureHint,
}: {
  snapshots: SnapshotEntry[]
  onCapture: () => void
  onClear: () => void
  canCapture: boolean
  captureHint?: string
}) {
  const latestTwo = snapshots.slice(-2)

  return (
    <SupportSection
      title="비교 스냅샷"
      icon={<Camera className="h-4 w-4 text-slate-700" aria-hidden />}
      defaultOpen={snapshots.length > 0}
    >
      <p className="text-xs leading-relaxed text-slate-600">
        중요한 순간에 「지금 상태 저장」을 누르면, 나중과 나란히 비교할 수 있습니다. 한 가지만 바꾼 뒤 저장해 보세요.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={onCapture} disabled={!canCapture}>
          <Camera className="h-4 w-4" aria-hidden />
          지금 상태 저장
        </Button>
        <Button variant="ghost" onClick={onClear} disabled={snapshots.length === 0}>
          스냅샷 지우기
        </Button>
      </div>
      {!canCapture && captureHint && (
        <p className="text-xs font-medium text-amber-700">{captureHint}</p>
      )}

      {latestTwo.length === 0 ? (
        <p className="text-xs text-slate-500">아직 저장된 상태가 없습니다.</p>
      ) : (
        <div className={`grid gap-3 ${latestTwo.length > 1 ? 'sm:grid-cols-2' : ''}`}>
          {latestTwo.map((snap, index) => (
            <div key={snap.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-bold text-primary">
                {latestTwo.length > 1 ? (index === 0 ? '이전' : '최근') : '저장됨'} · {snap.label}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">{new Date(snap.at).toLocaleTimeString('ko-KR')}</p>
              <dl className="mt-2 space-y-1">
                {Object.entries(snap.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2 text-xs">
                    <dt className="text-slate-500">{key}</dt>
                    <dd className="font-semibold tabular-nums text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
              {snap.note && <p className="mt-2 text-xs text-slate-600">{snap.note}</p>}
            </div>
          ))}
        </div>
      )}

      {latestTwo.length === 2 && (
        <p className="text-xs font-semibold leading-relaxed text-slate-700">
          두 스냅샷에서 가장 크게 바뀐 숫자를 하나 고르고, 아래에서 이유를 말해 보세요.
        </p>
      )}
    </SupportSection>
  )
}

/**
 * 모듈 공통 학습 지원 묶음.
 * ModuleFrame 안이나 성찰 위에 배치합니다.
 */
export function LearningSupportBundle({
  config,
  stage,
  checklistChecked,
  onChecklistToggle,
  sentenceValues,
  onSentenceChange,
  teacherMode,
  onTeacherMode,
  activeMissionId,
  onMissionSelect,
  misconceptionAnswers,
  onMisconceptionAnswer,
  snapshots,
  onCaptureSnapshot,
  onClearSnapshots,
  canCaptureSnapshot,
  captureHint,
}: {
  config: LearningSupportConfig
  stage?: StageId
  checklistChecked: Record<string, boolean>
  onChecklistToggle: (id: string) => void
  sentenceValues: Record<string, string>
  onSentenceChange: (id: string, value: string) => void
  teacherMode: boolean
  onTeacherMode: (on: boolean) => void
  activeMissionId: string | null
  onMissionSelect: (id: string | null) => void
  misconceptionAnswers: Record<string, boolean | null>
  onMisconceptionAnswer: (id: string, value: boolean) => void
  snapshots: SnapshotEntry[]
  onCaptureSnapshot: () => void
  onClearSnapshots: () => void
  canCaptureSnapshot: boolean
  captureHint?: string
}) {
  const stageHints = useMemo(() => {
    if (!stage) return []
    return config.hintsByStage[stage] ?? []
  }, [config.hintsByStage, stage])

  const showChecklist = stage === 'result' || stage === 'reflect' || stage === 'challenge'

  return (
    <div className="space-y-3 print:hidden">
      <GlossaryPanel terms={config.glossary} />
      <TeacherMissionPanel
        missions={config.missions}
        activeId={activeMissionId}
        teacherMode={teacherMode}
        onTeacherMode={onTeacherMode}
        onSelect={onMissionSelect}
      />
      {stage && <NextHintPanel stage={stage} hints={stageHints} />}
      <SnapshotPanel
        snapshots={snapshots}
        onCapture={onCaptureSnapshot}
        onClear={onClearSnapshots}
        canCapture={canCaptureSnapshot}
        captureHint={captureHint}
      />
      {showChecklist && (
        <ObservationChecklist
          items={config.checklist}
          checked={checklistChecked}
          onToggle={onChecklistToggle}
        />
      )}
      <SentenceFramePanel
        frames={config.sentenceFrames}
        values={sentenceValues}
        onChange={onSentenceChange}
      />
      <MisconceptionQuiz
        items={config.misconceptions ?? []}
        answers={misconceptionAnswers}
        onAnswer={onMisconceptionAnswer}
      />
    </div>
  )
}

/** 스냅샷 상태 훅 — 앱에서 metrics를 넘기면 저장합니다. */
export function useLearningSnapshots(max = 6) {
  const [snapshots, setSnapshots] = useState<SnapshotEntry[]>([])

  const capture = useCallback(
    (label: string, metrics: Record<string, string | number>, note?: string) => {
      const entry: SnapshotEntry = {
        id: `snap-${Date.now()}`,
        label,
        at: new Date().toISOString(),
        metrics,
        note,
      }
      setSnapshots(prev => [...prev, entry].slice(-max))
    },
    [max]
  )

  const clear = useCallback(() => setSnapshots([]), [])

  return { snapshots, capture, clear }
}

/** 학습 지원 UI 상태를 한곳에서 관리 */
export function useLearningSupportState() {
  const [checklistChecked, setChecklistChecked] = useState<Record<string, boolean>>({})
  const [sentenceValues, setSentenceValues] = useState<Record<string, string>>({})
  const [teacherMode, setTeacherMode] = useState(false)
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null)
  const [misconceptionAnswers, setMisconceptionAnswers] = useState<
    Record<string, boolean | null>
  >({})

  const toggleChecklist = useCallback((id: string) => {
    setChecklistChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const setSentence = useCallback((id: string, value: string) => {
    setSentenceValues(prev => ({ ...prev, [id]: value }))
  }, [])

  const setMisconception = useCallback((id: string, value: boolean) => {
    setMisconceptionAnswers(prev => ({ ...prev, [id]: value }))
  }, [])

  const resetSupport = useCallback(() => {
    setChecklistChecked({})
    setSentenceValues({})
    setMisconceptionAnswers({})
    // teacher mode / mission은 교사가 유지할 수 있게 남깁니다.
  }, [])

  return {
    checklistChecked,
    toggleChecklist,
    sentenceValues,
    setSentence,
    teacherMode,
    setTeacherMode,
    activeMissionId,
    setActiveMissionId,
    misconceptionAnswers,
    setMisconception,
    resetSupport,
  }
}

/** 성찰 패널 위에 두는 학습 정리 구역 */
export function LearningWrapUp({ children }: { children: ReactNode }) {
  return (
    <Panel
      title="학습 정리 도구"
      description="관찰 확인 → 문장으로 설명 → 오개념 체크 순으로 해 보면 성찰이 쉬워집니다."
    >
      {children}
    </Panel>
  )
}
