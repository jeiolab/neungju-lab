import { Capability, QuizQuestion, TheoryCard } from './types';

export const INITIAL_CAPABILITIES: Capability[] = [
  { id: 'c1', name: '의사소통 능력', category: 'general', selected: false },
  { id: 'c2', name: '문제해결 능력', category: 'general', selected: false },
  { id: 'c3', name: '자기관리 능력', category: 'general', selected: false },
  { id: 'c4', name: '협업 능력', category: 'general', selected: false },
  { id: 'c5', name: '디지털 리터러시', category: 'general', selected: false },
  { id: 'c6', name: '프로그래밍/코딩', category: 'specialized', selected: false },
  { id: 'c7', name: '데이터 분석', category: 'specialized', selected: false },
  { id: 'c8', name: '디자인 감각', category: 'specialized', selected: false },
  { id: 'c9', name: '외국어 구사', category: 'specialized', selected: false },
  { id: 'c10', name: '기계 조작', category: 'specialized', selected: false },
];

export const THEORY_CARDS: TheoryCard[] = [
  { title: "진로 설계란?", content: "나의 특성을 이해하고 직업 세계를 탐색하여 합리적인 진로 목표를 설정하는 과정입니다.", icon: "🧭" },
  { title: "왜 예측이 필요한가?", content: "디지털 사회는 급변합니다. 미래 직업 세계의 변화를 예측해야 지속 가능한 로드맵을 짤 수 있습니다.", icon: "🔮" },
  { title: "디지털 역량의 중요성", content: "모든 직업에서 디지털 도구 활용 능력은 이제 선택이 아닌 필수입니다.", icon: "💻" },
  { title: "창직(Job Creation)", content: "없는 직업을 만들어내는 능력. 자신의 강점과 기술을 결합하여 새로운 가치를 창출합니다.", icon: "✨" },
  { title: "평생 학습", content: "기술 수명이 짧아지면서 끊임없이 배우고 적응하는 자세가 필요합니다.", icon: "📚" },
  { title: "네트워킹", content: "사람과의 연결을 통해 정보를 얻고 기회를 확장하는 활동입니다.", icon: "🤝" },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "진로 설계의 첫 단계로 가장 적절한 것은?",
    options: ["실행 계획 수립", "자기 이해 및 탐색", "직업 정보 수집", "최종 결정"],
    correctAnswer: 1,
    explanation: "진로 설계는 나 자신을 아는 것(자기 이해)에서 시작합니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "디지털 사회의 직업 변화 특징이 아닌 것은?",
    options: ["평생 직장의 개념 강화", "원격 근무 확산", "AI와의 협업 증가", "새로운 직업의 등장"],
    correctAnswer: 0,
    explanation: "디지털 사회에서는 평생 직장보다 평생 직업/학습의 개념이 중요해집니다.",
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "다음 중 '창직'에 대한 설명으로 옳은 것은?",
    options: ["기존 직업을 그대로 유지하는 것", "자신의 능력으로 새로운 직무/직업을 만드는 것", "대기업에 취업하는 것", "자격증을 많이 따는 것"],
    correctAnswer: 1,
    explanation: "창직은 자신의 적성과 능력, 사회적 변화를 결합해 새로운 일자리를 만드는 활동입니다.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "SMART 목표 설정 기법에서 'M'이 의미하는 것은?",
    options: ["Measurable (측정 가능한)", "Many (많은)", "Money (돈)", "Major (주요한)"],
    correctAnswer: 0,
    explanation: "목표는 측정 가능해야(Measurable) 달성 여부를 확인할 수 있습니다.",
    difficulty: 'hard'
  }
];

export const RESOURCE_LINKS = [
  { name: '커리어넷', desc: '교육부 진로정보망', url: 'https://www.career.go.kr' },
  { name: '워크넷', desc: '고용노동부 취업포털', url: 'https://www.work.go.kr' },
  { name: 'Q-Net', desc: '국가자격시험 포털', url: 'https://www.q-net.or.kr' },
];
