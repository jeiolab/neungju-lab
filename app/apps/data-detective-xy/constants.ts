import { DataPoint, DatasetType, QuizQuestion } from './types';

// --- Mock Data Generators ---

const generatePenguins = (): DataPoint[] => {
  const data: DataPoint[] = [];
  // Adelie: Short flipper (x: 170-195), Short bill (y: 30-45)
  for (let i = 0; i < 40; i++) {
    data.push({
      id: i,
      x: 170 + Math.random() * 25,
      y: 30 + Math.random() * 15,
      category: 'Adelie (아델리)',
      color: '#f59e0b', // amber-500
    });
  }
  // Gentoo: Long flipper (x: 210-235), Medium bill (y: 40-55)
  for (let i = 40; i < 80; i++) {
    data.push({
      id: i,
      x: 210 + Math.random() * 25,
      y: 40 + Math.random() * 15,
      category: 'Gentoo (젠투)',
      color: '#06b6d4', // cyan-500
    });
  }
  // Chinstrap: Medium flipper (x: 190-210), Long bill (y: 45-55)
  for (let i = 80; i < 110; i++) {
    data.push({
      id: i,
      x: 190 + Math.random() * 20,
      y: 45 + Math.random() * 10,
      category: 'Chinstrap (턱끈)',
      color: '#a855f7', // purple-500
    });
  }
  return data;
};

const generateSchools = (): DataPoint[] => {
  const data: DataPoint[] = [];
  // Normal Schools: Linear relationship (approx 1 teacher per 20 students)
  for (let i = 0; i < 80; i++) {
    const students = 100 + Math.random() * 900; // 100 to 1000 students
    const teachers = (students / 20) + (Math.random() * 10 - 5);
    data.push({
      id: i,
      x: Math.floor(students),
      y: Math.floor(teachers),
      category: '일반 학급',
      color: '#22c55e', // green-500
    });
  }
  // Overcrowded Schools: High students (600+), Low teachers (<25)
  for (let i = 80; i < 100; i++) {
    data.push({
      id: i,
      x: 600 + Math.random() * 400,
      y: 15 + Math.random() * 10,
      category: '과밀 학급',
      color: '#ef4444', // red-500
    });
  }
  return data;
};

export const DATASETS: Record<DatasetType, { title: string; xLabel: string; yLabel: string; description: string; targetCategory: string; data: DataPoint[] }> = {
  [DatasetType.PENGUINS]: {
    title: '작전명: 사라진 펭귄 (Operation: Penguin Lost)',
    xLabel: '날개 길이 (mm)',
    yLabel: '부리 길이 (mm)',
    description: '젠투(Gentoo) 펭귄을 찾아야 합니다. 젠투 펭귄은 날개가 가장 길다고 알려져 있습니다!',
    targetCategory: 'Gentoo (젠투)',
    data: generatePenguins(),
  },
  [DatasetType.SCHOOLS]: {
    title: '작전명: 과밀 학급 (Operation: Overcrowded)',
    xLabel: '학생 수',
    yLabel: '교사 수',
    description: '어려움을 겪고 있는 학교를 찾으세요. 학생 수는 많지만 교사 수가 비정상적으로 적은 곳을 찾아야 합니다.',
    targetCategory: '과밀 학급',
    data: generateSchools(),
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "산점도(Scatter Plot)에서 하나의 점은 무엇을 의미하나요?",
    options: [
        "아이디어의 연결",
        "두 가지 값(X와 Y)을 가진 하나의 데이터 샘플",
        "모든 데이터의 평균",
        "사건의 타임라인"
    ],
    correctIndex: 1,
    explanation: "각 점은 두 가지 측정값(예: 날개 길이와 부리 길이)에 따라 좌표에 찍힌 개별 기록(펭귄 한 마리 또는 학교 한 곳)을 나타냅니다."
  },
  {
    id: 2,
    question: "점들이 왼쪽 아래에서 오른쪽 위로 향하는 선을 이룬다면 무엇을 의미하나요?",
    options: [
        "X가 증가하면 Y는 감소한다",
        "아무런 관계가 없다",
        "X가 증가하면 Y도 증가한다 (양의 상관관계)",
        "데이터가 무작위다"
    ],
    correctIndex: 2,
    explanation: "이것은 양의 상관관계(Positive Correlation)입니다. 예를 들어, 학교의 학생 수(X)가 많아질수록 교사 수(Y)도 보통 많아집니다."
  },
  {
    id: 3,
    question: "데이터를 분류할 때 1차원(X만 사용)보다 2차원(X와 Y 사용)이 더 유리한 이유는 무엇인가요?",
    options: [
        "보기에 더 예뻐서",
        "2차원 그래프는 잉크를 더 많이 써서",
        "두 가지 특징을 결합하면 겹쳐 보이던 패턴을 명확히 구분할 수 있어서",
        "더 유리하지 않다. 1차원이 항상 낫다"
    ],
    correctIndex: 2,
    explanation: "때로는 두 그룹의 X값이 비슷하더라도 Y값이 다를 수 있습니다. 두 가지를 함께 사용하면 그룹을 명확하게 구별하는 데 도움이 됩니다."
  }
];
