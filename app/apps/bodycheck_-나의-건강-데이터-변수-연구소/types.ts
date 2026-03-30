export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  MORE = 'MORE'
}

export interface UserStats {
  xp: number;
  badges: string[];
  streak: number;
}

export interface QuizQuestion {
  id: number;
  difficulty: '초급' | '중급' | '고급';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedType: 'int' | 'float' | 'str' | 'bool';
}

export enum DataType {
  INT = 'int',
  FLOAT = 'float',
  STR = 'str',
  BOOL = 'bool'
}
