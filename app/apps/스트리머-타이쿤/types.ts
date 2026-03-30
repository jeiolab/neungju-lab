export enum Tab {
  STUDIO = 'STUDIO',
  ARCHIVE = 'ARCHIVE',
  MANUAL = 'MANUAL',
  EXAM = 'EXAM',
  FUTURE = 'FUTURE'
}

export type SceneType = 'TALK' | 'EXERCISE';
export type Resolution = '720p' | '1080p';
export type FPS = 30 | 60;

export interface StreamSettings {
  resolution: Resolution;
  fps: FPS;
  keyframeInterval: number; // in seconds
  scene: SceneType;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GameResult {
  success: boolean;
  message: string;
  subscribersGained: number;
}