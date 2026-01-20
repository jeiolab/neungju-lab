export type TaskType = 'root' | 'category' | 'task';

export interface TaskNode {
  id: string;
  text: string;
  type: TaskType;
  parentId: string | null; // The ID of the parent this node belongs to logically
  description?: string;
}

export interface SimulationState {
  placedNodes: { [key: string]: TaskNode[] }; // key is parentId, value is list of children
  pool: TaskNode[];
  rootNode: TaskNode;
  score: number;
  completed: boolean;
}

export interface QuizQuestion {
  id: number;
  type: 'multiple' | 'short';
  question: string;
  options?: string[];
  answer: string | number;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (xp: number, completedSims: number, quizScore: number) => boolean;
}

export interface UserProgress {
  xp: number;
  unlockedBadges: string[];
  completedSimulations: string[];
  quizScore: number;
  reflectionNotes: string[];
}