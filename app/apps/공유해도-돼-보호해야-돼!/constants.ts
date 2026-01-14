import { CardType, ConditionOption, GameCard, QuizQuestion, QuizDifficulty } from './types';

export const GAME_CARDS: GameCard[] = [
  {
    id: 'c1',
    content: '우리 동네 지진 대피소 위치 지도',
    type: CardType.SHARE,
    explanation: '공공 안전을 위한 정보는 널리 공유해야 합니다. (공익적 가치)',
    category: '재난/안전'
  },
  {
    id: 'c2',
    content: '친구 얼굴이 나온 수학여행 단체 사진',
    type: CardType.CONDITIONAL,
    requiredConditions: [ConditionOption.CONSENT],
    explanation: '타인의 초상권이 포함된 정보는 당사자의 동의가 필수입니다.',
    category: '사생활'
  },
  {
    id: 'c3',
    content: '우리 반 친구들의 중간고사 성적표 리스트',
    type: CardType.PROTECT,
    explanation: '개인 성적은 민감한 개인정보이므로 공개되어서는 안 됩니다.',
    category: '학교생활'
  },
  {
    id: 'c4',
    content: '학교 축제 일정 및 외부인 출입 시간표',
    type: CardType.SHARE,
    explanation: '학교 행사의 원활한 진행을 위해 공개가 필요한 공지사항입니다.',
    category: '학교생활'
  },
  {
    id: 'c5',
    content: '졸업생 진로 현황 통계 (이름 없음)',
    type: CardType.SHARE,
    explanation: '특정 개인을 식별할 수 없는 통계 정보는 진로 탐색을 위해 공유 가능합니다.',
    category: '진로'
  },
  {
    id: 'c6',
    content: '반 단톡방에 올린 내 주민등록번호',
    type: CardType.PROTECT,
    explanation: '주민등록번호는 고유식별정보로, 유출 시 심각한 피해가 우려되므로 절대 공유 금지입니다.',
    category: '개인정보'
  },
  {
    id: 'c7',
    content: '봉사활동 중 촬영한 요양원 할머니 사진',
    type: CardType.CONDITIONAL,
    requiredConditions: [ConditionOption.CONSENT, ConditionOption.ANONYMIZATION],
    explanation: '봉사활동 기록이라도 제3자의 초상은 동의가 필요하며, 민감할 경우 가명/모자이크 처리가 필요합니다.',
    category: '봉사활동'
  },
  {
    id: 'c8',
    content: '도로 침수 및 교통 통제 알림',
    type: CardType.SHARE,
    explanation: '재난 상황에서의 위험 정보는 신속한 전파가 최우선입니다.',
    category: '재난/안전'
  },
  {
    id: 'c9',
    content: '내 핸드폰 번호가 적힌 중고거래 게시글',
    type: CardType.CONDITIONAL,
    requiredConditions: [ConditionOption.TIME_LIMIT, ConditionOption.ACCESS_CONTROL],
    explanation: '연락처 공개는 거래 기간 동안만, 또는 안심번호 등을 사용하는 것이 안전합니다.',
    category: '생활'
  },
  {
    id: 'c10',
    content: '동아리 회식 장소와 시간 공지',
    type: CardType.CONDITIONAL,
    requiredConditions: [ConditionOption.ACCESS_CONTROL],
    explanation: '동아리원에게만 필요한 정보이므로 전체 공개보다는 폐쇄된 채널(단톡방 등) 공유가 적절합니다.',
    category: '학교생활'
  },
  // Adding more placeholders to simulate 30 cards logic (using subset for brevity in code but logically extending)
  {
    id: 'c11',
    content: '담임 선생님의 개인 휴대전화 번호',
    type: CardType.PROTECT,
    explanation: '업무용 연락처가 아닌 개인 번호는 사생활 보호 대상입니다.',
    category: '학교생활'
  },
  {
    id: 'c12',
    content: '학교 급식 식단표',
    type: CardType.SHARE,
    explanation: '학생들의 건강과 알러지 정보 확인을 위해 공개되어야 할 정보입니다.',
    category: '학교생활'
  }
];

export const CONCEPTS = [
  {
    title: '개인정보란?',
    content: '살아있는 개인을 식별할 수 있는 정보(성명, 주민번호, 영상 등). 다른 정보와 결합하여 식별 가능한 것도 포함됩니다.'
  },
  {
    title: '정보 공유의 가치',
    content: '공익(재난, 보건), 알 권리(공공기관 정보), 유대감 형성(SNS) 등 긍정적 효과가 있을 때 공유가 권장됩니다.'
  },
  {
    title: '조건부 공유',
    content: '정보 주체의 동의를 받거나, 비식별화(가명처리)를 거치거나, 공유 범위/기간을 제한하여 안전하게 공유하는 방법입니다.'
  },
  {
    title: '오해와 진실',
    content: '“공공 장소에서 찍은 사진은 무조건 공유해도 된다?” (X) -> 타인의 초상권 침해 소지가 있으면 동의가 필요합니다.'
  }
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    difficulty: QuizDifficulty.EASY,
    question: '다음 중 "절대 보호"해야 할 정보는?',
    options: ['학교 급식 메뉴', '친구의 비밀번호', '내일 날씨', '도서관 개방 시간'],
    answer: '친구의 비밀번호'
  },
  {
    id: 'q2',
    difficulty: QuizDifficulty.MEDIUM,
    question: '친구들과 찍은 사진을 인스타그램에 올리려 합니다. 가장 먼저 고려해야 할 조건은?',
    options: ['필터 보정', '해시태그 선정', '친구들의 동의 구하기', '업로드 시간'],
    answer: '친구들의 동의 구하기'
  },
  {
    id: 'q3',
    difficulty: QuizDifficulty.HARD,
    question: '학교 폭력 예방 캠페인 영상을 만들어 유튜브에 올리려고 합니다. 영상에 지나가는 다른 학생들의 얼굴이 찍혔습니다. 어떻게 해야 할까요? (서술형)',
    scenario: '학생회 홍보부장 상황'
  }
];
