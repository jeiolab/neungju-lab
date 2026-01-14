import { Badge, Concept, QuizQuestion } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'c1',
    title: '개인정보의 이해',
    definition: '살아 있는 개인을 알아볼 수 있는 정보 또는 다른 정보와 결합하여 쉽게 알아볼 수 있는 정보',
    keywords: ['식별 가능성', '결합', '살아 있는 개인'],
    example: '학교 친구와 찍은 사진에 이름 태그를 달아 SNS에 올리는 것 (얼굴+이름=식별 가능)',
    misconception: {
      myth: '내 이름이랑 전화번호만 개인정보 아니야?',
      correction: '아니야! 성적표, 위치정보, 심지어 구매 내역도 결합하면 나를 알 수 있어서 개인정보야.',
    },
    checkQuestion: {
      question: '이미 돌아가신 위인의 이름과 업적은 개인정보 보호법의 보호 대상이다?',
      answer: false,
      explanation: '개인정보 보호법은 "살아 있는" 개인의 정보만 보호 대상으로 해.',
    },
  },
  {
    id: 'c2',
    title: '정보 보호의 3요소 (CIA)',
    definition: '정보를 안전하게 지키기 위해 지켜야 할 세 가지 핵심 원칙: 기밀성, 무결성, 가용성',
    keywords: ['기밀성', '무결성', '가용성'],
    example: '비밀번호 설정(기밀성), 해킹으로 내용이 바뀌지 않게 함(무결성), 필요할 때 접속 가능함(가용성)',
    misconception: {
      myth: '보호는 무조건 못 보게 잠그는 것만 말하는 거 아냐?',
      correction: '아냐, 정당한 사용자가 필요할 때 쓸 수 있게 해주는 것(가용성)도 보호의 일부야.',
    },
    checkQuestion: {
      question: '학교 홈페이지가 디도스 공격으로 마비되어 급식 식단을 볼 수 없다면 "가용성"이 침해된 것이다?',
      answer: true,
      explanation: '맞아! 정당한 사용자가 정보에 접근하지 못하게 방해받았으니까 가용성 침해지.',
    },
  },
  {
    id: 'c3',
    title: '정보 공유의 가치',
    definition: '정보를 타인과 나누어 새로운 지식을 창출하고 사회적 문제를 해결하는 긍정적 활동',
    keywords: ['지식 창출', '집단 지성', '문제 해결'],
    example: '오픈 소스 소프트웨어 프로젝트에 참여하거나, 수행평가 꿀팁을 학급 단톡방에 공유하는 것',
    misconception: {
      myth: '내 정보는 무조건 꽁꽁 숨기는 게 최고다?',
      correction: '개인정보는 보호해야 하지만, 공공 데이터나 지식은 공유할수록 가치가 커져 (예: 위키피디아).',
    },
    checkQuestion: {
      question: '저작권이 있는 영화 파일을 친구들에게 무료로 배포하는 것은 올바른 정보 공유다?',
      answer: false,
      explanation: '그건 저작권 침해지! 공유는 법과 윤리를 지키는 선에서 이루어져야 해.',
    },
  },
  {
    id: 'c4',
    title: '저작권과 CCL',
    definition: '창작물에 대한 권리(저작권)와 이를 합리적으로 공유하기 위한 표시(CCL)',
    keywords: ['저작인격권', '저작재산권', 'BY(출처표시)'],
    example: '블로그 글을 쓸 때 "출처 표시, 영리 목적 불가" 조건으로 사진을 가져와 쓰는 것',
    misconception: {
      myth: '인터넷에 떠도는 짤은 그냥 막 써도 된다?',
      correction: '아니야! 모든 창작물엔 주인이 있어. 무료 이미지 사이트나 CCL 조건을 확인해야 해.',
    },
    checkQuestion: {
      question: 'CCL 마크 중 "NC"는 "변경 금지"를 의미한다?',
      answer: false,
      explanation: 'NC(Non-Commercial)는 "비영리"를 뜻해. 변경 금지는 ND(No Derivatives)야.',
    },
  },
  {
    id: 'c5',
    title: '사이버 폭력 예방',
    definition: '정보 통신 기기를 이용하여 특정인을 괴롭히는 모든 행위',
    keywords: ['사이버 불링', '언어 폭력', '디지털 발자국'],
    example: '단톡방에서 특정 친구를 초대한 뒤 단체로 나가버리는 "방폭" 행위',
    misconception: {
      myth: '장난으로 올린 건데 금방 지우면 괜찮지 않을까?',
      correction: '디지털 발자국은 영원히 남아. 한 번 퍼지면 회수하기 어렵고 피해자에게 큰 상처를 줘.',
    },
    checkQuestion: {
      question: '친구의 엽기 사진을 동의 없이 단톡방에 유포하는 것은 사이버 폭력이다?',
      answer: true,
      explanation: '맞아. 초상권 침해이자 명백한 사이버 폭력이야.',
    },
  },
];

export const QUIZZES: QuizQuestion[] = [
  // 쉬움
  {
    id: 'q1',
    type: 'multiple-choice',
    difficulty: '쉬움',
    question: '다음 중 개인정보 보호법상 "개인정보"에 해당하지 않을 가능성이 가장 높은 것은?',
    options: ['홍길동의 주민등록번호', '학교 도서관의 CCTV 영상(얼굴 식별 가능)', '오늘의 서울 날씨 데이터', '김철수의 의료 기록'],
    correctAnswerIndex: 2,
    answerKeywords: ['날씨'],
    explanation: '날씨 데이터는 특정 개인을 식별할 수 있는 정보가 아니므로 개인정보가 아니야.',
    retryQuestion: {
      id: 'q1-r',
      type: 'multiple-choice',
      difficulty: '쉬움',
      question: '다음 중 개인정보인 것은?',
      options: ['무궁화의 개화 시기', '대한민국의 인구 수', '내 친구의 휴대전화 번호', '한강의 수질 데이터'],
      correctAnswerIndex: 2,
      answerKeywords: ['번호'],
      explanation: '휴대전화 번호는 특정 개인에게 연락할 수 있는 고유한 정보이므로 개인정보야.',
    },
  },
  {
    id: 'q2',
    type: 'short-answer',
    difficulty: '쉬움',
    question: '정보 보안의 3요소(CIA) 중, 인가된 사용자만 정보에 접근할 수 있도록 하는 성질은 무엇인가?',
    answerKeywords: ['기밀성', '비밀성'],
    explanation: '오직 허락된 사람만 볼 수 있는 것, 그것이 바로 기밀성(Confidentiality)이야.',
    retryQuestion: {
      id: 'q2-r',
      type: 'short-answer',
      difficulty: '쉬움',
      question: '정보 보안의 3요소 중, 정보가 허락 없이 변조되거나 삭제되지 않음을 보장하는 성질은?',
      answerKeywords: ['무결성'],
      explanation: '정보가 원래 그대로 완전하다는 뜻의 "무결성(Integrity)"이야.',
    },
  },
  // 보통
  {
    id: 'q3',
    type: 'multiple-choice',
    difficulty: '보통',
    question: '비밀번호 설정 및 관리 방법으로 가장 적절하지 않은 것은?',
    options: ['영문, 숫자, 특수문자를 조합한다.', '기억하기 쉽게 생일이나 전화번호를 포함한다.', '사이트마다 다른 비밀번호를 사용한다.', '주기적으로 변경한다.'],
    correctAnswerIndex: 1,
    answerKeywords: [],
    explanation: '생일이나 전화번호는 유추하기 너무 쉬워서 위험해! 개인 신상과 무관한 문자를 섞어야 해.',
    retryQuestion: {
      id: 'q3-r',
      type: 'multiple-choice',
      difficulty: '보통',
      question: '다음 중 가장 안전한 비밀번호는?',
      options: ['love1234', 'p@ssword', 'K8#mP!9z', '01012345678'],
      correctAnswerIndex: 2,
      answerKeywords: [],
      explanation: '길이가 충분하고, 대소문자/숫자/특수문자가 예측 불가능하게 섞인 비밀번호가 가장 안전해.',
    },
  },
  {
    id: 'q4',
    type: 'descriptive',
    difficulty: '보통',
    question: '공공장소에서 사용하는 PC를 이용한 후 반드시 해야 할 행동과 그 이유를 "로그아웃"이라는 단어를 포함하여 서술하시오.',
    answerKeywords: ['로그아웃', '유출', '도용', '남지 않게'],
    explanation: '내 계정 정보가 브라우저에 남아서 다른 사람이 도용하는 것을 막기 위해 반드시 로그아웃해야 해.',
    retryQuestion: {
      id: 'q4-r',
      type: 'descriptive',
      difficulty: '보통',
      question: '스마트폰 앱을 설치할 때 "접근 권한"을 확인할 때 주의할 점을 서술하시오.',
      answerKeywords: ['필요', '최소', '불필요', '확인'],
      explanation: '앱 기능과 상관없는 불필요한 권한(예: 손전등 앱이 주소록 요구)은 허용하지 않아야 해.',
    },
  },
  // 도전
  {
    id: 'q5',
    type: 'descriptive',
    difficulty: '도전',
    question: 'SNS에 친구들과 찍은 사진을 올리려 한다. "정보 공유"와 "정보 보호"의 관점에서 고려해야 할 점을 각각 1가지씩 서술하시오.',
    answerKeywords: ['동의', '허락', '초상권', '식별', '추억', '소통'],
    explanation: '보호: 친구의 동의(초상권)를 구했는가? / 공유: 우리만의 추억을 나누는 긍정적 가치가 있는가? 이 균형이 중요해.',
    retryQuestion: {
      id: 'q5-r',
      type: 'descriptive',
      difficulty: '도전',
      question: '저작권법에서 말하는 "공정 이용(Fair Use)"이 무엇인지, 학교 수업 목적을 예로 들어 설명하시오.',
      answerKeywords: ['저작권', '허락', '수업', '교육', '이용'],
      explanation: '학교 수업이나 비평, 보도 등을 위해서는 저작권자의 허락 없이도 저작물을 제한적으로 사용할 수 있어.',
    },
  }
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: '시작이 반이다',
    description: '첫 번째 학습을 완료하세요.',
    icon: '🌱',
    condition: (p, m, w) => p.xp > 0,
  },
  {
    id: 'b2',
    name: '개념 마스터',
    description: '모든 개념 카드를 "알겠음" 상태로 만드세요.',
    icon: '🎓',
    condition: (p, m, w) => Object.values(m).filter(s => s === 'known').length === CONCEPTS.length,
  },
  {
    id: 'b3',
    name: '꾸준함의 힘',
    description: '3일 연속으로 학습하세요.',
    icon: '🔥',
    condition: (p, m, w) => p.streak >= 3,
  },
  {
    id: 'b4',
    name: '오답 정복자',
    description: '오답노트에 기록된 문제를 재도전하여 3개 이상 맞히세요 (로직 구현 필요).',
    icon: '🛡️',
    condition: (p, m, w) => w.length >= 5, // Simplified for this demo
  },
];