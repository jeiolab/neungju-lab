import { AlgorithmType, SortStep } from '../types';

// Helper to yield a step
const createStep = (
  array: number[],
  activeIndices: number[],
  sortedIndices: number[],
  comparisons: number,
  swaps: number
): SortStep => ({
  array: [...array],
  activeIndices: [...activeIndices],
  sortedIndices: [...sortedIndices],
  comparisons,
  swaps,
});

export function* getSorter(
  type: AlgorithmType,
  initialArray: number[]
): Generator<SortStep, SortStep, void> {
  switch (type) {
    case AlgorithmType.BUBBLE:
      return yield* bubbleSort(initialArray);
    case AlgorithmType.SELECTION:
      return yield* selectionSort(initialArray);
    case AlgorithmType.INSERTION:
      return yield* insertionSort(initialArray);
    case AlgorithmType.QUICK:
      return yield* quickSort(initialArray);
    default:
      return yield* bubbleSort(initialArray);
  }
}

function* bubbleSort(arr: number[]): Generator<SortStep, SortStep, void> {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield createStep(array, [j, j + 1], sortedIndices, comparisons, swaps);

      if (array[j] > array[j + 1]) {
        swaps++;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        yield createStep(array, [j, j + 1], sortedIndices, comparisons, swaps);
      }
    }
    sortedIndices.push(n - i - 1);
  }
  // Finish
  yield createStep(array, [], Array.from({ length: n }, (_, i) => i), comparisons, swaps);
  return createStep(array, [], Array.from({ length: n }, (_, i) => i), comparisons, swaps);
}

function* selectionSort(arr: number[]): Generator<SortStep, SortStep, void> {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield createStep(array, [minIdx, j], sortedIndices, comparisons, swaps);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      swaps++;
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      yield createStep(array, [i, minIdx], sortedIndices, comparisons, swaps);
    }
    sortedIndices.push(i);
  }
  
  const allSorted = Array.from({ length: n }, (_, i) => i);
  yield createStep(array, [], allSorted, comparisons, swaps);
  return createStep(array, [], allSorted, comparisons, swaps);
}

function* insertionSort(arr: number[]): Generator<SortStep, SortStep, void> {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;
  // Initially, index 0 is considered sorted
  const sortedIndices: number[] = [0];

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;

    // Visualizing the selection of key
    yield createStep(array, [i], sortedIndices, comparisons, swaps);

    // Note: Standard insertion sort usually counts assignments, but for visual comparison with bubble,
    // we often count the shifts as "swaps" or "writes". Here we'll count comparisons and "swaps" (shifts).
    
    // Check if we need to enter the loop
    if (j >= 0) {
        comparisons++;
        yield createStep(array, [j, j+1], sortedIndices, comparisons, swaps);
    }

    while (j >= 0 && array[j] > key) {
      if (j < i - 1) { // Count comparison for subsequent loop iterations
          comparisons++;
      }
      
      array[j + 1] = array[j];
      swaps++; // Treating shift as a swap for metric purposes
      yield createStep(array, [j, j + 1], sortedIndices, comparisons, swaps);
      j = j - 1;
    }
    array[j + 1] = key;
    sortedIndices.push(i); // Roughly expanding the sorted window
    yield createStep(array, [j + 1], sortedIndices, comparisons, swaps);
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  yield createStep(array, [], allSorted, comparisons, swaps);
  return createStep(array, [], allSorted, comparisons, swaps);
}

// Iterative Quick Sort to avoid complex recursion in generator
function* quickSort(arr: number[]): Generator<SortStep, SortStep, void> {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;
  // Quick sort doesn't really have a "stable" sorted section until the end, 
  // but we can track pivots. For simplicity, we won't populate sortedIndices actively.
  const sortedIndices: number[] = [];

  const stack: number[] = [];
  stack.push(0);
  stack.push(n - 1);

  while (stack.length > 0) {
    const high = stack.pop()!;
    const low = stack.pop()!;

    if (low < high) {
        // Partition
        const pivot = array[high];
        let i = low - 1;

        for (let j = low; j <= high - 1; j++) {
            comparisons++;
            yield createStep(array, [j, high], sortedIndices, comparisons, swaps);

            if (array[j] < pivot) {
                i++;
                if (i !== j) {
                    swaps++;
                    [array[i], array[j]] = [array[j], array[i]];
                    yield createStep(array, [i, j], sortedIndices, comparisons, swaps);
                }
            }
        }
        
        swaps++;
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        yield createStep(array, [i + 1, high], sortedIndices, comparisons, swaps);
        
        const pi = i + 1;
        sortedIndices.push(pi); // Pivot is in correct place

        // Push right side
        stack.push(pi + 1);
        stack.push(high);
        
        // Push left side
        stack.push(low);
        stack.push(pi - 1);
    } else if (low === high) {
        sortedIndices.push(low);
    }
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  yield createStep(array, [], allSorted, comparisons, swaps);
  return createStep(array, [], allSorted, comparisons, swaps);
}