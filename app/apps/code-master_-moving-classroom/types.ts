export enum BlockType {
  START = 'START',
  SENSOR = 'SENSOR',
  LOGIC = 'LOGIC',
  ACTION = 'ACTION',
  END = 'END',
  VARIABLE = 'VARIABLE',
  ELSE = 'ELSE'
}

export interface CodeBlock {
  id: string;
  label: string;
  type: BlockType;
  codeSnippet: string; // Python equivalent
  param?: string | number; // For user input params
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  mission: string;
  availableBlocks: CodeBlock[];
  correctSequenceIds: string[][]; // Array of valid arrays of block IDs
  initialState: {
    temperature?: number;
    brightness?: number;
    motion?: boolean;
    fanOn?: boolean;
    lightOn?: boolean;
  };
}

export enum TabId {
  THEORY = 'theory',
  PUZZLE = 'puzzle',
  COMPARE = 'compare',
  QUIZ = 'quiz',
  REFLECTION = 'reflection'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options?: string[];
  answer: string; // Correct answer or keyword
  type: 'choice' | 'text';
}