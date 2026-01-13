import { ConceptCard, CareerCard, QuizQuestion } from './types';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'c1',
    category: 'Personal',
    title: '스마트 헬스케어의 두 얼굴',
    content: 'IoT 센서가 당신의 생체 신호를 24시간 모니터링하여 질병을 예방합니다. 하지만 이 민감한 데이터가 보험사나 제3자에게 유출될 경우, 보험 가입 거부 등의 차별을 받을 수 있습니다.',
    quote: '데이터가 나를 살릴 수도 있지만, 나를 평가하는 도구가 될 수도 있다.',
    weakness: '프라이버시 역설 (Privacy Paradox)'
  },
  {
    id: 'c2',
    category: 'Social',
    title: '초연결 스마트 시티',
    content: '도시 전체가 연결되어 교통 체증과 에너지를 효율적으로 관리합니다. 그러나 중앙 시스템이 해킹당할 경우 도시 기능이 마비되는 대규모 재난이 발생할 수 있습니다.',
    quote: '편리함의 극대화는 곧 취약점의 중앙화를 의미할 수 있다.',
    weakness: '단일 실패 지점 (Single Point of Failure)'
  },
  {
    id: 'c3',
    category: 'Personal',
    title: '나보다 나를 더 잘 아는 냉장고',
    content: '식습관을 분석해 자동으로 식재료를 주문합니다. 편리하지만, 나의 소비 패턴과 생활 방식이 기업의 마케팅 수단으로 무방비하게 활용될 수 있습니다.',
    quote: '자동화된 선택은 때로 나의 자유 의지를 침해한다.',
    weakness: '알고리즘 편향 (Algorithmic Bias)'
  },
  {
    id: 'c4',
    category: 'Social',
    title: '자율주행과 윤리적 딜레마',
    content: 'IoT 기반 자율주행은 교통사고를 줄입니다. 하지만 사고가 불가피한 상황에서 인공지능이 누구를 보호할지 결정하는 윤리적 문제는 아직 해결되지 않았습니다.',
    quote: '기술은 책임을 질 수 없다. 책임은 오직 인간의 몫이다.',
    weakness: '트롤리 딜레마의 기술적 구현'
  }
];

export const CAREERS: CareerCard[] = [
  {
    id: 'job1',
    title: 'IoT 보안 전문가',
    description: '수십억 개의 연결된 기기를 해킹 위협으로부터 보호하고 안전한 통신 프로토콜을 설계합니다.',
    requiredSkills: ['네트워크 암호화', '침투 테스트', '보안 윤리 준수']
  },
  {
    id: 'job2',
    title: '스마트 시티 설계가',
    description: '도시의 데이터를 분석하여 교통, 에너지, 환경 문제를 해결하는 시스템을 기획합니다.',
    requiredSkills: ['빅데이터 분석', '도시 계획', '공공 정책 이해']
  },
  {
    id: 'job3',
    title: '디지털 헬스케어 코디네이터',
    description: '환자의 IoT 생체 데이터를 분석하여 맞춤형 건강 관리 플랜을 제공하고 의사를 보조합니다.',
    requiredSkills: ['생물학 기초', '데이터 해석', '공감적 소통']
  },
  {
    id: 'job4',
    title: 'IoT 윤리 컨설턴트',
    description: '기술 도입 시 발생할 수 있는 프라이버시 침해나 차별 문제를 진단하고 해결책을 제시합니다.',
    requiredSkills: ['기술 철학', '법규 이해', '논리적 사고']
  }
];

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 1,
    question: "IoT 기술의 핵심 구성 요소가 아닌 것은?",
    options: ["센서(Sensor)", "네트워크(Network)", "데이터 처리(Analytics)", "수동 조작(Manual Operation)"],
    correctAnswer: 3,
    explanation: "IoT는 사물들이 네트워크로 연결되어 자동으로 데이터를 주고받는 기술이므로, 지속적인 수동 조작은 핵심 요소와 거리가 있습니다."
  },
  {
    id: 2,
    question: "스마트 홈 기기를 사용할 때 보안 위험을 줄이는 가장 좋은 방법은?",
    options: ["기본 비밀번호 그대로 사용하기", "소프트웨어 업데이트 끄기", "강력한 비밀번호 설정 및 정기적 업데이트", "모든 데이터를 공개로 설정하기"],
    correctAnswer: 2,
    explanation: "IoT 보안 사고의 대부분은 기본 비밀번호 사용이나 업데이트 미비로 발생합니다."
  },
  {
    id: 3,
    question: "다음 중 IoT가 가져올 긍정적인 사회 변화로 보기 어려운 것은?",
    options: ["에너지 효율 최적화", "교통 사고 감소", "개인 프라이버시의 절대적 보장", "원격 의료 활성화"],
    correctAnswer: 2,
    explanation: "IoT는 데이터 수집을 전제로 하므로 프라이버시 침해 위험이 상존하며, 이는 해결해야 할 과제입니다."
  },
  {
    id: 4,
    question: "사물인터넷 시대에 '엣지 컴퓨팅(Edge Computing)'이 중요한 이유는?",
    options: ["데이터를 중앙 서버로만 보내기 위해", "데이터 처리 속도를 높이고 지연 시간을 줄이기 위해", "인터넷 연결을 끊기 위해", "센서 가격을 높이기 위해"],
    correctAnswer: 1,
    explanation: "엣지 컴퓨팅은 데이터를 발생 지점 근처에서 처리하여 실시간 반응 속도를 높이고 대역폭을 절약합니다."
  },
  {
    id: 5,
    question: "다음 중 IoT 기술이 적용된 '스마트 팩토리'의 특징은?",
    options: ["모든 공정을 사람이 직접 수기 기록한다", "기계 간 통신으로 공정을 자동 최적화한다", "인터넷 연결 없이 기계를 작동한다", "고장 난 후에만 수리한다"],
    correctAnswer: 1,
    explanation: "스마트 팩토리는 기계 간 통신(M2M)을 통해 실시간으로 공정을 모니터링하고 최적화합니다."
  }
];
