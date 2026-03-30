import { Job, QuizQuestion, TheoryCard, CaseStudy } from './types';
import { Briefcase, Activity, Zap, TrendingUp, Shield, Heart } from 'lucide-react';

export const JOB_DATABASE: Job[] = [
  { id: 'j1', title: 'AI 윤리 전문가', category: 'IT/Tech', description: '인공지능의 윤리적 판단 기준을 설계하고 감수합니다.', future: 10, stability: 6, interest: 8, skills: ['비판적 사고', '기술 이해'] },
  { id: 'j2', title: '데이터 분석가', category: 'IT/Tech', description: '빅데이터를 분석하여 비즈니스 인사이트를 도출합니다.', future: 9, stability: 7, interest: 7, skills: ['수리 논리', '프로그래밍'] },
  { id: 'j3', title: '스마트팜 운영자', category: 'Agriculture', description: 'ICT 기술을 활용해 농작물 재배 환경을 제어합니다.', future: 8, stability: 8, interest: 6, skills: ['자연 친화', '기기 조작'] },
  { id: 'j4', title: '디지털 헬스케어 코치', category: 'Health', description: '웨어러블 기기 데이터를 기반으로 건강 관리를 돕습니다.', future: 9, stability: 7, interest: 8, skills: ['대인 관계', '데이터 해석'] },
  { id: 'j5', title: '공무원', category: 'Public', description: '국가 또는 지방자치단체의 사무를 맡아봅니다.', future: 4, stability: 10, interest: 4, skills: ['행정력', '규범 준수'] },
  { id: 'j6', title: '학교 교사', category: 'Education', description: '학생들을 가르치고 지도합니다.', future: 5, stability: 9, interest: 7, skills: ['교육학', '소통'] },
  { id: 'j7', title: '유튜버/크리에이터', category: 'Media', description: '동영상 콘텐츠를 기획, 제작하여 공유합니다.', future: 7, stability: 2, interest: 10, skills: ['창의성', '표현력'] },
  { id: 'j8', title: '로봇 수리 전문가', category: 'Engineering', description: '산업용 및 가정용 로봇을 유지보수합니다.', future: 9, stability: 8, interest: 7, skills: ['기계 공학', '문제 해결'] },
  { id: 'j9', title: '가상현실(VR) 디자이너', category: 'Design', description: '가상 공간과 캐릭터, 환경을 디자인합니다.', future: 9, stability: 5, interest: 9, skills: ['공간 감각', '그래픽 툴'] },
  { id: 'j10', title: '신재생 에너지 전문가', category: 'Environment', description: '친환경 에너지 생산 시스템을 연구하고 관리합니다.', future: 10, stability: 8, interest: 6, skills: ['환경 인식', '공학 지식'] },
  { id: 'j11', title: '금융 공학자', category: 'Finance', description: '수학적 모델을 이용해 금융 상품을 개발합니다.', future: 7, stability: 7, interest: 5, skills: ['수학', '경제 관념'] },
  { id: 'j12', title: '사회복지사', category: 'Welfare', description: '사회적 약자를 돕고 복지 서비스를 연결합니다.', future: 6, stability: 7, interest: 8, skills: ['봉사 정신', '공감 능력'] },
  { id: 'j13', title: '웹소설 작가', category: 'Arts', description: '온라인 플랫폼에 소설을 연재합니다.', future: 6, stability: 2, interest: 9, skills: ['스토리텔링', '끈기'] },
  { id: 'j14', title: '정보보안 전문가', category: 'IT/Tech', description: '해킹과 바이러스로부터 시스템을 보호합니다.', future: 9, stability: 8, interest: 7, skills: ['윤리 의식', '보안 기술'] },
  { id: 'j15', title: '드론 조종사', category: 'Transport', description: '드론을 원격 조종하여 촬영, 배송, 방제 등을 수행합니다.', future: 8, stability: 5, interest: 8, skills: ['공간 지각', '기기 조작'] },
  { id: 'j16', title: '노년 플래너', category: 'Service', description: '행복한 노후 생활을 위한 전문 상담을 제공합니다.', future: 8, stability: 6, interest: 7, skills: ['경청', '상담'] },
  { id: 'j17', title: '3D 프린팅 전문가', category: 'Manufacturing', description: '3D 도면을 제작하고 출력물을 생산합니다.', future: 7, stability: 6, interest: 8, skills: ['조형 감각', '설계'] },
  { id: 'j18', title: '변호사', category: 'Law', description: '법률 사건 당사자를 대리하고 법률 상담을 합니다.', future: 6, stability: 8, interest: 6, skills: ['논리력', '암기력'] },
  { id: 'j19', title: '의사', category: 'Medical', description: '환자의 질병을 진단하고 치료합니다.', future: 7, stability: 10, interest: 7, skills: ['책임감', '전문 지식'] },
  { id: 'j20', title: '간호사', category: 'Medical', description: '의사를 보조하고 환자를 돌봅니다.', future: 7, stability: 9, interest: 6, skills: ['배려', '체력'] },
  { id: 'j21', title: '물리치료사', category: 'Medical', description: '신체 기능을 회복시키기 위한 재활 치료를 합니다.', future: 8, stability: 8, interest: 6, skills: ['인체 이해', '서비스'] },
  { id: 'j22', title: '요리사', category: 'Food', description: '음식을 조리하고 메뉴를 개발합니다.', future: 5, stability: 5, interest: 9, skills: ['미각', '손재주'] },
  { id: 'j23', title: '프로게이머', category: 'Sports', description: '게임 대회에 참가하여 경쟁합니다.', future: 5, stability: 1, interest: 10, skills: ['순발력', '전략'] },
  { id: 'j24', title: '회계사', category: 'Finance', description: '개인이나 기업의 재무 상태를 감시하고 보고합니다.', future: 5, stability: 8, interest: 4, skills: ['수리력', '꼼꼼함'] },
];

export const THEORY_CARDS: TheoryCard[] = [
  { title: '변화하는 직업 세계', content: '평생 직장의 개념이 사라지고, 평생 직업의 시대로 변화하고 있습니다. 기술 발전 속도가 빨라지며 적응력이 중요해졌습니다.', icon: 'Zap' },
  { title: '나만의 기준 세우기', content: '남들이 좋다는 직업이 아닌, 나의 가치관(워라밸, 성취감, 안정성 등)에 맞는 기준이 필요합니다.', icon: 'Shield' },
  { title: '트레이드오프 이해', content: '모든 것을 다 가질 순 없습니다. 안정성이 높으면 변화가 적을 수 있고, 흥미가 높으면 불안정할 수 있음을 인정해야 합니다.', icon: 'Activity' },
  { title: '디지털 리터러시', content: '어떤 직업을 선택하든 디지털 도구를 활용하는 능력은 기본 소양이 되었습니다.', icon: 'TrendingUp' },
  { title: '창직의 시대', content: '존재하지 않는 직업을 자신의 역량을 조합하여 새롭게 만들어낼 수 있습니다.', icon: 'Briefcase' },
  { title: 'N잡러와 부캐', content: '하나의 직업에 얽매이지 않고 다양한 정체성을 가지고 수익을 창출하는 시대입니다.', icon: 'Heart' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  { id: 1, question: '다음 중 디지털 전환으로 인해 중요성이 커진 역량이 아닌 것은?', options: ['단순 반복 작업 능력', '데이터 문해력', '협업 능력', '디지털 도구 활용 능력'], correctIndex: 0, explanation: '단순 반복 작업은 AI나 로봇으로 대체될 가능성이 높습니다.', difficulty: 'easy' },
  { id: 2, question: '직업 선택 시 고려해야 할 "트레이드오프"의 의미는?', options: ['모든 장점을 다 취하는 것', '하나를 얻으면 다른 하나를 잃을 수 있음을 이해하는 것', '가장 인기 있는 직업을 고르는 것', '직업을 자주 바꾸는 것'], correctIndex: 1, explanation: '트레이드오프는 상충 관계를 의미합니다.', difficulty: 'easy' },
  { id: 3, question: '다음 중 "창직"에 대한 설명으로 옳은 것은?', options: ['기존에 있는 직업 중 하나를 고르는 것', '새로운 직업이나 직무를 스스로 만들어내는 활동', '창업을 해서 사장이 되는 것', '예술 활동만 하는 것'], correctIndex: 1, explanation: '창직(Job Creation)은 자신의 역량으로 새로운 직무를 개척하는 것입니다.', difficulty: 'medium' },
  { id: 4, question: '긱 이코노미(Gig Economy)의 특징은?', options: ['평생 고용 보장', '정규직 위주의 고용', '단기적이고 유연한 계약 형태', '엄격한 출퇴근 시간'], correctIndex: 2, explanation: '긱 이코노미는 필요에 따라 임시로 계약을 맺는 경제 형태입니다.', difficulty: 'medium' },
  { id: 5, question: '미래 사회에서 "소프트 스킬"이 강조되는 이유는?', options: ['AI가 하드 스킬을 대체하기 쉽기 때문에', '코딩이 쉬워져서', '기계 조작이 중요해서', '컴퓨터가 감정을 가질 수 있어서'], correctIndex: 0, explanation: '소통, 공감, 창의성 등 인간 고유의 소프트 스킬은 AI가 대체하기 어렵습니다.', difficulty: 'hard' },
];

export const CASE_STUDIES: CaseStudy[] = [
  { title: '의료 분야의 AI', domain: 'Medical', description: '왓슨 등의 AI가 방대한 의료 데이터를 분석하여 의사의 진단을 보조하고, 개인 맞춤형 치료법을 제안합니다.', tech: 'AI 진단 보조' },
  { title: '스마트 스포츠', domain: 'Sports', description: '선수의 움직임을 센서로 분석하여 부상을 방지하고, 경기력을 향상시키는 코칭 데이터를 제공합니다.', tech: 'IoT 센서, 모션 캡처' },
  { title: '제조업의 디지털 트윈', domain: 'Manufacturing', description: '가상 공간에 실제 공장을 똑같이 구현하여 시뮬레이션함으로써 효율을 높이고 사고를 예방합니다.', tech: '디지털 트윈' },
  { title: '푸드테크와 로봇 셰프', domain: 'Food', description: '정확한 레시피대로 요리하는 로봇 팔과 3D 푸드 프린터가 개인 맞춤형 식사를 제공합니다.', tech: '로보틱스, 3D 프린팅' },
];