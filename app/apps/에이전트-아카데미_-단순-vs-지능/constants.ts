import { AgentType, AgentData, QuizQuestion, Badge, UserStats } from './types';
import { 
  Zap, 
  Brain, 
  Thermometer, 
  Car, 
  Tv, 
  Ghost, 
  Lightbulb, 
  DoorOpen, 
  Disc,
  Coffee,
  ShoppingBag,
  Cpu
} from 'lucide-react';

export const AGENT_DATA: AgentData[] = [
  {
    id: '1',
    name: '자동문',
    type: AgentType.SIMPLE,
    description: '센서 가까이에서 움직임이 감지되면 문을 엽니다.',
    specs: {
      inputs: '적외선 또는 모션 센서',
      mechanism: 'IF 움직임 감지 THEN 문 열기',
      details: '고정된 규칙을 따릅니다. 누가 들어오는지 학습하거나 걷는 속도에 적응하지 않습니다.'
    },
    iconName: 'DoorOpen'
  },
  {
    id: '2',
    name: '온도조절기',
    type: AgentType.SIMPLE,
    description: '실내 온도를 설정된 값으로 유지합니다.',
    specs: {
      inputs: '온도 센서',
      mechanism: 'IF 현재온도 < 목표온도 THEN 난방 켜기',
      details: '현재 온도 차이에만 반응합니다. 날씨 변화를 미리 예측하지 않습니다.'
    },
    iconName: 'Thermometer'
  },
  {
    id: '3',
    name: '자율주행 자동차',
    type: AgentType.INTELLIGENT,
    description: '주변 환경을 인식하여 안전하게 운전합니다.',
    specs: {
      inputs: '라이다, 카메라, 레이더, GPS',
      mechanism: '딥러닝, 컴퓨터 비전, 경로 계획',
      details: '객체를 인식하고 보행자의 움직임을 예측하며, 주행 데이터를 통해 학습합니다.'
    },
    iconName: 'Car'
  },
  {
    id: '4',
    name: '넷플릭스 추천 시스템',
    type: AgentType.INTELLIGENT,
    description: '시청 기록을 바탕으로 영화를 추천합니다.',
    specs: {
      inputs: '시청 기록, 평점, 사용자 통계',
      mechanism: '협업 필터링, 행렬 분해',
      details: '시간이 지남에 따라 사용자의 취향을 학습하고 추천 목록을 동적으로 조정합니다.'
    },
    iconName: 'Tv'
  },
  {
    id: '5',
    name: '엘리베이터',
    type: AgentType.SIMPLE,
    description: '버튼을 누르면 해당 층으로 이동합니다.',
    specs: {
      inputs: '버튼 입력, 층 센서',
      mechanism: '큐 로직 (순차적 또는 방향 최적화)',
      details: '프로그래밍된 논리대로만 작동합니다. 어떤 직원이 늦게 출근하는지 "학습"하지 않습니다.'
    },
    iconName: 'Zap'
  },
  {
    id: '6',
    name: '알파고 (AlphaGo)',
    type: AgentType.INTELLIGENT,
    description: '바둑 게임을 초인적인 수준으로 둡니다.',
    specs: {
      inputs: '바둑판 배치 상황',
      mechanism: '강화 학습, 몬테카를로 트리 탐색',
      details: '수백만 번의 대국을 통해 스스로 새로운 전략을 발견하고 학습했습니다.'
    },
    iconName: 'Brain'
  },
  {
    id: '7',
    name: '자판기',
    type: AgentType.SIMPLE,
    description: '정확한 금액이 투입되면 제품을 내보냅니다.',
    specs: {
      inputs: '지폐/동전 인식기, 버튼',
      mechanism: 'IF 투입금액 >= 가격 THEN 상품 배출',
      details: '상태 머신 로직입니다. 단골 손님에게 자동으로 할인을 해주지 않습니다.'
    },
    iconName: 'ShoppingBag'
  },
  {
    id: '8',
    name: '로봇 청소기 (구형)',
    type: AgentType.SIMPLE,
    description: '벽에 부딪히면 무작위로 방향을 틀어 청소합니다.',
    specs: {
      inputs: '범퍼 센서',
      mechanism: 'IF 충돌 THEN 무작위 회전',
      details: '방 구조를 지도로 그리지 않습니다. 단순한 반사 행동만 합니다.'
    },
    iconName: 'Disc'
  },
  {
    id: '9',
    name: 'AI 음성 비서',
    type: AgentType.INTELLIGENT,
    description: '음성 명령을 이해하고 작업을 수행합니다.',
    specs: {
      inputs: '마이크 (오디오 파형)',
      mechanism: '자연어 처리(NLP), 음성 인식(STT)',
      details: '사용자의 발음 억양에 적응하고 일상적인 루틴을 학습합니다.'
    },
    iconName: 'Cpu'
  },
  {
    id: '10',
    name: '신호등 (타이머)',
    type: AgentType.SIMPLE,
    description: '고정된 시간 일정에 따라 색상을 변경합니다.',
    specs: {
      inputs: '내부 시계',
      mechanism: '루프: 빨강(60초) -> 초록(60초) -> 노랑(5초)',
      details: '대기 중인 차가 있든 없든 정해진 주기로만 작동합니다.'
    },
    iconName: 'Lightbulb'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '단순 에이전트와 지능 에이전트의 핵심적인 차이는 무엇인가요?',
    options: [
      '단순 에이전트는 전기를 쓰고, 지능 에이전트는 쓰지 않는다.',
      '지능 에이전트는 학습하고 적응하지만, 단순 에이전트는 고정된 규칙을 따른다.',
      '단순 에이전트가 항상 더 저렴하다.',
      '지능 에이전트는 센서가 필요 없다.'
    ],
    correctAnswerIndex: 1,
    explanation: '가장 큰 차이점은 데이터로부터 학습하여 행동을 적응(Adaptation)시킬 수 있는지, 아니면 하드코딩된 규칙만 따르는지 여부입니다.'
  },
  {
    id: 'q2',
    question: '다음 중 "단순 에이전트"의 예시는 무엇인가요?',
    options: [
      '테슬라 오토파일럿',
      'ChatGPT',
      '자동문 (모션 센서)',
      '유튜브 추천 알고리즘'
    ],
    correctAnswerIndex: 2,
    explanation: '자동문은 단순한 센서 트리거(움직임 감지 -> 문 열기)로 작동하며, 추론이나 학습을 하지 않습니다.'
  },
  {
    id: 'q3',
    question: '지능 에이전트가 시간이 지날수록 성능이 향상되는 이유는 무엇인가요?',
    options: [
      '배터리가 더 좋아서',
      '머신러닝(기계학습) 알고리즘 덕분에',
      '버튼 색깔이 다양해서',
      '모터가 더 강력해서'
    ],
    correctAnswerIndex: 1,
    explanation: '머신러닝 알고리즘을 통해 데이터를 처리하고, 패턴을 식별하며, 내부 모델을 업데이트하기 때문입니다.'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: '초보 분류가',
    description: '첫 번째 게임을 플레이하세요.',
    icon: 'star',
    unlocked: false,
    condition: (stats: UserStats) => stats.gamesPlayed >= 1
  },
  {
    id: 'b2',
    name: '콤보 마스터',
    description: '10콤보 이상 달성하세요.',
    icon: 'flame',
    unlocked: false,
    condition: (stats: UserStats) => stats.maxCombo >= 10
  },
  {
    id: 'b3',
    name: '고득점자',
    description: '한 게임에서 1000점 이상 획득하세요.',
    icon: 'trophy',
    unlocked: false,
    condition: (stats: UserStats) => stats.highScore >= 1000
  },
  {
    id: 'b4',
    name: '척척박사',
    description: '퀴즈에서 만점을 받으세요.',
    icon: 'book',
    unlocked: false,
    condition: (stats: UserStats) => stats.quizScore === QUIZ_QUESTIONS.length
  }
];