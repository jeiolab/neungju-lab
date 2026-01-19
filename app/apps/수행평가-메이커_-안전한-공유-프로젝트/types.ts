export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  defaultGoal: string;
  suggestedData: string[];
}

export interface ProjectData {
  templateId: string;
  goal: string;
  collectedData: string[]; // Step 2
  sharingScope: 'class' | 'grade' | 'school' | 'public'; // Step 3
  protectionMeasures: string[]; // Step 4
  outputFormat: 'report' | 'poster' | 'webpage'; // Step 5
  isMinimizationChecked: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'privacy' | 'copyright' | 'security' | 'balance';
}

export interface TheoryCardData {
  id: string;
  title: string;
  content: string;
  icon: string;
  category: 'sharing' | 'protection' | 'balance';
}

export type AppView = 'home' | 'theory' | 'simulation' | 'wizard' | 'quiz' | 'thinking';