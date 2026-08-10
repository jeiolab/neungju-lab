'use client'

import { useCallback, useMemo, useState } from 'react'
import { ThumbsDown, ThumbsUp, Minus } from 'lucide-react'
import {
  Button,
  Callout,
  ChoiceCard,
  ExplainBox,
  ModuleFrame,
  Panel,
  ReflectionPanel,
  ResultActions,
  StatCard,
  TermHelp,
  buildResult,
  downloadCsv,
  downloadJson,
  printReport,
  resultToCsvRows,
  RECOMMENDER_STAGE_GUIDES,
  RECOMMENDER_LEARNING,
  type Difficulty,
  type DifficultyCard,
  type ReflectionQuestion,
  type StageId,
} from '../_ai-lab-shared'
import {
  BUBBLE_MISSION,
  CONTENT_CATALOG,
  DATA_SEED,
  DATA_VERSION,
  METHOD_LABEL,
  MIN_RATINGS,
  PRIVACY_ITEMS,
  RATING_LABEL,
  TOP_N,
  VIRTUAL_USERS,
} from './data'
import {
  coldStartNote,
  computeMetrics,
  findNeighbors,
  isGenreConcentrated,
  likedGenreCounts,
  rankChanges,
  ratingCount,
  recommend,
  toPercent,
  userSimilarity,
} from './logic'
import type { RatingValue, RecommendMethod, RecommendMetrics, ScoredItem } from './types'

const MODULE_ID = '추천의-거울'
const MODULE_NAME = '추천의 거울'

const DIFFICULTY_CARDS: DifficultyCard[] = [
  {
    difficulty: 'beginner',
    summary: '콘텐츠 카드에 좋아요를 눌러 보고, 추천 목록이 어떻게 바뀌는지 관찰합니다.',
    points: ['카드 네 개 이상 평가하기', '추천 목록과 추천 이유 보기', '인기 기반 추천과 비교'],
    minutes: 15,
  },
  {
    difficulty: 'intermediate',
    summary: '추천 방식을 바꿔 가며 결과를 비교하고, 평가를 하나 지웠을 때 순위가 얼마나 흔들리는지 봅니다.',
    points: ['콘텐츠 기반과 협업 필터링 전환', '추천 이유의 데이터 근거 확인', '평가 편집 전후 순위 변화'],
    minutes: 25,
  },
  {
    difficulty: 'advanced',
    summary: '코사인 유사도와 다양성·새로움·커버리지를 함께 재고, 필터 버블을 줄이는 미션에 도전합니다.',
    points: ['이웃 수 k와 다양성 슬라이더 조절', '네 가지 지표 동시 비교', '콜드 스타트와 개인정보 최소화 활동'],
    minutes: 45,
  },
]

const REFLECTION_QUESTIONS: Record<Difficulty, ReflectionQuestion[]> = {
  beginner: [
    {
      id: 'mirror',
      prompt: '추천 목록은 내 취향을 비춘 걸까요, 아니면 만든 걸까요?',
      choices: ['내 평가를 비춘 목록이다', '목록이 내 취향을 만들었다', '둘 다 조금 섞여 있다'],
    },
    {
      id: 'learned',
      prompt: '인기 기반과 취향 기반 추천이 달랐던 이유를 한 문장으로 써 보세요.',
      sentences: 1,
      placeholder: '예) 인기 기반은 다들 보는 것을 올리고, 취향 기반은 ...',
    },
  ],
  intermediate: [
    {
      id: 'method',
      prompt: '콘텐츠 기반과 협업 필터링 중 어느 쪽 이유가 더 납득되었나요? 근거를 함께 써 보세요.',
      sentences: 2,
    },
    {
      id: 'edit',
      prompt: '평가를 하나 바꾸거나 지웠을 때 순위가 어떻게 달라졌나요?',
      sentences: 2,
    },
  ],
  advanced: [
    {
      id: 'tradeoff',
      prompt: '다양성을 높일 때 어떤 손해와 이익이 있었나요? 지표 숫자를 근거로 설명해 보세요.',
      sentences: 3,
    },
    {
      id: 'bubble',
      prompt: '필터 버블 미션에서 예상 선호도를 크게 낮추지 않으면서 다양성을 올린 방법을 적어 보세요.',
      sentences: 3,
    },
    {
      id: 'privacy',
      prompt: '추천에 꼭 필요한 정보와 없어도 되는 정보를 구분한 기준은 무엇인가요?',
      sentences: 2,
    },
  ],
}

const BEGINNER_STAGES: StageId[] = ['intro', 'explore', 'result', 'reflect']
const FULL_STAGES: StageId[] = ['intro', 'explore', 'challenge', 'result', 'reflect']

function RatingButtons({
  value,
  onChange,
}: {
  value: RatingValue | undefined
  onChange: (next: RatingValue) => void
}) {
  const options: Array<{ v: RatingValue; label: string; Icon: typeof ThumbsUp }> = [
    { v: 1, label: '좋아요', Icon: ThumbsUp },
    { v: 0, label: '보통', Icon: Minus },
    { v: -1, label: '싫어요', Icon: ThumbsDown },
  ]
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="평가">
      {options.map(({ v, label, Icon }) => {
        const selected = value === v
        return (
          <button
            key={v}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              selected
                ? v === 1
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : v === -1
                    ? 'border-rose-500 bg-rose-50 text-rose-800'
                    : 'border-slate-500 bg-slate-100 text-slate-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
            {selected && <span className="sr-only">(선택됨)</span>}
          </button>
        )
      })}
    </div>
  )
}

function RecommendExplainBox({
  difficulty,
  method,
  ratings,
  activeList,
  contentList,
  popularityList,
  genreCounts,
  concentrated,
  neighbors,
  metrics,
  diversity,
}: {
  difficulty: Difficulty
  method: RecommendMethod
  ratings: Record<string, RatingValue>
  activeList: ScoredItem[]
  contentList: ScoredItem[]
  popularityList: ScoredItem[]
  genreCounts: Record<string, number>
  concentrated: boolean
  neighbors: Array<{ userId: string; label: string; similarity: number; sharedCount: number }>
  metrics: RecommendMetrics
  diversity: number
}) {
  const liked = Object.entries(ratings).filter(([, v]) => v === 1)
  const topLikedGenre =
    Object.entries(genreCounts)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  const topRec = activeList[0]
  const sameTop =
    contentList[0] && popularityList[0] && contentList[0].item.id === popularityList[0].item.id

  if (difficulty === 'beginner') {
    return (
      <ExplainBox
        analogy="좋아하는 간식과 비슷한 맛을 더 권해 주는 것과 같습니다."
        steps={[
          liked.length > 0
            ? `좋아요 ${liked.length}개가 비슷한 장르·분위기의 카드를 위로 끌어올립니다.`
            : '좋아요를 누르면, 비슷한 장르·분위기의 카드가 위로 올라갑니다.',
          topRec
            ? `지금 1위는「${topRec.item.title}」(${topRec.item.genre})입니다.`
            : '추천 목록이 비어 있지 않은지 확인해 보세요.',
          sameTop
            ? '취향 기반과 인기 기반의 1위가 같습니다. 내가 좋아한 것이 다들 보는 것과 겹친 경우입니다.'
            : `인기 기반 1위는「${popularityList[0]?.item.title ?? '—'}」입니다. 취향 기반과 다르면, 내 평가가 목록을 바꿨다는 뜻입니다.`,
        ]}
        takeaway="좋아한 카드가 비슷한 콘텐츠를 끌어오고, 인기 기반은 내 취향 대신 ‘다들 보는 것’을 올립니다."
      />
    )
  }

  if (difficulty === 'intermediate') {
    const methodSteps =
      method === 'collaborative'
        ? [
            neighbors.length > 0
              ? `협업 필터링은「${neighbors[0].label}」처럼 나와 평가가 비슷한 이웃이 좋아한 것을 올립니다.`
              : '협업 필터링은 나와 평가가 비슷한 이웃이 좋아한 것을 올립니다. 이웃이 없으면 추천이 약해집니다.',
            topRec
              ? `지금 1위「${topRec.item.title}」은 이웃의 취향이 반영된 결과입니다.`
              : '이웃 평가가 부족하면 목록이 비거나 짧아질 수 있습니다.',
            '콘텐츠 기반으로 바꾸면, 이웃 대신 내가 좋아한 카드의 장르·분위기로 고릅니다.',
          ]
        : method === 'popularity'
          ? [
              '인기 기반은 내 평가를 거의 쓰지 않고, 전체 인기도만으로 순위를 매깁니다.',
              topRec
                ? `지금 1위「${topRec.item.title}」은 인기도가 높아서 올라온 것입니다.`
                : '인기 목록을 확인해 보세요.',
              '취향·협업 방식과 비교하면, 왜 목록이 달라지는지 더 잘 보입니다.',
            ]
          : [
              liked.length > 0
                ? `콘텐츠 기반은 내가 좋아한 ${liked.length}장의 장르·분위기와 비슷한 카드를 고릅니다.`
                : '콘텐츠 기반은 내가 좋아한 카드와 비슷한 장르·분위기를 고릅니다.',
              topLikedGenre
                ? `좋아요가 많은 장르는「${topLikedGenre}」입니다. 그래서 같은 맛이 위로 오기 쉽습니다.`
                : '좋아요 장르가 추천 순위를 끌어올립니다.',
              '협업 필터링으로 바꾸면, “나 같은 사람들”이 좋아한 것을 봅니다.',
            ]

    return (
      <ExplainBox
        analogy={
          method === 'collaborative'
            ? '취향이 비슷한 친구에게 “뭐 볼까?” 물어보는 것과 같습니다.'
            : method === 'popularity'
              ? '학교 게시판의 ‘인기글’만 모아서 보는 것과 같습니다.'
              : '좋아하는 간식과 비슷한 맛을 더 권해 주는 것과 같습니다.'
        }
        steps={methodSteps}
        takeaway={
          method === 'collaborative'
            ? '협업 필터링 = 나와 비슷한 사람들의 취향을 빌려 오는 방식입니다.'
            : method === 'popularity'
              ? '인기 기반은 취향 거울이 아니라, 많은 사람이 본 목록입니다.'
              : '콘텐츠 기반은 내가 좋아한 것과 비슷한 카드를 끌어올립니다.'
        }
      />
    )
  }

  return (
    <ExplainBox
      analogy="한 맛만 계속 시키면, 메뉴판도 그 맛만 보여 주기 쉽습니다. 그게 필터 버블입니다."
      steps={[
        concentrated && topLikedGenre
          ? `좋아요가「${topLikedGenre}」에 몰려 있습니다. 추천도 같은 맛으로 좁아질 수 있습니다.`
          : topLikedGenre
            ? `지금 좋아요가 많은 장르는「${topLikedGenre}」입니다.`
            : '좋아요 분포가 추천 폭을 바꿉니다.',
        `목록의 장르 다양성은 ${toPercent(metrics.diversity)}%, 예상 선호도는 ${toPercent(metrics.relevance)}%입니다.`,
        diversity > 0
          ? `다양성 슬라이더를 ${(diversity * 100).toFixed(0)}%로 올려, 새 장르를 조금 더 섞고 있습니다.`
          : method === 'collaborative' && neighbors.length > 0
            ? `이웃 ${neighbors.length}명의 취향도 목록에 섞입니다. 이웃이 비슷하면 버블이 더 굳어질 수 있습니다.`
            : '다양성 슬라이더를 올리거나 평가를 고르게 바꾸면, 한 맛만 보는 버블을 조금 풀 수 있습니다.',
      ]}
      takeaway="필터 버블은 ‘한 취향만 계속 보이는 상태’입니다. 비슷한 것만 좋아하면 목록도 좁아집니다."
    />
  )
}

function RecommendList({
  title,
  description,
  list,
  showEvidence,
  showSimilarity,
}: {
  title: string
  description?: string
  list: ScoredItem[]
  showEvidence?: boolean
  showSimilarity?: boolean
}) {
  return (
    <Panel title={title} description={description}>
      {list.length === 0 ? (
        <Callout tone="warn" title="추천할 카드가 없습니다">
          평가를 더 남기거나, 다른 추천 방식을 골라 보세요. 협업 필터링은 나와 비슷한 이웃이 있어야 합니다.
        </Callout>
      ) : (
        <ol className="space-y-3">
          {list.map((row, index) => (
            <li key={row.item.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    <span className="mr-2 tabular-nums text-primary">{index + 1}.</span>
                    {row.item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {row.item.genre} · {row.item.mood} · {row.item.lengthMin}분 · 인기도{' '}
                    {(row.item.popularity * 100).toFixed(0)}%
                  </p>
                </div>
                {showSimilarity && row.similarity != null && (
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums text-slate-700 ring-1 ring-slate-200">
                    점수 {row.similarity.toFixed(3)}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{row.reason}</p>
              {showEvidence && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-semibold text-primary">
                    데이터 근거 보기
                  </summary>
                  <ul className="mt-1.5 space-y-1 pl-1">
                    {row.evidence.map(line => (
                      <li key={line} className="text-xs leading-relaxed text-slate-600">
                        • {line}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [ratings, setRatings] = useState<Record<string, RatingValue>>({})
  const [method, setMethod] = useState<RecommendMethod>('content')
  const [k, setK] = useState(3)
  const [diversity, setDiversity] = useState(0)
  const [snapshot, setSnapshot] = useState<ScoredItem[] | null>(null)
  const [privacyGuess, setPrivacyGuess] = useState<Record<string, boolean | null>>({})
  const [reflection, setReflection] = useState<Record<string, string>>({})
  const [missionChecked, setMissionChecked] = useState(false)

  const handleReset = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setRatings({})
    setMethod(next === 'beginner' ? 'content' : 'content')
    setK(3)
    setDiversity(0)
    setSnapshot(null)
    setPrivacyGuess({})
    setReflection({})
    setMissionChecked(false)
  }, [])

  const handleRate = useCallback((id: string, value: RatingValue) => {
    setRatings(prev => {
      const next = { ...prev }
      if (next[id] === value) delete next[id]
      else next[id] = value
      return next
    })
    setSnapshot(null)
    setMissionChecked(false)
  }, [])

  const handleClearRating = useCallback((id: string) => {
    setRatings(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setSnapshot(null)
  }, [])

  const rated = ratingCount(ratings)
  const enough = rated >= MIN_RATINGS
  const cold = coldStartNote(ratings)
  const concentrated = isGenreConcentrated(ratings)

  const contentList = useMemo(
    () =>
      enough
        ? recommend('content', ratings, VIRTUAL_USERS, {
            k,
            diversity: difficulty === 'advanced' ? diversity : 0,
          })
        : [],
    [ratings, k, diversity, difficulty, enough]
  )

  const collabList = useMemo(
    () =>
      enough
        ? recommend('collaborative', ratings, VIRTUAL_USERS, {
            k,
            diversity: difficulty === 'advanced' ? diversity : 0,
          })
        : [],
    [ratings, k, diversity, difficulty, enough]
  )

  const popularityList = useMemo(
    () => recommend('popularity', ratings, VIRTUAL_USERS, { topN: TOP_N }),
    [ratings]
  )

  const activeList = useMemo(() => {
    if (difficulty === 'beginner') return contentList
    if (method === 'popularity') return popularityList
    if (method === 'collaborative') return collabList
    return contentList
  }, [difficulty, method, contentList, collabList, popularityList])

  const metrics = useMemo(() => computeMetrics(activeList), [activeList])
  const neighbors = useMemo(
    () => (enough ? findNeighbors(ratings, VIRTUAL_USERS, k) : []),
    [ratings, k, enough]
  )
  const changes = useMemo(
    () => (snapshot ? rankChanges(snapshot, activeList) : []),
    [snapshot, activeList]
  )
  const genreCounts = useMemo(() => likedGenreCounts(ratings), [ratings])

  const missionPass =
    metrics.relevance >= BUBBLE_MISSION.minRelevance &&
    metrics.diversity >= BUBBLE_MISSION.minDiversity

  const privacyScore = useMemo(() => {
    let correct = 0
    let answered = 0
    PRIVACY_ITEMS.forEach(item => {
      const guess = privacyGuess[item.id]
      if (guess == null) return
      answered += 1
      if (guess === item.needed) correct += 1
    })
    return { correct, answered, total: PRIVACY_ITEMS.length }
  }, [privacyGuess])

  const handleReflectionChange = useCallback((id: string, value: string) => {
    setReflection(prev => ({ ...prev, [id]: value }))
  }, [])

  const buildExport = useCallback(
    (current: Difficulty) =>
      buildResult({
        moduleId: MODULE_ID,
        moduleName: MODULE_NAME,
        difficulty: current,
        version: DATA_VERSION,
        inputs: {
          평가수: rated,
          추천방식: METHOD_LABEL[method],
          이웃수k: k,
          다양성슬라이더: diversity,
          평가목록: Object.entries(ratings).map(
            ([id, v]) => `${id}:${RATING_LABEL[String(v)]}`
          ),
          데이터seed: DATA_SEED,
        },
        observations: {
          추천목록: activeList.map(r => r.item.title),
          장르편중: concentrated,
          콜드스타트: cold,
          미션달성: current === 'advanced' ? missionPass : undefined,
          순위변화: changes.filter(c => c.beforeRank !== c.afterRank),
        },
        metrics: {
          예상선호도: toPercent(metrics.relevance),
          장르다양성: toPercent(metrics.diversity),
          새로움: toPercent(metrics.novelty),
          커버리지: toPercent(metrics.coverage),
          고유장르수: metrics.genreCount,
        },
        reflection,
      }),
    [
      rated,
      method,
      k,
      diversity,
      ratings,
      activeList,
      concentrated,
      cold,
      missionPass,
      changes,
      metrics,
      reflection,
    ]
  )

  const currentStage = useCallback(
    (current: Difficulty): StageId => {
      const answered = Object.values(reflection).some(value => value.trim().length > 0)
      if (answered) return 'reflect'
      if (!enough) return 'intro'
      if (current === 'beginner') return 'result'
      if (current === 'intermediate') {
        if (snapshot) return 'result'
        if (method !== 'content') return 'challenge'
        return 'explore'
      }
      if (missionChecked || diversity > 0) return missionPass ? 'result' : 'challenge'
      return 'explore'
    },
    [reflection, enough, snapshot, method, missionChecked, diversity, missionPass]
  )

  return (
    <ModuleFrame
      moduleName={MODULE_NAME}
      question="추천 목록은 내 취향을 비춘 걸까, 아니면 내 취향을 만든 걸까?"
      cards={DIFFICULTY_CARDS}
      stages={difficulty === 'beginner' ? BEGINNER_STAGES : FULL_STAGES}
      currentStage={currentStage(difficulty)}
      stageGuides={RECOMMENDER_STAGE_GUIDES}
      learningSupport={RECOMMENDER_LEARNING}
      notice={`가상의 사용자 U01~U12와 창작 콘텐츠 카드만 사용합니다(seed ${DATA_SEED}). 실제 계정이나 시청 기록은 입력받지 않습니다.`}
      onReset={handleReset}
      onDifficultyChange={setDifficulty}
    >
      {current => (
        <div className="space-y-4">
          <Panel
            title="1. 콘텐츠 카드 평가하기"
            description={`최소 ${MIN_RATINGS}장을 평가하면 추천이 열립니다. 지금 ${rated}장 평가함.`}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CONTENT_CATALOG.map(item => (
                <article
                  key={item.id}
                  className={`rounded-lg border p-3 ${
                    ratings[item.id] != null
                      ? 'border-primary/40 bg-blue-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.blurb}</p>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {item.genre} · {item.mood} · {item.lengthMin}분 · {item.year}
                  </p>
                  <div className="mt-2.5">
                    <RatingButtons
                      value={ratings[item.id]}
                      onChange={value => handleRate(item.id, value)}
                    />
                  </div>
                  {current !== 'beginner' && ratings[item.id] != null && (
                    <button
                      type="button"
                      onClick={() => handleClearRating(item.id)}
                      className="mt-2 text-xs font-medium text-slate-500 underline-offset-2 hover:underline"
                    >
                      이 평가 지우기
                    </button>
                  )}
                </article>
              ))}
            </div>

            {concentrated && (
              <div className="mt-3">
                <Callout tone="warn" title="한 장르에 좋아요가 몰려 있습니다">
                  좋아요 분포:{' '}
                  {Object.entries(genreCounts)
                    .filter(([, n]) => n > 0)
                    .map(([g, n]) => `${g} ${n}`)
                    .join(', ')}
                  . 이런 평가가 쌓이면 추천도 같은 장르로 좁아질 수 있습니다.
                </Callout>
              </div>
            )}
            {cold && (
              <div className="mt-3">
                <Callout tone="info" title="콜드 스타트">
                  {cold}
                </Callout>
              </div>
            )}
          </Panel>

          {!enough ? (
            <Callout tone="info" title="평가를 더 남겨 주세요">
              {MIN_RATINGS - rated}장을 더 평가하면 추천 목록과 비교 화면이 열립니다.
            </Callout>
          ) : (
            <>
              {current !== 'beginner' && (
                <Panel
                  title="2. 추천 방식 고르기"
                  description="방식마다 쓰는 데이터가 다릅니다. 정답이 아니라 비교용입니다."
                >
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(
                      [
                        ['content', '내가 좋아한 카드의 장르·분위기와 비슷한 것을 고릅니다.'],
                        [
                          'collaborative',
                          '나와 평가가 비슷한 가상 이웃이 좋아한 것을 고릅니다.',
                        ],
                        ['popularity', '개인 취향 대신 전체 인기도만 봅니다.'],
                      ] as const
                    ).map(([id, desc]) => (
                      <ChoiceCard
                        key={id}
                        selected={method === id}
                        title={METHOD_LABEL[id]}
                        description={desc}
                        onClick={() => {
                          setMethod(id)
                          setMissionChecked(false)
                        }}
                      />
                    ))}
                  </div>

                  {current === 'advanced' && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm">
                        <span className="font-semibold text-slate-800">
                          <TermHelp term="이웃 수 k">
                            나와 평가가 비슷한 가상 사용자를 몇 명까지 볼지입니다. k가 작으면
                            소수의 강한 이웃만, 크면 더 많은 이웃의 의견을 섞습니다.
                          </TermHelp>
                        </span>
                        <span className="ml-2 tabular-nums text-slate-600">{k}</span>
                        <input
                          type="range"
                          min={1}
                          max={6}
                          step={1}
                          value={k}
                          onChange={e => setK(Number(e.target.value))}
                          className="mt-2 w-full"
                          aria-valuetext={`이웃 ${k}명`}
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="font-semibold text-slate-800">
                          <TermHelp term="다양성 슬라이더">
                            관련성(점수)과 새 장르 탐색을 섞는 교육용 조절입니다. 실제 플랫폼의
                            내부 알고리즘 전체를 재현하지는 않습니다.
                          </TermHelp>
                        </span>
                        <span className="ml-2 tabular-nums text-slate-600">
                          {(diversity * 100).toFixed(0)}%
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={diversity}
                          onChange={e => {
                            setDiversity(Number(e.target.value))
                            setMissionChecked(false)
                          }}
                          className="mt-2 w-full"
                          aria-valuetext={`다양성 가중치 ${(diversity * 100).toFixed(0)}퍼센트`}
                        />
                        <span className="mt-1 flex justify-between text-[11px] text-slate-500">
                          <span>관련성 중심</span>
                          <span>탐색 중심</span>
                        </span>
                      </label>
                    </div>
                  )}
                </Panel>
              )}

              <RecommendList
                title={
                  current === 'beginner'
                    ? '내 취향 기반 추천 (콘텐츠 기반)'
                    : `${METHOD_LABEL[method]} 추천`
                }
                description="추천 점수는 ‘객관적 품질’이 아니라, 이 실험의 계산 결과입니다."
                list={activeList}
                showEvidence={current !== 'beginner'}
                showSimilarity={current === 'advanced'}
              />

              {current === 'beginner' && (
                <RecommendList
                  title="인기 기반 추천 (비교)"
                  description="개인 취향을 쓰지 않고 인기도만으로 올린 목록입니다."
                  list={popularityList}
                />
              )}

              {current === 'beginner' && (
                <Panel title="한눈에 비교">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <caption className="mb-2 text-left text-xs text-slate-600">
                        같은 순위의 카드가 방식마다 어떻게 다른지 봅니다.
                      </caption>
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                          >
                            순위
                          </th>
                          <th
                            scope="col"
                            className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                          >
                            취향 기반
                          </th>
                          <th
                            scope="col"
                            className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700"
                          >
                            인기 기반
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: TOP_N }).map((_, i) => (
                          <tr key={i}>
                            <td className="border-b border-slate-100 px-3 py-2 tabular-nums text-slate-600">
                              {i + 1}
                            </td>
                            <td className="border-b border-slate-100 px-3 py-2 text-slate-800">
                              {contentList[i]?.item.title ?? '—'}
                            </td>
                            <td className="border-b border-slate-100 px-3 py-2 text-slate-800">
                              {popularityList[i]?.item.title ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              )}

              {activeList.length > 0 && (
                <RecommendExplainBox
                  difficulty={current}
                  method={method}
                  ratings={ratings}
                  activeList={activeList}
                  contentList={contentList}
                  popularityList={popularityList}
                  genreCounts={genreCounts}
                  concentrated={concentrated}
                  neighbors={neighbors}
                  metrics={metrics}
                  diversity={diversity}
                />
              )}

              {current !== 'beginner' && (
                <Panel
                  title="평가 편집 실험"
                  description="지금 목록을 기억해 둔 뒤 평가를 바꾸고, 순위가 어떻게 흔들리는지 봅니다."
                >
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      onClick={() => setSnapshot(activeList.map(row => ({ ...row })))}
                    >
                      현재 순위 기억하기
                    </Button>
                    <Button
                      onClick={() => {
                        const liked = Object.entries(ratings).find(([, v]) => v === 1)
                        if (liked) handleClearRating(liked[0])
                      }}
                    >
                      좋아요 하나 지우기
                    </Button>
                    <Button
                      onClick={() => {
                        const popular = [...CONTENT_CATALOG].sort(
                          (a, b) => b.popularity - a.popularity
                        )[0]
                        if (popular) handleRate(popular.id, 1)
                      }}
                    >
                      인기작에 좋아요 추가
                    </Button>
                    {snapshot && (
                      <Button variant="ghost" onClick={() => setSnapshot(null)}>
                        기억 지우기
                      </Button>
                    )}
                  </div>

                  {snapshot && changes.length > 0 && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr>
                            <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold">
                              콘텐츠
                            </th>
                            <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold">
                              이전 순위
                            </th>
                            <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold">
                              지금 순위
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {changes
                            .filter(c => c.beforeRank !== c.afterRank)
                            .slice(0, 8)
                            .map(c => (
                              <tr key={c.id}>
                                <td className="border-b border-slate-100 px-3 py-2">{c.title}</td>
                                <td className="border-b border-slate-100 px-3 py-2 tabular-nums">
                                  {c.beforeRank ?? '밖'}
                                </td>
                                <td className="border-b border-slate-100 px-3 py-2 tabular-nums">
                                  {c.afterRank ?? '밖'}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {changes.every(c => c.beforeRank === c.afterRank) && (
                        <p className="mt-2 text-xs text-slate-500">
                          아직 순위가 바뀌지 않았습니다. 평가를 하나 더 지워 보세요.
                        </p>
                      )}
                    </div>
                  )}
                </Panel>
              )}

              {current === 'advanced' && (
                <>
                  <Panel
                    title="추천 지표"
                    description="교육용 지표입니다. 실제 플랫폼의 내부 점수와 같다고 보지 마세요."
                  >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <StatCard
                        label="예상 선호도"
                        value={toPercent(metrics.relevance)}
                        unit="%"
                        hint="목록 점수를 0~100으로 접은 평균"
                        tone={metrics.relevance >= BUBBLE_MISSION.minRelevance ? 'good' : 'warn'}
                      />
                      <StatCard
                        label="장르 다양성"
                        value={toPercent(metrics.diversity)}
                        unit="%"
                        hint={`고유 장르 ${metrics.genreCount}개 / ${activeList.length}장`}
                        tone={metrics.diversity >= BUBBLE_MISSION.minDiversity ? 'good' : 'warn'}
                      />
                      <StatCard
                        label="새로움"
                        value={toPercent(metrics.novelty)}
                        unit="%"
                        hint="인기도 50% 미만 카드 비율"
                      />
                      <StatCard
                        label="커버리지"
                        value={toPercent(metrics.coverage)}
                        unit="%"
                        hint={`전체 ${CONTENT_CATALOG.length}장 중 상위 ${activeList.length}장`}
                      />
                    </div>
                  </Panel>

                  <Panel title="이웃과의 코사인 유사도">
                    <p className="mb-3 text-sm text-slate-600">
                      <TermHelp term="코사인 유사도">
                        두 벡터가 가리키는 방향이 얼마나 비슷한지를 재는 값입니다. 1에 가까울수록
                        방향이 비슷하고, 0이면 서로 직각에 가깝습니다. 사람 전체가 비슷하다는 뜻이
                        아닙니다.
                      </TermHelp>
                      를 이웃 사용자 평점 벡터에 적용한 결과입니다.
                    </p>
                    {neighbors.length === 0 ? (
                      <Callout tone="warn">
                        공통 평가가 충분한 이웃이 없습니다. 평가를 더 남기거나 k를 조절해 보세요.
                      </Callout>
                    ) : (
                      <ul className="space-y-2">
                        {neighbors.map(n => (
                          <li
                            key={n.userId}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            <span className="font-medium text-slate-800">
                              {n.userId} · {n.label}
                            </span>
                            <span className="tabular-nums text-slate-600">
                              유사도 {n.similarity.toFixed(3)} · 공통 {n.sharedCount}개
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {Object.keys(ratings).length >= 2 && VIRTUAL_USERS[0] && (
                      <p className="mt-3 text-xs text-slate-500">
                        예시: 나와 {VIRTUAL_USERS[0].label}의 유사도{' '}
                        {userSimilarity(ratings, VIRTUAL_USERS[0].ratings).similarity.toFixed(3)} (
                        공통 {userSimilarity(ratings, VIRTUAL_USERS[0].ratings).sharedCount}개)
                      </p>
                    )}
                  </Panel>

                  <Panel
                    title="필터 버블 미션"
                    description={`예상 선호도 ${toPercent(BUBBLE_MISSION.minRelevance)}% 이상을 유지하면서 장르 다양성 ${toPercent(BUBBLE_MISSION.minDiversity)}% 이상으로 올려 보세요.`}
                  >
                    <p className="text-sm leading-relaxed text-slate-700">
                      한 장르만 집중해서 평가하면 추천도 좁아질 수 있습니다. 평가를 고르게 바꾸거나
                      다양성 슬라이더를 조금 올려 보세요. 필터 버블은 특정 알고리즘 하나만의 문제는
                      아닙니다.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button variant="primary" onClick={() => setMissionChecked(true)}>
                        미션 결과 확인
                      </Button>
                      {missionChecked && (
                        <span
                          className={`text-sm font-semibold ${
                            missionPass ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {missionPass
                            ? '목표를 달성했습니다. 선호도와 다양성을 함께 챙겼습니다.'
                            : `아직입니다. 선호도 ${toPercent(metrics.relevance)}%, 다양성 ${toPercent(metrics.diversity)}%.`}
                        </span>
                      )}
                    </div>
                  </Panel>

                  <Panel
                    title="개인정보 최소화"
                    description="추천에 꼭 필요한 정보인지 골라 보세요. 정답을 맞히는 활동이 아니라 기준을 말해 보는 활동입니다."
                  >
                    <ul className="space-y-2">
                      {PRIVACY_ITEMS.map(item => {
                        const guess = privacyGuess[item.id]
                        return (
                          <li
                            key={item.id}
                            className="rounded-lg border border-slate-200 bg-white p-3"
                          >
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Button
                                variant={guess === true ? 'primary' : 'secondary'}
                                onClick={() =>
                                  setPrivacyGuess(prev => ({ ...prev, [item.id]: true }))
                                }
                              >
                                필요함
                              </Button>
                              <Button
                                variant={guess === false ? 'primary' : 'secondary'}
                                onClick={() =>
                                  setPrivacyGuess(prev => ({ ...prev, [item.id]: false }))
                                }
                              >
                                불필요
                              </Button>
                            </div>
                            {guess != null && (
                              <p
                                className={`mt-2 text-xs ${
                                  guess === item.needed ? 'text-emerald-700' : 'text-amber-700'
                                }`}
                              >
                                {guess === item.needed ? '분류가 일치합니다. ' : '다른 관점도 가능합니다. '}
                                {item.hint}
                              </p>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                    {privacyScore.answered > 0 && (
                      <p className="mt-3 text-xs text-slate-500">
                        {privacyScore.answered}개 중 안내와 일치한 분류 {privacyScore.correct}개
                      </p>
                    )}
                  </Panel>
                </>
              )}

              {current === 'intermediate' && method === 'collaborative' && neighbors.length > 0 && (
                <Panel title="지금 쓰인 이웃">
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {neighbors.map(n => (
                      <li key={n.userId}>
                        {n.label} — 유사도 {n.similarity.toFixed(2)}, 공통 평가 {n.sharedCount}개
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
            </>
          )}

          <ReflectionPanel
            difficulty={current}
            questions={REFLECTION_QUESTIONS[current]}
            answers={reflection}
            onChange={handleReflectionChange}
          />

          <Panel title="결과 저장하기">
            <ResultActions
              onDownloadJson={() => downloadJson(MODULE_ID, buildExport(current))}
              onDownloadCsv={() => downloadCsv(MODULE_ID, resultToCsvRows(buildExport(current)))}
              onPrint={printReport}
              disabled={!enough}
              disabledReason={`${MIN_RATINGS}장 이상 평가한 뒤 저장할 수 있습니다.`}
            />
          </Panel>
        </div>
      )}
    </ModuleFrame>
  )
}
