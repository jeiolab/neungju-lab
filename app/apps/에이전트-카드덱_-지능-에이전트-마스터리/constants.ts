import { ConceptCard, QuizQuestion, GlossaryTerm } from './types';

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'c1',
    title: '에이전트 vs 지능 에이전트',
    definition: '에이전트는 단순히 일을 대신하는 대리인이지만, 지능 에이전트는 환경을 인식하고 스스로 판단하여 행동합니다.',
    keywords: ['자율성', '대리인', '판단'],
    example: '자동문(센서로 열림, 에이전트) vs 급식 순번 알림봇(혼잡도를 보고 우리 반 순서를 조정함, 지능 에이전트)',
    misconception: {
      common: '로봇 청소기는 무조건 지능 에이전트다?',
      correction: '랜덤하게만 움직이면 단순 에이전트, 방 구조를 매핑하고 안 닦은 곳을 찾아가면 지능 에이전트입니다.',
    },
    checkQuestion: {
      question: '미리 입력된 시간표대로만 종을 치는 학교 방송 시스템은 지능 에이전트인가요?',
      answer: '아니요. (환경 인식과 추론 없이 규칙대로만 수행하므로 단순 에이전트입니다.)',
    },
  },
  {
    id: 'c2',
    title: '센서와 액추에이터',
    definition: '센서는 환경 정보를 받아들이는 감각기관, 액추에이터는 물리적으로 행동을 취하는 운동기관입니다.',
    keywords: ['입력(In)', '출력(Out)', '상호작용'],
    example: '시험 기간 내 상태: 눈/귀(센서)로 문제 확인 → 뇌(제어) → 손(액추에이터)으로 정답 마킹.',
    misconception: {
      common: '스마트폰 화면은 센서다?',
      correction: '화면 그 자체는 정보를 보여주는 액추에이터에 가깝고, 터치 패널이 센서 역할을 합니다.',
    },
    checkQuestion: {
      question: '자율주행차가 장애물을 피하려 브레이크를 밟았습니다. 이때 브레이크는 무엇에 해당하나요?',
      answer: '액추에이터',
    },
  },
  {
    id: 'c3',
    title: '인식-학습-추론-행동 루프',
    definition: '지능 에이전트가 작동하는 핵심 순환 과정입니다. 데이터를 모으고(인식), 더 똑똑해지고(학습), 결정하고(추론), 움직입니다(행동).',
    keywords: ['순환', '데이터', '의사결정'],
    example: '친구 생일 선물 고르기: 평소 친구 취향 관찰(인식) → 과거 반응 분석(학습) → "이걸 좋아하겠다"(추론) → 구매(행동).',
    misconception: {
      common: '학습과 추론은 같은 말이다?',
      correction: '학습은 지식을 쌓는 과정(공부), 추론은 지식을 써서 판단하는 과정(시험 풀기)입니다.',
    },
    checkQuestion: {
      question: '새로운 급식 메뉴가 맛있을지 예측해보는 단계는 무엇인가요?',
      answer: '추론',
    },
  },
  {
    id: 'c4',
    title: '지능 에이전트의 3대 특성',
    definition: '지능 에이전트가 갖춰야 할 주요 성질: 자율성(스스로), 협력성(남과 함께), 목표 지향성(목적 달성)입니다.',
    keywords: ['자율성', '협력성', '목표'],
    example: '축구 경기: 공을 보고 스스로 뜀(자율성), 팀원에게 패스(협력성), 골을 넣으려 함(목표 지향성).',
    misconception: {
      common: '협력성은 사람하고만 하는 것이다?',
      correction: '에이전트끼리(예: 드론 군집 비행) 정보를 주고받으며 돕는 것도 협력성입니다.',
    },
    checkQuestion: {
      question: '청소 로봇이 배터리가 부족해 스스로 충전기로 돌아가는 것은 어떤 특성인가요?',
      answer: '자율성 (또는 목표 지향성)',
    },
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  { term: '센서 (Sensor)', definition: '환경으로부터 물리적인 신호나 데이터를 감지하여 시스템이 이해할 수 있는 형태로 변환하는 장치.', tags: ['하드웨어', '입력'] },
  { term: '액추에이터 (Actuator)', definition: '시스템의 제어 신호를 받아 실제 물리적인 움직임이나 작용을 일으키는 장치.', tags: ['하드웨어', '출력'] },
  { term: '자율성 (Autonomy)', definition: '외부의 직접적인 간섭 없이 스스로의 상태와 행동을 제어할 수 있는 능력.', tags: ['특성'] },
  { term: '합리성 (Rationality)', definition: '가진 정보와 능력 내에서 목표 달성을 극대화할 수 있는 행동을 선택하는 성질.', tags: ['이론'] },
  { term: '튜링 테스트', definition: '기계가 인간 수준의 지능을 보여주는지 판별하기 위한 테스트.', tags: ['역사'] },
];

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'multiple',
    difficulty: 'easy',
    question: '다음 중 "지능 에이전트"라고 부르기에 가장 적절하지 않은 것은?',
    options: ['스스로 길을 찾는 자율주행차', '매일 정해진 시간에 물을 주는 스프링클러', '사용자 취향을 분석해 음악을 추천하는 AI', '방 구조를 학습하는 로봇 청소기'],
    correctAnswer: '매일 정해진 시간에 물을 주는 스프링클러',
    explanation: '스프링클러는 환경을 인식하거나 추론하지 않고, 단순한 타이머 규칙에 따라 작동하므로 단순 에이전트입니다.',
    correction: '지능 에이전트는 환경 변화를 인식하고 그에 맞춰 행동을 수정할 수 있어야 합니다.',
    retryQuestion: {
      question: '단순 규칙 기반 시스템의 예시로 옳은 것은?',
      options: ['유튜브 알고리즘', '자동문', '알파고', '자율주행 드론'],
      correctAnswer: '자동문'
    }
  },
  {
    id: 'q2',
    type: 'short',
    difficulty: 'normal',
    question: '환경의 정보를 받아들이는 눈, 귀, 카메라와 같은 역할을 하는 장치를 무엇이라고 합니까?',
    correctAnswer: '센서',
    explanation: '정보를 수집(Input)하는 것은 센서, 행동(Output)하는 것은 액추에이터입니다.',
    correction: '입력 장치는 센서, 출력/행동 장치는 액추에이터입니다.',
  },
  {
    id: 'q3',
    type: 'multiple',
    difficulty: 'challenge',
    question: '지능 에이전트의 "학습" 과정에 대한 설명으로 옳은 것은?',
    options: ['이미 입력된 규칙을 그대로 실행하는 것', '경험을 통해 성능을 개선하는 과정', '현재 상태를 파악하는 것', '물리적으로 이동하는 것'],
    correctAnswer: '경험을 통해 성능을 개선하는 과정',
    explanation: '입력된 규칙 수행은 단순 실행, 현재 상태 파악은 인식입니다. 학습은 과거의 데이터/경험을 통해 미래의 성능을 높이는 것입니다.',
    correction: '학습은 "경험(Experience)"을 통해 "성능(Performance)"을 향상시키는 과정입니다.',
    retryQuestion: {
      question: '학생이 오답노트를 쓰며 다음 시험 점수를 올리려는 행위는 에이전트의 어떤 과정과 유사한가요?',
      options: ['인식', '행동', '학습', '센싱'],
      correctAnswer: '학습'
    }
  }
];

export const BADGES = [
  { id: 'start', name: '시작이 반이다', desc: '첫 카드 학습 완료', icon: '🌱' },
  { id: 'master_3', name: '개념 유망주', desc: '취약 개념 3개 80점 달성', icon: '🥉' },
  { id: 'quiz_king', name: '퀴즈 정복자', desc: '퀴즈 100점 달성', icon: '👑' },
  { id: 'streak_3', name: '작심삼일 탈출', desc: '3일 연속 접속', icon: '🔥' },
];