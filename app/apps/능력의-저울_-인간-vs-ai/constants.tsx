import React from 'react';
import { Brain, Calculator, Heart, Repeat, Sparkles, Zap, Users, ShieldAlert } from 'lucide-react';
import { Classification, TaskCard, QuizQuestion, TheoryCard } from './types';

// Tab 1: Theory Data
export const THEORY_CARDS: TheoryCard[] = [
  {
    title: "데이터 처리 (Data Processing)",
    humanSide: "직관적 판단, 소량의 질적 데이터 분석에 유리",
    aiSide: "대규모 데이터의 고속 연산 및 패턴 인식 (압도적 우위)",
    icon: <Calculator className="w-8 h-8 text-blue-400" />
  },
  {
    title: "창의성 (Creativity)",
    humanSide: "무에서 유를 창조, 예술적 영감, 비유와 은유",
    aiSide: "기존 데이터 기반의 조합 및 변형 (생성형 AI)",
    icon: <Sparkles className="w-8 h-8 text-yellow-400" />
  },
  {
    title: "감정 및 공감 (Empathy)",
    humanSide: "진정한 감정 교류, 도덕적 책임, 상황 맥락 파악",
    aiSide: "감정 데이터 분석 및 흉내 (Affective Computing), 실제 감정 없음",
    icon: <Heart className="w-8 h-8 text-red-400" />
  },
  {
    title: "반복 업무 (Repetition)",
    humanSide: "쉽게 피로감을 느낌, 실수 발생 가능성 높음",
    aiSide: "24시간 무중단 수행, 일정한 품질 유지",
    icon: <Repeat className="w-8 h-8 text-green-400" />
  }
];

// Tab 2: Game Data
export const GAME_TASKS: TaskCard[] = [
  { id: '1', title: '복잡한 감성 이해', category: Classification.HUMAN, icon: '❤️', description: '미묘한 감정선 읽기' },
  { id: '2', title: '대량 데이터 기억', category: Classification.AI, icon: '💾', description: '빅데이터 저장' },
  { id: '3', title: '직관적 상황 파악', category: Classification.HUMAN, icon: '💡', description: '눈치와 센스' },
  { id: '4', title: '단순 반복 연산', category: Classification.AI, icon: '🔢', description: '지루한 계산 반복' },
  { id: '5', title: '창의적 아이디어', category: Classification.HUMAN, icon: '🎨', description: '새로운 개념 창출' },
  { id: '6', title: '패턴 인식/분류', category: Classification.AI, icon: '🔍', description: '이미지/소리 분류' },
  { id: '7', title: '도덕적 의사결정', category: Classification.HUMAN, icon: '⚖️', description: '윤리적 딜레마' },
  { id: '8', title: '초정밀 조립', category: Classification.COLLAB, icon: '🤝', description: '로봇의 정밀함+인간의 감독' },
  { id: '9', title: '자율 주행 판단', category: Classification.AI, icon: '🚗', description: '실시간 센서 데이터 처리' },
  { id: '10', title: '심리 상담', category: Classification.COLLAB, icon: '🧠', description: 'AI분석 보조 + 인간 상담사' },
  { id: '11', title: '법률 판례 검색', category: Classification.AI, icon: '📚', description: '방대한 문서 탐색' },
  { id: '12', title: '예술 작품 창작', category: Classification.HUMAN, icon: '🎭', description: '영혼이 담긴 표현' },
];

// Tab 4: Quiz Data
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '약인공지능(Weak AI)'의 특징으로 가장 적절한 것은?",
    options: ["자아를 가지고 스스로 생각한다.", "특정 분야에서 주어진 목표만 수행한다.", "인간처럼 모든 상황에 적응한다.", "감정을 느끼고 표현할 수 있다."],
    correctAnswer: 1,
    explanation: "약인공지능은 알파고나 청소로봇처럼 특정 문제 해결에 특화된 AI입니다.",
    relatedConcept: "AI의 종류(약인공지능)"
  },
  {
    id: 2,
    question: "자율주행 자동차가 사고 직전 핸들을 어디로 꺾을지 결정하는 '윤리적 딜레마' 상황에서, 최종 책임과 윤리적 기준 설정의 주체는 누구여야 하는가?",
    options: ["AI 알고리즘", "자동차 제조사 AI", "인간 (사회적 합의)", "무작위"],
    correctAnswer: 2,
    explanation: "AI는 윤리적 판단을 내릴 수 없습니다. 기준은 인간이 정해야 합니다.",
    relatedConcept: "AI 윤리"
  },
  {
    id: 3,
    question: "다음 업무 중 AI보다 인간이 수행했을 때 더 비교우위에 있는 것은?",
    options: ["10만 개의 숫자 정렬", "CCTV 영상에서 범죄자 찾기", "직원의 고민을 듣고 공감하며 격려하기", "반도체 회로의 불량 검출"],
    correctAnswer: 2,
    explanation: "공감과 정서적 지지는 인간 고유의 영역에 가깝습니다.",
    relatedConcept: "인간 고유 역량"
  },
  {
    id: 4,
    question: "강인공지능(Strong AI)에 대한 설명으로 틀린 것은?",
    options: ["인간과 같은 지성을 가진다.", "자아를 가질 가능성이 논의된다.", "현재 우리 주변에서 흔히 볼 수 있다.", "범용적인 문제 해결 능력을 가진다."],
    correctAnswer: 2,
    explanation: "강인공지능은 아직 실현되지 않았으며, 현재의 AI는 모두 약인공지능입니다.",
    relatedConcept: "AI의 종류(강인공지능)"
  },
  {
    id: 5,
    question: "알파고(AlphaGo)가 바둑을 두는 방식은?",
    options: ["직관과 영감으로 둔다.", "상대방의 표정을 읽는다.", "방대한 기보 데이터를 학습하여 확률을 계산한다.", "바둑의 예술성을 이해한다."],
    correctAnswer: 2,
    explanation: "알파고는 데이터 기반의 확률 계산과 패턴 인식을 통해 작동합니다.",
    relatedConcept: "AI 작동 원리"
  },
  {
    id: 6,
    question: "AI가 인간의 감정을 인식하고 반응하는 기술 분야를 무엇이라 하는가?",
    options: ["클라우드 컴퓨팅", "감성 컴퓨팅(Affective Computing)", "블록체인", "양자 역학"],
    correctAnswer: 1,
    explanation: "감성 컴퓨팅은 컴퓨터가 인간의 감정을 인지하고 해석하는 기술입니다.",
    relatedConcept: "감성 컴퓨팅"
  },
  {
    id: 7,
    question: "다음 중 인간과 AI의 '협업'이 가장 효율적인 사례는?",
    options: ["단순 반복 엑셀 작업", "전적으로 AI에게 맡긴 시 수필 창작", "AI가 진단 보조를 하고 의사가 최종 판단하는 암 치료", "인간이 직접 계산기로 우주선 궤도 계산"],
    correctAnswer: 2,
    explanation: "AI의 분석력과 인간의 종합적 판단력이 결합될 때 최고의 시너지를 냅니다.",
    relatedConcept: "인간-AI 협업"
  },
  {
    id: 8,
    question: "AI에게 '사과는 맛있다'라는 데이터를 입력했을 때, AI의 상태는?",
    options: ["사과의 맛을 상상하며 군침을 흘린다.", "맛있다는 개념을 데이터 텍스트로 저장한다.", "사과를 먹어보고 싶어한다.", "행복감을 느낀다."],
    correctAnswer: 1,
    explanation: "AI는 '맛있다'는 텍스트나 속성을 데이터로 처리할 뿐, 미각적 쾌감을 느끼지 못합니다.",
    relatedConcept: "AI의 한계"
  },
  {
    id: 9,
    question: "미래 직업 사회에서 요구되는 인간의 핵심 역량이 아닌 것은?",
    options: ["단순 암기 및 계산 능력", "협업 및 소통 능력", "창의적 문제 해결력", "디지털 리터러시"],
    correctAnswer: 0,
    explanation: "단순 암기 및 계산은 AI가 대체하기 가장 쉬운 영역입니다.",
    relatedConcept: "미래 역량"
  },
  {
    id: 10,
    question: "딥러닝(Deep Learning)의 핵심 학습 방식은?",
    options: ["인간이 모든 규칙을 하나하나 코딩한다.", "인공 신경망을 통해 데이터에서 특징을 스스로 학습한다.", "교과서를 스캔해서 외운다.", "무작위로 찍어서 맞춘다."],
    correctAnswer: 1,
    explanation: "딥러닝은 인간의 뇌 신경망을 모방하여 데이터 속 패턴을 스스로 학습합니다.",
    relatedConcept: "AI 작동 원리"
  }
];