import { QuizQuestion, ConceptCard } from './types';

export const SORTING_CONCEPTS: Record<string, ConceptCard> = {
  BUBBLE: { title: '버블 정렬', description: '인접한 두 원소를 비교하며 교환합니다. 가장 큰(작은) 원소가 거품처럼 끝으로 이동합니다.', icon: 'ArrowRightLeft' },
  SELECTION: { title: '선택 정렬', description: '전체 중 최솟값을 찾아 맨 앞과 교환하는 방식을 반복합니다.', icon: 'MousePointerClick' },
  INSERTION: { title: '삽입 정렬', description: '이미 정렬된 부분과 비교하여 자신의 위치를 찾아 삽입합니다. 데이터가 거의 정렬되어 있을 때 매우 빠릅니다.', icon: 'ArrowDownToLine' },
  QUICK: { title: '퀵 정렬', description: '피벗(Pivot)을 기준으로 작은 값과 큰 값을 분할(Divide)하며 정복합니다.', icon: 'Scissors' },
  MERGE: { title: '합병 정렬', description: '리스트를 절반으로 쪼갠 뒤 다시 합치며(Merge) 정렬합니다. 추가 메모리 공간이 필요합니다.', icon: 'GitMerge' },
  COMPARE: { title: '비교 횟수', description: '알고리즘 효율성의 핵심 지표입니다. 보통 N제곱(O(n²))이나 N로그N(O(n log n))을 따릅니다.', icon: 'Scale' },
  STABLE: { title: '안정성', description: '값이 같은 원소끼리의 순서가 정렬 후에도 유지되는 성질입니다.', icon: 'Anchor' },
};

export const QUIZ_BANK: QuizQuestion[] = [
  { id: 1, question: '다음 중 "불안정 정렬"에 해당하는 것은?', options: ['버블 정렬', '삽입 정렬', '퀵 정렬', '합병 정렬'], correctIndex: 2, explanation: '퀵 정렬은 피벗 교환 과정에서 상대적 순서가 바뀔 수 있어 불안정 정렬입니다.', tag: 'QUICK' },
  { id: 2, question: '데이터가 거의 정렬되어 있을 때 가장 효율적인 O(n^2) 알고리즘은?', options: ['선택 정렬', '버블 정렬', '삽입 정렬', '퀵 정렬'], correctIndex: 2, explanation: '삽입 정렬은 정렬된 상태에서는 비교만 하고 이동하지 않으므로 O(n)에 가깝게 동작합니다.', tag: 'INSERTION' },
  { id: 3, question: '합병 정렬(Merge Sort)의 시간 복잡도는?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctIndex: 1, explanation: '합병 정렬은 항상 리스트를 절반으로 나누므로 최악의 경우에도 O(n log n)을 보장합니다.', tag: 'MERGE' },
  { id: 4, question: '버블 정렬의 최악의 경우 비교 횟수 공식은?', options: ['n', 'n(n-1)/2', 'n log n', 'n^2'], correctIndex: 1, explanation: '1부터 n-1까지의 합이므로 n(n-1)/2 입니다.', tag: 'BUBBLE' },
  { id: 5, question: '퀵 정렬의 성능을 결정하는 가장 중요한 요소는?', options: ['메모리 크기', '피벗(Pivot)의 선택', '데이터의 타입', 'CPU 속도'], correctIndex: 1, explanation: '피벗이 중앙값을 잘 나타내야 분할이 균등하게 이루어져 효율적입니다.', tag: 'QUICK' },
  { id: 6, question: '추가적인 메모리 공간이 가장 많이 필요한 정렬은?', options: ['힙 정렬', '퀵 정렬', '합병 정렬', '선택 정렬'], correctIndex: 2, explanation: '합병 정렬은 병합 과정에서 원본 크기만큼의 임시 배열이 필요합니다.', tag: 'MERGE' },
  { id: 7, question: '선택 정렬에 대한 설명으로 옳은 것은?', options: ['안정 정렬이다', '입력 데이터 순서에 민감하다', '비교 횟수는 항상 일정하다', '추가 공간이 많이 필요하다'], correctIndex: 2, explanation: '선택 정렬은 데이터 상태와 무관하게 항상 O(n^2)번 비교합니다.', tag: 'SELECTION' },
  { id: 8, question: '도서관 책을 번호 순서대로 정리할 때, 책을 하나씩 뽑아 적절한 위치에 꽂는 방식은?', options: ['삽입 정렬', '선택 정렬', '버블 정렬', '계수 정렬'], correctIndex: 0, explanation: '이미 정리된 서가에 새 책을 꽂는 행위는 삽입 정렬의 전형적인 예시입니다.', tag: 'INSERTION' },
  { id: 9, question: '다음 중 O(n log n) 알고리즘이 아닌 것은?', options: ['합병 정렬', '힙 정렬', '퀵 정렬(평균)', '버블 정렬'], correctIndex: 3, explanation: '버블 정렬은 O(n^2) 입니다.', tag: 'BUBBLE' },
  { id: 10, question: '퀵 정렬의 최악 시간 복잡도는?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctIndex: 2, explanation: '이미 정렬된 데이터를 대상으로 첫 번째 원소를 피벗으로 잡으면 O(n^2)이 됩니다.', tag: 'QUICK' },
];
