/**
 * 8개 앱별 학습 지원 콘텐츠 (용어·힌트·체크리스트·미션·문장 틀·오개념).
 */
import type { LearningSupportConfig } from './learningTypes'

export const DATA_RESCUE_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: '결측값', plain: '기록이 비어 있는 칸. 빈칸이 많으면 비슷한 사례를 잘못 고를 수 있습니다.' },
    { term: '편향', plain: '특정 그룹만 불리하거나 유리하게 나오는 치우침. 정확도가 높아도 남을 수 있습니다.' },
    { term: '재현율', plain: '추천했어야 할 사람 중 실제로 찾아낸 비율. “놓친 사람”을 보는 지표입니다.' },
  ],
  hintsByStage: {
    intro: [
      { id: 'h1', action: '핵심 질문을 읽고, 초급이라면 두 데이터 버튼을 찾아보세요.', why: '무엇을 비교할지 알면 숫자가 의미를 갖습니다.' },
    ],
    explore: [
      { id: 'h1', action: '정리된 데이터와 문제 있는 데이터를 각각 한 번씩 실행하세요.', why: '둘 다 돌려야 차이를 말할 수 있습니다.' },
      { id: 'h2', action: '표에서 ? 나 ! 표시가 있는 칸을 두 개 이상 찾아보세요.', why: '문제의 종류를 눈으로 확인하는 단계입니다.' },
    ],
    challenge: [
      { id: 'h1', action: '전처리 카드를 한 장만 켠 뒤 다시 학습시키세요.', why: '한 가지만 바꿔야 원인이 분명해집니다.' },
      { id: 'h2', action: '「사전 활동 횟수 빼기」를 켠 상태와 끈 상태를 비교하세요.', why: '대리 특성이 그룹 격차에 미치는 영향을 보기 좋습니다.' },
    ],
    result: [
      { id: 'h1', action: '그룹별로 놓친 학생 수를 확인하세요.', why: '전체 정확도만 보면 불평등을 놓칩니다.' },
    ],
    reflect: [
      { id: 'h1', action: '관찰 체크리스트를 채운 뒤 성찰 한 문장을 적으세요.', why: '관찰 없이 쓰면 추측이 됩니다.' },
    ],
  },
  checklist: [
    { id: 'c1', label: '정리된 데이터와 문제 있는 데이터의 정확도(또는 맞힌 수)를 확인했다' },
    { id: 'c2', label: '빈칸 또는 이상한 값의 예를 표에서 하나 이상 찾았다' },
    { id: 'c3', label: '전처리를 바꿨을 때(또는 두 데이터를 비교했을 때) 달라진 숫자를 하나 적었다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '차이 발견',
      goal: '초급에서 두 데이터의 정확도 차이를 %p로 말하고, 이유를 한 문장으로 적기',
      difficulty: 'beginner',
      minutes: 15,
      tips: ['두 버튼을 모두 실행했는지 확인'],
    },
    {
      id: 'm2',
      title: '한 장 처방',
      goal: '전처리 카드 한 장만으로 정확도 또는 격차를 개선하고, 무엇을 잃었는지 적기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: '예산 안 공정성',
      goal: '비용 한도 안에서 재현율과 그룹 격차 목표를 동시에 달성하기',
      difficulty: 'advanced',
      minutes: 40,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: '데이터가 ___해서 인공지능의 성적이 ___해졌습니다.',
      hint: '빈칸 예: 지저분해서 / 떨어',
    },
    {
      id: 's2',
      template: '___ 그룹이 불리했던 이유는 ___ 때문입니다.',
      hint: '예: B / 추천 기록이 잘못 적혀 있었기',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: '정확도가 올랐으면 공정한 모델이다.',
      isCorrect: false,
      explain: '전체 정확도가 올라도 특정 그룹만 계속 놓칠 수 있습니다. 그룹별로 나눠 봐야 합니다.',
    },
    {
      id: 'x2',
      claim: '데이터가 많기만 하면 언제나 좋은 인공지능이 된다.',
      isCorrect: false,
      explain: '양보다 품질과 대표성이 중요합니다. 잘못된 기록이 많으면 편견도 함께 배웁니다.',
    },
  ],
}

export const PATHFINDING_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: 'DFS', plain: '깊이 우선 탐색. 한 길로 깊게 들어갔다가, 막히면 되돌아옵니다.' },
    { term: 'BFS', plain: '너비 우선 탐색. 시작점에서 가까운 칸부터 넓게 퍼져 나갑니다.' },
    { term: 'A*', plain: '지금까지 든 비용(g)과 남은 거리 짐작(h)을 더해(f) 유망한 칸을 먼저 봅니다.' },
  ],
  hintsByStage: {
    intro: [{ id: 'h1', action: '시작(S)·목표(G)·벽의 위치를 범례와 함께 확인하세요.' }],
    explore: [
      { id: 'h1', action: 'DFS와 BFS를 각각 실행해 방문 칸 수를 비교하세요.', why: '같은 미로라도 전략이 다르면 발자국이 달라집니다.' },
      { id: 'h2', action: '중급이라면 한 칸씩 실행하며 스택/큐를 보세요.' },
    ],
    challenge: [
      { id: 'h1', action: '벽을 하나 추가한 뒤 다시 실행해 경로가 바뀌는지 보세요.' },
      { id: 'h2', action: '고급: 숲·늪을 넣고 A*와 최상 우선의 총비용을 비교하세요.' },
    ],
    result: [{ id: 'h1', action: '방문 수와 경로 길이(또는 총비용) 중 무엇이 달랐는지 고르세요.' }],
    reflect: [{ id: 'h1', action: '“언제 BFS가 유리한가”를 한 문장으로 적어 보세요.' }],
  },
  checklist: [
    { id: 'c1', label: 'DFS와 BFS(또는 비교한 알고리즘)의 방문 칸 수를 확인했다' },
    { id: 'c2', label: '경로가 미로 위에 어떻게 그려졌는지 보았다' },
    { id: 'c3', label: '알고리즘이 다른 이유를 쉬운 말로 한 가지 말할 수 있다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '발자국 비교',
      goal: 'DFS와 BFS의 방문 칸 수 차이를 말하고, 누가 더 많이 헤맸는지 설명하기',
      difficulty: 'beginner',
      minutes: 15,
    },
    {
      id: 'm2',
      title: '한 칸씩 추적',
      goal: '스택 또는 큐에 칸이 들어갔다 나오는 순간을 한 번 설명해 보기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: '비용 미션',
      goal: 'A*가 BFS보다 방문이 적거나, 최상 우선이 더 비싼 경로를 찾는 지도를 만들기',
      difficulty: 'advanced',
      minutes: 40,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: 'DFS는 ___해서 방문 칸이 ___하고, BFS는 ___합니다.',
      hint: '깊게 들어가 / 많을 수 있 / 가까운 칸부터 봅니다',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: 'A*는 언제나 가장 좋은 알고리즘이다.',
      isCorrect: false,
      explain: '무엇을 최적화하는지와 지도·휴리스틱에 따라 달라집니다. 평지에서는 BFS도 칸 수에 강합니다.',
    },
  ],
}

export const RULE_VS_LEARN_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: '규칙 기반', plain: '사람이 만든 IF-THEN으로 판단합니다. 이유를 설명하기 쉽습니다.' },
    { term: 'k-NN', plain: '가장 비슷한 예시 k개에게 물어 다수결로 정합니다.' },
    { term: '설명 가능성', plain: '왜 그런 답이 나왔는지 사람이 이해할 수 있는 정도입니다.' },
  ],
  hintsByStage: {
    explore: [
      { id: 'h1', action: '같은 사례를 두 로봇에게 물어 답과 이유를 나란히 보세요.' },
      { id: 'h2', action: '둘이 다른 답을 내는 사례를 하나 찾아보세요.' },
    ],
    challenge: [{ id: 'h1', action: '규칙을 하나 고치거나 학습 예시를 바꿔 결과가 바뀌는지 보세요.' }],
    result: [{ id: 'h1', action: '일치율과 갈림 사례 수를 확인하세요.' }],
    reflect: [{ id: 'h1', action: '설명이 중요할 때와 예외가 많을 때를 구분해 적으세요.' }],
  },
  checklist: [
    { id: 'c1', label: '규칙 로봇의 답과 이유(규칙 경로)를 확인했다' },
    { id: 'c2', label: '학습 로봇의 답과 이웃 예시를 확인했다' },
    { id: 'c3', label: '두 로봇이 같거나 다른 사례를 하나 이상 보았다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '이유 비교',
      goal: '같은 질문에 두 로봇의 이유를 한 문장씩 적어 비교하기',
      difficulty: 'beginner',
      minutes: 15,
    },
    {
      id: 'm2',
      title: '갈림 수집',
      goal: '의견이 갈리는 사례 2개 이상 모으고 공통점 말하기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: '하이브리드 제안',
      goal: '규칙으로 고정할 조건과 학습에 맡길 부분을 구분해 제안하기',
      difficulty: 'advanced',
      minutes: 35,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: '규칙이 나은 경우는 ___이고, 학습이 나은 경우는 ___입니다.',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: '학습 기반이 항상 규칙 기반보다 똑똑하다.',
      isCorrect: false,
      explain: '예외가 많으면 학습이 유리할 수 있지만, 설명·금지가 중요하면 규칙이 더 나을 수 있습니다.',
    },
  ],
}

export const DECISION_TREE_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: '의사결정나무', plain: '질문을 순서대로 던져 답을 갈라 가는 모델입니다.' },
    { term: '지니 불순도', plain: '한 덩어리에 여러 종류가 얼마나 섞여 있는지를 나타내는 값입니다.' },
    { term: '과적합', plain: '훈련(숙제)만 잘 맞고 시험(새 문제)에는 약한 상태입니다.' },
  ],
  hintsByStage: {
    explore: [
      { id: 'h1', action: '질문 순서를 바꿔 시험 맞힌 수가 달라지는지 보세요.' },
      { id: 'h2', action: '중급: 첫 분할(루트)에 어떤 특성을 썼는지 확인하세요.' },
    ],
    challenge: [{ id: 'h1', action: '나무를 깊게 키운 뒤 훈련·시험 성적 차이를 보세요.' }],
    result: [{ id: 'h1', action: '첫 질문이 무엇이었는지와 시험 정확도를 함께 적으세요.' }],
  },
  checklist: [
    { id: 'c1', label: '질문 순서(또는 나무 구조)를 한 번 이상 바꿨다' },
    { id: 'c2', label: '훈련 성적과 시험 성적을 모두 보았다' },
    { id: 'c3', label: '첫 질문이 결과에 미친 영향을 한 가지 말할 수 있다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '첫 질문 실험',
      goal: '첫 질문만 바꿔 시험 맞힌 수 차이를 보고하기',
      difficulty: 'beginner',
      minutes: 15,
    },
    {
      id: 'm2',
      title: '훈련 vs 시험',
      goal: '훈련 정확도와 시험 정확도 차이를 %p로 말하기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: '과적합 재현',
      goal: '깊은 나무가 훈련만 좋고 시험이 나쁜 경우를 만들고 설명하기',
      difficulty: 'advanced',
      minutes: 40,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: '첫 질문으로 ___를 고르니 생물을 더 ___ 나눌 수 있었습니다.',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: '나무가 깊을수록 항상 더 좋은 모델이다.',
      isCorrect: false,
      explain: '너무 깊으면 숙제만 외운 것처럼 과적합될 수 있습니다. 시험 성적을 함께 봐야 합니다.',
    },
  ],
}

export const RECOMMENDER_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: '콘텐츠 기반', plain: '내가 좋아한 것과 비슷한 속성(태그)의 콘텐츠를 추천합니다.' },
    { term: '협업 필터링', plain: '나와 취향이 비슷한 사람이 좋아한 것을 추천합니다.' },
    { term: '필터 버블', plain: '비슷한 추천만 반복되어 시야가 좁아지는 현상입니다.' },
  ],
  hintsByStage: {
    explore: [
      { id: 'h1', action: '카드 네 장 이상 평가한 뒤 추천 목록과 이유를 읽으세요.' },
      { id: 'h2', action: '인기 기반 목록과 취향 기반 목록을 비교하세요.' },
    ],
    challenge: [{ id: 'h1', action: '다양성 슬라이더를 올린 뒤 선호도 지표가 어떻게 변하는지 보세요.' }],
    result: [{ id: 'h1', action: '추천 이유에 적힌 데이터 근거를 한 줄 인용하세요.' }],
  },
  checklist: [
    { id: 'c1', label: '평가를 4개 이상 남겼다' },
    { id: 'c2', label: '추천 이유를 한 개 이상 읽었다' },
    { id: 'c3', label: '인기 기반과 취향 기반(또는 방식 전환) 차이를 확인했다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '이유 읽기',
      goal: '추천 카드 1개의 이유를 친구에게 설명하기',
      difficulty: 'beginner',
      minutes: 15,
    },
    {
      id: 'm2',
      title: '방식 전환',
      goal: '콘텐츠/협업/인기 중 두 방식을 바꿔 순위 변화를 보고하기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: '버블 줄이기',
      goal: '다양성을 올리면서도 선호도가 크게 떨어지지 않는 설정 찾기',
      difficulty: 'advanced',
      minutes: 40,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: '이 콘텐츠가 추천된 이유는 내가 ___를 좋아했고, 그와 ___하기 때문입니다.',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: '추천이 정확할수록 항상 좋다.',
      isCorrect: false,
      explain: '정확도만 높이면 비슷한 콘텐츠만 보여 필터 버블이 생길 수 있습니다. 다양성도 함께 봅니다.',
    },
  ],
}

export const MODEL_OLYMPICS_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: '회귀', plain: '숫자 값을 예측합니다. 예: 내일 대여량.' },
    { term: '분류', plain: '종류(범주)를 고릅니다. 예: 암석 종류.' },
    { term: '기준 모델', plain: '평균·다수결처럼 아주 단순한 비교 상대. 이보다 나은지 확인합니다.' },
  ],
  hintsByStage: {
    explore: [
      { id: 'h1', action: '문제 카드를 읽고 회귀/분류/군집 중 하나를 고르세요.' },
      { id: 'h2', action: '중급: 모델을 돌린 뒤 기준 모델 점수와 비교하세요.' },
    ],
    challenge: [{ id: 'h1', action: '훈련만 좋고 시험이 나쁜 설정을 찾아 과적합을 확인해 보세요.' }],
    result: [{ id: 'h1', action: '기준보다 나아진 지표 하나를 고르세요.' }],
  },
  checklist: [
    { id: 'c1', label: '문제 유형을 선택했고 그 이유를 말할 수 있다' },
    { id: 'c2', label: '기준 모델과 내 모델의 점수를 비교했다' },
    { id: 'c3', label: '이 모델을 쓰면 안 되는 상황을 하나 생각해 보았다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '유형 판별',
      goal: '문제 카드 2장의 유형을 맞히고 이유를 고르기',
      difficulty: 'beginner',
      minutes: 15,
    },
    {
      id: 'm2',
      title: '기준 이기기',
      goal: '선택한 문제에서 기준 모델보다 나은 지표 만들기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: '모델 카드',
      goal: '목적·한계·오용 주의를 포함한 모델 카드 작성',
      difficulty: 'advanced',
      minutes: 40,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: '이 문제는 ___를 맞혀야 해서 ___ 유형입니다.',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: '복잡한 모델이 항상 단순 모델보다 좋다.',
      isCorrect: false,
      explain: '기준 모델보다 나은지, 시험 성적까지 좋은지 확인해야 합니다. 복잡하다고 무조건 좋지 않습니다.',
    },
  ],
}

export const NEURON_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: '가중치', plain: '각 입력을 얼마나 중요하게 볼지 정하는 숫자입니다.' },
    { term: '편향', plain: '판단이 뒤집히는 기준점. 선을 통째로 밀거나 당깁니다.' },
    { term: 'XOR', plain: '입력이 다를 때만 참이 되는 규칙. 직선 하나로는 나누기 어렵습니다.' },
  ],
  hintsByStage: {
    explore: [
      { id: 'h1', action: '가중치·편향 손잡이를 조금씩 움직여 직선이 어떻게 도는지 보세요.' },
      { id: 'h2', action: '정확도가 90% 이상이 되도록 점을 나눠 보세요.' },
    ],
    challenge: [
      { id: 'h1', action: 'AND 또는 OR를 손잡이만으로 맞춰 보세요.' },
      { id: 'h2', action: '학습 버튼으로 오류가 줄어드는지 확인한 뒤 XOR을 시도하세요.' },
    ],
    result: [{ id: 'h1', action: '맞힌 개수와 선의 위치를 연결해 말해 보세요.' }],
  },
  checklist: [
    { id: 'c1', label: '손잡이를 바꿔 직선이 움직이는 것을 보았다' },
    { id: 'c2', label: '정확도(맞힌 수)가 어떻게 변했는지 확인했다' },
    { id: 'c3', label: 'AND/OR와 XOR의 차이(또는 학습이 선을 고치는 방식)를 한 가지 말할 수 있다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '선 나누기',
      goal: '두 무리 점을 정확도 90% 이상으로 가르기',
      difficulty: 'beginner',
      minutes: 15,
    },
    {
      id: 'm2',
      title: '논리 게이트',
      goal: 'AND와 OR를 모두 맞추기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: 'XOR 한계',
      goal: 'XOR을 직선으로 못 나누는 이유를 그림과 함께 설명하기',
      difficulty: 'advanced',
      minutes: 35,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: '가중치는 ___이고, 편향은 ___입니다.',
      hint: '입력의 중요도 / 기준점',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: '인공 뉴런은 사람 뇌 세포와 똑같이 동작한다.',
      isCorrect: false,
      explain: '계산을 위해 크게 단순화한 모형입니다. 생물학적 뉴런과 같다고 말하면 오해입니다.',
    },
  ],
}

export const CITIZEN_JURY_LEARNING: LearningSupportConfig = {
  glossary: [
    { term: '이해관계자', plain: '도입으로 이익을 보거나 피해·걱정을 겪을 수 있는 사람들입니다.' },
    { term: '숙의', plain: '증거를 순서대로 살펴보며 판단을 천천히 다듬는 과정입니다.' },
    { term: '원칙 충돌', plain: '안전·공정·투명처럼 중요한 가치가 서로 부딪히는 상황입니다.' },
  ],
  hintsByStage: {
    explore: [
      { id: 'h1', action: '이해관계자 카드를 읽고 누가 이익·걱정인지 표시하세요.' },
      { id: 'h2', action: '중급: 1차 판단을 고른 뒤 증거를 하나씩 여세요.' },
    ],
    challenge: [{ id: 'h1', action: '조건부라면 보호 조치를 고르고, 원칙 충돌을 표시하세요.' }],
    result: [{ id: 'h1', action: '1차 판단과 최종 판단이 같았는지 비교하세요.' }],
    reflect: [{ id: 'h1', action: '체크리스트로 빠뜨린 생각이 없는지 확인하세요.' }],
  },
  checklist: [
    { id: 'c1', label: '이해관계자 중 이익을 보는 쪽과 걱정하는 쪽을 각각 확인했다' },
    { id: 'c2', label: '증거(또는 시나리오 정보)를 바탕으로 판단을 골랐다' },
    { id: 'c3', label: '더 알고 싶은 정보 또는 남은 불확실성을 하나 적었다' },
  ],
  missions: [
    {
      id: 'm1',
      title: '이해관계 지도',
      goal: '이익/걱정 주체를 구분해 한 문장 이유와 함께 판단하기',
      difficulty: 'beginner',
      minutes: 15,
    },
    {
      id: 'm2',
      title: '증거 숙의',
      goal: '1차와 최종 판단이 바뀌었는지 쓰고, 결정적 증거 지적하기',
      difficulty: 'intermediate',
      minutes: 25,
    },
    {
      id: 'm3',
      title: '의견서',
      goal: '원칙 충돌·책임 배분·불확실성을 포함한 짧은 의견서 쓰기',
      difficulty: 'advanced',
      minutes: 40,
    },
  ],
  sentenceFrames: [
    {
      id: 's1',
      template: '나는 ___ 때문에 ___ (찬성/반대/조건부)합니다. 단, ___ 조건이 필요합니다.',
    },
  ],
  misconceptions: [
    {
      id: 'x1',
      claim: '체크리스트 점수가 높을수록 도덕적으로 더 올바른 사람이다.',
      isCorrect: false,
      explain: '체크리스트는 생각의 빠짐없음을 돕는 도구일 뿐, 사람이나 도덕 점수가 아닙니다.',
    },
  ],
}
