import { LogicRule, QuizQuestion, ComponentDetail } from './types';

export const GRID_SIZE = 5;

export const INITIAL_RULES: LogicRule[] = [
  { condition: 'dust', action: 'clean' },
  { condition: 'wall', action: 'turnRight' },
  { condition: 'empty', action: 'move' },
];

export const ROBOT_COMPONENTS: ComponentDetail[] = [
  {
    id: 'lidar',
    title: 'LiDAR 센서 (LiDAR Sensor)',
    description: '레이저를 쏘아 거리를 측정하여 주변 지도를 작성하고 장애물을 감지하는 로봇의 "눈"입니다.',
    iconName: 'Radar'
  },
  {
    id: 'wheel',
    title: '구동 모터 (Wheel Motor)',
    description: '전기 신호를 물리적인 움직임으로 변환하여 로봇을 이동시키는 "다리" 역할의 액추에이터입니다.',
    iconName: 'Settings'
  },
  {
    id: 'mcu',
    title: 'MCU / AI 칩셋',
    description: '센서 데이터를 분석(인식)하고 알고리즘에 따라 다음 행동을 결정(판단)하는 "두뇌"입니다.',
    iconName: 'Cpu'
  },
  {
    id: 'suction',
    title: '흡입 모터 (Suction)',
    description: '먼지를 빨아들이는 실제 청소 작업을 수행하는 장치입니다.',
    iconName: 'Fan'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "로봇 청소기가 구석에 갇혀서 계속 제자리를 맴돌고 있습니다. 이 상황을 해결하기 위해 필요한 지능 에이전트의 특성은?",
    options: ["반사성 (Reflex)", "자율성/학습 (Autonomy/Learning)", "수동성 (Passivity)", "단순성 (Simplicity)"],
    correctIndex: 1,
    explanation: "단순 반사 에이전트는 현재 상태만 보고 판단하므로 무한 루프에 빠질 수 있습니다. 과거의 경로를 기억하거나(상태 기반), 랜덤 행동으로 탈출을 시도하는 자율적 학습 능력이 필요합니다."
  },
  {
    id: 2,
    question: "다음 중 지능 에이전트의 [인식-판단-행동] 과정에 대한 설명으로 옳은 것은?",
    options: [
      "행동을 먼저 하고 결과를 인식한다.",
      "센서를 통해 환경을 인식하고, 규칙에 따라 판단 후, 구동기로 행동한다.",
      "판단 과정 없이 인식하자마자 무조건 행동한다.",
      "환경을 인식하지 않고 내부 시계에 따라 행동한다."
    ],
    correctIndex: 1,
    explanation: "지능 에이전트는 [Sensors -> Perception -> Reasoning -> Action -> Actuators]의 주기를 반복합니다."
  },
  {
    id: 3,
    question: "로봇이 '먼지'를 감지했을 때 '흡입'하는 것은 어떤 종류의 에이전트 행동인가요?",
    options: [
      "단순 반사 (Simple Reflex)",
      "목표 기반 (Goal-based)",
      "효용 기반 (Utility-based)",
      "학습 에이전트 (Learning Agent)"
    ],
    correctIndex: 0,
    explanation: "'IF 조건 THEN 행동'의 단순한 규칙(Condition-Action Rule)에 따라 즉각 반응하는 것은 단순 반사 에이전트의 특징입니다."
  }
];
