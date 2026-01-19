import { MLType, DailyTheme } from './types';

export const APP_STORAGE_KEYS = {
  HISTORY: 'daily_ml_v1_history',
  STREAK: 'daily_ml_v1_streak',
  SEED: 'daily_ml_v1_seed', // Not strictly needed to store if computed daily, but good for debugging
  POINTS: 'daily_ml_v1_points',
  FROZEN: 'daily_ml_v1_frozen',
};

// Fallback mission themes if Gemini is unavailable or for structure
export const THEME_ROTATION: DailyTheme[] = [
  {
    type: MLType.SUPERVISED,
    title: "정답을 알려주는 선생님: 지도학습",
    description: "입력 데이터(문제)와 정답(레이블)을 함께 주어 모델을 훈련시키는 방법입니다.",
    keyConcepts: [
      { title: "레이블(Label)", content: "우리가 모델이 맞추길 원하는 정답 값입니다." },
      { title: "특성(Feature)", content: "데이터를 설명하는 속성들입니다." },
      { title: "분류 vs 회귀", content: "결과가 카테고리냐, 연속된 숫자냐의 차이입니다." }
    ]
  },
  {
    type: MLType.UNSUPERVISED,
    title: "스스로 패턴 찾기: 비지도학습",
    description: "정답 없이 데이터의 구조나 패턴을 스스로 학습하는 방법입니다.",
    keyConcepts: [
      { title: "군집화(Clustering)", content: "비슷한 특성을 가진 데이터끼리 그룹으로 묶습니다." },
      { title: "차원 축소", content: "복잡한 데이터의 핵심 정보만 남기고 단순화합니다." },
      { title: "정답 없음", content: "지도학습과 달리 레이블이 데이터에 존재하지 않습니다." }
    ]
  },
  {
    type: MLType.REINFORCEMENT,
    title: "당근과 채찍: 강화학습",
    description: "에이전트가 환경과 상호작용하며 보상을 최대화하는 행동을 배웁니다.",
    keyConcepts: [
      { title: "에이전트(Agent)", content: "학습을 수행하는 주체(로봇, 플레이어 등)입니다." },
      { title: "보상(Reward)", content: "행동의 결과로 받는 점수나 피드백입니다." },
      { title: "탐험 vs 이용", content: "새로운 시도를 할지, 아는 길로 갈지의 딜레마입니다." }
    ]
  }
];

export const SYSTEM_INSTRUCTION = `
너는 머신러닝 일일 코치야. 사용자에게 매일 하나씩 짧고 굵은 ML 미션을 제공해.
사용자가 입력한 답안에 대해 친절하지만 핵심을 찌르는 3줄 피드백을 줘야 해.
초보자도 이해하기 쉽게 설명하고, 비유를 적극적으로 활용해.
`;