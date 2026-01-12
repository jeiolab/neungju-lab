export interface App {
  id: string
  name: string
  description: string
  badge?: 'new' | 'popular' | 'default'
  component?: React.ComponentType
  url?: string
  category?: '정보' | '인공지능기초' | '방과후' | '교사도구'
  buttonText?: string
  // 메뉴 구조 기반 분류 - menuStructure.ts에 정의된 메뉴 ID 사용
  menuId?: string // 예: 'unit-1-1', 'ai-1', 'tool-1'
}

// 여기에 구글 AI 스튜디오에서 제작한 앱들을 추가하세요
export const apps: App[] = [
  {
    id: 'wireless-tech-detective',
    name: '무선기술 생활탐정',
    description: '고1 정보 교과 수준의 무선 통신 기술 선택 게임. 상황에 맞는 기술을 선택하고 점수를 획득하세요.',
    badge: 'new',
    category: '정보',
    buttonText: '수사 시작하기',
    menuId: 'unit-1-1', // I 컴퓨팅 시스템 > 1 네트워크
  },
  {
    id: 'smart-pairing',
    name: '지능형 짝꿍 배치 시스템',
    description: '교사용 지능형 짝꿍 배치 시스템입니다. 학생들을 랜덤하게 짝꿍으로 배치하고, 중복을 방지하며 결석생을 관리할 수 있습니다.',
    badge: 'new',
    category: '교사도구',
    buttonText: '실행하기',
    menuId: 'tool-1', // 교사도구 > 학급 관리
  },
  {
    id: 'network-device-guide',
    name: '네트워크 장비 도감',
    description: '네트워크 장비의 역할을 택배 시스템 비유로 쉽고 재미있게 배우는 인터랙티브 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-1', // I 컴퓨팅 시스템 > 1 네트워크
  },
  {
    id: 'master-ip-decoder',
    name: '마스터 IP 주소 해독기',
    description: 'IPv4 2진수-10진수 변환을 게임을 통해 쉽고 재미있게 배우는 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-1', // I 컴퓨팅 시스템 > 1 네트워크
  },
  {
    id: 'network-master',
    name: '유무선 네트워크 완전 정복',
    description: '유선 및 무선 네트워크 개념 학습, 시뮬레이션 게임, 그리고 퀴즈를 포함한 인터랙티브 교육 웹 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-1', // I 컴퓨팅 시스템 > 1 네트워크
  },
  {
    id: 'address-revolution',
    name: '주소 혁명 IPv4 vs IPv6',
    description: 'IPv4와 IPv6의 차이점을 시각적으로 배우는 고등학생을 위한 교육용 웹 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-1', // I 컴퓨팅 시스템 > 1 네트워크
  },
  {
    id: 'iot-builder-academy',
    name: 'IoT 빌더 아카데미',
    description: '드래그 앤 드롭으로 사물 인터넷(IoT) 시스템을 만들며 학습하는 인터랙티브 교육용 앱입니다. AI 기반 피드백 기능을 제공합니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-2', // I 컴퓨팅 시스템 > 2 사물 인터넷 시스템
  },
  {
    id: 'iot-project-planner',
    name: 'IoT 프로젝트 기획',
    description: '디자인 씽킹을 활용하여 실제 문제를 해결하는 IoT 솔루션을 기획하는 AI 기반 도구입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-2', // I 컴퓨팅 시스템 > 2 사물 인터넷 시스템
  },
  {
    id: 'iot-data-flow-simulator',
    name: 'IoT 시뮬레이터',
    description: 'IoT 시스템의 데이터 흐름(센서에서 처리 논리, 물리적 제어 장치까지)을 시각화하는 인터랙티브 교육 시뮬레이션입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-2', // I 컴퓨팅 시스템 > 2 사물 인터넷 시스템
  },
  {
    id: 'iot-explorer',
    name: 'IoT 스마트 시티',
    description: '스마트 시티로 업그레이드하며 사물 인터넷(IoT)을 배우는 인터랙티브 교육 게임입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-1-2', // I 컴퓨팅 시스템 > 2 사물 인터넷 시스템
  },
  {
    id: 'audio-compress-lab',
    name: '소리를 요리하다',
    description: '오디오 손실 압축, 주파수 마스킹, 샘플링 레이트 감소의 원리를 시각적, 청각적으로 학습할 수 있는 교육용 인터랙티브 도구입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '실험실 입장',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'data-cruncher-academy',
    name: '용량을 줄여라!',
    description: '데이터 압축의 원리를 실시간 시뮬레이션과 게임화된 퀴즈를 통해 배우는 인터랙티브 교육 플랫폼입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '학습 시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'image-pixel-lab',
    name: '이미지 픽셀 연구소',
    description: '실시간 비교, 줌 확대, 데이터 분석 기능을 통해 이미지 손실 압축 원리를 이해하는 대화형 교육 도구입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '연구 시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'huffman-forest',
    name: '허프만 코딩',
    description: '신비한 숲 테마로 허프만 코딩을 시각화를 통해 배우는 게임화된 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '탐험 시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'sns-detective',
    name: 'SNS 탐정',
    description: '비정형 데이터 타입(텍스트, 이미지)을 AI로 탐구하고 분석하는 인터랙티브 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '탐구 시작하기',
    menuId: 'unit-2-2', // II 데이터 > 2 빅데이터
  },
  {
    id: 'data-analyst-simulator',
    name: '데이터 정제소',
    description: '빅데이터 수집 및 전처리 파이프라인 시뮬레이션. 리뷰 수집, 이상치 탐지, 데이터 정제 등을 통해 데이터 분석가 역할을 체험해보세요.',
    badge: 'new',
    category: '정보',
    buttonText: '시뮬레이션 시작',
    menuId: 'unit-2-2', // II 데이터 > 2 빅데이터
  },
  {
    id: 'big-data-master',
    name: '빅데이터 서핑',
    description: '빅데이터 3V 개념 학습 게임. 데이터를 수집하고 분석하여 인턴에서 CTO까지 성장해보세요!',
    badge: 'new',
    category: '정보',
    buttonText: '탐험 시작',
    menuId: 'unit-2-2', // II 데이터 > 2 빅데이터
  },
  {
    id: 'scytale-cipher-lab',
    name: '스키테일 암호 연구소',
    description: '전치 암호(Transposition Cipher)를 탐구하는 대화형 교육 도구입니다. 3D 스키테일 모드, 박스 암호 모드, 퍼즐 게임을 지원하며 AI로 비밀 메시지를 생성할 수 있습니다.',
    badge: 'new',
    category: '정보',
    buttonText: '연구 시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'crypto-lab',
    name: '시크릿 메신저',
    description: '고등학생을 위한 정보 보안 교육 도구. 평문이 키를 만나 암호문으로 변하는 과정을 시각화합니다.',
    badge: 'new',
    category: '정보',
    buttonText: '실험 시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'algorithm-racing',
    name: '알고리즘 레이싱',
    description: '선형 탐색과 이진 탐색 알고리즘의 성능 차이를 시각적으로 비교하고 학습하는 인터랙티브 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '경주 시작하기',
    menuId: 'unit-3-1', // III 알고리즘과 프로그래밍 > 1 알고리즘
  },
  {
    id: 'dataviz-master',
    name: '차트의 신',
    description: '데이터의 특성에 맞는 적절한 차트를 선택하고 AI 피드백을 받으며 데이터 시각화를 배우는 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-2-2', // II 데이터 > 2 빅데이터
  },
  {
    id: 'cipher-master',
    name: '카이사르의 비밀 다이얼',
    description: '카이사르 암호와 치환 암호를 시뮬레이션, 퀴즈, 심볼 암호를 통해 배우는 인터랙티브 교육 도구입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'cryptolearn',
    name: '세 가지 자물쇠',
    description: '대칭키 암호화, 공개키 암호화, 해시 함수의 원리를 애니메이션으로 쉽게 배우는 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '학습 시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'data-tycoon',
    name: '편의점 사장님',
    description: '정형 데이터의 특성과 SQL 쿼리를 시뮬레이션하며 배우는 인터랙티브 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-2-2', // II 데이터 > 2 빅데이터
  },
  {
    id: 'crypto-hacker',
    name: '암호 방어 작전',
    description: '카이사르 암호, 스키테일 암호, 해시 함수를 활용하여 암호를 해독하는 게임화된 정보 보안 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '작전 시작하기',
    menuId: 'unit-2-1', // II 데이터 > 1 디지털 데이터의 압축과 암호화
  },
  {
    id: 'threat-database',
    name: '위협 데이터베이스',
    description: '사이버 보안 위협과 방어 메커니즘을 학습하는 대화형 교육 시뮬레이터입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-2', // V 디지털 문화 > 2 정보 보호와 보안
  },
  {
    id: 'copyright-sharing-world',
    name: '저작권과 공유의 세계',
    description: '저작권, 크리에이티브 커먼즈 라이선스(CCL), 공정 이용을 시뮬레이션과 퀴즈를 통해 학습하는 인터랙티브 교육 플랫폼입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-2', // V 디지털 문화 > 2 정보 보호와 보안
  },
  {
    id: 'info-security-guardian',
    name: '정보 보안 지킴이',
    description: '학생들을 위한 실전 정보 보안 도구 모음. 비밀번호 안전도 검사, 2단계 인증 시뮬레이션, 보안 퀴즈 등을 통해 보안 습관을 기르세요.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-2', // V 디지털 문화 > 2 정보 보호와 보안
  },
  {
    id: 'info-protection-castle',
    name: '정보 보호의 성',
    description: '성 방어 비유를 통해 CIA 삼각형(기밀성, 무결성, 가용성)을 학습하는 인터랙티브 교육 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-2', // V 디지털 문화 > 2 정보 보호와 보안
  },
  {
    id: 'my-ai-career-compass',
    name: '나의 AI 진로 나침반',
    description: '디지털 시대에 맞는 나만의 진로를 설계하고 새로운 직업을 탐색하는 인터랙티브 진로 가이드 앱',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-1', // V 디지털 문화 > 1 디지털 기술과 사회 변화
  },
  {
    id: 'digital-detective',
    name: '디지털 탐정: 진실을 찾아라',
    description: '디지털 리터러시 함양을 위한 인터랙티브 탐정 시뮬레이션 게임. 가짜 뉴스, 저작권, 사이버 윤리를 흥미로운 사건 해결 과정을 통해 학습합니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-1', // V 디지털 문화 > 1 디지털 기술과 사회 변화
  },
  {
    id: 'future-farm-tycoon',
    name: '미래 농장 타이쿤',
    description: '디지털 기술(빅데이터, 센서, AI)을 활용한 스마트 팜 경영 시뮬레이션 웹 앱입니다.',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-1', // V 디지털 문화 > 1 디지털 기술과 사회 변화
  },
  {
    id: 'smart-life',
    name: '스마트 라이프',
    description: '디지털 기술이 일상생활에 미치는 긍정적 영향을 체험하는 고등학교 교육용 웹 앱',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-1', // V 디지털 문화 > 1 디지털 기술과 사회 변화
  },
  {
    id: 'job-time-machine',
    name: '직업 타임머신',
    description: '과거와 미래의 직업 변화를 탐구하고 미래를 설계하는 인터랙티브 학습 앱',
    badge: 'new',
    category: '정보',
    buttonText: '시작하기',
    menuId: 'unit-5-1', // V 디지털 문화 > 1 디지털 기술과 사회 변화
  },
  // 여기에 더 많은 앱들을 추가하세요
]

