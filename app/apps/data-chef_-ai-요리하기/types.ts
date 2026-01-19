export type TabType = 'theory' | 'simulation' | 'deepdive' | 'quiz' | 'ethics';

export interface Ingredient {
  id: number;
  type: 'good' | 'noise'; // good = fresh, noise = rotten
  name: string;
  isSelected: boolean; // For selection logic
}

export interface SimulationState {
  stage: number; // 0: Prep, 1: Split, 2: Train, 3: Eval
  ingredients: Ingredient[];
  cleanedCount: number;
  noiseRemovedCount: number;
  totalNoise: number;
  isSplitCorrectly: boolean; // True if Test set was kept separate
  selectedModel: 'classification' | 'prediction' | null;
  accuracy: number;
  feedback: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}