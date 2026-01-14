import { ConceptCard, ModuleType, QuizQuestion } from './types';

export const MODULE_INFO = {
  [ModuleType.PERSONAL_INFO]: { title: '개인 정보의 이해', description: '나와 타인의 소중한 정보를 식별하고 분류하는 법' },
  [ModuleType.PROTECTION]: { title: '정보 보호 실천', description: '비밀번호 관리부터 해킹 방어까지' },
  [ModuleType.COPYRIGHT]: { title: '정보 공유와 저작권', description: 'CCL과 올바른 정보 공유 문화' },
};

export const CONCEPT_CARDS: ConceptCard[] = [
  // Module 1: Personal Info
  {
    id: 'c1-1',
    moduleId: ModuleType.PERSONAL_INFO,
    title: '개인 정보의 정의',
    definition: '살아있는 개인을 식별할 수 있는 정보. 이름, 주민번호 뿐만 아니라 다른 정보와 결합하여 식별 가능한 정보도 포함된다.',
    keywords: ['식별 가능성', '결합 정보', '생존하는 개인'],
    misconception: '오개념: "이름만 있으면 개인정보가 아니다?" -> 이름과 학교명이 결합되면 특정인을 찾을 수 있으므로 개인정보입니다.',
    isRead: false
  },
  {
    id: 'c1-2',
    moduleId: ModuleType.PERSONAL_INFO,
    title: '개인 정보 유형 5가지',
    definition: '인적(이름), 신체(지문), 정신(종교/신념), 재산(계좌), 사회적(학력) 정보로 나뉜다.',
    keywords: ['인적', '신체', '정신', '재산', '사회적'],
    misconception: '오개념: "키와 몸무게는 개인정보가 아니다?" -> 신체적 정보에 해당하여 개인정보입니다.',
    isRead: false
  },
  
  // Module 2: Protection
  {
    id: 'c2-1',
    moduleId: ModuleType.PROTECTION,
    title: '비밀번호 안전 수칙',
    definition: '8자 이상, 영문/숫자/특수문자 조합, 주기적 변경, 사이트별 다른 비밀번호 사용.',
    keywords: ['복잡성', '주기적 변경', '재사용 금지'],
    misconception: '오개념: "자주 쓰는 단어 뒤에 !만 붙이면 안전하다?" -> 유추하기 쉬운 패턴은 위험합니다.',
    isRead: false
  },
  {
    id: 'c2-2',
    moduleId: ModuleType.PROTECTION,
    title: '피싱(Phishing) 예방',
    definition: '출처가 불분명한 메일/문자 링크 클릭 금지. 개인정보 요구 시 의심.',
    keywords: ['링크 클릭 주의', '출처 확인', '금융 정보 요구'],
    misconception: '오개념: "은행 로고가 있으면 안전하다?" -> 위조된 사이트일 수 있으니 URL을 꼭 확인해야 합니다.',
    isRead: false
  },

  // Module 3: Copyright
  {
    id: 'c3-1',
    moduleId: ModuleType.COPYRIGHT,
    title: '저작권(Copyright)',
    definition: '창작물을 만든 사람이 가지는 권리. 허락 없이 함부로 사용하면 안 된다.',
    keywords: ['창작자 권리', '이용 허락', '표절 금지'],
    misconception: '오개념: "출처만 밝히면 마음대로 써도 된다?" -> 이용 허락(라이선스) 조건에 맞게 사용해야 합니다.',
    isRead: false
  },
  {
    id: 'c3-2',
    moduleId: ModuleType.COPYRIGHT,
    title: 'CCL (Creative Commons License)',
    definition: '저작권자가 자신의 저작물 이용 조건을 미리 표시하는 제도. (예: 저작자 표시, 비영리, 변경 금지)',
    keywords: ['BY(저작자표시)', 'NC(비영리)', 'ND(변경금지)', 'SA(동일조건변경허락)'],
    misconception: '오개념: "모든 인터넷 이미지는 무료다?" -> CCL 마크나 저작권 표시를 확인해야 합니다.',
    isRead: false
  }
];

export const MOCK_EXAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    moduleId: ModuleType.PERSONAL_INFO,
    type: 'MULTIPLE',
    question: '다음 중 "신체적 정보"에 해당하지 않는 것은?',
    options: ['지문', '홍채', '혈액형', '신용카드 번호'],
    correctAnswer: '신용카드 번호',
    explanation: '신용카드 번호는 "재산적 정보"에 해당합니다. 신체적 정보는 신체의 특징에 관한 정보입니다.',
    difficulty: 'EASY'
  },
  {
    id: 'q2',
    moduleId: ModuleType.PERSONAL_INFO,
    type: 'OX',
    question: '이미 사망한 위인의 이름과 업적은 개인정보 보호법의 보호 대상이다.',
    correctAnswer: 'X',
    explanation: '개인정보 보호법은 "살아있는 개인"의 정보만을 보호 대상으로 합니다.',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q3',
    moduleId: ModuleType.PROTECTION,
    type: 'MULTIPLE',
    question: '안전한 비밀번호 생성 규칙으로 올바르지 않은 것은?',
    options: ['8자리 이상으로 설정한다', '특수문자를 포함한다', '모든 사이트에 동일하게 설정한다', '주기적으로 변경한다'],
    correctAnswer: '모든 사이트에 동일하게 설정한다',
    explanation: '하나의 사이트가 해킹당하면 다른 사이트도 위험해지므로, 사이트마다 다르게 설정해야 합니다.',
    difficulty: 'EASY'
  },
  {
    id: 'q4',
    moduleId: ModuleType.COPYRIGHT,
    type: 'MULTIPLE',
    question: 'CCL 표시 중 "NC"가 의미하는 것은?',
    options: ['저작자 표시', '변경 금지', '비영리', '동일조건 변경허락'],
    correctAnswer: '비영리',
    explanation: 'NC(Non-Commercial)는 영리 목적으로 이용할 수 없음을 의미합니다.',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q5',
    moduleId: ModuleType.PROTECTION,
    type: 'OX',
    question: '출처가 불분명한 이메일의 첨부파일은 궁금하더라도 열어보지 말아야 한다.',
    correctAnswer: 'O',
    explanation: '악성코드가 포함되어 있을 수 있으므로 출처가 불분명하면 열지 말고 삭제해야 합니다.',
    difficulty: 'EASY'
  }
];

export const SIMULATION_QUESTIONS: QuizQuestion[] = [
    {
        id: 'sim1',
        moduleId: ModuleType.PROTECTION,
        type: 'OX',
        question: '[긴급] 보안팀입니다. 비밀번호가 유출되었으니 즉시 아래 링크로 변경하세요. (URL: wvv.security-check.com)',
        correctAnswer: 'X',
        explanation: '피싱 문자입니다. URL이 공식 도메인(www)과 미묘하게 다릅니다(wvv). 링크를 누르지 마세요!',
        difficulty: 'EASY'
    },
    {
        id: 'sim2',
        moduleId: ModuleType.COPYRIGHT,
        type: 'OX',
        question: '학교 과제 발표 자료에 "CCL: BY-NC"가 붙은 이미지를 사용했다.',
        correctAnswer: 'O',
        explanation: '학교 과제는 비영리적 교육 활동이므로 BY-NC(저작자 표시, 비영리) 저작물을 사용할 수 있습니다.',
        difficulty: 'MEDIUM'
    },
    {
        id: 'sim3',
        moduleId: ModuleType.PERSONAL_INFO,
        type: 'OX',
        question: 'SNS에 친구들과 찍은 사진을 올릴 때, 친구의 동의 없이 올려도 된다.',
        correctAnswer: 'X',
        explanation: '친구의 초상권과 프라이버시 침해 소지가 있으므로 반드시 동의를 구해야 합니다.',
        difficulty: 'EASY'
    }
];