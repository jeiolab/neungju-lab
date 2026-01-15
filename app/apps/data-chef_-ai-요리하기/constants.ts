import { QuizQuestion, Ingredient } from './types';

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 1, type: 'good', name: '신선한 당근', isSelected: false },
  { id: 2, type: 'good', name: '신선한 당근', isSelected: false },
  { id: 3, type: 'noise', name: '썩은 당근', isSelected: false },
  { id: 4, type: 'good', name: '신선한 감자', isSelected: false },
  { id: 5, type: 'noise', name: '돌멩이', isSelected: false },
  { id: 6, type: 'good', name: '신선한 감자', isSelected: false },
  { id: 7, type: 'good', name: '신선한 양파', isSelected: false },
  { id: 8, type: 'noise', name: '벌레 먹은 잎', isSelected: false },
  { id: 9, type: 'good', name: '신선한 양파', isSelected: false },
  { id: 10, type: 'good', name: '신선한 양파', isSelected: false },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "기계학습 과정의 올바른 순서는 무엇일까요?",
    options: [
      "평가 -> 학습 -> 전처리 -> 수집",
      "데이터 수집/전처리 -> 모델 학습 -> 평가 -> 적용",
      "모델 학습 -> 데이터 수집 -> 평가 -> 적용",
      "적용 -> 평가 -> 학습 -> 데이터 수집"
    ],
    correctAnswer: 1,
    explanation: "요리를 할 때 재료를 먼저 준비하고(수집/전처리), 요리하고(학습), 간을 보고(평가), 손님에게 내는(적용) 순서와 같습니다."
  },
  {
    id: 2,
    question: "데이터 전처리 단계에서 하는 일이 아닌 것은?",
    options: [
      "이상한 데이터(노이즈) 제거",
      "빠진 값 채워 넣기",
      "데이터의 형태 맞추기",
      "최종 정답 예측하기"
    ],
    correctAnswer: 3,
    explanation: "최종 정답을 예측하는 것은 학습된 모델이 나중에 수행하는 일입니다. 전처리는 재료를 다듬는 과정입니다."
  },
  {
    id: 3,
    question: "훈련 데이터와 테스트 데이터를 섞어서 학습하면 어떤 문제가 발생하나요?",
    options: [
      "모델이 더 똑똑해진다.",
      "학습 속도가 빨라진다.",
      "과적합(Overfitting) 여부를 제대로 평가할 수 없다.",
      "데이터 양이 늘어나서 좋다."
    ],
    correctAnswer: 2,
    explanation: "시험 문제(테스트 데이터)를 미리 보고 공부(학습)하면 실력을 제대로 평가할 수 없습니다. 이를 데이터 누수라고도 합니다."
  }
];

export const GLOSSARY_TERMS = {
  "데이터 전처리": "수집한 데이터를 AI가 학습하기 좋게 다듬는 과정. 요리 재료를 씻고 자르는 것과 같습니다.",
  "학습 데이터": "모델을 가르치기 위해 사용하는 데이터. 요리 연습용 재료입니다.",
  "테스트 데이터": "모델의 성능을 평가하기 위해 남겨둔 데이터. 요리 대회 심사평가용 재료입니다.",
  "모델": "데이터를 입력받아 판단이나 예측을 하는 AI의 두뇌. 요리 도구(오븐, 믹서기)나 레시피에 비유됩니다.",
  "과적합": "학습 데이터만 달달 외워서 새로운 데이터에는 엉뚱하게 반응하는 상태. 우물 안 개구리 같은 상태입니다.",
  "노이즈": "데이터에 섞인 오류나 불필요한 정보. 요리 재료에 섞인 흙이나 상한 부분입니다."
};