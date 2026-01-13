import { Concept, QuizQuestion, Badge, UserState } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'c1',
    title: '정보의 가치 증가',
    definition: '지식과 정보가 자본이나 노동보다 더 중요한 가치를 창출하는 핵심 자원이 되는 현상',
    keywords: ['지식 정보 사회', '부가가치', '빅데이터'],
    example: '급식 메뉴 앱을 만들어 학생들이 좋아하는 메뉴 패턴을 분석해 매점에 건의하여 매출을 올림.',
    misconception: {
      myth: '정보는 많을수록 무조건 좋다?',
      fact: '아닙니다. 가공되지 않은 단순한 데이터는 가치가 낮으며, 유의미하게 가공된 정보만이 높은 가치를 가집니다.'
    },
    checkQuestion: {
      question: '단순한 사실의 나열인 데이터가 가치를 가지려면 무엇이 필요한가요?',
      answer: '목적에 맞게 가공(분석)되어야 함'
    }
  },
  {
    id: 'c2',
    title: '네트워크 소통의 발달',
    definition: '시간과 공간의 제약을 넘어 전 세계가 실시간으로 연결되고 상호작용하는 구조',
    keywords: ['시공간 초월', 'SNS', '쌍방향 소통'],
    example: '미국에 있는 펜팔 친구와 실시간 영상 통화로 수행평가 과제를 함께 논의함.',
    misconception: {
      myth: '온라인 소통은 오프라인보다 진정성이 없다?',
      fact: '아닙니다. 매체가 다를 뿐, 관심사를 기반으로 더 깊고 지속적인 관계를 맺을 수도 있습니다.'
    },
    checkQuestion: {
      question: '전통적 매체(TV)와 달리 디지털 네트워크 소통의 가장 큰 특징은?',
      answer: '쌍방향성 (누구나 정보를 생산하고 유통 가능)'
    }
  },
  {
    id: 'c3',
    title: '맞춤형 서비스의 확산',
    definition: '개인의 데이터(취향, 위치 등)를 분석하여 이용자에게 최적화된 정보를 제공하는 방식',
    keywords: ['알고리즘', '추천 시스템', '개인화'],
    example: '유튜브가 내가 어제 본 게임 영상과 관련된 공략 영상을 자동으로 홈 화면에 띄워줌.',
    misconception: {
      myth: '추천 알고리즘은 항상 객관적이다?',
      fact: '아닙니다. 필터 버블(확증 편향)에 갇혀 내가 좋아하는 정보만 보게 될 위험이 있습니다.'
    },
    checkQuestion: {
      question: '맞춤형 서비스가 가져올 수 있는 부정적 효과로, 편향된 정보만 접하는 현상은?',
      answer: '필터 버블'
    }
  },
  {
    id: 'c4',
    title: '사이버 범죄와 보안 위협',
    definition: '비대면성과 익명성을 악용하여 디지털 공간에서 발생하는 불법 행위와 개인정보 유출 위험',
    keywords: ['익명성', '해킹/피싱', '저작권 침해'],
    example: '친구가 SNS에 올린 여행 사진을 보고 모르는 사람이 집이 비었다는 것을 알고 침입 시도(가정).',
    misconception: {
      myth: '내 개인정보는 별거 아니라서 해커가 안 노린다?',
      fact: '아닙니다. 사소한 정보들이 모여 보이스피싱이나 계정 도용의 결정적 단서가 됩니다.'
    },
    checkQuestion: {
      question: '사이버 공간의 특성 중, 범죄자가 자신의 신분을 숨기기 쉬운 특성은?',
      answer: '익명성'
    }
  }
];

export const QUIZ_BANK: QuizQuestion[] = [
  // Easy
  {
    id: 'q1',
    type: 'multiple',
    difficulty: 'easy',
    question: '다음 중 디지털 사회의 특징으로 적절하지 않은 것은?',
    options: ['정보 생산의 대중화', '단방향적 정보 전달', '시공간 제약 완화', '다양한 맞춤형 서비스'],
    answerKey: '단방향적 정보 전달',
    feedback: {
      reason: '디지털 사회는 생산자와 소비자의 경계가 모호한 쌍방향 소통이 특징입니다.',
      correction: '단방향 전달은 전통적 대중매체(TV, 신문)의 특징에 가깝습니다.'
    }
  },
  {
    id: 'q2',
    type: 'multiple',
    difficulty: 'easy',
    question: '개인의 검색 기록을 분석해 관심 있는 광고를 보여주는 기술과 가장 관련 깊은 개념은?',
    options: ['정보 격차', '맞춤형 서비스', '사이버 불링', '저작권 침해'],
    answerKey: '맞춤형 서비스',
    feedback: {
      reason: '이용자의 데이터를 바탕으로 개별화된 경험을 제공하는 것입니다.',
      correction: '이는 디지털 사회의 편의성을 높여주는 대표적인 맞춤형 서비스 사례입니다.'
    }
  },
  {
    id: 'q3',
    type: 'short',
    difficulty: 'easy',
    question: '디지털 공간에서 자신의 신원을 감출 수 있어 범죄 유혹에 빠지기 쉽게 만드는 특성은? (3글자)',
    answerKey: '익명성',
    feedback: {
      reason: '얼굴이 보이지 않는 특성이 책임감을 약화시킵니다.',
      correction: '익명성은 자유로운 표현을 돕기도 하지만, 사이버 폭력의 원인이 되기도 합니다.'
    }
  },
  {
    id: 'q4',
    type: 'multiple',
    difficulty: 'easy',
    question: '정보 가치에 대한 설명으로 옳은 것은?',
    options: ['모든 데이터는 가치가 같다', '정보는 공유될수록 가치가 줄어든다', '가공된 정보가 부가가치를 창출한다', '과거의 정보는 쓸모가 없다'],
    answerKey: '가공된 정보가 부가가치를 창출한다',
    feedback: {
      reason: '단순 데이터가 아닌, 목적에 맞게 처리된 정보가 가치를 가집니다.',
      correction: '정보는 공유되어도 사라지지 않으며(비소모성), 재생산될 수 있습니다.'
    }
  },
  // Medium
  {
    id: 'q5',
    type: 'multiple',
    difficulty: 'medium',
    question: '다음 사례에서 우려되는 디지털 사회의 문제점은? "A학생은 자신이 좋아하는 정치 성향의 뉴스만 추천받아 보게 되어, 반대 의견은 모두 가짜 뉴스라고 믿게 되었다."',
    options: ['정보 격차', '필터 버블', '디지털 발자국', '저작권 침해'],
    answerKey: '필터 버블',
    feedback: {
      reason: '알고리즘이 선호하는 정보만 제공하여 편향된 정보에 갇히는 현상입니다.',
      correction: '이를 방지하기 위해 의도적으로 다양한 관점의 정보를 찾아볼 필요가 있습니다.'
    }
  },
  {
    id: 'q6',
    type: 'short',
    difficulty: 'medium',
    question: '사용자가 인터넷을 사용하며 남긴 로그인 기록, 결제 내역, 댓글 등 모든 흔적을 무엇이라 하는가? (ㅇㅇㅇ ㅇㅇㅇ)',
    answerKey: '디지털 발자국',
    feedback: {
      reason: '눈길에 발자국이 남듯 디지털 공간에 남는 기록을 의미합니다.',
      correction: '이 기록들은 빅데이터 분석의 재료가 되지만, 프라이버시 침해 우려도 있습니다.'
    }
  },
  {
    id: 'q7',
    type: 'short',
    difficulty: 'medium',
    question: '악성 코드를 심어 데이터를 암호화한 뒤, 이를 풀어주는 대가로 금전을 요구하는 사이버 범죄는? (4글자)',
    answerKey: '랜섬웨어',
    feedback: {
      reason: '몸값(Ransom)과 소프트웨어(Software)의 합성어입니다.',
      correction: '출처가 불분명한 파일은 다운로드하지 않는 것이 중요합니다.'
    }
  },
  {
    id: 'q8',
    type: 'multiple',
    difficulty: 'medium',
    question: '지식 재산권 보호와 관련하여 올바른 태도는?',
    options: ['불법 다운로드 사이트 이용', '출처 없이 이미지 사용', '저작권 만료 저작물의 자유로운 이용', '유료 소프트웨어 크랙 사용'],
    answerKey: '저작권 만료 저작물의 자유로운 이용',
    feedback: {
      reason: '저작권 보호 기간이 만료된 저작물은 공공의 영역(Public Domain)에 속해 자유롭게 이용 가능합니다.',
      correction: '타인의 창작물을 이용할 때는 반드시 허락을 구하거나 정당한 대가를 지불해야 합니다.'
    }
  },
  // Hard
  {
    id: 'q9',
    type: 'narrative',
    difficulty: 'hard',
    question: 'SNS의 발달이 민주주의에 미치는 긍정적 영향과 부정적 영향을 각각 한 가지씩 서술하시오.',
    answerKey: ['정치 참여', '여론 형성', '가짜 뉴스', '선동', '확증 편향'],
    feedback: {
      reason: '참여 확대라는 장점과 왜곡된 정보 확산이라는 단점이 공존합니다.',
      correction: '시공간 제약 없이 정치 참여가 가능해지지만, 검증되지 않은 정보로 여론이 조작될 위험도 있습니다.'
    }
  },
  {
    id: 'q10',
    type: 'narrative',
    difficulty: 'hard',
    question: '빅데이터 기술이 발달함에 따라 "프라이버시 역설" 현상이 나타나기도 합니다. 이것이 무엇인지 설명하시오.',
    answerKey: ['개인정보', '중요', '행동', '모순', '편의성', '제공'],
    feedback: {
      reason: '생각과 행동의 불일치를 묻는 질문입니다.',
      correction: '개인정보 보호가 중요하다고 말하면서도, 실제로는 편의나 혜택을 위해 쉽게 개인정보를 제공하는 태도를 말합니다.'
    }
  }
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: '디지털 새싹',
    description: '첫 학습을 완료했습니다.',
    icon: '🌱',
    condition: (user) => user.xp >= 10
  },
  {
    id: 'b2',
    name: '3일 연속 접속',
    description: '3일 연속으로 학습했습니다.',
    icon: '🔥',
    condition: (user) => user.streak >= 3
  },
  {
    id: 'b3',
    name: '개념 마스터',
    description: '모든 개념의 숙련도가 80점을 넘었습니다.',
    icon: '👑',
    condition: (user) => Object.values(user.mastery).length === 4 && Object.values(user.mastery).every(v => v >= 80)
  },
  {
    id: 'b4',
    name: '오개념 퇴치',
    description: '퀴즈에서 5문제 이상 정답을 맞췄습니다.',
    icon: '🛡️',
    condition: (user) => user.xp >= 100 // Simplified condition for demo
  }
];

export const THINK_PROMPTS = [
  { id: 't1', title: '조건 바꾸기', desc: '만약 인터넷 실명제가 강제로 시행된다면, 사이버 범죄와 표현의 자유는 어떻게 변할까?' },
  { id: 't2', title: '반례 찾기', desc: '정보의 양이 많아질수록 결정 장애가 생기거나 잘못된 선택을 하는 "정보 과잉"의 사례를 찾아보자.' },
  { id: 't3', title: '적용 설계하기', desc: '우리 학교 매점에 "맞춤형 서비스"를 도입한다면 어떤 데이터를 수집해서 무엇을 추천해줄 수 있을까?' }
];