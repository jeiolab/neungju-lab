import { Product, QuizQuestion } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "삼각김밥", price: 1500, sales: 120 },
  { id: 2, name: "바나나 우유", price: 1800, sales: 85 },
  { id: 3, name: "컵라면", price: 1200, sales: 200 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 정형 데이터(Structured Data)가 아닌 것은?",
    options: ["엑셀 스프레드시트", "사원 데이터베이스 (SQL)", "유튜브 브이로그 영상", "학생 성적표 (CSV)"],
    correctAnswer: 2,
    explanation: "정형 데이터는 데이터베이스처럼 행과 열(고정된 필드)로 정리된 데이터입니다. 영상은 고정된 스키마가 없는 비정형 데이터입니다."
  },
  {
    id: 2,
    question: "왜 '가격'을 텍스트 대신 숫자(Integer)로 정의할까요?",
    options: ["보기에 예뻐서", "합계나 평균 같은 수학적 계산을 하기 위해서", "컴퓨터는 글자를 싫어해서", "하드디스크 용량을 아끼려고"],
    correctAnswer: 1,
    explanation: "데이터 타입을 숫자로 지정하면 컴퓨터가 별도의 변환 없이 즉시 수학적 연산을 효율적으로 수행할 수 있습니다."
  },
  {
    id: 3,
    question: "분석 관점에서 정형 데이터의 가장 큰 장점은 무엇인가요?",
    options: ["알록달록하다", "검색과 집계(계산) 속도가 매우 빠르다", "무한한 텍스트를 저장할 수 있다", "준비 과정이 필요 없다"],
    correctAnswer: 1,
    explanation: "구조(스키마)가 미리 정의되어 있기 때문에, 데이터 엔진이 검색과 계산을 최적화하여 밀리초 단위로 결과를 낼 수 있습니다."
  }
];