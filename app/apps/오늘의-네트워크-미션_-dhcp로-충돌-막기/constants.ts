import { Concept, QuizQuestion } from './types';
import { Network, Server, Router, Globe, ShieldCheck } from 'lucide-react';

export const CONCEPTS: Concept[] = [
  {
    id: 'ip',
    title: 'IP 주소 (Internet Protocol)',
    description: '네트워크 상의 집 주소입니다. 기기를 식별하고 통신하기 위해 꼭 필요한 고유 번호입니다. (예: 192.168.0.1)',
    iconName: 'Network'
  },
  {
    id: 'dns',
    title: 'DNS (Domain Name System)',
    description: '전화번호부 같은 역할입니다. 사람이 읽을 수 있는 도메인(google.com)을 IP 주소로 변환해줍니다.',
    iconName: 'Globe'
  },
  {
    id: 'dhcp',
    title: 'DHCP',
    description: '자동 주소 할당기입니다. 네트워크에 접속하는 기기에게 자동으로 IP, Subnet Mask, Gateway 등을 빌려줍니다.',
    iconName: 'Server'
  },
  {
    id: 'gateway',
    title: '게이트웨이 (Gateway)',
    description: '다른 네트워크(외부 인터넷)로 나가는 출입문입니다. 공유기가 보통 이 역할을 합니다.',
    iconName: 'Router'
  },
  {
    id: 'router',
    title: '라우터 (Router)',
    description: '데이터가 목적지까지 가는 최적의 경로를 찾아주는 교통경찰입니다. 서로 다른 네트워크를 연결합니다.',
    iconName: 'Router'
  }
];

// A pool of questions. Ideally, this would be larger.
export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: "새 스마트폰을 와이파이에 연결할 때, 일일이 IP를 입력하지 않아도 되는 이유는?",
    options: ["DNS 덕분에", "DHCP 덕분에", "게이트웨이 덕분에", "방화벽 덕분에"],
    correctIndex: 1,
    explanation: "DHCP(Dynamic Host Configuration Protocol)가 자동으로 IP 주소를 할당해주기 때문입니다.",
    difficulty: "easy",
    relatedConcept: "DHCP"
  },
  {
    id: 2,
    question: "www.naver.com을 입력했을 때 해당 서버의 IP 주소를 찾아주는 시스템은?",
    options: ["MAC 주소", "DHCP", "DNS", "TCP/IP"],
    correctIndex: 2,
    explanation: "DNS(Domain Name System)는 도메인 이름을 IP 주소로 변환해줍니다.",
    difficulty: "easy",
    relatedConcept: "DNS"
  },
  {
    id: 3,
    question: "DHCP를 끄고 수동으로 IP를 설정할 때 발생할 수 있는 가장 큰 문제는?",
    options: ["인터넷 속도 저하", "IP 주소 충돌", "전력 소모 증가", "바이러스 감염"],
    correctIndex: 1,
    explanation: "이미 사용 중인 IP를 실수로 다른 기기에 입력하면 IP 충돌이 발생하여 통신이 불가능해집니다.",
    difficulty: "medium",
    relatedConcept: "DHCP"
  },
  {
    id: 4,
    question: "외부 인터넷으로 나가기 위해 반드시 거쳐야 하는 장비의 IP 주소는?",
    options: ["서브넷 마스크", "기본 게이트웨이", "DNS 서버", "루프백 주소"],
    correctIndex: 1,
    explanation: "게이트웨이는 내부 네트워크에서 외부 네트워크로 나가는 출입문 역할을 합니다.",
    difficulty: "medium",
    relatedConcept: "게이트웨이"
  },
  {
    id: 5,
    question: "다음 중 네트워크 계층의 장비가 아닌 것은?",
    options: ["라우터", "L3 스위치", "허브", "게이트웨이"],
    correctIndex: 2,
    explanation: "허브는 물리 계층(L1) 장비입니다. 라우터나 L3 스위치는 네트워크 계층(L3) 장비입니다.",
    difficulty: "hard",
    relatedConcept: "라우터"
  },
  {
    id: 6,
    question: "Ping 명령어를 사용하는 주된 목적은?",
    options: ["IP 할당 받기", "네트워크 연결 상태 확인", "도메인 구매", "웹사이트 해킹"],
    correctIndex: 1,
    explanation: "Ping은 대상 호스트와 통신이 가능한지 확인하고 응답 시간을 측정하는 도구입니다.",
    difficulty: "easy",
    relatedConcept: "Ping"
  },
  {
    id: 7,
    question: "DHCP 서버가 고장나면 발생하는 현상은?",
    options: ["기존 연결된 기기도 즉시 끊긴다", "새로운 기기가 IP를 할당받지 못한다", "모니터 화면이 꺼진다", "키보드 입력이 안 된다"],
    correctIndex: 1,
    explanation: "DHCP 서버가 죽으면 임대 시간이 만료되거나 새로 접속하려는 기기가 IP를 받지 못해 인터넷이 안 됩니다.",
    difficulty: "medium",
    relatedConcept: "DHCP"
  },
  {
    id: 8,
    question: "IP 주소 '192.168.0.1'은 주로 어떤 용도로 쓰이나요?",
    options: ["전 세계 공용 IP", "사설 네트워크(공유기 등) 내부 IP", "미국 국방성 IP", "없는 주소"],
    correctIndex: 1,
    explanation: "192.168.x.x 대역은 사설 IP 대역으로, 가정이나 회사 내부망에서 주로 사용됩니다.",
    difficulty: "medium",
    relatedConcept: "IP"
  },
  {
    id: 9,
    question: "카페에서 100명이 동시에 와이파이를 쓰려면 무엇이 가장 효율적인가?",
    options: ["모두 수동 IP 설정", "DHCP 사용 및 충분한 IP 대역 확보", "DNS 서버 끄기", "게이트웨이 제거"],
    correctIndex: 1,
    explanation: "많은 기기가 수시로 접속/해제되는 환경에서는 DHCP가 필수적이며, IP 풀(Pool)이 넉넉해야 합니다.",
    difficulty: "hard",
    relatedConcept: "DHCP"
  },
  {
    id: 10,
    question: "DHCP Lease Time(임대 시간)이 짧을 때의 장점은?",
    options: ["IP 주소 회전율이 좋아진다", "인터넷이 더 빨라진다", "보안이 완벽해진다", "서버 부하가 줄어든다"],
    correctIndex: 0,
    explanation: "임대 시간이 짧으면 사용하지 않는 IP를 빨리 회수하여 다른 기기에게 줄 수 있어 효율적입니다.",
    difficulty: "hard",
    relatedConcept: "DHCP"
  }
];

export const DAILY_MISSIONS = [
  "새 노트북이 교실 와이파이에 못 들어감. DHCP를 켤까? 왜?",
  "우리 집 공유기가 자꾸 끊김. IP 충돌일까? 확인해보자.",
  "친구 폰은 되는데 내 폰만 인터넷이 안됨. IP 설정을 확인해볼까?",
  "PC실 컴퓨터 30대, 일일이 IP 입력하다 지침. 해결책은?",
  "해외 여행 가서 호텔 와이파이 연결 시 주의할 점은?"
];
