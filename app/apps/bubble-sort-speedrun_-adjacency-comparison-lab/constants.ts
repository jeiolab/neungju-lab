import { QuizQuestion } from './types';

export const BADGES = [
  { id: 'first_sort', name: '첫 정렬 성공', icon: '🎓', desc: '처음으로 정렬을 완료했습니다.' },
  { id: 'perfect_swap', name: '최소 교환 마스터', icon: '✨', desc: '불필요한 교환 없이 완료했습니다.' },
  { id: 'speedster', name: '스피드 러너', icon: '⚡', desc: '10초 안에 정렬을 완료했습니다.' },
  { id: 'quiz_whiz', name: '이론 박사', icon: '🧠', desc: '퀴즈 점수 80점 이상 달성.' },
];

export const INITIAL_USER_DATA = {
  level: 1,
  xp: 0,
  streak: 0,
  lastLogin: '',
  badges: [],
  history: [],
  mistakeNote: [],
  mastery: { concept: 0, mechanism: 0, complexity: 0 },
};

export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    question: '버블 정렬에서 비교는 항상 어떤 요소끼리 이루어지나요?',
    options: ['맨 처음과 맨 끝', '무작위 두 요소', '인접한 두 요소', '가장 큰 값과 작은 값'],
    correctAnswer: '인접한 두 요소',
    explanation: '버블 정렬의 핵심은 서로 붙어있는(인접한) 두 요소를 비교하고 교환하는 것입니다.'
  },
  {
    id: 2,
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    question: '1회전(Pass)이 끝나면 확실하게 정렬되는 위치는 어디인가요?',
    options: ['맨 앞', '중간', '맨 뒤', '알 수 없음'],
    correctAnswer: '맨 뒤',
    explanation: '큰 값이 거품처럼 뒤로 밀려나므로, 1회전 후에는 가장 큰 값이 맨 뒤에 고정됩니다.'
  },
  {
    id: 3,
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    question: '데이터가 5개일 때, 첫 번째 회전에서 최대 비교 횟수는?',
    options: ['3회', '4회', '5회', '10회'],
    correctAnswer: '4회',
    explanation: 'N개 데이터의 1회전 비교 횟수는 N-1회입니다.'
  },
  {
    id: 4,
    difficulty: 'MEDIUM',
    type: 'SHORT_ANSWER',
    question: '버블 정렬의 평균 시간 복잡도를 Big-O 표기법으로 쓰시오 (예: O(1))',
    options: [],
    correctAnswer: 'O(n^2)',
    explanation: '이중 루프를 사용하므로 데이터 개수의 제곱에 비례하는 시간이 걸립니다.'
  },
  {
    id: 5,
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    question: '이미 정렬된 데이터에 대해 개량된 버블 정렬(Swap Flag 사용)의 최선 시간 복잡도는?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctAnswer: 'O(n)',
    explanation: '교환이 한 번도 일어나지 않음을 감지하면 1회전 만에 종료할 수 있어 O(n)이 됩니다.'
  },
  {
    id: 6,
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    question: '다음 중 버블 정렬이 효율적인 경우는?',
    options: ['데이터가 역순일 때', '데이터가 거의 정렬되어 있을 때', '데이터가 무작위일 때', '데이터가 매우 클 때'],
    correctAnswer: '데이터가 거의 정렬되어 있을 때',
    explanation: '거의 정렬된 상태에서는 교환 횟수가 적어 비교적 빠르게 수행됩니다.'
  },
  {
    id: 7,
    difficulty: 'HARD',
    type: 'SHORT_ANSWER',
    question: '데이터 개수가 10개일 때, 모든 회전을 마쳤을 때 총 비교 횟수(최악)는?',
    options: [],
    correctAnswer: '45',
    explanation: '9+8+7+...+1 = 45회입니다. n(n-1)/2 공식에 대입하면 10*9/2 = 45.'
  },
  {
    id: 8,
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    question: '버블 정렬은 "안정 정렬(Stable Sort)" 인가요?',
    options: ['네', '아니요', '경우에 따라 다름'],
    correctAnswer: '네',
    explanation: '같은 값인 경우 교환하지 않으므로 기존 순서가 유지됩니다.'
  },
  {
    id: 9,
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    question: '버블 정렬의 이름 유래는?',
    options: ['거품이 터지는 소리', '작은 값이 거품처럼 위로(앞으로) 올라와서', '개발자 이름이 Bubble', '코드가 거품처럼 복잡해서'],
    correctAnswer: '작은 값이 거품처럼 위로(앞으로) 올라와서',
    explanation: '가벼운(작은) 값이 마치 물속 거품처럼 위로 떠오르는 현상에서 유래했습니다.'
  },
  {
    id: 10,
    difficulty: 'HARD',
    type: 'SHORT_ANSWER',
    question: '버블 정렬에서 k번째 회전 수행 시, 뒤에서 몇 개의 데이터가 정렬 확정 상태입니까? (숫자만)',
    options: [],
    correctAnswer: 'k',
    explanation: '1회전 후 1개, 2회전 후 2개가 뒤에서부터 확정됩니다.'
  }
];