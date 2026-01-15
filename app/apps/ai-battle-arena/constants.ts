import { CardData, LearningType, QuizQuestion } from './types';

export const INITIAL_CARDS: CardData[] = [
  {
    id: 'c1',
    text: "고양이 사진 10,000장에 '고양이'라는 라벨이 붙어 있다.",
    type: LearningType.SUPERVISED,
    difficulty: 'EASY',
    explanation: "정답(Label)이 있는 데이터를 학습하므로 지도학습입니다."
  },
  {
    id: 'c2',
    text: "마트 고객들의 구매 이력 데이터만 잔뜩 있다. (라벨 없음)",
    type: LearningType.UNSUPERVISED,
    difficulty: 'EASY',
    explanation: "정답이 없는 데이터에서 패턴을 찾아야 하므로 비지도학습입니다."
  },
  {
    id: 'c3',
    text: "내일의 기온(숫자)을 예측하고 싶다.",
    type: LearningType.SUPERVISED,
    difficulty: 'MEDIUM',
    explanation: "과거 데이터를 바탕으로 특정 값(기온)을 예측하는 회귀(Regression) 문제로, 지도학습에 속합니다."
  },
  {
    id: 'c4',
    text: "뉴스 기사들을 비슷한 주제끼리 그룹으로 묶고 싶다.",
    type: LearningType.UNSUPERVISED,
    difficulty: 'MEDIUM',
    explanation: "주제를 미리 정해주지 않고 데이터 간 유사성을 기반으로 그룹화(Clustering)하므로 비지도학습입니다."
  },
  {
    id: 'c5',
    text: "스팸 메일 필터: '이것은 스팸이다/아니다'를 판별한다.",
    type: LearningType.SUPERVISED,
    difficulty: 'EASY',
    explanation: "스팸 여부라는 명확한 정답(클래스)을 예측하는 분류(Classification) 문제입니다."
  },
  {
    id: 'c6',
    text: "이상 거래 탐지: 평소 패턴과 다른 특이한 거래를 찾아낸다.",
    type: LearningType.UNSUPERVISED,
    difficulty: 'HARD',
    explanation: "정상/비정상 라벨이 드물거나 없을 때, 데이터 분포에서 벗어난 이상치(Anomaly)를 탐지하는 것은 주로 비지도학습 영역입니다."
  }
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    question: "다음 중 비지도학습(Unsupervised Learning)의 대표적인 알고리즘은?",
    options: ["선형 회귀 (Linear Regression)", "K-평균 군집화 (K-Means Clustering)", "로지스틱 회귀 (Logistic Regression)", "의사결정나무 (Decision Tree)"],
    correctIndex: 1,
    explanation: "K-Means는 데이터의 유사성을 기반으로 그룹을 나누는 대표적인 비지도학습 알고리즘입니다. 나머지는 모두 지도학습입니다."
  },
  {
    id: 'q2',
    question: "지도학습에서 '회귀(Regression)'와 '분류(Classification)'의 결정적인 차이는?",
    options: ["데이터의 양", "학습 속도", "예측하려는 값의 연속성 유무", "컴퓨터의 성능"],
    correctIndex: 2,
    explanation: "회귀는 연속적인 숫자(예: 가격, 온도)를 예측하고, 분류는 불연속적인 클래스(예: 고양이/강아지)를 예측합니다."
  },
  {
    id: 'q3',
    question: "'차원 축소(Dimensionality Reduction)'는 주로 어떤 학습 방법에 속하는가?",
    options: ["지도학습", "비지도학습", "강화학습", "반지도학습"],
    correctIndex: 1,
    explanation: "PCA(주성분 분석) 같은 차원 축소는 데이터의 특징을 효율적으로 압축하여 구조를 파악하는 비지도학습의 일종입니다."
  }
];

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 5000];