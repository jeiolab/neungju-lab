import { EquipmentType, SpaceType, EquipmentItem, QuizQuestion } from './types';

export const SPACES = {
  [SpaceType.HOME]: {
    name: '우리 집',
    budget: 800,
    description: '스트리밍과 스마트 기기를 위한 안정적인 와이파이가 필요한 아늑한 집입니다.',
    minDevices: 5,
    difficulty: '쉬움',
  },
  [SpaceType.CLASSROOM]: {
    name: '학교 교실',
    budget: 2000,
    description: '30명의 학생이 있는 디지털 교실입니다. 높은 안정성과 많은 연결이 필요합니다.',
    minDevices: 30,
    difficulty: '보통',
  },
  [SpaceType.CAFE]: {
    name: '스터디 카페',
    budget: 3500,
    description: '50명 이상의 손님이 이용하는 대형 카페입니다. 기업급 속도와 커버리지가 필요합니다.',
    minDevices: 50,
    difficulty: '어려움',
  },
};

export const CATALOG: EquipmentItem[] = [
  // ISP Plans
  {
    id: 'isp-basic',
    name: '기본 DSL (50 Mbps)',
    type: EquipmentType.INTERNET_PLAN,
    cost: 30,
    speedMbps: 50,
    description: '기본적인 웹 서핑에 적합합니다.',
    icon: 'SignalLow',
  },
  {
    id: 'isp-fiber',
    name: '광랜 (500 Mbps)',
    type: EquipmentType.INTERNET_PLAN,
    cost: 80,
    speedMbps: 500,
    description: 'HD 스트리밍과 게임에 탁월합니다.',
    icon: 'SignalMedium',
  },
  {
    id: 'isp-biz',
    name: '기업용 회선 (1 Gbps)',
    type: EquipmentType.INTERNET_PLAN,
    cost: 200,
    speedMbps: 1000,
    description: '다수의 사용자를 위한 최고 속도입니다.',
    icon: 'SignalHigh',
  },
  // Routers
  {
    id: 'router-home',
    name: '가정용 공유기 (AC1200)',
    type: EquipmentType.ROUTER,
    cost: 50,
    ports: 4,
    speedMbps: 300,
    description: '기본 와이파이 공유기. LAN 포트 4개.',
    icon: 'Router',
  },
  {
    id: 'router-mesh',
    name: '메쉬 시스템 (AX3000)',
    type: EquipmentType.ROUTER,
    cost: 250,
    ports: 2,
    speedMbps: 1200,
    description: '넓은 커버리지, 와이파이 6 지원.',
    icon: 'Wifi',
  },
  {
    id: 'router-biz',
    name: '기업용 게이트웨이',
    type: EquipmentType.ROUTER,
    cost: 500,
    ports: 8,
    speedMbps: 2500,
    description: '대용량 처리, 보안 강화 모델.',
    icon: 'Server',
  },
  // Switches
  {
    id: 'switch-5',
    name: '5포트 스위치',
    type: EquipmentType.SWITCH,
    cost: 20,
    ports: 5,
    description: '유선 연결 확장을 위한 장비.',
    icon: 'Cable',
  },
  {
    id: 'switch-24',
    name: '24포트 스위치',
    type: EquipmentType.SWITCH,
    cost: 150,
    ports: 24,
    description: '랙 장착형 관리 스위치.',
    icon: 'Grid',
  },
  // Devices
  {
    id: 'dev-laptop-1',
    name: '노트북 1대',
    type: EquipmentType.DEVICE,
    cost: 0, 
    deviceCount: 1,
    bandwidthUsage: 5,
    description: '일반 학생용 노트북.',
    icon: 'Laptop',
  },
  {
    id: 'dev-laptop-10',
    name: '노트북 10대 (세트)',
    type: EquipmentType.DEVICE,
    cost: 0,
    deviceCount: 10,
    bandwidthUsage: 50,
    description: '노트북 10대 묶음.',
    icon: 'Laptop',
  },
  {
    id: 'dev-printer',
    name: '네트워크 프린터',
    type: EquipmentType.DEVICE,
    cost: 200,
    deviceCount: 1,
    bandwidthUsage: 1,
    description: '공용 프린터.',
    icon: 'Printer',
  },
  {
    id: 'dev-iot',
    name: 'IoT 센서 번들',
    type: EquipmentType.DEVICE,
    cost: 50,
    deviceCount: 5,
    bandwidthUsage: 1,
    description: '스마트 전구 및 센서.',
    icon: 'Cpu',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "WAN의 약자는 무엇인가요?",
    options: ["Wide Area Network (광역 통신망)", "Wireless Area Network (무선 통신망)", "Web Access Node", "Wide Access Net"],
    correctIndex: 0,
    explanation: "WAN은 Wide Area Network의 약자로, 넓은 지리적 영역을 연결하는 통신망을 의미합니다."
  },
  {
    id: 2,
    question: "서로 다른 네트워크(예: 집과 인터넷) 사이에서 트래픽을 중계하는 주된 장비는 무엇인가요?",
    options: ["스위치 (Switch)", "허브 (Hub)", "라우터 (Router)", "리피터 (Repeater)"],
    correctIndex: 2,
    explanation: "라우터(Router)는 두 개 이상의 서로 다른 네트워크를 연결하고 데이터 패킷의 경로를 지정합니다."
  },
  {
    id: 3,
    question: "LAN 환경에서 스위치(Switch)의 주요 역할은 무엇인가요?",
    options: ["인터넷에 연결한다", "같은 네트워크 내의 기기들을 연결한다", "와이파이 신호를 증폭한다", "바이러스를 차단한다"],
    correctIndex: 1,
    explanation: "스위치는 같은 LAN(근거리 통신망) 내에 있는 컴퓨터, 프린터 등의 기기들을 서로 연결해주는 역할을 합니다."
  },
  {
    id: 4,
    question: "다음 중 더 최신이며 빠른 무선 표준은 무엇인가요?",
    options: ["WiFi 4 (802.11n)", "WiFi 5 (802.11ac)", "WiFi 6 (802.11ax)", "WiFi 3 (802.11g)"],
    correctIndex: 2,
    explanation: "WiFi 6 (802.11ax)는 보기 중 가장 최신 세대의 기술로, 더 빠른 속도와 효율성을 제공합니다."
  },
  {
    id: 5,
    question: "IP 주소란 무엇인가요?",
    options: ["컴퓨터의 물리적 위치", "네트워크상에서 기기를 식별하는 고유한 논리적 주소", "와이파이 비밀번호", "공유기 제조사 이름"],
    correctIndex: 1,
    explanation: "IP 주소는 컴퓨터 네트워크에 연결된 각 기기에 부여된 고유한 식별 번호입니다."
  },
  {
    id: 6,
    question: "일반적인 가정 네트워크에서 인터넷 신호를 가장 먼저 받아들이는 장비는?",
    options: ["프린터", "스위치", "모뎀/ONT", "노트북"],
    correctIndex: 2,
    explanation: "ISP(통신사)로부터 들어오는 신호는 모뎀이나 ONT를 통해 디지털 신호로 변환되어 들어옵니다."
  },
  {
    id: 7,
    question: "네트워크에서 '병목 현상(Bottleneck)'이란 무엇인가요?",
    options: ["케이블이 너무 많은 상태", "네트워크의 특정 구간이 느려 전체 속도를 저하시키는 현상", "검은색 공유기를 사용하는 것", "공유기를 바닥에 두는 것"],
    correctIndex: 1,
    explanation: "병목 현상은 시스템의 한 부분의 용량이 부족하여 전체 시스템의 성능을 제한하는 현상을 말합니다."
  },
  {
    id: 8,
    question: "인터넷 뱅킹을 할 때 가장 안전한 연결 방식은?",
    options: ["비밀번호 없는 공공 와이파이", "유선 연결 또는 보안된 개인 와이파이", "친구의 핫스팟", "카페 무료 와이파이"],
    correctIndex: 1,
    explanation: "암호화된 개인 네트워크(WPA3 등)나 유선 연결이 개방형 공공 와이파이보다 해킹 위험으로부터 훨씬 안전합니다."
  },
  {
    id: 9,
    question: "'IoT'는 무엇의 약자인가요?",
    options: ["Input of Technology", "Internet of Things (사물인터넷)", "Internal office Transfer", "Image on TV"],
    correctIndex: 1,
    explanation: "IoT는 Internet of Things의 약자로, 각종 사물에 센서와 통신 기능을 내장하여 인터넷에 연결하는 기술을 말합니다."
  },
  {
    id: 10,
    question: "컴퓨터 20대를 연결해야 하는데 공유기 포트가 4개뿐이라면 무엇이 필요한가요?",
    options: ["공유기 하나 더", "스위치 (Switch)", "모뎀", "더 굵은 케이블"],
    correctIndex: 1,
    explanation: "스위치를 사용하면 네트워크의 유선 연결 포트 수를 손쉽게 확장할 수 있습니다."
  },
];