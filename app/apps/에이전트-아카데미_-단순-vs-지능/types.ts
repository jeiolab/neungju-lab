export enum AgentType {
  SIMPLE = '단순 에이전트',
  INTELLIGENT = '지능 에이전트'
}

export interface AgentData {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  specs: {
    inputs: string;
    mechanism: string;
    details: string;
  };
  iconName: string; 
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  gamesPlayed: number;
  highScore: number;
  maxCombo: number;
  quizScore: number;
  streakDays: number;
}

export interface IdeaNote {
  id: string;
  targetObject: string;
  idea: string;
  createdAt: number;
}