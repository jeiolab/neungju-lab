import { BigOCardData, QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "데이터가 거의 정렬되어 있을 때 가장 효율적인 알고리즘은 무엇일까요?",
    options: ["퀵 정렬 (Quick Sort)", "버블 정렬 (Bubble Sort)", "선택 정렬 (Selection Sort)", "삽입 정렬 (Insertion Sort)"],
    correctAnswer: 3,
    explanation: "삽입 정렬은 이미 정렬된 부분에 대해서는 비교만 하고 넘어가기 때문에 최선의 경우 O(n)의 시간 복잡도를 가집니다."
  },
  {
    id: 2,
    question: "다음 중 평균 시간 복잡도가 가장 빠른 알고리즘은?",
    options: ["버블 정렬", "삽입 정렬", "퀵 정렬", "선택 정렬"],
    correctAnswer: 2,
    explanation: "퀵 정렬의 평균 시간 복잡도는 O(n log n)으로, 다른 O(n²) 알고리즘보다 훨씬 빠릅니다."
  },
  {
    id: 3,
    question: "선택 정렬(Selection Sort)의 가장 큰 특징은 무엇인가요?",
    options: ["교환 횟수가 적다", "비교 횟수가 적다", "메모리를 많이 쓴다", "가장 빠르다"],
    correctAnswer: 0,
    explanation: "선택 정렬은 매 회전마다 최솟값을 찾아 한 번만 교환하므로, 데이터 이동(교환) 비용이 비쌀 때 유리할 수 있습니다."
  },
  {
    id: 4,
    question: "가장 최악의 경우(역순 정렬) 버블 정렬의 시간 복잡도는?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 3,
    explanation: "버블 정렬은 모든 요소를 서로 비교하고 교환해야 하므로 O(n²)이 소요됩니다."
  },
  {
    id: 5,
    question: "퀵 정렬이 최악의 성능(O(n²))을 보이는 경우는 언제인가요?",
    options: ["랜덤 데이터일 때", "데이터가 너무 많을 때", "이미 정렬된 데이터에서 피벗을 잘못 골랐을 때", "데이터가 짝수 개일 때"],
    correctAnswer: 2,
    explanation: "이미 정렬된 데이터에서 첫 번째나 마지막 요소를 피벗으로 선택하면 불균형 분할이 일어나 성능이 떨어집니다."
  }
];

export const BIG_O_CARDS: BigOCardData[] = [
  {
    title: "O(n²)",
    complexity: "이차 시간 (Quadratic Time)",
    description: "데이터가 늘어날수록 시간이 제곱으로 늘어납니다. 10개면 100초, 100개면 10,000초!",
    analogy: "모든 학생이 반의 다른 모든 학생과 한 번씩 악수하는 상황."
  },
  {
    title: "O(n log n)",
    complexity: "선형 로그 시간 (Linearithmic Time)",
    description: "데이터를 절반씩 나누어 처리하여 매우 빠릅니다. 효율적인 정렬의 기준점입니다.",
    analogy: "전화번호부를 절반씩 쪼개며 이름을 찾는 것과 비슷해요."
  },
  {
    title: "O(n)",
    complexity: "선형 시간 (Linear Time)",
    description: "데이터 양만큼 정직하게 시간이 늘어납니다.",
    analogy: "책의 첫 페이지부터 끝 페이지까지 한 장씩 넘겨보는 것."
  }
];
