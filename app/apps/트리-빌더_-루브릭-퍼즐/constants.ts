import { Question, StudentWork, QuizQuestion } from './types';

// 질문 카드 목록
export const QUESTIONS: Question[] = [
  { id: 'q1', text: "제출 기한을 지켰나요?", field: 'submittedOnTime' },
  { id: 'q2', text: "근거 자료가 2개 이상인가요?", field: 'hasTwoSources' },
  { id: 'q3', text: "결론이 요약되어 있나요?", field: 'hasConclusion' },
  { id: 'q4', text: "발표 자료가 깔끔한가요?", field: 'isNeat' },
  { id: 'q5', text: "이미지/도표가 포함되었나요?", field: 'hasVisuals' },
];

// 학생 데이터 (Ground Truth)
// 규칙: A등급(기한O + 근거O + 결론O), B등급(기한O + 근거X or 결론X), C등급(기한X 등)
// 완벽하게 분류되지 않도록 노이즈를 섞음
export const STUDENT_DATA: StudentWork[] = [
  { id: 1, name: "학생 1", submittedOnTime: true, hasTwoSources: true, hasConclusion: true, isNeat: true, hasVisuals: true, trueGrade: 'A' },
  { id: 2, name: "학생 2", submittedOnTime: true, hasTwoSources: true, hasConclusion: true, isNeat: false, hasVisuals: true, trueGrade: 'A' },
  { id: 3, name: "학생 3", submittedOnTime: true, hasTwoSources: false, hasConclusion: true, isNeat: true, hasVisuals: true, trueGrade: 'B' },
  { id: 4, name: "학생 4", submittedOnTime: false, hasTwoSources: true, hasConclusion: true, isNeat: true, hasVisuals: false, trueGrade: 'C' },
  { id: 5, name: "학생 5", submittedOnTime: true, hasTwoSources: true, hasConclusion: false, isNeat: true, hasVisuals: true, trueGrade: 'B' },
  { id: 6, name: "학생 6", submittedOnTime: false, hasTwoSources: false, hasConclusion: false, isNeat: false, hasVisuals: false, trueGrade: 'C' },
  { id: 7, name: "학생 7", submittedOnTime: true, hasTwoSources: true, hasConclusion: true, isNeat: true, hasVisuals: false, trueGrade: 'A' },
  { id: 8, name: "학생 8", submittedOnTime: true, hasTwoSources: false, hasConclusion: false, isNeat: true, hasVisuals: true, trueGrade: 'B' },
  { id: 9, name: "학생 9", submittedOnTime: false, hasTwoSources: true, hasConclusion: false, isNeat: false, hasVisuals: true, trueGrade: 'C' },
  { id: 10, name: "학생 10", submittedOnTime: true, hasTwoSources: true, hasConclusion: false, isNeat: false, hasVisuals: false, trueGrade: 'B' },
  { id: 11, name: "학생 11", submittedOnTime: true, hasTwoSources: true, hasConclusion: true, isNeat: true, hasVisuals: true, trueGrade: 'A' }, // 노이즈 없음
  { id: 12, name: "학생 12", submittedOnTime: true, hasTwoSources: true, hasConclusion: true, isNeat: true, hasVisuals: true, trueGrade: 'B' }, // 노이즈: 조건 좋은데 B
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "의사결정트리의 가장 맨 위에 있는, 첫 번째 질문 노드를 무엇이라고 부르나요?",
    options: ["리프 노드(Leaf Node)", "루트 노드(Root Node)", "가지(Branch)", "줄기(Stem)"],
    correctAnswer: 1,
    explanation: "트리의 시작점이자 첫 번째 분기가 일어나는 곳을 '루트 노드'라고 합니다."
  },
  {
    id: 2,
    question: "트리를 너무 깊게 만들어서, 학습 데이터만 완벽하게 외워버리는 현상을 무엇이라고 할까요?",
    options: ["과소적합(Underfitting)", "과대적합(Overfitting)", "가지치기(Pruning)", "일반화(Generalization)"],
    correctAnswer: 1,
    explanation: "학습 데이터에만 너무 맞춰져서 새로운 데이터에 대한 예측력이 떨어지는 것을 '과대적합(오버피팅)'이라고 합니다."
  },
  {
    id: 3,
    question: "의사결정트리의 장점으로 올바르지 않은 것은?",
    options: ["결과를 해석하기 쉽다.", "데이터 전처리가 거의 필요 없다.", "복잡한 비선형 관계도 모델링 가능하다.", "항상 가장 높은 정확도를 보장한다."],
    correctAnswer: 3,
    explanation: "의사결정트리는 강력하지만, 항상 최고의 정확도를 보장하지는 않습니다. 때로는 랜덤 포레스트 같은 앙상블 기법이 필요합니다."
  }
];
