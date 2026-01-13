export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  AI_INSIGHTS = 'AI_INSIGHTS',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3
}

export interface RobotState {
  x: number;
  y: number;
  dir: Direction;
}

export enum CommandType {
  FORWARD = 'FORWARD',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  LOOP = 'LOOP' // Loop block wrapper
}

export interface Command {
  id: string;
  type: CommandType;
  count?: number; // For loops
  children?: Command[]; // Nested commands for loops
}

export interface Level {
  id: number;
  name: string;
  gridSize: number;
  start: { x: number; y: number; dir: Direction };
  end: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  optimalMoves: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'sequence' | 'shape' | 'logic';
}

export interface HanoiMove {
  disk: number;
  from: number;
  to: number;
}
