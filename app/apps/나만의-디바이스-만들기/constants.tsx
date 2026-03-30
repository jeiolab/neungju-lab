import { ComponentType, IoTComponent, Level } from './types';

export const COMPONENTS: IoTComponent[] = [
  // SENSORS
  { id: 'temp-sensor', name: '온도 센서', type: ComponentType.SENSOR, description: '열과 온도 변화를 감지합니다.', iconName: 'Thermometer' },
  { id: 'light-sensor', name: '조도 센서', type: ComponentType.SENSOR, description: '주변 빛의 밝기를 측정합니다.', iconName: 'Sun' },
  { id: 'sound-sensor', name: '소리 센서', type: ComponentType.SENSOR, description: '소음 수준을 감지합니다.', iconName: 'Mic' },
  { id: 'distance-sensor', name: '거리 센서', type: ComponentType.SENSOR, description: '물체와의 거리를 측정합니다.', iconName: 'Ruler' },
  { id: 'moisture-sensor', name: '수분 센서', type: ComponentType.SENSOR, description: '토양의 수분 함량을 측정합니다.', iconName: 'Droplets' },
  { id: 'camera', name: '카메라', type: ComponentType.SENSOR, description: '시각 데이터를 캡처합니다.', iconName: 'Camera' },

  // NETWORK
  { id: 'wifi', name: 'Wi-Fi 모듈', type: ComponentType.NETWORK, description: '고속 무선 연결을 제공합니다.', iconName: 'Wifi' },
  { id: 'bluetooth', name: '블루투스', type: ComponentType.NETWORK, description: '근거리 무선 통신을 제공합니다.', iconName: 'Bluetooth' },
  { id: '5g', name: '5G 모듈', type: ComponentType.NETWORK, description: '초고속 모바일 네트워크입니다.', iconName: 'SignalHigh' },

  // PLATFORM
  { id: 'cloud', name: '클라우드 서버', type: ComponentType.PLATFORM, description: '원격 데이터 저장 및 처리를 담당합니다.', iconName: 'Cloud' },
  { id: 'local-gateway', name: '로컬 게이트웨이', type: ComponentType.PLATFORM, description: '데이터를 로컬에서 처리합니다.', iconName: 'Server' },

  // ACTUATOR / SERVICE
  { id: 'siren', name: '사이렌', type: ComponentType.ACTUATOR, description: '비상 시 큰 소리로 알립니다.', iconName: 'Megaphone' },
  { id: 'motor', name: '모터', type: ComponentType.ACTUATOR, description: '움직임을 만들어냅니다.', iconName: 'Fan' },
  { id: 'water-pump', name: '물 펌프', type: ComponentType.ACTUATOR, description: '물을 공급합니다.', iconName: 'Waves' },
  { id: 'phone-app', name: '앱 알림', type: ComponentType.ACTUATOR, description: '스마트폰으로 알림을 보냅니다.', iconName: 'Smartphone' },
  { id: 'led', name: '스마트 LED', type: ComponentType.ACTUATOR, description: '빛을 출력합니다.', iconName: 'Lightbulb' },
  { id: 'steering', name: '조향 장치', type: ComponentType.ACTUATOR, description: '차량의 방향을 제어합니다.', iconName: 'Navigation' },
];

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "레벨 1: 스마트 화재 경보기",
    mission: "화재를 감지하는 시스템을 만드세요!",
    description: "화재가 발생하면 모두에게 알려야 합니다. 열기를 감지하는 센서와 큰 소리로 알릴 장치를 찾아보세요!",
    difficulty: 'Easy',
    slots: [
      { id: 'slot-device', label: '디바이스 (센서)', acceptedTypes: [ComponentType.SENSOR] },
      { id: 'slot-network', label: '네트워크', acceptedTypes: [ComponentType.NETWORK] },
      { id: 'slot-platform', label: '플랫폼', acceptedTypes: [ComponentType.PLATFORM] },
      { id: 'slot-service', label: '서비스 (출력)', acceptedTypes: [ComponentType.ACTUATOR] },
    ],
    solution: {
      'slot-device': 'temp-sensor',
      'slot-network': 'wifi',
      'slot-platform': 'cloud',
      'slot-service': 'siren'
    }
  },
  {
    id: 2,
    title: "레벨 2: 스마트 화분",
    mission: "화분에게 자동으로 물을 주세요!",
    description: "흙이 마르면 식물에게 물이 필요해요. 흙 상태를 확인하는 센서와 물을 주는 장치를 연결해보세요.",
    difficulty: 'Easy',
    slots: [
      { id: 'slot-device', label: '디바이스 (센서)', acceptedTypes: [ComponentType.SENSOR] },
      { id: 'slot-network', label: '네트워크', acceptedTypes: [ComponentType.NETWORK] },
      { id: 'slot-service', label: '액추에이터 (동작)', acceptedTypes: [ComponentType.ACTUATOR] },
    ],
    solution: {
      'slot-device': 'moisture-sensor',
      'slot-network': 'wifi', // or bluetooth, strictly usually wifi for IoT home
      'slot-service': 'water-pump'
    }
  },
  {
    id: 3,
    title: "레벨 3: 자율 주행 자동차",
    mission: "벽에 부딪히지 않고 안전하게 운전하세요!",
    description: "자동차가 장애물을 보고 피해야 합니다. 시각 정보를 수집하고 데이터를 빠르게 처리하여 방향을 바꾸세요.",
    difficulty: 'Medium',
    slots: [
      { id: 'slot-device', label: '디바이스 (시각)', acceptedTypes: [ComponentType.SENSOR] },
      { id: 'slot-network', label: '네트워크', acceptedTypes: [ComponentType.NETWORK] },
      { id: 'slot-platform', label: '플랫폼 (두뇌)', acceptedTypes: [ComponentType.PLATFORM] },
      { id: 'slot-service', label: '동작 (조향)', acceptedTypes: [ComponentType.ACTUATOR] },
    ],
    solution: {
      'slot-device': 'camera', // or distance sensor
      'slot-network': '5g',
      'slot-platform': 'cloud', // or local gateway for latency? Let's use 5g + cloud for standard example
      'slot-service': 'steering'
    }
  }
];