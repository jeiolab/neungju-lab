export enum CryptoMethod {
  SYMMETRIC = '대칭키',
  ASYMMETRIC = '비대칭키(공개키)',
  HASH = '해시함수',
  HYBRID = '혼합(하이브리드)',
  HOMOMORPHIC = '동형암호',
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
  recommendedMethods: CryptoMethod[];
  requiredAttributes: {
    speed: number;
    security: number;
    management: number; // Low value means management must be easy
  };
}

export interface SimulationResult {
  score: number;
  feedback: {
    pro: string;
    con: string;
    reality: string;
  };
  userAttributes: {
    speed: number;
    security: number;
    management: number;
  };
  method: CryptoMethod;
  scenarioId: string;
  timestamp: number;
}

export interface UserStats {
  xp: number;
  level: number;
  badges: string[];
  history: SimulationResult[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConceptCard {
  method: CryptoMethod;
  summary: string;
  pros: string;
  cons: string;
  icon: string;
}