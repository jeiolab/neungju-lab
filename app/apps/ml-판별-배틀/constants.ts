import { Scenario, QuizQuestion, DecisionType } from './types';

export const CONCEPTS = [
  { key: 'dataQuality', label: '데이터 품질', desc: '정확하고 충분한 데이터가 있는가?' },
  { key: 'pattern', label: '패턴 반복', desc: '데이터에 규칙이나 경향성이 있는가?' },
  { key: 'prediction', label: '예측 가능성', desc: '과거 데이터로 미래를 알 수 있는가?' },
  { key: 'automation', label: '자동화 효용', desc: '사람보다 기계가 하는 게 효율적인가?' },
  { key: 'creativity', label: '창의성 불필요', desc: '감정/예술적 직관이 덜 필요한가? (높을수록 ML 적합)' },
  { key: 'deduction', label: '복잡한 추론', desc: '단순 계산을 넘어선 추론이 필요한가?' },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: '급식 잔반 줄이기',
    description: '요일별 급식 메뉴와 날씨, 학생들의 과거 선호도를 분석해 내일 적정 배식량을 예측하고 싶어.',
    correctDecision: 'YES_ML',
    expertReasoning: '날씨, 메뉴, 선호도 등 복잡한 변수 간의 패턴을 찾고 예측하는 데 ML이 효과적입니다.',
    counterExample: '만약 메뉴가 매일 똑같다면 ML 없이 평균값만으로도 충분합니다.',
    category: 'SCHOOL'
  },
  {
    id: 's2',
    title: '성적 자동 합산기',
    description: '중간고사와 기말고사 점수, 수행평가 점수를 입력하면 자동으로 합계와 평균을 내고 등급을 계산하고 싶어.',
    correctDecision: 'NO_ML',
    expertReasoning: '명확한 계산 공식(사칙연산)이 존재하므로 규칙 기반 프로그래밍이 훨씬 정확하고 빠릅니다.',
    counterExample: '만약 서술형 답안의 "창의성"을 점수화해야 한다면 ML이 필요할 수 있습니다.',
    category: 'SCHOOL'
  },
  {
    id: 's3',
    title: '친구의 진심 알기',
    description: '친구가 보낸 카톡 메시지의 말투와 이모티콘만 보고 현재 친구의 100% 정확한 속마음을 맞추고 싶어.',
    correctDecision: 'HARD_ML',
    expertReasoning: '사람의 감정은 맥락에 따라 매우 주관적이며, "진심"을 레이블링한 정답 데이터셋을 만들기 어렵습니다.',
    counterExample: '단순히 "긍정/부정" 단어 빈도 분석 정도는 ML로 가능합니다.',
    category: 'LIFE'
  },
  {
    id: 's4',
    title: '도서관 추천 시스템',
    description: '내가 지금까지 빌린 책 목록을 바탕으로 내가 흥미로워할 만한 신간 도서를 추천받고 싶어.',
    correctDecision: 'YES_ML',
    expertReasoning: '사용자의 과거 기록과 유사한 취향을 가진 다른 사용자의 데이터를 분석하는 추천 알고리즘은 ML의 대표 사례입니다.',
    counterExample: '단순히 "과학" 카테고리 신간만 보여주는 건 ML이 아닙니다.',
    category: 'SCHOOL'
  },
  {
    id: 's5',
    title: '교복 위반 단속',
    description: '교문 카메라로 들어오는 학생을 찍어 넥타이나 명찰이 없는지 자동으로 확인하고 싶어.',
    correctDecision: 'YES_ML',
    expertReasoning: '이미지 인식(Computer Vision)을 통해 특정 객체(넥타이, 명찰)의 유무를 분류하는 것은 ML이 잘하는 분야입니다.',
    counterExample: '학생 수가 10명뿐이라면 선생님이 직접 보는 게 더 효율적입니다.',
    category: 'SCHOOL'
  },
  {
    id: 's6',
    title: '시 쓰기 대회',
    description: '세상에 없던, 사람의 마음을 깊이 울리는 독창적이고 완벽한 시를 쓰고 싶어.',
    correctDecision: 'HARD_ML',
    expertReasoning: '생성형 AI가 시를 쓸 수는 있지만, "사람의 마음을 울리는 독창성"은 주관적 평가 영역이라 보장이 어렵습니다.',
    counterExample: '기존 시 스타일을 모방하는 것은 ML로 가능합니다.',
    category: 'ART'
  }
];

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    difficulty: 'EASY',
    type: 'MULTIPLE',
    question: '다음 중 기계학습이 가장 "불필요한" 상황은?',
    options: ['손글씨 숫자 인식', '두 수의 곱셈 계산', '스팸 메일 필터링', '유튜브 영상 추천'],
    answer: '두 수의 곱셈 계산',
    explanation: '곱셈은 명확한 수학적 규칙이 존재하므로 계산기(규칙 기반)가 가장 효율적입니다.',
    conceptTag: 'automation',
    retryQuestion: {
      question: '규칙이 명확하여 100% 정확한 답을 낼 수 있는 문제는 ML보다 무엇이 적합한가?',
      answer: ['알고리즘', '규칙', '프로그래밍', '계산'],
      explanation: '명확한 규칙이 있다면 전통적인 프로그래밍 방식이 더 적합합니다.'
    }
  },
  {
    id: 'q2',
    difficulty: 'EASY',
    type: 'SHORT_ANSWER',
    question: '기계학습 모델을 학습시키기 위해 꼭 필요한 재료는 무엇인가? (3글자)',
    answer: ['데이터'],
    explanation: '기계학습은 "데이터"를 통해 패턴을 학습합니다.',
    conceptTag: 'dataQuality'
  },
  {
    id: 'q3',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE',
    question: '기계학습 프로젝트가 실패하기 쉬운 이유로 가장 적절한 것은?',
    options: ['컴퓨터 성능이 너무 좋아서', '데이터의 양이 너무 적거나 편향되어서', '프로그래밍 언어가 영어라서', '규칙이 너무 명확해서'],
    answer: '데이터의 양이 너무 적거나 편향되어서',
    explanation: '데이터 품질(Garbage In, Garbage Out)은 ML 성능의 핵심입니다.',
    conceptTag: 'dataQuality'
  },
  {
    id: 'q4',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE',
    question: '다음 중 "지도 학습(Supervised Learning)"에 반드시 필요한 것은?',
    options: ['라벨(정답)', '보상', '군집화', '인터넷 연결'],
    answer: '라벨(정답)',
    explanation: '지도 학습은 문제와 정답(라벨)이 함께 있는 데이터로 학습합니다.',
    conceptTag: 'pattern'
  },
  {
    id: 'q5',
    difficulty: 'HARD',
    type: 'SHORT_ANSWER',
    question: 'AI가 학습 데이터에만 너무 과하게 맞춰져서, 새로운 데이터에서는 성능이 떨어지는 현상을 무엇이라 하는가?',
    answer: ['과적합', '오버피팅', 'overfitting'],
    explanation: '과적합(Overfitting)은 모델이 학습 데이터의 노이즈까지 암기해버린 상태입니다.',
    conceptTag: 'prediction'
  }
];

export const BADGES = [
  { id: 'first_win', name: '첫 판결 성공', desc: '첫 번째 시나리오 판별 성공', icon: 'Award' },
  { id: 'streak_3', name: '작심삼일', desc: '3일 연속 학습', icon: 'Flame' },
  { id: 'master_concept', name: '개념 마스터', desc: '모든 개념 이해도 80점 이상', icon: 'Brain' },
  { id: 'quiz_hunter', name: '퀴즈 사냥꾼', desc: '퀴즈 100점 달성', icon: 'Target' }
];
