export enum TaskType {
  HYGIENE = 'HYGIENE',
  FOOD = 'FOOD',
  PREP = 'PREP',
  TRANSIT = 'TRANSIT'
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  baseDuration: number; // minutes
  minDuration: number; // minutes, fastest possible rush
  currentDuration: number; // minutes, user selected
  qualityImpact: number; // Score gained per minute
  fatigueImpact: number; // Fatigue reduced (or gained if rushed)
  isParallel: boolean; // Is this task currently set to run in parallel with the previous one?
  canParallel: boolean; // Can this task potentially be parallelized?
}

export interface GameState {
  currentStats: {
    hygiene: number; // 0-100
    fullness: number; // 0-100
    energy: number; // 0-100
    stress: number; // 0-100
  };
  currentTime: Date; // Starts at 7:30
  targetTime: Date; // 8:30
  tasks: Task[];
  isGameOver: boolean;
  score: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: boolean; // True for O, False for X
  explanation: string;
}
