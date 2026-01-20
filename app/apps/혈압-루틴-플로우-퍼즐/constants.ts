import { PuzzleLevel, QuizQuestion } from './types';

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: 1,
    title: "기초: 순차 구조",
    description: "혈압을 측정하고 결과를 표시하는 가장 단순한 흐름을 완성하세요.",
    initialBlocks: [
      { id: 'start', type: 'start', label: '시작', isLocked: true },
      null,
      null,
      { id: 'end', type: 'end', label: '종료', isLocked: true }
    ],
    availableBlocks: [
      { id: 'input_bp', type: 'input', label: '혈압 측정 입력' },
      { id: 'print_result', type: 'process', label: '결과 화면 출력' },
      { id: 'wrong_1', type: 'condition', label: '만약 혈압이 높다면?' } // Distractor
    ],
    correctSequence: ['시작', '혈압 측정 입력', '결과 화면 출력', '종료'],
    hint: ["입력을 먼저 받아야 결과를 출력할 수 있습니다.", "순서대로 블록을 채워보세요."]
  },
  {
    id: 2,
    title: "응용: 선택 구조 (분기)",
    description: "고혈압(140 이상)인지 정상인지 판단하여 다른 메시지를 출력하세요.",
    initialBlocks: [
      { id: 'start', type: 'start', label: '시작', isLocked: true },
      { id: 'input_bp', type: 'input', label: '혈압 측정', isLocked: true },
      null,
      { id: 'branch_true', type: 'process', label: '(예) 주의 요망 출력', isLocked: true },
      { id: 'branch_false', type: 'process', label: '(아니오) 정상입니다 출력', isLocked: true },
      { id: 'end', type: 'end', label: '종료', isLocked: true }
    ],
    availableBlocks: [
      { id: 'cond_140', type: 'condition', label: '수축기 혈압 >= 140?' },
      { id: 'cond_90', type: 'condition', label: '수축기 혈압 < 90?' },
      { id: 'proc_rest', type: 'process', label: '10분 휴식' }
    ],
    correctSequence: ['시작', '혈압 측정', '수축기 혈압 >= 140?', '(예) 주의 요망 출력', '(아니오) 정상입니다 출력', '종료'],
    hint: ["140 이상일 때와 아닐 때를 나누는 조건이 필요합니다.", "다이아몬드 모양이 조건 블록입니다."]
  },
  {
    id: 3,
    title: "심화: 반복 구조 (Loop)",
    description: "혈압이 높다면 안정을 취한 뒤 '다시 측정'하는 루틴을 만드세요.",
    initialBlocks: [
      { id: 'start', type: 'start', label: '시작', isLocked: true },
      { id: 'loop_anchor', type: 'loop_start', label: '측정 위치', isLocked: true },
      { id: 'input_bp', type: 'input', label: '혈압 측정', isLocked: true },
      null,
      null,
      { id: 'loop_back', type: 'loop_end', label: '측정 위치로 이동', isLocked: true },
      { id: 'print_ok', type: 'process', label: '정상 기록', isLocked: true },
      { id: 'end', type: 'end', label: '종료', isLocked: true }
    ],
    availableBlocks: [
      { id: 'cond_high', type: 'condition', label: '혈압 >= 140?' },
      { id: 'rest_10', type: 'process', label: '10분 안정' },
      { id: 'eat_food', type: 'process', label: '식사 하기' }
    ],
    correctSequence: ['시작', '측정 위치', '혈압 측정', '혈압 >= 140?', '10분 안정', '측정 위치로 이동', '정상 기록', '종료'],
    hint: ["높으면 휴식 후 다시 재야 합니다.", "조건문 바로 뒤에 휴식이 와야 합니다."]
  }
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "프로그램이 위에서 아래로 한 줄씩 실행되는 구조는?",
    options: ["순차 구조", "선택 구조", "반복 구조", "객체 지향"],
    correctAnswer: 0,
    explanation: "순차 구조는 명령어가 나열된 순서대로 실행되는 가장 기본적인 제어 구조입니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "혈압이 140 이상일 때만 '주의'를 출력하려면 필요한 구조는?",
    options: ["순차 구조", "선택 구조 (if)", "반복 구조 (while)", "입출력 구조"],
    correctAnswer: 1,
    explanation: "조건(140 이상)에 따라 실행 여부가 달라지므로 선택(조건) 구조가 필요합니다.",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "안정을 취한 후 '다시 측정' 단계로 돌아가는 화살표가 의미하는 것은?",
    options: ["프로그램 종료", "선택 분기", "반복(Loop)", "변수 선언"],
    correctAnswer: 2,
    explanation: "이전 단계로 되돌아가서 코드를 다시 실행하는 것은 반복 구조의 특징입니다.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "다음 중 논리 연산자 AND에 해당하는 상황은?",
    options: ["수축기가 140 이상이거나 이완기가 90 이상일 때", "수축기가 140 이상이고 이완기가 90 이상일 때", "혈압을 측정하지 않았을 때", "항상 참일 때"],
    correctAnswer: 1,
    explanation: "AND는 두 조건이 모두 참이어야 전체가 참이 됩니다.",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "중첩된 선택 구조(Nested If)가 필요한 상황은?",
    options: ["단순히 혈압을 측정할 때", "혈압이 높은지 판단하고, 높다면 그 중에서 180 이상인지 또 판단할 때", "혈압을 3번 연속 측정할 때", "결과를 화면에 보여줄 때"],
    correctAnswer: 1,
    explanation: "조건 안에 또 다른 조건이 있을 때 중첩 구조를 사용합니다.",
    difficulty: 'hard'
  },
  {
    id: 6,
    question: "반복문에서 '종료 조건'이 없으면 발생하는 문제는?",
    options: ["컴파일 에러", "무한 루프(Infinite Loop)", "실행 속도 향상", "결과가 정확해짐"],
    correctAnswer: 1,
    explanation: "반복을 멈추는 조건이 없으면 프로그램이 영원히 같은 구간을 맴도는 무한 루프에 빠집니다.",
    difficulty: 'hard'
  },
  {
    id: 7,
    question: "알고리즘의 시각적 표현 방법으로, 도형과 화살표를 사용하는 것은?",
    options: ["의사코드(Pseudo-code)", "순서도(Flowchart)", "소스코드", "디버거"],
    correctAnswer: 1,
    explanation: "순서도는 약속된 기호를 사용하여 논리 흐름을 그림으로 표현한 것입니다.",
    difficulty: 'easy'
  },
  {
    id: 8,
    question: "'만약 혈압 < 90 이면 저혈압, 아니면 정상' 구조에서 '아니면(Else)'이 실행되는 경우는?",
    options: ["혈압이 80일 때", "혈압이 89일 때", "혈압이 90 이상일 때", "혈압 측정 오류일 때"],
    correctAnswer: 2,
    explanation: "조건(90 미만)이 거짓인 경우, 즉 90 이상인 경우에 Else 블록이 실행됩니다.",
    difficulty: 'medium'
  },
  {
    id: 9,
    question: "들여쓰기(Indentation)가 중요한 이유는?",
    options: ["컴퓨터 성능을 위해", "코드의 포함 관계(블록)를 시각적으로 구분하기 위해", "주석을 달기 위해", "파일 용량을 줄이기 위해"],
    correctAnswer: 1,
    explanation: "제어 구조의 범위를 명확히 하여 코드의 흐름을 사람이 이해하기 쉽게 돕습니다. 파이썬 등에서는 문법 필수 요소입니다.",
    difficulty: 'easy'
  },
  {
    id: 10,
    question: "다음 의사코드의 출력은? [x=150, if x>140: print('A'), if x>160: print('B') else: print('C')]",
    options: ["A", "B", "A 그리고 C", "C"],
    correctAnswer: 2,
    explanation: "첫 번째 if문 참(A 출력). 두 번째 if문 안에서 x>160은 거짓이므로 else(C 출력). 따라서 A와 C가 출력됩니다.",
    difficulty: 'hard'
  }
];

export const REFLECTION_QUESTIONS = [
  { id: 'ref_1', text: "일상 생활에서 '선택 구조(만약 ~라면)'가 쓰이는 예를 하나만 들어보세요." },
  { id: 'ref_2', text: "반복 구조가 없다면, 100명의 혈압을 잴 때 어떤 불편함이 있을까요?" },
  { id: 'ref_3', text: "혈압 측정 시 '안정 후 재측정'을 무한히 반복하지 않으려면 어떤 조건이 추가로 필요할까요?" }
];