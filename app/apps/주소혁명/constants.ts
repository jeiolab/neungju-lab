import { NavItem, QuizQuestion } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'concept', label: '개념 설명' },
  { id: 'visualizer', label: '시뮬레이션' },
  { id: 'learn-more', label: '더 알아보기' },
  { id: 'quiz', label: '퀴즈' },
  { id: 'discussion', label: '토론하기' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "IPv4 주소의 길이는 몇 비트(bit)인가요?",
    options: ["16비트", "32비트", "64비트", "128비트"],
    correctAnswer: 1,
    explanation: "IPv4는 32비트 주소 체계를 사용하여 약 43억 개의 주소를 생성할 수 있습니다.",
  },
  {
    id: 2,
    question: "다음 중 올바른 IPv6 주소 형식은 무엇인가요?",
    options: [
      "192.168.0.1",
      "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "255.255.255.0",
      "00-14-22-01-23-45"
    ],
    correctAnswer: 1,
    explanation: "IPv6는 16진수와 콜론(:)으로 구분된 형식을 사용합니다.",
  },
  {
    id: 3,
    question: "IPv6가 등장하게 된 가장 큰 이유는 무엇인가요?",
    options: [
      "인터넷 속도를 높이기 위해서",
      "해커를 막기 위해서",
      "IPv4 주소가 고갈되고 있기 때문에",
      "컴퓨터 가격을 낮추기 위해서"
    ],
    correctAnswer: 2,
    explanation: "IoT 기기 등의 증가로 인해 43억 개의 IPv4 주소가 부족해져 무한대에 가까운 IPv6가 필요해졌습니다.",
  },
];
