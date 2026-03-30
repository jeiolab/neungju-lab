export interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  icon: string;
}

export interface Customer {
  name: string;
  money: number;
  inventory: { item: Item; count: number }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface StoreState {
  revenue: number;
}

export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  DEEP_DIVE = 'DEEP_DIVE',
  QUIZ = 'QUIZ',
  THINK = 'THINK',
}