import { FrequencyMap, HuffmanNode, CodeMap } from '../types';

export const getFrequency = (text: string): FrequencyMap => {
  const map: FrequencyMap = {};
  for (const char of text) {
    map[char] = (map[char] || 0) + 1;
  }
  return map;
};

export const createLeafNodes = (freqMap: FrequencyMap): HuffmanNode[] => {
  return Object.entries(freqMap)
    .map(([char, count], index) => ({
      id: `leaf-${char}-${index}`,
      char,
      count,
      left: null,
      right: null,
    }))
    .sort((a, b) => a.count - b.count); // Sort ascending initially
};

// Helper to assign bits (0/1) recursively
export const generateCodes = (node: HuffmanNode | null, currentCode: string = '', map: CodeMap = {}): CodeMap => {
  if (!node) return map;

  if (node.char !== null) {
    map[node.char] = currentCode;
  }

  generateCodes(node.left, currentCode + '0', map);
  generateCodes(node.right, currentCode + '1', map);
  return map;
};

// Helper to assign codes to the tree structure itself for visualization
export const assignCodesToTree = (node: HuffmanNode | null, currentCode: string = ''): void => {
  if (!node) return;
  node.code = currentCode;
  assignCodesToTree(node.left, currentCode + '0');
  assignCodesToTree(node.right, currentCode + '1');
};

export const stringToBinary = (text: string, codeMap: CodeMap): string => {
  return text.split('').map(char => codeMap[char] || '').join('');
};

export const stringToAsciiBinary = (text: string): string => {
  // Simple simulation: 8 bits per char
  return text.split('').map(() => '01100001').join(''); 
};
