import { Scenario, QuizQuestion, TaskType } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: '1',
    title: '스팸 메시지 분류',
    category: 'Life',
    description: '수신된 문자 메시지가 스팸인지 아닌지 자동으로 판별하여 차단하고 싶습니다.',
    correctTask: 'Classification',
    difficulty: 1
  },
  {
    id: '2',
    title: '중간고사 점수 예측',
    category: 'School',
    description: '지난 모의고사 성적과 공부 시간을 바탕으로 이번 중간고사 수학 점수를 예측하고 싶습니다.',
    correctTask: 'Regression',
    difficulty: 1
  },
  {
    id: '3',
    title: '친구 취향 그룹 만들기',
    category: 'Life',
    description: '친구들의 영화 취향 데이터를 모았습니다. 정해진 답은 없지만 비슷한 취향끼리 그룹을 묶고 싶어요.',
    correctTask: 'Clustering',
    difficulty: 2
  },
  {
    id: '4',
    title: '희귀 질병 진단',
    category: 'Career',
    description: '환자의 MRI 사진을 보고 질병 유무를 판단해야 합니다. 의사에게 판단 근거를 설명하는 것이 매우 중요합니다.',
    correctTask: 'Classification',
    difficulty: 3
  },
  {
    id: '5',
    title: '주택 가격 산정',
    category: 'Career',
    description: '방 개수, 위치, 연식을 기반으로 적절한 매매 가격을 숫자로 산출해야 합니다.',
    correctTask: 'Regression',
    difficulty: 2
  },
  {
    id: '6',
    title: '도서관 책 정리',
    category: 'School',
    description: '라벨이 떨어진 책들이 쌓여있습니다. 내용을 분석해 비슷한 주제끼리 묶어 서가에 정리하려 합니다.',
    correctTask: 'Clustering',
    difficulty: 2
  },
  {
    id: '7',
    title: '배달 소요 시간 예측',
    category: 'Life',
    description: '현재 날씨, 거리, 요일을 고려하여 음식이 도착하기까지 몇 분이 걸릴지 예측합니다.',
    correctTask: 'Regression',
    difficulty: 1
  },
  {
    id: '8',
    title: '식물 종류 구분',
    category: 'School',
    description: '꽃잎의 길이와 너비를 측정하여 이 꽃이 A종인지 B종인지 구분하고 싶습니다.',
    correctTask: 'Classification',
    difficulty: 1
  },
  {
    id: '9',
    title: '쇼핑몰 고객 세분화',
    category: 'Career',
    description: '구매 이력을 바탕으로 VIP, 신규, 이탈위험 고객 등으로 군집화하여 마케팅 전략을 짜고 싶습니다.',
    correctTask: 'Clustering',
    difficulty: 2
  },
  {
    id: '10',
    title: '신용카드 사기 탐지',
    category: 'Career',
    description: '수백만 건의 거래 중 사기로 의심되는 거래를 찾아내야 합니다. (매우 불균형한 데이터)',
    correctTask: 'Classification',
    difficulty: 3
  },
  {
    id: '11',
    title: '내일 기온 예측',
    category: 'Life',
    description: '과거 10년치 날씨 데이터를 바탕으로 내일 최고 기온(℃)을 맞추고 싶습니다.',
    correctTask: 'Regression',
    difficulty: 1
  },
  {
    id: '12',
    title: 'SNS 뉴스피드 추천',
    category: 'Life',
    description: '사용자가 좋아할 만한 게시물을 점수화하여 순서를 매기거나, 관심사 그룹을 추천합니다.',
    correctTask: 'Clustering', // Or Regression/Classification depends on framing, but Clustering fits grouping interests
    difficulty: 3
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "데이터에 정답(Label)이 없을 때 사용하는 기계학습 방법은?",
    options: ["지도 학습 (Supervised)", "비지도 학습 (Unsupervised)", "강화 학습 (Reinforcement)", "전이 학습 (Transfer)"],
    correctAnswer: 1,
    explanation: "정답 라벨이 없는 데이터에서 패턴을 찾는 것은 비지도 학습(예: 군집화)입니다.",
    type: 'MultipleChoice'
  },
  {
    id: 2,
    question: "다음 중 '회귀(Regression)' 문제가 아닌 것은?",
    options: ["아파트 가격 예측", "내일 기온 예측", "시험 점수 예측", "스팸 메일 여부 판단"],
    correctAnswer: 3,
    explanation: "스팸 메일 여부(O/X)는 분류(Classification) 문제입니다. 나머지는 연속적인 숫자를 예측하는 회귀 문제입니다.",
    type: 'MultipleChoice'
  },
  {
    id: 3,
    question: "데이터가 너무 적을 때 발생하기 쉬운 문제는?",
    options: ["과소적합 (Underfitting)", "과대적합 (Overfitting)", "최적화 (Optimization)", "군집화 (Clustering)"],
    correctAnswer: 1, // Usually overfitting implies memorizing small data, but underfitting implies not learning enough. Context dependent, but usually overfitting is the big risk with small data + complex model. Let's stick to Overfitting.
    explanation: "데이터가 적으면 모델이 소수의 데이터 패턴을 과도하게 외워버리는 과대적합(Overfitting)이 발생하기 쉽습니다.",
    type: 'MultipleChoice'
  },
  {
    id: 4,
    question: "설명 가능성(Explainability)이 가장 높은 모델은?",
    options: ["딥러닝 (Deep Learning)", "랜덤 포레스트 (Random Forest)", "선형 회귀 (Linear Regression)", "서포트 벡터 머신 (SVM)"],
    correctAnswer: 2,
    explanation: "선형 회귀는 각 변수가 결과에 미치는 영향을 계수(Coefficient)로 명확히 알 수 있어 설명력이 높습니다.",
    type: 'MultipleChoice'
  },
  {
    id: 5,
    question: "k-평균(k-Means) 군집화에서 'k'가 의미하는 것은?",
    options: ["데이터의 개수", "만들 그룹(클러스터)의 개수", "학습 반복 횟수", "특성(Feature)의 개수"],
    correctAnswer: 1,
    explanation: "k는 데이터를 몇 개의 그룹으로 묶을지 결정하는 군집의 개수입니다.",
    type: 'MultipleChoice'
  },
  // Add more to reach 10 if needed, keeping it to 5 for brevity in demo but logic supports n
];

export const THEORY_CARDS = [
  {
    title: "기계학습이란?",
    content: "컴퓨터가 명시적인 프로그래밍 없이 데이터로부터 학습하여 결정을 내리거나 예측을 수행하는 기술입니다."
  },
  {
    title: "지도 학습 vs 비지도 학습",
    content: "지도 학습은 '문제와 정답'을 모두 주고 학습시키는 반면, 비지도 학습은 '정답 없이' 데이터의 구조나 패턴을 스스로 찾게 합니다."
  },
  {
    title: "트레이드오프 (Trade-off)",
    content: "모든 것을 다 가질 순 없습니다. 정확도를 높이면 모델이 복잡해져 설명하기 어려워지거나(설명력 감소), 계산 비용이 늘어날 수 있습니다."
  },
  {
    title: "데이터의 중요성",
    content: "Garbage In, Garbage Out. 데이터가 부족하거나 노이즈가 많으면 아무리 좋은 모델을 써도 좋은 결과를 얻을 수 없습니다."
  }
];

export const MODEL_SPECS = {
  LinearRegression: { type: 'Regression', acc: 60, exp: 90, cost: 10, name: '선형 회귀' },
  LogisticRegression: { type: 'Classification', acc: 70, exp: 80, cost: 20, name: '로지스틱 회귀' },
  KMeans: { type: 'Clustering', acc: 50, exp: 70, cost: 15, name: 'k-평균 군집화' },
  DecisionTree: { type: 'Classification', acc: 75, exp: 85, cost: 30, name: '의사결정 나무' },
  RandomForest: { type: 'Classification', acc: 90, exp: 40, cost: 60, name: '랜덤 포레스트' }
};