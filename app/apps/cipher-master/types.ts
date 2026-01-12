export enum Tab {
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  SYMBOLS = 'SYMBOLS'
}

export interface CipherState {
  shift: number;
  input: string;
  output: string;
}

export interface QuizQuestion {
  id: number;
  cipherText: string;
  plainText: string;
  shift: number;
  hint?: string;
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
