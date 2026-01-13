import { LearningCard, QuizQuestion, DictItem, Badge, ProgressData, MotivationData, WrongNote } from './types';

// 카드 데이터 세트
export const LEARNING_CARDS: LearningCard[] = [
  {
    id: 'card_01',
    category: 'intro',
    title: '초기 인공지능 (규칙 기반)',
    definition: '사람이 미리 정해둔 규칙(If-Then)대로만 작동하는 프로그램',
    keywords: ['규칙 기반', 'If-Then', '융통성 없음'],
    example: '학교 도서관 검색기: 정확한 책 제목을 입력해야만 찾을 수 있고, 오타가 나면 "검색 결과 없음"만 뜬다.',
    misconception: {
      statement: '옛날 AI도 스스로 학습했다?',
      correction: '아니야, 초기 AI는 사람이 입력한 규칙 안에서만 움직였어. 학습 능력이 없었지.',
    },
    checkQuestion: {
      question: '초기 인공지능은 데이터를 통해 스스로 규칙을 만든다. (O/X)',
      type: 'OX',
      answer: 'X',
    },
  },
  {
    id: 'card_02',
    category: 'weak',
    title: '약인공지능 (특화형 AI)',
    definition: '특정 분야(바둑, 번역, 추천 등)에서만 인간 이상의 능력을 발휘하는 AI',
    keywords: ['특정 목적', '알파고', '현재의 AI'],
    example: '유튜브 알고리즘: 네가 좋아할 영상은 기가 막히게 추천하지만, 수학 숙제를 대신 풀어주진 못해.',
    misconception: {
      statement: '알파고는 바둑도 잘두고 축구 전술도 짤 수 있다?',
      correction: '알파고는 바둑만 잘 둬. 다른 분야에 적용하려면 처음부터 다시 학습시켜야 해.',
    },
    checkQuestion: {
      question: '현재 우리가 쓰는 스마트폰 음성비서는 약인공지능에 해당한다. (O/X)',
      type: 'OX',
      answer: 'O',
    },
  },
  {
    id: 'card_03',
    category: 'strong',
    title: '강인공지능 (범용 AI)',
    definition: '인간처럼 자의식을 가지고 여러 분야의 문제를 스스로 해결할 수 있는 AI (아직 미실현)',
    keywords: ['자의식', '범용성', '미래 기술'],
    example: '영화 <아이언맨>의 자비스: 해킹, 슈트 제어, 농담, 상황 판단까지 혼자 다 할 수 있어.',
    misconception: {
      statement: 'ChatGPT는 강인공지능이다?',
      correction: '아직은 아니야. 엄청 똑똑해 보이지만 자의식은 없고, 확률에 따라 문장을 만들 뿐이야.',
    },
    checkQuestion: {
      question: '강인공지능은 현재 기술로 이미 완성되었다. (O/X)',
      type: 'OX',
      answer: 'X',
    },
  },
  {
    id: 'card_04',
    category: 'role',
    title: '인간의 역할: 설계와 검증',
    definition: 'AI가 올바른 데이터를 학습했는지, 결과가 윤리적인지 확인하는 최종 책임자',
    keywords: ['윤리적 판단', '데이터 편향 확인', '책임'],
    example: '수행평가 채점 AI 도입 시: AI가 점수를 매겨도, 선생님이 "이유 없이 감점된 건 없는지" 최종 확인해야 해.',
    misconception: {
      statement: 'AI가 내린 결정은 무조건 공정하다?',
      correction: '학습 데이터가 편향되면 AI도 차별을 해. 그래서 인간의 검토가 필수야.',
    },
    checkQuestion: {
      question: 'AI의 결과물에 대한 최종 책임은 AI 개발자나 사용자(인간)에게 있다. (O/X)',
      type: 'OX',
      answer: 'O',
    },
  },
];

// 퀴즈 데이터 세트 (샘플)
export const QUIZ_POOL: QuizQuestion[] = [
  // 쉬움 (Easy)
  {
    id: 'quiz_e_01',
    difficulty: 'easy',
    type: 'multiple',
    question: '다음 중 "약인공지능"에 대한 설명으로 옳은 것은?',
    options: ['인간처럼 감정을 느낀다.', '모든 분야에서 만능이다.', '특정 분야에서만 뛰어난 성능을 보인다.', '스스로 자아를 가지고 있다.'],
    correctAnswer: '2', // Index string
    explanation: '약인공지능은 특정 목적(바둑, 번역 등)에 특화된 AI야.',
    correction: '현재의 모든 AI는 약인공지능 단계야.',
    retryQuestion: { question: '약인공지능은 자의식을 가진다 (O/X)', answer: 'X', type: 'OX' },
    conceptTag: 'weak',
  },
  {
    id: 'quiz_e_02',
    difficulty: 'easy',
    type: 'short',
    question: '초기 인공지능은 사람이 정해준 (   )에 따라서만 작동한다. 빈칸에 들어갈 두 글자 단어는?',
    correctAnswer: ['규칙'],
    explanation: 'If-Then 구조를 생각해보면 돼. 조건과 규칙이 핵심이야.',
    correction: '초기 AI = 규칙 기반 AI',
    conceptTag: 'intro',
  },
    {
    id: 'quiz_e_03',
    difficulty: 'easy',
    type: 'essay',
    question: '학교에서 볼 수 있는 인공지능 활용 사례를 한 가지 쓰고, 어떤 일을 대신해주는지 간단히 적어봐.',
    correctAnswer: [], // 서술형은 키워드 매칭
    keywords: ['번역', '검색', '추천', '챗봇', '채점'],
    explanation: '우리 주변엔 이미 많은 AI가 있어.',
    correction: '예: 영어 시간에 번역기를 사용한다.',
    conceptTag: 'role',
  },
  // 보통 (Normal)
  {
    id: 'quiz_n_01',
    difficulty: 'normal',
    type: 'multiple',
    question: '인간과 AI의 역할 분담으로 가장 적절하지 않은 것은?',
    options: ['인간: AI가 학습할 데이터의 편향성 점검', 'AI: 대량의 데이터에서 패턴 발견', '인간: AI의 결과물에 대한 윤리적 책임 짐', 'AI: 중요한 의사결정의 최종 승인'],
    correctAnswer: '3',
    explanation: '최종 승인과 책임은 인간의 영역이야. AI는 도구일 뿐이지.',
    correction: '중요한 결정은 인간이 검토 후 내려야 해.',
    retryQuestion: { question: 'AI에게 법적 책임을 물을 수 있다 (O/X)', answer: 'X', type: 'OX' },
    conceptTag: 'role',
  },
  {
    id: 'quiz_n_02',
    difficulty: 'normal',
    type: 'short',
    question: '아직 실현되지 않았으며, 인간과 같은 지성을 가지고 스스로 사고하는 AI 단계를 무엇이라 하는가? (5글자)',
    correctAnswer: ['강인공지능'],
    explanation: '아이언맨의 자비스를 떠올려봐.',
    correction: 'Strong AI라고도 해.',
    conceptTag: 'strong',
  },
  {
    id: 'quiz_n_03',
    difficulty: 'normal',
    type: 'essay',
    question: 'AI 면접관이 학생을 평가한다고 할 때, 발생할 수 있는 문제점과 인간이 해야 할 역할을 서술하시오.',
    correctAnswer: [],
    keywords: ['편향', '데이터', '검토', '확인', '차별'],
    explanation: 'AI는 학습 데이터에 있는 차별까지 배울 수 있어.',
    correction: '데이터 편향으로 인한 차별 가능성 → 인간이 결과의 공정성을 재검토해야 함.',
    conceptTag: 'role',
  },
  // 도전 (Hard)
  {
    id: 'quiz_h_01',
    difficulty: 'hard',
    type: 'multiple',
    question: '데이터 중심의 현재 AI(머신러닝)의 한계점으로 옳은 것은?',
    options: ['규칙을 일일이 입력해야 해서 개발이 느리다.', '학습하지 않은 데이터에는 엉뚱한 답을 낼 수 있다.', '자아가 생겨 인간을 지배할 위험이 당장 존재한다.', '연산 속도가 인간보다 느리다.'],
    correctAnswer: '1',
    explanation: 'AI는 배운 데이터 범위 내에서 확률적으로 답해. 안 배운 건 몰라.',
    correction: '이를 "일반화의 한계"라고도 해.',
    retryQuestion: { question: 'AI는 학습 데이터가 많을수록 항상 완벽해진다 (O/X)', answer: 'X', type: 'OX' },
    conceptTag: 'weak',
  },
];

// 용어 사전
export const DICTIONARY: DictItem[] = [
  { id: 'dict_1', term: '머신러닝 (Machine Learning)', description: '컴퓨터가 데이터를 통해 스스로 학습하여 규칙을 찾아내는 기술.' },
  { id: 'dict_2', term: '딥러닝 (Deep Learning)', description: '인간의 뇌 신경망을 모방하여 복잡한 데이터를 학습하는 머신러닝의 한 종류.' },
  { id: 'dict_3', term: '튜링 테스트', description: '기계가 인간처럼 생각하는지 판별하기 위한 실험. 대화만으로 인간과 기계를 구분할 수 없으면 통과.' },
  { id: 'dict_4', term: '알고리즘 편향', description: '학습 데이터 자체가 한쪽으로 치우쳐 있어서 AI의 결과도 불공정하게 나오는 현상.' },
  { id: 'dict_5', term: '특이점 (Singularity)', description: 'AI가 인간의 지능을 뛰어넘어, 기술 발전 속도를 예측할 수 없게 되는 시점.' },
];

// 배지 목록
export const BADGES: Badge[] = [
  {
    id: 'badge_starter',
    name: '개념 입문',
    description: '첫 번째 카드를 학습했습니다.',
    icon: '🌱',
    condition: (p, m, w) => Object.values(p).some(c => c.mastery > 0),
  },
  {
    id: 'badge_master_3',
    name: '3단계 정복',
    description: '초기/약/강 AI 카드 숙련도 80점 이상 달성!',
    icon: '🏆',
    condition: (p, m, w) => {
      const targets = ['card_01', 'card_02', 'card_03'];
      const avg = targets.reduce((sum, id) => sum + (p[id]?.mastery || 0), 0) / targets.length;
      return avg >= 80;
    },
  },
  {
    id: 'badge_wrong_note',
    name: '오답 수집가',
    description: '오답노트에 3개 이상의 기록을 남겼습니다.',
    icon: '📝',
    condition: (p, m, w) => w.length >= 3,
  },
  {
    id: 'badge_level_5',
    name: '레벨 5 달성',
    description: '열심히 학습하여 레벨 5가 되었습니다.',
    icon: '⭐',
    condition: (p, m, w) => m.level >= 5,
  },
];
