import { MenuItem, QuizQuestion, Badge } from './types';

export const INITIAL_MENU: MenuItem[] = [
  { id: 1, name: '아메리카노', price: 3000, category: 'coffee' },
  { id: 2, name: '카페라떼', price: 3500, category: 'coffee' },
  { id: 3, name: '바닐라라떼', price: 4000, category: 'coffee' },
  { id: 4, name: '레몬에이드', price: 4500, category: 'ade' },
  { id: 5, name: '자몽에이드', price: 4500, category: 'ade' },
  { id: 6, name: '초코케이크', price: 5500, category: 'dessert' },
];

export const BADGES: Badge[] = [
  { 
    id: 'best_employee', 
    name: '베스트 직원', 
    description: '정확한 포매팅으로 첫 주문을 완료하세요.', 
    icon: 'star', 
    earned: false 
  },
  { 
    id: 'data_manager', 
    name: '데이터 매니저', 
    description: '매출 내역을 파일(order_log.txt)에 저장하세요.', 
    icon: 'database', 
    earned: false 
  },
  { 
    id: 'python_master', 
    name: '파이썬 마스터', 
    description: '모든 퀴즈를 완료하세요.', 
    icon: 'award', 
    earned: false 
  },
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    difficulty: '초급',
    type: 'choice',
    question: '다음 중 사용자로부터 입력을 받는 파이썬 함수는 무엇입니까?',
    options: ['print()', 'input()', 'scan()', 'read()'],
    answer: 'input()',
    explanation: 'input() 함수는 사용자로부터 텍스트 입력을 받아 문자열(str)로 반환합니다.'
  },
  {
    id: 2,
    difficulty: '초급',
    type: 'choice',
    question: 'input("나이를 입력하세요")로 20을 입력받았을 때, 데이터의 타입은?',
    options: ['int (정수)', 'str (문자열)', 'float (실수)', 'bool (불리언)'],
    answer: 'str (문자열)',
    explanation: 'input() 함수는 사용자가 숫자를 입력하더라도 항상 문자열(str) 형태로 반환합니다.'
  },
  {
    id: 3,
    difficulty: '중급',
    type: 'input',
    question: '가격(price)이 4500일 때, "가격은 4500원입니다."를 출력하는 f-string을 완성하세요. print(f"가격은 {____}원입니다.")',
    answer: 'price',
    explanation: 'f-string을 사용할 때는 중괄호 {} 안에 변수명을 넣습니다.'
  },
  {
    id: 4,
    difficulty: '중급',
    type: 'choice',
    question: '파일을 "이어쓰기" 모드로 열 때 사용하는 모드는?',
    options: ["'r'", "'w'", "'a'", "'x'"],
    answer: "'a'",
    explanation: "'a'는 append(추가) 모드로, 기존 내용을 유지하고 끝에 새로운 내용을 추가합니다."
  },
  {
    id: 5,
    difficulty: '고급',
    type: 'input',
    question: '이스케이프 문자 중 "줄바꿈"을 의미하는 것은 무엇입니까? (역슬래시 포함)',
    answer: '\\n',
    explanation: '\\n은 New Line을 의미하며 줄을 바꿉니다.'
  },
];