import { Badge, Difficulty, QuizQuestion, Scenario, UserStats } from './types';
import { Trophy, Zap, BookOpen, Brain, Star } from 'lucide-react';

export const INITIAL_STATS: UserStats = {
  score: 0,
  streak: 0,
  maxStreak: 0,
  totalPlayed: 0,
  badges: [],
  misconceptions: {
    ignoreSorting: 0,
    alwaysFast: 0,
    dynamicCost: 0,
  },
  wrongNotes: [],
};

export const BADGES: Badge[] = [
  {
    id: 'first_blood',
    name: '탐색의 시작',
    description: '첫 번째 문제를 맞췄습니다.',
    icon: '🌱',
    condition: (stats) => stats.score > 0,
  },
  {
    id: 'streak_master',
    name: '연속 정답자',
    description: '5문제 연속 정답을 달성했습니다.',
    icon: '🔥',
    condition: (stats) => stats.maxStreak >= 5,
  },
  {
    id: 'concept_guardian',
    name: '정렬 조건 수호자',
    description: '정렬되지 않은 데이터 함정을 10회 피했습니다.',
    icon: '🛡️',
    condition: (stats) => stats.totalPlayed >= 10 && stats.misconceptions.ignoreSorting < 3, // simplified logic
  },
  {
    id: 'algo_master',
    name: '알고리즘 마스터',
    description: '총점 1000점을 돌파했습니다.',
    icon: '👑',
    condition: (stats) => stats.score >= 1000,
  },
];

// Fallback scenarios if API fails
export const STATIC_SCENARIOS: Scenario[] = [
  {
    id: 's1',
    category: 'SCHOOL',
    description: '우리 반 출석부는 번호 순서대로 정렬되어 있다. 15번 학생이 있는지 확인하려 한다.',
    dataState: 'SORTED',
    target: 'EXISTENCE',
    correctAnswer: 'POSSIBLE',
    explanation: '데이터가 번호순으로 이미 정렬되어 있으므로 이진 탐색을 바로 적용할 수 있습니다.',
    difficulty: Difficulty.EASY,
  },
  {
    id: 's2',
    category: 'LIFE',
    description: '도서관 반납 카트에 책들이 무작위로 쌓여있다. "해리포터" 책을 찾고 싶다.',
    dataState: 'UNSORTED',
    target: 'EXISTENCE',
    correctAnswer: 'IMPOSSIBLE',
    explanation: '정렬되지 않은 데이터에서는 이진 탐색을 사용할 수 없습니다. 순차 탐색을 해야 합니다.',
    difficulty: Difficulty.EASY,
  },
  {
    id: 's3',
    category: 'SCHOOL',
    description: '수행평가 점수가 입력된 엑셀 파일이 있다. 점수 순으로 보기는 어렵지만 정렬 버튼을 누를 수 있다. 특정 점수 받은 학생을 빨리 찾고 싶다.',
    dataState: 'UNSORTED',
    target: 'EXISTENCE',
    correctAnswer: 'CONDITIONAL',
    explanation: '현재는 정렬되지 않았지만, 정렬 비용을 감수하고 정렬을 수행한 후라면 이진 탐색이 가능합니다.',
    difficulty: Difficulty.NORMAL,
  },
  {
    id: 's4',
    category: 'CAREER',
    description: '실시간으로 계속해서 새로운 주문이 들어오는(추가되는) 배달 앱 주문 목록에서 특정 주문번호를 찾으려 한다.',
    dataState: 'DYNAMIC',
    target: 'EXISTENCE',
    correctAnswer: 'IMPOSSIBLE',
    explanation: '데이터가 빈번하게 추가/삭제되는 경우, 항상 정렬 상태를 유지하는 비용이 매우 큽니다. 일반적인 배열 이진 탐색보다는 해시 테이블이나 트리 구조가 적합합니다.',
    difficulty: Difficulty.HARD,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "이진 탐색을 수행하기 위한 필수 전제 조건은?",
    options: ["데이터가 많아야 한다", "데이터가 정렬되어 있어야 한다", "데이터가 숫자여야 한다", "컴퓨터 성능이 좋아야 한다"],
    correctIndex: 1,
    explanation: "이진 탐색은 중앙값과 비교하여 탐색 범위를 반으로 줄여나가므로, 반드시 대소 비교가 가능한 순서로 정렬되어 있어야 합니다."
  },
  {
    id: 2,
    question: "데이터가 1,000개일 때, 순차 탐색(최악)과 이진 탐색(최악)의 비교 횟수 차이는?",
    options: ["1000번 vs 1000번", "1000번 vs 500번", "1000번 vs 약 10번", "500번 vs 10번"],
    correctIndex: 2,
    explanation: "순차 탐색은 최악의 경우 N번(1000), 이진 탐색은 log₂N(약 10)번 비교합니다."
  },
  {
    id: 3,
    question: "정렬되지 않은 데이터에서 이진 탐색을 시도하면 어떤 일이 발생하는가?",
    options: ["속도가 조금 느려진다", "정확한 값을 찾을 수 보장이 없다", "컴퓨터가 멈춘다", "자동으로 정렬된다"],
    correctIndex: 1,
    explanation: "정렬되지 않았다면 중앙값이 전체 범위의 중간값이라는 보장이 없으므로, 탐색 방향을 결정할 수 없어 값을 찾지 못할 수 있습니다."
  }
];