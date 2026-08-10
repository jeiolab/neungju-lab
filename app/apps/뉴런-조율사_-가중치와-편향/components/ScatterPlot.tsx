'use client'

import { LABEL_COLOR } from '../data'
import { decisionBoundarySegment, predictStep } from '../logic'
import type { SamplePoint, Weights } from '../types'

export interface PlotBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/**
 * 2D 산점도와 결정 경계 직선.
 * SVG만 쓰며 외부 차트 라이브러리에 의존하지 않습니다.
 */
export default function ScatterPlot({
  points,
  weights,
  bounds,
  highlightId,
  showPredictions = false,
  title,
  height = 280,
}: {
  points: SamplePoint[]
  weights: Weights
  bounds: PlotBounds
  highlightId?: string | null
  /** true면 틀린 점에 × 표시 */
  showPredictions?: boolean
  title?: string
  height?: number
}) {
  const pad = { left: 40, right: 16, top: 16, bottom: 36 }
  const width = 420
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const sx = (x: number) => pad.left + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * innerW
  const sy = (y: number) => pad.top + ((bounds.maxY - y) / (bounds.maxY - bounds.minY)) * innerH

  const segment = decisionBoundarySegment(weights, bounds)

  // 양성 쪽(예측 1)을 옅게 칠하기 위한 반평면 힌트: 선 법선 방향 샘플
  const positiveHint = (() => {
    if (!segment) return null
    const mx = (segment.x1 + segment.x2) / 2
    const my = (segment.y1 + segment.y2) / 2
    const probe = predictStep(weights, mx + 0.15, my + 0.15)
    return probe === 1 ? 'right' : 'left'
  })()

  const ticksX = niceTicks(bounds.minX, bounds.maxX, 5)
  const ticksY = niceTicks(bounds.minY, bounds.maxY, 5)

  return (
    <div className="overflow-x-auto">
      {title && <p className="mb-1 text-xs font-semibold text-slate-600">{title}</p>}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="입력 공간의 점과 결정 경계 직선"
        className="mx-auto h-auto w-full max-w-md"
      >
        <rect x={0} y={0} width={width} height={height} fill="#f8fafc" rx={8} />

        {/* 격자 */}
        {ticksX.map(t => (
          <line
            key={`vx-${t}`}
            x1={sx(t)}
            y1={pad.top}
            x2={sx(t)}
            y2={pad.top + innerH}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}
        {ticksY.map(t => (
          <line
            key={`hy-${t}`}
            x1={pad.left}
            y1={sy(t)}
            x2={pad.left + innerW}
            y2={sy(t)}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}

        {/* 축 */}
        <line
          x1={pad.left}
          y1={pad.top + innerH}
          x2={pad.left + innerW}
          y2={pad.top + innerH}
          stroke="#94a3b8"
          strokeWidth={1.5}
        />
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + innerH}
          stroke="#94a3b8"
          strokeWidth={1.5}
        />

        {ticksX.map(t => (
          <text
            key={`tx-${t}`}
            x={sx(t)}
            y={height - 12}
            textAnchor="middle"
            className="fill-slate-500"
            fontSize={10}
          >
            {formatTick(t)}
          </text>
        ))}
        {ticksY.map(t => (
          <text
            key={`ty-${t}`}
            x={pad.left - 8}
            y={sy(t) + 3}
            textAnchor="end"
            className="fill-slate-500"
            fontSize={10}
          >
            {formatTick(t)}
          </text>
        ))}

        <text x={pad.left + innerW / 2} y={height - 2} textAnchor="middle" fontSize={11} className="fill-slate-600">
          x₁
        </text>
        <text
          x={12}
          y={pad.top + innerH / 2}
          textAnchor="middle"
          fontSize={11}
          className="fill-slate-600"
          transform={`rotate(-90 12 ${pad.top + innerH / 2})`}
        >
          x₂
        </text>

        {/* 결정 경계 */}
        {segment && (
          <g>
            <line
              x1={sx(segment.x1)}
              y1={sy(segment.y1)}
              x2={sx(segment.x2)}
              y2={sy(segment.y2)}
              stroke="#0f766e"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <title>결정 경계: w₁x₁ + w₂x₂ + b = 0</title>
          </g>
        )}

        {/* 점 */}
        {points.map(p => {
          const pred = predictStep(weights, p.x1, p.x2)
          const wrong = showPredictions && pred !== p.label
          const highlighted = highlightId === p.id
          const r = highlighted ? 7 : 5.5
          return (
            <g key={p.id}>
              <circle
                cx={sx(p.x1)}
                cy={sy(p.x2)}
                r={r}
                fill={LABEL_COLOR[p.label].fill}
                stroke={highlighted ? '#0f172a' : '#fff'}
                strokeWidth={highlighted ? 2 : 1.5}
                opacity={0.92}
              >
                <title>{`${p.id}: (${p.x1.toFixed(2)}, ${p.x2.toFixed(2)}) 정답 ${p.label}${
                  showPredictions ? ` / 예측 ${pred}` : ''
                }`}</title>
              </circle>
              {wrong && (
                <text
                  x={sx(p.x1)}
                  y={sy(p.x2) + 3.5}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill="#fff"
                  aria-hidden
                >
                  ×
                </text>
              )}
            </g>
          )
        })}

        {!segment && (
          <text
            x={pad.left + innerW / 2}
            y={pad.top + 14}
            textAnchor="middle"
            fontSize={11}
            className="fill-amber-700"
          >
            가중치가 모두 0에 가까워 경계를 그릴 수 없습니다
          </text>
        )}

        {segment && positiveHint && (
          <text
            x={pad.left + innerW - 4}
            y={pad.top + 12}
            textAnchor="end"
            fontSize={10}
            className="fill-teal-800"
          >
            초록 선 = 결정 경계
          </text>
        )}
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: LABEL_COLOR[0].fill }} />
          {LABEL_COLOR[0].name}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: LABEL_COLOR[1].fill }} />
          {LABEL_COLOR[1].name}
        </span>
        {showPredictions && (
          <span className="text-slate-500">× 표시 = 현재 가중치로 틀린 점</span>
        )}
      </div>
    </div>
  )
}

function niceTicks(min: number, max: number, count: number): number[] {
  const step = (max - min) / (count - 1)
  const ticks: number[] = []
  for (let i = 0; i < count; i += 1) {
    ticks.push(Math.round((min + step * i) * 100) / 100)
  }
  return ticks
}

function formatTick(v: number): string {
  if (Math.abs(v) < 1e-9) return '0'
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}
