import { AlgorithmInfo, Question } from './types';

export const ALGORITHMS: Record<string, AlgorithmInfo> = {
  Selection: {
    id: 'Selection',
    name: '선택 정렬 (Selection Sort)',
    description: '가장 작은 데이터를 찾아 맨 앞의 데이터와 교환하는 과정을 반복합니다.',
    keywords: ['최솟값 선택', '교환(Swap)', 'O(N²)'],
    bestCase: 'O(N²)',
    avgCase: 'O(N²)',
    worstCase: 'O(N²)',
    pros: ['구현이 매우 간단하다.', '교환 횟수가 적다.'],
    cons: ['데이터가 이미 정렬되어 있어도 느리다.', '불안정 정렬이다.'],
    codePython: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    codePseudo: `For i from 0 to N-1
  min_idx = i
  For j from i+1 to N-1
    If A[j] < A[min_idx]
      min_idx = j
  Swap A[i] and A[min_idx]`
  },
  Bubble: {
    id: 'Bubble',
    name: '버블 정렬 (Bubble Sort)',
    description: '인접한 두 데이터를 비교하여 순서가 바뀌어 있으면 위치를 교환합니다.',
    keywords: ['인접 교환', '가장 큰 값 뒤로', 'O(N²)'],
    bestCase: 'O(N) (이미 정렬된 경우)',
    avgCase: 'O(N²)',
    worstCase: 'O(N²)',
    pros: ['구현이 간단하다.', '안정 정렬(Stable Sort)이다.'],
    cons: ['교환 연산이 매우 많이 일어난다.', '효율이 좋지 않다.'],
    codePython: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`,
    codePseudo: `For i from 0 to N-1
  For j from 0 to N-i-1
    If A[j] > A[j+1]
      Swap A[j] and A[j+1]`
  },
  Insertion: {
    id: 'Insertion',
    name: '삽입 정렬 (Insertion Sort)',
    description: '데이터를 하나씩 확인하며, 적절한 위치에 삽입합니다.',
    keywords: ['적절한 위치', '앞부분 정렬됨', '거의 정렬될 때 빠름'],
    bestCase: 'O(N)',
    avgCase: 'O(N²)',
    worstCase: 'O(N²)',
    pros: ['데이터가 거의 정렬되어 있을 때 매우 빠르다.', '안정 정렬이다.'],
    cons: ['데이터 이동이 많다.', '데이터가 역순일 때 느리다.'],
    codePython: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j] :
                arr[j+1] = arr[j]
                j -= 1
        arr[j+1] = key`,
    codePseudo: `For i from 1 to N-1
  key = A[i]
  j = i - 1
  While j >= 0 and A[j] > key
    A[j+1] = A[j]
    j = j - 1
  A[j+1] = key`
  },
  Quick: {
    id: 'Quick',
    name: '퀵 정렬 (Quick Sort)',
    description: '기준(Pivot)을 설정하고 그보다 큰 데이터와 작은 데이터로 분할합니다.',
    keywords: ['피벗(Pivot)', '분할 정복', '재귀'],
    bestCase: 'O(N log N)',
    avgCase: 'O(N log N)',
    worstCase: 'O(N²) (피벗이 편향될 때)',
    pros: ['평균적으로 가장 빠르다.', '추가 메모리가 거의 필요 없다.'],
    cons: ['정렬된 데이터에서 피벗을 잘못 잡으면 느리다.', '불안정 정렬이다.'],
    codePython: `def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[0]
    tail = arr[1:]
    left = [x for x in tail if x <= pivot]
    right = [x for x in tail if x > pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)`,
    codePseudo: `Function QuickSort(arr, low, high)
  If low < high
    pi = Partition(arr, low, high)
    QuickSort(arr, low, pi-1)
    QuickSort(arr, pi+1, high)`
  },
  Merge: {
    id: 'Merge',
    name: '합병 정렬 (Merge Sort)',
    description: '리스트를 절반으로 나누고 정렬하여 다시 합칩니다.',
    keywords: ['절반 분할', '합치기(Merge)', '항상 O(N log N)'],
    bestCase: 'O(N log N)',
    avgCase: 'O(N log N)',
    worstCase: 'O(N log N)',
    pros: ['최악의 경우에도 빠르다.', '안정 정렬이다.'],
    cons: ['임시 배열을 위한 추가 메모리가 필요하다.'],
    codePython: `def merge_sort(arr):
    if len(arr) < 2: return arr
    mid = len(arr) // 2
    low_arr = merge_sort(arr[:mid])
    high_arr = merge_sort(arr[mid:])
    merged_arr = []
    l = h = 0
    while l < len(low_arr) and h < len(high_arr):
        if low_arr[l] < high_arr[h]:
            merged_arr.append(low_arr[l])
            l += 1
        else:
            merged_arr.append(high_arr[h])
            h += 1
    merged_arr += low_arr[l:]
    merged_arr += high_arr[h:]
    return merged_arr`,
    codePseudo: `Function MergeSort(arr)
  If length of arr <= 1 return arr
  mid = length / 2
  left = MergeSort(first half)
  right = MergeSort(second half)
  return Merge(left, right)`
  }
};

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    category: 'Bubble',
    question: '인접한 두 개의 데이터를 비교하여 순서를 바꾸는 정렬 알고리즘은?',
    options: ['선택 정렬', '버블 정렬', '삽입 정렬', '병합 정렬'],
    answer: '버블 정렬',
    explanation: '버블 정렬은 인접한 두 원소를 검사하여 정렬합니다.',
    difficulty: 'Easy'
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    category: 'Quick',
    question: '퀵 정렬의 최악의 경우 시간 복잡도는?',
    options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(1)'],
    answer: 'O(N²)',
    explanation: '이미 정렬된 배열에서 첫 번째 원소를 피벗으로 삼을 경우 등, 분할이 불균형하면 O(N²)이 됩니다.',
    difficulty: 'Medium'
  },
  {
    id: 'q3',
    type: 'fill-in-blank',
    category: 'Selection',
    question: '선택 정렬은 전체 데이터 중 [     ]을 찾아 맨 앞의 데이터와 교환합니다.',
    answer: '최솟값',
    explanation: '선택 정렬의 핵심은 매 회전마다 남은 데이터 중 최솟값을 찾는 것입니다.',
    difficulty: 'Easy'
  },
  {
    id: 'q4',
    type: 'fill-in-blank',
    category: 'Insertion',
    question: '삽입 정렬은 데이터가 거의 [     ]되어 있을 때 가장 효율적입니다.',
    answer: '정렬',
    explanation: '이미 정렬된 데이터에 대해서는 이동 없이 확인만 하므로 O(N)에 가깝게 동작합니다.',
    difficulty: 'Medium'
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    category: 'Merge',
    question: '합병 정렬(Merge Sort)의 단점은 무엇인가요?',
    options: ['시간 복잡도가 O(N²)이다', '불안정 정렬이다', '추가 메모리 공간이 필요하다', '구현이 너무 쉽다'],
    answer: '추가 메모리 공간이 필요하다',
    explanation: '합병 정렬은 분할된 리스트를 합치는 과정에서 임시 배열이 필요합니다.',
    difficulty: 'Medium'
  },
  {
    id: 'q6',
    type: 'multiple-choice',
    category: 'Quick',
    question: '퀵 정렬에서 리스트를 두 개의 부분 리스트로 나누는 기준이 되는 값을 무엇이라 하나요?',
    options: ['키(Key)', '인덱스(Index)', '피벗(Pivot)', '루트(Root)'],
    answer: '피벗(Pivot)',
    explanation: '퀵 정렬은 피벗을 기준으로 작은 값과 큰 값을 분할합니다.',
    difficulty: 'Easy'
  },
  {
    id: 'q7',
    type: 'flashcard',
    category: 'General',
    question: '안정 정렬(Stable Sort)이란?',
    answer: '중복된 키 값을 가진 요소들의 순서가 정렬 후에도 유지되는 정렬 방식.',
    explanation: '예: 버블, 삽입, 합병 정렬은 안정 정렬입니다.',
    difficulty: 'Hard'
  }
];
