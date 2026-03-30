export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'coffee' | 'ade' | 'dessert';
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface FileSystem {
  [filename: string]: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options?: string[];
  type: 'choice' | 'input';
  answer: string;
  explanation: string;
  difficulty: '초급' | '중급' | '고급';
}

export type TabType = 'theory' | 'simulation' | 'escape' | 'quiz' | 'explorer';