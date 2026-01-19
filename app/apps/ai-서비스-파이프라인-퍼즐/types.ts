export enum BlockType {
  SENSOR = '센서/IoT',
  APP_LOG = '앱 로그',
  TRANSMISSION = '데이터 전송',
  STORAGE = '클라우드 저장',
  CLEANING = '데이터 정제',
  ANALYSIS = '빅데이터 분석',
  TRAINING = 'AI 모델 학습',
  INFERENCE = '추론/의사결정',
  FEEDBACK = '서비스/피드백'
}

export interface PipelineBlock {
  id: string;
  type: BlockType;
  description: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  correctSequence: BlockType[];
  context: string; // Used for Gemini prompt
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserState {
  level: number;
  streak: number;
  badges: string[];
  completedScenarios: string[];
  quizScore: number;
}
