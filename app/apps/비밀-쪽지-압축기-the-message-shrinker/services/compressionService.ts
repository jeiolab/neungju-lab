import { CompressionResult } from '../types';

export const calculateEfficiency = (original: string, compressed: string): number => {
  if (original.length === 0) return 0;
  // Simple byte count assumption (UTF-8 roughly, simplified for educational purposes)
  const origSize = new Blob([original]).size;
  const compSize = new Blob([compressed]).size;
  
  return parseFloat(((1 - compSize / origSize) * 100).toFixed(2));
};

export const runLengthEncoding = (text: string): CompressionResult => {
  if (!text) {
    return { original: '', compressed: '', ratio: 0, steps: [], isEfficient: false };
  }

  let compressed = '';
  const steps: string[] = [];
  let count = 1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === nextChar) {
      count++;
    } else {
      const part = `${char}${count}`;
      compressed += part;
      steps.push(`문자 '${char}'가 ${count}번 반복됨 -> ${part}`);
      count = 1;
    }
  }

  const ratio = calculateEfficiency(text, compressed);

  return {
    original: text,
    compressed,
    ratio,
    steps,
    isEfficient: ratio > 0,
  };
};

/**
 * A simplified Lempel-Ziv concept for educational purposes.
 * It looks for exact previous occurrences of substrings (min length 2) within a window.
 * This is closer to LZ77 conceptually but simplified to show "Dictionary/Pointer" logic.
 */
export const lempelZivEncoding = (text: string): CompressionResult => {
  if (!text) {
    return { original: '', compressed: '', ratio: 0, steps: [], isEfficient: false };
  }

  let compressed = '';
  const steps: string[] = [];
  let i = 0;

  while (i < text.length) {
    let bestMatchDistance = -1;
    let bestMatchLength = -1;

    // Search window (look back up to 20 chars for simplicity)
    const windowStart = Math.max(0, i - 20);
    const window = text.substring(windowStart, i);

    // Try to find the longest match in the window
    // We check lengths from 2 up to remaining length
    for (let len = 2; len <= Math.min(10, text.length - i); len++) {
      const sub = text.substring(i, i + len);
      const foundIndex = window.lastIndexOf(sub);
      
      if (foundIndex !== -1) {
        // Distance from current position back to start of match
        const distance = i - (windowStart + foundIndex);
        if (len > bestMatchLength) {
          bestMatchLength = len;
          bestMatchDistance = distance;
        }
      }
    }

    if (bestMatchLength > 0) {
      const token = `<${bestMatchDistance},${bestMatchLength}>`;
      const matchedStr = text.substring(i, i + bestMatchLength);
      compressed += token;
      steps.push(`패턴 "${matchedStr}" 발견! ${bestMatchDistance}칸 뒤에 ${bestMatchLength}글자 -> ${token}`);
      i += bestMatchLength;
    } else {
      compressed += text[i];
      // Do not log every single character literal to avoid spamming steps
      i++;
    }
  }

  const ratio = calculateEfficiency(text, compressed);

  return {
    original: text,
    compressed,
    ratio,
    steps,
    isEfficient: ratio > 0,
  };
};