import { AlgorithmType, ArraySnapshot } from '../types';

// Helper to copy array
const copy = (arr: number[]) => [...arr];

export const generateRandomArray = (length: number = 10, min: number = 5, max: number = 100): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

// Returns a sequence of snapshots for the entire sort process
export const getBubbleSortSteps = (initialArray: number[]): ArraySnapshot[] => {
  const steps: ArraySnapshot[] = [];
  let arr = copy(initialArray);
  const n = arr.length;
  let sortedCount = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: copy(arr),
        highlights: [j, j + 1],
        sortedIndices: Array.from({ length: sortedCount }, (_, k) => n - 1 - k),
        description: `${arr[j]}와(과) ${arr[j+1]} 비교 중`
      });
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: copy(arr),
          highlights: [j, j + 1],
          sortedIndices: Array.from({ length: sortedCount }, (_, k) => n - 1 - k),
          description: `${arr[j]}와(과) ${arr[j+1]} 교환됨`
        });
      }
    }
    sortedCount++;
  }
  // Final state
  steps.push({
    array: copy(arr),
    highlights: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: "정렬 완료"
  });
  return steps;
};

export const getSelectionSortSteps = (initialArray: number[]): ArraySnapshot[] => {
  const steps: ArraySnapshot[] = [];
  let arr = copy(initialArray);
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    steps.push({
        array: copy(arr),
        highlights: [i],
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        description: `인덱스 ${i}부터 최솟값 탐색 시작`
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: copy(arr),
        highlights: [minIdx, j],
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        description: `현재 최솟값 ${arr[minIdx]}와(과) ${arr[j]} 비교`
      });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    steps.push({
        array: copy(arr),
        highlights: [i],
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        description: `${arr[i]}를 인덱스 ${i}에 배치`
    });
  }
  return steps;
};

export const getInsertionSortSteps = (initialArray: number[]): ArraySnapshot[] => {
  const steps: ArraySnapshot[] = [];
  let arr = copy(initialArray);
  const n = arr.length;

  // Initially index 0 is sorted
  steps.push({
    array: copy(arr),
    highlights: [0],
    sortedIndices: [0],
    description: "초기 상태: 첫 번째 원소는 정렬된 것으로 간주"
  });

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    steps.push({
        array: copy(arr),
        highlights: [i],
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        description: `정렬된 부분에 삽입할 ${key} 선택`
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: copy(arr),
        highlights: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, k) => k), // Roughly speaking
        description: `${arr[j]}를 뒤로 이동`
      });
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
    steps.push({
        array: copy(arr),
        highlights: [j + 1],
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        description: `${key}를 위치 ${j + 1}에 삽입`
    });
  }
  return steps;
};

// Simplified Quick Sort Steps (Recursive capture)
export const getQuickSortSteps = (initialArray: number[]): ArraySnapshot[] => {
    const steps: ArraySnapshot[] = [];
    let arr = copy(initialArray);
    
    const partition = (low: number, high: number) => {
        const pivot = arr[high];
        let i = low - 1;
        
        steps.push({
            array: copy(arr),
            highlights: [high],
            sortedIndices: [], 
            pivotIndex: high,
            description: `피벗 선택됨: ${pivot}`
        });

        for (let j = low; j < high; j++) {
            steps.push({
                array: copy(arr),
                highlights: [j, high],
                sortedIndices: [],
                pivotIndex: high,
                description: `${arr[j]}와(과) 피벗 ${pivot} 비교`
            });
            
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                 steps.push({
                    array: copy(arr),
                    highlights: [i, j],
                    sortedIndices: [],
                    pivotIndex: high,
                    description: `작은 원소 ${arr[i]}를 왼쪽으로 교환`
                });
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({
            array: copy(arr),
            highlights: [i + 1],
            sortedIndices: [], // Track sorted indices is harder in quick sort recursively without complex state
            pivotIndex: i + 1,
            description: `피벗 ${pivot}이(가) 올바른 위치 ${i+1}에 배치됨`
        });
        return i + 1;
    }

    const quickSort = (low: number, high: number) => {
        if (low < high) {
            const pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }

    quickSort(0, arr.length - 1);
    
    // Add final sorted state
    steps.push({
        array: copy(arr),
        highlights: [],
        sortedIndices: Array.from({length: arr.length}, (_, k) => k),
        description: "정렬 완료"
    });

    return steps;
};

export const generateMystery = () => {
    const types = [AlgorithmType.Bubble, AlgorithmType.Selection, AlgorithmType.Insertion, AlgorithmType.Quick];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const arr = generateRandomArray(10); // Size 10 is good for visual puzzles
    
    let steps: ArraySnapshot[] = [];
    switch (selectedType) {
        case AlgorithmType.Bubble: steps = getBubbleSortSteps(arr); break;
        case AlgorithmType.Selection: steps = getSelectionSortSteps(arr); break;
        case AlgorithmType.Insertion: steps = getInsertionSortSteps(arr); break;
        case AlgorithmType.Quick: steps = getQuickSortSteps(arr); break;
    }

    // Pick a "middle" state (between 30% and 70% progress)
    const startRange = Math.floor(steps.length * 0.3);
    const endRange = Math.floor(steps.length * 0.7);
    const mysteryIndex = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
    
    return {
        type: selectedType,
        initialArray: arr,
        snapshot: steps[mysteryIndex],
        fullHistory: steps,
        mysteryIndex: mysteryIndex
    };
};