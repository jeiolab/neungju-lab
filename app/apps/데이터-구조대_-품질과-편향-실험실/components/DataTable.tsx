'use client'

import { useMemo } from 'react'
import { FIELD_LABEL } from '../data'
import type { CellIssue, IssueKind, Student } from '../types'

const COLUMNS: Array<keyof Student> = [
  'id',
  'group',
  'priorActivities',
  'interest',
  'availableHours',
  'quizScore',
  'label',
]

/** 색만으로 구분하지 않도록 기호를 함께 씁니다. */
const ISSUE_MARK: Record<IssueKind, { mark: string; name: string; className: string }> = {
  missing: {
    mark: '?',
    name: '빈칸',
    className: 'bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-400',
  },
  outlier: {
    mark: '!',
    name: '이상한 값',
    className: 'bg-rose-50 text-rose-900 ring-1 ring-inset ring-rose-400',
  },
  duplicate: {
    mark: '=',
    name: '중복된 줄',
    className: 'bg-violet-50 text-violet-900 ring-1 ring-inset ring-violet-400',
  },
  suspiciousLabel: {
    mark: '~',
    name: '의심스러운 결과',
    className: 'bg-sky-50 text-sky-900 ring-1 ring-inset ring-sky-400',
  },
}

export function IssueLegend({ kinds }: { kinds: IssueKind[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {kinds.map(kind => {
        const style = ISSUE_MARK[kind]
        return (
          <li
            key={kind}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${style.className}`}
          >
            <span aria-hidden className="font-bold">
              {style.mark}
            </span>
            {style.name}
          </li>
        )
      })}
    </ul>
  )
}

function formatCell(row: Student, field: keyof Student): string {
  const value = row[field]
  if (value === null || value === undefined) return ''
  if (field === 'group') return `${value} 그룹`
  return String(value)
}

export default function DataTable({
  rows,
  issues,
  limit,
  highlightIssues = true,
  caption,
}: {
  rows: Student[]
  issues: CellIssue[]
  /** 화면에 보여 줄 최대 줄 수 */
  limit?: number
  highlightIssues?: boolean
  caption: string
}) {
  const issueMap = useMemo(() => {
    const map = new Map<string, CellIssue>()
    issues.forEach(issue => {
      const key = `${issue.rowId}:${String(issue.field)}`
      // 한 칸에 문제가 겹치면 먼저 발견한 것을 보여 줍니다.
      if (!map.has(key)) map.set(key, issue)
    })
    return map
  }, [issues])

  const visible = limit ? rows.slice(0, limit) : rows

  return (
    <div>
      <div className="max-h-96 overflow-auto rounded-lg border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              {COLUMNS.map(field => (
                <th
                  key={String(field)}
                  scope="col"
                  className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                >
                  {FIELD_LABEL[String(field)]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(row => (
              <tr key={row.id} className="even:bg-slate-50/60">
                {COLUMNS.map(field => {
                  const issue = highlightIssues
                    ? issueMap.get(`${row.id}:${String(field)}`)
                    : undefined
                  const style = issue ? ISSUE_MARK[issue.kind] : null
                  const text = formatCell(row, field)

                  return (
                    <td
                      key={String(field)}
                      className="whitespace-nowrap border-b border-slate-100 px-3 py-1.5 text-slate-700"
                    >
                      {style ? (
                        <span
                          title={issue!.reason}
                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${style.className}`}
                        >
                          <span aria-hidden className="font-bold">
                            {style.mark}
                          </span>
                          {text || '비어 있음'}
                          <span className="sr-only">
                            {style.name}: {issue!.reason}
                          </span>
                        </span>
                      ) : (
                        text
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {limit && rows.length > limit && (
        <p className="mt-2 text-xs text-slate-500">
          전체 {rows.length}줄 가운데 앞의 {limit}줄만 보여 주고 있습니다.
        </p>
      )}
    </div>
  )
}
