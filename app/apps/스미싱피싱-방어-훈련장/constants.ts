import { Scenario, QuizQuestion, Tab } from './types';
import { Shield, Smartphone, BookOpen, BrainCircuit, AlertTriangle } from 'lucide-react';

export const LEVEL_THRESHOLDS = {
  TRAINEE: 0,
  DEFENDER: 100,
  CAPTAIN: 300,
};

export const TABS = [
  { id: Tab.THEORY, label: '이론 개념', icon: BookOpen },
  { id: Tab.SIMULATION, label: '실전 훈련', icon: Smartphone },
  { id: Tab.MORE_INFO, label: '더 알아보기', icon: AlertTriangle },
  { id: Tab.QUIZ, label: '보안 퀴즈', icon: BrainCircuit },
  { id: Tab.REFLECTION, label: '생각해보기', icon: Shield },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    type: 'SMS',
    sender: 'CJ대한통운',
    content: '[CJ대한통운] 운송장 번호 불일치로 배송이 보류되었습니다. 주소지 확인 부탁드립니다. URL: bit.ly/cj-check',
    tags: ['URGENCY', 'AUTHORITY'],
    correctActions: ['IGNORE', 'DELETE', 'CHECK_FRIEND'], // CHECK_FRIEND here means checking official app
    riskIfClicked: 90,
    explanation: '택배사는 절대 URL을 통해 주소 변경을 요구하지 않습니다. 공식 앱에서 운송장 번호를 조회하세요.',
  },
  {
    id: 2,
    type: 'SMS',
    sender: '010-XXXX-XXXX',
    content: '민수야 나 폰 액정 깨져서 수리 맡겼어. 급하게 돈 필요한데 편의점 상품권 좀 사서 보내줄 수 있어? ㅠ',
    tags: ['URGENCY', 'AUTHORITY'], // Impersonation
    correctActions: ['CHECK_FRIEND', 'REPORT'],
    riskIfClicked: 80,
    explanation: '지인을 사칭한 메신저 피싱입니다. 반드시 전화로 본인 확인을 해야 합니다.',
  },
  {
    id: 3,
    type: 'SNS',
    sender: 'Instagram Security',
    content: '회원님의 계정에서 비정상적인 로그인 시도가 감지되었습니다. 즉시 본인 인증을 하지 않으면 계정이 비활성화됩니다. 링크: instagram-verify-security.com',
    tags: ['Fear', 'AUTHORITY'],
    correctActions: ['IGNORE', 'DELETE', 'SET_2FA'],
    riskIfClicked: 95,
    explanation: '계정 탈취를 노리는 피싱입니다. 링크를 누르지 말고 앱 내 설정에서 보안 상태를 확인하세요. 2단계 인증이 필수입니다.',
  },
  {
    id: 4,
    type: 'SMS',
    sender: '모바일 청첩장',
    content: '저희 결혼합니다. 오셔서 축복해주세요 ^^ 모바일 청첩장 확인하기: m.wedding-inv.apk',
    tags: ['CURIOSITY'],
    correctActions: ['IGNORE', 'DELETE', 'CHECK_FRIEND'],
    riskIfClicked: 100,
    explanation: '.apk 파일은 안드로이드 설치 파일입니다. 클릭 시 악성 앱이 설치되어 정보가 탈취됩니다.',
  },
  {
    id: 5,
    type: 'EMAIL',
    sender: 'Neflix Support',
    content: '결제 정보가 만료되어 멤버십이 일시 중지되었습니다. 결제 정보를 업데이트하세요.',
    tags: ['URGENCY', 'GREED'],
    correctActions: ['IGNORE', 'DELETE'],
    riskIfClicked: 85,
    explanation: '구독 서비스 사칭 이메일입니다. 발신자 주소를 자세히 확인하고 공식 홈페이지로 직접 접속하세요.',
  },
  {
    id: 6,
    type: 'SMS',
    sender: '검찰청',
    content: '[서울중앙지검] 귀하의 명의가 대포통장 개설에 도용되었습니다. 사건 번호 조회: law-korea.net',
    tags: ['Fear', 'AUTHORITY'],
    correctActions: ['IGNORE', 'REPORT'],
    riskIfClicked: 90,
    explanation: '검찰, 경찰 등 관공서는 문자로 사건 조회를 위한 링크를 보내지 않습니다.',
  },
  {
    id: 7,
    type: 'SNS',
    sender: '친구',
    content: '야 이거 너 나온 사진 아님? ㅋㅋ 대박 못생김 빨리 봐봐 [링크]',
    tags: ['CURIOSITY', 'Fear'],
    correctActions: ['CHECK_FRIEND', 'IGNORE'],
    riskIfClicked: 95,
    explanation: '호기심을 자극하여 악성코드를 유포하는 스미싱 수법입니다.',
  },
  {
    id: 8,
    type: 'SMS',
    sender: '정부24',
    content: '[국민건강보험] 본인부담상한액 초과금 환급 신청 안내. 기한 내 신청하세요.',
    tags: ['GREED', 'AUTHORITY'],
    correctActions: ['IGNORE', 'CHECK_FRIEND'], // Check official site
    riskIfClicked: 80,
    explanation: '정부 기관을 사칭한 환급금 사기입니다. 정부24 공식 앱이나 홈페이지를 이용하세요.',
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 안전한 비밀번호는 무엇인가요?",
    options: ["12345678", "password123", "P@ssw0rd_SK!", "mynameisminsu"],
    correctIndex: 2,
    difficulty: 'EASY',
    explanation: "대문자, 소문자, 숫자, 특수문자를 조합하여 8자리 이상으로 만들어야 안전합니다."
  },
  {
    id: 2,
    question: "2단계 인증(2FA)의 목적으로 가장 적절한 것은?",
    options: ["로그인 속도를 빠르게 하기 위해", "비밀번호를 잊어버렸을 때를 대비해", "비밀번호가 털려도 계정을 보호하기 위해", "친구들에게 계정을 공유하기 위해"],
    correctIndex: 2,
    difficulty: 'EASY',
    explanation: "2단계 인증은 비밀번호를 알더라도 추가 인증(SMS, 앱 등) 없이는 로그인을 막아주는 이중 잠금장치입니다."
  },
  {
    id: 3,
    question: "출처가 불분명한 .apk 파일을 설치했을 때 발생할 수 있는 일은?",
    options: ["배터리 수명이 늘어난다", "스마트폰 속도가 빨라진다", "개인정보 탈취 및 좀비폰이 될 수 있다", "무료 게임이 설치된다"],
    correctIndex: 2,
    difficulty: 'MEDIUM',
    explanation: ".apk 파일은 앱 설치 파일로, 악성 코드가 포함되어 있을 경우 스마트폰의 모든 정보를 탈취당할 수 있습니다."
  },
  {
    id: 4,
    question: "보이스피싱 전화를 받았을 때 올바른 대처법은?",
    options: ["상대방의 말을 끝까지 듣고 설득한다", "즉시 전화를 끊고 해당 기관의 공식 번호로 확인한다", "요구하는 계좌로 일단 돈을 보낸다", "주민등록번호를 알려준다"],
    correctIndex: 1,
    difficulty: 'EASY',
    explanation: "의심스러운 전화는 즉시 끊는 것이 가장 안전하며, 반드시 공식 대표번호로 사실 여부를 확인해야 합니다."
  },
  {
    id: 5,
    question: "다음 중 스미싱(Smishing)의 설명으로 옳은 것은?",
    options: ["이메일을 이용한 사기", "문자메시지(SMS)와 피싱의 합성어", "음성 통화를 이용한 사기", "PC 화면을 해킹하는 것"],
    correctIndex: 1,
    difficulty: 'MEDIUM',
    explanation: "스미싱은 SMS(문자메시지)를 통해 가짜 링크 접속을 유도하는 사기 수법입니다."
  },
  {
    id: 6,
    question: "공용 와이파이 사용 시 주의할 점은?",
    options: ["금융 거래나 로그인을 자제한다", "항상 켜둔다", "모든 파일 공유를 허용한다", "비밀번호가 없는 와이파이를 주로 쓴다"],
    correctIndex: 0,
    difficulty: 'MEDIUM',
    explanation: "공용 와이파이는 해킹 위험이 높으므로 개인정보 입력이나 금융 거래는 피해야 합니다."
  },
  {
    id: 7,
    question: "랜섬웨어(Ransomware)란 무엇인가요?",
    options: ["컴퓨터 속도를 높여주는 프로그램", "데이터를 암호화하여 인질로 잡고 돈을 요구하는 악성코드", "무료 백신 프로그램", "PC 청소 프로그램"],
    correctIndex: 1,
    difficulty: 'HARD',
    explanation: "랜섬웨어는 시스템을 잠그거나 데이터를 암호화해 사용할 수 없게 만든 뒤, 이를 풀기 위한 대가를 요구합니다."
  },
  {
    id: 8,
    question: "https:// 사이트와 http:// 사이트의 차이점은?",
    options: ["차이 없다", "https는 데이터가 암호화되어 전송된다", "http가 더 보안이 강력하다", "https는 유료 사이트다"],
    correctIndex: 1,
    difficulty: 'HARD',
    explanation: "HTTPS(Secure)는 데이터를 암호화하여 전송하므로 중간에서 정보를 가로채도 내용을 알 수 없어 더 안전합니다."
  },
  {
    id: 9,
    question: "계정이 해킹당한 것 같을 때 가장 먼저 해야 할 일은?",
    options: ["SNS에 글을 올린다", "계정을 삭제한다", "비밀번호를 변경하고 모든 기기에서 로그아웃한다", "경찰서에 간다"],
    correctIndex: 2,
    difficulty: 'MEDIUM',
    explanation: "즉시 비밀번호를 변경하여 해커의 재접속을 막고, 연결된 모든 기기에서 로그아웃해야 피해를 줄일 수 있습니다."
  },
  {
    id: 10,
    question: "소셜 엔지니어링(Social Engineering) 해킹 기법의 특징은?",
    options: ["복잡한 코드를 사용한다", "슈퍼컴퓨터를 사용한다", "사람의 심리적 취약점을 이용해 정보를 빼낸다", "물리적으로 컴퓨터를 부순다"],
    correctIndex: 2,
    difficulty: 'HARD',
    explanation: "기술적인 시스템 공격이 아닌, 사람의 신뢰나 공포심, 호기심 등을 이용해 비밀번호 등을 알아내는 기법입니다."
  }
];

export const SCHOOL_ACCIDENTS = [
  { title: "중고거래 사기", desc: "SNS나 중고거래 앱에서 선입금 유도 후 잠적. 안전결제 미사용 시 위험." },
  { title: "ID/PW 공유", desc: "게임 아이템이나 대리 육성을 핑계로 친구에게 비번을 알려줬다가 계정 도용." },
  { title: "몸캠 피싱", desc: "영상 통화 유도 후 녹화된 영상을 유포하겠다며 협박. 낯선 사람과 영상통화 금지." },
  { title: "무료 와이파이 해킹", desc: "카페 등에서 가짜 와이파이를 만들어 접속한 학생의 로그인 정보 탈취." },
  { title: "대리 입금(대출)", desc: "SNS에서 수고비를 준다며 돈을 빌려달라고 하거나, 내 통장을 빌려주는 행위(범죄 연루)." }
];

export const CHECKLIST = [
  "내 비밀번호는 8자리 이상이며 특수문자를 포함한다.",
  "주요 포털 및 SNS에 2단계 인증을 설정했다.",
  "출처를 모르는 문자 속 링크는 절대 누르지 않는다.",
  "스마트폰 운영체제(OS)와 백신 앱을 최신으로 유지한다.",
  "개인정보(전화번호, 주소 등)를 SNS 전체공개로 하지 않는다."
];