import { QuizQuestion } from './types';

export const THEORY_CARDS = [
  {
    title: "구역 분할 (Zoning)",
    content: "넓은 산을 작은 격자(Grid)나 구역으로 나누어 관리하는 것입니다. 모든 곳을 다 감시할 수 없을 때, 위험도가 높은 구역을 우선순위로 두는 전략이 필요합니다.",
    icon: "Grid"
  },
  {
    title: "센서 커버리지 (Coverage)",
    content: "하나의 센서가 감지할 수 있는 유효 범위를 뜻합니다. 센서를 너무 듬성듬성 배치하면 '미탐(Miss)'이 발생하고, 너무 촘촘하면 예산이 낭비됩니다.",
    icon: "Radio"
  },
  {
    title: "오탐과 미탐 (False Errors)",
    content: "오탐(False Positive)은 불이 안 났는데 경보가 울리는 것(양치기 소년), 미탐(False Negative)은 실제 불을 놓치는 것입니다. 센서 민감도를 조절하여 균형을 잡아야 합니다.",
    icon: "AlertTriangle"
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "넓은 지역의 산불을 감지하기 위해 산을 여러 개의 작은 단위로 나누는 개념은?",
    options: ["구역 분할(Zoning)", "데이터 압축", "클라우드 컴퓨팅", "전력 최적화"],
    correctIndex: 0,
    explanation: "구역 분할을 통해 관리 범위를 좁히고 센서 위치를 특정할 수 있습니다.",
    category: "기초"
  },
  {
    id: 2,
    question: "센서의 민감도(Sensitivity)를 너무 높게 설정했을 때 발생할 수 있는 문제는?",
    options: ["배터리 수명 증가", "오탐(False Positive) 증가", "미탐(False Negative) 증가", "데이터 전송 속도 저하"],
    correctIndex: 1,
    explanation: "민감도가 너무 높으면 햇빛이나 작은 열기에도 경보가 울리는 오탐이 잦아집니다.",
    category: "심화"
  },
  {
    id: 3,
    question: "다음 중 산불 감지 센서가 수집하기에 가장 적합한 데이터가 아닌 것은?",
    options: ["온도", "습도", "CO2 농도", "토양의 색깔"],
    correctIndex: 3,
    explanation: "토양의 색깔은 산불 조기 감지보다는 사후 분석이나 농업에 더 적합합니다. 온도, 습도, 연기(가스)가 주된 지표입니다.",
    category: "센서"
  },
  {
    id: 4,
    question: "IoT 시스템에서 센서가 감지한 데이터를 서버로 보내는 역할을 하는 장치는?",
    options: ["액추에이터", "게이트웨이", "배터리", "디스플레이"],
    correctIndex: 1,
    explanation: "게이트웨이는 여러 센서의 데이터를 수집하여 인터넷을 통해 서버로 전송하는 중계 역할을 합니다.",
    category: "네트워크"
  },
  {
    id: 5,
    question: "산불 조기 감지 시스템의 예산 제약 상황에서 가장 합리적인 센서 배치 전략은?",
    options: ["모든 곳에 배치한다", "사람이 다니지 않는 곳만 배치한다", "과거 산불 발생 빈도가 높거나 위험한 구역(바람길 등)에 집중 배치한다", "물가 주변에 집중 배치한다"],
    correctIndex: 2,
    explanation: "데이터 기반 의사결정을 통해 위험도가 높은 곳에 자원을 집중하는 것이 효율적입니다.",
    category: "전략"
  },
  {
    id: 6,
    question: "센서 노드가 고장 났을 때를 대비해 중요한 구역에 센서를 2개 이상 두는 설계 방식은?",
    options: ["이중화(Redundancy)", "단편화", "가상화", "캡슐화"],
    correctIndex: 0,
    explanation: "이중화는 시스템의 신뢰성을 높이기 위해 핵심 부품을 여분으로 두는 설계 방식입니다.",
    category: "설계"
  },
  {
    id: 7,
    question: "산불 감지 데이터를 실시간으로 분석하여 경보를 울리는 과정을 무엇이라 하는가?",
    options: ["데이터 마이닝", "모니터링 및 이벤트 처리", "데이터베이스 백업", "펌웨어 업데이트"],
    correctIndex: 1,
    explanation: "센서 값을 지속적으로 감시(모니터링)하고 특정 조건 시 알림을 보내는 것을 이벤트 처리라고 합니다.",
    category: "운영"
  },
  {
    id: 8,
    question: "태양광 패널을 이용해 산불 감지 센서에 전력을 공급하려 한다. 이때 고려해야 할 점은?",
    options: ["밤이나 흐린 날의 전력 확보(배터리 저장)", "인터넷 속도", "센서의 크기", "서버의 용량"],
    correctIndex: 0,
    explanation: "태양광은 낮에만 발전되므로, 에너지를 저장할 배터리(ESS) 설계가 필수적입니다.",
    category: "전력"
  },
  {
    id: 9,
    question: "다음 중 오탐(False Positive)의 예시는?",
    options: ["실제 산불이 났는데 경보가 안 울림", "산불이 아닌데 뜨거운 햇빛 때문에 경보가 울림", "센서가 고장 나서 작동 안 함", "배터리가 방전됨"],
    correctIndex: 1,
    explanation: "양치기 소년처럼, 실제 사건(Positive)이 아닌데 맞다고(Positive) 잘못 판단(False)하는 경우입니다.",
    category: "데이터"
  },
  {
    id: 10,
    question: "학교 뒷산에 산불 감지 시스템을 설계할 때, 가장 먼저 해야 할 일은?",
    options: ["비싼 센서 구매", "코딩부터 시작", "현장 조사 및 위험 구역 파악", "경보음 소리 고르기"],
    correctIndex: 2,
    explanation: "시스템 설계의 첫 단계는 문제 정의와 환경 분석(요구사항 분석)입니다.",
    category: "설계"
  }
];
