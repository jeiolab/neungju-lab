import { HuffmanNode, FrequencyMap } from '../types';

export const calculateFrequency = (text: string): FrequencyMap => {
  const freq: FrequencyMap = {};
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
};

export const createLeafNodes = (freq: FrequencyMap): HuffmanNode[] => {
  return Object.entries(freq).map(([char, count], index) => ({
    id: `leaf-${char}-${index}`,
    char,
    freq: count,
  }));
};

// Generates the final tree automatically (for verification/skipping)
export const buildFullHuffmanTree = (text: string): HuffmanNode | null => {
  const freq = calculateFrequency(text);
  let nodes = createLeafNodes(freq);

  if (nodes.length === 0) return null;

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    const parent: HuffmanNode = {
      id: `node-${left.id}-${right.id}`,
      char: null,
      freq: left.freq + right.freq,
      left,
      right
    };
    nodes.push(parent);
  }
  return nodes[0];
};

export const generateCodes = (node: HuffmanNode | undefined, currentCode: string = '', map: Record<string, string> = {}): Record<string, string> => {
  if (!node) return map;

  if (node.char !== null) {
    map[node.char] = currentCode;
  }

  generateCodes(node.left, currentCode + '0', map);
  generateCodes(node.right, currentCode + '1', map);
  return map;
};

export const calculateBits = (text: string, codeMap: Record<string, string>): number => {
  let bits = 0;
  for (const char of text) {
    bits += codeMap[char]?.length || 8;
  }
  return bits;
};