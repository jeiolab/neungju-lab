export enum MissionType {
  OX_REASON = 'OX_REASON',
  CLASSIFICATION = 'CLASSIFICATION',
  PIPELINE_PUZZLE = 'PIPELINE_PUZZLE',
  DATA_ISSUE = 'DATA_ISSUE',
}

export interface MissionData {
  id: string; // usually date string
  type: MissionType;
  title: string;
  description: string;
  content: any; // specific structure depends on type
  correctAnswer: any;
  explanation: string;
  conceptTags: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface WrongNote {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  date: string;
  tag: string;
}

export interface UserState {
  lastCompletedDate: string | null;
  streak: number;
  points: number;
  badges: string[];
  mastery: Record<string, number>; // Tag -> 0-100 score
  wrongNotes: WrongNote[];
  missionHistory: { date: string; score: number }[];
  apiKey: string | null;
}

export interface Concept {
  title: string;
  description: string;
  example: string;
}

export type View = 'HOME' | 'MISSION' | 'QUIZ' | 'DASHBOARD' | 'THINK';
