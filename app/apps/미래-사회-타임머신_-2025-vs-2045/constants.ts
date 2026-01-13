import { GameCard, ConceptType, SectorInfo, QuizQuestion } from './types';
import { Network, BrainCircuit, Shuffle, Home, Car, Stethoscope, Wallet } from 'lucide-react';

export const CONCEPTS = [
  {
    type: ConceptType.CONNECTIVITY,
    title: "초연결 (Hyper-connectivity)",
    desc: "사람, 사물, 공간 등 모든 것이 네트워크로 거미줄처럼 연결된 상태. 5G/6G 통신망이 핵심입니다.",
    icon: Network,
    color: "text-cyan-400"
  },
  {
    type: ConceptType.INTELLIGENCE,
    title: "초지능 (Hyper-intelligence)",
    desc: "연결된 데이터들이 인공지능(AI)을 통해 스스로 학습하고 판단하는 단계. AI가 인간의 지능을 뛰어넘는 특이점을 향해갑니다.",
    icon: BrainCircuit,
    color: "text-fuchsia-400"
  },
  {
    type: ConceptType.CONVERGENCE,
    title: "초융합 (Hyper-convergence)",
    desc: "현실과 가상, 산업과 산업, 기술과 기술의 경계가 사라지고 섞이는 현상. 메타버스와 디지털 트윈이 대표적입니다.",
    icon: Shuffle,
    color: "text-emerald-400"
  }
];

export const GAME_CARDS: GameCard[] = [
  {
    id: '1',
    title: '키오스크 주문',
    description: '식당에서 터치스크린 기계로 음식을 주문합니다.',
    era: '2025',
    concept: ConceptType.CONNECTIVITY,
    imageKeyword: 'kiosk'
  },
  {
    id: '2',
    title: '레벨 5 완전 자율주행',
    description: '운전대와 페달이 없는 자동차 안에서 잠을 자며 이동합니다.',
    era: '2045',
    concept: ConceptType.INTELLIGENCE,
    imageKeyword: 'autonomous_car'
  },
  {
    id: '3',
    title: '인공지능 판사',
    description: '방대한 법률 데이터를 분석하여 AI가 판결을 내립니다.',
    era: '2045',
    concept: ConceptType.INTELLIGENCE,
    imageKeyword: 'judge_gavel'
  },
  {
    id: '4',
    title: '스마트폰 뱅킹',
    description: '지문 인식으로 은행 업무를 처리하고 송금합니다.',
    era: '2025',
    concept: ConceptType.CONNECTIVITY,
    imageKeyword: 'smartphone'
  },
  {
    id: '5',
    title: '뇌-컴퓨터 인터페이스 (BCI)',
    description: '생각만으로 컴퓨터 커서를 움직이고 메시지를 보냅니다.',
    era: '2045',
    concept: ConceptType.CONVERGENCE,
    imageKeyword: 'brain'
  },
  {
    id: '6',
    title: '로봇 수술 보조',
    description: '의사가 조종간을 잡고 로봇 팔을 움직여 정교하게 수술합니다.',
    era: '2025',
    concept: ConceptType.CONVERGENCE,
    imageKeyword: 'surgery_robot'
  },
  {
    id: '7',
    title: '나노봇 치료',
    description: '눈에 보이지 않는 로봇이 혈관을 타고 다니며 암세포를 제거합니다.',
    era: '2045',
    concept: ConceptType.CONVERGENCE,
    imageKeyword: 'nanobot'
  },
  {
    id: '8',
    title: '생성형 AI 챗봇',
    description: '질문을 입력하면 AI가 텍스트, 코드, 이미지를 만들어줍니다.',
    era: '2025',
    concept: ConceptType.INTELLIGENCE,
    imageKeyword: 'chatbot'
  },
  {
    id: '9',
    title: '개인 맞춤형 인공장기',
    description: '3D 바이오 프린팅으로 내 몸에 딱 맞는 심장을 찍어냅니다.',
    era: '2045',
    concept: ConceptType.CONVERGENCE,
    imageKeyword: 'organ_printing'
  },
  {
    id: '10',
    title: '화상 회의',
    description: '모니터를 통해 서로의 얼굴을 보며 회의를 진행합니다.',
    era: '2025',
    concept: ConceptType.CONNECTIVITY,
    imageKeyword: 'video_conference'
  }
];

export const SECTOR_INFO: SectorInfo[] = [
  {
    id: 'home',
    sector: '가정 (Home)',
    current: 'IoT 가전 제어 (음성 인식 스피커)',
    future: '스마트 홈 로봇 집사 & 의류 자동 관리 시스템',
    icon: 'home'
  },
  {
    id: 'transport',
    sector: '교통 (Transport)',
    current: '전기차 & 부분 자율주행 (레벨 2~3)',
    future: 'UAM (도심 항공 모빌리티) & 하이퍼루프',
    icon: 'car'
  },
  {
    id: 'medical',
    sector: '의료 (Medical)',
    current: '원격 진료 시범 운영 & 웨어러블 건강 체크',
    future: '디지털 트윈 기반 예방 치료 & 수명 연장 기술',
    icon: 'stethoscope'
  },
  {
    id: 'finance',
    sector: '금융 (Finance)',
    current: '모바일 간편 결제 & 블록체인 초기 단계',
    future: '현금 없는 사회 & AI 기반 완전 자동 자산 관리',
    icon: 'wallet'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '초연결 사회'의 핵심 기술 인프라는 무엇인가요?",
    options: ["증기기관", "5G/6G 통신망", "내연기관", "활자 인쇄술"],
    correctIndex: 1,
    explanation: "초연결 사회는 모든 사물과 사람이 네트워크로 연결되는 사회로, 5G 및 6G와 같은 고속 통신망이 필수적입니다."
  },
  {
    id: 2,
    question: "2045년 미래 시나리오로 적절하지 않은 것은?",
    options: ["생각만으로 기기를 제어한다 (BCI)", "서울-부산을 20분만에 주파한다 (하이퍼루프)", "AI가 소설을 창작한다", "스마트폰 터치로만 문자를 보낸다"],
    correctIndex: 3,
    explanation: "스마트폰 터치 방식은 2025년 현재의 주류 기술이며, 미래에는 음성 인식이나 뇌파 제어(BCI) 등으로 대체될 가능성이 높습니다."
  },
  {
    id: 3,
    question: "'초융합'의 예시로 가장 적절한 것은?",
    options: ["단순 기계 조립", "메타버스 (가상과 현실의 결합)", "손편지 쓰기", "라디오 방송 청취"],
    correctIndex: 1,
    explanation: "초융합은 현실 세계와 가상 세계, 또는 서로 다른 기술 산업 간의 경계가 허물어지는 것을 의미합니다."
  }
];

export const RANKS = [
  { min: 0, title: "시간 여행 초보자" },
  { min: 30, title: "미래 호기심 대장" },
  { min: 60, title: "트렌드 분석가" },
  { min: 80, title: "2045년 예언가" },
  { min: 100, title: "노스트라다무스 급" }
];