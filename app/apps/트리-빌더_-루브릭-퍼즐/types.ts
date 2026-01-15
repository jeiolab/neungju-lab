export type Grade = 'A' | 'B' | 'C';

export interface StudentWork {
  id: number;
  name: string;
  submittedOnTime: boolean; // 제출 기한 준수
  hasTwoSources: boolean;   // 근거 자료 2개 이상
  hasConclusion: boolean;   // 결론 요약 포함
  isNeat: boolean;          // 발표 자료 깔끔함
  hasVisuals: boolean;      // 시각 자료 포함
  trueGrade: Grade;         // 실제 정답(Ground Truth)
}

export interface Question {
  id: string;
  text: string;
  field: keyof Omit<StudentWork, 'id' | 'name' | 'trueGrade'>;
  cost?: number; // 나중에 비용 개념 도입 시 사용
}

export type Screen = 'HOME' | 'THEORY' | 'SIMULATION' | 'QUIZ' | 'REFLECTION';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
