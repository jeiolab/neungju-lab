'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useId, useState } from 'react'
import { HelpCircle, Info } from 'lucide-react'

/** 흰 배경 위에 올리는 기본 패널. AppRunnerShell 안쪽 톤에 맞춥니다. */
export function Panel({
  title,
  description,
  actions,
  children,
  className = '',
}: {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            {title && <h3 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

/** 교육용 단순화·합성 데이터임을 알리는 배지 */
export function NoticeBadge({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

/**
 * 용어 도움말. 마우스와 키보드 모두로 열 수 있어야 하므로
 * hover 전용 tooltip 대신 버튼 토글 방식을 씁니다.
 */
export function TermHelp({ term, children }: { term: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <span className="relative inline-flex items-center gap-1">
      <span className="font-medium text-slate-900">{term}</span>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
        <span className="sr-only">{term} 용어 설명 열기</span>
      </button>
      {open && (
        <span
          id={panelId}
          role="note"
          className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-3 text-xs font-normal leading-relaxed text-slate-700 shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const BUTTON_STYLE: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:brightness-110',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'border border-rose-300 bg-white text-rose-700 hover:bg-rose-50',
}

export function Button({
  variant = 'secondary',
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_STYLE[variant]} ${className}`}
      {...props}
    />
  )
}

/** 지표 한 칸. 숫자만 크게 띄우지 않고 단위와 해석 방향을 함께 적습니다. */
export function StatCard({
  label,
  value,
  unit,
  hint,
  tone = 'neutral',
}: {
  label: string
  value: string | number
  unit?: string
  hint?: string
  tone?: 'neutral' | 'good' | 'warn'
}) {
  const toneClass =
    tone === 'good'
      ? 'border-emerald-200 bg-emerald-50'
      : tone === 'warn'
        ? 'border-amber-200 bg-amber-50'
        : 'border-slate-200 bg-slate-50'

  return (
    <div className={`rounded-lg border p-3 ${toneClass}`}>
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
        {value}
        {unit && <span className="ml-0.5 text-sm font-semibold text-slate-500">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-xs leading-snug text-slate-500">{hint}</p>}
    </div>
  )
}

/** 선택형 카드 버튼. 색만으로 구분하지 않도록 선택 시 체크 문구를 함께 넣습니다. */
export function ChoiceCard({
  selected,
  title,
  description,
  onClick,
  disabled,
  disabledReason,
}: {
  selected: boolean
  title: string
  description?: string
  onClick: () => void
  disabled?: boolean
  disabledReason?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`w-full rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? 'border-primary bg-blue-50 ring-1 ring-primary'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        {selected && <span className="shrink-0 text-xs font-bold text-primary">선택함</span>}
      </span>
      {description && <span className="mt-1 block text-xs leading-relaxed text-slate-600">{description}</span>}
      {disabled && disabledReason && (
        <span className="mt-1.5 block text-xs font-medium text-rose-600">{disabledReason}</span>
      )}
    </button>
  )
}

/** 오류·안내 메시지. 원인과 해결 방법을 함께 보여 줍니다. */
export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'error'
  title?: string
  children: ReactNode
}) {
  const toneClass =
    tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : tone === 'warn'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-sky-200 bg-sky-50 text-sky-900'

  return (
    <div className={`rounded-lg border p-3 text-sm ${toneClass}`} role={tone === 'error' ? 'alert' : undefined}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

/**
 * 결과·원리 설명 상자.
 * 숫자만 보여 주지 않고, 중학생도 이해할 수 있게
 * 「무엇이 일어났는지 → 왜 그랬는지 → 한 줄 정리」를 함께 적습니다.
 */
export function ExplainBox({
  title = '왜 이렇게 됐을까?',
  analogy,
  steps,
  takeaway,
  children,
}: {
  title?: string
  /** 일상 비유 한 문장 */
  analogy?: string
  /** 원리 단계 (짧고 쉬운 문장) */
  steps?: string[]
  /** 지금 화면에 대한 한 줄 정리 */
  takeaway?: string
  children?: ReactNode
}) {
  return (
    <aside className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-950">
      <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-900">
        <HelpCircle className="h-4 w-4 shrink-0" aria-hidden />
        {title}
      </p>
      {analogy && (
        <p className="mt-2 leading-relaxed text-emerald-900/90">
          <span className="font-semibold">쉬운 비유</span> · {analogy}
        </p>
      )}
      {steps && steps.length > 0 && (
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 leading-relaxed text-emerald-950">
          {steps.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
      {children && <div className="mt-2 leading-relaxed">{children}</div>}
      {takeaway && (
        <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-xs font-semibold leading-relaxed text-emerald-950 ring-1 ring-emerald-200">
          한 줄 정리 · {takeaway}
        </p>
      )}
    </aside>
  )
}
