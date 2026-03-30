import { QuizQuestion } from './types';

export const CLUSTER_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#a855f7', // Purple
  '#f97316', // Orange
];

export const UNASSIGNED_COLOR = '#94a3b8'; // Slate 400

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "K-Means 알고리즘의 첫 번째 단계는 무엇인가요?",
    options: ["데이터 정규화", "K개의 중심점(Centroid) 임의 설정", "거리 계산", "군집 할당"],
    correctAnswer: 1,
    explanation: "알고리즘은 가장 먼저 K개의 중심점을 임의의 위치에 배치하는 것으로 시작합니다."
  },
  {
    id: 2,
    question: "데이터 포인트가 특정 군집에 할당되는 기준은 무엇인가요?",
    options: ["가장 멀리 있는 중심점", "가장 가까운 중심점", "무작위 선택", "가장 데이터가 적은 군집"],
    correctAnswer: 1,
    explanation: "각 데이터 포인트는 유클리디안 거리 기준으로 가장 가까운 중심점이 있는 군집에 할당됩니다."
  },
  {
    id: 3,
    question: "알고리즘은 언제 멈추나요?",
    options: ["10회 반복 후", "사용자가 멈출 때", "중심점의 위치가 더 이상 변하지 않을 때", "모든 점이 같은 색이 될 때"],
    correctAnswer: 2,
    explanation: "중심점의 위치 변화가 없거나(수렴), 지정된 최대 반복 횟수에 도달하면 알고리즘이 종료됩니다."
  }
];
