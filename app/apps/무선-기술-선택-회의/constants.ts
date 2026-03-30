import { TechProfile, Scenario, QuizQuestion, Badge, CareerCard } from './types';

export const TECH_PROFILES: TechProfile[] = [
  {
    id: 'WiFi',
    name: 'Wi-Fi',
    description: '높은 속도와 넓은 커버리지(수십 미터), 로컬 네트워크 접속에 최적.',
    distance: 80,
    speed: 90,
    security: 60,
    cost: 50,
    convenience: 70,
    typicalUses: ['영상 스트리밍', '대용량 파일 전송', '가정/학교 인터넷'],
  },
  {
    id: 'Bluetooth',
    name: 'Bluetooth',
    description: '저전력, 근거리(10m 이내) 주변기기 연결. 페어링 과정 필요.',
    distance: 30,
    speed: 50,
    security: 50,
    cost: 30,
    convenience: 80,
    typicalUses: ['무선 이어폰', '스마트워치', '마우스/키보드 연결'],
  },
  {
    id: 'NFC',
    name: 'NFC',
    description: '초근거리(10cm 이내) 비접촉 통신. 보안성이 높고 연결 절차가 간편.',
    distance: 5,
    speed: 40,
    security: 95,
    cost: 20,
    convenience: 90,
    typicalUses: ['버스 카드', '모바일 결제', '출입 통제'],
  },
  {
    id: 'RFID',
    name: 'RFID',
    description: '전파를 이용한 원거리 식별. 태그 가격이 저렴하며 물류 관리에 적합.',
    distance: 60,
    speed: 20,
    security: 40,
    cost: 10,
    convenience: 85,
    typicalUses: ['도서관 도난 방지', '하이패스', '물류 창고 재고 관리'],
  },
  {
    id: 'Cellular',
    name: 'Cellular (LTE/5G)',
    description: '기지국을 통한 광역 통신. 어디서나 연결되지만 데이터 비용 발생.',
    distance: 100,
    speed: 85,
    security: 70,
    cost: 90,
    convenience: 95,
    typicalUses: ['야외 인터넷', '긴급 구조 요청', '모바일 핫스팟'],
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: '학교 축제 매점 결제',
    description: '학생들이 붐비는 매점에서 스마트폰으로 빠르고 안전하게 간식을 결제해야 합니다.',
    requiredTech: 'NFC',
    idealAttributes: { security: 90, distance: 10 },
    contextHint: '결제 정보가 멀리 퍼지면 해킹 위험이 있고, 줄이 기니까 빨리 찍어야 해.',
  },
  {
    id: 's2',
    title: '동아리 발표 화면 공유',
    description: '내 노트북의 고화질 발표 영상을 교실 TV로 끊김 없이 전송해야 합니다.',
    requiredTech: 'WiFi',
    idealAttributes: { security: 50, distance: 60 },
    contextHint: '고화질 영상은 데이터 전송량이 많아. 블루투스로는 버벅거릴걸?',
  },
  {
    id: 's3',
    title: '도서관 도난 방지',
    description: '책에 부착하여 대출되지 않은 책이 문을 통과할 때 경보를 울려야 합니다.',
    requiredTech: 'RFID',
    idealAttributes: { security: 30, distance: 40 },
    contextHint: '배터리 없이 싸게 책마다 붙여야 하고, 문을 지날 때 인식되어야 해.',
  },
  {
    id: 's4',
    title: '무선 이어폰 음악 감상',
    description: '스마트폰과 연결하여 음악을 듣습니다. 배터리를 적게 써야 합니다.',
    requiredTech: 'Bluetooth',
    idealAttributes: { security: 40, distance: 20 },
    contextHint: '개인적인 연결(페어링)이 필요하고 전력 소모가 적어야 오래 듣지.',
  },
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: '다음 중 "페어링(Pairing)" 과정이 일반적으로 필요한 기술은?',
    options: ['RFID', 'NFC', 'Bluetooth', 'LTE'],
    correctAnswer: 2,
    explanation: '블루투스는 기기 간 보안 연결을 위해 처음에 서로를 등록하는 페어링 과정이 필요합니다.',
  },
  {
    id: 2,
    question: 'NFC의 특징으로 올바르지 않은 것은?',
    options: ['10cm 이내의 짧은 거리 통신', '높은 보안성', '교통카드에 활용', '수십 미터 거리의 데이터 전송'],
    correctAnswer: 3,
    explanation: 'NFC(Near Field Communication)는 이름 그대로 근거리 무선 통신 기술입니다.',
  },
  {
    id: 3,
    question: '사물인터넷(IoT) 환경에서 센서 데이터를 수집할 때 고려할 트레이드오프가 아닌 것은?',
    options: ['배터리 수명', '통신 거리', '센서의 색상', '데이터 전송 속도'],
    correctAnswer: 2,
    explanation: '기술적 특성인 배터리, 거리, 속도는 중요한 고려사항이지만 센서의 색상은 통신 성능과 무관합니다.',
  },
];

export const BADGES: Badge[] = [
  { id: 'b1', name: '신입 엔지니어', icon: '🎓', condition: '첫 번째 시나리오 완료' },
  { id: 'b2', name: '현명한 선택', icon: '⚖️', condition: '모든 시나리오 S등급 달성' },
  { id: 'b3', name: '보안 전문가', icon: '🛡️', condition: '보안 관련 퀴즈 정답' },
  { id: 'b4', name: 'IoT 마스터', icon: '🌐', condition: '모든 학습 탭 완료' },
];

export const CAREERS: CareerCard[] = [
  {
    title: '네트워크 엔지니어',
    description: '기업이나 학교의 통신망을 설계하고 구축합니다.',
    skills: ['TCP/IP', '라우팅', '보안 설정'],
  },
  {
    title: 'IoT 서비스 기획자',
    description: '사물을 연결하여 새로운 가치를 만드는 서비스를 구상합니다.',
    skills: ['UX 디자인', '데이터 분석', '하드웨어 이해'],
  },
  {
    title: '정보 보안 전문가',
    description: '무선 해킹 위협으로부터 시스템을 보호합니다.',
    skills: ['암호화', '모의 해킹', '취약점 분석'],
  },
];
