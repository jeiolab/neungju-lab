export interface Skill {
  name: string;
  damage: number;
  manaCost: number;
}

export interface HeroClass {
  className: string;
  baseHp: number;
  baseMp: number;
  skills: Skill[];
}

export interface HeroInstance {
  id: string;
  name: string;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  status: 'alive' | 'dead';
  className: string;
}

export enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  INHERITANCE = 'inheritance',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion',
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'combat' | 'error' | 'create';
  timestamp: number;
}