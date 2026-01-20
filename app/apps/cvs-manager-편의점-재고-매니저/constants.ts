import { Item } from './types';

export const INITIAL_ITEMS: Item[] = [
  { id: '1', name: '삼각김밥', price: 1200, stock: 5, icon: '🍙' },
  { id: '2', name: '바나나우유', price: 1500, stock: 3, icon: '🍌' },
  { id: '3', name: '컵라면', price: 1800, stock: 4, icon: '🍜' },
  { id: '4', name: '초콜릿', price: 2000, stock: 2, icon: '🍫' },
  { id: '5', name: '생수', price: 1000, stock: 10, icon: '💧' },
  { id: '6', name: '샌드위치', price: 2500, stock: 0, icon: '🥪' }, // Start out of stock to test error handling
];

export const INITIAL_CUSTOMER_MONEY = 5000;
export const INITIAL_CUSTOMER_NAME = "학생";

export const QUIZ_DATA = [
  {
    question: "고객이 1500원짜리 바나나우유를 샀습니다. 고객 객체의 `money` 속성은 어떻게 변할까요?",
    options: ["증가한다", "감소한다", "변하지 않는다", "알 수 없다"],
    answer: 1,
    explanation: "구매 행위는 고객의 돈을 지불하는 것이므로 money 속성은 상품 가격만큼 감소합니다."
  },
  {
    question: "상품의 재고가 0일 때 구매를 시도하면 어떤 일이 발생해야 할까요?",
    options: ["마이너스 재고가 된다", "외상으로 처리된다", "예외 처리를 통해 구매를 막는다", "프로그램이 종료된다"],
    answer: 2,
    explanation: "현실 세계의 논리를 반영하여, 재고가 부족할 경우 `if` 문 등을 통해 예외 처리를 해야 합니다."
  },
  {
    question: "클래스에서 객체의 초기 속성(이름, 가격 등)을 설정하는 특별한 메소드는 무엇인가요?",
    options: ["__str__", "__init__", "start", "setup"],
    answer: 1,
    explanation: "파이썬에서는 `__init__` 생성자 메소드를 통해 객체 생성 시 초기 상태를 정의합니다."
  }
];