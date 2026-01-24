import { ComponentType, GameItem, LevelConfig, QuizQuestion } from './types';

export const ITEMS: Record<string, GameItem> = {
  TEMP_SENSOR: { id: 'temp_sensor', name: '온도 센서', type: ComponentType.SENSOR, icon: 'Thermometer', description: '온도를 감지하여 전기 신호로 변환' },
  MOTION_SENSOR: { id: 'motion_sensor', name: '동작 감지 센서', type: ComponentType.SENSOR, icon: 'Move', description: '움직임을 감지' },
  WIFI: { id: 'wifi', name: 'Wi-Fi 공유기', type: ComponentType.NETWORK, icon: 'Wifi', description: '무선으로 데이터 전송' },
  BLUETOOTH: { id: 'bluetooth', name: '블루투스 모듈', type: ComponentType.NETWORK, icon: 'Bluetooth', description: '근거리 통신' },
  CLOUD_SERVER: { id: 'cloud', name: '클라우드 서버', type: ComponentType.SERVER, icon: 'Cloud', description: '데이터를 분석하고 판단' },
  AI_PROCESSOR: { id: 'ai', name: 'AI 허브', type: ComponentType.SERVER, icon: 'Cpu', description: '스마트 홈 중앙 처리 장치' },
  BOILER: { id: 'boiler', name: '보일러 컨트롤러', type: ComponentType.ACTUATOR, icon: 'Flame', description: '난방을 실행' },
  LIGHT: { id: 'light', name: '스마트 조명', type: ComponentType.ACTUATOR, icon: 'Lightbulb', description: '불을 켜거나 끔' },
  SPEAKER: { id: 'speaker', name: 'AI 스피커', type: ComponentType.ACTUATOR, icon: 'Speaker', description: '소리를 출력' },
  GATEWAY: { id: 'gateway', name: 'IoT 게이트웨이', type: ComponentType.GATEWAY, icon: 'Router', description: '서로 다른 통신 언어를 번역' },
};

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Level 1: 기본 연결 (거실)',
    difficulty: '초보 기사',
    scenario: '거실 온도가 낮아지면 보일러를 켜야 합니다. 가장 기본적인 흐름을 연결하세요.',
    description: '센서 -> 처리 -> 실행',
    slots: 3,
    requiredSequence: [ComponentType.SENSOR, ComponentType.SERVER, ComponentType.ACTUATOR],
    availableItems: [ITEMS.TEMP_SENSOR, ITEMS.BOILER, ITEMS.CLOUD_SERVER, ITEMS.SPEAKER, ITEMS.MOTION_SENSOR]
  },
  {
    id: 2,
    title: 'Level 2: 네트워크 확장 (현관)',
    difficulty: '초보 기사',
    scenario: '사람이 들어오면 현관 조명을 켜야 합니다. 무선 통신을 통해 데이터를 보내세요.',
    description: '센서 -> 네트워크 -> 서버 -> 실행',
    slots: 4,
    requiredSequence: [ComponentType.SENSOR, ComponentType.NETWORK, ComponentType.SERVER, ComponentType.ACTUATOR],
    availableItems: [ITEMS.MOTION_SENSOR, ITEMS.WIFI, ITEMS.CLOUD_SERVER, ITEMS.LIGHT, ITEMS.TEMP_SENSOR, ITEMS.BOILER]
  },
  {
    id: 3,
    title: 'Level 3: 복합 시스템 (부엌)',
    difficulty: '숙련된 엔지니어',
    scenario: '다양한 기기가 연결된 부엌입니다. 게이트웨이를 통해 데이터를 모으고 처리하세요.',
    description: '센서 -> 네트워크 -> 게이트웨이 -> 서버 -> 실행',
    slots: 5,
    requiredSequence: [ComponentType.SENSOR, ComponentType.NETWORK, ComponentType.GATEWAY, ComponentType.SERVER, ComponentType.ACTUATOR],
    availableItems: [ITEMS.TEMP_SENSOR, ITEMS.BLUETOOTH, ITEMS.GATEWAY, ITEMS.AI_PROCESSOR, ITEMS.SPEAKER, ITEMS.WIFI, ITEMS.CLOUD_SERVER]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "스마트 홈에서 데이터를 '수집'하는 역할을 하는 장치는?",
    options: ["액추에이터", "서버", "센서", "네트워크"],
    correctAnswer: 2,
    explanation: "센서(Sensor)는 주변 환경의 정보(온도, 빛, 소리 등)를 수집하여 전기 신호로 변환합니다."
  },
  {
    id: 2,
    question: "수집된 데이터를 판단하고 명령을 내리는 '두뇌' 역할은?",
    options: ["Wi-Fi", "클라우드 서버", "스마트 전구", "전원 케이블"],
    correctAnswer: 1,
    explanation: "서버나 AI 허브는 수집된 데이터를 분석하고, 설정된 조건에 따라 액추에이터에게 명령을 내립니다."
  },
  {
    id: 3,
    question: "다음 중 '액추에이터(실행 장치)'에 해당하는 것은?",
    options: ["온도 센서", "스마트 플러그(전원 제어)", "인터넷 공유기", "광케이블"],
    correctAnswer: 1,
    explanation: "액추에이터는 전기적 신호를 받아 실제로 물리적인 동작(전원 켜기, 모터 돌리기, 소리 내기)을 수행합니다."
  }
];