import type { ModuleResult } from './types'

/**
 * 스프레드시트 수식 주입 방지.
 * = + - @ 및 탭·캐리지리턴으로 시작하는 값은 Excel·Sheets가 수식으로 해석하므로
 * 앞에 작은따옴표를 붙여 문자열로 고정합니다.
 */
function neutralizeFormula(raw: string): string {
  return /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw
}

export function escapeCsvCell(value: unknown): string {
  const text = value == null ? '' : String(value)
  const safe = neutralizeFormula(text)
  return `"${safe.replace(/"/g, '""')}"`
}

export function toCsv(rows: Array<Record<string, unknown>>, columns?: string[]): string {
  if (rows.length === 0) return ''
  const keys = columns ?? Array.from(new Set(rows.flatMap(row => Object.keys(row))))
  const header = keys.map(escapeCsvCell).join(',')
  const body = rows.map(row => keys.map(key => escapeCsvCell(row[key])).join(','))
  // BOM을 붙여야 Excel에서 한글이 깨지지 않습니다.
  return `\uFEFF${[header, ...body].join('\r\n')}`
}

function todayStamp(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
}

/** 파일명에는 모듈 식별자와 날짜만 넣고 사용자 식별자는 넣지 않습니다. */
export function buildFileName(moduleId: string, extension: string): string {
  return `${moduleId}_${todayStamp()}.${extension}`
}

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadJson(moduleId: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  triggerDownload(blob, buildFileName(moduleId, 'json'))
}

export function downloadCsv(moduleId: string, rows: Array<Record<string, unknown>>, columns?: string[]): void {
  const blob = new Blob([toCsv(rows, columns)], { type: 'text/csv;charset=utf-8' })
  triggerDownload(blob, buildFileName(moduleId, 'csv'))
}

/** 공통 결과 스키마를 채워 주는 도우미 */
export function buildResult(
  base: Omit<ModuleResult, 'completedAt' | 'version'> & { version?: string }
): ModuleResult {
  return {
    version: base.version ?? '1.0.0',
    completedAt: new Date().toISOString(),
    moduleId: base.moduleId,
    moduleName: base.moduleName,
    difficulty: base.difficulty,
    inputs: base.inputs,
    observations: base.observations,
    metrics: base.metrics,
    reflection: base.reflection,
  }
}

/** 결과를 표 형태 CSV로 펼칩니다. 중첩 객체는 항목별 행으로 만듭니다. */
export function resultToCsvRows(result: ModuleResult): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = []
  const push = (group: string, source: Record<string, unknown>) => {
    Object.entries(source).forEach(([key, value]) => {
      rows.push({
        구분: group,
        항목: key,
        값: typeof value === 'object' && value !== null ? JSON.stringify(value) : value,
      })
    })
  }

  rows.push({ 구분: '기본', 항목: '모듈', 값: result.moduleName })
  rows.push({ 구분: '기본', 항목: '학습 방식', 값: result.difficulty })
  rows.push({ 구분: '기본', 항목: '완료 시각', 값: result.completedAt })
  push('선택', result.inputs)
  push('관찰', result.observations)
  push('지표', result.metrics)
  push('성찰', result.reflection)

  return rows
}

export function printReport(): void {
  window.print()
}
