'use client'

import { StatCard, TermHelp } from '../../_ai-lab-shared'
import type { Difficulty } from '../../_ai-lab-shared'
import { toPercent } from '../logic'
import type { Metrics } from '../types'

function ConfusionTable({ metrics }: { metrics: Metrics }) {
  const { matrix } = metrics

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="mb-2 text-left text-xs text-slate-600">
          가로는 인공지능의 판단, 세로는 실제 기록입니다. 대각선(왼쪽 위와 오른쪽 아래)에 있는 수가 맞힌 개수입니다.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
              　
            </th>
            <th scope="col" className="border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
              AI 판단: 추천
            </th>
            <th scope="col" className="border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
              AI 판단: 보류
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="border border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-bold text-slate-700">
              실제: 추천
            </th>
            <td className="border border-slate-200 bg-emerald-50 px-3 py-2 text-center font-bold tabular-nums text-emerald-800">
              {matrix.truePositive}
              <span className="ml-1 text-xs font-normal">맞힘</span>
            </td>
            <td className="border border-slate-200 px-3 py-2 text-center font-bold tabular-nums text-rose-700">
              {matrix.falseNegative}
              <span className="ml-1 text-xs font-normal">놓침</span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="border border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-bold text-slate-700">
              실제: 보류
            </th>
            <td className="border border-slate-200 px-3 py-2 text-center font-bold tabular-nums text-rose-700">
              {matrix.falsePositive}
              <span className="ml-1 text-xs font-normal">잘못 추천</span>
            </td>
            <td className="border border-slate-200 bg-emerald-50 px-3 py-2 text-center font-bold tabular-nums text-emerald-800">
              {matrix.trueNegative}
              <span className="ml-1 text-xs font-normal">맞힘</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default function MetricsView({
  difficulty,
  metrics,
  compareWith,
}: {
  difficulty: Difficulty
  metrics: Metrics
  /** 비교 대상이 있으면 변화량을 함께 보여 줍니다. */
  compareWith?: Metrics | null
}) {
  const accuracyDelta = compareWith ? toPercent(metrics.accuracy - compareWith.accuracy) : null

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="정확도"
          value={toPercent(metrics.accuracy)}
          unit="%"
          hint={`${metrics.total}명 중 ${metrics.correct}명을 맞혔습니다.${
            accuracyDelta !== null
              ? ` 처음보다 ${accuracyDelta > 0 ? '+' : ''}${accuracyDelta}%p`
              : ''
          }`}
          tone={metrics.accuracy >= 0.8 ? 'good' : metrics.accuracy >= 0.6 ? 'neutral' : 'warn'}
        />

        {difficulty !== 'beginner' && (
          <StatCard
            label="재현율"
            value={toPercent(metrics.recall)}
            unit="%"
            hint="실제로 추천해야 할 학생 중 몇 명을 찾아냈는지"
            tone={metrics.recall >= 0.8 ? 'good' : 'neutral'}
          />
        )}

        {difficulty === 'advanced' && (
          <>
            <StatCard
              label="정밀도"
              value={toPercent(metrics.precision)}
              unit="%"
              hint="추천이라고 판단한 것 중 실제로 맞은 비율"
            />
            <StatCard
              label="그룹 간 재현율 격차"
              value={toPercent(metrics.recallGap)}
              unit="%p"
              hint="0에 가까울수록 두 그룹을 비슷하게 대우한 것입니다."
              tone={metrics.recallGap <= 0.15 ? 'good' : 'warn'}
            />
          </>
        )}
      </div>

      {difficulty !== 'beginner' && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-bold text-slate-900">그룹별로 놓친 학생 수</h4>
          <p className="mb-3 text-xs leading-relaxed text-slate-600">
            추천했어야 하는데 인공지능이 보류로 판단한 학생 수입니다. 전체 정확도가 같아도 어느 그룹에서 놓쳤는지는
            다를 수 있습니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['A', 'B'] as const).map(group => {
              const { missed, shouldRecommend } = metrics.missedByGroup[group]
              return (
                <StatCard
                  key={group}
                  label={`${group} 그룹에서 놓친 학생`}
                  value={missed}
                  unit="명"
                  hint={`추천했어야 할 ${shouldRecommend}명 중 ${missed}명을 놓쳤습니다.`}
                  tone={missed === 0 ? 'good' : missed > shouldRecommend / 2 ? 'warn' : 'neutral'}
                />
              )
            })}
          </div>
        </div>
      )}

      {difficulty !== 'beginner' && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-bold text-slate-900">
            <TermHelp term="혼동행렬">
              인공지능의 판단과 실제 결과를 네 칸으로 나눠 정리한 표입니다. 어떤 종류의 실수를 했는지 알 수 있습니다.
            </TermHelp>
          </h4>
          <ConfusionTable metrics={metrics} />
        </div>
      )}

      {difficulty === 'advanced' && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-bold text-slate-900">그룹별로 나눠 본 성능</h4>
          <table className="w-full border-collapse text-sm">
            <caption className="mb-2 text-left text-xs text-slate-600">
              전체 정확도가 높아도 특정 그룹에서만 낮을 수 있습니다. 반드시 나눠서 확인하세요.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700">
                  그룹
                </th>
                <th scope="col" className="border-b border-slate-200 px-3 py-2 text-right text-xs font-bold text-slate-700">
                  재현율
                </th>
              </tr>
            </thead>
            <tbody>
              {(['A', 'B'] as const).map(group => (
                <tr key={group}>
                  <th scope="row" className="border-b border-slate-100 px-3 py-2 text-left font-medium text-slate-700">
                    {group} 그룹
                  </th>
                  <td className="border-b border-slate-100 px-3 py-2 text-right font-bold tabular-nums text-slate-900">
                    {toPercent(metrics.recallByGroup[group])}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 rounded-md bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-600">
            두 그룹의 재현율이 같아졌다고 해서 공정한 모델이 되었다고 단정할 수는 없습니다. 공정성은 지표 하나로 정의되지 않으며,
            무엇을 공정하다고 볼지는 상황과 사람에 따라 다릅니다.
          </p>
        </div>
      )}
    </div>
  )
}
