import { Badge, QuizQuestion } from './types';

export const INITIAL_GATEWAY = "192.168.0.1";
export const CORRECT_SUBNET_PREFIX = "192.168.0";
export const PUBLIC_DNS = "8.8.8.8";

export const BADGES: Badge[] = [
  { id: 'dhcp_explorer', name: 'DHCP 탐험가', description: 'DHCP와 수동 IP의 차이를 이해했습니다.', icon: '🧭' },
  { id: 'dns_rescuer', name: 'DNS 구조대', description: '올바른 DNS 설정으로 인터넷을 복구했습니다.', icon: '🚑' },
  { id: 'security_guard', name: '보안관', description: '강력한 비밀번호로 네트워크를 보호했습니다.', icon: '🛡️' },
  { id: 'master_engineer', name: '네트워크 마스터', description: '모든 테스트 항목에서 만점을 받았습니다.', icon: '👑' },
];

export const CONCEPTS = [
  { title: "IP 주소", desc: "네트워크 상의 컴퓨터 식별 번호 (예: 192.168.0.10)" },
  { title: "게이트웨이", desc: "다른 네트워크(인터넷)로 나가는 출입구 (공유기 주소)" },
  { title: "DNS", desc: "도메인 이름(google.com)을 IP 주소로 바꿔주는 전화번호부" },
  { title: "DHCP", desc: "IP, 게이트웨이, DNS를 자동으로 할당해주는 프로토콜" },
  { title: "NAT", desc: "하나의 공인 IP를 여러 사설 IP가 공유해서 쓰게 해주는 기술" },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 사설 IP 대역에 해당하는 것은?",
    options: ["8.8.8.8", "192.168.0.15", "203.252.1.1", "1.1.1.1"],
    correctIndex: 1,
    explanation: "192.168.x.x 대역은 대표적인 사설 IP 대역입니다."
  },
  {
    id: 2,
    question: "웹사이트 접속 시 도메인을 IP로 변환해주는 서버는?",
    options: ["DHCP 서버", "WEB 서버", "DNS 서버", "FTP 서버"],
    correctIndex: 2,
    explanation: "DNS(Domain Name System)가 도메인 이름을 IP 주소로 변환합니다."
  },
  {
    id: 3,
    question: "공유기의 역할이 아닌 것은?",
    options: ["사설 IP 할당(DHCP)", "네트워크 보안(방화벽)", "모니터 화면 출력", "NAT를 통한 인터넷 공유"],
    correctIndex: 2,
    explanation: "모니터 화면 출력은 그래픽 카드의 역할입니다."
  },
  {
    id: 4,
    question: "와이파이 비밀번호 설정 시 가장 보안이 강력한 것은?",
    options: ["12345678", "password", "mywifi", "T3st@Wifi#2024"],
    correctIndex: 3,
    explanation: "영문 대소문자, 숫자, 특수문자를 혼합한 긴 비밀번호가 안전합니다."
  },
  {
    id: 5,
    question: "컴퓨터가 인터넷에 연결되려면 꼭 필요한 것이 아닌 것은?",
    options: ["IP 주소", "게이트웨이 주소", "프린터 드라이버", "서브넷 마스크"],
    correctIndex: 2,
    explanation: "프린터 드라이버는 인쇄를 위한 소프트웨어이며 인터넷 연결 필수 요소가 아닙니다."
  }
];

export const THOUGHT_SCENARIOS = [
  { id: 'urgent', text: "수행평가 제출 10분 전, 갑자기 인터넷이 끊겼습니다. DHCP가 동작하지 않는 것 같습니다. 어떻게 해결할까요?" },
  { id: 'printer', text: "옆 반 친구가 우리 반 프린터를 쓰고 싶어 합니다. 보안을 유지하면서 공유하려면 어떻게 해야 할까요?" },
  { id: 'slow', text: "인터넷은 되는데 특정 사이트 접속이 너무 느립니다. DNS 문제로 의심됩니다. 어떤 조치를 취할까요?" }
];