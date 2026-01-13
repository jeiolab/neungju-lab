import { Concept, DataType, GameItem, QuizQuestion, Badge } from './types';
import { Trophy, Flame, Zap, Brain, Target, Star, AlertTriangle, Hash, Type } from 'lucide-react';

export const CONCEPTS: Concept[] = [
  {
    id: 'c_variable',
    title: '변수 (Variable)',
    definition: '값을 저장하는 이름이 붙은 기억 공간입니다.',
    keywords: ['기억공간', '이름', '값'],
    example: 'score = 100',
    misconception: '변수는 수학의 미지수 x와 완전히 같다? (NO, 컴퓨터에서는 "저장소" 개념입니다)',
    checkQuestion: '변수에 값을 넣을 때 사용하는 기호는?',
    checkAnswer: '=',
    type: DataType.VARIABLE
  },
  {
    id: 'c_int',
    title: '정수 (int)',
    definition: '소수점이 없는 숫자입니다.',
    keywords: ['0', '음수', '양수'],
    example: 'age = 17, year = 2024',
    misconception: '"123"도 정수다? (NO, 따옴표가 있으면 문자열입니다)',
    checkQuestion: '-5는 정수일까요?',
    checkAnswer: '네',
    type: DataType.INT
  },
  {
    id: 'c_float',
    title: '실수 (float)',
    definition: '소수점이 포함된 숫자입니다.',
    keywords: ['소수점', '정밀도', '숫자'],
    example: 'pi = 3.14, height = 175.5',
    misconception: '3.0은 정수다? (NO, 소수점이 찍히면 실수형으로 처리됩니다)',
    checkQuestion: '3.14의 자료형은?',
    checkAnswer: 'float',
    type: DataType.FLOAT
  },
  {
    id: 'c_str',
    title: '문자열 (str)',
    definition: '문자들의 나열로, 따옴표로 감싸서 표현합니다.',
    keywords: ['따옴표', '텍스트', '순서'],
    example: 'name = "Python", msg = \'안녕\'',
    misconception: '따옴표 없는 hello는 문자열이다? (NO, 변수 이름으로 해석됩니다)',
    checkQuestion: '"10" + "10"의 결과는?',
    checkAnswer: '1010',
    type: DataType.STR
  },
  {
    id: 'c_bool',
    title: '불 (bool)',
    definition: '참(True)과 거짓(False)만을 나타내는 자료형입니다.',
    keywords: ['True', 'False', '논리'],
    example: 'is_student = True',
    misconception: '"True"는 불 자료형이다? (NO, 따옴표가 있으면 문자열입니다)',
    checkQuestion: '10 > 5 의 결과값은?',
    checkAnswer: 'True',
    type: DataType.BOOL
  },
  {
    id: 'c_type',
    title: 'type() 함수',
    definition: '데이터의 자료형을 알려주는 도구입니다.',
    keywords: ['확인', '자료형', '함수'],
    example: 'type(3.14) -> <class \'float\'>',
    misconception: 'type("123")은 int다? (NO, str입니다)',
    checkQuestion: 'type(True)의 결과는?',
    checkAnswer: 'bool',
    type: DataType.VARIABLE
  }
];

export const GAME_ITEMS: GameItem[] = [
  { id: 'g1', value: '17', type: DataType.INT },
  { id: 'g2', value: '-5', type: DataType.INT },
  { id: 'g3', value: '0', type: DataType.INT },
  { id: 'g4', value: '3.14', type: DataType.FLOAT },
  { id: 'g5', value: '-0.01', type: DataType.FLOAT },
  { id: 'g6', value: '10.0', type: DataType.FLOAT },
  { id: 'g7', value: '"Hello"', type: DataType.STR },
  { id: 'g8', value: "'안녕'", type: DataType.STR },
  { id: 'g9', value: '"123"', type: DataType.STR },
  { id: 'g10', value: 'True', type: DataType.BOOL },
  { id: 'g11', value: 'False', type: DataType.BOOL },
  { id: 'g12', value: '"True"', type: DataType.STR },
  { id: 'g13', value: '"3.14"', type: DataType.STR },
  { id: 'g14', value: '100', type: DataType.INT },
  { id: 'g15', value: '2.718', type: DataType.FLOAT },
];

export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 'q1',
    text: '다음 중 "문자열"이 아닌 것은?',
    options: ['"Hello"', "'Python'", 'True', '"123"'],
    correctAnswer: 'True',
    explanation: 'True는 따옴표가 없으므로 불(bool) 자료형입니다.',
    type: DataType.STR,
    difficulty: 'easy'
  },
  {
    id: 'q2',
    text: '변수 x에 10.0을 저장했습니다. x의 자료형은?',
    options: ['int', 'float', 'str', 'bool'],
    correctAnswer: 'float',
    explanation: '소수점(.0)이 포함되어 있으므로 실수(float)입니다.',
    type: DataType.FLOAT,
    difficulty: 'easy'
  },
  {
    id: 'q3',
    text: '다음 코드의 결과는? print(type("100"))',
    options: ['int', 'float', 'str', 'number'],
    correctAnswer: 'str',
    explanation: '따옴표로 감싸져 있으므로 문자열(str)입니다.',
    type: DataType.STR,
    difficulty: 'normal'
  },
  {
    id: 'q4',
    text: '정수(int)를 저장하기 가장 적절한 변수 이름과 값은?',
    options: ['age = 17', 'pi = 3.14', 'name = "Kim"', 'is_ok = True'],
    correctAnswer: 'age = 17',
    explanation: '17은 소수점이 없는 숫자이므로 정수입니다.',
    type: DataType.INT,
    difficulty: 'normal'
  },
  {
    id: 'q5',
    text: 'Python에서 "같다"를 의미하는 연산자는?',
    options: ['=', '==', ':', '<-'],
    correctAnswer: '==',
    explanation: '=는 대입 연산자이고, ==는 비교(같다) 연산자입니다.',
    type: DataType.BOOL,
    difficulty: 'normal'
  },
  {
    id: 'q6',
    text: '다음 중 Boolean(불) 값이 될 수 없는 것은?',
    options: ['True', 'False', '"True"', '10 > 5의 결과'],
    correctAnswer: '"True"',
    explanation: '"True"는 따옴표가 있으므로 문자열입니다.',
    type: DataType.BOOL,
    difficulty: 'hard'
  },
  {
    id: 'q7',
    text: 'a = 10, b = "20" 일 때 print(a * 2)의 결과는?',
    options: ['20', '"2020"', 'Error', '200'],
    correctAnswer: '20',
    explanation: 'a는 정수 10이므로 2를 곱하면 정수 20이 됩니다.',
    type: DataType.INT,
    difficulty: 'hard'
  },
  {
    id: 'q8',
    text: '빈 문자열을 표현하는 방법으로 옳은 것은?',
    options: ['""', 'String()', 'Empty', 'null'],
    correctAnswer: '""',
    explanation: '따옴표 사이에 아무것도 없으면 빈 문자열입니다.',
    type: DataType.STR,
    difficulty: 'normal'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'newbie',
    name: '시작이 반이다',
    description: '첫 레벨업 달성',
    icon: 'seedling',
    condition: (s) => s.level >= 2
  },
  {
    id: 'int_master',
    name: '정수 마스터',
    description: '정수 마스터리 100 달성',
    icon: 'hash',
    condition: (s) => s.mastery[DataType.INT] >= 100
  },
  {
    id: 'streak_3',
    name: '작심삼일 극복',
    description: '3일 연속 학습',
    icon: 'flame',
    condition: (s) => s.streak >= 3
  },
  {
    id: 'quiz_hunter',
    name: '퀴즈 헌터',
    description: 'XP 300 이상 달성',
    icon: 'target',
    condition: (s) => s.xp >= 300
  }
];