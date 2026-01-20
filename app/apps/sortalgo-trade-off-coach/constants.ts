import { Algorithm, QuizQuestion, Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'huge-data',
    title: '데이터가 매우 큼 (1만+)',
    description: '쇼핑몰의 전체 상품 목록을 가격순으로 정렬해야 합니다. 데이터 양이 방대하여 O(N²) 알고리즘은 사용할 수 없습니다.',
    icon: '📊',
  },
  {
    id: 'low-memory',
    title: '메모리가 부족함',
    description: '오래된 임베디드 기기에서 센서 데이터를 정렬합니다. 추가적인 메모리 할당(배열 복사 등)이 제한됩니다.',
    icon: '💾',
  },
  {
    id: 'almost-sorted',
    title: '이미 거의 정렬됨',
    description: '채팅방 메시지 목록처럼, 대부분 시간순으로 와있지만 네트워크 지연으로 몇 개만 순서가 뒤바뀐 상태입니다.',
    icon: '✅',
  },
  {
    id: 'predictable',
    title: '예측 가능성 중요 (Real-time)',
    description: '학교 급식 줄서기 시스템. 최악의 경우(Worst Case)가 발생하여 시스템이 멈추는 것을 절대 허용하면 안 됩니다.',
    icon: '⏱️',
  },
];

export const ALGORITHMS: Algorithm[] = [
  {
    id: 'bubble',
    name: '버블 정렬 (Bubble Sort)',
    description: '인접한 두 원소를 비교하여 교환. 구현은 쉽지만 비효율적.',
    complexityTime: 'O(N²)',
    complexitySpace: 'O(1)',
    isStable: true,
    baseScores: { time: 2, memory: 10, predictability: 8 },
  },
  {
    id: 'selection',
    name: '선택 정렬 (Selection Sort)',
    description: '가장 작은 값을 찾아 앞으로 이동. 교환 횟수는 적지만 비교는 많이 함.',
    complexityTime: 'O(N²)',
    complexitySpace: 'O(1)',
    isStable: false,
    baseScores: { time: 2, memory: 10, predictability: 8 },
  },
  {
    id: 'insertion',
    name: '삽입 정렬 (Insertion Sort)',
    description: '카드를 정렬하듯 적절한 위치에 삽입. 거의 정렬된 상태에서 매우 빠름.',
    complexityTime: 'O(N²)',
    complexitySpace: 'O(1)',
    isStable: true,
    baseScores: { time: 3, memory: 10, predictability: 7 }, // Time boost logic handles scenario
  },
  {
    id: 'merge',
    name: '합병 정렬 (Merge Sort)',
    description: '반으로 나누고 합치며 정렬. 빠르고 안정적이나 추가 메모리가 필요.',
    complexityTime: 'O(N log N)',
    complexitySpace: 'O(N)',
    isStable: true,
    baseScores: { time: 8, memory: 4, predictability: 10 },
  },
  {
    id: 'quick',
    name: '퀵 정렬 (Quick Sort)',
    description: '피벗을 기준으로 분할. 평균적으로 가장 빠르지만 피벗 선택에 따라 최악의 성능.',
    complexityTime: 'O(N log N)',
    complexitySpace: 'O(log N)',
    isStable: false,
    baseScores: { time: 9, memory: 7, predictability: 2 }, // Low predictability due to pivot worst case
  },
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "퀵 정렬에서 최악의 시간 복잡도 O(N²)이 발생하는 경우는?",
    options: [
      "피벗이 항상 리스트의 중간값일 때",
      "이미 정렬된 데이터에서 가장 큰/작은 값을 피벗으로 계속 선택할 때",
      "데이터의 개수가 짝수일 때",
      "메모리가 부족할 때"
    ],
    correctAnswer: 1,
    explanation: "퀵 정렬은 불균형하게 분할될 때 성능이 저하됩니다. 이미 정렬된 배열에서 양끝값을 피벗으로 잡으면 최악입니다."
  },
  {
    id: 2,
    question: "다음 중 '안정 정렬(Stable Sort)'이 아닌 것은?",
    options: ["버블 정렬", "삽입 정렬", "합병 정렬", "퀵 정렬"],
    correctAnswer: 3,
    explanation: "퀵 정렬은 원소들이 피벗을 기준으로 건너뛰며 이동하기 때문에 원래의 순서가 보장되지 않는 불안정 정렬입니다."
  },
  {
    id: 3,
    question: "메모리가 극도로 제한된 상황에서 가장 피해야 할 알고리즘은?",
    options: ["힙 정렬", "합병 정렬", "삽입 정렬", "선택 정렬"],
    correctAnswer: 1,
    explanation: "합병 정렬(Merge Sort)은 데이터를 합병하는 과정에서 입력 크기만큼의 추가 메모리 공간(O(N))이 필요합니다."
  },
  {
    id: 4,
    question: "데이터가 거의 정렬되어 있을 때 가장 효율적인 알고리즘은?",
    options: ["퀵 정렬", "합병 정렬", "삽입 정렬", "선택 정렬"],
    correctAnswer: 2,
    explanation: "삽입 정렬은 이미 정렬된 부분은 비교만 하고 지나가므로, 거의 정렬된 데이터에서는 O(N)에 가까운 성능을 냅니다."
  },
  {
    id: 5,
    question: "퀵 정렬의 성능을 개선하기 위한 방법으로 올바른 것은?",
    options: ["항상 첫 번째 원소를 피벗으로 쓴다", "항상 마지막 원소를 피벗으로 쓴다", "랜덤하게 피벗을 선택하거나 Median-of-3를 쓴다", "추가 메모리를 많이 쓴다"],
    correctAnswer: 2,
    explanation: "피벗을 랜덤하게 선택하거나 3개 값의 중앙값을 선택하면 최악의 시나리오를 피할 확률이 높아집니다."
  },
  {
    id: 6,
    question: "다음 중 분할 정복(Divide and Conquer) 방식을 사용하는 알고리즘 쌍은?",
    options: ["버블 정렬, 선택 정렬", "삽입 정렬, 퀵 정렬", "합병 정렬, 퀵 정렬", "선택 정렬, 합병 정렬"],
    correctAnswer: 2,
    explanation: "합병 정렬과 퀵 정렬은 문제를 작은 문제로 나누어 해결하는 분할 정복 기법을 사용합니다."
  },
  {
    id: 7,
    question: "학교 급식 줄처럼 '먼저 온 사람이 먼저 먹는' 순서를 유지해야 한다면 무엇이 중요한가?",
    options: ["시간 복잡도", "공간 복잡도", "안정성(Stability)", "피벗 선택"],
    correctAnswer: 2,
    explanation: "키 순서로 정렬하더라도, 키가 같다면 먼저 온 순서를 유지해야 하므로 안정성이 중요합니다."
  },
  {
    id: 8,
    question: "시간 복잡도 O(N log N)을 보장해야 하며, 최악의 경우를 피하고 싶다면?",
    options: ["퀵 정렬", "합병 정렬", "버블 정렬", "삽입 정렬"],
    correctAnswer: 1,
    explanation: "합병 정렬은 데이터 상태와 무관하게 항상 분할/합병하므로 O(N log N)을 보장합니다."
  },
  {
    id: 9,
    question: "선택 정렬(Selection Sort)의 특징으로 옳은 것은?",
    options: ["데이터 이동(교환) 횟수가 비교적 적다", "거의 정렬된 상태에서 매우 빠르다", "안정 정렬이다", "메모리를 많이 쓴다"],
    correctAnswer: 0,
    explanation: "선택 정렬은 매 회전마다 딱 한 번만 교환(Swap)이 일어나므로, 교환 비용이 비싼 경우 유리할 수 있습니다."
  },
  {
    id: 10,
    question: "트레이드오프(Trade-off)의 의미로 가장 적절한 것은?",
    options: ["모든 면에서 완벽한 해결책을 찾는 것", "하나를 얻으면 다른 하나를 희생해야 하는 관계", "알고리즘의 이름을 외우는 것", "무조건 속도가 빠른 것을 고르는 것"],
    correctAnswer: 1,
    explanation: "시간을 줄이면 메모리를 더 쓰거나, 메모리를 아끼면 시간이 더 걸리는 등 상충 관계를 이해하는 것이 중요합니다."
  }
];
