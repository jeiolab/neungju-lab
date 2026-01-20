import { Question, Badge } from './types';

export const BADGES: Badge[] = [
  { id: 'newbie', name: '탐색 입문자', description: '이름을 등록하고 학습을 시작했습니다.', icon: '🌱' },
  { id: 'concept_master', name: '개념 마스터', description: '탐색 이론 학습을 완료했습니다.', icon: '📘' },
  { id: 'binary_wizard', name: '이진 탐색 마스터', description: '퀴즈에서 80점 이상을 획득했습니다.', icon: '🧙‍♂️' },
  { id: 'thinker', name: '깊은 생각', description: '생각해볼 문제에 답변을 제출했습니다.', icon: '💡' },
];

export const QUIZ_DATA: Question[] = [
  {
    id: 1,
    difficulty: 'beginner',
    question: "순차 탐색(Linear Search)은 데이터가 정렬되어 있어야만 사용할 수 있다.",
    options: ["O", "X"],
    correctAnswer: "X",
    explanation: "순차 탐색은 정렬 여부와 상관없이 처음부터 끝까지 하나씩 확인하는 방법입니다."
  },
  {
    id: 2,
    difficulty: 'beginner',
    question: "이진 탐색(Binary Search)을 사용하기 위한 필수 전제 조건은?",
    options: ["데이터가 많아야 한다", "데이터가 정렬되어 있어야 한다", "데이터가 모두 숫자여야 한다", "데이터가 홀수 개여야 한다"],
    correctAnswer: "데이터가 정렬되어 있어야 한다",
    explanation: "이진 탐색은 반씩 범위를 줄여나가기 때문에 데이터가 반드시 순서대로 정렬되어 있어야 합니다."
  },
  {
    id: 3,
    difficulty: 'beginner',
    question: "데이터 100개가 있을 때, 순차 탐색의 최대 비교 횟수는?",
    correctAnswer: "100",
    explanation: "순차 탐색은 운이 나쁘면(찾는 데이터가 맨 끝에 있으면) 모든 데이터를 다 확인해야 합니다."
  },
  {
    id: 4,
    difficulty: 'intermediate',
    question: "다음 숫자 배열에서 이진 탐색으로 7을 찾을 때 가장 먼저 비교하는 숫자는? [1, 3, 5, 7, 9, 11, 13]",
    options: ["1", "13", "7", "5"],
    correctAnswer: "7",
    explanation: "가운데 인덱스에 위치한 값을 먼저 확인합니다. 7개의 데이터 중 가운데는 4번째인 7입니다."
  },
  {
    id: 5,
    difficulty: 'intermediate',
    question: "이진 탐색의 알고리즘 효율성(시간 복잡도)은?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(log n)",
    explanation: "탐색 범위를 반씩 줄여나가기 때문에 O(log n)의 효율을 가집니다."
  },
  {
    id: 6,
    difficulty: 'intermediate',
    question: "업다운(Up-Down) 게임은 어떤 탐색 알고리즘의 원리와 가장 유사한가?",
    options: ["순차 탐색", "이진 탐색", "해시 탐색", "너비 우선 탐색"],
    correctAnswer: "이진 탐색",
    explanation: "범위를 절반씩 줄여가며 정답을 찾는 과정이 이진 탐색과 동일합니다."
  },
  {
    id: 7,
    difficulty: 'advanced',
    question: "정렬되지 않은 데이터 배열에서 특정 값을 가장 빠르게 찾는 일반적인 방법은?",
    options: ["이진 탐색을 바로 적용한다", "순차 탐색을 사용한다", "무작위로 뽑는다", "데이터를 삭제한다"],
    correctAnswer: "순차 탐색을 사용한다",
    explanation: "정렬하는 데에도 시간이 걸리므로, 단 한 번의 탐색이라면 순차 탐색이 유리할 수 있습니다."
  },
  {
    id: 8,
    difficulty: 'advanced',
    question: "이진 탐색에서 검색 범위의 시작 인덱스를 low, 끝 인덱스를 high라고 할 때, 중간 인덱스 mid를 구하는 식은?",
    options: ["(low + high) * 2", "(low + high) / 2", "high - low", "low * high"],
    correctAnswer: "(low + high) / 2",
    explanation: "중간 위치는 시작과 끝 인덱스의 평균값(정수)으로 구합니다."
  },
  {
    id: 9,
    difficulty: 'advanced',
    question: "데이터가 1,024개 있을 때, 이진 탐색의 최대 비교 횟수는 약 몇 번인가?",
    correctAnswer: "10",
    explanation: "2의 10승이 1024이므로, 최대 10번 비교하면 찾을 수 있습니다 (log₂ 1024 = 10)."
  },
  {
    id: 10,
    difficulty: 'intermediate',
    question: "순차 탐색은 '선형 탐색'이라고도 부른다.",
    options: ["O", "X"],
    correctAnswer: "O",
    explanation: "데이터를 선(Line)을 따라가듯 찾는다고 하여 Linear Search라고 합니다."
  }
];