export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  TIPS = 'TIPS',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export enum SecurityRank {
  ROOKIE = '견습 보안관',
  JUNIOR = '주니어 보안관',
  SENIOR = '시니어 보안관',
  EXPERT = '보안 전문가',
  WHITE_HACKER = '화이트 해커'
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  isSafe: boolean; // true = Safe to allow, false = Risky (should block)
  reasoning: string;
  consequence: string; // What happens if you make the wrong choice
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NewsReport {
  headline: string;
  content: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
