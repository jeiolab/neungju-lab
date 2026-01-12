export interface SensorOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ActionOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ProjectState {
  problem: string;
  selectedSensors: string[];
  selectedActions: string[];
  generatedTitle: string;
  generatedEffect: string;
  ethicalIssue: string;
  studentName: string;
}

export interface ExampleProject {
  title: string;
  problem: string;
  sensors: string[];
  actions: string[];
}

export enum Step {
  INTRO = 0,
  PROBLEM = 1,
  SENSORS = 2,
  ACTIONS = 3,
  REVIEW = 4,
  RESULT = 5,
}

export interface AiSuggestion {
  reasoning: string;
  recommendedSensors: string[];
}