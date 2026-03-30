import { DictionaryItem, QuizQuestion, SelectionOption } from './types';

export const INTEREST_OPTIONS: SelectionOption[] = [
  { id: 'art', label: '그림/디자인', icon: '🎨' },
  { id: 'writing', label: '글쓰기/스토리', icon: '✍️' },
  { id: 'animals', label: '동물/식물', icon: '🐾' },
  { id: 'law', label: '법률/규칙', icon: '⚖️' },
  { id: 'health', label: '건강/운동', icon: '💪' },
  { id: 'music', label: '음악/소리', icon: '🎵' },
  { id: 'space', label: '우주/과학', icon: '🚀' },
  { id: 'food', label: '요리/음식', icon: '🍳' },
];

export const TECH_OPTIONS: SelectionOption[] = [
  { id: 'ai', label: '인공지능 (AI)', icon: '🤖' },
  { id: 'vr', label: '가상현실 (VR/AR)', icon: '🥽' },
  { id: 'robot', label: '로봇공학', icon: '🦾' },
  { id: 'data', label: '빅데이터', icon: '📊' },
  { id: 'iot', label: '사물인터넷', icon: '🌐' },
  { id: 'blockchain', label: '블록체인', icon: '🔗' },
  { id: 'drone', label: '드론', icon: '🚁' },
  { id: 'bio', label: '바이오 테크', icon: '🧬' },
];

export const STYLE_OPTIONS: SelectionOption[] = [
  { id: 'solo', label: '혼자 깊게 집중하기', icon: '🧘' },
  { id: 'people', label: '사람들과 소통하기', icon: '🗣️' },
  { id: 'active', label: '몸을 움직이며 활동하기', icon: '🏃' },
];

export const JOB_DICTIONARY: DictionaryItem[] = [
  {
    title: '스마트 파머 (Smart Farmer)',
    category: '농업 + 데이터',
    description: '드론과 센서를 이용해 농작물의 상태를 실시간으로 확인하고, 최적의 환경을 데이터로 관리하는 농부입니다.',
    skills: ['데이터 분석', '재배 지식', '드론 조종']
  },
  {
    title: '리걸테크 전문가 (Legal Tech)',
    category: '법률 + AI',
    description: '방대한 법률 판례를 AI로 분석하여 변호사가 의뢰인을 더 잘 도울 수 있도록 지원하는 시스템을 만듭니다.',
    skills: ['법률 지식', 'AI 활용 능력', '논리적 사고']
  },
  {
    title: '디지털 장례 지도사',
    category: '인문 + 보안',
    description: '고인이 생전에 남긴 방대한 디지털 기록(SNS, 사진 등)을 정리하고, 유족의 뜻에 따라 안전하게 삭제하거나 보관합니다.',
    skills: ['보안 기술', '공감 능력', '윤리 의식']
  },
  {
    title: '메타버스 건축가',
    category: '디자인 + VR',
    description: '가상 공간 속의 건물, 공원, 도시를 설계합니다. 물리 법칙을 넘어선 상상력 넘치는 공간을 만듭니다.',
    skills: ['3D 모델링', '공간 지각력', '창의성']
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "AI가 발달하면 인간은 아무런 일도 하지 않게 될 것이다?",
    answer: false,
    explanation: "AI는 반복적인 일을 자동화하지만, 인간의 창의성, 공감, 복합적인 문제 해결 능력이 필요한 새로운 직업들이 계속 생겨납니다."
  },
  {
    id: 2,
    question: "미래에는 한 가지 직업만 평생 가지는 것이 일반적이다?",
    answer: false,
    explanation: "기술 변화 속도가 빨라지면서, 평생 동안 여러 번 직업을 바꾸거나 동시에 여러 직업(N잡)을 가지는 '포트폴리오 커리어'가 중요해집니다."
  },
  {
    id: 3,
    question: "할리우드 작가 파업 사례는 기술과 인간의 협업보다는 갈등만을 보여준다?",
    answer: false,
    explanation: "갈등으로 시작했지만, 결국 AI를 '창작의 도구'로 활용하되 인간 작가의 권리를 보호하는 방향으로 합의하며 '공존'의 규칙을 만들었습니다."
  },
  {
    id: 4,
    question: "소프트 스킬(공감, 소통 능력)은 미래 사회에서 더 중요해질 것이다?",
    answer: true,
    explanation: "기술적 역량은 AI가 도울 수 있지만, 사람의 마음을 이해하고 협업하는 '인간 고유의 역량'은 대체하기 어렵기 때문에 가치가 더 높아집니다."
  }
];

export const DAILY_HEADLINES = [
  "2035년, AI와 협업하는 '초개인화 교사' 급증",
  "화성 거주지 건설을 위한 '우주 3D 프린팅 전문가' 채용 시작",
  "뇌파로 드론 조종? '뉴로 인터페이스' 기술 상용화 임박",
  "반려 로봇과 감정 교류하는 '로봇 심리 상담사' 인기",
  "기후 위기 해결할 '탄소 포집 전문가', 유망 직종 1위 선정"
];