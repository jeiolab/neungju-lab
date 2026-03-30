import { Scenario, DataCategory, ProtectionMeasure, QuizQuestion, Badge } from './types';
import { BookOpen, Shield, BarChart3, Brain, Share2, Award } from 'lucide-react';

export const SCENARIOS: Scenario[] = [
  {
    id: 'career',
    title: '진로 추천 앱',
    description: '나의 활동 기록을 분석해 딱 맞는 학과와 직업을 추천해줍니다.',
    icon: '🎓',
    basePublicGood: 30,
  },
  {
    id: 'health',
    title: '청소년 건강 관리 앱',
    description: '운동량과 식단을 분석해 맞춤형 건강 가이드를 제공합니다.',
    icon: '💪',
    basePublicGood: 60, // Contributes to public health data
  },
  {
    id: 'traffic',
    title: '등하교 교통 최적화',
    description: '위치 정보를 기반으로 가장 빠른 등하교 경로와 버스 정보를 줍니다.',
    icon: '🚌',
    basePublicGood: 80, // Helps traffic flow
  },
];

export const DATA_CATEGORIES: DataCategory[] = [
  { id: 'finance', label: '금융 (용돈/계좌)', riskFactor: 25, convenienceFactor: 20, publicGoodFactor: 5 },
  { id: 'consumption', label: '소비 (편의점/카페)', riskFactor: 15, convenienceFactor: 15, publicGoodFactor: 10 },
  { id: 'location', label: '위치 (GPS 이동경로)', riskFactor: 30, convenienceFactor: 25, publicGoodFactor: 25 },
  { id: 'health', label: '건강 (수면/운동)', riskFactor: 20, convenienceFactor: 20, publicGoodFactor: 20 },
  { id: 'school', label: '학교생활 (성적/동아리)', riskFactor: 20, convenienceFactor: 25, publicGoodFactor: 15 },
];

export const PROTECTION_MEASURES: ProtectionMeasure[] = [
  { id: 'pseudonym', label: '가명처리 (누군지 모르게 변경)', riskReduction: 30, convenienceCost: 5 },
  { id: 'min_collection', label: '최소 수집 원칙 준수', riskReduction: 20, convenienceCost: 10 },
  { id: 'short_retention', label: '보유 기간 단축 (1개월 후 삭제)', riskReduction: 15, convenienceCost: 5 },
  { id: '2fa', label: '2단계 인증 설정', riskReduction: 25, convenienceCost: 15 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '마이데이터(MyData)의 핵심 개념으로 가장 적절한 것은?',
    options: [
      '기업이 데이터를 독점하여 수익을 창출하는 것',
      '정보주체인 개인이 자신의 정보를 능동적으로 관리하고 통제하는 것',
      '정부가 모든 개인정보를 수집하여 관리하는 것',
      '데이터를 삭제하여 아무도 쓰지 못하게 하는 것'
    ],
    correctAnswer: 1,
    explanation: '마이데이터는 개인이 데이터의 주권을 갖고, 원하는 곳에 자신의 정보를 제공하여 혜택을 누리는 과정입니다.',
    relatedConcept: '마이데이터 정의'
  },
  {
    id: 2,
    question: '다음 중 개인정보를 안전하게 활용하기 위해 식별 가능성을 낮추는 조치는?',
    options: ['데이터 결합', '가명처리', '데이터 마이닝', '실명인증'],
    correctAnswer: 1,
    explanation: '가명처리는 개인 식별 정보를 삭제하거나 대체하여, 추가 정보 없이는 특정 개인을 알아볼 수 없게 하는 조치입니다.',
    relatedConcept: '가명/익명정보'
  },
  {
    id: 3,
    question: '개인정보 보호 원칙 중 "서비스에 꼭 필요한 정보만 수집해야 한다"는 원칙은?',
    options: ['목적 명확성의 원칙', '최소 수집의 원칙', '안전성 확보의 원칙', '공개 투명성의 원칙'],
    correctAnswer: 1,
    explanation: '최소 수집의 원칙은 서비스 제공에 필수적인 정보 외의 불필요한 수집을 제한하여 위험을 줄이는 원칙입니다.',
    relatedConcept: '최소 수집'
  },
  // ... more questions can be added here
];

export const THEORY_CARDS = [
  {
    title: '마이데이터란?',
    content: '내 데이터의 주인은 나! 흩어진 내 정보를 한곳에 모아 관리하고, 내가 원하는 서비스(앱)에 제공해 맞춤형 혜택을 받는 제도입니다.',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    title: '가명정보 vs 익명정보',
    content: '가명정보는 "열쇠(추가정보)"가 있으면 누구인지 알 수 있지만, 익명정보는 열쇠가 있어도 절대로 누구인지 알 수 없게 처리한 정보입니다.',
    icon: Shield,
    color: 'bg-green-100 text-green-700'
  },
  {
    title: '트레이드오프 (Trade-off)',
    content: '정보를 많이 공유하면 서비스는 편리해지지만(편의성↑), 유출 위험은 커집니다(위험↑). 이 둘 사이의 균형을 잡는 것이 중요합니다.',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-700'
  }
];

export const BADGES: Badge[] = [
  { id: 'beginner', name: '데이터 입문자', description: '첫 시뮬레이션을 완료했습니다.', icon: '🌱', unlocked: false },
  { id: 'balance_king', name: '균형왕', description: '편의와 보호의 완벽한 균형을 찾았습니다.', icon: '⚖️', unlocked: false },
  { id: 'scholar', name: '보안 척척박사', description: '퀴즈에서 100점을 받았습니다.', icon: '🎓', unlocked: false },
  { id: 'protector', name: '철벽 방어', description: '보호 조치를 모두 선택해 위험을 최소화했습니다.', icon: '🛡️', unlocked: false },
];