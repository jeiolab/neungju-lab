import { HuffmanNode } from '../types';

export const calculateFrequencies = (text: string): Map<string, number> => {
  const freqMap = new Map<string, number>();
  for (const char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }
  return freqMap;
};

export const createInitialNodes = (freqMap: Map<string, number>): HuffmanNode[] => {
  return Array.from(freqMap.entries()).map(([char, freq], index) => ({
    id: `leaf-${index}-${char}`,
    char,
    freq,
    isLeaf: true,
  })).sort((a, b) => a.freq - b.freq);
};

// Generates codes recursively
export const generateCodes = (node: HuffmanNode, currentCode: string = '', codes: Map<string, string> = new Map()) => {
  if (node.isLeaf && node.char) {
    codes.set(node.char, currentCode);
    node.code = currentCode;
  }
  
  if (node.left) {
    generateCodes(node.left, currentCode + '0', codes);
  }
  if (node.right) {
    generateCodes(node.right, currentCode + '1', codes);
  }
  return codes;
};

export const calculateTotalBits = (text: string, codes: Map<string, string>): number => {
  let total = 0;
  for (const char of text) {
    total += codes.get(char)?.length || 8; // Default to 8 if not found (shouldn't happen)
  }
  return total;
};

export const calculateOriginalBits = (text: string): number => {
  return text.length * 8; // Assuming ASCII/UTF-8 single byte for simplicity in explanation
};
