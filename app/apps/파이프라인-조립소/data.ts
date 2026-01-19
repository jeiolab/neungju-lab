import { StageCard, QuizQuestion, PuzzleItem, PuzzleDifficulty } from './types';

export const THEORY_STAGES: StageCard[] = [
  {
    id: 'perception',
    title: '1. 인식 (Perception)',
    description: '환경에서 데이터를 받아들이고 현재 상태를 파악하는 단계입니다. 센서를 통해 "무엇이 있는가?"를 이해합니다.',
    keywords: ['센서', '데이터 수집', '상태 파악'],
    misconception: '모든 것을 다 보는 것이 아니라, 필요한 정보만 선별합니다.',
    example: '로봇청소기가 앞의 장애물을 감지함'
  },
  {
    id: 'learning',
    title: '2. 학습 (Learning)',
    description: '과거의 데이터나 경험을 통해 성능을 개선하거나 세상의 패턴을 익히는 단계입니다.',
    keywords: ['패턴 인식', '지식 갱신', '모델 개선'],
    misconception: '한 번만 배우고 끝나는 것이 아니라 지속적으로 업데이트됩니다.',
    example: '장애물에 자주 걸리는 구역을 기억해둠'
  },
  {
    id: 'reasoning',
    title: '3. 추론 (Reasoning)',
    description: '현재 인식된 정보와 학습된 지식을 바탕으로 최적의 행동을 결정하는 단계입니다.',
    keywords: ['의사결정', '논리', '계획 수립'],
    misconception: '단순한 조건문(if-then)의 나열과는 달리, 목표를 달성하기 위해 유연하게 판단합니다.',
    example: '배터리가 부족하므로 충전기로 돌아가는 경로를 계산함'
  },
  {
    id: 'action',
    title: '4. 행동 (Action)',
    description: '결정된 사항을 실제 물리적/디지털 환경에 실행하고 결과를 평가하는 단계입니다.',
    keywords: ['액추에이터', '실행', '환경 변화'],
    misconception: '행동은 끝이 아니라, 다시 새로운 인식(피드백)으로 이어집니다.',
    example: '바퀴를 굴려 충전기로 이동함'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "지능 에이전트의 파이프라인 순서로 올바른 것은?",
    options: ["행동 → 인식 → 추론 → 학습", "인식 → 학습 → 추론 → 행동", "추론 → 인식 → 학습 → 행동", "학습 → 행동 → 인식 → 추론"],
    correctIndex: 1,
    explanation: "일반적인 흐름은 환경을 인식하고, 지식을 학습하며, 이를 바탕으로 추론하여 행동하는 순서입니다."
  },
  {
    id: 2,
    question: "'인식' 단계에 대한 설명으로 가장 적절한 것은?",
    options: ["미래의 행동을 계획한다.", "센서를 통해 환경 정보를 수집한다.", "과거의 실수를 수정한다.", "물리적인 힘을 가한다."],
    correctIndex: 1,
    explanation: "인식은 센서(카메라, 마이크 등)를 통해 환경의 상태를 파악하는 단계입니다."
  },
  {
    id: 3,
    question: "다음 중 '액추에이터(Actuator)'가 사용되는 단계는?",
    options: ["인식", "학습", "추론", "행동"],
    correctIndex: 3,
    explanation: "액추에이터는 전기 신호를 물리적 움직임이나 출력으로 변환하여 '행동'을 수행하는 장치입니다."
  },
  {
    id: 4,
    question: "단순한 자동문과 지능형 에이전트의 가장 큰 차이점은?",
    options: ["전기를 사용한다.", "센서가 있다.", "학습과 추론을 통해 스스로 판단 기준을 개선할 수 있다.", "움직일 수 있다."],
    correctIndex: 2,
    explanation: "지능형 에이전트는 고정된 규칙이 아니라, 학습과 추론을 통해 상황에 맞게 유연하게 대처합니다."
  },
  {
    id: 5,
    question: "'로봇이 매일 청소를 하며 가구 배치를 외우는 것'은 어느 단계에 해당하나요?",
    options: ["인식", "학습", "추론", "행동"],
    correctIndex: 1,
    explanation: "반복적인 경험을 통해 환경의 정보(가구 배치)를 지식화하는 것은 '학습' 단계입니다."
  },
  {
    id: 6,
    question: "에이전트 함수(Agent Function)의 역할은?",
    options: ["배터리를 충전한다.", "인식(입력)을 행동(출력)으로 매핑한다.", "센서를 청소한다.", "사용자의 명령을 거부한다."],
    correctIndex: 1,
    explanation: "에이전트 함수는 주어진 인식 시퀀스에 대해 어떤 행동을 할지 결정하는 추상적인 수학적/논리적 함수입니다."
  },
  {
    id: 7,
    question: "다음 중 '추론'의 예시가 아닌 것은?",
    options: ["목적지까지 최단 경로 찾기", "현재 날씨에 맞는 옷 고르기", "뜨거운 물체에 닿자마자 손을 떼기 (반사행동)", "상대방의 수를 예측하여 체스 두기"],
    correctIndex: 2,
    explanation: "반사 행동은 깊은 추론 과정 없이 즉각적으로 일어나는 단순 반응(Reflex)에 가깝습니다."
  },
  {
    id: 8,
    question: "파이프라인의 마지막 단계인 '행동' 이후에는 어떤 일이 일어나나요?",
    options: ["전원이 꺼진다.", "모든 데이터가 삭제된다.", "환경이 변화하고, 그 변화를 다시 '인식'한다.", "더 이상 아무 일도 일어나지 않는다."],
    correctIndex: 2,
    explanation: "에이전트의 행동은 환경을 변화시키고, 이 변화는 다시 센서를 통해 인식되어 순환합니다."
  },
  {
    id: 9,
    question: "다음 중 '센서'에 해당하지 않는 것은?",
    options: ["카메라", "마이크", "라이다(LiDAR)", "바퀴"],
    correctIndex: 3,
    explanation: "바퀴는 행동을 수행하는 '액추에이터'입니다."
  },
  {
    id: 10,
    question: "지능 에이전트를 설계할 때 가장 먼저 고려해야 할 것은?",
    options: ["로봇의 색상", "해결하려는 문제와 목표(Goal)", "사용할 배터리 용량", "이름 짓기"],
    correctIndex: 1,
    explanation: "에이전트가 달성해야 할 목표와 환경을 정의하는 것이 설계의 시작입니다."
  }
];

export const PUZZLE_ITEMS_EASY: PuzzleItem[] = [
  { id: 'p_1', type: 'STAGE', label: '인식', description: '문제/상황 파악' },
  { id: 'p_2', type: 'STAGE', label: '학습', description: '지식/패턴 습득' },
  { id: 'p_3', type: 'STAGE', label: '추론', description: '최적 결정 도출' },
  { id: 'p_4', type: 'STAGE', label: '행동', description: '실행 및 평가' },
];

export const PUZZLE_ITEMS_MEDIUM_TOKENS: PuzzleItem[] = [
  { id: 't_sensor', type: 'TOKEN', label: '센서', description: '데이터 입력 장치', correctSlotId: 'slot_before_perception' },
  { id: 't_agent_fn', type: 'TOKEN', label: '에이전트 함수', description: '입력→출력 매핑 규칙', correctSlotId: 'slot_center' },
  { id: 't_actuator', type: 'TOKEN', label: '액추에이터', description: '물리적 수행 장치', correctSlotId: 'slot_after_action' },
];

export const PUZZLE_SCENARIO_HARD: PuzzleItem[] = [
  { id: 'h_1', type: 'STAGE', label: '카메라로 복도 스캔', description: '(인식)', correctSlotIndex: 0 },
  { id: 'h_2', type: 'STAGE', label: '지도로 현재 위치 확인', description: '(학습/지식)', correctSlotIndex: 1 },
  { id: 'h_3', type: 'STAGE', label: '교실로 가는 길 계산', description: '(추론)', correctSlotIndex: 2 },
  { id: 'h_4', type: 'STAGE', label: '바퀴 모터 구동', description: '(행동)', correctSlotIndex: 3 },
];
