'use client'

import { Download, Printer } from 'lucide-react'
import type { Difficulty, ReflectionQuestion } from './types'
import { Button, ChoiceCard, Panel } from './ui'

/**
 * 난이도별 성찰 입력.
 * 초급은 객관식으로 생각을 고른 뒤 한 문장만 쓰고,
 * 중급은 두 문장, 고급은 근거를 포함한 서술을 씁니다.
 */
export function ReflectionPanel({
  difficulty,
  questions,
  answers,
  onChange,
}: {
  difficulty: Difficulty
  questions: ReflectionQuestion[]
  answers: Record<string, string>
  onChange: (id: string, value: string) => void
}) {
  const sentenceHint =
    difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3

  return (
    <Panel
      title="성찰"
      description="정답을 맞히는 칸이 아닙니다. 관찰한 내용을 자기 말로 정리해 보세요."
    >
      <div className="space-y-5">
        {questions.map(question => {
          const answer = answers[question.id] ?? ''
          const useChoices = difficulty === 'beginner' && question.choices && question.choices.length > 0

          return (
            <div key={question.id} className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">{question.prompt}</p>

              {useChoices ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  {question.choices!.map(choice => (
                    <ChoiceCard
                      key={choice}
                      selected={answer === choice}
                      title={choice}
                      onClick={() => onChange(question.id, answer === choice ? '' : choice)}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <label htmlFor={`reflect-${question.id}`} className="sr-only">
                    {question.prompt}
                  </label>
                  <textarea
                    id={`reflect-${question.id}`}
                    value={answer}
                    onChange={event => onChange(question.id, event.target.value)}
                    rows={difficulty === 'advanced' ? 4 : 3}
                    placeholder={
                      question.placeholder ??
                      `${question.sentences ?? sentenceHint}문장 정도로 써 보세요.`
                    }
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        작성한 내용은 이 브라우저 탭에만 남습니다. 탭을 닫으면 사라지니, 남겨야 한다면 아래에서 내려받거나 인쇄하세요.
      </p>
    </Panel>
  )
}

/** 결과 내보내기 버튼 묶음 */
export function ResultActions({
  onDownloadJson,
  onDownloadCsv,
  onPrint,
  disabled,
  disabledReason,
}: {
  onDownloadJson: () => void
  onDownloadCsv: () => void
  onPrint: () => void
  disabled?: boolean
  disabledReason?: string
}) {
  return (
    <div className="print:hidden">
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={onDownloadJson} disabled={disabled}>
          <Download className="h-4 w-4" aria-hidden />
          JSON 저장
        </Button>
        <Button onClick={onDownloadCsv} disabled={disabled}>
          <Download className="h-4 w-4" aria-hidden />
          CSV 저장
        </Button>
        <Button onClick={onPrint} disabled={disabled}>
          <Printer className="h-4 w-4" aria-hidden />
          인쇄
        </Button>
      </div>
      {disabled && disabledReason && (
        <p className="mt-2 text-xs font-medium text-rose-600">{disabledReason}</p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        저장 파일에는 이름·학번 같은 개인 정보가 들어가지 않습니다.
      </p>
    </div>
  )
}
