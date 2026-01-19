import { QuizQuestion, Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'heavy_rain',
    name: '폭우가 쏟아지는 퇴근길',
    description: '시야가 제한되고 노면이 미끄럽습니다. 주변 차량들도 서행 중입니다.',
    icon: 'CloudRain'
  },
  {
    id: 'school_zone',
    name: '오후 2시 스쿨존',
    description: '어린이 보호구역입니다. 언제 어디서 아이들이 튀어나올지 모릅니다.',
    icon: 'School'
  },
  {
    id: 'empty_highway',
    name: '새벽의 텅 빈 고속도로',
    description: '차량이 거의 없고 직선 도로가 이어집니다. 목적지까지 급한 상황입니다.',
    icon: 'Zap'
  },
  {
    id: 'complex_intersection',
    name: '신호등 고장 교차로',
    description: '퇴근 시간, 교차로의 신호등이 고장 났습니다. 눈치 싸움이 치열합니다.',
    icon: 'MoveArrows'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "갑자기 도로로 뛰어든 야생동물을 발견했습니다. 이때 가장 우선시되어야 할 특성은?",
    options: ["목표지향성 (목적지 도달)", "사회성 (주변 차와 통신)", "반응성 (즉각적인 감지 및 대응)", "자율성 (스스로 경로 수정)"],
    correctAnswer: 2,
    explanation: "**반응성(Reactivity)**은 환경의 변화를 즉각적으로 감지하고 적시에 대응하는 능력으로, 돌발 상황에서 가장 중요합니다."
  },
  {
    id: 2,
    question: "교차로에 진입하려는데 구급차가 사이렌을 울리며 다가옵니다. 필요한 특성은?",
    options: ["자율성", "사회성", "효율성", "지속성"],
    correctAnswer: 1,
    explanation: "**사회성(Social Ability)**은 다른 에이전트(구급차, 타 차량)와 상호작용하고 협력하는 능력입니다. 양보 운전은 사회성의 발현입니다."
  },
  {
    id: 3,
    question: "네비게이션 상 더 빠른 길이 생겼습니다. 스스로 경로를 변경하는 것은 어떤 특성인가요?",
    options: ["자율성", "반응성", "안전성", "윤리성"],
    correctAnswer: 0,
    explanation: "**자율성(Autonomy)**은 외부의 직접적인 개입 없이 스스로 상태를 제어하고 결정을 내리는 성질입니다."
  }
];

export const LEVELS_INFO = [
  { level: 0, title: "No Automation", desc: "운전자가 모든 것을 제어함 (비자동)" },
  { level: 1, title: "Driver Assistance", desc: "크루즈 컨트롤 등 단일 기능 보조" },
  { level: 2, title: "Partial Automation", desc: "조향과 가속을 시스템이 보조하지만 운전자 주시 필수" },
  { level: 3, title: "Conditional Automation", desc: "특정 조건에서 시스템이 운전, 위급 시 운전자 개입" },
  { level: 4, title: "High Automation", desc: "정해진 구역에서 완전 자율 주행" },
  { level: 5, title: "Full Automation", desc: "모든 상황에서 운전자 없이 주행 가능" },
];
