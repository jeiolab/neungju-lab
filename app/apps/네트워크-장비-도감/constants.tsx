import { Network, Router, Share2, CreditCard } from 'lucide-react';
import { DeviceInfo, SimulationLevel } from './types';

export const DEVICES: DeviceInfo[] = [
  {
    id: 'nic',
    name: 'NIC (랜카드)',
    role: '장치 연결 인터페이스',
    metaphor: '집 대문 (House Gate)',
    description: '컴퓨터가 네트워크 세계로 나가는 첫 번째 관문입니다. 데이터(택배)를 주고받을 수 있게 해줍니다.',
    techKey: '물리적 연결',
    icon: CreditCard,
    color: 'text-emerald-600 bg-emerald-100 border-emerald-200'
  },
  {
    id: 'hub',
    name: 'Hub (허브)',
    role: '단순 연결 및 전송',
    metaphor: '확성기 (Megaphone)',
    description: '들어온 데이터를 연결된 모든 장치에 무식하게 소리쳐서 전송합니다. 시끄럽고(충돌), 보안이 약합니다.',
    techKey: '브로드캐스트',
    icon: Share2,
    color: 'text-amber-600 bg-amber-100 border-amber-200'
  },
  {
    id: 'switch',
    name: 'Switch (스위치)',
    role: '목적지 기반 전송',
    metaphor: '스마트 배달원 (Smart Postman)',
    description: '데이터의 수신자 주소(MAC)를 확인하고, 정확히 그 장치에만 배달합니다. 허브보다 똑똑하고 빠릅니다.',
    techKey: 'MAC 주소',
    icon: Network,
    color: 'text-blue-600 bg-blue-100 border-blue-200'
  },
  {
    id: 'router',
    name: 'Router (라우터)',
    role: '네트워크 간 연결',
    metaphor: '국제공항/네비게이션 (Gateway)',
    description: '서로 다른 네트워크(예: 우리 집과 인터넷 세상)를 연결합니다. 가장 빠른 길(경로)을 찾아줍니다.',
    techKey: 'IP 주소',
    icon: Router,
    color: 'text-indigo-600 bg-indigo-100 border-indigo-200'
  }
];

export const LEVELS: SimulationLevel[] = [
  {
    id: 1,
    title: 'Level 1: 옆 방 친구에게 파일 보내기',
    description: '같은 사무실(네트워크) 안에 있는 친구에게 비밀 편지를 보내려 합니다.',
    packetOrigin: '내 컴퓨터',
    packetDestination: '친구 컴퓨터',
    question: '다른 사람들에게 들키지 않고 정확하게 친구에게만 전달하려면 어떤 장비가 필요할까요?',
    options: [
      {
        deviceId: 'hub',
        label: 'Hub (허브)',
        isCorrect: false,
        feedback: '실패! 허브는 확성기처럼 모든 컴퓨터에 편지를 뿌렸습니다. 비밀이 새나갔네요.'
      },
      {
        deviceId: 'switch',
        label: 'Switch (스위치)',
        isCorrect: true,
        feedback: '성공! 스위치는 친구의 MAC 주소를 확인하고 정확히 배달했습니다.'
      }
    ]
  },
  {
    id: 2,
    title: 'Level 2: 해외 사이트 접속하기',
    description: '우리 집 네트워크를 벗어나 미국에 있는 구글 서버에 접속하려고 합니다.',
    packetOrigin: '내 컴퓨터 (한국)',
    packetDestination: '구글 서버 (미국)',
    question: '서로 다른 네트워크(외부)로 나가려면 길이 필요합니다. 누가 길을 안내해줄까요?',
    options: [
      {
        deviceId: 'switch',
        label: 'Switch (스위치)',
        isCorrect: false,
        feedback: '실패! 스위치는 우리 집 안에서만 길을 압니다. 외부로 나가는 길은 몰라요.'
      },
      {
        deviceId: 'router',
        label: 'Router (라우터)',
        isCorrect: true,
        feedback: '성공! 라우터가 IP 주소를 보고 외부 네트워크로 가는 최적의 경로를 안내했습니다.'
      }
    ]
  },
  {
    id: 3,
    title: 'Level 3: 인터넷 연결의 시작',
    description: '새로 산 컴퓨터를 인터넷에 연결하려고 합니다.',
    packetOrigin: '새 컴퓨터',
    packetDestination: '인터넷',
    question: '가장 먼저 컴퓨터에 무엇이 있어야 랜선(케이블)을 꽂고 신호를 보낼 수 있을까요?',
    options: [
      {
        deviceId: 'nic',
        label: 'NIC (랜카드)',
        isCorrect: true,
        feedback: '성공! 대문(NIC)이 있어야 데이터가 컴퓨터 밖으로 나갈 수 있습니다.'
      },
      {
        deviceId: 'hub',
        label: 'Hub (허브)',
        isCorrect: false,
        feedback: '실패! 허브는 연결 장치지만, 컴퓨터 자체에 통신 부품이 없으면 소용없습니다.'
      }
    ]
  }
];