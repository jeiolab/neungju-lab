import { StudentData, QuizQuestion } from './types';

// Mock Data: Class Survey (Height in cm, Size S/M/L/XL, Satisfaction 1-5)
// Includes deliberate dirty data:
// - Missing heights (null)
// - Outlier heights (e.g., 999, 10, 300)
// - Missing sizes
export const RAW_DATA: StudentData[] = [
  { id: 1, height: 170, size: 'M', satisfaction: 4 },
  { id: 2, height: 165, size: 'S', satisfaction: 5 },
  { id: 3, height: null, size: 'L', satisfaction: 3 }, // Missing Height
  { id: 4, height: 175, size: 'L', satisfaction: 4 },
  { id: 5, height: 999, size: 'XL', satisfaction: 1 }, // Extreme Outlier
  { id: 6, height: 160, size: 'S', satisfaction: 5 },
  { id: 7, height: 168, size: 'M', satisfaction: 4 },
  { id: 8, height: 10, size: null, satisfaction: 2 }, // Outlier + Missing Size
  { id: 9, height: 180, size: 'XL', satisfaction: 5 },
  { id: 10, height: null, size: 'M', satisfaction: 3 }, // Missing Height
  { id: 11, height: 172, size: 'L', satisfaction: 4 },
  { id: 12, height: 300, size: 'XL', satisfaction: 1 }, // Extreme Outlier
  { id: 13, height: 158, size: 'S', satisfaction: 4 },
  { id: 14, height: 169, size: null, satisfaction: 3 }, // Missing Size
  { id: 15, height: 177, size: 'L', satisfaction: 5 },
  { id: 16, height: 171, size: 'M', satisfaction: 4 },
  { id: 17, height: 165, size: 'M', satisfaction: 3 },
  { id: 18, height: -50, size: 'S', satisfaction: 1 }, // Impossible Outlier
  { id: 19, height: 182, size: 'XL', satisfaction: 5 },
  { id: 20, height: 174, size: 'L', satisfaction: 4 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "결측치(Missing Value)가 포함된 데이터를 무조건 삭제하면 발생하는 문제는?",
    options: ["데이터 처리가 빨라진다", "데이터의 양이 줄어들어 정보 손실이 발생한다", "평균값이 정확해진다", "이상치가 자동으로 제거된다"],
    correctIndex: 1,
    explanation: "결측치를 무조건 삭제하면 분석에 필요한 중요한 데이터까지 잃을 수 있습니다(정보 손실).",
    relatedConcept: "missing"
  },
  {
    id: 2,
    question: "이상치(Outlier)가 평균(Mean)에 미치는 영향은?",
    options: ["영향이 거의 없다", "이상치 쪽으로 평균이 크게 끌려간다", "중앙값과 같아진다", "데이터 개수에 따라 다르다"],
    correctIndex: 1,
    explanation: "평균은 극단적인 값(이상치)에 매우 민감하여 값이 왜곡될 수 있습니다.",
    relatedConcept: "outlier"
  },
  {
    id: 3,
    question: "키 데이터에 '999cm'가 입력되어 있습니다. 이는 어떤 유형의 데이터인가요?",
    options: ["결측치", "이상치", "중복값", "정상값"],
    correctIndex: 1,
    explanation: "현실적으로 불가능하거나 일반적인 범위를 크게 벗어난 값은 이상치입니다.",
    relatedConcept: "outlier"
  },
  {
    id: 4,
    question: "이상치의 영향을 덜 받는 대표값은 무엇인가요?",
    options: ["평균(Mean)", "최대값(Max)", "중앙값(Median)", "표준편차(Std Dev)"],
    correctIndex: 2,
    explanation: "중앙값은 데이터를 순서대로 나열했을 때 가운데 값이므로 극단값의 영향을 받지 않습니다.",
    relatedConcept: "general"
  },
  {
    id: 5,
    question: "범주형 데이터(예: 티셔츠 사이즈 S, M, L)의 결측치를 채울 때 가장 적절한 값은?",
    options: ["평균값", "최빈값", "중앙값", "0으로 대체"],
    correctIndex: 1,
    explanation: "문자 데이터는 평균을 계산할 수 없으므로, 가장 자주 등장하는 값(최빈값)으로 대체하는 것이 일반적입니다.",
    relatedConcept: "missing"
  },
  {
    id: 6,
    question: "데이터 전처리 순서로 가장 적절한 것은?",
    options: ["분석 -> 전처리 -> 시각화", "전처리 -> 데이터 수집 -> 분석", "데이터 수집 -> 전처리 -> 분석", "시각화 -> 데이터 수집 -> 전처리"],
    correctIndex: 2,
    explanation: "데이터를 수집한 후, 분석하기 전에 반드시 깨끗하게 만드는 전처리 과정이 필요합니다.",
    relatedConcept: "general"
  },
  {
    id: 7,
    question: "이상치를 판단하고 제거하는 기준으로 적절하지 않은 것은?",
    options: ["IQR 규칙 사용", "표준편차(Z-Score) 활용", "도메인 지식 활용(예: 키는 음수가 될 수 없음)", "그냥 내 마음에 안 드는 값 삭제"],
    correctIndex: 3,
    explanation: "데이터 처리는 객관적인 통계적 기준이나 도메인 지식에 근거해야 합니다.",
    relatedConcept: "outlier"
  },
  {
    id: 8,
    question: "결측치를 평균으로 대체했을 때 발생할 수 있는 현상은?",
    options: ["분산(퍼짐 정도)이 과소평가된다", "데이터 개수가 줄어든다", "이상치가 늘어난다", "아무 변화 없다"],
    correctIndex: 0,
    explanation: "평균값 데이터가 인위적으로 많아지면, 데이터들이 평균 근처에 몰려있는 것처럼 보여 분산이 실제보다 작아집니다.",
    relatedConcept: "missing"
  },
  {
    id: 9,
    question: "다음 중 '전처리' 과정에 포함되지 않는 것은?",
    options: ["결측치 처리", "이상치 제거", "데이터 정규화", "최종 보고서 작성"],
    correctIndex: 3,
    explanation: "보고서 작성은 분석 결과를 정리하는 단계이며, 전처리는 분석 전 데이터를 다듬는 단계입니다.",
    relatedConcept: "general"
  },
  {
    id: 10,
    question: "데이터 전처리를 하는 근본적인 이유는?",
    options: ["데이터 용량을 늘리기 위해", "분석 결과의 신뢰도를 높이기 위해", "컴퓨터 성능을 테스트하기 위해", "그래프를 예쁘게 그리기 위해"],
    correctIndex: 1,
    explanation: "Garbage In, Garbage Out! 품질이 나쁜 데이터로는 올바른 결론을 낼 수 없기 때문입니다.",
    relatedConcept: "general"
  }
];

export const BADGES = {
  MISSING_TAMER: { id: 'missing_tamer', name: '결측치 조련사', desc: '4가지 결측치 처리 방식을 모두 실험해봤어요!' },
  OUTLIER_KING: { id: 'outlier_king', name: '이상치 조절왕', desc: '이상치 강도를 다양하게 조절해봤어요!' },
  QUIZ_MASTER: { id: 'quiz_master', name: '이론 마스터', desc: '퀴즈에서 80점 이상을 받았어요!' },
  THINKER: { id: 'thinker', name: '깊은 생각', desc: '실험 결과에 대한 분석을 작성했어요!' }
};
