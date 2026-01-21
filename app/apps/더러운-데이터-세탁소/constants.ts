import { GameLevel, QuizQuestion } from './types';

export const LEVELS: GameLevel[] = [
  {
    level: 1,
    description: "훈련일: 기초적인 문제를 찾아보세요.",
    rows: 6,
    defects: { nan: 2, outliers: 1, duplicates: 0, typos: 0 }
  },
  {
    level: 2,
    description: "인턴: 중복된 데이터를 삭제하세요.",
    rows: 10,
    defects: { nan: 3, outliers: 2, duplicates: 2, typos: 0 }
  },
  {
    level: 3,
    description: "주니어 분석가: 오타와 이상치를 모두 잡으세요.",
    rows: 15,
    defects: { nan: 4, outliers: 3, duplicates: 2, typos: 3 }
  }
];

export const STATIC_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "데이터 과학에서 GIGO는 무엇의 약자일까요?",
    options: [
      "Good Input, Good Output (좋은 입력, 좋은 출력)",
      "Garbage In, Garbage Out (쓰레기가 들어가면 쓰레기가 나온다)",
      "Global Index, Global Order (국제 지표, 국제 질서)",
      "Get Info, Give Out (정보 획득, 정보 제공)"
    ],
    correctAnswer: 1,
    explanation: "GIGO는 품질이 나쁜 데이터(쓰레기)를 입력하면 결과 분석도 나쁠 수밖에 없다는 원칙입니다."
  },
  {
    id: 2,
    question: "다음 중 '이상치(Outlier)'에 해당하는 것은?",
    options: [
      "학생 나이 21세",
      "만족도 점수 4/5",
      "사람 키 350cm",
      "누락된 출석 데이터"
    ],
    correctAnswer: 2,
    explanation: "키 350cm(3.5미터)는 생물학적으로 사람에게 불가능한 수치이므로 명백한 이상치입니다."
  },
  {
    id: 3,
    question: "수치형 데이터가 누락되었을 때(NaN) 가장 흔히 사용하는 처리 방법은?",
    options: [
      "텍스트 'Missing'으로 채운다",
      "해당 열(Column)의 평균값(Mean)으로 대체한다",
      "무조건 해당 열 전체를 삭제한다",
      "그냥 비워둔다"
    ],
    correctAnswer: 1,
    explanation: "평균값 대치(Imputation)는 다른 데이터 행을 보존하면서 결측치를 합리적으로 채우는 일반적인 방법입니다."
  }
];

export const INITIAL_STATS = {
  streak: 0,
  lastLogin: '',
  maxScore: 0,
  clearedStages: 0
};