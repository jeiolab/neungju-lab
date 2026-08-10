'use client'

import { useState, type ReactNode } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { STAGE_LABEL, type StageId } from './types'

/** 한 학습 단계에 붙는 부가 설명 */
export interface StageGuideContent {
  /** 이 단계에서 무엇을 하는지 */
  goal: string
  /** 어떻게 하면 좋은지 (짧은 팁) */
  tips?: string[]
  /** 중학생용 쉬운 비유 */
  analogy?: string
  /** 왜 이 단계가 필요한지 */
  why?: string
}

export type StageGuideMap = Partial<Record<StageId, StageGuideContent>>

/**
 * 현재 학습 단계에 맞춘 부가 설명.
 * 단계가 바뀔 때마다 내용이 바뀌어, 학생이 “지금 뭘 해야 하지?”를 바로 알 수 있습니다.
 */
export function StageGuide({
  stage,
  content,
  defaultOpen = true,
}: {
  stage: StageId
  content: StageGuideContent
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const tipId = `stage-guide-${stage}`

  return (
    <aside className="rounded-xl border border-sky-200 bg-sky-50/80 print:break-inside-avoid">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={tipId}
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        <span className="flex min-w-0 items-center gap-2">
          <BookOpen className="h-4 w-4 shrink-0 text-sky-700" aria-hidden />
          <span className="text-sm font-bold text-sky-950">
            {STAGE_LABEL[stage]} 단계 안내
          </span>
          <span className="hidden truncate text-xs font-medium text-sky-700 sm:inline">
            · {content.goal}
          </span>
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-sky-600" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-sky-600" aria-hidden />
        )}
      </button>

      {open && (
        <div id={tipId} className="space-y-3 border-t border-sky-200 px-4 py-3 text-sm text-sky-950">
          <p className="leading-relaxed">
            <span className="font-semibold">지금 할 일</span> · {content.goal}
          </p>

          {content.analogy && (
            <p className="flex items-start gap-2 leading-relaxed text-sky-900/90">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
              <span>
                <span className="font-semibold">쉬운 비유</span> · {content.analogy}
              </span>
            </p>
          )}

          {content.why && (
            <p className="leading-relaxed">
              <span className="font-semibold">왜 이 단계인가요</span> · {content.why}
            </p>
          )}

          {content.tips && content.tips.length > 0 && (
            <div>
              <p className="mb-1.5 font-semibold">이렇게 해 보세요</p>
              <ul className="space-y-1.5">
                {content.tips.map(tip => (
                  <li key={tip} className="flex gap-2 leading-relaxed">
                    <span aria-hidden className="text-sky-600">
                      •
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

/** 단계 안내가 없을 때 쓰는 공통 기본 문구 */
export const DEFAULT_STAGE_GUIDES: StageGuideMap = {
  intro: {
    goal: '이번 실험이 무엇을 묻는지 읽고, 화면의 도구를 가볍게 둘러보세요.',
    analogy: '요리하기 전에 레시피를 먼저 읽는 것과 같습니다.',
    why: '무엇을 관찰해야 할지 알면, 버튼을 눌러도 의미를 놓치지 않습니다.',
    tips: ['핵심 질문을 한 번 더 읽어 보세요.', '처음에는 값을 조금만 바꿔 보세요.'],
  },
  explore: {
    goal: '값을 바꾸거나 실행해 보면서, 무엇이 달라지는지 눈으로 확인하세요.',
    analogy: '전등 스위치를 올려 보고 불이 켜지는지 확인하는 실험과 비슷합니다.',
    why: '직접 만져 봐야 “왜 달라졌는지”를 스스로 말할 수 있습니다.',
    tips: ['한 가지만 바꾼 뒤 결과를 보세요.', '바뀌기 전과 후를 나란히 비교하세요.'],
  },
  challenge: {
    goal: '목표를 정해 두고, 조건을 맞추거나 더 나은 설정을 찾아보세요.',
    analogy: '제한 시간 안에 미션을 깨는 게임 스테이지와 같습니다.',
    why: '목표가 있으면 아무 버튼이나 누르지 않고, 원리에 집중하게 됩니다.',
    tips: ['미션 조건을 먼저 확인하세요.', '실패해도 괜찮습니다. 어떤 설정이 안 됐는지가 배움입니다.'],
  },
  result: {
    goal: '숫자와 그림을 보고, 왜 이런 결과가 나왔는지 설명해 보세요.',
    analogy: '시합이 끝난 뒤 경기 영상을 돌려 보는 것과 같습니다.',
    why: '결과만 보면 우연처럼 보이지만, 이유를 말하면 원리가 남습니다.',
    tips: ['가장 크게 바뀐 지표 하나를 고르세요.', '아래에 있는 「왜 이렇게 됐을까?」도 읽어 보세요.'],
  },
  reflect: {
    goal: '관찰한 내용을 자기 말로 짧게 정리하세요. 정답을 맞히는 칸이 아닙니다.',
    analogy: '실험 노트의 마지막 줄에 “오늘은 무엇을 알게 되었나”를 적는 것과 같습니다.',
    why: '말로 정리해야 다음에 비슷한 상황에서 판단할 수 있습니다.',
    tips: ['숫자 하나와 이유 한 문장을 함께 적어 보세요.', '헷갈린 점도 솔직히 적어도 됩니다.'],
  },
}

export function resolveStageGuide(
  stage: StageId,
  custom?: StageGuideMap | null
): StageGuideContent {
  return custom?.[stage] ?? DEFAULT_STAGE_GUIDES[stage] ?? {
    goal: '이 단계에서 화면의 안내를 따라 진행해 보세요.',
  }
}

/** 여러 단계를 한눈에 미리 보여 줄 때 쓰는 요약 목록 */
export function StageGuideOverview({
  stages,
  guides,
}: {
  stages: StageId[]
  guides?: StageGuideMap
}): ReactNode {
  return (
    <ol className="space-y-2">
      {stages.map((stage, index) => {
        const guide = resolveStageGuide(stage, guides)
        return (
          <li key={stage} className="flex gap-2 text-sm text-slate-700">
            <span className="font-bold tabular-nums text-primary">{index + 1}.</span>
            <span>
              <span className="font-semibold">{STAGE_LABEL[stage]}</span>
              {' — '}
              {guide.goal}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
