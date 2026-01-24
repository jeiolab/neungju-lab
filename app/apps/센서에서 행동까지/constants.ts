import { ScenarioConfig, QuizQuestion } from './types';

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'temp',
    name: '스마트 냉방',
    description: '온도가 너무 높으면 선풍기를 켭니다.',
    sensor: {
      name: '온도 센서',
      unit: '°C',
      min: 10,
      max: 40,
      icon: 'thermometer',
    },
    logic: {
      threshold: 30,
      operator: '>',
      description: '온도 > 30?',
    },
    actuator: {
      name: '선풍기',
      activeLabel: '회전 중',
      inactiveLabel: '정지',
      icon: 'fan',
    },
  },
  {
    id: 'light',
    name: '스마트 가로등',
    description: '주위가 어두워지면 조명을 켭니다.',
    sensor: {
      name: '조도 센서 (빛)',
      unit: '%',
      min: 0,
      max: 100,
      icon: 'sun',
    },
    logic: {
      threshold: 30,
      operator: '<',
      description: '밝기 < 30%?',
    },
    actuator: {
      name: '가로등',
      activeLabel: '켜짐',
      inactiveLabel: '꺼짐',
      icon: 'lamp',
    },
  },
  {
    id: 'door',
    name: '자동문',
    description: '사람이 가까이 다가오면 문을 엽니다.',
    sensor: {
      name: '거리 센서',
      unit: 'm',
      min: 0,
      max: 5,
      icon: 'ruler',
    },
    logic: {
      threshold: 1.5,
      operator: '<',
      description: '거리 < 1.5m?',
    },
    actuator: {
      name: '슬라이딩 도어',
      activeLabel: '열림',
      inactiveLabel: '닫힘',
      icon: 'door',
    },
  },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "데이터를 기반으로 '판단(결정)'을 내리는 구성 요소는 무엇인가요?",
    options: ["센서 (Sensor)", "마이크로컨트롤러 / IoT 플랫폼", "액추에이터 (Actuator)", "전원 공급 장치"],
    correctIndex: 1,
    explanation: "마이크로컨트롤러(또는 클라우드 플랫폼)는 '두뇌' 역할을 합니다. 센서로부터 데이터를 받아 논리(코드)를 확인하고 액추에이터에 명령을 보냅니다.",
  },
  {
    id: 2,
    question: "IoT 시스템에서 물리적인 '행동'을 수행하는 장치는 무엇인가요?",
    options: ["데이터 패킷", "Wi-Fi 공유기", "액추에이터 (Actuator)", "온도계"],
    correctIndex: 2,
    explanation: "액추에이터는 모터를 돌리거나, 불을 켜거나, 밸브를 여는 등 실제로 물리적인 동작을 수행하는 장치입니다.",
  },
];