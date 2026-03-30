export type ScenarioType = 'temp' | 'light' | 'door';

export interface ScenarioConfig {
  id: ScenarioType;
  name: string;
  description: string;
  sensor: {
    name: string;
    unit: string;
    min: number;
    max: number;
    icon: string;
  };
  logic: {
    threshold: number;
    operator: '>' | '<';
    description: string;
  };
  actuator: {
    name: string;
    activeLabel: string;
    inactiveLabel: string;
    icon: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}