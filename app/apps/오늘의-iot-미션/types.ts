export type TabType = 'concept' | 'experiment' | 'career' | 'quiz' | 'thinking';

export interface ConceptCard {
  id: string;
  title: string;
  category: 'Personal' | 'Social';
  content: string;
  quote: string; // "오늘의 핵심 한 줄"
  weakness: string; // 취약 개념
}

export interface CareerCard {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  streak: number;
  lastVisitDate: string;
  badges: string[];
  completedMissions: string[]; // List of completed dates (YYYY-MM-DD)
  skillsCollected: string[];
}

export interface ArgumentStructure {
  claim: string;
  evidence: string;
  condition: string;
  counterExample: string;
  alternative: string;
}

export interface ExperimentResult {
  automationLevel: number; // 0-100
  dataSharing: number; // 0-100
  acceptanceScore: number; // Calculated
  feedback: string;
}
