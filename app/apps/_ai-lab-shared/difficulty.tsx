'use client'

import { Clock } from 'lucide-react'
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_ORDER,
  DIFFICULTY_SHORT,
  type Difficulty,
  type DifficultyCard,
} from './types'
import { Button } from './ui'

/**
 * 난이도 선택 화면.
 * 난이도는 실력 등급이 아니라 학습 진입점이므로 잠금·자물쇠 표현을 쓰지 않고,
 * 상위 난이도의 기능은 화면에서 아예 렌더링하지 않습니다.
 */
export function DifficultyPicker({
  moduleName,
  question,
  cards,
  onSelect,
}: {
  moduleName: string
  /** 이 모듈이 던지는 핵심 질문 */
  question: string
  cards: DifficultyCard[]
  onSelect: (difficulty: Difficulty) => void
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">핵심 질문</p>
        <p className="mt-1.5 text-lg font-bold leading-snug text-slate-900 sm:text-xl">{question}</p>
        <p className="mt-2 text-sm text-slate-600">
          아래에서 시작할 방식을 고르세요. 학습 중에 언제든 바꿀 수 있고, 바꿔도 지금까지 한 조작은 그대로 남습니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={card.difficulty}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {index + 1}
              </span>
              <h3 className="text-base font-bold text-slate-900">{DIFFICULTY_LABEL[card.difficulty]}</h3>
            </div>

            <p className="mt-2.5 text-sm leading-relaxed text-slate-700">{card.summary}</p>

            <ul className="mt-3 flex-1 space-y-1.5">
              {card.points.map(point => (
                <li key={point} className="flex gap-1.5 text-xs leading-relaxed text-slate-600">
                  <span aria-hidden className="text-primary">
                    •
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5" aria-hidden />약 {card.minutes}분
            </p>

            <Button
              variant="primary"
              className="mt-3 w-full"
              onClick={() => onSelect(card.difficulty)}
            >
              이 방식으로 시작하기
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {moduleName}은(는) 정답을 맞히는 활동이 아닙니다. 값을 바꾸고, 무엇이 달라졌는지 관찰하고, 왜 달라졌는지 설명하는 것이 목표입니다.
      </p>
    </div>
  )
}

/** 학습 중 상단에 두는 난이도 전환 바 */
export function DifficultySwitch({
  value,
  onChange,
}: {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500">학습 방식</span>
      <div
        className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
        role="group"
        aria-label="학습 방식 선택"
      >
        {DIFFICULTY_ORDER.map(difficulty => {
          const active = difficulty === value
          return (
            <button
              key={difficulty}
              type="button"
              onClick={() => onChange(difficulty)}
              aria-pressed={active}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {DIFFICULTY_SHORT[difficulty]}
              <span className="ml-1 hidden font-normal sm:inline">
                {DIFFICULTY_LABEL[difficulty]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
