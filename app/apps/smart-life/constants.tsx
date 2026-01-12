import { ConceptCardData, SmartDevice, QuizQuestion } from './types';

export const CONCEPTS: ConceptCardData[] = [
  {
    title: "사물인터넷 (IoT)",
    description: "모든 사물이 인터넷으로 연결되다",
    detail: "가전제품, 자동차, 센서 등 다양한 사물들이 인터넷에 연결되어 서로 정보를 주고받으며 스스로 작동하는 기술입니다.",
    iconName: 'IoT'
  },
  {
    title: "인공지능 비서",
    description: "내 말을 알아듣는 똑똑한 비서",
    detail: "음성을 인식하고 분석하여 사용자가 원하는 정보(날씨, 음악 재생, 일정 관리 등)를 제공하거나 기기를 제어합니다.",
    iconName: 'AI'
  },
  {
    title: "웨어러블 기기",
    description: "입을 수 있는 스마트 기기",
    detail: "스마트 워치처럼 몸에 착용하여 심박수, 운동량, 수면 패턴 등 나의 건강 정보를 실시간으로 측정하고 관리합니다.",
    iconName: 'Wearable'
  }
];

export const SMART_DEVICES: SmartDevice[] = [
  {
    id: 'speaker',
    name: '스마트 스피커',
    description: '음성 명령으로 집안을 제어해요.',
    effectMessage: '🎵 "오늘 날씨 어때?" 스마트 스피커가 아침 브리핑을 시작합니다!',
    score: 20,
    iconName: 'Speaker'
  },
  {
    id: 'vacuum',
    name: '로봇 청소기',
    description: '알아서 바닥을 깨끗하게 청소해요.',
    effectMessage: '🧹 외출한 사이 로봇 청소기가 거실을 반짝반짝하게 만들었습니다!',
    score: 25,
    iconName: 'Vacuum'
  },
  {
    id: 'light',
    name: '스마트 조명',
    description: '상황에 맞춰 분위기를 바꿔줘요.',
    effectMessage: '💡 공부할 때는 집중 모드, 쉴 때는 휴식 모드로 조명이 자동 변경됩니다!',
    score: 15,
    iconName: 'Light'
  },
  {
    id: 'fridge',
    name: '스마트 냉장고',
    description: '식재료 관리와 레시피 추천까지!',
    effectMessage: '🥛 우유가 다 떨어졌네요! 스마트 냉장고가 장보기 목록에 추가했습니다.',
    score: 30,
    iconName: 'Fridge'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "사물인터넷(IoT)은 오직 컴퓨터와 스마트폰끼리만 연결하는 기술이다.",
    answer: false,
    explanation: "사물인터넷은 가전제품, 자동차 등 우리 주변의 '모든 사물'이 인터넷으로 연결되는 기술입니다."
  },
  {
    id: 2,
    question: "웨어러블 기기를 활용하면 실시간으로 나의 건강 상태를 확인할 수 있다.",
    answer: true,
    explanation: "스마트 워치 등은 심박수, 운동량 등을 측정하여 건강 관리에 도움을 줍니다."
  },
  {
    id: 3,
    question: "디지털 기술의 발전은 생활을 편리하게 해주지만, 보안 문제에는 신경 쓸 필요가 없다.",
    answer: false,
    explanation: "편리해질수록 해킹이나 개인정보 유출 같은 보안 문제에 더욱 주의를 기울여야 합니다."
  }
];