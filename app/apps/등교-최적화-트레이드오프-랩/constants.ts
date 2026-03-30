import { TransportMode, Badge, QuizQuestion } from './types';
import { Footprints, Bike, Bus, Car } from 'lucide-react';

export const TRANSPORT_MODES: Record<string, TransportMode> = {
  WALK: {
    id: 'WALK',
    name: '도보',
    speedMultiplier: 1, // Base ~4km/h
    costPerKm: 0,
    carbonScore: 10,
    safetyScore: 9,
    icon: 'Footprints'
  },
  BIKE: {
    id: 'BIKE',
    name: '자전거',
    speedMultiplier: 3,
    costPerKm: 0,
    carbonScore: 10,
    safetyScore: 6, // Higher risk
    icon: 'Bike'
  },
  BUS: {
    id: 'BUS',
    name: '버스',
    speedMultiplier: 5,
    costPerKm: 200, // Approx fare structure
    carbonScore: 7,
    safetyScore: 8,
    icon: 'Bus'
  },
  TAXI: {
    id: 'TAXI',
    name: '택시',
    speedMultiplier: 8,
    costPerKm: 2000,
    carbonScore: 2,
    safetyScore: 7,
    icon: 'Car'
  }
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'balance_master',
    name: '균형의 수호자',
    description: '시간, 비용, 환경 점수를 모두 70점 이상 유지하며 등교 성공',
    icon: '⚖️',
    unlocked: false
  },
  {
    id: 'eco_sprinter',
    name: '그린 스피드스터',
    description: '탄소 점수 9점 이상으로 지각 면하기',
    icon: '🌱',
    unlocked: false
  },
  {
    id: 'model_architect',
    name: '모델링 설계자',
    description: '시뮬레이션 10회 이상 실행',
    icon: '📐',
    unlocked: false
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "문제 분해(Decomposition)의 가장 큰 장점은 무엇인가요?",
    options: [
      "문제를 더 복잡하게 만든다.",
      "큰 문제를 작게 나누어 해결 가능한 단위로 만든다.",
      "모든 변수를 제거하여 단순화한다.",
      "정답을 미리 알 수 있다."
    ],
    correctAnswer: 1,
    explanation: "복잡한 문제를 작은 단위로 나누면(예: 등교 시간을 준비+이동+도착으로 분해) 각 단계를 개별적으로 최적화하기 쉬워집니다.",
    difficulty: 'EASY'
  },
  {
    id: 2,
    question: "다음 중 '트레이드오프(Trade-off)' 관계인 것은?",
    options: [
      "일찍 일어나서 천천히 걸어가기",
      "택시를 타서 시간은 줄이고 비용은 늘리기",
      "친구와 함께 버스 타기",
      "숙제를 미리 해두기"
    ],
    correctAnswer: 1,
    explanation: "트레이드오프는 하나를 얻으면(시간 절약) 다른 하나를 잃는(비용 증가) 관계를 말합니다.",
    difficulty: 'EASY'
  },
  {
    id: 3,
    question: "모델링을 할 때 현실의 모든 요소를 포함해야 할까요?",
    options: [
      "네, 하나라도 빠지면 안 됩니다.",
      "아니요, 목적에 맞는 핵심 변수만 포함하여 단순화합니다.",
      "가장 복잡한 요소만 포함합니다.",
      "숫자로 된 것만 포함해야 합니다."
    ],
    correctAnswer: 1,
    explanation: "모델은 현실의 단순화된 표현입니다. 목적(지각 방지)에 불필요한 정보(예: 오늘 입은 옷 색깔)는 제외합니다.",
    difficulty: 'MEDIUM'
  },
  {
    id: 4,
    question: "안전을 무시하고 시간만 단축했을 때 발생할 수 있는 문제는?",
    options: [
      "지각 확률이 0%가 된다.",
      "최적화 점수가 가장 높다.",
      "예상치 못한 사고로 인한 페널티가 발생할 수 있다.",
      "환경 점수가 높아진다."
    ],
    correctAnswer: 2,
    explanation: "모델링에서는 '제약 조건(안전)'을 무시하면 현실에서 실패할 위험(페널티)이 커집니다.",
    difficulty: 'MEDIUM'
  },
  {
    id: 5,
    question: "파레토 효율성(Pareto Efficiency)과 유사한 상황은?",
    options: [
      "다른 사람에게 피해를 주지 않고 내 이익을 늘릴 수 없는 상태",
      "모든 변수가 최악인 상태",
      "비용만 고려한 상태",
      "시간이 가장 오래 걸리는 상태"
    ],
    correctAnswer: 0,
    explanation: "균형 잡힌 상태를 의미하며, 이 앱에서는 시간/비용/환경 어느 하나를 희생하지 않고 최적의 상태를 찾는 것을 의미합니다.",
    difficulty: 'HARD'
  }
];
