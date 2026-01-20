import { TheoryCardData, QuizQuestion } from './types';

export const THEORY_CARDS: TheoryCardData[] = [
  {
    id: 'c1',
    title: '문제 분석 (Analysis)',
    definition: '현재 상태와 목표 상태의 차이를 인식하고, 제약 조건을 명확히 하는 것',
    keywords: ['현재 상태', '목표 상태', '제약 조건'],
    example: '현재: 배고픔 → 목표: 배부름 → 제약: 돈 5천원, 시간 30분',
    misconception: {
      wrong: '문제 분석은 그냥 고민하는 것이다.',
      right: '명확한 상태(State)와 조건(Constraint)을 글로 적는 것이다.'
    },
    quiz: {
      question: '다음 중 문제 분석의 요소가 아닌 것은?',
      options: ['현재 상태', '목표 상태', '제약 조건', '무작위 추측'],
      correctIndex: 3
    }
  },
  {
    id: 'c2',
    title: '문제 분해 (Decomposition)',
    definition: '큰 문제를 해결 가능한 작은 단위의 문제들로 쪼개는 과정',
    keywords: ['하위 문제', '분할 정복', '단순화'],
    example: '라면 끓이기 → 물 끓이기, 면 넣기, 스프 넣기, 기다리기',
    misconception: {
      wrong: '무조건 잘게 쪼개는 게 좋다.',
      right: '해결 가능하고 의미 있는 단위까지만 쪼개야 한다.'
    },
    quiz: {
      question: '문제 분해의 주된 목적은?',
      options: ['문제를 복잡하게 만들기', '해결 가능한 크기로 줄이기', '시간 늘리기', '포기하기'],
      correctIndex: 1
    }
  },
  {
    id: 'c3',
    title: '모델링 (Modeling)',
    definition: '복잡한 현실 문제를 표, 그림, 그래프 등 단순한 형태로 표현하는 것',
    keywords: ['추상화', '구조화', '시각화'],
    example: '지하철 노선도 (실제 지형 무시, 연결 관계만 표현)',
    misconception: {
      wrong: '모델링은 그림을 예쁘게 그리는 것이다.',
      right: '핵심 요소와 관계를 구조적으로 표현하는 것이다.'
    },
    quiz: {
      question: '모델링의 결과물로 적절하지 않은 것은?',
      options: ['표', '순서도', '그래프', '복잡한 원본 사진 그대로'],
      correctIndex: 3
    }
  },
  {
    id: 'c4',
    title: '분할 정복 (Divide & Conquer)',
    definition: '문제를 나눈(Divide) 뒤, 각각 해결(Conquer)하고, 다시 합치는(Combine) 전략',
    keywords: ['재귀', '병렬 처리', '효율성'],
    example: '전교생 성적 정렬 → 반별 정렬 → 합치며 정렬',
    misconception: {
      wrong: '나누기만 하면 끝이다.',
      right: '나눈 뒤 해결하고 다시 통합하는 과정이 필요하다.'
    },
    quiz: {
      question: '분할 정복의 3단계가 아닌 것은?',
      options: ['분할(Divide)', '정복(Conquer)', '결합(Combine)', '회피(Avoid)'],
      correctIndex: 3
    }
  }
];

export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 'q1',
    question: '다음 중 "제약 조건"에 해당하는 것은?',
    options: ['나는 배가 고프다', '맛있는 것을 먹고 싶다', '용돈이 5000원밖에 없다', '친구가 없다'],
    correctIndex: 2,
    explanation: '가진 돈이나 시간 등 해결을 제한하는 요소가 제약 조건입니다.',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: '문제를 분해할 때 좋은 기준이 아닌 것은?',
    options: ['시간 순서대로', '기능별로', '담당자별로', '기분 내키는 대로'],
    correctIndex: 3,
    explanation: '분해는 논리적 기준(시간, 기능, 역할, 공간 등)이 필요합니다.',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    question: '모델링(Modeling) 과정에서 일어나는 일은?',
    options: ['불필요한 세부사항 제거(추상화)', '모든 정보를 다 포함하기', '문제를 더 어렵게 만들기', '해결책 숨기기'],
    correctIndex: 0,
    explanation: '모델링은 핵심 요소만 남기고 불필요한 것을 제거하는 추상화 과정을 포함합니다.',
    difficulty: 'medium'
  },
  {
    id: 'q4',
    question: '다음 상황을 표로 모델링할 때 적절한 컬럼(열)이 아닌 것은?',
    options: ['작업명', '담당자', '소요시간', '오늘의 날씨'],
    correctIndex: 3,
    explanation: '프로젝트 관리 모델링에서 날씨는 일반적으로 핵심 속성이 아닙니다(야외활동 예외).',
    difficulty: 'medium'
  },
  {
    id: 'q5',
    question: 'MECE(Mutually Exclusive Collectively Exhaustive) 원칙과 관련 깊은 단계는?',
    options: ['문제 분석', '문제 분해', '모델링', '프로그래밍'],
    correctIndex: 1,
    explanation: 'MECE는 겹치지 않고 누락 없이 분해했는지를 확인하는 원칙입니다.',
    difficulty: 'hard'
  }
];

export const BADGES = [
  { id: 'first_step', name: '첫 걸음', desc: '첫 번째 학습 완료' },
  { id: 'analyzer', name: '분석가', desc: '문제 정의 5회 완료' },
  { id: 'modeler', name: '구조 설계자', desc: '모델링 표 완성' },
  { id: 'master_streak', name: '작심삼일 돌파', desc: '3일 연속 학습' },
  { id: 'perfect_score', name: '백점 만점', desc: '체크리스트 100점 달성' }
];

export const REFLECTION_PROMPTS = [
  {
    type: 'condition' as const,
    title: '조건 바꾸기',
    text: '만약 제약 조건(시간, 비용)이 2배로 늘어난다면 해결 방법이 어떻게 달라질까요?'
  },
  {
    type: 'counterexample' as const,
    title: '반례 찾기',
    text: '내가 세운 계획이 실패할 수 있는 예외 상황은 무엇이 있을까요?'
  },
  {
    type: 'design' as const,
    title: '적용 설계하기',
    text: '이 문제 해결 모델을 우리 학교의 다른 문제(예: 급식 줄서기)에 적용한다면?'
  }
];
