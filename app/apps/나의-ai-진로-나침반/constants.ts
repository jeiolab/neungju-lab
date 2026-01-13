import { InterestOption, TechOption, JobResult, QuizQuestion } from './types';

// Interests Data
export const INTERESTS: InterestOption[] = [
  { id: 'music', label: '음악', iconName: 'Music' },
  { id: 'sports', label: '운동', iconName: 'Activity' },
  { id: 'cooking', label: '요리', iconName: 'Utensils' },
  { id: 'art', label: '그림/디자인', iconName: 'Palette' },
  { id: 'writing', label: '글쓰기', iconName: 'PenTool' },
  { id: 'nature', label: '자연/동물', iconName: 'Trees' },
];

// Tech Data
export const TECHS: TechOption[] = [
  { id: 'ai', label: '인공지능(AI)', iconName: 'Brain' },
  { id: 'vr_ar', label: 'VR/AR', iconName: 'Goggles' },
  { id: 'bigdata', label: '빅데이터', iconName: 'Database' },
  { id: 'robot', label: '로봇공학', iconName: 'Bot' },
  { id: '3dprint', label: '3D 프린팅', iconName: 'Printer' },
  { id: 'iot', label: '사물인터넷(IoT)', iconName: 'Wifi' },
];

// Job Combination Logic Matrix
const JOB_DATABASE: Record<string, Record<string, JobResult>> = {
  music: {
    ai: {
      title: "AI 감성 작곡가",
      description: "인공지능을 활용해 사람들의 감정 상태나 상황에 딱 맞는 음악을 실시간으로 작곡하고 편곡합니다.",
      skills: ["음악 이론", "머신러닝 기초", "감성 데이터 분석"],
      iconName: "Headphones"
    },
    vr_ar: {
      title: "메타버스 사운드 디자이너",
      description: "가상 현실 공간에서 사용자 경험을 극대화하는 입체 음향과 효과음을 설계합니다.",
      skills: ["공간 음향학", "VR 플랫폼 이해", "사운드 엔지니어링"],
      iconName: "Speaker"
    },
    bigdata: {
      title: "음악 데이터 큐레이터",
      description: "수많은 청취 데이터를 분석하여 스트리밍 플랫폼의 추천 알고리즘을 설계하고 트렌드를 예측합니다.",
      skills: ["통계 분석", "음악 트렌드 이해", "알고리즘 설계"],
      iconName: "BarChart"
    },
    robot: {
      title: "로봇 악기 연주 감독",
      description: "인간이 연주하기 힘든 복잡한 곡을 연주하는 로봇 오케스트라를 기획하고 지휘합니다.",
      skills: ["로봇 제어 코딩", "지휘법", "기계 공학 기초"],
      iconName: "Music"
    },
  },
  sports: {
    ai: {
      title: "AI 스포츠 전력 분석가",
      description: "선수들의 경기 영상을 AI로 분석하여 승리 전략을 짜고 부상을 예측하는 시스템을 운용합니다.",
      skills: ["영상 데이터 분석", "스포츠 경기 규칙", "전략적 사고"],
      iconName: "Target"
    },
    vr_ar: {
      title: "e-스포츠 VR 트레이너",
      description: "가상현실 기술을 이용해 실제 경기와 유사한 환경을 제공하고 선수의 훈련을 돕습니다.",
      skills: ["VR 콘텐츠 제작", "운동 역학", "코칭 심리학"],
      iconName: "MonitorPlay"
    },
    bigdata: {
      title: "선수 건강 관리 데이터 전문가",
      description: "웨어러블 기기에서 수집된 생체 데이터를 분석하여 선수들의 최적 컨디션을 관리합니다.",
      skills: ["생체 데이터 해석", "건강 관리 지식", "데이터 시각화"],
      iconName: "HeartPulse"
    },
  },
  cooking: {
    '3dprint': {
      title: "3D 푸드 프린터 셰프",
      description: "3D 프린터를 이용해 기존에 없던 독창적인 모양과 식감의 요리를 디자인하고 출력합니다.",
      skills: ["3D 모델링", "식품 영양학", "재료 공학"],
      iconName: "Cake"
    },
    robot: {
      title: "스마트 키친 엔지니어",
      description: "로봇 팔이 요리하는 자동화 주방 시스템을 설계하고 레시피를 로봇 언어로 번역합니다.",
      skills: ["자동화 제어", "조리 프로세스 이해", "시스템 설계"],
      iconName: "ChefHat"
    },
    ai: {
      title: "AI 레시피 개발자",
      description: "식재료 조합 데이터를 AI로 분석하여 맛의 황금 비율을 찾아내고 새로운 맛을 창조합니다.",
      skills: ["맛 데이터 분석", "조리 과학", "창의적 사고"],
      iconName: "Search"
    }
  },
  art: {
    ai: {
      title: "생성형 AI 아티스트",
      description: "AI 도구와 협업하여 인간의 상상력을 넘어서는 새로운 화풍의 디지털 예술 작품을 만듭니다.",
      skills: ["프롬프트 엔지니어링", "미술사", "디지털 아트 툴"],
      iconName: "Image"
    },
    vr_ar: {
      title: "가상 갤러리 큐레이터",
      description: "메타버스 내에 미술관을 짓고, 관람객이 작품 속에 들어가는 듯한 전시 경험을 기획합니다.",
      skills: ["공간 디자인", "전시 기획", "스토리텔링"],
      iconName: "Box"
    },
    '3dprint': {
      title: "디지털 조형 디자이너",
      description: "복잡한 기하학적 구조를 가진 조형물을 컴퓨터로 설계하고 3D 프린팅으로 구현합니다.",
      skills: ["3D CAD", "조형 감각", "소재 활용 능력"],
      iconName: "PenTool"
    }
  },
  writing: {
    ai: {
      title: "AI 스토리텔링 디렉터",
      description: "AI 보조 작가와 함께 웹소설, 게임 시나리오의 방대한 세계관을 구축하고 관리합니다.",
      skills: ["세계관 설정", "AI 툴 활용", "문장력"],
      iconName: "BookOpen"
    },
    vr_ar: {
      title: "인터랙티브 시나리오 작가",
      description: "독자의 선택에 따라 VR 속 이야기가 달라지는 다중 결말형 실감 콘텐츠를 집필합니다.",
      skills: ["비선형 서사 구조", "게임 기획", "상상력"],
      iconName: "Type"
    }
  },
  nature: {
    iot: {
      title: "스마트 팜 농업 전문가",
      description: "IoT 센서로 농작물의 상태를 실시간 체크하고, 스마트폰으로 농장을 관리합니다.",
      skills: ["식물 재배학", "IoT 센서 이해", "데이터 모니터링"],
      iconName: "Sprout"
    },
    robot: {
      title: "생태 복원 로봇 운영자",
      description: "사람이 갈 수 없는 오염된 지역이나 깊은 숲속에 로봇을 보내 자연을 조사하고 복구합니다.",
      skills: ["환경 과학", "드론/로봇 조종", "지질학"],
      iconName: "Trees"
    }
  }
};

// Fallback Generator
export const getJobResult = (interestId: string, techId: string): JobResult => {
  const specific = JOB_DATABASE[interestId]?.[techId];
  if (specific) return specific;

  // Generic Logic based on tech
  const interestLabel = INTERESTS.find(i => i.id === interestId)?.label || '분야';
  const techLabel = TECHS.find(t => t.id === techId)?.label || '기술';

  return {
    title: `${interestLabel} X ${techLabel} 융합 전문가`,
    description: `${interestLabel} 분야의 전문 지식에 ${techLabel} 기술을 접목하여 기존의 문제를 해결하고 새로운 가치를 창출하는 혁신가입니다.`,
    skills: [`${interestLabel} 기초 지식`, `${techLabel} 활용 능력`, "융합적 사고력"],
    iconName: "Lightbulb"
  };
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "나는 평소에 새로운 앱이나 디지털 도구 사용법을 익히는 것이 즐겁다." },
  { id: 2, question: "궁금한 것이 생기면 인터넷 검색이나 AI에게 물어봐서 해결한다." },
  { id: 3, question: "코딩이나 데이터 분석이 미래에 중요하다고 생각한다." },
  { id: 4, question: "나의 관심사(취미)를 디지털 기술과 연결해보고 싶다는 생각을 해본 적이 있다." },
  { id: 5, question: "변화하는 미래 직업 세계에 대해 긍정적인 기대감을 가지고 있다." },
];