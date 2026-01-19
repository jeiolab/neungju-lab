export enum MLMethodType {
  SUPERVISED = '지도 학습 (Supervised)',
  UNSUPERVISED = '비지도 학습 (Unsupervised)',
  REINFORCEMENT = '강화 학습 (Reinforcement)',
  RULE_BASED = '규칙 기반 (Rule-Based)',
}

export enum GoalType {
  CLUB_REC = '동아리 추천',
  LUNCH_SAT = '급식 만족도 예측',
  GAME_DIFF = '게임 캐릭터 난이도 조절',
}

export interface SimulationState {
  goal: GoalType;
  accuracyImportance: number; // 0-10
  explainabilityImportance: number; // 0-10
  timeConstraint: number; // 0-10 (High means strict constraint/less time available)
  hasLabeledData: boolean;
}

export interface RecommendationResult {
  method: MLMethodType;
  score: number;
  reason: string;
  feedback: string[]; // 3-line feedback
  hiddenCost: string;
  nextStep: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TheoryCardData {
  title: string;
  keywords: string[];
  definition: string;
  example: string;
  misconception: string;
  check: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}