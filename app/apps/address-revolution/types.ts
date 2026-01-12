export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type SectionId = 'concept' | 'visualizer' | 'learn-more' | 'quiz' | 'discussion';

export interface NavItem {
  id: SectionId;
  label: string;
}