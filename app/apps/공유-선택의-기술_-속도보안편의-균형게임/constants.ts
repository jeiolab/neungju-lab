import { Scenario, SharingMethod, QuizQuestion, CloudServiceType } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'video-edit',
    title: '동아리 영상 편집',
    description: '4K 고화질 영상 원본(50GB)을 편집자에게 전달해야 합니다. 마감까지 시간이 촉박합니다.',
    recommendedWeights: { speed: 9, security: 5, convenience: 4 }
  },
  {
    id: 'doc-collab',
    title: '수행평가 문서 협업',
    description: '조원 4명이 동시에 보고서를 작성하고 수정해야 합니다. 파일 버전 관리가 중요합니다.',
    recommendedWeights: { speed: 5, security: 4, convenience: 10 }
  },
  {
    id: 'poster-print',
    title: '축제 포스터 출력',
    description: '학생회실 PC에서 작업한 기밀 디자인 파일을 인쇄소 PC로 옮겨야 합니다. 바이러스 감염 우려가 있습니다.',
    recommendedWeights: { speed: 4, security: 9, convenience: 6 }
  }
];

export const SHARING_METHODS: SharingMethod[] = [
  {
    id: 'usb-3',
    name: 'USB 3.0/SSD (유선)',
    type: 'physical',
    stats: { speed: 9, security: 8, convenience: 4 },
    description: '물리적 연결로 대용량 전송에 유리하며 네트워크 해킹 위험이 적음.'
  },
  {
    id: 'cloud-drive',
    name: '클라우드 드라이브 (SaaS)',
    type: 'cloud',
    stats: { speed: 5, security: 6, convenience: 9 },
    description: '인터넷만 되면 어디서든 접근 가능, 동시 편집 및 링크 공유 최적화.'
  },
  {
    id: 'nas',
    name: '개인 NAS (사설 클라우드)',
    type: 'cloud',
    stats: { speed: 7, security: 7, convenience: 7 },
    description: '초기 설정이 어렵지만 용량 제한이 적고 보안 설정을 직접 관리 가능.'
  },
  {
    id: 'bluetooth',
    name: '블루투스 전송',
    type: 'wireless',
    stats: { speed: 2, security: 5, convenience: 8 },
    description: '별도 장비 없이 페어링만으로 소용량 파일 전송 가능. 속도는 느림.'
  },
  {
    id: 'nfc',
    name: 'NFC 태깅',
    type: 'wireless',
    stats: { speed: 1, security: 4, convenience: 10 },
    description: '접촉만으로 연결. 데이터 전송보다는 링크나 연락처 공유에 적합.'
  },
  {
    id: 'email',
    name: '이메일 첨부',
    type: 'cloud',
    stats: { speed: 4, security: 6, convenience: 8 },
    description: '전통적인 방식. 용량 제한이 있으며 보안은 평범함.'
  }
];

export const CLOUD_TYPES: CloudServiceType[] = [
  {
    id: 'iaas',
    name: 'IaaS (Infrastructure)',
    description: '서버, 스토리지 등 인프라만 빌려씀. OS부터 직접 관리.',
    examples: ['AWS EC2', 'Google Compute Engine']
  },
  {
    id: 'paas',
    name: 'PaaS (Platform)',
    description: '개발 환경(OS, DB 등)까지 제공. 코드만 짜면 됨.',
    examples: ['Google App Engine', 'Heroku']
  },
  {
    id: 'saas',
    name: 'SaaS (Software)',
    description: '완성된 소프트웨어를 바로 사용. 일반 사용자에게 친숙.',
    examples: ['Google Docs', 'Dropbox', 'Netflix']
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "대용량 영상(50GB)을 가장 빠르게 옆 사람에게 전달하는 방법은?",
    options: ["이메일 첨부", "블루투스", "외장 SSD (USB 3.0)", "NFC"],
    correctIndex: 2,
    explanation: "네트워크 대역폭 한계보다 유선 전송(USB 3.0/Thunderbolt)이 대용량 파일 전송 속도가 훨씬 빠릅니다."
  },
  {
    id: 2,
    question: "클라우드 서비스 중 'Google Docs' 처럼 사용자가 바로 쓰는 소프트웨어 형태는?",
    options: ["IaaS", "PaaS", "SaaS", "DaaS"],
    correctIndex: 2,
    explanation: "SaaS(Software as a Service)는 설치 없이 클라우드 환경에서 바로 사용하는 소프트웨어를 말합니다."
  },
  {
    id: 3,
    question: "공공 와이파이에서 기밀 문서를 공유할 때 가장 보안 위험이 큰 이유는?",
    options: ["속도가 느려서", "중간자 공격(패킷 스니핑) 위험", "데이터 요금이 나가서", "바이러스 자동 설치"],
    correctIndex: 1,
    explanation: "암호화되지 않은 공공 와이파이는 해커가 통신 내용을 엿보는 스니핑 공격에 취약합니다."
  },
  {
    id: 4,
    question: "블루투스(Bluetooth)의 특징으로 알맞지 않은 것은?",
    options: ["근거리 무선 통신이다", "전력 소모가 비교적 적다", "대용량 파일 전송에 최적화되어 있다", "페어링 과정이 필요하다"],
    correctIndex: 2,
    explanation: "블루투스는 속도가 느려 대용량 파일 전송에는 부적합하며, 주로 주변기기 연결이나 소용량 전송에 쓰입니다."
  },
  {
    id: 5,
    question: "여러 명이 동시에 문서를 수정해야 할 때 가장 적합한 편의성을 가진 방식은?",
    options: ["USB 돌려쓰기", "이메일 릴레이", "클라우드 협업 도구", "FTP 서버"],
    correctIndex: 2,
    explanation: "클라우드 협업 도구는 '동시성 제어'를 통해 여러 명이 실시간으로 편집할 수 있는 편의성을 제공합니다."
  }
];

export const BADGES = {
  BALANCE: '⚖️ 균형의 수호자',
  SECURITY: '🛡️ 철벽 보안관',
  SPEED: '⚡ 스피드 레이서',
  CONVENIENCE: '🛋️ 프로 귀차니스트',
  MASTER: '🎓 네트워크 마스터'
};
