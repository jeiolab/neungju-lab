import { PuzzleBlock, QuizQuestion, ConceptCardData } from './types';

export const PUZZLE_STEPS: PuzzleBlock[] = [
  { id: 'step-1', label: '목적 정의', description: '왜 수집하는지 명확히 하기', category: 'plan' },
  { id: 'step-2', label: '최소 수집', description: '필요한 정보만 골라내기', category: 'plan' },
  { id: 'step-3', label: '동의 획득', description: '정보주체에게 허락받기', category: 'collect' },
  { id: 'step-4', label: '안전 보관', description: '암호화 및 접근 통제', category: 'manage' },
  { id: 'step-5', label: '목적 내 이용', description: '약속한 용도로만 사용', category: 'manage' },
  { id: 'step-6', label: '제3자 제공/위탁', description: '필요 시 외부 전달 (동의/계약)', category: 'manage' },
  { id: 'step-7', label: '가명 처리', description: '식별 불가능하게 가공', category: 'manage' },
  { id: 'step-8', label: '보유기간 관리', description: '기간 만료 확인', category: 'manage' },
  { id: 'step-9', label: '파기', description: '복구 불가능하게 삭제', category: 'destroy' },
];

export const CONCEPTS: ConceptCardData[] = [
  {
    title: '가명정보',
    content: '추가 정보 없이는 특정 개인을 알아볼 수 없도록 처리한 정보입니다. 통계 작성, 과학적 연구 등에 동의 없이 활용 가능합니다.',
    iconName: 'VenetianMask',
    category: '개념'
  },
  {
    title: '제3자 제공 vs 위탁',
    content: '제3자 제공은 받는 사람의 이익을 위해 정보를 주는 것이고(별도 동의 필요), 위탁은 내 업무를 대신 처리해달라고 맡기는 것(동의 불필요, 공개 필요)입니다.',
    iconName: 'Handshake',
    category: '심화'
  },
  {
    title: '최소 수집의 원칙',
    content: '서비스 제공에 필수적인 정보만 수집해야 합니다. 선택 정보 동의를 거부했다고 서비스 가입을 막으면 안 됩니다.',
    iconName: 'Minimize',
    category: '원칙'
  },
  {
    title: '파기의 원칙',
    content: '보유기간이 지나거나 목적이 달성되면 지체 없이, 복구 불가능한 방법(영구 삭제, 파쇄 등)으로 파기해야 합니다.',
    iconName: 'Trash2',
    category: '원칙'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: '다음 중 개인정보 처리 원칙에 어긋나는 행동은?',
    options: [
      '보유 기간이 지난 정보를 즉시 파기했다.',
      '서비스 가입 시 필수 정보와 선택 정보를 구분하여 동의받았다.',
      '마케팅 활용 동의를 하지 않았다고 회원가입을 거절했다.',
      '비밀번호를 암호화하여 저장했다.'
    ],
    correctAnswer: 2,
    explanation: '선택 정보(마케팅 등)에 동의하지 않는다는 이유로 서비스 제공을 거부해서는 안 됩니다.'
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: '개인정보를 제3자에게 제공할 때 필요한 조치는?',
    options: [
      '그냥 준다.',
      '정보주체에게 별도 동의를 받는다.',
      '홈페이지에 공지사항만 올린다.',
      '친구에게 물어본다.'
    ],
    correctAnswer: 1,
    explanation: '제3자 제공은 정보주체의 별도 동의가 반드시 필요합니다.'
  },
  {
    id: 3,
    type: 'subjective',
    question: '학교에서 수행평가 성적을 학급 게시판에 이름과 함께 공개하는 것이 왜 위험한지, 개인정보 보호 관점에서 서술하시오.',
    modelAnswer: '성적은 민감할 수 있는 개인정보이며, 공개된 장소에 게시할 경우 정보주체(학생)의 동의 없는 제3자 제공이나 유출이 될 수 있어 사생활 침해 우려가 있다.'
  },
  {
    id: 4,
    type: 'subjective',
    question: '개인정보를 "가명처리"하면 어떤 장점이 있는지 서술하시오.',
    modelAnswer: '개인을 식별할 수 없게 되어 정보 유출 시 위험이 줄어들며, 통계 작성이나 연구 목적으로 정보주체의 동의 없이도 활용할 수 있어 데이터 가치가 높아진다.'
  }
];
