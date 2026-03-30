export interface Capability {
  id: string;
  name: string;
  category: 'general' | 'specialized';
  selected: boolean;
}

export interface WizardData {
  // Step 1
  targetJob: string;
  jobReason: string;
  
  // Step 2
  capabilities: Capability[];
  
  // Step 3
  requirements: string;
  duties: string;
  longTermGoal: string;
  
  // Step 4
  searchWhere: string;
  searchWhen: string;
  searchWhat: string;

  // Reflection
  failureScenario: string;
  contingencyPlan: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  badges: string[]; // 'completed_wizard', 'info_master', 'quiz_whiz'
  completedSteps: number[]; // 1, 2, 3, 4
  quizScore: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
  REPORT = 'REPORT'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TheoryCard {
  title: string;
  content: string;
  icon: string;
}
