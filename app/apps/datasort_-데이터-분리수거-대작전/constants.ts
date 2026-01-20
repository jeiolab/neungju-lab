import { DataItem, QuizQuestion, TabConfig } from './types';

// Templates for generating random game items
export const DATA_TEMPLATES = [
  { content: 123, type: 'int', display: '123' },
  { content: -5, type: 'int', display: '-5' },
  { content: 0, type: 'int', display: '0' },
  { content: 9999, type: 'int', display: '9999' },
  
  { content: 3.14, type: 'float', display: '3.14' },
  { content: -0.5, type: 'float', display: '-0.5' },
  { content: 10.0, type: 'float', display: '10.0' },
  { content: 0.001, type: 'float', display: '0.001' },
  
  { content: "Hello", type: 'str', display: '"Hello"' },
  { content: "123", type: 'str', display: '"123"' },
  { content: "True", type: 'str', display: '"True"' },
  { content: "3.14", type: 'str', display: "'3.14'" },
  { content: "", type: 'str', display: '""' },
  
  { content: true, type: 'bool', display: 'True' },
  { content: false, type: 'bool', display: 'False' },
] as const;

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "파이썬에서 '3.14'는 실수형(float) 데이터이다.",
    answer: false,
    explanation: "따옴표로 감싸져 있으므로 문자열(str)입니다."
  },
  {
    id: 2,
    question: "True는 불린형(bool) 데이터이다.",
    answer: true,
    explanation: "True와 False는 참/거짓을 나타내는 불린형입니다."
  },
  {
    id: 3,
    question: "10과 10.0은 데이터 타입이 같다.",
    answer: false,
    explanation: "10은 정수(int), 10.0은 실수(float)로 타입이 다릅니다."
  },
  {
    id: 4,
    question: "\"False\"는 불린형 데이터이다.",
    answer: false,
    explanation: "따옴표가 있으므로 문자열(str)입니다."
  }
];

export const TABS: TabConfig[] = [
  { id: 'theory', label: '개념 연구소', icon: 'BookOpen' },
  { id: 'game', label: '분리수거 게임', icon: 'Gamepad2' },
  { id: 'advanced', label: '심화 학습', icon: 'Beaker' },
  { id: 'quiz', label: '개념 확인', icon: 'CheckCircle' },
  { id: 'think', label: '데이터 토론', icon: 'BrainCircuit' },
];
