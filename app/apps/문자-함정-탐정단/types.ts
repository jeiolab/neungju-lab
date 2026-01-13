export type RiskLevel = '안전' | '위험' | '조건부';
export type Channel = '문자' | 'DM' | '이메일' | '단톡';
export type Difficulty = '쉬움' | '보통' | '도전';

export interface ConceptCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

export interface GameCard {
  id: string;
  text: string;
  sender: string;
  channel: Channel;
  riskLabel: RiskLevel;
  difficulty: Difficulty;
  redFlags: string[]; // Correct reasons
  allReasons: string[]; // Options to choose from
  bestAction: string;
  explanation: string;
  conceptTags: string[];
}

export interface QuizQuestion {
  id: number;
  type: '객관식' | '단답형' | '서술형';
  question: string;
  options?: string[];
  answer: string | string[]; // Array for multiple keywords in essay
  explanation: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: string;
  quizQuestion: string;
  quizAnswer: string; // True/False or simple option
}

export interface UserState {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  lastLogin: string;
  gameHistory: {
    totalPlayed: number;
    correctCount: number;
    weakTags: Record<string, number>; // Tag -> Failure count
  };
  checklist: string[]; // Toggled red flags
}