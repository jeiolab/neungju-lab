import { ConceptCard, Mission, QuizQuestion, ThinkPrompt } from './types';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'ethics',
    title: 'AI 윤리',
    description: 'AI는 도구가 아닌 파트너일 수 있지만, 편향성과 악용 가능성을 항상 경계해야 합니다.',
    icon: 'scale',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'responsibility',
    title: '인간의 책임',
    description: '최종 결정은 인간이 합니다. AI의 실수나 오류에 대한 책임은 그것을 활용한 사용자에게 있습니다.',
    icon: 'user-check',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    id: 'verification',
    title: '검증의 의무',
    description: 'AI가 내놓은 답은 확률적 추론일 뿐, 진실이 아닙니다. 반드시 팩트 체크가 필요합니다.',
    icon: 'search',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'privacy',
    title: '개인정보 보호',
    description: '편리함을 위해 제공한 나의 데이터가 학습되어 영구적으로 남을 수 있음을 인지해야 합니다.',
    icon: 'shield-alert',
    color: 'bg-red-100 text-red-700 border-red-200'
  }
];

export const MISSIONS_POOL: Mission[] = [
  {
    id: 1,
    situation: "단톡방에서 친구가 '이 뉴스 AI가 요약해준 건데 진짜래!'라며 자극적인 기사 내용을 공유했다.",
    tags: ['검증 생략', '책임 전가'],
    options: [
      { id: 'a', text: '친구 말을 믿고 다른 방에도 공유한다.', type: 'risky', feedback: '위험해요! AI 환각(Hallucination)일 수 있습니다. 가짜 뉴스 확산의 주범이 될 수 있어요.' },
      { id: 'b', text: 'AI가 요약했으니 맞겠지 생각하고 읽어만 본다.', type: 'ambiguous', feedback: '소극적이지만 위험합니다. 스스로 판단하지 않고 AI 권위에 의존하는 태도입니다.' },
      { id: 'c', text: '원본 기사 링크를 찾아보고, 사실인지 검색해본다.', type: 'correct', feedback: '훌륭해요! AI는 보조 도구일 뿐, 검증은 인간(당신)의 몫입니다.' }
    ],
    goodReasons: [
      "AI도 거짓말(환각)을 할 수 있기 때문에 원본 확인이 필수적이다.",
      "정보 공유 전 팩트 체크는 디지털 시민의 기본 책임이다."
    ]
  },
  {
    id: 2,
    situation: "학교 수행평가 설문조사를 만드는데, AI가 '참여자 이름을 수집하면 분석이 쉽다'고 제안했다.",
    tags: ['개인정보 과공유', '윤리적 판단'],
    options: [
      { id: 'a', text: '분석이 쉽다니 이름 포함해서 설문을 만든다.', type: 'risky', feedback: '경고! 불필요한 개인정보 수집은 윤리 위반이며 정보 유출 위험이 큽니다.' },
      { id: 'b', text: '이름 대신 학번 앞자리만 수집하도록 수정한다.', type: 'ambiguous', feedback: '나쁘지 않지만, 학번도 특정인 식별이 가능할 수 있어 최소 수집 원칙을 더 고민해야 해요.' },
      { id: 'c', text: '익명성이 보장되도록 식별 정보를 모두 제외하고 다시 설계한다.', type: 'correct', feedback: '정답! 데이터 최소 수집 원칙을 잘 지켰습니다. AI의 제안도 윤리적으로 필터링해야 해요.' }
    ],
    goodReasons: [
      "개인정보는 최소한으로 수집해야 유출 사고를 예방할 수 있다.",
      "AI는 효율성을 중시하지만, 인간은 윤리를 우선해야 한다."
    ]
  },
  {
    id: 3,
    situation: "유튜브 알고리즘이 내가 평소에 관심 없던 극단적인 정치 영상을 추천해줬다.",
    tags: ['추천 알고리즘', '과의존'],
    options: [
      { id: 'a', text: '호기심에 클릭해서 계속 연관 영상을 본다.', type: 'risky', feedback: '위험! 필터 버블(Filter Bubble)에 갇혀 편향된 시각을 갖게 될 수 있습니다.' },
      { id: 'b', text: '관심 없음 버튼을 누르고, 다양한 시각의 영상을 검색한다.', type: 'correct', feedback: '현명합니다! 알고리즘의 수동적 소비자가 아닌 주체적인 사용자가 되었습니다.' },
      { id: 'c', text: '그냥 무시하고 평소 보던 것만 본다.', type: 'ambiguous', feedback: '나쁘지 않지만, 알고리즘이 내 취향을 좁히고 있다는 사실을 인지하는 것이 중요합니다.' }
    ],
    goodReasons: [
      "알고리즘은 편향을 강화할 수 있으므로 의식적으로 다양한 정보를 찾아야 한다.",
      "추천 시스템에 휩쓸리지 않고 주체적으로 콘텐츠를 선택해야 한다."
    ]
  },
];

export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    category: 'responsibility',
    difficulty: 'easy',
    question: "AI 자율주행차가 사고를 냈을 때, 현재의 법적/윤리적 논의에서 가장 책임에서 먼 존재는?",
    options: ["차량 운전자(감독자)", "제조사", "AI 알고리즘 그 자체(인격체)", "보험사"],
    correctIndex: 2,
    explanation: "현재 AI는 법적 인격체가 아니므로 책임을 질 수 없습니다. 책임은 제조사나 운전자(사용자)에게 귀속됩니다."
  },
  {
    id: 2,
    category: 'bias',
    difficulty: 'easy',
    question: "AI가 특정 인종이나 성별에 대해 차별적인 발언을 하는 이유는?",
    options: ["AI가 스스로 나쁜 마음을 먹어서", "학습 데이터가 편향되어 있어서", "전기가 부족해서", "개발자가 일부러 코딩해서"],
    correctIndex: 1,
    explanation: "AI는 인터넷 상의 방대한 데이터를 학습하는데, 이 데이터에 인간 사회의 편견이 포함되어 있기 때문입니다."
  },
  {
    id: 3,
    category: 'dependence',
    difficulty: 'hard',
    question: "'필터 버블(Filter Bubble)' 현상과 가장 관련 깊은 행동은?",
    options: ["다양한 신문사를 비교해서 읽기", "추천 알고리즘이 주는 영상만 계속 시청하기", "도서관에서 무작위로 책 고르기", "친구들과 토론하기"],
    correctIndex: 1,
    explanation: "필터 버블은 알고리즘이 사용자가 좋아할 만한 정보만 제공하여 정보 편식을 유발하고 고립시키는 현상입니다."
  }
];

export const THINK_PROMPTS: ThinkPrompt[] = [
  {
    type: 'change',
    title: '조건 바꾸기',
    prompt: '만약 AI가 100% 완벽해서 실수가 없다면, 그래도 인간의 최종 확인이 필요할까요? 그 이유는?'
  },
  {
    type: 'counter',
    title: '반례 찾기',
    prompt: "'AI는 인간보다 공정하다'는 주장이 틀렸음을 증명할 수 있는 실제 사례나 상황은 무엇일까요?"
  },
  {
    type: 'design',
    title: '적용 설계하기',
    prompt: '우리 학교 규칙에 "AI 활용 가이드라인"을 추가한다면, 반드시 포함해야 할 1계명은?'
  }
];
