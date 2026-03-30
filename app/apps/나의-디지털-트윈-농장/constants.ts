import { Badge, QuizQuestion } from './types';

export const INITIAL_FARM_STATE = {
  temperature: 22,
  humidity: 60,
  feedAmount: 50,
  sensorSensitivity: 80,
  pigHealth: 95,
  productivity: 90,
  day: 1,
};

// Optimal ranges
export const OPTIMAL_TEMP_MIN = 18;
export const OPTIMAL_TEMP_MAX = 24;
export const OPTIMAL_HUM_MIN = 50;
export const OPTIMAL_HUM_MAX = 70;

export const BADGES: Badge[] = [
  {
    id: 'first_login',
    name: '신입 농장주',
    description: '디지털 트윈 농장에 처음 방문했습니다.',
    icon: '🚜',
    earned: false,
  },
  {
    id: 'expert_analyst',
    name: '데이터 분석가',
    description: '시뮬레이션에서 생산성 95점 이상을 달성했습니다.',
    icon: '📊',
    earned: false,
  },
  {
    id: 'crisis_manager',
    name: '위기 관리자',
    description: '폭염이나 질병 위기를 성공적으로 극복했습니다.',
    icon: '🛡️',
    earned: false,
  },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "디지털 트윈(Digital Twin)의 핵심 개념으로 가장 적절한 것은?",
    options: [
      "현실 세계와 똑같은 쌍둥이를 현실에 하나 더 만드는 것",
      "현실의 사물이나 시스템을 가상 공간에 쌍둥이처럼 구현하여 모의 실험하는 기술",
      "농장의 돼지 수를 두 배로 늘리는 생명 공학 기술",
      "스마트폰을 두 개 사용하여 농장을 관리하는 방법"
    ],
    correctAnswer: 1,
    explanation: "디지털 트윈은 현실의 데이터를 기반으로 가상 공간에 시뮬레이션 모델을 만들어, 결과를 예측하고 현실에 반영하는 기술입니다."
  },
  {
    id: 2,
    question: "스마트팜 센서가 갑작스러운 온도 상승을 감지했습니다. 디지털 트윈 시스템의 올바른 대처 순서는?",
    options: [
      "주인이 올 때까지 기다린다 -> 경보 울림 -> 데이터 삭제",
      "데이터 수집 -> 가상 시뮬레이션 분석 -> 최적 제어(환풍기 가동) -> 현실 반영",
      "환풍기 고장 냄 -> 온도 상승 -> 돼지 이동",
      "사료 공급 중단 -> 조명 끄기 -> 데이터 무시"
    ],
    correctAnswer: 1,
    explanation: "센서가 데이터를 수집하면, 시스템이 분석 및 시뮬레이션을 통해 최적의 해결책(예: 환풍기 가동)을 도출하고 이를 현실의 액추에이터에 명령합니다."
  },
  {
    id: 3,
    question: "양돈 스마트팜에서 생산성을 높이기 위해 관리해야 할 데이터가 아닌 것은?",
    options: [
      "축사 내부 온도 및 습도",
      "개체별 사료 섭취량",
      "농장주가 좋아하는 음악 장르",
      "질병 징후 및 활동량"
    ],
    correctAnswer: 2,
    explanation: "농장주의 음악 취향은 가축의 생산성과 직접적인 관련이 적은 데이터입니다."
  }
];