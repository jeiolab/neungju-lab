export interface UserProgress {
  xp: number;
  level: number;
  badges: string[];
  solvedPuzzles: number;
  streak: number;
  lastLoginDate: string;
}

export interface PuzzleData {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  // In this simplified educational model, we define one key pattern to find
  targetPattern: {
    startIndex: number; // Where the repetition starts
    length: number;     // How long the repetition is
    matchIndex: number; // Where the original occurrence starts (to calculate distance)
  };
  hint: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ReflectionEntry {
  id: string;
  question: string;
  answer: string;
  lastUpdated: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}