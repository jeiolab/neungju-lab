import { ProcessStage, StageDefinition, Scenario, QuizQuestion } from './types';

export const PROCESS_STAGES: StageDefinition[] = [
  { id: 'env_in', label: '외부 환경 (입력)', description: '에이전트 주변의 상황 발생', iconName: 'Sun', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { id: 'sensor', label: '지각 (센서)', description: '데이터를 수집하고 인식', iconName: 'Eye', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'ai', label: '추론 (AI)', description: '데이터를 분석하고 판단', iconName: 'Brain', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: 'decision', label: '행동 결정', description: '무엇을 할지 구체적 계획', iconName: 'GitMerge', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { id: 'actuator', label: '구동 (액추에이터)', description: '물리적인 움직임 발생', iconName: 'Zap', color: 'bg-red-100 text-red-700 border-red-300' },
  { id: 'env_out', label: '환경 변화 (결과)', description: '세상이 바뀜', iconName: 'RefreshCw', color: 'bg-green-100 text-green-700 border-green-300' },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'drone_1',
    chapter: '드론',
    title: '장애물 회피',
    description: '배달 드론이 비행 중 커다란 나무를 발견했습니다.',
    correctOrder: ['env_in', 'sensor', 'ai', 'decision', 'actuator', 'env_out'],
    blocks: [
      { id: 'b1', text: '나무가 앞에 나타남', stage: 'env_in' },
      { id: 'b2', text: '카메라로 나무 인식', stage: 'sensor' },
      { id: 'b3', text: '충돌 위험 계산', stage: 'ai' },
      { id: 'b4', text: '오른쪽 회피 경로 생성', stage: 'decision' },
      { id: 'b5', text: '왼쪽 모터 회전수 증가', stage: 'actuator' },
      { id: 'b6', text: '드론이 오른쪽으로 이동', stage: 'env_out' },
    ]
  },
  {
    id: 'car_1',
    chapter: '자동차',
    title: '신호등 정지',
    description: '자율주행차가 교차로에서 빨간불을 감지했습니다.',
    correctOrder: ['env_in', 'sensor', 'ai', 'decision', 'actuator', 'env_out'],
    blocks: [
      { id: 'b1', text: '신호등이 빨간색으로 바뀜', stage: 'env_in' },
      { id: 'b2', text: '전방 카메라 색상 감지', stage: 'sensor' },
      { id: 'b3', text: '정지해야 한다고 판단', stage: 'ai' },
      { id: 'b4', text: '브레이크 제어 명령 생성', stage: 'decision' },
      { id: 'b5', text: '유압 브레이크 작동', stage: 'actuator' },
      { id: 'b6', text: '차가 정지선에 멈춤', stage: 'env_out' },
    ]
  },
  {
    id: 'vacuum_1',
    chapter: '청소기',
    title: '먼지 발견',
    description: '로봇 청소기가 거실 구석에서 먼지 뭉치를 찾았습니다.',
    correctOrder: ['env_in', 'sensor', 'ai', 'decision', 'actuator', 'env_out'],
    blocks: [
      { id: 'b1', text: '바닥에 먼지가 있음', stage: 'env_in' },
      { id: 'b2', text: '적외선 먼지 센서 감지', stage: 'sensor' },
      { id: 'b3', text: '오염도가 높다고 분석', stage: 'ai' },
      { id: 'b4', text: '흡입력 최대로 설정', stage: 'decision' },
      { id: 'b5', text: '흡입 모터 고속 회전', stage: 'actuator' },
      { id: 'b6', text: '먼지가 사라짐', stage: 'env_out' },
    ]
  }
];

export const DICTIONARY_TERMS = [
  { term: '센서 (Sensor)', def: '빛, 소리, 온도 등 물리적인 신호를 전기 신호(데이터)로 바꾸는 눈과 귀 같은 장치.' },
  { term: '액추에이터 (Actuator)', def: '전기 신호를 받아 실제로 움직임을 만들어내는 팔과 다리 같은 장치 (모터, 스피커 등).' },
  { term: '추론 (Inference)', def: '이미 학습된 지식을 바탕으로 새로운 데이터가 무엇인지 판단하는 과정.' },
  { term: '알고리즘 (Algorithm)', def: '문제를 해결하기 위해 정해진 일련의 규칙이나 절차.' },
  { term: '피드백 (Feedback)', def: '결과를 다시 입력으로 사용하여 다음 행동을 수정하는 과정.' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '다음 중 "액추에이터"에 해당하는 것은 무엇인가요?',
    options: ['카메라', '모터', '마이크', '온도 센서'],
    correctAnswer: '모터',
    explanation: '나머지는 모두 외부 정보를 받아들이는 센서입니다. 모터는 움직임을 만드는 액추에이터입니다.'
  },
  {
    id: 'q2',
    question: '자율주행차가 "사람이다!"라고 판단하는 단계는 어디인가요?',
    options: ['센서/지각', '구동기', '추론/AI', '환경 변화'],
    correctAnswer: '추론/AI',
    explanation: '센서는 이미지만 찍을 뿐, 그것이 사람인지 판단하는 것은 AI의 추론 단계입니다.'
  }
];

export const THINK_TOPICS = [
  {
    title: '센서가 고장난다면?',
    content: '만약 드론의 카메라에 진흙이 묻었다면 어떻게 될까요? AI는 "앞에 아무것도 없다"고 잘못 판단할 수 있습니다. 이것은 판단 능력의 문제가 아니라 입력 데이터의 문제입니다.'
  },
  {
    title: '딜레마 상황',
    content: '자율주행차 앞에 갑자기 튀어나온 야생동물이 있습니다. 멈추면 뒤차와 부딪히고, 피하면 중앙선을 넘어야 합니다. AI는 어떤 결정을 내려야 할까요? 정답이 없는 문제에서 AI 윤리가 필요합니다.'
  },
  {
    title: '사람 vs AI',
    content: '사람은 뜨거운 것을 만지면 "앗 뜨거!" 하고 반사적으로 손을 뗍니다(척수 반사). 이것은 뇌까지 가지 않는 빠른 처리입니다. 로봇도 긴급 상황을 위해 이런 "반사 신경" 같은 회로가 필요할까요?'
  }
];