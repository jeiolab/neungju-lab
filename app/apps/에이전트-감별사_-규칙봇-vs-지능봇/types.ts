export type AgentType = 'GENERAL' | 'INTELLIGENT';

export type ReasoningTag = 
  | 'PERCEPTION' // 인식
  | 'LEARNING'   // 학습
  | 'REASONING'  // 추론
  | 'ACTION'     // 행동
  | 'AUTONOMY'   // 자율
  | 'COOPERATION'// 협력
  | 'GOAL';      // 목표

export interface SituationCard {
  id: string;
  title: string;
  description: string;
  correctType: AgentType;
  correctReasoning: ReasoningTag[];
  explanation: string; // Why it is this type
  imageUrl?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Misconception {
  id: string;
  title: string;
  description: string;
  correction: string;
}

export interface GameState {
  score: number;
  level: number;
  streak: number;
  completedCards: string[];
  badges: string[];
}