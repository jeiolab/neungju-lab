export enum TabId {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  LEARN_MORE = 'learn_more',
  QUIZ = 'quiz',
  THINK = 'think',
}

export interface UserStats {
  safetyScore: number;
  innovationScore: number;
  ethicsLevel: number;
  casesSolved: number;
  quizScore: number;
}

export enum EthicsPropensity {
  BALANCED = '균형 잡힌 중재자',
  SAFETY_FIRST = '인간 안전 수호자',
  INNOVATION_FIRST = '기술 혁신 선구자',
}

export interface SimulationCase {
  id: number;
  title: string;
  scenario: string;
  dilemma: string;
  choices: {
    a: { text: string; safetyImpact: number; innovationImpact: number; feedback: string };
    b: { text: string; safetyImpact: number; innovationImpact: number; feedback: string };
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
