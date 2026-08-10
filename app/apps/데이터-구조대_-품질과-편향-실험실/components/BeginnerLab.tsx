'use client'

import { useMemo } from 'react'
import { Play } from 'lucide-react'
import { Button, Callout, ExplainBox, Panel, StatCard } from '../../_ai-lab-shared'
import { detectQuality, evaluate, knnPredict, toPercent } from '../logic'
import type { Student } from '../types'
import DataTable, { IssueLegend } from './DataTable'

type DatasetKey = 'clean' | 'messy'

const DATASET_LABEL: Record<DatasetKey, string> = {
  clean: '잘 정리된 데이터',
  messy: '문제가 섞인 데이터',
}

export default function BeginnerLab({
  cleanRows,
  messyRows,
  testRows,
  ranSets,
  onRun,
}: {
  cleanRows: Student[]
  messyRows: Student[]
  testRows: Student[]
  ranSets: DatasetKey[]
  onRun: (key: DatasetKey) => void
}) {
  const results = useMemo(() => {
    const run = (rows: Student[]) => evaluate(testRows, knnPredict(rows, testRows, 3, false))
    return { clean: run(cleanRows), messy: run(messyRows) }
  }, [cleanRows, messyRows, testRows])

  const messyQuality = useMemo(() => detectQuality(messyRows), [messyRows])

  const bothDone = ranSets.includes('clean') && ranSets.includes('messy')
  const gap = toPercent(results.clean.accuracy - results.messy.accuracy)

  return (
    <div className="space-y-4">
      <Panel
        title="1단계. 같은 인공지능에게 서로 다른 데이터를 주기"
        description="두 데이터는 크기도, 문제도 같은 곳에서 왔습니다. 다른 점은 정리가 되어 있느냐뿐입니다."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {(['clean', 'messy'] as const).map(key => {
            const done = ranSets.includes(key)
            const rows = key === 'clean' ? cleanRows : messyRows
            return (
              <div
                key={key}
                className={`rounded-lg border p-4 ${
                  done ? 'border-primary bg-blue-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <h4 className="text-sm font-bold text-slate-900">{DATASET_LABEL[key]}</h4>
                <p className="mt-1 text-xs text-slate-600">
                  {key === 'clean'
                    ? `${rows.length}줄이 빠짐없이 채워져 있습니다.`
                    : `${rows.length}줄 가운데 빈칸 ${messyQuality.missingCount}개, 이상한 값 ${messyQuality.outlierCount}개가 있습니다.`}
                </p>
                <Button
                  variant={done ? 'secondary' : 'primary'}
                  className="mt-3 w-full"
                  onClick={() => onRun(key)}
                >
                  <Play className="h-4 w-4" aria-hidden />
                  {done ? '다시 배우게 하기' : '이 데이터로 배우게 하기'}
                </Button>

                {done && (
                  <div className="mt-3">
                    <StatCard
                      label="시험 성적"
                      value={toPercent(results[key].accuracy)}
                      unit="%"
                      hint={`처음 보는 학생 ${results[key].total}명 중 ${results[key].correct}명을 맞혔습니다.`}
                      tone={results[key].accuracy >= 0.8 ? 'good' : 'warn'}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!bothDone && (
          <p className="mt-3 text-xs text-slate-500">
            두 버튼을 모두 눌러야 비교할 수 있습니다.
          </p>
        )}
      </Panel>

      {bothDone && (
        <Panel title="2단계. 무엇이 달랐을까?">
          <Callout tone={gap > 0 ? 'warn' : 'info'}>
            {gap > 0 ? (
              <>
                잘 정리된 데이터로 배운 인공지능이 <strong>{gap}%p 더 잘 맞혔습니다.</strong> 알고리즘은 똑같았고
                바뀐 것은 데이터뿐입니다.
              </>
            ) : (
              <>
                이번에는 두 결과의 차이가 크지 않았습니다. 데이터의 문제가 언제나 성적을 크게 떨어뜨리는 것은 아닙니다.
                어떤 문제가 어디에 있었는지 아래 표에서 확인해 보세요.
              </>
            )}
          </Callout>

          <div className="mt-4">
            <ExplainBox
              analogy="시험 공부할 때 문제집에 빈칸·오타가 많으면, 실력 있는 친구도 헷갈려서 틀리기 쉽습니다."
              steps={[
                '이 인공지능은 “비슷한 학생을 찾아 물어보는” 방식으로 배웁니다.',
                `문제가 섞인 데이터에는 빈칸 ${messyQuality.missingCount}개, 이상한 값 ${messyQuality.outlierCount}개가 있어 비슷한 학생을 잘못 고를 수 있습니다.`,
                gap > 0
                  ? `그래서 정리된 데이터 정확도 ${toPercent(results.clean.accuracy)}%가, 문제 있는 데이터 ${toPercent(results.messy.accuracy)}%보다 ${gap}%p 높게 나왔습니다.`
                  : '이번엔 차이가 작았지만, 빈칸·이상한 값이 있으면 이웃을 잘못 고를 위험이 커집니다.',
              ]}
              takeaway="프로그램이 같아도, 배우는 데이터가 지저분하면 시험 성적이 떨어질 수 있습니다."
            />
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-900">문제가 섞인 데이터 살펴보기</h4>
              <IssueLegend kinds={['missing', 'outlier']} />
            </div>
            <DataTable
              rows={messyRows}
              issues={messyQuality.issues.filter(
                issue => issue.kind === 'missing' || issue.kind === 'outlier'
              )}
              limit={12}
              caption="문제가 섞인 훈련 데이터. 빈칸과 범위를 벗어난 값이 표시되어 있습니다."
            />
            <p className="text-xs leading-relaxed text-slate-600">
              참여 가능 시간이 99시간인 학생이 보이나요? 일주일은 168시간이니 불가능한 값은 아니지만, 이 자료에서
              적어 내도록 한 범위는 1~9시간이었습니다. 이렇게 범위를 벗어난 값을 <strong>이상값</strong>이라고 합니다.
            </p>
          </div>
        </Panel>
      )}
    </div>
  )
}
