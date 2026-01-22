export interface HuffmanNode {
  id: string;
  char: string | null; // null for internal nodes
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  code?: string;
  isNew?: boolean; // For animation highlighting
}

export interface FrequencyMap {
  [char: string]: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export type Tab = 'ops' | 'codebook' | 'security' | 'defense' | 'cipher';

export enum EncryptionType {
  COMPRESSION = 'COMPRESSION',
  ENCRYPTION = 'ENCRYPTION'
}