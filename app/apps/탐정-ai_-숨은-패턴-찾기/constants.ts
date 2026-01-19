import { QuizQuestion, Article } from './types';

export const CLUSTER_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
];

export const SAMPLE_ARTICLES: Article[] = [
  { id: '1', title: '손흥민, 극적인 결승골 폭발', category: 'sports', x: 0, y: 0 },
  { id: '2', title: '대통령, 신년 기자회견 개최', category: 'politics', x: 0, y: 0 },
  { id: '3', title: 'BTS 정국, 빌보드 차트 1위', category: 'entertainment', x: 0, y: 0 },
  { id: '4', title: '여야, 예산안 합의 처리', category: 'politics', x: 0, y: 0 },
  { id: '5', title: '류현진, 복귀전서 5이닝 무실점', category: 'sports', x: 0, y: 0 },
  { id: '6', title: '뉴진스, 신곡 뮤직비디오 공개', category: 'entertainment', x: 0, y: 0 },
  { id: '7', title: '올림픽 국가대표 선수단 출국', category: 'sports', x: 0, y: 0 },
  { id: '8', title: '선거법 개정안 국회 통과', category: 'politics', x: 0, y: 0 },
  { id: '9', title: '칸 영화제, 한국 영화 수상', category: 'entertainment', x: 0, y: 0 },
  { id: '10', title: '프로야구 개막전 매진 행렬', category: 'sports', x: 0, y: 0 },
  { id: '11', title: '아이유, 단독 콘서트 개최', category: 'entertainment', x: 0, y: 0 },
  { id: '12', title: '국무총리, 해외 순방 일정 발표', category: 'politics', x: 0, y: 0 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "비지도 학습(Unsupervised Learning)의 가장 큰 특징은 무엇인가요?",
    options: ["정답(레이블)이 있는 데이터를 사용한다.", "정답(레이블)이 없는 데이터에서 패턴을 찾는다.", "강화학습과 동일한 개념이다.", "미래의 값을 정확히 예측하는 것이 주 목적이다."],
    correctAnswer: 1,
    explanation: "비지도 학습은 정답(레이블)을 주지 않고 데이터 자체의 특성을 분석하여 패턴이나 구조를 발견하는 방법입니다.",
    difficulty: '하'
  },
  {
    id: 2,
    question: "다음 중 비지도 학습의 대표적인 예시인 '군집화(Clustering)'가 아닌 것은?",
    options: ["고객 구매 패턴에 따른 그룹 나누기", "뉴스 기사를 주제별로 자동 분류하기", "개와 고양이 사진을 보고 정답 맞추기", "유전자 데이터에서 유사한 그룹 찾기"],
    correctAnswer: 2,
    explanation: "개와 고양이 사진을 보고 정답을 맞추는 것은 미리 '개'와 '고양이'라는 정답을 알려주는 '지도 학습(Supervised Learning)'의 분류 문제입니다.",
    difficulty: '하'
  },
  {
    id: 3,
    question: "K-Means 알고리즘에서 'K'가 의미하는 것은 무엇인가요?",
    options: ["데이터의 총 개수", "반복 횟수", "만들고자 하는 그룹(군집)의 수", "데이터의 차원 수"],
    correctAnswer: 2,
    explanation: "K는 데이터를 몇 개의 그룹으로 나눌지 사용자가 미리 지정하는 군집의 수를 의미합니다.",
    difficulty: '중'
  },
  {
    id: 4,
    question: "쇼핑몰이 '장바구니 분석'을 통해 맥주와 기저귀를 같이 진열했습니다. 이것은 어떤 원리인가요?",
    options: ["연관 규칙 학습 (Association Rule Learning)", "회귀 분석 (Regression)", "이미지 인식 (Image Recognition)", "강화 학습 (Reinforcement Learning)"],
    correctAnswer: 0,
    explanation: "장바구니 분석은 데이터 간의 연관성을 찾아내는 비지도 학습의 일종인 '연관 규칙 학습'을 사용합니다.",
    difficulty: '중'
  },
  {
    id: 5,
    question: "다음 데이터 중 군집화하기 가장 어려운 상황은?",
    options: ["그룹 간의 거리가 멀고 밀집되어 있을 때", "그룹이 서로 겹치지 않고 명확할 때", "데이터가 무작위로 균일하게 퍼져 있을 때 (노이즈)", "데이터의 특징이 뚜렷할 때"],
    correctAnswer: 2,
    explanation: "데이터가 특징 없이 무작위로 균일하게 퍼져 있다면(Uniform Distribution), 의미 있는 군집을 찾기 어렵습니다.",
    difficulty: '상'
  },
  {
    id: 6,
    question: "K-Means 알고리즘의 초기 중심점(Centroid) 설정이 중요한 이유는?",
    options: ["초기값에 따라 최종 결과가 달라질 수 있기 때문", "초기값은 중요하지 않음", "데이터 개수가 변하기 때문", "K값이 변하기 때문"],
    correctAnswer: 0,
    explanation: "K-Means는 초기 중심점 위치에 따라 지역 최적점(Local Optimum)에 빠져 결과가 달라질 수 있습니다.",
    difficulty: '상'
  },
  {
    id: 7,
    question: "넷플릭스가 '당신이 좋아할 만한 영화'를 추천할 때 주로 사용하는 방식이 아닌 것은?",
    options: ["콘텐츠 기반 필터링", "협업 필터링", "지도 학습을 통한 스팸 메일 분류", "사용자 행동 패턴 군집화"],
    correctAnswer: 2,
    explanation: "스팸 메일 분류는 전형적인 지도 학습(스팸 O/X) 문제입니다. 추천 시스템은 주로 유사도 기반의 비지도/반지도 학습 기술을 활용합니다.",
    difficulty: '중'
  },
  {
    id: 8,
    question: "비지도 학습의 한계점으로 올바른 것은?",
    options: ["데이터가 너무 적으면 안 된다.", "결과가 맞는지 정답이 없어서 평가하기 어렵다.", "컴퓨터 성능이 많이 필요 없다.", "항상 지도 학습보다 성능이 좋다."],
    correctAnswer: 1,
    explanation: "정답(레이블)이 없기 때문에, 분류된 결과가 정말 의미 있는지 해석하고 평가하는 것이 주관적이거나 어려울 수 있습니다.",
    difficulty: '상'
  },
  {
    id: 9,
    question: "차원 축소(Dimensionality Reduction)도 비지도 학습의 일종입니다. 그 목적은?",
    options: ["데이터를 더 복잡하게 만들기 위해", "데이터의 시각화를 돕고 중요 정보만 압축하기 위해", "데이터의 개수를 늘리기 위해", "정답을 만들기 위해"],
    correctAnswer: 1,
    explanation: "차원 축소는 복잡한 데이터에서 불필요한 정보를 줄이고 핵심 특징을 추출하여 시각화하거나 연산 효율을 높이는 데 사용됩니다.",
    difficulty: '상'
  },
  {
    id: 10,
    question: "이상치 탐지(Anomaly Detection)에서 비지도 학습이 사용되는 예시는?",
    options: ["신용카드 부정 사용 감지", "개 사진 분류", "음성 인식", "바둑 두기"],
    correctAnswer: 0,
    explanation: "대부분의 정상 거래 패턴(군집)에서 벗어난 데이터를 찾는 방식으로, 정답 데이터(사기 거래)가 극히 드문 경우 비지도 학습 기반의 이상치 탐지가 유용합니다.",
    difficulty: '중'
  }
];