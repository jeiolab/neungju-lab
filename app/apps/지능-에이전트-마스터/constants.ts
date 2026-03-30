import { Concept, QuizQuestion, ThinkingPrompt } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000];
export const MAX_LEVEL = 5;

export const CONCEPTS: Concept[] = [
  {
    id: 'c1',
    title: '지능 에이전트 (Intelligent Agent)',
    definition: '환경을 인식하고, 스스로 판단하여 행동함으로써 목표를 달성하는 시스템.',
    example: '자율주행 자동차, AI 로봇 청소기',
    misconception: '단순히 입력에 반응만 하는 "자동문"은 지능 에이전트가 아닙니다.'
  },
  {
    id: 'c2',
    title: '자율성 (Autonomy)',
    definition: '외부의 직접적인 제어 없이 스스로 판단하고 행동하는 능력.',
    example: '배터리가 부족할 때 스스로 충전기로 돌아가는 로봇 청소기',
    misconception: '원격 조종 드론은 조종사의 명령을 따르므로 자율성이 낮습니다.'
  },
  {
    id: 'c3',
    title: '반응성 (Reactivity)',
    definition: '환경의 변화를 감지하고 이에 적절하게 반응하는 능력.',
    example: '갑자기 튀어나온 보행자를 보고 멈추는 자율주행차',
    misconception: '미리 정해진 시간에만 작동하는 스프링클러는 반응성이 있다고 보기 어렵습니다.'
  },
  {
    id: 'c4',
    title: '능동성 (Pro-activeness)',
    definition: '환경 변화에 단순히 반응하는 것을 넘어, 목표를 달성하기 위해 주도적으로 행동하는 성질.',
    example: '주인에게 "오늘 날씨가 좋으니 산책 어떠세요?"라고 먼저 제안하는 AI 비서',
    misconception: '시키지 않은 일을 하는 것이 아니라, "목표"를 위해 먼저 움직이는 것입니다.'
  },
  {
    id: 'c5',
    title: '사회성 (Social Ability)',
    definition: '다른 에이전트나 사람과 통신하며 협력하거나 협상하는 능력.',
    example: '교차로에서 다른 차와 통신하여 순서를 양보하는 자율주행차 (V2X)',
    misconception: '단순히 말을 할 수 있다고 사회성이 있는 것은 아닙니다. 상호작용이 핵심입니다.'
  }
];

export const OX_QUIZ_DATA = [
  { id: 1, q: "자동문은 센서가 있으므로 지능 에이전트이다.", a: false, exp: "자동문은 단순 반응형 장치일 뿐, 학습하거나 추론하여 목표를 달성하는 능력이 없습니다." },
  { id: 2, q: "지능 에이전트는 환경을 인식하기 위해 센서(Sensor)를 사용한다.", a: true, exp: "맞습니다. 카메라, 마이크, 라이다 등 다양한 센서로 환경을 인식합니다." },
  { id: 3, q: "자율주행차가 목적지까지 가는 것은 '능동성'과 관련이 있다.", a: true, exp: "목표(목적지 도착)를 달성하기 위해 경로를 계획하고 주행하므로 능동성이 있습니다." },
  { id: 4, q: "에어컨이 리모컨 신호를 받아 켜지는 것은 고도의 '자율성'이다.", a: false, exp: "외부 신호(리모컨)에 의해 수동적으로 작동하는 것은 자율성이 아닙니다." },
  { id: 5, q: "지능 에이전트의 3단계 구조는 '입력 -> 처리(AI) -> 출력'이다.", a: true, exp: "센서(입력) -> 추론/학습(처리) -> 구동기(출력)의 과정을 거칩니다." }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 난이도 하
  {
    id: 1,
    difficulty: '하',
    question: '지능 에이전트의 4대 특성이 아닌 것은?',
    options: ['자율성', '반응성', '수동성', '사회성'],
    correctIndex: 2,
    explanation: "'수동성'은 지능 에이전트의 특성이 아닙니다. 오히려 '능동성'을 가집니다."
  },
  {
    id: 2,
    difficulty: '하',
    question: '지능 에이전트 구조에서 환경의 정보를 받아들이는 부분은?',
    options: ['구동기(Actuator)', '센서(Sensor)', '추론 엔진', '데이터베이스'],
    correctIndex: 1,
    explanation: "사람의 눈, 귀와 같이 정보를 받아들이는 역할은 '센서'가 담당합니다."
  },
  {
    id: 3,
    difficulty: '하',
    question: '다음 중 지능 에이전트로 보기 가장 어려운 것은?',
    options: ['알파고', '로봇 청소기', '자율주행 자동차', '일반 계산기'],
    correctIndex: 3,
    explanation: "일반 계산기는 정해진 규칙대로만 연산하며, 환경을 인식하거나 자율적으로 행동하지 않습니다."
  },
  {
    id: 4,
    difficulty: '하',
    question: '로봇이 스스로 판단하여 행동하는 성질은?',
    options: ['자율성', '사회성', '반응성', '연속성'],
    correctIndex: 0,
    explanation: "외부의 간섭 없이 스스로 제어하는 능력은 '자율성'입니다."
  },
  {
    id: 5,
    difficulty: '하',
    question: '지능 에이전트가 물리적인 행동을 취하게 해주는 장치는?',
    options: ['센서', '모니터', '구동기(Actuator)', '와이파이'],
    correctIndex: 2,
    explanation: "모터, 바퀴, 스피커 등 실제 행동을 수행하는 장치를 '구동기'라고 합니다."
  },
  // 난이도 중
  {
    id: 6,
    difficulty: '중',
    question: "로봇 청소기가 '먼지가 많은 곳을 더 세게 청소하는 것'은 어떤 특성인가?",
    options: ['사회성', '반응성', '자율성', '협동성'],
    correctIndex: 1,
    explanation: "먼지라는 환경 변화를 감지하고 즉시 흡입력을 조절하는 것은 '반응성'입니다."
  },
  {
    id: 7,
    difficulty: '중',
    question: "AI 비서가 사용자의 일정을 보고 '지금 출발해야 늦지 않아요'라고 알려주는 것은?",
    options: ['수동성', '능동성', '반사성', '적응성'],
    correctIndex: 1,
    explanation: "사용자가 묻지 않아도 목표(시간 엄수)를 위해 먼저 제안했으므로 '능동성'입니다."
  },
  {
    id: 8,
    difficulty: '중',
    question: '지능 에이전트의 동작 과정으로 올바른 순서는?',
    options: [
      '행동 -> 인식 -> 판단',
      '판단 -> 행동 -> 인식',
      '인식(Sense) -> 판단(Think) -> 행동(Act)',
      '행동 -> 판단 -> 인식'
    ],
    correctIndex: 2,
    explanation: "환경을 인식하고(Sense), 어떻게 할지 판단한 뒤(Think), 행동(Act)합니다."
  },
  {
    id: 9,
    difficulty: '중',
    question: '다음 중 "사회성"이 가장 잘 드러난 사례는?',
    options: [
      '혼자서 미로를 탈출하는 로봇',
      '축구 로봇들이 패스를 주고받으며 골을 넣는 상황',
      '사람의 얼굴을 인식해 잠금을 해제하는 스마트폰',
      '온도에 따라 자동으로 꺼지는 히터'
    ],
    correctIndex: 1,
    explanation: "다른 에이전트(로봇)와 협력하여 공통의 목표를 달성하는 것은 '사회성'입니다."
  },
  {
    id: 10,
    difficulty: '중',
    question: '규칙 기반(Rule-based) 시스템과 지능 에이전트의 가장 큰 차이점은?',
    options: [
      '전기가 필요한가 여부',
      '학습과 추론을 통한 유연한 대처 능력',
      '입력 장치의 유무',
      '계산 속도의 차이'
    ],
    correctIndex: 1,
    explanation: "지능 에이전트는 학습과 추론을 통해 예상치 못한 상황에도 유연하게 대처할 수 있습니다."
  },
  // 난이도 상
  {
    id: 11,
    difficulty: '상',
    question: "자율주행차가 사고가 불가피한 상황에서 윤리적 판단을 내려야 하는 문제는?",
    options: ['튜링 테스트', '트로리 딜레마', '죄수의 딜레마', '차이니즈 룸'],
    correctIndex: 1,
    explanation: "다수를 구하기 위해 소수를 희생할 것인가에 대한 윤리적 문제는 '트로리 딜레마'와 관련 있습니다."
  },
  {
    id: 12,
    difficulty: '상',
    question: "다음 중 '합리적 에이전트'의 정의로 가장 적절한 것은?",
    options: [
      '모든 상황에서 완벽하게 성공하는 에이전트',
      '주어진 정보 내에서 기대 성과를 최대화하는 행동을 선택하는 에이전트',
      '인간과 똑같이 생각하고 감정을 느끼는 에이전트',
      '오류가 전혀 발생하지 않는 에이전트'
    ],
    correctIndex: 1,
    explanation: "합리적 에이전트는 전지전능한 것이 아니라, 자신이 가진 지식과 인식 정보 내에서 최선의 결과를 내는 선택을 합니다."
  },
  {
    id: 13,
    difficulty: '상',
    question: '강한 인공지능(Strong AI)과 약한 인공지능(Weak AI)의 설명으로 틀린 것은?',
    options: [
      '현재 우리가 사용하는 대부분의 AI는 약한 AI이다.',
      '강한 AI는 자의식을 가질 수 있다고 가정한다.',
      '알파고는 바둑이라는 특정 영역에 특화된 약한 AI이다.',
      '지능 에이전트는 반드시 강한 AI여야만 한다.'
    ],
    correctIndex: 3,
    explanation: "지능 에이전트는 특정 목적을 수행하는 약한 AI(예: 청소 로봇)일 수도 있습니다."
  },
  {
    id: 14,
    difficulty: '상',
    question: '환경이 완전히 관찰 가능(Fully Observable)하지 않을 때 에이전트에게 필요한 능력은?',
    options: [
      '무조건 멈추는 능력',
      '내부 상태를 추정하고 불확실성을 다루는 추론 능력',
      '모든 센서를 끄는 능력',
      '사용자에게 즉시 제어권을 넘기는 능력'
    ],
    correctIndex: 1,
    explanation: "센서로 모든 것을 알 수 없을 때, 에이전트는 과거의 데이터나 확률을 통해 상황을 추론해야 합니다."
  },
  {
    id: 15,
    difficulty: '상',
    question: '에이전트가 수행 결과를 평가하고 자신의 성능을 개선하는 과정은?',
    options: ['인식(Sensing)', '행동(Acting)', '학습(Learning)', '통신(Communicating)'],
    correctIndex: 2,
    explanation: "경험을 통해 성능을 향상시키는 과정은 '학습'입니다."
  }
];

export const THINKING_PROMPTS: ThinkingPrompt[] = [
  { id: 1, title: '사회성이 없는 자율주행차?', prompt: '만약 모든 자율주행차가 완벽한 자율성과 반응성을 가졌지만, 서로 통신하는 "사회성"이 전혀 없다면 복잡한 교차로에서 어떤 문제가 발생할까요?' },
  { id: 2, title: '로봇의 책임', prompt: 'AI 로봇이 스스로 판단하여(자율성) 청소를 하다가 실수로 소중한 화분을 깨뜨렸습니다. 이 책임은 로봇에게 있을까요, 로봇을 만든 개발자에게 있을까요, 아니면 주인에게 있을까요?' },
  { id: 3, title: '완벽한 비서', prompt: '나보다 나를 더 잘 아는 "능동적"인 AI 비서가 있습니다. 내가 다이어트 중인데 밤에 치킨을 시키려 할 때, 비서가 주문을 거부한다면 이것은 올바른 행동일까요?' }
];
