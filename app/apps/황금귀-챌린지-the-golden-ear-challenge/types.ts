export enum Tab {
  CONSOLE = 'CONSOLE',
  SPECTRUM = 'SPECTRUM',
  THEORY = 'THEORY',
  QUIZ = 'QUIZ',
  DILEMMA = 'DILEMMA'
}

export enum Bitrate {
  LOW = 128,    // 128kbps MP3
  HIGH = 320,   // 320kbps MP3
  FLAC = 1411   // Approx 1411kbps (16bit 44.1kHz uncompressed/lossless equivalent)
}

export interface AudioStats {
  duration: number; // seconds
  sampleRate: number; // Hz, default 44100
  bitDepth: number; // bits, default 16
  channels: number; // 2 for stereo
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface StreakData {
  count: number;
  lastLoginDate: string;
  missionsCompletedToday: boolean;
}