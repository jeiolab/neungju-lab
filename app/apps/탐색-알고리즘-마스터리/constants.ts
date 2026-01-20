import { ConceptCard, QuizQuestion, Badge, UserState } from './types';
import { BookOpen, Search, AlertTriangle, Zap } from 'lucide-react';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'linear_def',
    title: '순차 탐색 (Linear Search)',
    definition: '데이터를 처음부터 끝까지 하나씩 차례대로 비교하며 찾는 방법',
    keywords: ['무작위 데이터 가능', '단순함', '느림(데이터 많을 때)'],
    example: '친구 연락처가 적힌 엉망진창인 메모지 뭉치에서 특정 번호 찾기',
    misconception: {
      text: '순차 탐색은 항상 느리다?',
      correction: '아닙니다. 데이터 개수(n)가 적거나, 찾는 데이터가 맨 앞에 있으면 매우 빠릅니다.'
    },
    checkQuestion: {
      question: '순차 탐색은 데이터가 정렬되어 있어야만 사용할 수 있다.',
      answer: false,
      explanation: '순차 탐색은 정렬 여부와 상관없이 사용할 수 있습니다.'
    }
  },
  {
    id: 'binary_def',
    title: '이진 탐색 (Binary Search)',
    definition: '정렬된 데이터에서 범위를 절반씩 좁혀가며 찾는 방법',
    keywords: ['정렬 필수', '반으로 쪼개기', '매우 빠름'],
    example: '업다운(Up/Down) 게임: 1~100 사이 숫자 맞추기 (50 -> 75 -> 62...)',
    misconception: {
      text: '이진 탐색은 어떤 리스트에서도 쓸 수 있다?',
      correction: '절대 불가합니다. 반드시 "정렬(Sorting)"된 상태여야만 기준을 잡고 반을 버릴 수 있습니다.'
    },
    checkQuestion: {
      question: '이진 탐색을 하려면 데이터가 오름차순이나 내림차순으로 정렬되어 있어야 한다.',
      answer: true,
      explanation: '정렬되지 않으면 중앙값을 기준으로 왼쪽/오른쪽을 버릴 판단을 할 수 없습니다.'
    }
  },
  {
    id: 'comparison',
    title: '효율성 비교 (Efficiency)',
    definition: '데이터 크기(n)가 커질수록 탐색 횟수의 차이가 급격히 벌어짐',
    keywords: ['최악의 경우', '비례(N) vs 로그(logN)', '비용'],
    example: '도서관 책 100만 권: 순차는 최대 100만 번, 이진은 최대 약 20번 비교',
    misconception: {
      text: '이진 탐색이 무조건 좋다?',
      correction: '데이터가 자주 추가/삭제되어 정렬을 계속 다시 해야 한다면, 정렬 비용 때문에 순차 탐색이 나을 수도 있습니다.'
    },
    checkQuestion: {
      question: '데이터가 1,000배 늘어나면 이진 탐색의 비교 횟수도 1,000배 늘어난다.',
      answer: false,
      explanation: '이진 탐색은 로그 방식이므로 비교 횟수는 아주 조금만 늘어납니다.'
    }
  }
];

export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 'q1',
    conceptId: 'linear_def',
    difficulty: 'easy',
    question: '순차 탐색의 가장 큰 장점은 무엇인가요?',
    options: [
      '데이터가 엄청 많을 때 빠르다.',
      '데이터가 정렬되어 있지 않아도 바로 쓸 수 있다.',
      '반드시 중앙값부터 찾는다.',
      '한 번에 절반씩 데이터를 버린다.'
    ],
    correctAnswer: 1,
    explanation: '순차 탐색은 정렬이라는 전제 조건이 필요 없다는 것이 가장 큰 장점입니다.'
  },
  {
    id: 'q2',
    conceptId: 'binary_def',
    difficulty: 'easy',
    question: '다음 중 이진 탐색을 사용하기 위해 반드시 필요한 조건은?',
    options: [
      '데이터의 개수가 짝수여야 한다.',
      '데이터가 무작위로 섞여 있어야 한다.',
      '데이터가 정렬되어 있어야 한다.',
      '데이터가 모두 숫자여야 한다.'
    ],
    correctAnswer: 2,
    explanation: '이진 탐색(Binary Search)은 정렬된 데이터에서만 작동합니다.'
  },
  {
    id: 'q3',
    conceptId: 'comparison',
    difficulty: 'medium',
    question: '업다운 게임을 하고 있습니다. 1부터 100 사이의 숫자 중 술래가 70을 생각했습니다. 이진 탐색으로 찾는 첫 번째 숫자는?',
    options: ['1', '100', '50', '70'],
    correctAnswer: 2,
    explanation: '이진 탐색은 항상 중앙값부터 부릅니다. (1+100)/2 = 50.5 -> 보통 50을 부릅니다.'
  },
  {
    id: 'q4',
    conceptId: 'comparison',
    difficulty: 'hard',
    question: '데이터가 1,000,000(백만)개 있습니다. 이진 탐색으로 찾을 때 최악의 경우 약 몇 번 비교할까요?',
    options: ['약 20번', '약 1,000번', '약 500,000번', '약 1,000,000번'],
    correctAnswer: 0,
    explanation: '2의 20승이 약 100만이므로, 약 20번만 비교하면 찾을 수 있습니다. (log2(1,000,000) ≈ 19.9)'
  },
  {
    id: 'q5',
    conceptId: 'binary_def',
    difficulty: 'medium',
    question: '[10, 20, 30, 40, 50] 에서 45를 이진 탐색으로 찾으려 합니다. 탐색 실패까지 몇 번 비교할까요? (중앙값 인덱스 = length/2 내림)',
    options: ['1번', '2번', '3번', '5번'],
    correctAnswer: 2,
    explanation: '1. (30)비교->큼 2. (40,50)중 (40)비교->큼 3. (50)비교->작음 -> 데이터 없음. (구현 방식에 따라 2~3회)'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'novice_explorer',
    name: '탐색 입문자',
    description: '레벨 2 달성',
    icon: '🌱',
    condition: (state: UserState) => state.level >= 2
  },
  {
    id: 'binary_master',
    name: '정렬 조건 파수꾼',
    description: '이진 탐색 개념 마스터리 80점 이상',
    icon: '⚖️',
    condition: (state: UserState) => (state.mastery['binary_def'] || 0) >= 80
  },
  {
    id: 'streak_king',
    name: '성실한 탐험가',
    description: '3일 연속 학습',
    icon: '🔥',
    condition: (state: UserState) => state.streak >= 3
  }
];
