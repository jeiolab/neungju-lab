import { Scenario, QuizQuestion, Difficulty } from '../types';

export const SCENARIOS: Scenario[] = [
  // Easy Scenarios (Direct Comparison)
  {
    id: 1,
    difficulty: 'easy',
    situation: "손님이 '콜라'를 계산대에 가져왔습니다. 현재 재고는 5개입니다.",
    ruleDescription: "재고가 1개 이상이면 판매 가능",
    requiredVariables: ['stock'],
    providedVariables: { item: 'Cola', stock: 5 },
    result: 'Possible',
    logicExpression: "stock >= 1",
    explanation: "재고가 5개이므로 1보다 큽니다. (5 >= 1)은 참(True)입니다."
  },
  {
    id: 2,
    difficulty: 'easy',
    situation: "손님이 도시락을 구매하려 합니다. 가격은 5,000원인데 잔액이 4,500원입니다.",
    ruleDescription: "잔액이 상품 가격보다 크거나 같아야 구매 가능",
    requiredVariables: ['balance', 'price'],
    providedVariables: { balance: 4500, price: 5000 },
    result: 'Impossible',
    logicExpression: "balance >= price",
    explanation: "4500 >= 5000은 거짓(False)이므로 구매할 수 없습니다."
  },
  {
    id: 3,
    difficulty: 'easy',
    situation: "1+1 행사가 진행 중입니다. 손님이 상품 1개만 가져왔습니다.",
    ruleDescription: "상품 개수가 짝수(2의 배수)여야 1+1 혜택 적용 가능",
    requiredVariables: ['count'],
    providedVariables: { count: 1 },
    result: 'Impossible',
    logicExpression: "count % 2 == 0",
    explanation: "1을 2로 나눈 나머지는 1입니다. (1 % 2 == 0)은 거짓입니다."
  },
  
  // Normal Scenarios (Logic Operators & Membership)
  {
    id: 4,
    difficulty: 'normal',
    situation: "손님이 '바나나우유'를 가져왔습니다. 멤버십 카드는 없습니다.",
    ruleDescription: "상품이 '우유' 종류이고 멤버십이 있어야 할인",
    requiredVariables: ['item_type', 'has_membership'],
    providedVariables: { item_type: 'milk', has_membership: false },
    result: 'Impossible',
    logicExpression: "(item_type == 'milk') and has_membership",
    explanation: "우유는 맞지만(True), 멤버십이 없으므로(False) AND 연산 결과는 거짓입니다."
  },
  {
    id: 5,
    difficulty: 'normal',
    situation: "손님이 담배를 구매하려 합니다. 신분증 검사를 아직 안 했습니다.",
    ruleDescription: "나이가 19세 이상이어야 판매 가능",
    requiredVariables: ['age'],
    providedVariables: { item: 'cigarette' }, // Age missing
    result: 'Conditional',
    logicExpression: "age >= 19",
    explanation: "손님의 나이(age) 정보가 주어지지 않아 판단할 수 없습니다."
  },
  {
    id: 6,
    difficulty: 'normal',
    situation: "행사 상품 목록: [콜라, 사이다, 환타]. 손님이 '물'을 가져왔습니다.",
    ruleDescription: "상품이 행사 목록에 포함되어야 할인",
    requiredVariables: ['item', 'event_list'],
    providedVariables: { item: 'water', event_list: ['cola', 'cider', 'fanta'] },
    result: 'Impossible',
    logicExpression: "item in event_list",
    explanation: "'물'은 목록에 없습니다. ('water' in list)는 거짓입니다."
  },

  // Hard Scenarios (Complex Logic & Boundary Conditions)
  {
    id: 7,
    difficulty: 'hard',
    situation: "총 구매액 49,000원. 멤버십 있음.",
    ruleDescription: "총액 5만원 이상이거나, (4만원 이상이고 멤버십이 있으면) 무료 배송",
    requiredVariables: ['total', 'membership'],
    providedVariables: { total: 49000, membership: true },
    result: 'Possible',
    logicExpression: "(total >= 50000) or (total >= 40000 and membership)",
    explanation: "5만원 미만이지만(False), 4만원 이상이고 멤버십이 있어(True) OR 조건에 의해 참이 됩니다."
  },
  {
    id: 8,
    difficulty: 'hard',
    situation: "오후 11시 방문. 미성년자 출입 금지 시간(22:00 ~ 06:00). 손님 나이 모름.",
    ruleDescription: "현재 시간이 22시~06시 사이라면 성인만 출입 가능",
    requiredVariables: ['current_time', 'age'],
    providedVariables: { current_time: 23 }, // Age missing
    result: 'Conditional',
    logicExpression: "not (22 <= current_time or current_time < 6) or (age >= 19)",
    explanation: "제한 시간이므로 나이 확인이 필요하지만, 나이 정보가 없습니다."
  },
  {
    id: 9,
    difficulty: 'hard',
    situation: "쿠폰: 'SUMMER_SALE'. 손님이 제시한 쿠폰: 'summer_sale'.",
    ruleDescription: "쿠폰 코드가 정확히 일치해야 할인 (대소문자 구분)",
    requiredVariables: ['coupon_input', 'valid_coupon'],
    providedVariables: { coupon_input: 'summer_sale', valid_coupon: 'SUMMER_SALE' },
    result: 'Impossible',
    logicExpression: "coupon_input == valid_coupon",
    explanation: "컴퓨터는 대소문자를 다르게 인식합니다. 's' != 'S'이므로 거짓입니다."
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Easy
  {
    id: 101,
    difficulty: 'easy',
    type: 'multiple',
    question: "다음 중 비교 연산의 결과가 '참(True)'인 것은?",
    options: ["10 == 5", "5 != 5", "10 >= 10", "3 > 5"],
    correctAnswer: "10 >= 10",
    explanation: "10은 10과 같으므로 크거나 같다(>=) 조건은 참입니다."
  },
  {
    id: 102,
    difficulty: 'easy',
    type: 'short',
    question: "파이썬 등에서 '같다'를 의미하는 비교 연산자는 기호로 무엇인가요?",
    correctAnswer: "==",
    explanation: "=는 대입 연산자이고, ==가 비교 연산자입니다."
  },
  {
    id: 103,
    difficulty: 'easy',
    type: 'multiple',
    question: "A와 B가 모두 참일 때만 결과가 참이 되는 논리 연산자는?",
    options: ["or", "and", "not", "in"],
    correctAnswer: "and",
    explanation: "AND 연산자는 모든 조건이 참이어야 결과가 참이 됩니다."
  },
  // Normal
  {
    id: 201,
    difficulty: 'normal',
    type: 'multiple',
    question: "menu = ['밥', '라면']. '김치' in menu 의 결과는?",
    options: ["True", "False", "Error", "None"],
    correctAnswer: "False",
    explanation: "리스트 안에 '김치'라는 문자열이 없으므로 False입니다."
  },
  {
    id: 202,
    difficulty: 'normal',
    type: 'short',
    question: "age = 15, rule = (age < 10 or age > 20). 결과는 True인가 False인가?",
    correctAnswer: "False",
    explanation: "15는 10보다 작지도 않고 20보다 크지도 않으므로 둘 다 False, OR 결과도 False입니다."
  },
  {
    id: 203,
    difficulty: 'normal',
    type: 'multiple',
    question: "조건부 판단(Conditional)이 필요한 상황은?",
    options: [
      "변수 A, B의 값이 모두 주어졌을 때",
      "비교 연산자가 == 일 때",
      "판단에 필요한 변수의 값이 주어지지 않았을 때",
      "항상 True일 때"
    ],
    correctAnswer: "판단에 필요한 변수의 값이 주어지지 않았을 때",
    explanation: "필수 정보가 누락되면 참/거짓을 확정할 수 없습니다."
  },
  // Hard
  {
    id: 301,
    difficulty: 'hard',
    type: 'short',
    question: "논리 연산 순서에서 not, and, or 중 가장 우선순위가 높은 것은?",
    correctAnswer: "not",
    explanation: "일반적으로 not > and > or 순서로 연산됩니다."
  },
  {
    id: 302,
    difficulty: 'hard',
    type: 'multiple',
    question: "사용자 입력 처리에 대한 설명으로 틀린 것은?",
    options: [
      "공백(space)도 문자로 취급된다.",
      "대소문자는 서로 다른 문자로 취급된다.",
      "' 123'과 '123'은 같다.",
      "입력값을 다룰 때는 정규화(Trim 등)가 필요하다."
    ],
    correctAnswer: "' 123'과 '123'은 같다.",
    explanation: "공백이 포함된 문자열은 공백이 없는 문자열과 다릅니다."
  },
  {
    id: 303,
    difficulty: 'hard',
    type: 'multiple',
    question: "다음 조건식의 결과는? (True or False) and False",
    options: ["True", "False", "Error", "Alway True"],
    correctAnswer: "False",
    explanation: "괄호 안 (True or False)는 True가 되지만, 뒤에 and False가 있으므로 최종 결과는 False입니다."
  },
  {
    id: 304,
    difficulty: 'hard',
    type: 'essay',
    question: "오타로 인해 in 연산자가 오작동하는 예시를 하나 들어보세요.",
    correctAnswer: "", // Manual review or self-check
    explanation: "예: 리스트에는 'Apple'이 있는데 사용자가 'apple'을 입력하면 찾지 못함."
  }
];

export const getScenariosByDifficulty = (diff: Difficulty) => {
  return SCENARIOS.filter(s => s.difficulty === diff);
};