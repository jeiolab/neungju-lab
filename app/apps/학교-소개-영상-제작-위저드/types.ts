export type Role = 'Planning' | 'Camera' | 'Audio' | 'Editing';

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  phase: 'Planning' | 'Production' | 'Post-Production';
  dependencies: string[]; // IDs of tasks that must finish before this starts
  assignedTo?: string; // TeamMember ID
  date?: string;
  durationMin?: number;
  completed?: boolean;
}

export interface ProjectConfig {
  teamSize: number;
  videoDuration: number; // minutes
  concept: 'Emotional' | 'Informative' | 'Humorous';
  availableDays: number;
}

export interface GameState {
  score: number;
  badges: string[];
  streak: number;
  lastLogin: string; // YYYY-MM-DD
  completedWizardSteps: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type WizardStep = 
  | 'analysis' 
  | 'breakdown1' 
  | 'breakdown2' 
  | 'dependencies' 
  | 'scheduling';
