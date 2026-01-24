import { IoTItem, QuizQuestion } from './types';

export const IOT_ITEMS: IoTItem[] = [
  {
    id: 'smart-streetlight',
    name: '스마트 가로등',
    isIoT: true,
    imageKeyword: 'streetlight',
    description: '주변 밝기와 움직임을 감지해 스스로 켜지고, 고장 정보를 관제센터로 전송합니다.',
    reason: '센서로 데이터를 수집하고 인터넷을 통해 중앙 시스템과 연결됩니다.',
    tags: ['센서 있음', '인터넷 연결됨', '데이터 전송']
  },
  {
    id: 'old-streetlight',
    name: '일반 가로등',
    isIoT: false,
    imageKeyword: 'lamp',
    description: '정해진 시간에 타이머로 켜지거나 단순히 어두워지면 켜지는 가로등입니다.',
    reason: '인터넷에 연결되지 않았고, 단순히 센서나 타이머에 의해 자동화된 동작만 수행합니다.',
    tags: ['단순 자동화', '인터넷 없음']
  },
  {
    id: 'smart-trashcan',
    name: '스마트 쓰레기통',
    isIoT: true,
    imageKeyword: 'trash',
    description: '쓰레기 양을 감지하여 꽉 차면 수거 차량에 신호를 보냅니다.',
    reason: '쓰레기 적재량을 실시간으로 파악하여 네트워크를 통해 정보를 공유합니다.',
    tags: ['센서 있음', '원격 모니터링', '효율적 관리']
  },
  {
    id: 'auto-door',
    name: '자동문',
    isIoT: false,
    imageKeyword: 'door',
    description: '사람이 앞에 서면 센서가 감지하여 문을 엽니다.',
    reason: '센서는 있지만, 인터넷을 통해 데이터를 주고받거나 원격 제어되지 않습니다.',
    tags: ['단순 자동화', '로컬 센서', '인터넷 없음']
  },
  {
    id: 'smart-umbrella',
    name: '스마트 우산',
    isIoT: true,
    imageKeyword: 'umbrella',
    description: '스마트폰과 연동되어 비가 올 확률을 알려주고, 분실 시 위치를 추적합니다.',
    reason: '스마트폰 앱과 블루투스/인터넷으로 연결되어 정보를 제공합니다.',
    tags: ['앱 연동', '위치 추적', '날씨 정보']
  },
  {
    id: 'remote-tv',
    name: '리모컨 TV',
    isIoT: false,
    imageKeyword: 'tv',
    description: '적외선 리모컨으로 채널과 볼륨을 조절하는 TV입니다.',
    reason: '리모컨과 TV 사이의 1:1 근거리 통신일 뿐, 인터넷 네트워크에 연결되지 않습니다.',
    tags: ['단순 제어', '적외선 통신', '인터넷 없음']
  },
  {
    id: 'smart-watch',
    name: '스마트 워치',
    isIoT: true,
    imageKeyword: 'watch',
    description: '심박수를 측정하고 운동 기록을 클라우드에 저장하며 메시지를 수신합니다.',
    reason: '생체 데이터를 수집하여 인터넷 서버로 전송하고 분석합니다.',
    tags: ['데이터 수집', '클라우드 동기화', '웨어러블']
  },
  {
    id: 'digital-clock',
    name: '전자 시계',
    isIoT: false,
    imageKeyword: 'clock',
    description: '배터리로 작동하며 시간을 숫자로 보여주는 시계입니다.',
    reason: '외부와 연결되지 않고 독립적으로 시간을 표시하는 기능만 있습니다.',
    tags: ['단독 기기', '인터넷 없음']
  },
    {
    id: 'smart-plug',
    name: '스마트 플러그',
    isIoT: true,
    imageKeyword: 'plug',
    description: '앱으로 전원을 끄고 켤 수 있으며 전력 사용량을 스마트폰으로 확인합니다.',
    reason: '와이파이에 연결되어 원격 제어가 가능하고 사용량 데이터를 전송합니다.',
    tags: ['원격 제어', '에너지 관리', '와이파이']
  },
  {
    id: 'washing-machine',
    name: '일반 세탁기',
    isIoT: false,
    imageKeyword: 'washing',
    description: '버튼을 누르면 정해진 코스로 세탁을 수행합니다.',
    reason: '프로그램된 대로 작동하지만 외부 네트워크와 소통하지 않습니다.',
    tags: ['단순 자동화', '프로그램 내장']
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 사물 인터넷(IoT)의 필수 3요소가 아닌 것은?",
    options: ["센싱 (Sensing)", "네트워크 (Network)", "인공지능 (AI)", "배터리 대용량화"],
    correctIndex: 3,
    explanation: "IoT의 핵심은 사물이 센서를 통해 데이터를 수집(센싱)하고, 인터넷에 연결(네트워크)되며, 정보를 처리(지능화/서비스)하는 것입니다. 배터리는 전원 공급 수단일 뿐 핵심 개념 요소는 아닙니다."
  },
  {
    id: 2,
    question: "집 밖에서 스마트폰으로 거실 에어컨을 켰습니다. 이것은 IoT인가요?",
    options: ["O (IoT이다)", "X (IoT가 아니다)"],
    correctIndex: 0,
    explanation: "맞습니다. 에어컨이 인터넷에 연결되어 있고, 원격으로 제어 데이터를 주고받았으므로 IoT 기술이 적용된 사례입니다."
  },
  {
    id: 3,
    question: "자동차가 장애물을 감지하여 스스로 멈췄지만, 이 정보가 어디에도 전송되지 않았습니다. 이것은?",
    options: ["IoT 기술이다", "단순 자동화 기술이다"],
    correctIndex: 1,
    explanation: "정보가 외부와 공유되거나 네트워크에 연결되지 않고 자체적으로만 판단하여 동작했으므로 '단순 자동화'에 가깝습니다. IoT 자동차라면 사고 위험 정보를 주변 차량이나 관제 센터에 알렸을 것입니다."
  }
];
