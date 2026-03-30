import { Student, QuizQuestion } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "김철수", scores: [85, 90, 78] },
  { id: 2, name: "이영희", scores: [92, 88, 95] },
  { id: 3, name: "박민수", scores: [76, 85, 82] },
  { id: 4, name: "최수진", scores: [88, 92, 89] },
  { id: 5, name: "정다은", scores: [95, 96, 98] },
];

export const SUBJECTS = ["국어", "영어", "수학"];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "scores = [[80, 90], [70, 85]] 일 때, scores[1][0]의 값은?",
    options: ["80", "90", "70", "85"],
    correctAnswer: 2,
    explanation: "인덱스는 0부터 시작합니다. scores[1]은 두 번째 리스트 [70, 85]를 의미하고, 그 안의 [0]번째 요소는 70입니다."
  },
  {
    id: 2,
    question: "2차원 리스트의 모든 요소를 출력하기 위해 가장 적합한 반복문 구조는?",
    options: ["단일 for문", "중첩 for문 (이중 반복문)", "while문", "if-else문"],
    correctAnswer: 1,
    explanation: "행을 순회하는 외부 반복문과, 각 행의 열을 순회하는 내부 반복문이 필요하므로 중첩 for문이 적합합니다."
  },
  {
    id: 3,
    question: "학생 한 명이 전학을 왔습니다. scores 리스트는 어떻게 변경되어야 할까요?",
    options: ["scores[0]에 점수 추가", "scores.append([새 점수 리스트])", "scores[new] = [점수]", "새로운 리스트 변수 생성"],
    correctAnswer: 1,
    explanation: "전체 리스트에 새로운 행(학생의 점수 리스트)을 추가해야 하므로 append를 사용하여 [국, 영, 수] 리스트를 추가합니다."
  }
];

export const SYSTEM_INSTRUCTION = `
당신은 학교의 "정보샘"입니다. 
당신의 목표는 프로그래밍 초보자인 동료 선생님들에게 "2차원 리스트(배열)"의 개념을 아주 쉽고 친절하게 설명하는 것입니다.
다음 규칙을 따르세요:
1. 엑셀(표)과 파이썬 리스트(코드)를 비교해서 설명하세요.
2. 행(Row)은 학생, 열(Column)은 과목이라는 비유를 계속 사용하세요.
3. 인덱스가 0부터 시작한다는 점을 헷갈리지 않게 강조하세요.
4. 말투는 정중하면서도 격려하는 선생님 말투를 사용하세요. (예: "~입니다", "~해볼까요?")
5. 사용자가 코드를 어려워하면 "서랍장 속의 서랍장" 같은 비유를 들어주세요.
`;