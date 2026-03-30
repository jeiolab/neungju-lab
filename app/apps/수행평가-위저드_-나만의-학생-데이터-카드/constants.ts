import { DataItemTemplate, QuizQuestion } from './types';

export const DATA_ITEM_TEMPLATES: DataItemTemplate[] = [
  { id: 'math_score', label: '수학 점수', defaultType: 'int', description: '시험 점수 (예: 90)' },
  { id: 'height', label: '키(cm)', defaultType: 'float', description: '소수점 포함 키 (예: 170.5)' },
  { id: 'name', label: '이름', defaultType: 'str', description: '학생의 이름' },
  { id: 'is_glasses', label: '안경 착용 여부', defaultType: 'bool', description: '참/거짓 (True/False)' },
  { id: 'club', label: '동아리', defaultType: 'str', description: '가입한 동아리 이름' },
  { id: 'target_grade', label: '목표 등급', defaultType: 'int', description: '목표로 하는 등급 (숫자)' },
  { id: 'vision', label: '시력', defaultType: 'float', description: '좌우 시력 (예: 1.2)' },
  { id: 'has_siblings', label: '형제자매 유무', defaultType: 'bool', description: '있으면 True, 없으면 False' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "파이썬에서 정수형 데이터를 저장하는 자료형은?",
    options: ["int", "float", "str", "bool"],
    answer: 0,
    explanation: "정수는 integer의 약자인 int를 사용합니다.",
    tags: ["자료형", "숫자"]
  },
  {
    id: 2,
    question: "다음 중 변수 선언이 올바른 것은?",
    options: ["1st_score = 100", "math score = 90", "class = 3", "my_score = 95"],
    answer: 3,
    explanation: "변수명은 숫자로 시작할 수 없고, 공백을 포함할 수 없으며, 예약어(class 등)를 사용할 수 없습니다.",
    tags: ["변수명규칙"]
  },
  {
    id: 3,
    question: "type(3.14)의 결과로 알맞은 것은?",
    options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
    answer: 1,
    explanation: "소수점이 있는 숫자는 실수형(float)입니다.",
    tags: ["자료형", "함수"]
  },
  {
    id: 4,
    question: "다음 중 문자열(str)이 아닌 것은?",
    options: ["\"Hello\"", "'123'", "True", "\"3.14\""],
    answer: 2,
    explanation: "True는 따옴표가 없으므로 불리언(bool) 자료형입니다.",
    tags: ["자료형", "문자열"]
  },
  {
    id: 5,
    question: "age = 17 일 때, print(age)의 결과는?",
    options: ["age", "17", "\"17\"", "Error"],
    answer: 1,
    explanation: "변수 age에 저장된 값인 17이 출력됩니다.",
    tags: ["변수", "출력"]
  },
  {
    id: 6,
    question: "논리형(Boolean)이 가질 수 있는 값은?",
    options: ["Yes / No", "True / False", "0 / 1", "T / F"],
    answer: 1,
    explanation: "파이썬의 bool 자료형은 True(참)와 False(거짓) 두 가지 값만 가집니다 (대문자 유의).",
    tags: ["자료형", "불리언"]
  },
  {
    id: 7,
    question: "변수 이름으로 권장되는 표기법은? (예: student_name)",
    options: ["카멜 케이스(studentName)", "스네이크 케이스(student_name)", "파스칼 케이스(StudentName)", "케밥 케이스(student-name)"],
    answer: 1,
    explanation: "파이썬에서는 보통 단어 사이를 언더바(_)로 연결하는 스네이크 케이스를 권장합니다.",
    tags: ["변수명규칙"]
  },
  {
    id: 8,
    question: "score = \"100\" 일 때 type(score)는?",
    options: ["int", "float", "str", "number"],
    answer: 2,
    explanation: "큰따옴표로 감싸져 있으므로 문자열(str)입니다.",
    tags: ["자료형", "함오해"]
  },
  {
    id: 9,
    question: "키 175.5를 int로 변환하면?",
    options: ["176", "175", "175.5", "Error"],
    answer: 1,
    explanation: "int(175.5)는 소수점 이하를 버리고 175가 됩니다.",
    tags: ["형변환"]
  },
  {
    id: 10,
    question: "다음 중 대입 연산자는?",
    options: ["==", "=", ":", "->"],
    answer: 1,
    explanation: "수학의 등호(=)는 파이썬에서 '오른쪽 값을 왼쪽 변수에 저장하라'는 대입 연산자입니다.",
    tags: ["연산자"]
  }
];

export const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];