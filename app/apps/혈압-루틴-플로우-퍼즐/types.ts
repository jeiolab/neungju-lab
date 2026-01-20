export type BlockType = 'start' | 'input' | 'condition' | 'process' | 'end' | 'loop_start' | 'loop_end';

export interface Block {
  id: string;
  type: BlockType;
  label: string;
  description?: string;
  isLocked?: boolean; // If true, cannot be moved/removed
  parentId?: string; // For nesting visualization
}

export interface PuzzleLevel {
  id: number;
  title: string;
  description: string;
  initialBlocks: (Block | null)[]; // null represents an empty slot
  availableBlocks: Block[]; // Blocks the user can drag in
  correctSequence: string[]; // Array of labels or IDs to check against
  hint: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  completedLevels: number[];
  quizScore: number;
  hintsUsed: number;
  reflections: { [key: string]: string };
}

export type TabView = 'theory' | 'puzzle' | 'advanced' | 'quiz' | 'reflection';