import { SortType, SortDirection, AnimationStep } from '../types';

// Helper to compare based on direction
const compare = (a: number, b: number, direction: SortDirection): boolean => {
  return direction === SortDirection.ASC ? a > b : a < b;
};

// Generate random array
export const generateRandomArray = (count: number): number[] => {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * 90) + 10; // 10 to 99
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
};

export const generateSteps = (
  initialArray: number[],
  type: SortType,
  direction: SortDirection
): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const array = [...initialArray]; // Copy to mutate locally
  const n = array.length;

  // Initial Step
  steps.push({
    array: [...array],
    highlightIndices: [],
    swapIndices: [],
    sortedIndices: [],
    description: "정렬을 시작합니다.",
  });

  if (type === SortType.BUBBLE) {
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare Step
        steps.push({
          array: [...array],
          highlightIndices: [j, j + 1],
          swapIndices: [],
          sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
          description: `${array[j]}와(과) ${array[j + 1]}를 비교합니다.`,
        });

        if (compare(array[j], array[j + 1], direction)) {
          // Swap logic
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          // Swap Step
          steps.push({
            array: [...array],
            highlightIndices: [j, j + 1],
            swapIndices: [j, j + 1],
            sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
            description: `순서가 맞지 않으므로 위치를 바꿉니다.`,
          });
        }
      }
      // End of pass, element at n-1-i is sorted
      steps.push({
        array: [...array],
        highlightIndices: [],
        swapIndices: [],
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
        description: `${n - 1 - i}번 인덱스 위치가 확정되었습니다.`,
      });
    }
  } else if (type === SortType.SELECTION) {
    for (let i = 0; i < n - 1; i++) {
      let extremeIndex = i; // min or max index depending on direction
      
      steps.push({
        array: [...array],
        highlightIndices: [i],
        swapIndices: [],
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        pivotIndex: extremeIndex,
        description: `${i}번째 위치에 들어갈 값을 찾습니다. 현재 기준값은 ${array[i]}입니다.`,
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...array],
          highlightIndices: [j],
          swapIndices: [],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          pivotIndex: extremeIndex,
          description: `${array[j]}와 현재 선택된 값 ${array[extremeIndex]}를 비교합니다.`,
        });

        const shouldUpdate = direction === SortDirection.ASC 
          ? array[j] < array[extremeIndex] 
          : array[j] > array[extremeIndex];

        if (shouldUpdate) {
          extremeIndex = j;
          steps.push({
            array: [...array],
            highlightIndices: [j],
            swapIndices: [],
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            pivotIndex: extremeIndex,
            description: `더 적합한 값 ${array[extremeIndex]}를 찾았습니다!`,
          });
        }
      }

      if (extremeIndex !== i) {
        const temp = array[i];
        array[i] = array[extremeIndex];
        array[extremeIndex] = temp;
        
        steps.push({
          array: [...array],
          highlightIndices: [i, extremeIndex],
          swapIndices: [i, extremeIndex],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          description: `${i}번째 위치로 ${array[i]}를 이동합니다.`,
        });
      } else {
        steps.push({
          array: [...array],
          highlightIndices: [i],
          swapIndices: [],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          description: `현재 위치의 값이 이미 올바릅니다.`,
        });
      }
    }
  } else if (type === SortType.INSERTION) {
    // 0 is trivially sorted
    for (let i = 1; i < n; i++) {
      let currentVal = array[i];
      let j = i - 1;

      steps.push({
        array: [...array],
        highlightIndices: [i],
        swapIndices: [],
        sortedIndices: Array.from({ length: i }, (_, k) => k), // visual indicator of sorted part
        pivotIndex: i,
        description: `정렬되지 않은 영역의 첫 번째 값 ${currentVal}을 선택합니다.`,
      });

      while (j >= 0 && compare(array[j], currentVal, direction)) {
        steps.push({
          array: [...array],
          highlightIndices: [j],
          swapIndices: [],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          pivotIndex: j + 1, // Where currentVal is temporarily effectively sitting
          description: `${array[j]}와 ${currentVal}을 비교합니다. ${array[j]}를 뒤로 밀어냅니다.`,
        });

        array[j + 1] = array[j];
        j--;
        
        // Visualize the shift
        steps.push({
          array: [...array],
          highlightIndices: [j + 1],
          swapIndices: [j + 1], // slight cheat to show movement
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          pivotIndex: j + 1, // The hole
          description: `공간을 만듭니다.`,
        });
      }

      array[j + 1] = currentVal;
      steps.push({
        array: [...array],
        highlightIndices: [j + 1],
        swapIndices: [],
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        description: `${currentVal}을(를) 적절한 위치인 ${j + 1}번에 삽입합니다.`,
      });
    }
  }

  // Final Step - All Sorted
  steps.push({
    array: [...array],
    highlightIndices: [],
    swapIndices: [],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    description: "정렬이 완료되었습니다!",
  });

  return steps;
};