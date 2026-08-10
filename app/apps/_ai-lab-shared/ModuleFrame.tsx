'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { DifficultyPicker, DifficultySwitch } from './difficulty'
import {
  LearningSupportBundle,
  useLearningSnapshots,
  useLearningSupportState,
} from './learningSupport'
import type { LearningSupportConfig, SnapshotEntry } from './learningTypes'
import { StageGuide, resolveStageGuide, type StageGuideMap } from './stageGuide'
import { STAGE_LABEL, type Difficulty, type DifficultyCard, type StageId } from './types'
import { Button, NoticeBadge } from './ui'

/** 학습 단계 표시. 현재 위치를 색과 숫자, 굵기로 함께 나타냅니다. */
export function StageNav({ stages, current }: { stages: StageId[]; current: StageId }) {
  const currentIndex = stages.indexOf(current)

  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="학습 단계">
      {stages.map((stage, index) => {
        const done = index < currentIndex
        const active = index === currentIndex
        return (
          <li key={stage} className="flex items-center gap-1.5">
            <span
              aria-current={active ? 'step' : undefined}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                active
                  ? 'bg-primary text-white'
                  : done
                    ? 'bg-blue-50 text-primary'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className="tabular-nums">{index + 1}</span>
              {STAGE_LABEL[stage]}
              {done && <span className="sr-only">(완료)</span>}
            </span>
            {index < stages.length - 1 && (
              <span aria-hidden className="text-slate-300">
                ›
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export type SnapshotPayload = {
  label: string
  metrics: Record<string, string | number>
  note?: string
}

/**
 * 8개 모듈의 공통 뼈대.
 * 상단 헤더(앱 이름, 목록으로 돌아가기, 별점)는 AppRunnerShell이 이미 제공하므로
 * 여기서 다시 만들지 않습니다.
 */
export function ModuleFrame({
  moduleName,
  question,
  cards,
  stages,
  currentStage,
  stageGuides,
  learningSupport,
  getSnapshot,
  notice,
  onReset,
  onDifficultyChange,
  children,
}: {
  moduleName: string
  question: string
  cards: DifficultyCard[]
  stages?: StageId[]
  currentStage?: StageId
  /** 단계별 부가 설명. 없으면 공통 기본 안내를 씁니다. */
  stageGuides?: StageGuideMap
  /** 힌트·체크리스트·미션·용어·문장 틀·오개념 */
  learningSupport?: LearningSupportConfig
  /** 비교 스냅샷에 넣을 현재 지표. null이면 아직 저장할 상태가 아님 */
  getSnapshot?: (difficulty: Difficulty) => SnapshotPayload | null
  /** 교육용 단순화·합성 데이터 안내 문구 */
  notice?: ReactNode
  /** 처음부터 다시 시작할 때 앱 상태를 정리합니다. */
  onReset?: (difficulty: Difficulty) => void
  /** 난이도가 바뀔 때마다 호출됩니다. 상태는 초기화하지 않습니다. */
  onDifficultyChange?: (difficulty: Difficulty) => void
  children: (difficulty: Difficulty) => ReactNode
}) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const support = useLearningSupportState()
  const { snapshots, capture, clear } = useLearningSnapshots()

  const handleSelect = useCallback(
    (next: Difficulty) => {
      setDifficulty(next)
      onDifficultyChange?.(next)
      onReset?.(next)
      support.resetSupport()
      clear()
    },
    [onDifficultyChange, onReset, support.resetSupport, clear]
  )

  const handleSwitch = useCallback(
    (next: Difficulty) => {
      setDifficulty(next)
      onDifficultyChange?.(next)
    },
    [onDifficultyChange]
  )

  const handleCapture = useCallback(() => {
    if (!difficulty) return
    const payload = getSnapshot?.(difficulty)
    if (payload) {
      capture(payload.label, payload.metrics, payload.note)
      return
    }
    // 앱이 getSnapshot을 안 넘긴 경우에도 단계·난이도 체크포인트는 남길 수 있습니다.
    capture(`${STAGE_LABEL[currentStage ?? 'explore']} 체크포인트`, {
      학습방식: difficulty,
      단계: currentStage ? STAGE_LABEL[currentStage] : '-',
    })
  }, [difficulty, getSnapshot, capture, currentStage])

  if (!difficulty) {
    return (
      <div className="space-y-4">
        {notice && <NoticeBadge>{notice}</NoticeBadge>}
        <DifficultyPicker
          moduleName={moduleName}
          question={question}
          cards={cards}
          onSelect={handleSelect}
        />
      </div>
    )
  }

  const guide =
    stages && currentStage ? resolveStageGuide(currentStage, stageGuides) : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <DifficultySwitch value={difficulty} onChange={handleSwitch} />
        <div className="flex items-center gap-2">
          {confirmingReset ? (
            <>
              <span className="text-xs font-medium text-slate-600">지금까지의 조작을 모두 지울까요?</span>
              <Button
                variant="danger"
                onClick={() => {
                  onReset?.(difficulty)
                  support.resetSupport()
                  clear()
                  setConfirmingReset(false)
                }}
              >
                네, 처음부터
              </Button>
              <Button variant="ghost" onClick={() => setConfirmingReset(false)}>
                취소
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmingReset(true)}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              처음부터
            </Button>
          )}
        </div>
      </div>

      {stages && currentStage && (
        <div className="space-y-3 print:hidden">
          <StageNav stages={stages} current={currentStage} />
          {guide && <StageGuide stage={currentStage} content={guide} />}
        </div>
      )}

      {notice && <NoticeBadge>{notice}</NoticeBadge>}

      {learningSupport && (
        <LearningSupportBundle
          config={learningSupport}
          stage={currentStage}
          checklistChecked={support.checklistChecked}
          onChecklistToggle={support.toggleChecklist}
          sentenceValues={support.sentenceValues}
          onSentenceChange={support.setSentence}
          teacherMode={support.teacherMode}
          onTeacherMode={support.setTeacherMode}
          activeMissionId={support.activeMissionId}
          onMissionSelect={support.setActiveMissionId}
          misconceptionAnswers={support.misconceptionAnswers}
          onMisconceptionAnswer={support.setMisconception}
          snapshots={snapshots}
          onCaptureSnapshot={handleCapture}
          onClearSnapshots={clear}
          canCaptureSnapshot={Boolean(difficulty)}
        />
      )}

      {children(difficulty)}
    </div>
  )
}

/** 아직 구현하지 않은 모듈에 쓰는 자리 표시 화면 */
export function ComingSoon({
  moduleName,
  planned,
}: {
  moduleName: string
  /** 완성되면 학생이 무엇을 하게 되는지 */
  planned: string[]
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-base font-bold text-slate-900">{moduleName}은(는) 준비 중입니다</p>
      <p className="mt-1.5 text-sm text-slate-600">
        학습 방식은 미리 골라 볼 수 있고, 실험 기능은 곧 추가됩니다.
      </p>
      <ul className="mx-auto mt-4 max-w-md space-y-1.5 text-left">
        {planned.map(item => (
          <li key={item} className="flex gap-2 text-sm text-slate-700">
            <span aria-hidden className="text-primary">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export type { SnapshotEntry }
