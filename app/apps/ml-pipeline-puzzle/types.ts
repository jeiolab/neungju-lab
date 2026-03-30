export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  CHALLENGE = 'CHALLENGE',
}

export enum StageId {
  PROBLEM_DEF = 'PROBLEM_DEF',
  DATA_COLLECT = 'DATA_COLLECT',
  PREPROCESSING = 'PREPROCESSING',
  MODEL_TRAIN = 'MODEL_TRAIN',
  EVALUATION = 'EVALUATION',
  IMPROVEMENT = 'IMPROVEMENT',
  // Traps
  TRAP_GUESS = 'TRAP_GUESS',
  TRAP_FAKE = 'TRAP_FAKE',
}

export interface PuzzleCard {
  id: string;
  stageId: StageId;
  title: string;
  description: string;
  isTrap?: boolean;
  order: number; // Correct order index (0-5)
}

export interface UserProgress {
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  lastPlayed: string;
  completedPuzzles: number;
  mistakeHistory: string[]; // IDs of stages frequently missed
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReflectionEntry {
  topic: string;
  plan: string;
  feedback: string;
  date: string;
}

export const STAGES_DATA: Record<StageId, PuzzleCard> = {
  [StageId.PROBLEM_DEF]: {
    id: 'card-1',
    stageId: StageId.PROBLEM_DEF,
    title: '문제 정의',
    description: '해결하려는 목표를 설정하고 필요한 데이터 종류를 기획합니다.',
    order: 0,
  },
  [StageId.DATA_COLLECT]: {
    id: 'card-2',
    stageId: StageId.DATA_COLLECT,
    title: '데이터 수집',
    description: '신뢰할 수 있는 소스에서 데이터를 모으고 라벨링을 수행합니다.',
    order: 1,
  },
  [StageId.PREPROCESSING]: {
    id: 'card-3',
    stageId: StageId.PREPROCESSING,
    title: '탐색 및 전처리',
    description: '결측치를 처리하고, 데이터를 분석하기 좋은 형태로 가공합니다.',
    order: 2,
  },
  [StageId.MODEL_TRAIN]: {
    id: 'card-4',
    stageId: StageId.MODEL_TRAIN,
    title: '모델 학습',
    description: '준비된 데이터로 알고리즘을 훈련시켜 패턴을 찾습니다.',
    order: 3,
  },
  [StageId.EVALUATION]: {
    id: 'card-5',
    stageId: StageId.EVALUATION,
    title: '성능 평가',
    description: '학습에 사용하지 않은 데이터로 모델의 정확도를 검증합니다.',
    order: 4,
  },
  [StageId.IMPROVEMENT]: {
    id: 'card-6',
    stageId: StageId.IMPROVEMENT,
    title: '개선 및 배포',
    description: '오류를 분석하여 모델을 튜닝하거나 실제 환경에 적용합니다.',
    order: 5,
  },
  [StageId.TRAP_GUESS]: {
    id: 'trap-1',
    stageId: StageId.TRAP_GUESS,
    title: '무작위 추측',
    description: '데이터 없이 감으로 결과를 예측합니다.',
    isTrap: true,
    order: -1,
  },
  [StageId.TRAP_FAKE]: {
    id: 'trap-2',
    stageId: StageId.TRAP_FAKE,
    title: '데이터 조작',
    description: '원하는 결과가 나오도록 데이터를 임의로 수정합니다.',
    isTrap: true,
    order: -1,
  },
};
