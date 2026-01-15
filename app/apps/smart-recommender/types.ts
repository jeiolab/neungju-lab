export interface Item {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface Receipt {
  id: number;
  items: string[]; // array of item IDs
}

export interface Rule {
  source: string;
  target: string;
  support?: number; // 0 to 1
  confidence?: number; // 0 to 1
  isCorrect?: boolean;
}

export enum AppTab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  QUIZ = 'quiz',
  ADVANCED = 'advanced',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ITEMS: Item[] = [
  { id: 'milk', name: '우유', emoji: '🥛', category: 'Dairy' },
  { id: 'bread', name: '빵', emoji: '🍞', category: 'Bakery' },
  { id: 'butter', name: '버터', emoji: '🧈', category: 'Dairy' },
  { id: 'diapers', name: '기저귀', emoji: '👶', category: 'Baby' },
  { id: 'beer', name: '맥주', emoji: '🍺', category: 'Alcohol' },
  { id: 'eggs', name: '계란', emoji: '🥚', category: 'Dairy' },
  { id: 'cola', name: '콜라', emoji: '🥤', category: 'Beverage' },
];