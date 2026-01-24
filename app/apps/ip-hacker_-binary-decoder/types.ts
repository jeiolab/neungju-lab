export enum ViewState {
  HOME = 'HOME',
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  CHALLENGE = 'CHALLENGE',
  ADVANCED = 'ADVANCED'
}

export interface BitState {
  value: number; // 128, 64, 32...
  isOn: boolean;
}

export const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

// Helper to calculate decimal from boolean array
export const calculateDecimal = (bits: boolean[]): number => {
  return bits.reduce((acc, isOn, index) => {
    return acc + (isOn ? BIT_VALUES[index] : 0);
  }, 0);
};

// Helper to generate a random 8-bit integer
export const generateRandomTarget = (): number => {
  return Math.floor(Math.random() * 256);
};

// Helper to convert decimal to binary string (8 chars)
export const toBinaryString = (num: number): string => {
  return num.toString(2).padStart(8, '0');
};
