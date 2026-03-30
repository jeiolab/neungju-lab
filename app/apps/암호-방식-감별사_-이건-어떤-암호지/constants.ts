import { EncryptionCategory, ScenarioCard, QuizQuestion, StoryCard, Badge } from './types';

export const SCENARIOS: ScenarioCard[] = [
  {
    id: 's1',
    title: '웹사이트 로그인',
    description: '사용자의 비밀번호를 그대로 데이터베이스에 저장하지 않고, 알아볼 수 없는 복잡한 문자열로 변환하여 저장했습니다. 관리자도 원래 비밀번호는 알 수 없습니다.',
    category: EncryptionCategory.HASH,
    difficulty: 'easy',
    keywords: ['복호화', '단방향', '저장', '비교'],
    explanation: '비밀번호는 보안을 위해 복호화가 불가능한 해시 함수를 사용하여 단방향으로 저장해야 합니다.'
  },
  {
    id: 's2',
    title: '비밀 일기장 공유',
    description: '철수와 영희는 미리 약속한 숫자 키(Key)를 하나 정했습니다. 철수가 이 키로 파일을 잠가서 보내면, 영희도 똑같은 키를 사용해서 파일을 엽니다.',
    category: EncryptionCategory.SYMMETRIC,
    difficulty: 'easy',
    keywords: ['같은', '공유', '비밀키', '대칭'],
    explanation: '암호화와 복호화에 같은 키를 사용하는 방식은 대칭키 암호화입니다.'
  },
  {
    id: 's3',
    title: '쇼핑몰 결제 페이지',
    description: '웹 브라우저 주소창 옆에 자물쇠 아이콘이 보이고, 주소가 http가 아닌 것으로 시작합니다. 내 정보가 안전하게 서버로 전송됩니다.',
    category: EncryptionCategory.HTTPS,
    difficulty: 'easy',
    keywords: ['자물쇠', '보안', '전송', '통신'],
    explanation: '웹 서버와 브라우저 간의 안전한 통신을 위해 SSL/TLS 프로토콜을 사용하는 HTTPS입니다.'
  },
  {
    id: 's4',
    title: '스키테일 암호',
    description: '막대에 종이 띠를 감아서 글자를 썼습니다. 막대에서 띠를 풀면 글자 순서가 뒤섞여 알아볼 수 없지만, 같은 굵기의 막대에 감으면 다시 읽을 수 있습니다.',
    category: EncryptionCategory.TRANSPOSITION,
    difficulty: 'hard',
    keywords: ['순서', '재배열', '위치', '자리'],
    explanation: '문자의 내용은 바꾸지 않고 위치(순서)만 바꾸는 방식을 전치 암호라고 합니다.'
  },
  {
    id: 's5',
    title: '공인인증서(공동인증서) 로그인',
    description: '은행 사이트에서 내 개인키로 "내가 맞음"을 증명하는 데이터를 생성하여 보냈고, 은행은 나의 공개키를 이용해 이것이 진짜 내 키로 만들어진 것인지 확인했습니다.',
    category: EncryptionCategory.DIGITAL_SIGNATURE,
    difficulty: 'hard',
    keywords: ['서명', '부인방지', '증명', '개인키'],
    explanation: '개인키로 암호화(서명)하고 공개키로 검증하여 신원 확인 및 무결성을 보장하는 디지털 서명 기술입니다.'
  },
  {
    id: 's6',
    title: '카이사르(시저) 암호',
    description: '알파벳을 3칸씩 뒤로 밀어서 글자를 바꿨습니다. A는 D가 되고, B는 E가 됩니다.',
    category: EncryptionCategory.SUBSTITUTION,
    difficulty: 'easy',
    keywords: ['대체', '바꿈', '치환', '알파벳'],
    explanation: '문자를 다른 문자나 기호로 1:1로 바꾸는 방식을 치환 암호라고 합니다.'
  },
  {
    id: 's7',
    title: '공개키 암호 통신',
    description: '누구나 볼 수 있는 주소록(공개키)으로 편지를 잠가서 보내면, 받는 사람만 가진 열쇠(개인키)로만 열어볼 수 있습니다.',
    category: EncryptionCategory.ASYMMETRIC,
    difficulty: 'hard',
    keywords: ['두 개', '다른', '공개', '개인'],
    explanation: '암호화하는 키(공개키)와 복호화하는 키(개인키)가 서로 다른 방식인 비대칭키 암호화입니다.'
  }
];

export const THEORIES = [
  { category: EncryptionCategory.SUBSTITUTION, desc: '글자를 다른 글자로 1:1 교환하는 방식 (예: A->D)' },
  { category: EncryptionCategory.TRANSPOSITION, desc: '글자의 순서를 바꾸어 섞는 방식 (예: 스키테일)' },
  { category: EncryptionCategory.HASH, desc: '입력을 고정된 길이의 값으로 변환, 복구 불가능 (예: SHA-256)' },
  { category: EncryptionCategory.SYMMETRIC, desc: '암호화와 복호화에 같은 열쇠를 사용 (빠르지만 키 배송 문제)' },
  { category: EncryptionCategory.ASYMMETRIC, desc: '공개키(잠금)와 개인키(해제)가 분리된 방식 (느리지만 안전)' },
  { category: EncryptionCategory.DIGITAL_SIGNATURE, desc: '개인키로 서명하고 공개키로 검증하여 신원/무결성 증명' },
  { category: EncryptionCategory.HTTPS, desc: '웹 통신을 암호화하여 도청/변조를 방지하는 프로토콜' },
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '복호화'가 불가능한 것을 전제로 설계된 방식은?",
    options: ["대칭키 암호", "해시 함수", "전치 암호", "공개키 암호"],
    answer: 1,
    explanation: "해시 함수는 단방향성을 가지므로 원본 데이터로 복구할 수 없습니다."
  },
  {
    id: 2,
    question: "대칭키 암호 방식의 가장 큰 단점은 무엇인가?",
    options: ["속도가 너무 느리다", "암호를 만드는 게 어렵다", "키를 상대방에게 안전하게 전달하기 어렵다", "복호화가 불가능하다"],
    answer: 2,
    explanation: "대칭키는 송신자와 수신자가 같은 키를 가져야 하므로, 키 배송(전달) 과정에서 탈취될 위험이 있습니다."
  },
  {
    id: 3,
    question: "디지털 서명에서 '서명'을 할 때 사용하는 키는?",
    options: ["송신자의 개인키", "송신자의 공개키", "수신자의 개인키", "수신자의 공개키"],
    answer: 0,
    explanation: "디지털 서명은 '나'만이 할 수 있어야 하므로 송신자의 개인키로 서명합니다. 검증은 누구나 할 수 있게 송신자의 공개키로 합니다."
  },
   {
    id: 4,
    question: "웹사이트 주소가 https:// 로 시작할 때의 설명으로 옳은 것은?",
    options: ["모든 데이터가 공개된다", "서버와 브라우저 간 통신이 암호화된다", "해시 함수만 사용한다", "속도가 http보다 훨씬 빠르다"],
    answer: 1,
    explanation: "HTTPS는 SSL/TLS를 통해 통신 채널을 암호화하여 도청을 방지합니다."
  },
  {
    id: 5,
    question: "문자의 위치만 바꾸는 고전 암호 방식은?",
    options: ["치환 암호", "전치 암호", "해시", "RSA"],
    answer: 1,
    explanation: "문자의 내용은 그대로 두고 순서(위치)를 바꾸는 것은 전치(Transposition) 암호입니다."
  }
];

export const STORIES: StoryCard[] = [
  {
    id: 'history1',
    title: '전쟁과 암호',
    era: '고대 ~ 중세',
    content: '고대 그리스의 스키테일이나 로마의 카이사르 암호는 주로 전쟁 중 명령을 전달하기 위해 쓰였습니다. 적에게 들키지 않고 아군에게만 작전을 전달하는 것이 생존과 직결되었기 때문입니다.'
  },
  {
    id: 'history2',
    title: '키 배송 문제의 해결',
    era: '1970년대',
    content: '인터넷이 발달하면서 모르는 사람과도 통신해야 했습니다. 하지만 비밀키를 만나서 줄 수가 없었죠. 이를 해결하기 위해 디피와 헬만, 그리고 RSA 개발자들은 "잠그는 키와 여는 키를 다르게 하자"는 혁명적인 발상(공개키 암호)을 해냅니다.'
  },
  {
    id: 'history3',
    title: '신뢰의 시대',
    era: '현대',
    content: '이제는 단순히 내용을 숨기는 것을 넘어, "이 문서가 정말 은행이 보낸 게 맞는가?"(인증), "중간에 바뀌지 않았는가?"(무결성)가 중요해졌습니다. 해시와 디지털 서명이 디지털 경제의 신뢰를 지탱하고 있습니다.'
  }
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: '해시 마스터', description: '해시 관련 문제를 완벽히 이해함', icon: '#', unlocked: false, categoryRequirement: EncryptionCategory.HASH },
  { id: 'b2', name: 'HTTPS 레이더', description: '보안 연결을 정확히 식별함', icon: '🔒', unlocked: false, categoryRequirement: EncryptionCategory.HTTPS },
  { id: 'b3', name: '키 관리자', description: '대칭/비대칭 키 개념 정복', icon: '🔑', unlocked: false, categoryRequirement: EncryptionCategory.SYMMETRIC },
  { id: 'b4', name: '시니어 감별사', description: '총점 300점 달성', icon: '🎓', unlocked: false },
];