export enum TechType {
  WIFI = 'Wi-Fi',
  BLUETOOTH = 'Bluetooth',
  NFC = 'NFC',
  RFID = 'RFID',
}

export interface Scenario {
  id: string;
  situation: string;
  correctTech: TechType;
  clue: string; // The "textbook feature" clue
  wrongFeedback: Partial<Record<TechType, string>>; // Specific feedback for wrong answers
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TheoryData {
  tech: TechType;
  distance: string;
  speed: string;
  usage: string;
  keyFeature: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  isO: boolean; // True for O, False for X
  explanation: string;
}

export interface DeepDiveContent {
  title: string;
  techs: TechType[];
  description: string;
  realWorldExample: string;
}
