export type ProcessStage = 'env_in' | 'sensor' | 'ai' | 'decision' | 'actuator' | 'env_out';

export interface StageDefinition {
  id: ProcessStage;
  label: string;
  description: string;
  iconName: string;
  color: string;
}

export interface ScenarioBlock {
  id: string;
  text: string;
  stage: ProcessStage;
}

export interface Scenario {
  id: string;
  chapter: string; // 'drone' | 'car' | 'vacuum'
  title: string;
  description: string;
  correctOrder: ProcessStage[]; // The sequence of logic stages expected
  blocks: ScenarioBlock[]; // The actual text blocks to be sorted
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type TabId = 'theory' | 'simulation' | 'dictionary' | 'quiz' | 'think';

export interface ProgressState {
  drone: number;
  car: number;
  vacuum: number;
}