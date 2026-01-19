import { Badge, QuizQuestion, TheoryCard } from "./types";

export const THEORY_CARDS: TheoryCard[] = [
  {
    id: "sensor",
    title: "센서 (인식, Perception)",
    icon: "Eye",
    definition: "환경의 변화나 이벤트를 감지하여 에이전트에게 정보를 전달하는 장치입니다.",
    keywords: ["데이터 수집", "입력(Input)", "모니터링"],
    example: "pH 센서가 강물의 산성도를 감지합니다.",
    misconception: "센서는 스스로 결정을 내리지 않습니다. 단지 원시 데이터(Raw Data)를 수집할 뿐입니다.",
  },
  {
    id: "function",
    title: "에이전트 함수 (분석/추론)",
    icon: "Brain",
    definition: "인식된 정보(입력)를 행동(출력)으로 매핑하는 내부 논리 또는 알고리즘입니다.",
    keywords: ["알고리즘", "임계값(Threshold)", "의사결정"],
    example: "만약 탁도가 50 NTU를 초과하면, '오염됨' 신호를 보낸다.",
    misconception: "에이전트 함수는 마법이 아닙니다. 프로그래밍된 규칙이나 학습된 패턴을 따릅니다.",
  },
  {
    id: "actuator",
    title: "액추에이터 (행동, Action)",
    icon: "Zap",
    definition: "에이전트가 환경에 영향을 미치거나 변경할 수 있게 해주는 구동 장치입니다.",
    keywords: ["출력(Output)", "모터", "경보 시스템"],
    example: "자동 밸브가 잠겨 물의 흐름을 차단합니다.",
    misconception: "화면(디스플레이)도 정보를 표시하여 환경(사용자의 인식)을 변화시키므로 액추에이터에 포함됩니다.",
  },
  {
    id: "characteristics",
    title: "에이전트의 특성",
    icon: "Activity",
    definition: "지능형 에이전트를 정의하는 핵심 특성: 자율성, 반응성, 능동성, 사회성.",
    keywords: ["자율성", "목표 지향성", "적응성"],
    example: "사람의 조종 없이 호수를 청소하는 자율 주행 드론.",
    misconception: "단순히 '자동화'되었다고 해서 모두 '지능형'이거나 '자율적'인 것은 아닙니다.",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "지능형 에이전트에서 '센서'의 주된 역할은 무엇입니까?",
    options: [
      "물리적인 행동을 수행한다.",
      "환경을 인식하고 데이터를 수집한다.",
      "복잡한 의사결정을 내린다.",
      "전기를 저장한다.",
    ],
    correctAnswer: 1,
    explanation: "센서는 온도나 pH 같은 데이터를 수집하는 '인식(Perception)' 단계에 해당합니다.",
  },
  {
    id: 2,
    question: "에이전트가 내린 결정을 실제로 실행하는 구성 요소는 무엇입니까?",
    options: ["센서", "프로세서", "액추에이터", "데이터베이스"],
    correctAnswer: 2,
    explanation: "액추에이터는 밸브를 닫거나 경보를 울리는 등 행동을 수행하는 에이전트의 '근육'과 같습니다.",
  },
  {
    id: 3,
    question: "에이전트가 계절 변화에 따라 스스로 임계값을 조정한다면, 어떤 특성에 해당합니까?",
    options: ["경직성", "적응성/학습", "사회성", "이동성"],
    correctAnswer: 1,
    explanation: "적응성은 새로운 경험이나 변화하는 환경에 맞춰 행동을 수정하는 능력을 의미합니다.",
  },
  {
    id: 4,
    question: "'감지-생각-행동(Sense-Think-Act)' 주기에서 '생각(Think)' 단계에 일어나는 일은?",
    options: [
      "물의 탁도 측정하기",
      "배수구 열기",
      "데이터를 분석하고 최선의 행동 선택하기",
      "배터리 충전하기",
    ],
    correctAnswer: 2,
    explanation: "'생각' 단계는 수집된 데이터를 분석하고 추론하여 어떤 행동을 할지 결정하는 과정입니다.",
  },
  {
    id: 5,
    question: "단순 온도 조절기(Thermostat)는 어떤 종류의 에이전트입니까?",
    options: [
      "학습 에이전트",
      "단순 반사 에이전트",
      "사회적 에이전트",
      "멀티 에이전트 시스템",
    ],
    correctAnswer: 1,
    explanation: "현재의 온도(인식)에 반응하여 정해진 규칙(조건-행동 규칙)대로만 작동하므로 단순 반사 에이전트입니다.",
  },
  {
    id: 6,
    question: "수질 경보 시스템에서 '오탐(False Positive)'이란 무엇입니까?",
    options: [
      "물은 깨끗한데 경보가 울리는 경우",
      "물이 오염되었고 경보가 울리는 경우",
      "물이 오염되었는데 경보가 울리지 않는 경우",
      "경보기가 고장 난 경우",
    ],
    correctAnswer: 0,
    explanation: "오탐(제1종 오류)은 문제가 없는데 시스템이 문제가 있다고 잘못 판단하는 경우입니다.",
  },
  {
    id: 7,
    question: "다음 중 전형적인 수질 센서가 아닌 것은?",
    options: ["pH 센서", "탁도 센서", "용존 산소 센서", "스피커"],
    correctAnswer: 3,
    explanation: "스피커는 소리를 내는 액추에이터(출력 장치)이며, 센서가 아닙니다.",
  },
  {
    id: 8,
    question: "에이전트의 '자율성(Autonomy)'이란 무슨 뜻입니까?",
    options: [
      "인간의 지속적인 통제가 필요하다.",
      "직접적인 인간의 개입 없이 작동한다.",
      "가격이 매우 비싸다.",
      "인터넷 연결이 필수적이다.",
    ],
    correctAnswer: 1,
    explanation: "자율성은 목표를 달성하기 위해 스스로 판단하고 작동하는 능력을 의미합니다.",
  },
  {
    id: 9,
    question: "여러 에이전트가 협력하여 호수를 정화한다면, 이것은 어떤 특성입니까?",
    options: ["사회성", "이기심", "고립성", "무작위성"],
    correctAnswer: 0,
    explanation: "사회성은 다른 에이전트나 인간과 상호작용하고, 협력하거나 협상하는 능력입니다.",
  },
  {
    id: 10,
    question: "적절한 '임계값(Threshold)' 설정이 중요한 이유는 무엇입니까?",
    options: [
      "센서를 멋지게 보이게 하려고",
      "안전 확보와 오탐 방지 사이의 균형을 위해",
      "전력 소모를 줄이기 위해",
      "법적으로 요구되기 때문에",
    ],
    correctAnswer: 1,
    explanation: "임계값이 너무 낮으면 오탐이 잦고, 너무 높으면 위험한 오염을 놓칠 수(미탐) 있기 때문입니다.",
  },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: '초보 설계자', description: '첫 번째 설계 초안을 시작했습니다.', icon: 'Pencil', unlocked: false },
  { id: 'b2', name: '시뮬레이션 마스터', description: '시뮬레이션을 5회 실행했습니다.', icon: 'Play', unlocked: false },
  { id: 'b3', name: '공인 엔지니어', description: '에이전트 설계 위저드를 완료했습니다.', icon: 'Award', unlocked: false },
  { id: 'b4', name: '최우수 학생', description: '퀴즈에서 8점 이상을 받았습니다.', icon: 'Star', unlocked: false },
  { id: 'b5', name: '비판적 사고가', description: '성찰(Reflection) 활동을 완료했습니다.', icon: 'BrainCircuit', unlocked: false },
];