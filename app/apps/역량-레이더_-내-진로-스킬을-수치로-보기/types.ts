export type CompetencyType = 
  | 'knowledge' 
  | 'computational' 
  | 'creative' 
  | 'communication' 
  | 'community';

export const COMPETENCIES: CompetencyType[] = [
  'knowledge', 
  'computational', 
  'creative', 
  'communication', 
  'community'
];

export interface CompetencyDef {
  id: CompetencyType;
  name: string;
  description: string;
  misconception: string;
  icon: string;
}

export interface JobProfile {
  id: string;
  name: string;
  category: string;
  requiredCompetencies: CompetencyType[];
  description: string;
}

export interface QuizQuestion {
  id: number;
  competency: CompetencyType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  errorType: 'definition_confusion' | 'application_error' | 'term_confusion';
}

export interface Scenario {
  id: number;
  situation: string;
  correctCompetency: CompetencyType;
  feedback: string;
}

export interface WrongNote {
  id: string;
  questionId: number;
  userAnswer: number;
  timestamp: number;
  errorType: 'definition_confusion' | 'application_error' | 'term_confusion';
}

export interface UserData {
  name: string;
  selectedJobId: string | null;
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  baselineScores: Record<CompetencyType, number>; // 1-5
  
  // Daily Actions
  actionPlanChecks: Record<string, boolean>; // key: "YYYY-MM-DD_competencyId"
  
  // Stats for Mastery Calculation
  quizStats: Record<CompetencyType, { correct: number; total: number }>;
  scenarioStats: Record<CompetencyType, { correct: number; total: number }>;
  
  wrongNotes: WrongNote[];
  badges: string[];
}
