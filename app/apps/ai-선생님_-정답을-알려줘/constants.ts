import { QuizQuestion, CleaningItem } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "지도학습(Supervised Learning)의 가장 큰 특징은 무엇인가요?",
    options: ["정답(레이블)이 있는 데이터를 사용한다.", "데이터에 정답이 없다.", "보상을 통해 학습한다.", "데이터 없이 스스로 학습한다."],
    correctAnswer: 0,
    explanation: "지도학습은 문제와 정답(레이블)이 함께 주어지는 학습 방식입니다."
  },
  {
    id: 2,
    question: "다음 중 '분류(Classification)' 문제인 것은?",
    options: ["내일의 기온 예측하기", "아파트 가격 예측하기", "스팸 메일인지 아닌지 구별하기", "학생의 키로 몸무게 예측하기"],
    correctAnswer: 2,
    explanation: "스팸 메일 판별은 '스팸' 또는 '정상' 중 하나를 선택하는 분류 문제입니다. 나머지는 수치를 예측하는 회귀 문제입니다."
  },
  {
    id: 3,
    question: "모델을 훈련시킬 때 사용하지 않은 새로운 데이터로 성능을 평가하는 과정을 무엇이라 하나요?",
    options: ["데이터 세탁", "테스트(Test)", "압축", "레이블링"],
    correctAnswer: 1,
    explanation: "학습된 모델이 실전에서도 잘 작동하는지 확인하기 위해 테스트 데이터를 사용합니다."
  },
  {
    id: 4,
    question: "잘못된 정답(레이블)을 계속 학습시키면 발생하는 문제는?",
    options: ["모델이 똑똑해진다", "편향(Bias)되거나 성능이 떨어진다", "학습 속도가 빨라진다", "데이터가 깨끗해진다"],
    correctAnswer: 1,
    explanation: "잘못된 데이터(Garbage In)는 잘못된 결과(Garbage Out)를 낳습니다."
  },
  {
    id: 5,
    question: "고양이 사진에 '개'라고 레이블을 붙이는 것은 올바른 학습 방법인가요?",
    options: ["네", "아니오"],
    correctAnswer: 1,
    explanation: "레이블은 데이터의 정확한 정답이어야 합니다."
  }
];

export const CLEANING_DATA_POOL: CleaningItem[] = [
  { id: 1, imageEmoji: "🍎", assignedLabel: "사과", isCorrect: true },
  { id: 2, imageEmoji: "🍌", assignedLabel: "사과", isCorrect: false },
  { id: 3, imageEmoji: "🐶", assignedLabel: "강아지", isCorrect: true },
  { id: 4, imageEmoji: "🐱", assignedLabel: "강아지", isCorrect: false },
  { id: 5, imageEmoji: "🚗", assignedLabel: "자동차", isCorrect: true },
  { id: 6, imageEmoji: "✈️", assignedLabel: "자동차", isCorrect: false },
  { id: 7, imageEmoji: "🐯", assignedLabel: "호랑이", isCorrect: true },
  { id: 8, imageEmoji: "🦁", assignedLabel: "호랑이", isCorrect: false },
  { id: 9, imageEmoji: "🍇", assignedLabel: "포도", isCorrect: true },
  { id: 10, imageEmoji: "🍉", assignedLabel: "포도", isCorrect: false },
];
