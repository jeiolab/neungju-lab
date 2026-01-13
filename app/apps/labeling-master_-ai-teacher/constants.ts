import { QuizQuestion, SimItem } from './types';

export const THEORY_STEPS = [
  {
    title: "지도학습이란?",
    content: "지도학습(Supervised Learning)은 마치 선생님이 학생에게 정답을 알려주며 가르치는 것과 같습니다. 데이터(문제)와 정답(레이블)을 함께 주어 학습시킵니다.",
    keyword: "핵심: 정답이 있는 데이터"
  },
  {
    title: "주요 키워드",
    content: "1. 특성(Feature): 데이터의 특징 (예: 과일의 색깔, 무게)\n2. 레이블(Label): 우리가 예측하고 싶은 정답 (예: 사과, 바나나)",
    keyword: "입력(X) -> 출력(Y)"
  },
  {
    title: "실생활 예시",
    content: "스팸 메일 필터가 대표적입니다. 사용자가 '이것은 스팸이야'라고 지정(라벨링)해주면, AI는 그 메일의 단어(특성)를 분석해 스팸을 걸러내는 법을 배웁니다.",
    keyword: "스팸 분류기"
  }
];

export const SIMULATION_ITEMS: SimItem[] = [
  { id: '1', type: 'apple', feature: '빨갛고 둥글다', icon: '🍎' },
  { id: '2', type: 'banana', feature: '노랗고 길다', icon: '🍌' },
  { id: '3', type: 'apple', feature: '초록색이며 둥글다', icon: '🍏' },
  { id: '4', type: 'banana', feature: '노랗고 휘어짐', icon: '🍌' },
  { id: '5', type: 'apple', feature: '작고 빨갛다', icon: '🍎' },
  { id: '6', type: 'banana', feature: '갈색 반점이 있는 노란색', icon: '🍌' },
  { id: '7', type: 'apple', feature: '매끈한 빨간 껍질', icon: '🍎' },
  { id: '8', type: 'banana', feature: '길쭉한 모양', icon: '🍌' },
  { id: '9', type: 'apple', feature: '아삭한 식감의 둥근 과일', icon: '🍎' },
  { id: '10', type: 'banana', feature: '부드러운 과육의 긴 과일', icon: '🍌' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "지도학습에서 가장 중요한 두 가지 요소는 무엇인가요?",
    options: ["특성과 정답(레이블)", "보상과 벌칙", "군집과 분류", "데이터와 노이즈"],
    correctAnswer: 0,
    explanation: "지도학습은 입력 데이터인 '특성'과 그에 대한 '정답(레이블)' 쌍으로 학습합니다.",
    difficulty: '하'
  },
  {
    id: 2,
    question: "다음 중 지도학습이 아닌 것은?",
    options: ["스팸 메일 분류", "개와 고양이 사진 분류", "비슷한 뉴스 기사끼리 묶기(뉴스 그룹화)", "집 값 예측"],
    correctAnswer: 2,
    explanation: "뉴스 그룹화는 정답 없이 데이터의 유사성만으로 묶는 '비지도학습(군집화)'에 속합니다.",
    difficulty: '중'
  },
  {
    id: 3,
    question: "데이터의 '특성(Feature)'에 대한 설명으로 옳은 것은?",
    options: ["예측해야 할 정답이다.", "데이터가 가진 특징적 정보이다.", "학습이 끝난 모델이다.", "잘못된 데이터이다."],
    correctAnswer: 1,
    explanation: "특성은 데이터를 설명하는 정보입니다. (예: 과일의 무게, 색상 등)",
    difficulty: '하'
  },
  {
    id: 4,
    question: "과일 분류 문제에서 '사과', '바나나'와 같이 예측하려는 항목을 무엇이라 부르나요?",
    options: ["특성(Feature)", "레이블(Label)", "속성(Attribute)", "패턴(Pattern)"],
    correctAnswer: 1,
    explanation: "우리가 예측하고자 하는 정답을 '레이블(Label)' 또는 '클래스'라고 부릅니다.",
    difficulty: '하'
  },
  {
    id: 5,
    question: "훈련 데이터(Training Data)는 무엇을 위해 사용되나요?",
    options: ["모델의 성능을 최종 평가하기 위해", "모델이 패턴을 학습하기 위해", "데이터를 삭제하기 위해", "사용자에게 보여주기 위해"],
    correctAnswer: 1,
    explanation: "훈련 데이터는 모델이 입력과 정답 사이의 관계(패턴)를 배우는 데 사용됩니다.",
    difficulty: '중'
  },
  {
    id: 6,
    question: "만약 지도학습 모델에 정답을 잘못 알려주면 어떤 일이 발생할까요?",
    options: ["스스로 정답을 찾아낸다.", "학습을 거부한다.", "잘못된 지식을 그대로 학습한다.", "더 똑똑해진다."],
    correctAnswer: 2,
    explanation: "지도학습은 주어진 정답을 절대적인 진리로 받아들이므로, 잘못된 정답(Garbage)을 주면 잘못된 결과(Garbage)를 냅니다.",
    difficulty: '중'
  },
  {
    id: 7,
    question: "다음 중 '회귀(Regression)' 문제인 것은? (회귀도 지도학습의 일종)",
    options: ["이메일이 스팸인지 아닌지 분류", "내일 비가 올지 안 올지 예측", "내일의 기온(숫자) 예측", "사진 속 인물 이름 맞추기"],
    correctAnswer: 2,
    explanation: "연속적인 숫자(기온, 가격 등)를 예측하는 것을 회귀라고 합니다. 나머지는 분류 문제입니다.",
    difficulty: '상'
  },
  {
    id: 8,
    question: "비지도학습(Unsupervised Learning)과의 가장 큰 차이점은?",
    options: ["데이터의 양", "정답(레이블)의 유무", "컴퓨터의 성능", "학습 속도"],
    correctAnswer: 1,
    explanation: "가장 큰 차이는 훈련 데이터에 '정답(레이블)'이 포함되어 있는지 여부입니다.",
    difficulty: '중'
  },
  {
    id: 9,
    question: "모델이 훈련 데이터는 완벽하게 맞추지만, 새로운 데이터는 잘 못 맞추는 현상을 무엇이라 하나요?",
    options: ["과소적합(Underfitting)", "과대적합(Overfitting)", "최적화(Optimization)", "정규화(Normalization)"],
    correctAnswer: 1,
    explanation: "훈련 데이터에만 너무 과하게 맞춰져 실전 성능이 떨어지는 것을 '과대적합'이라고 합니다.",
    difficulty: '상'
  },
  {
    id: 10,
    question: "알파고가 바둑 기보(정답이 있는 데이터)를 보고 학습한 초기 단계는 어떤 학습 방식인가요?",
    options: ["지도학습", "비지도학습", "강화학습", "자율학습"],
    correctAnswer: 0,
    explanation: "초기에는 인간 기사의 기보(데이터+정답)를 바탕으로 '지도학습'을 수행했습니다.",
    difficulty: '상'
  }
];