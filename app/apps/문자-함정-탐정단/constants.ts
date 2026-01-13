import { ConceptCard, GameCard, QuizQuestion, TimelineEvent } from './types';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'c1',
    title: '피싱 (Phishing)',
    description: '개인정보(Private Data)와 낚시(Fishing)의 합성어. 이메일이나 메신저로 신뢰할 수 있는 사람/기업을 사칭해 가짜 사이트로 유도, 정보를 탈취합니다.',
    tags: ['이메일', '가짜사이트', '로그인유도'],
    icon: 'mail'
  },
  {
    id: 'c2',
    title: '스미싱 (Smishing)',
    description: '문자메시지(SMS)와 피싱(Phishing)의 합성어. 무료 쿠폰, 택배 조회, 청첩장 등을 사칭한 문자의 단축 URL을 클릭하게 하여 악성 앱을 설치합니다.',
    tags: ['SMS', '단축URL', '악성앱'],
    icon: 'message-square'
  },
  {
    id: 'c3',
    title: '파밍 (Pharming)',
    description: '악성코드에 감염된 PC/폰을 조작하여, 정상적인 주소(URL)를 입력해도 가짜 사이트로 연결되게 만드는 수법입니다.',
    tags: ['DNS변조', '가짜사이트', '자동납치'],
    icon: 'globe'
  },
  {
    id: 'c4',
    title: '메신저 피싱',
    description: '카카오톡, 페이스북 등 가족이나 지인을 사칭해 "급하다"며 금전 송금이나 기프트카드 번호를 요구합니다.',
    tags: ['지인사칭', '금전요구', '카톡'],
    icon: 'users'
  }
];

export const RED_FLAGS_CHECKLIST = [
  "출처가 불분명한 단축 URL (bit.ly 등)",
  "지나치게 긴급한 행동 요구 (즉시, 당장)",
  "해외 결제 승인 알림 문자",
  "모르는 번호로 온 가족/친구의 폰 고장 연락",
  "공공기관/택배 사칭 + 앱 설치 유도",
  "맞춤법이 어색하거나 번역투 문장"
];

export const GAME_CARDS: GameCard[] = [
  {
    id: 'g1',
    sender: '국제발신',
    text: '[해외승인] 987,000원 결제 완료. 본인 아닐 시 즉시 문의: 070-XXXX-XXXX',
    channel: '문자',
    riskLabel: '위험',
    difficulty: '쉬움',
    redFlags: ['해외 결제 위장', '070 번호 유도', '불안감 조성'],
    allReasons: ['해외 결제 위장', '070 번호 유도', '정상적인 카드사 알림', '지인 사칭'],
    bestAction: '해당 번호로 전화하지 말고, 카드사 공식 앱이나 대표 번호로 확인한다.',
    explanation: '전형적인 스미싱입니다. 전화를 걸면 개인정보를 요구하거나 악성 앱 설치를 유도합니다.',
    conceptTags: ['스미싱', '공공기관사칭']
  },
  {
    id: 'g2',
    sender: '엄마',
    text: '아들, 폰 액정이 깨져서 수리 맡겼어. 임시 폰이라 문자만 돼. 급하게 30만원만 보내줘.',
    channel: 'DM',
    riskLabel: '위험',
    difficulty: '쉬움',
    redFlags: ['폰 고장 핑계', '금전 요구', '전화 회피'],
    allReasons: ['폰 고장 핑계', '금전 요구', '단축 URL 포함', '정상적인 대화'],
    bestAction: '반드시 엄마의 원래 번호로 직접 전화해서 확인한다.',
    explanation: '메신저 피싱의 대표 사례입니다. 절대 송금하지 말고 본인 확인을 먼저 하세요.',
    conceptTags: ['메신저피싱', '지인사칭']
  },
  {
    id: 'g3',
    sender: 'CJ대한통운',
    text: '[배송불가] 주소지 불명으로 배송이 지연되고 있습니다. 주소 수정: bit.ly/Xyz123',
    channel: '문자',
    riskLabel: '위험',
    difficulty: '쉬움',
    redFlags: ['단축 URL', '개인정보 입력 유도'],
    allReasons: ['단축 URL', '개인정보 입력 유도', '해외 번호', '금전 요구'],
    bestAction: '링크를 클릭하지 말고 택배사 공식 앱에서 운송장 번호를 조회한다.',
    explanation: '택배 스미싱입니다. 링크 클릭 시 가짜 사이트로 연결되거나 악성 앱이 설치됩니다.',
    conceptTags: ['스미싱', '택배사칭']
  },
  {
    id: 'g4',
    sender: '학교 알리미',
    text: '[긴급] 2학년 수학여행 참가 동의서가 아직 제출되지 않았습니다. 오늘까지 확인 요망. 첨부파일: 동의서.apk',
    channel: '문자',
    riskLabel: '위험',
    difficulty: '보통',
    redFlags: ['apk 파일 설치 유도', '긴급성 강조'],
    allReasons: ['apk 파일 설치 유도', '긴급성 강조', '해외 발신', '지인 사칭'],
    bestAction: 'apk 파일은 절대 설치하지 않는다. 선생님께 직접 확인한다.',
    explanation: '학교를 사칭해 악성 앱(.apk) 설치를 유도하는 스미싱입니다. 문자로 apk를 보내는 경우는 없습니다.',
    conceptTags: ['스미싱', '악성앱']
  },
  {
    id: 'g5',
    sender: '담임 선생님',
    text: '우리 반 단톡방이야~ 내일 준비물 공지 올려뒀으니까 확인해^^ open.kakao.com/...',
    channel: '단톡',
    riskLabel: '조건부',
    difficulty: '도전',
    redFlags: ['오픈채팅방 링크', '프로필 사진 확인 필요'],
    allReasons: ['오픈채팅방 링크', 'apk 파일', '금전 요구', '정상적인 공지'],
    bestAction: '선생님 프로필이 맞는지 확인하고, 친구들에게도 동일한 초대가 왔는지 교차 검증한다.',
    explanation: '선생님 사칭 계정일 수 있습니다. 오픈채팅방 링크는 주의가 필요하며, 실제 선생님인지 확인해야 합니다.',
    conceptTags: ['메신저피싱', '사칭']
  },
  {
    id: 'g6',
    sender: 'Web발신',
    text: '[국민건강보험] 건강검진 진단결과 통보서 발송완료. 내용확인: www.nhis-check.com',
    channel: '문자',
    riskLabel: '위험',
    difficulty: '보통',
    redFlags: ['교묘한 유사 도메인', '정보 입력 유도'],
    allReasons: ['교묘한 유사 도메인', 'apk 파일', '지인 사칭', '정상 문자'],
    bestAction: '링크를 누르지 말고 건강보험공단 공식 앱(The건강보험)을 통해 확인한다.',
    explanation: '공식 주소(nhis.or.kr)와 유사하게 만든 피싱 사이트입니다.',
    conceptTags: ['스미싱', '공공기관사칭']
  },
  {
    id: 'g7',
    sender: '친구 A',
    text: '야 대박ㅋㅋ 너 이 사진 나온거 봤어? 빨리 확인해봐 bit.ly/photo_leak',
    channel: 'DM',
    riskLabel: '위험',
    difficulty: '보통',
    redFlags: ['호기심 유발', '단축 URL', '해킹된 계정 의심'],
    allReasons: ['호기심 유발', '단축 URL', '금전 요구', '정상 대화'],
    bestAction: '링크 클릭 금지. 친구에게 전화나 다른 메신저로 직접 물어본다.',
    explanation: '계정이 해킹당한 친구가 보내는 전형적인 피싱 메시지입니다. 클릭 시 내 계정도 털립니다.',
    conceptTags: ['피싱', '계정탈취']
  },
  {
    id: 'g8',
    sender: '114',
    text: '[데이터] 데이터 50% 소진. 잔여량 확인은 고객센터 앱을 참고하세요.',
    channel: '문자',
    riskLabel: '안전',
    difficulty: '보통',
    redFlags: [],
    allReasons: ['URL 없음', '정보 제공 목적', '공식 번호', '단축 URL'],
    bestAction: '정보성 메시지이므로 확인만 하면 된다.',
    explanation: 'URL이 없고 단순 정보 제공을 하는 114 문자는 안전합니다.',
    conceptTags: ['안전']
  },
  {
    id: 'g9',
    sender: '검찰청',
    text: '귀하는 전자금융거래법 위반으로 고발되었습니다. 사건조회: prose-go.kr',
    channel: '문자',
    riskLabel: '위험',
    difficulty: '쉬움',
    redFlags: ['공공기관 사칭', '가짜 도메인', '협박성'],
    allReasons: ['공공기관 사칭', '가짜 도메인', '안전한 링크', '정보 제공'],
    bestAction: '무시하고 해당 번호를 차단한다. 검찰은 문자로 사건 조회를 보내지 않는다.',
    explanation: '검찰청(spo.go.kr)을 사칭한 피싱입니다.',
    conceptTags: ['스미싱', '공공기관사칭']
  },
  {
    id: 'g10',
    sender: '중고나라 구매자',
    text: '입금하려는데 안전결제 오류가 나네요ㅠ 이 링크로 결제창 열어주세요. pay-safe.cc/item',
    channel: 'DM',
    riskLabel: '위험',
    difficulty: '도전',
    redFlags: ['외부 링크 결제 유도', '피싱 사이트'],
    allReasons: ['외부 링크 결제 유도', '안전결제 위장', '정상 거래', '폰 고장 핑계'],
    bestAction: '절대 링크를 열지 말고 플랫폼 내 결제 시스템만 이용한다.',
    explanation: '안전결제 사이트를 위장한 피싱 사이트로 유도하여 정보를 탈취합니다.',
    conceptTags: ['피싱', '사기']
  },
  {
    id: 'g11',
    sender: '모르는 번호',
    text: '안녕하세요. 윗집입니다. 화장실 누수 때문에 연락드렸어요. 사진 확인해주세요. [사진]',
    channel: '문자',
    riskLabel: '조건부',
    difficulty: '도전',
    redFlags: ['링크가 있다면 위험', '이미지 위장 악성코드 가능성'],
    allReasons: ['링크 포함 여부', '문맥 확인 필요', 'apk 파일', '금전 요구'],
    bestAction: '링크가 포함되어 있다면 절대 클릭 금지. 경비실이나 부모님께 먼저 확인.',
    explanation: '최근 누수/층간소음을 가장한 스미싱이 늘고 있습니다. URL이 섞여있다면 100% 스미싱입니다.',
    conceptTags: ['스미싱', '생활밀착형']
  },
  {
    id: 'g12',
    sender: '카드사',
    text: '카드 승인 거절. 잔액부족. 1588-XXXX',
    channel: '문자',
    riskLabel: '안전',
    difficulty: '보통',
    redFlags: [],
    allReasons: ['URL 없음', '대표번호 안내', '단축 URL', 'apk 파일'],
    bestAction: '실제 카드 사용 시점이 맞다면 정상. 의심되면 대표번호를 검색해서 전화.',
    explanation: 'URL이 없고 대표번호로 안내하는 경우 대체로 안전하지만, 발신 번호도 조작 가능하므로 주의는 필요합니다.',
    conceptTags: ['안전']
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2000s',
    title: '나이지리아 왕자 메일',
    description: '“거액의 유산을 나눠주겠다”며 수수료 송금을 요구하는 고전적 이메일 피싱.',
    category: '피싱',
    quizQuestion: '이 수법은 주로 어떤 경로로 유포되었나요?',
    quizAnswer: '이메일'
  },
  {
    year: '2012',
    title: '초기 스미싱 등장',
    description: '“돌잔치 초대장”, “청첩장”을 가장한 문자 메시지로 소액결제 피해 급증.',
    category: '스미싱',
    quizQuestion: '이때 주로 탈취된 정보는?',
    quizAnswer: '소액결제 인증번호'
  },
  {
    year: '2015~',
    title: '메신저 피싱 급증',
    description: '카카오톡 등에서 가족을 사칭해 “폰 고장” 핑계로 기프트카드/송금 요구.',
    category: '메신저피싱',
    quizQuestion: '가족 사칭 시 가장 먼저 해야 할 행동은?',
    quizAnswer: '직접 전화 확인'
  },
  {
    year: '2020~',
    title: '정부지원금/택배 사칭',
    description: '코로나19 지원금, 택배 물량 증가를 틈타 공공기관 및 택배사 사칭 스미싱 폭증.',
    category: '스미싱',
    quizQuestion: '공공기관은 문자로 URL을 보내 앱 설치를 유도한다? (O/X)',
    quizAnswer: 'X'
  },
  {
    year: '2023~',
    title: '큐싱(Qshing) 주의보',
    description: 'QR코드를 찍으면 악성 사이트로 이동하거나 악성 앱이 설치되는 신종 수법.',
    category: '큐싱',
    quizQuestion: '공공장소 QR코드 이용 시 주의할 점은?',
    quizAnswer: '출처 확인'
  }
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    type: '객관식',
    question: '스미싱(Smishing)은 무엇과 무엇의 합성어인가?',
    options: ['Smart + Fishing', 'SMS + Phishing', 'Smile + Fishing', 'Small + Phishing'],
    answer: 'SMS + Phishing',
    explanation: '스미싱은 문자메시지(SMS)를 이용한 피싱(Phishing) 공격입니다.'
  },
  {
    id: 2,
    type: '객관식',
    question: '출처가 불분명한 문자의 URL을 클릭했을 때 발생할 수 있는 일이 아닌 것은?',
    options: ['악성 앱 설치', '개인정보 유출', '스마트폰 배터리 충전', '가짜 사이트 연결'],
    answer: '스마트폰 배터리 충전',
    explanation: 'URL 클릭만으로 배터리가 충전되지는 않습니다. 나머지는 모두 보안 위협입니다.'
  },
  {
    id: 3,
    type: '단답형',
    question: '정상적인 홈페이지 주소로 접속해도 가짜 사이트로 연결되어 정보를 탈취하는 수법은?',
    answer: '파밍',
    explanation: 'DNS 변조 등을 통해 사용자를 속이는 기법을 파밍(Pharming)이라고 합니다.'
  },
  {
    id: 4,
    type: '객관식',
    question: '다음 중 "메신저 피싱"의 의심 신호가 아닌 것은?',
    options: ['평소와 다른 말투', '폰 고장 핑계로 통화 거절', '급한 송금 요구', '직접 만나서 이야기하자고 함'],
    answer: '직접 만나서 이야기하자고 함',
    explanation: '피싱범은 정체가 드러날까 봐 직접 만나는 것을 피하고 비대면 송금을 유도합니다.'
  },
  {
    id: 5,
    type: '서술형',
    question: '모르는 번호로 "카드 해외 결제" 문자가 왔다. 가장 먼저 해야 할 행동과 그 이유는?',
    answer: ['공식', '전화'], // Keywords to check
    explanation: '문자에 적힌 번호가 아닌, 카드 뒷면이나 공식 앱의 "공식" 번호로 "전화"하여 확인해야 합니다.'
  },
  {
    id: 6,
    type: '객관식',
    question: '안드로이드 폰에서 출처를 알 수 없는 앱(.apk)이 설치되지 않게 하려면?',
    options: ['보안 설정에서 "출처를 알 수 없는 앱 설치" 차단', '비행기 모드 실행', '화면 밝기 조절', '블루투스 끄기'],
    answer: '보안 설정에서 "출처를 알 수 없는 앱 설치" 차단',
    explanation: '보안 설정을 통해 공식 스토어 외의 앱 설치를 막아야 합니다.'
  },
  {
    id: 7,
    type: '단답형',
    question: 'QR코드를 이용한 피싱 수법을 무엇이라 하는가?',
    answer: '큐싱',
    explanation: 'QR Code + Phishing = Qshing(큐싱) 입니다.'
  },
  {
    id: 8,
    type: '서술형',
    question: '학교 단톡방에 선생님이 "필독 공지"라며 링크를 올렸다. 프로필 사진이 없고 말투가 어색하다. 어떻게 해야 할까?',
    answer: ['확인', '전화'],
    explanation: '다른 친구에게 물어보거나 선생님께 직접 "전화" 등으로 "확인"해야 합니다.'
  },
  {
    id: 9,
    type: '객관식',
    question: '피싱 사이트와 정상 사이트를 구별하는 방법 중 틀린 것은?',
    options: ['자물쇠 아이콘 확인', 'URL 주소 철자 확인', '화려한 디자인이면 무조건 정상', '공식 포털 검색 이용'],
    answer: '화려한 디자인이면 무조건 정상',
    explanation: '피싱 사이트도 디자인을 정교하게 모방하므로 디자인만으로 판단해서는 안 됩니다.'
  },
  {
    id: 10,
    type: '객관식',
    question: '다음 중 2단계 인증(2FA)의 예시가 아닌 것은?',
    options: ['비밀번호 입력 후 문자로 온 코드 입력', '지문 인식', '비밀번호 입력', 'OTP 앱 코드 입력'],
    answer: '비밀번호 입력',
    explanation: '비밀번호 입력은 1단계 인증(지식 기반)이며, 2단계 인증은 서로 다른 두 가지 요소를 조합하는 것입니다.'
  }
];