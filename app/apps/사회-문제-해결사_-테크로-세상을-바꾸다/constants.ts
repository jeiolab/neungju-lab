import { Block, BlockType, Problem } from './types';

// Icons are represented by string names to be used with Lucide-React dynamically or mapped
export const BLOCKS: Record<string, Block> = {
  // SENSORS
  'motion_sensor': { id: 'motion_sensor', name: '동작 감지 센서', type: BlockType.SENSOR, icon: 'Activity', description: '움직임을 감지합니다.' },
  'temp_sensor': { id: 'temp_sensor', name: '온도 센서', type: BlockType.SENSOR, icon: 'Thermometer', description: '온도를 측정합니다.' },
  'camera': { id: 'camera', name: 'AI 카메라', type: BlockType.SENSOR, icon: 'Camera', description: '이미지를 인식합니다.' },
  'gps': { id: 'gps', name: 'GPS 위치 추적', type: BlockType.SENSOR, icon: 'MapPin', description: '현재 위치를 파악합니다.' },

  // NETWORK
  'wifi': { id: 'wifi', name: 'Wi-Fi 전송', type: BlockType.NETWORK, icon: 'Wifi', description: '인터넷으로 데이터를 보냅니다.' },
  'lora': { id: 'lora', name: 'LoRa망 전송', type: BlockType.NETWORK, icon: 'Radio', description: '저전력 장거리 통신입니다.' },

  // PROCESS/AI
  'ai_server': { id: 'ai_server', name: 'AI 분석 서버', type: BlockType.PROCESS, icon: 'Cpu', description: '데이터 패턴을 분석합니다.' },
  'cloud_db': { id: 'cloud_db', name: '클라우드 저장소', type: BlockType.PROCESS, icon: 'Database', description: '데이터를 저장하고 관리합니다.' },

  // ACTION
  'app_alert': { id: 'app_alert', name: '보호자 앱 알림', type: BlockType.ACTION, icon: 'Smartphone', description: '스마트폰으로 경고를 보냅니다.' },
  'auto_call': { id: 'auto_call', name: '119 자동 신고', type: BlockType.ACTION, icon: 'PhoneCall', description: '응급 구조대에 전화합니다.' },
  'sprinkler': { id: 'sprinkler', name: '스프링클러 작동', type: BlockType.ACTION, icon: 'Droplets', description: '물을 뿌립니다.' },
  'display': { id: 'display', name: '정보 디스플레이', type: BlockType.ACTION, icon: 'Monitor', description: '화면에 정보를 띄웁니다.' },

  // NOISE (Distractors)
  'music_player': { id: 'music_player', name: '음악 재생기', type: BlockType.NOISE, icon: 'Music', description: '음악을 틉니다.' },
  'traffic_light': { id: 'traffic_light', name: '신호등', type: BlockType.NOISE, icon: 'TrafficCone', description: '교통 신호를 제어합니다.' },
  'toaster': { id: 'toaster', name: '스마트 토스터', type: BlockType.NOISE, icon: 'Zap', description: '빵을 굽습니다.' },
};

export const PROBLEMS: Problem[] = [
  {
    id: 'elderly_care',
    title: '독거노인 돌봄 시스템',
    shortDescription: '혼자 사시는 어르신의 안전을 지켜주세요.',
    fullDescription: '최근 독거노인 고독사가 사회적 문제로 대두되고 있습니다. 움직임이 오랫동안 감지되지 않을 때, 빠르게 보호자나 복지사에게 알리는 "디지털 돌봄 시스템"이 필요합니다. 어떤 순서로 기술을 연결해야 할까요?',
    imageUrl: 'https://picsum.photos/800/400?grayscale',
    difficulty: 'easy',
    correctSequence: ['motion_sensor', 'wifi', 'ai_server', 'app_alert'],
    availableBlocks: [
      BLOCKS['motion_sensor'], BLOCKS['wifi'], BLOCKS['ai_server'], BLOCKS['app_alert'], 
      BLOCKS['toaster'], BLOCKS['traffic_light'] // Noise
    ],
    successMessage: '성공입니다! 어르신의 움직임이 12시간 동안 없으면 자동으로 복지사에게 알림이 갑니다.',
    socialValue: '조기 발견을 통한 생명 구조 및 사회적 비용(장례, 수습 등) 절감, 가족들의 심리적 안정.',
    quiz: {
      question: '이 시스템에서 "AI 분석 서버"가 하는 역할은 무엇인가요?',
      options: [
        '직접 어르신을 찾아간다.',
        '움직임 데이터를 분석해 평소와 다른지 판단한다.',
        '인터넷 연결을 끊는다.',
        '전기를 생산한다.'
      ],
      correctIndex: 1,
      explanation: 'AI 서버는 수집된 데이터를 분석하여 이상 징후(장시간 움직임 없음)를 판단하는 두뇌 역할을 합니다.'
    }
  },
  {
    id: 'smart_farm',
    title: '스마트 팜 환경 제어',
    shortDescription: '기후 변화에 대응하여 농작물을 보호하세요.',
    fullDescription: '이상 기후로 인해 농작물 피해가 급증하고 있습니다. 비닐하우스 내부 온도가 너무 올라가면 자동으로 온도를 낮추는 시스템을 구축하여 농부의 일손을 덜고 작물을 보호해야 합니다.',
    imageUrl: 'https://picsum.photos/800/401?blur',
    difficulty: 'hard',
    correctSequence: ['temp_sensor', 'lora', 'cloud_db', 'sprinkler'], // Example simplified logic
    availableBlocks: [
      BLOCKS['temp_sensor'], BLOCKS['lora'], BLOCKS['cloud_db'], BLOCKS['sprinkler'],
      BLOCKS['gps'], BLOCKS['music_player'], BLOCKS['camera']
    ],
    successMessage: '완벽합니다! 온도가 설정값 이상으로 오르면 자동으로 물을 뿌려 온도를 낮춥니다.',
    socialValue: '안정적인 식량 생산, 농가 소득 증대, 불필요한 물 낭비 방지.',
    quiz: {
      question: '만약 "온도 센서" 대신 "GPS"를 설치하면 어떤 문제가 생길까요?',
      options: [
        '농작물의 위치만 알고, 더운지는 알 수 없다.',
        '물이 너무 많이 나온다.',
        '작물이 더 빨리 자란다.',
        '아무 문제 없다.'
      ],
      correctIndex: 0,
      explanation: '문제 해결의 핵심은 "온도 관리"입니다. GPS는 위치만 알려주므로 온도를 제어하는 데 필요한 데이터를 줄 수 없습니다.'
    }
  }
];

export const BADGES = [
  { id: 'novice', name: '초보 해결사', icon: 'Award', requirement: 1 },
  { id: 'expert', name: '명예 해결사', icon: 'Medal', requirement: 2 },
];