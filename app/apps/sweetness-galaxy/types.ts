export enum AppTab {
  THEORY = 'theory',
  LAB = 'lab',
  QUIZ = 'quiz',
  GALAXY = 'galaxy'
}

export enum LabMode {
  FRUIT = 'fruit',
  CITY = 'city'
}

export interface Point {
  id: number;
  x: number;
  y: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanationType: string; // Used for Gemini prompt context
}

export enum GalaxyType {
  SPIRAL = 'spiral',
  ELLIPTICAL = 'elliptical'
}

export interface GalaxyData {
  type: GalaxyType;
  name: string;
  description: string;
  imageUrl: string;
}