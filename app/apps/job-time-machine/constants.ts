import { JobCard, JobType, QuizItem, SkillData } from './types';

export const JOB_CARDS: JobCard[] = [
  {
    id: 1,
    title: '버스 안내양',
    type: JobType.PAST,
    description: '과거 버스 요금을 받고 승하차를 도왔던 직업입니다. 자동 요금 결제 시스템 도입으로 사라졌습니다.',
    imageKeyword: 'bus'
  },
  {
    id: 2,
    title: '프롬프트 엔지니어',
    type: JobType.FUTURE,
    description: 'AI에게 최적의 질문을 던져 원하는 결과를 얻어내는 전문가입니다. AI 시대의 새로운 직업입니다.',
    imageKeyword: 'computer'
  },
  {
    id: 3,
    title: '전화 교환원',
    type: JobType.PAST,
    description: '전화 회선을 수동으로 연결해주던 직업입니다. 자동 교환 시스템(전자식 교환기)으로 대체되었습니다.',
    imageKeyword: 'telephone'
  },
  {
    id: 4,
    title: '드론 조종사',
    type: JobType.FUTURE,
    description: '드론을 조종하여 촬영, 배송, 농업, 군사 등 다양한 분야에서 활동하는 전문가입니다.',
    imageKeyword: 'drone'
  },
  {
    id: 5,
    title: '활판 인쇄공',
    type: JobType.PAST,
    description: '활자를 하나하나 조판하여 인쇄하던 기술자입니다. 디지털 인쇄 기술의 발달로 역사 속으로 사라졌습니다.',
    imageKeyword: 'print'
  },
  {
    id: 6,
    title: '인공지능 윤리 전문가',
    type: JobType.FUTURE,
    description: 'AI가 인간의 윤리적 가치를 준수하도록 감시하고 가이드라인을 제시하는 직업입니다.',
    imageKeyword: 'justice'
  },
  {
    id: 7,
    title: '엘리베이터 안내원',
    type: JobType.PAST,
    description: '백화점이나 고층 빌딩에서 엘리베이터 버튼을 눌러주고 안내하던 직업입니다.',
    imageKeyword: 'elevator'
  },
  {
    id: 8,
    title: '스마트팜 전문가',
    type: JobType.FUTURE,
    description: 'ICT 기술을 농업에 접목하여 최적의 생육 환경을 제어하고 생산성을 높이는 전문가입니다.',
    imageKeyword: 'farm'
  }
];

export const QUIZ_DATA: QuizItem[] = [
  { id: 1, chosung: 'ㅂㄷㅇㅌ', answer: '빅데이터', hint: '방대한 양의 정보' },
  { id: 2, chosung: 'ㅁㅌㅂㅅ', answer: '메타버스', hint: '가상 초월 세계' },
  { id: 3, chosung: 'ㅈㅇㅈㅎ', answer: '자율주행', hint: '운전자 없는 자동차' },
  { id: 4, chosung: 'ㄹㅂㄱㅎ', answer: '로봇공학', hint: '기계 인간을 만드는 학문' },
  { id: 5, chosung: 'ㅂㄹㅊㅇ', answer: '블록체인', hint: '가상 화폐의 핵심 기술' },
];

export const SKILL_DATA: SkillData[] = [
  { subject: '창의성', A: 95, fullMark: 100 },
  { subject: '비판적 사고', A: 85, fullMark: 100 },
  { subject: '복합 문제 해결', A: 90, fullMark: 100 },
  { subject: '협업 능력', A: 80, fullMark: 100 },
  { subject: '감성 지능', A: 75, fullMark: 100 },
  { subject: '유연성', A: 70, fullMark: 100 },
];

export const TOP_JOBS = [
  { rank: 1, name: "AI 개발자 및 엔지니어", desc: "인공지능 알고리즘 및 시스템 개발" },
  { rank: 2, name: "정보보안 전문가", desc: "디지털 자산 및 네트워크 보호" },
  { rank: 3, name: "친환경 에너지 전문가", desc: "지속 가능한 에너지 솔루션 연구" },
  { rank: 4, name: "디지털 헬스케어 전문가", desc: "IT 기술을 활용한 건강 관리 서비스" },
  { rank: 5, name: "메타버스 크리에이터", desc: "가상 공간 내 콘텐츠 및 경험 설계" }
];
