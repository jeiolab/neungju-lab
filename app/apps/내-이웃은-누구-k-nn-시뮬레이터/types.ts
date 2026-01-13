export type ClassType = 'red' | 'blue' | 'neutral';

export interface Point {
  id: string;
  x: number;
  y: number;
  type: ClassType;
}

export interface Neighbor extends Point {
  distance: number;
}

export enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  DEEP_DIVE = 'deep_dive',
  QUIZ = 'quiz',
  REFLECTION = 'reflection'
}
