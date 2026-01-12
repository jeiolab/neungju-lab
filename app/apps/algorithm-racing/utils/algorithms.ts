import { SearchStep } from '../types';

export const generateSortedData = (size: number): number[] => {
  return Array.from({ length: size }, (_, i) => i + 1);
};

export const generateSequentialSteps = (data: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  for (let i = 0; i < data.length; i++) {
    const isMatch = data[i] === target;
    steps.push({
      index: i,
      value: data[i],
      found: isMatch,
    });
    if (isMatch) break;
  }
  return steps;
};

export const generateBinarySteps = (data: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  let low = 0;
  let high = data.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = data[mid];
    const isMatch = midVal === target;

    steps.push({
      index: mid,
      value: midVal,
      low,
      high,
      found: isMatch,
    });

    if (isMatch) break;

    if (midVal < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // If not found (shouldn't happen in this app's context but good for robustness)
  return steps;
};
