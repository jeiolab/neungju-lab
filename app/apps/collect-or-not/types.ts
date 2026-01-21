export enum DataType {
  Structured = '정형',
  Unstructured = '비정형',
}

export enum CollectionSource {
  Direct = '직접',
  Shared = '공유',
}

export enum CollectionMethod {
  Survey = '설문',
  Observation = '관찰',
  Sensor = '센서',
  SharedData = '공유데이터',
  WebCrawling = '웹수집',
}

export interface GameCard {
  id: string;
  title: string;
  category: '스포츠' | '환경' | '학교생활';
  description: string;
  correctType: DataType;
  correctSource: CollectionSource;
  correctMethod: CollectionMethod;
  isTrap?: boolean; // If true, the correct action is to flag bias/ethics
  trapReason?: string;
  explanation: string;
}

export interface UserStats {
  maxCombo: number;
  totalScore: number;
  gamesPlayed: number;
  badges: string[];
  misconceptions: string[]; // List of card IDs or tags frequently missed
  quizHistory: number[]; // Last 5 quiz scores
  lastPlayed: string; // ISO Date string
  streak: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedConcept: string;
}

export type TabView = 'concept' | 'game' | 'learn' | 'quiz' | 'think';