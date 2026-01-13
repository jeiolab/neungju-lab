import { Badge, QuizQuestion } from './types';

export const BADGES: Badge[] = [
  {
    id: 'sensor_master',
    name: '센서 마스터',
    description: '시뮬레이션 5회 완료',
    icon: '📡',
    earned: false,
  },
  {
    id: 'decision_up',
    name: '판단력 UP',
    description: '학습+추론 모드로 성공률 80% 달성',
    icon: '🧠',
    earned: false,
  },
  {
    id: 'quiz_whiz',
    name: '퀴즈 박사',
    description: '퀴즈 80점 이상 획득',
    icon: '🎓',
    earned: false,
  },
  {
    id: 'daily_scientist',
    name: '성실한 연구원',
    description: '3일 연속 접속',
    icon: '📅',
    earned: false,
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "지능 에이전트의 기본 3단계 사이클이 아닌 것은?",
    options: ["센서(인식)", "판단(처리)", "액추에이터(행동)", "전원(공급)"],
    correctAnswer: 3,
    explanation: "지능 에이전트는 환경을 인식(센서)하고, 판단(프로그램)하여, 환경에 영향을 미치는 행동(액추에이터)을 하는 시스템입니다.",
  },
  {
    id: 2,
    question: "학교 서빙 로봇에서 '액추에이터'에 해당하는 부품은?",
    options: ["카메라", "LiDAR 센서", "바퀴 모터", "배터리"],
    correctAnswer: 2,
    explanation: "액추에이터는 물리적인 움직임이나 조작을 수행하는 장치입니다. 바퀴 모터가 이에 해당합니다.",
  },
  {
    id: 3,
    question: "규칙 기반(Rule-based) 정책의 특징으로 가장 적절한 것은?",
    options: ["스스로 학습하여 규칙을 만든다.", "프로그래머가 미리 정한 'If-Then' 규칙을 따른다.", "데이터가 많을수록 성능이 계속 좋아진다.", "예측 불가능한 상황에 매우 강하다."],
    correctAnswer: 1,
    explanation: "규칙 기반 시스템은 사람이 미리 정의한 규칙대로만 행동합니다.",
  },
  {
    id: 4,
    question: "센서 품질이 낮을 때, '학습+추론' 에이전트가 유리한 이유는?",
    options: ["센서를 물리적으로 고쳐주기 때문", "불확실한 정보를 추론으로 보정하고 대체 전략을 세우기 때문", "무조건 멈춰서 기다리기 때문", "센서를 사용하지 않기 때문"],
    correctAnswer: 1,
    explanation: "지능형 에이전트는 불완전한 정보를 확률적 추론이나 과거 경험(학습)으로 보완할 수 있습니다.",
  },
  {
    id: 5,
    question: "에이전트 함수(Agent Function)란 무엇인가?",
    options: ["로봇의 가격을 결정하는 함수", "입력(인지)을 출력(행동)으로 매핑하는 수학적/논리적 규칙", "배터리 소모량을 계산하는 함수", "센서의 종류를 나열한 목록"],
    correctAnswer: 1,
    explanation: "에이전트 함수는 인지된 정보(Percept sequence)를 바탕으로 어떤 행동(Action)을 할지 결정하는 매핑 규칙입니다.",
  },
  {
    id: 6,
    question: "다음 중 '환경(Environment)'에 해당하지 않는 것은?",
    options: ["학교 복도", "급식실", "로봇의 내부 CPU", "운동장"],
    correctAnswer: 2,
    explanation: "로봇의 내부 CPU는 에이전트 자체의 구성 요소이며, 나머지 장소들이 에이전트가 상호작용하는 환경입니다.",
  },
  {
    id: 7,
    question: "로봇청소기가 벽에 부딪혔을 때(센서 감지), 방향을 180도 바꾼다(행동). 이 과정은?",
    options: ["반사적 행동(Reflex)", "장기 계획(Planning)", "강화 학습(Reinforcement Learning)", "자연어 처리(NLP)"],
    correctAnswer: 0,
    explanation: "현재의 인식(충돌)에 대해 즉각적으로 반응하는 것은 단순 반사(Reflex) 행동에 가깝습니다.",
  },
  {
    id: 8,
    question: "센서 데이터에 노이즈(잡음)가 많다는 것은 무엇을 의미하는가?",
    options: ["데이터가 아주 깨끗하다", "센서가 정보를 정확하게 전달하지 못하고 오류가 섞여있다", "센서가 너무 비싸다", "로봇의 속도가 너무 빠르다"],
    correctAnswer: 1,
    explanation: "노이즈가 많다는 것은 실제 환경 정보와 센서가 전달한 정보 사이에 오차가 크다는 것을 의미합니다.",
  },
  {
    id: 9,
    question: "우리 학교 안전 로봇이 '뛰는 학생'을 발견하고 '감속 요청' 방송을 했다. 이때 '뛰는 학생'은?",
    options: ["판단", "행동", "입력(인식된 정보)", "액추에이터"],
    correctAnswer: 2,
    explanation: "뛰는 학생은 로봇이 센서를 통해 인식한 입력(Percept)입니다.",
  },
  {
    id: 10,
    question: "시뮬레이션 결과, 복잡한 환경에서 가장 성공률이 높을 것으로 기대되는 조합은?",
    options: ["저품질 센서 + 규칙 기반", "저품질 센서 + 학습 기반", "고품질 센서 + 규칙 기반", "고품질 센서 + 학습/추론 기반"],
    correctAnswer: 3,
    explanation: "정확한 정보(고품질 센서)와 유연한 사고(학습/추론)가 결합될 때 가장 높은 성능을 기대할 수 있습니다.",
  },
];

export const SCHOOL_SCENARIOS = [
  { id: 'lunch', label: '급식실 (혼잡함)', description: '학생들이 급식을 받기 위해 줄을 서고 이동하는 복잡한 상황' },
  { id: 'hallway', label: '복도 안전 (쉬는 시간)', description: '학생들이 뛰어다니거나 사물함 문이 열려있는 상황' },
  { id: 'recycle', label: '분리수거장', description: '플라스틱, 캔, 일반 쓰레기가 섞여 있는 상황' },
];