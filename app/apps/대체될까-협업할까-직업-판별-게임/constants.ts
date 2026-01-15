import { JobCard, QuizQuestion, ConceptCard, Badge, UserStats } from './types';

export const JOB_CATEGORIES = ['의료', '스포츠', '요식', '제조', '콘텐츠', '금융', '교육', '물류'];

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'c1',
    title: '자동화 (Automation)',
    description: '반복적이고 규칙적인 업무를 기계나 AI가 완전히 대신하는 것',
    iconName: 'Bot',
    keyPoint: '속도와 정확성이 중요한 단순 반복 업무에 유리해요.',
  },
  {
    id: 'c2',
    title: '협업 (Augmentation)',
    description: 'AI가 분석하고 사람이 최종 판단하며 함께 일하는 방식',
    iconName: 'Handshake',
    keyPoint: '사람의 능력을 확장시켜 더 효율적으로 일하게 도와줘요.',
  },
  {
    id: 'c3',
    title: '인간 고유성 (Human Touch)',
    description: '공감, 윤리적 판단, 고도의 창의성이 필요한 영역',
    iconName: 'Heart',
    keyPoint: '기술이 흉내 내기 어려운 감정과 관계 중심의 일이에요.',
  },
  {
    id: 'c4',
    title: '직무 재설계',
    description: '기술 도입으로 인해 기존 직업의 하는 일이 바뀌는 과정',
    iconName: 'RefreshCcw',
    keyPoint: '직업이 사라지는 게 아니라, 하는 일이 달라지는 거예요.',
  },
  {
    id: 'c5',
    title: '디지털 리터러시',
    description: '디지털 도구를 이해하고 활용하여 문제를 해결하는 능력',
    iconName: 'Laptop',
    keyPoint: '도구를 잘 다루는 사람이 미래의 핵심 인재가 됩니다.',
  },
  {
    id: 'c6',
    title: '알고리즘 편향',
    description: 'AI가 학습한 데이터에 따라 공정하지 못한 결과를 내는 문제',
    iconName: 'Scale',
    keyPoint: 'AI의 판단을 무조건 믿지 말고 사람이 검토해야 해요.',
  },
];

export const JOB_CARDS: JobCard[] = [
  {
    id: 'j1',
    title: '마트 계산원',
    category: '요식/서비스',
    tags: { repetitive: true, ruleBased: true, humanCare: false, creative: false, safetyRisk: false },
    correctType: 'AUTOMATION',
    description: '상품의 바코드를 찍고 결제하는 업무',
    feedback: {
      reason: '반복적(Repetitive)이고 규칙 기반(Rule-based) 업무라 자동화가 쉬워요.',
      techRole: '키오스크와 셀프 계산대가 계산 업무를 100% 수행 가능합니다.',
      analogy: '학교 매점에 자판기가 들어와서 아주머니가 안 계시는 것과 같아요.',
    },
  },
  {
    id: 'j2',
    title: '외과 의사',
    category: '의료',
    tags: { repetitive: false, ruleBased: true, humanCare: true, creative: true, safetyRisk: true },
    correctType: 'COLLABORATION',
    description: '환자를 진단하고 수술을 집도하는 업무',
    feedback: {
      reason: '고도의 전문성과 생명을 다루는 책임감이 필요하지만, 정밀함도 중요해요.',
      techRole: '수술 로봇이 정밀 동작을 돕고, AI가 진단을 보조하지만 최종 결정은 의사가 합니다.',
      analogy: '수학 문제를 풀 때 계산기는 계산을 돕고, 풀이 과정은 내가 쓰는 것과 같아요.',
    },
  },
  {
    id: 'j3',
    title: '심리 상담사',
    category: '의료/상담',
    tags: { repetitive: false, ruleBased: false, humanCare: true, creative: true, safetyRisk: false },
    correctType: 'HUMAN_CENTRIC',
    description: '내담자의 고민을 듣고 정서적 지지를 제공하는 업무',
    feedback: {
      reason: '깊은 공감(Human Care)과 비언어적 소통이 핵심이라 대체가 어려워요.',
      techRole: 'AI 챗봇이 초기 문진은 할 수 있지만, 진정한 위로는 사람만이 가능해요.',
      analogy: '힘든 일이 있을 때 AI 스피커보다 친한 친구의 "괜찮아" 한 마디가 힘이 되는 것과 같아요.',
    },
  },
  {
    id: 'j4',
    title: '스포츠 심판',
    category: '스포츠',
    tags: { repetitive: false, ruleBased: true, humanCare: false, creative: false, safetyRisk: false },
    correctType: 'COLLABORATION',
    description: '경기 규칙을 적용하여 판정하는 업무',
    feedback: {
      reason: '규칙(Rule-based)이 명확하지만, 경기 흐름을 끊지 않는 운영 능력도 필요해요.',
      techRole: 'VAR(비디오 판독)이나 로봇 심판이 아웃/세이프를 판정하고, 주심은 경기를 조율해요.',
      analogy: '체육 시간 피구 할 때 선 밟았는지 비디오로 확인하고 선생님이 아웃 선언하는 것과 비슷해요.',
    },
  },
  {
    id: 'j5',
    title: '웹툰 작가',
    category: '콘텐츠',
    tags: { repetitive: false, ruleBased: false, humanCare: false, creative: true, safetyRisk: false },
    correctType: 'COLLABORATION',
    description: '스토리를 짜고 그림을 그려 연재하는 업무',
    feedback: {
      reason: '창의성(Creative)이 핵심이지만, 채색이나 배경 작업은 반복적일 수 있어요.',
      techRole: '생성형 AI가 배경이나 밑색을 돕고, 작가는 스토리와 연출에 집중해요.',
      analogy: '미술 시간에 물통 물을 갈아주는 기계가 있다면 그림 그리기에 더 집중할 수 있겠죠?',
    },
  },
  {
    id: 'j6',
    title: '데이터 입력원',
    category: '금융/사무',
    tags: { repetitive: true, ruleBased: true, humanCare: false, creative: false, safetyRisk: false },
    correctType: 'AUTOMATION',
    description: '종이 문서를 보고 컴퓨터에 숫자를 입력하는 업무',
    feedback: {
      reason: '매우 반복적이고 규칙이 단순해서 자동화 1순위입니다.',
      techRole: 'OCR(광학 문자 인식) 기술이 사람보다 수천 배 빠르게 처리해요.',
      analogy: '받아쓰기한 내용을 일일이 타자로 다시 치는 대신 사진 찍으면 텍스트로 변환되는 기능과 같아요.',
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '다음 중 자동화될 가능성이 가장 높은 업무의 특징은?',
    options: ['창의적인 아이디어가 필요하다', '반복적이고 규칙이 명확하다', '사람의 감정을 읽어야 한다', '예상치 못한 상황에 대처해야 한다'],
    correctIndex: 1,
    explanation: 'AI와 로봇은 반복적이고 규칙(알고리즘)으로 정의할 수 있는 일을 가장 잘 수행합니다.',
    difficulty: 'EASY',
    conceptTag: 'c1',
  },
  {
    id: 2,
    question: 'AI와 사람이 함께 일하는 "협업"의 가장 적절한 예시는?',
    options: ['키오스크가 주문을 전부 대신 받는다', '의사가 AI의 진단 분석을 참고하여 처방한다', '로봇 청소기가 혼자 청소한다', '작가가 펜만 사용하여 그림을 그린다'],
    correctIndex: 1,
    explanation: '협업은 기술의 분석 능력과 사람의 판단 능력을 결합하여 시너지를 내는 것입니다.',
    difficulty: 'MEDIUM',
    conceptTag: 'c2',
  },
  {
    id: 3,
    question: '미래 직업 사회에서 중요해질 "인간 고유성" 역량이 아닌 것은?',
    options: ['공감 능력', '단순 암기 능력', '윤리적 판단력', '창의적 문제해결력'],
    correctIndex: 1,
    explanation: '단순 암기나 계산은 기계가 훨씬 잘합니다. 사람은 기계가 못하는 공감, 윤리, 창의성에 집중해야 해요.',
    difficulty: 'EASY',
    conceptTag: 'c3',
  },
  {
    id: 4,
    question: '다음 중 "직무 재설계"의 설명으로 옳은 것은?',
    options: ['모든 직업이 사라지는 현상', '직업의 이름만 바뀌는 것', '기술 도입으로 맡은 역할과 업무 방식이 변화하는 것', '사람이 기계의 명령을 따르는 것'],
    correctIndex: 2,
    explanation: '직업 자체가 사라지기보다, 기술이 대체하는 부분은 줄고 사람이 잘하는 부분으로 역할이 이동하는 것입니다.',
    difficulty: 'HARD',
    conceptTag: 'c4',
  },
];

export const BADGES: Badge[] = [
  {
    id: 'beginner',
    name: '첫 걸음',
    description: '첫 번째 학습을 완료했어요!',
    icon: 'Baby',
    condition: (stats) => stats.xp > 0,
  },
  {
    id: 'quiz_master',
    name: '퀴즈 마스터',
    description: '퀴즈 3문제를 연속으로 맞췄어요.',
    icon: 'Brain',
    condition: (stats) => {
      const recent = stats.quizHistory.slice(-3);
      return recent.length >= 3 && recent.every((q) => q.isCorrect);
    },
  },
  {
    id: 'collab_thinker',
    name: '협업형 사고',
    description: '협업 카드를 3번 올바르게 분류했어요.',
    icon: 'Handshake',
    condition: (stats) => {
      const collabWins = stats.gameHistory.filter(h => {
        const card = JOB_CARDS.find(c => c.id === h.jobId);
        return card?.correctType === 'COLLABORATION' && h.isCorrect;
      });
      return collabWins.length >= 3;
    },
  },
  {
    id: 'streak_3',
    name: '작심삼일 탈출',
    description: '3일 연속으로 학습했어요.',
    icon: 'Flame',
    condition: (stats) => stats.streak >= 3,
  },
];

export const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 1,
  lastLoginDate: new Date().toDateString(),
  badges: [],
  gameHistory: [],
  quizHistory: [],
  conceptMastery: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0 },
};