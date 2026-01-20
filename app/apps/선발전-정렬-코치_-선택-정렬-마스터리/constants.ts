import { ConceptCard, QuizQuestion, Student } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: '김철수', korean: 80, math: 90, info: 75, total: 245 },
  { id: '2', name: '이영희', korean: 95, math: 85, info: 100, total: 280 },
  { id: '3', name: '박민수', korean: 70, math: 60, info: 95, total: 225 },
  { id: '4', name: '최지혜', korean: 88, math: 92, info: 88, total: 268 },
  { id: '5', name: '정우성', korean: 60, math: 70, info: 60, total: 190 },
];

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'concept_def',
    title: '선택 정렬(Selection Sort)이란?',
    definition: '가장 작은(또는 큰) 데이터를 찾아 "선택"하여 맨 앞부터 차례대로 옮기는 정렬 방식입니다.',
    keywords: ['최솟값 선택', '제자리 정렬', 'O(N²)'],
    example: '운동장에서 키가 가장 작은 학생을 찾아 맨 앞줄로 보내고, 그 다음 작은 학생을 찾아 두 번째 줄로 보낸다.',
    misconception: {
      myth: '선택 정렬은 매번 옆 사람과 자리를 바꾼다?',
      truth: '아닙니다! 전체를 훑어 최솟값을 찾은 뒤, 기준 위치와 단 한 번만 교환합니다. (버블 정렬과 다름)'
    },
    checkQuestion: {
      question: '선택 정렬이 1회전 끝났을 때 확실히 알 수 있는 것은?',
      options: ['전체가 정렬된다', '가장 작은 값이 맨 앞에 있다', '가장 큰 값이 맨 앞에 있다', '아무 변화가 없다'],
      correctIndex: 1
    }
  },
  {
    id: 'concept_process',
    title: '정렬 진행 과정 (알고리즘)',
    definition: '기준 위치(i)를 정하고, 나머지 범위(i+1 ~ 끝)에서 최솟값을 찾아 i와 교환합니다.',
    keywords: ['기준 인덱스(i)', '비교 인덱스(j)', 'SWAP'],
    example: '[5, 3, 8, 1] -> 1. (5와 1 교환) -> [1, 3, 8, 5] -> 2. (3은 그대로) -> ...',
    misconception: {
      myth: '최솟값을 찾으면 바로바로 교환한다?',
      truth: '아니요. 끝까지 훑어서 "찐" 최솟값의 위치(Index)만 기억했다가, 회전이 끝날 때 딱 한 번 교환합니다.'
    },
    checkQuestion: {
      question: '데이터가 5개일 때, 선택 정렬은 총 몇 번의 회전(Pass)을 수행할까요?',
      options: ['3번', '4번', '5번', '25번'],
      correctIndex: 1
    }
  },
  {
    id: 'concept_compare',
    title: '비교와 교환의 차이',
    definition: '비교는 자주 일어나지만(O(N²)), 교환(Swap)은 데이터 개수(N)만큼만 일어납니다.',
    keywords: ['비교 횟수 많음', '교환 횟수 적음', '비효율적이지만 단순'],
    example: '물건 100개를 정리할 때, 눈으로 훑는 것(비교)은 수천 번 하지만 실제로 물건을 옮기는 것(교환)은 100번 미만이다.',
    misconception: {
      myth: '선택 정렬이 버블 정렬보다 무조건 느리다?',
      truth: '교환 비용이 매우 비싼 시스템에서는 선택 정렬이 버블 정렬보다 유리할 수 있습니다(교환이 적으니까!).'
    },
    checkQuestion: {
      question: '선택 정렬의 시간 복잡도는?',
      options: ['O(1)', 'O(N)', 'O(N log N)', 'O(N²)'],
      correctIndex: 3
    }
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    difficulty: 'easy',
    type: 'multiple',
    question: '선택 정렬에서 첫 번째 회전이 끝나면 정렬된 상태가 보장되는 위치는?',
    options: ['맨 마지막', '맨 처음', '정가운데', '없음'],
    correctAnswer: '맨 처음',
    feedback: {
      reason: '선택 정렬은 전체 중 최솟값을 찾아 "맨 앞"으로 가져옵니다.',
      correction: '가장 작은 값이 첫 번째 자리에 확정됩니다.',
      retryQuestion: '3번째 회전이 끝나면 앞에서부터 몇 개가 정렬되어 있을까요? (답: 3개)'
    }
  },
  {
    id: 2,
    difficulty: 'medium',
    type: 'multiple',
    question: '[30, 10, 50, 20]을 오름차순 선택 정렬할 때, 1회전 후의 결과는?',
    options: ['[10, 30, 50, 20]', '[10, 20, 30, 50]', '[30, 10, 20, 50]', '[10, 30, 20, 50]'],
    correctAnswer: '[10, 30, 50, 20]',
    feedback: {
      reason: '최솟값 10을 찾아서 맨 앞의 30과 교환합니다.',
      correction: '30과 10의 자리가 바뀝니다. 나머지는 그대로입니다.',
      retryQuestion: '[5, 4, 3, 2, 1] 1회전 결과는? (답: [1, 4, 3, 2, 5])'
    }
  },
  {
    id: 3,
    difficulty: 'hard',
    type: 'short',
    question: '선택 정렬은 (    ) 정렬 알고리즘 중 하나로, 추가적인 메모리 공간을 거의 사용하지 않는다.',
    correctAnswer: '제자리',
    feedback: {
      reason: 'In-place sorting을 우리말로 제자리 정렬이라고 합니다.',
      correction: '입력 배열 내부에서 교환이 이루어지므로 제자리 정렬입니다.',
      retryQuestion: '선택 정렬의 시간 복잡도는 O(   ) 이다. 괄호 안은? (답: N^2)'
    }
  }
];

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000]; // Level 1, 2, 3, 4, 5
