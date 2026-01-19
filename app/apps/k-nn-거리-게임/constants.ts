import { DataPoint, DatasetScenario, QuizQuestion } from './types';

export const GENRE_COLORS: Record<string, string> = {
  HipHop: '#ef4444', // Red
  Ballad: '#3b82f6', // Blue
  Idol: '#eab308',   // Yellow
  Indie: '#10b981',  // Green
};

export const GENRE_LABELS: Record<string, string> = {
  HipHop: '힙합 🎤',
  Ballad: '발라드 🎹',
  Idol: '아이돌 ✨',
  Indie: '인디 밴드 🎸',
};

const generatePoints = (count: number, maxX: number, maxY: number): DataPoint[] => {
  const points: DataPoint[] = [];
  const genres = ['HipHop', 'Ballad', 'Idol'] as const;
  
  for (let i = 0; i < count; i++) {
    // Create some clusters to make the simulation interesting
    const genre = genres[i % 3];
    let centerX = maxX / 2;
    let centerY = maxY / 2;
    
    if (genre === 'HipHop') { centerX = maxX * 0.2; centerY = maxY * 0.8; }
    if (genre === 'Ballad') { centerX = maxX * 0.8; centerY = maxY * 0.2; }
    if (genre === 'Idol') { centerX = maxX * 0.8; centerY = maxY * 0.8; }

    // Add noise
    const x = Math.min(maxX, Math.max(0, centerX + (Math.random() - 0.5) * (maxX * 0.6)));
    const y = Math.min(maxY, Math.max(0, centerY + (Math.random() - 0.5) * (maxY * 0.6)));

    points.push({
      id: i,
      x,
      y,
      genre
    });
  }
  return points;
};

export const SCENARIOS: DatasetScenario[] = [
  {
    id: 'balanced',
    name: '표준: 공부 vs 게임',
    description: '두 축의 범위가 비슷합니다(0-10). 거리 계산이 직관적입니다.',
    xAxis: { label: '공부 시간', min: 0, max: 10, unit: '시간' },
    yAxis: { label: '게임 시간', min: 0, max: 10, unit: '시간' },
    points: generatePoints(20, 10, 10)
  },
  {
    id: 'unbalanced',
    name: '비표준: 시간 vs 용돈',
    description: '용돈(0-100,000)이 정규화 없이 시간(0-10)을 압도합니다!',
    xAxis: { label: '공부 시간', min: 0, max: 10, unit: '시간' },
    yAxis: { label: '용돈', min: 0, max: 100000, unit: '원' },
    points: generatePoints(20, 10, 100000)
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "k-NN에서 'k'는 무엇을 의미하나요?",
    options: ["전체 데이터 개수", "확인할 최근접 이웃의 수", "킬로미터(Kilometers)", "커널(Kernel) 크기"],
    correctIndex: 1,
    explanation: "k는 투표를 위해 살펴볼 '가장 가까운 이웃의 수'를 결정하는 하이퍼파라미터입니다."
  },
  {
    id: 2,
    question: "k=1일 때, 분류 경계의 특징은?",
    options: ["매우 안정적이고 부드러움", "노이즈(이상치)에 매우 민감함", "항상 정답을 맞힘", "전체 평균을 따라감"],
    correctIndex: 1,
    explanation: "k가 작으면(예: 1) 가장 가까운 점 하나에만 의존하므로, 경계가 거칠어지고 이상한 데이터(노이즈)에 민감해집니다."
  },
  {
    id: 3,
    question: "정규화(Normalization)는 왜 필요한가요?",
    options: ["그래프를 예쁘게 만들기 위해", "계산 속도를 높이기 위해", "숫자가 큰 특성이 거리를 지배하는 것을 막기 위해", "필요하지 않음"],
    correctIndex: 2,
    explanation: "한 특성은 0-10, 다른 특성은 0-10000이라면, 정규화를 하지 않을 경우 큰 숫자가 거리 계산을 거의 다 결정해버립니다."
  },
  {
    id: 4,
    question: "분류(Classification) 문제에서 k-NN은 결과를 어떻게 정하나요?",
    options: ["다수결 투표", "평균값 계산", "최솟값 선택", "무작위 선택"],
    correctIndex: 0,
    explanation: "분류(카테고리 정하기) 문제에서 k-NN은 보통 가까운 이웃들의 '다수결'로 나(새로운 점)의 종류를 정합니다."
  },
  {
    id: 5,
    question: "두 점 사이의 직선 거리를 뜻하는 것은?",
    options: ["맨해튼 거리", "유클리드 거리", "해밍 거리", "사회적 거리"],
    correctIndex: 1,
    explanation: "유클리드 거리는 2차원 평면에서 두 점을 잇는 가장 짧은 '직선' 거리입니다."
  }
];