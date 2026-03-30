export interface HuffmanNode {
  id: string;
  char: string | null; // null for internal nodes
  count: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  code?: string; // Assigned in the final step
  isNew?: boolean; // For animation highlighting
}

export interface FrequencyMap {
  [char: string]: number;
}

export type AppStep = 'INPUT' | 'FREQUENCY' | 'TREE_BUILD' | 'RESULT';

export interface CodeMap {
  [char: string]: string;
}
