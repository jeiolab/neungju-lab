import { PuzzleStep, TheoryCard, QuizQuestion, Difficulty } from './types';

export const THEORY_CARDS: TheoryCard[] = [
  {
    id: 'c1',
    term: '개인정보',
    definition: '살아있는 개인을 알아볼 수 있는 정보. 성명, 주민번호, 영상 등을 포함하며, 다른 정보와 결합해 식별 가능한 것도 포함됩니다.',
    icon: 'User'
  },
  {
    id: 'c2',
    term: '가명정보',
    definition: '추가 정보 없이는 특정 개인을 알아볼 수 없도록 처리한 정보. 연구, 통계, 공익적 기록 보존 등을 위해 동의 없이 활용 가능합니다.',
    icon: 'Mask'
  },
  {
    id: 'c3',
    term: '익명정보',
    definition: '시간, 비용, 기술 등을 합리적으로 고려할 때 더 이상 개인을 알아볼 수 없도록 처리한 정보. 개인정보보호법 적용을 받지 않습니다.',
    icon: 'Ghost'
  },
  {
    id: 'c4',
    term: '데이터 3법',
    definition: '데이터 이용 활성화를 위해 개정된 3개의 법률. 가명정보 개념 도입을 통해 보안과 활용의 균형을 맞추는 것이 핵심입니다.',
    icon: 'Scale'
  }
];

export const INITIAL_PUZZLE_STEPS: PuzzleStep[] = [
  {
    id: 's1',
    title: '1. 목적 정의',
    description: '왜 이 데이터를 공유하나요?',
    selectedOptionIndex: 0,
    options: [
      { label: '명확한 공익/연구 목적 설정', riskEffect: -10, utilityEffect: 10 },
      { label: '목적 없이 일단 수집', riskEffect: 20, utilityEffect: -10 },
    ]
  },
  {
    id: 's2',
    title: '2. 수집 최소화',
    description: '꼭 필요한 항목만 남깁니다.',
    selectedOptionIndex: 0,
    options: [
      { label: '필수 항목만 선별', riskEffect: -15, utilityEffect: 5 },
      { label: '모든 데이터 포함', riskEffect: 30, utilityEffect: 20 },
    ]
  },
  {
    id: 's3',
    title: '3. 식별자 제거',
    description: '이름, 전화번호 등을 처리합니다.',
    selectedOptionIndex: 0,
    options: [
      { label: '완전 삭제 또는 마스킹', riskEffect: -30, utilityEffect: 0 },
      { label: '암호화하여 남김', riskEffect: -10, utilityEffect: 5 },
      { label: '그대로 유지', riskEffect: 100, utilityEffect: 5 },
    ]
  },
  {
    id: 's4',
    title: '4. 위험 낮추기',
    description: '주소, 나이 등을 범주화합니다.',
    selectedOptionIndex: 0,
    options: [
      { label: '상세 주소 유지 (예: 101동 202호)', riskEffect: 50, utilityEffect: 30 },
      { label: '범주화 (예: 10대, 서울시 마포구)', riskEffect: -20, utilityEffect: 15 },
      { label: '모두 * 처리', riskEffect: -40, utilityEffect: -40 },
    ]
  },
  {
    id: 's5',
    title: '5. 공개 범위',
    description: '누구에게 데이터를 줄까요?',
    selectedOptionIndex: 0,
    options: [
      { label: '인터넷 전체 공개', riskEffect: 40, utilityEffect: 40 },
      { label: '신뢰할 수 있는 기관만', riskEffect: -10, utilityEffect: 10 },
    ]
  },
  {
    id: 's6',
    title: '6. 보유 기간',
    description: '데이터는 언제 삭제하나요?',
    selectedOptionIndex: 0,
    options: [
      { label: '목적 달성 후 즉시 파기', riskEffect: -5, utilityEffect: 0 },
      { label: '영구 보관', riskEffect: 20, utilityEffect: 5 },
    ]
  },
  {
    id: 's7',
    title: '7. 메타데이터',
    description: '데이터 설명서를 작성합니다.',
    selectedOptionIndex: 0,
    options: [
      { label: '상세한 설명서 작성', riskEffect: 0, utilityEffect: 25 },
      { label: '작성 안 함', riskEffect: 5, utilityEffect: -20 },
    ]
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 'q1',
    difficulty: Difficulty.EASY,
    question: '다음 중 "가명정보"에 대한 설명으로 옳은 것은?',
    options: [
      '누구인지 100% 알 수 있는 정보다.',
      '추가 정보 없이는 특정 개인을 알아볼 수 없게 조치한 정보다.',
      '아무 의미 없는 숫자 나열이다.',
      '인터넷에 마음대로 올려도 되는 정보다.'
    ],
    correctAnswer: 1,
    explanation: '가명정보는 원래의 상태로 되돌리기 위한 추가 정보 없이는 특정 개인을 알아볼 수 없는 정보입니다.'
  },
  {
    id: 'q2',
    difficulty: Difficulty.MEDIUM,
    question: '데이터 공유 파이프라인에서 "범주화"의 예시로 적절한 것은?',
    options: [
      '홍길동 → 홍*동',
      '17세 → 10대 후반',
      '010-1234-5678 삭제',
      '서울시 강남구 역삼동 1번지 → 서울시'
    ],
    correctAnswer: 1,
    explanation: '구체적인 값을 구간이나 카테고리로 묶는 것을 범주화라고 하며, 식별 위험을 낮춥니다.'
  },
  {
    id: 'q3',
    difficulty: Difficulty.HARD,
    question: '데이터 유용성과 개인정보 보호 위험도의 관계에 대한 설명으로 가장 적절한 것은?',
    options: [
      '항상 비례한다 (위험이 높을수록 유용성도 높다).',
      '항상 반비례한다 (안전할수록 쓸모가 없다).',
      '트레이드오프 관계지만, 기술적 조치로 균형점을 찾을 수 있다.',
      '아무 관계가 없다.'
    ],
    correctAnswer: 2,
    explanation: '일반적으로 트레이드오프 관계에 있으나, 적절한 가명화 기술을 통해 안전하면서도 유용한 지점을 찾아야 합니다.'
  }
];