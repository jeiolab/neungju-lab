import { Task, TaskType, QuizQuestion } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'wash',
    name: '세수 & 양치',
    type: TaskType.HYGIENE,
    baseDuration: 15,
    minDuration: 5,
    currentDuration: 15,
    qualityImpact: 5,
    fatigueImpact: -5,
    isParallel: false,
    canParallel: false,
  },
  {
    id: 'eat',
    name: '아침 식사',
    type: TaskType.FOOD,
    baseDuration: 20,
    minDuration: 5,
    currentDuration: 20,
    qualityImpact: 4,
    fatigueImpact: -10,
    isParallel: false,
    canParallel: true, // Can eat while packing or dressing (maybe)
  },
  {
    id: 'dress',
    name: '교복 입기',
    type: TaskType.PREP,
    baseDuration: 10,
    minDuration: 3,
    currentDuration: 10,
    qualityImpact: 3,
    fatigueImpact: 0,
    isParallel: false,
    canParallel: false,
  },
  {
    id: 'pack',
    name: '가방 챙기기',
    type: TaskType.PREP,
    baseDuration: 10,
    minDuration: 2,
    currentDuration: 10,
    qualityImpact: 2,
    fatigueImpact: 2,
    isParallel: false,
    canParallel: true, // Can pack while eating? No, but maybe while brushing teeth?
  },
  {
    id: 'transit',
    name: '버스 타고 이동',
    type: TaskType.TRANSIT,
    baseDuration: 30,
    minDuration: 20, // Running to station
    currentDuration: 30,
    qualityImpact: 0,
    fatigueImpact: 5,
    isParallel: false,
    canParallel: false,
  },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "분할 정복(Divide and Conquer)은 큰 문제를 작은 문제로 나누어 해결하는 방법이다.",
    answer: true,
    explanation: "맞습니다! 나폴레옹의 전술에서도 유래했으며, 알고리즘 설계의 핵심 기법 중 하나입니다."
  },
  {
    id: 2,
    question: "시간 복잡도 O(n^2)는 O(n log n)보다 항상 효율적이다.",
    answer: false,
    explanation: "틀렸습니다. 데이터가 많아질수록 O(n log n)이 O(n^2)보다 훨씬 빠르고 효율적입니다."
  },
  {
    id: 3,
    question: "병렬 처리(Parallel Processing)를 하면 항상 시간이 절반으로 줄어든다.",
    answer: false,
    explanation: "항상 그렇지는 않습니다. 작업 간의 의존성이나 자원(내 손은 두 개뿐!)의 한계로 인해 효율이 다를 수 있습니다."
  },
  {
    id: 4,
    question: "등교 준비 순서를 바꾸는 것은 알고리즘 최적화와 관련이 없다.",
    answer: false,
    explanation: "관련이 있습니다! 작업의 순서를 최적화(Scheduling)하여 대기 시간을 줄이거나 병렬 처리를 가능하게 하는 것은 중요한 최적화 과정입니다."
  }
];

export const APP_COLORS = {
  primary: 'blue',
  secondary: 'indigo',
  accent: 'amber',
  danger: 'red',
  success: 'green',
};
