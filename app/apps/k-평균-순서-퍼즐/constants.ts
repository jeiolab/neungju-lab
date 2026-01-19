import { Badge, PuzzlePiece, QuizQuestion } from './types';

export const PUZZLE_STEPS: PuzzlePiece[] = [
  { id: 'step-1', text: '데이터 준비', description: '분석할 데이터를 수집하고 전처리합니다.' },
  { id: 'step-2', text: 'K 설정', description: '데이터를 몇 개의 그룹으로 나눌지(K) 결정합니다.' },
  { id: 'step-3', text: '초기 중심 설정', description: 'K개의 중심점을 임의의 위치에 배치합니다.' },
  { id: 'step-4', text: '가장 가까운 중심 배정', description: '모든 데이터를 가장 가까운 중심점의 그룹에 할당합니다.' },
  { id: 'step-5', text: '중심 이동', description: '형성된 각 그룹의 평균 위치로 중심점을 이동합니다.' },
  { id: 'step-6', text: '반복 종료 확인', description: '중심의 위치가 변하지 않으면 종료하고, 아니면 배정 단계로 돌아갑니다.' },
];

export const CORRECT_ORDER = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'];

export const INITIAL_BADGES: Badge[] = [
  { id: 'flow-master', name: '흐름 완성', description: '퍼즐을 완벽한 순서로 맞췄습니다.', icon: '🧩', unlocked: false },
  { id: 'repeat-expert', name: '반복의 의미', description: '시뮬레이션에서 수렴 과정을 확인했습니다.', icon: '🔄', unlocked: false },
  { id: 'init-pro', name: '초기화 장인', description: '다양한 초기화 방식으로 실험했습니다.', icon: '🎯', unlocked: false },
  { id: 'quiz-whiz', name: '개념 마스터', description: '퀴즈에서 고득점을 획득했습니다.', icon: '🎓', unlocked: false },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "K-평균 알고리즘의 'K'는 무엇을 의미하나요?",
    options: ["데이터의 개수", "군집(클러스터)의 개수", "반복 횟수", "데이터의 차원"],
    correctIndex: 1,
    explanation: "K는 데이터를 몇 개의 그룹으로 묶을지를 결정하는 하이퍼파라미터입니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "알고리즘이 종료되는 조건으로 가장 적절한 것은?",
    options: ["10번 반복했을 때", "모든 데이터가 같은 군집일 때", "중심점(Centroid)의 위치가 더 이상 변하지 않을 때", "K값이 0이 되었을 때"],
    correctIndex: 2,
    explanation: "군집의 중심이 이동하지 않으면 군집 할당도 변하지 않으므로 알고리즘이 수렴(종료)했다고 판단합니다.",
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "초기 중심점 위치를 어떻게 잡느냐에 따라 최종 결과가 달라질 수 있나요?",
    options: ["네, 달라질 수 있습니다.", "아니요, 항상 같은 결과가 나옵니다.", "데이터가 많을 때만 달라집니다.", "K가 3일 때만 달라집니다."],
    correctIndex: 0,
    explanation: "K-평균은 초기값에 민감하여, 초기 중심 위치에 따라 지역 최적해(Local Optimum)에 빠질 수 있습니다.",
    difficulty: 'hard'
  }
];

export const CLUSTER_COLORS = [
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
];
