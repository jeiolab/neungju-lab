import { QuizQuestion, StudentAttribute, StudentMethod, StudentInstance, UserProgress } from './types';

// Predefined Attributes
export const ATTRIBUTE_OPTIONS: StudentAttribute[] = [
  { id: 'name', name: 'name', type: 'string', defaultValue: '', label: '이름 (String)' },
  { id: 'studentNo', name: 'studentNo', type: 'number', defaultValue: 0, label: '번호 (Number)' },
  { id: 'lateCount', name: 'lateCount', type: 'number', defaultValue: 0, label: '지각 횟수 (Number)' },
  { id: 'assignmentScore', name: 'assignmentScore', type: 'number', defaultValue: 0, label: '과제 점수 (Number)' },
  { id: 'isLeader', name: 'isLeader', type: 'boolean', defaultValue: false, label: '반장 여부 (Boolean)' },
];

// Predefined Methods (Logic will be handled in the component for simplicity of serialization)
export const METHOD_OPTIONS: Omit<StudentMethod, 'action'>[] = [
  { id: 'markLate', name: 'markLate()', description: '지각 횟수를 1 증가시킵니다.', label: '지각 체크 (+1)' },
  { id: 'submitAssignment', name: 'submitAssignment()', description: '과제 점수를 10점 부여합니다.', label: '과제 제출 (+10점)' },
  { id: 'resetLate', name: 'resetLate()', description: '지각 횟수를 0으로 초기화합니다.', label: '지각 사면 (초기화)' },
  { id: 'toggleLeader', name: 'toggleLeader()', description: '반장 상태를 변경합니다.', label: '반장 임명/해제' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple',
    difficulty: 'easy',
    question: '클래스(Class)와 인스턴스(Instance)의 관계에 대한 설명으로 옳은 것은?',
    options: [
      '클래스는 붕어빵이고 인스턴스는 붕어빵 틀이다.',
      '클래스는 설계도이고 인스턴스는 그 설계도로 만든 실체이다.',
      '인스턴스를 먼저 만들고 클래스를 정의한다.',
      '클래스와 인스턴스는 완전히 같은 말이다.'
    ],
    answer: '클래스는 설계도이고 인스턴스는 그 설계도로 만든 실체이다.',
    explanation: '클래스는 객체를 생성하기 위한 템플릿(설계도)이며, 인스턴스는 그 클래스에 따라 메모리에 생성된 실체입니다.'
  },
  {
    id: 2,
    type: 'short',
    difficulty: 'easy',
    question: '다음 문장의 빈칸을 채우시오. "속성(Attribute)은 객체의 상태를 나타내고, _____(은)는 객체의 동작을 나타낸다."',
    answer: '메서드',
    explanation: '객체지향에서 동작이나 기능은 메서드(Method)라고 부릅니다.'
  },
  {
    id: 3,
    type: 'multiple',
    difficulty: 'easy',
    question: 'Student 클래스로 학생 A와 학생 B 두 개의 인스턴스를 만들었습니다. 학생 A가 지각을 하면 학생 B의 지각 횟수도 올라가나요?',
    options: ['예', '아니오'],
    answer: '아니오',
    explanation: '인스턴스는 독립적인 메모리 공간을 가지므로, 서로의 상태(속성 값)에 영향을 주지 않습니다.'
  },
  {
    id: 4,
    type: 'multiple',
    difficulty: 'medium',
    question: '지각 횟수를 1 증가시키는 메서드를 호출했을 때, 실제로 값이 변경되는 곳은 어디입니까?',
    options: ['클래스 파일 내부', '해당 인스턴스의 메모리 공간', '모든 인스턴스의 메모리 공간', '전역 변수'],
    answer: '해당 인스턴스의 메모리 공간',
    explanation: '메서드는 호출된 특정 인스턴스(this)의 속성 값을 변경합니다.'
  },
  {
    id: 5,
    type: 'short',
    difficulty: 'medium',
    question: '객체 내부에 있는 함수를 특별히 무엇이라 부르는가?',
    answer: '메서드',
    explanation: '클래스나 객체 내부에 정의된 함수를 메서드(Method)라고 합니다.'
  },
  {
    id: 6,
    type: 'multiple',
    difficulty: 'medium',
    question: '다음 중 속성(Attribute)으로 적절하지 않은 것은?',
    options: ['학생 이름', '키', '달리기()', '몸무게'],
    answer: '달리기()',
    explanation: '달리기는 동작이므로 메서드로 구현하는 것이 적절합니다.'
  },
  {
    id: 7,
    type: 'multiple',
    difficulty: 'hard',
    question: '전역 변수 대신 클래스를 사용하는 이유로 가장 적절한 것은?',
    options: [
      '코드를 짧게 쓰기 위해서',
      '관련된 데이터와 함수를 하나로 묶어 관리하고 재사용하기 위해서',
      '컴퓨터 속도를 빠르게 하기 위해서',
      '변수 이름을 마음대로 짓기 위해서'
    ],
    answer: '관련된 데이터와 함수를 하나로 묶어 관리하고 재사용하기 위해서',
    explanation: '객체지향의 핵심인 캡슐화와 관련이 있으며, 유지보수성과 재사용성을 높여줍니다.'
  },
  {
    id: 8,
    type: 'short',
    difficulty: 'hard',
    question: '클래스에서 생성된 객체(인스턴스)가 가지는 고유한 변수를 무엇이라 하는가? (oo 변수)',
    answer: '인스턴스',
    explanation: '인스턴스마다 개별적으로 가지는 변수를 인스턴스 변수(Instance Variable)라고 합니다.'
  },
  {
    id: 9,
    type: 'multiple',
    difficulty: 'hard',
    question: '다음 코드가 실행된 후 s1.count의 값은?\nclass S { count = 0; up() { this.count++; } }\nconst s1 = new S();\nconst s2 = new S();\ns1.up();\ns2.up();\ns1.up();',
    options: ['1', '2', '3', '0'],
    answer: '2',
    explanation: 's1에 대해 up()이 2번 호출되었으므로 s1.count는 2가 됩니다. s2의 호출은 s1에 영향을 주지 않습니다.'
  },
  {
    id: 10,
    type: 'short',
    difficulty: 'hard',
    question: '객체지향 프로그래밍의 약자는?',
    answer: 'OOP',
    explanation: 'Object-Oriented Programming'
  }
];

export const INITIAL_PROGRESS: UserProgress = {
  points: 0,
  badges: [],
  streak: 1,
  lastLogin: new Date().toISOString(),
  completedWizard: false,
  quizScore: 0,
  thinkingCompleted: 0
};