import { ConceptCard, PuzzleStep, QuizQuestion, ThinkingPrompt } from './types';

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'domain',
    title: '도메인 (Domain)',
    content: '사람이 기억하기 쉬운 문자 형태의 인터넷 주소입니다. 예: www.ebs.co.kr',
    icon: 'globe',
    color: 'bg-blue-100 border-blue-500 text-blue-900',
  },
  {
    id: 'dns',
    title: 'DNS',
    content: '도메인 이름을 컴퓨터가 이해하는 IP 주소로 변환해주는 시스템입니다. 인터넷의 전화번호부 역할을 합니다.',
    icon: 'server',
    color: 'bg-indigo-100 border-indigo-500 text-indigo-900',
  },
  {
    id: 'ip',
    title: 'IP 주소',
    content: '네트워크에 연결된 기기를 식별하는 고유한 번호입니다. 예: 203.248.xxx.xxx',
    icon: 'map-pin',
    color: 'bg-green-100 border-green-500 text-green-900',
  },
  {
    id: 'packet',
    title: '패킷 (Packet)',
    content: '데이터 전송을 위해 작게 쪼갠 데이터 조각입니다. 헤더(주소 정보)와 페이로드(데이터)로 구성됩니다.',
    icon: 'package',
    color: 'bg-yellow-100 border-yellow-500 text-yellow-900',
  },
  {
    id: 'router',
    title: '라우터 (Router)',
    content: '패킷이 목적지까지 가는 최적의 경로를 찾아주는 장비입니다. 네비게이션과 비슷합니다.',
    icon: 'router',
    color: 'bg-orange-100 border-orange-500 text-orange-900',
  },
  {
    id: 'reassembly',
    title: '재조립 (Reassembly)',
    content: '목적지에 도착한 뒤섞인 패킷들을 순서 번호에 맞춰 원래 데이터로 다시 합치는 과정입니다.',
    icon: 'layers',
    color: 'bg-purple-100 border-purple-500 text-purple-900',
  },
];

export const PUZZLE_STEPS: PuzzleStep[] = [
  { id: '1', label: '주소 입력', description: '사용자가 브라우저에 도메인 주소(URL)를 입력합니다.' },
  { id: '2', label: 'DNS 조회', description: 'DNS 서버에게 도메인의 IP 주소를 물어봅니다.' },
  { id: '3', label: 'IP 획득', description: 'DNS로부터 목적지의 IP 주소를 받습니다.' },
  { id: '4', label: '패킷 분할', description: '전송할 데이터를 작은 패킷 단위로 쪼갭니다.' },
  { id: '5', label: '라우팅 전송', description: '라우터를 거쳐 인터넷망을 통해 패킷이 이동합니다.' },
  { id: '6', label: '재조립', description: '목적지에서 도착한 패킷을 순서대로 조립하여 원본을 만듭니다.' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    type: 'ordering',
    question: '데이터 전송의 올바른 순서를 나열하세요.',
    options: ['IP 획득', '라우팅', '주소 입력', '재조립'],
    correctAnswer: ['주소 입력', 'IP 획득', '라우팅', '재조립'],
    explanation: '먼저 주소를 입력하고, IP를 알아낸 뒤, 라우터를 통해 이동하고, 마지막에 재조립합니다.',
  },
  {
    id: 2,
    type: 'multiple_choice',
    question: '도메인 이름을 IP 주소로 변환해주는 시스템은?',
    options: ['DHCP', 'DNS', 'HTTP', 'FTP'],
    correctAnswer: 'DNS',
    explanation: 'DNS(Domain Name System)는 도메인 이름을 IP 주소로 변환합니다.',
  },
  {
    id: 3,
    type: 'multiple_choice',
    question: '데이터를 전송하기 위해 작게 쪼갠 단위는 무엇인가요?',
    options: ['비트', '바이트', '패킷', '프레임'],
    correctAnswer: '패킷',
    explanation: '네트워크 계층에서 데이터 전송의 기본 단위는 패킷입니다.',
  },
  {
    id: 4,
    type: 'short_answer',
    question: '패킷이 목적지까지 가는 최적의 경로를 찾아주는 장비의 이름은?',
    correctAnswer: '라우터',
    explanation: '라우터(Router)는 경로 설정(Routing)을 담당합니다.',
  },
  {
    id: 5,
    type: 'multiple_choice',
    question: '패킷 교환 방식의 장점이 아닌 것은?',
    options: ['회선을 독점하지 않는다', '장애 발생 시 우회 가능하다', '전송 속도가 항상 일정하다', '다수의 사용자가 공유 가능하다'],
    correctAnswer: '전송 속도가 항상 일정하다',
    explanation: '네트워크 혼잡도에 따라 전송 속도가 변할 수 있습니다.',
  },
  {
    id: 6,
    type: 'ordering',
    question: '웹사이트 접속 과정 순서',
    options: ['웹 페이지 표시', 'DNS 요청', '서버 응답', 'URL 입력'],
    correctAnswer: ['URL 입력', 'DNS 요청', '서버 응답', '웹 페이지 표시'],
    explanation: '입력 -> DNS -> 서버요청/응답 -> 표시 순서입니다.',
  },
  {
    id: 7,
    type: 'multiple_choice',
    question: '도착한 패킷들의 순서가 뒤섞였을 때 필요한 과정은?',
    options: ['폐기', '재전송', '재조립', '압축'],
    correctAnswer: '재조립',
    explanation: '패킷 헤더의 순서 번호를 이용해 재조립합니다.',
  },
  {
    id: 8,
    type: 'short_answer',
    question: '숫자로 된 인터넷상의 주소를 무엇이라 하는가? (영어 약자 2글자)',
    correctAnswer: 'IP',
    explanation: 'Internet Protocol Address, 즉 IP 주소입니다.',
  },
  {
    id: 9,
    type: 'multiple_choice',
    question: '다음 중 도메인 이름의 예시로 적절한 것은?',
    options: ['192.168.0.1', 'www.google.com', 'FF:FF:FF:FF', 'localhost'],
    correctAnswer: 'www.google.com',
    explanation: '문자로 된 주소 체계가 도메인입니다.',
  },
  {
    id: 10,
    type: 'essay',
    question: 'DNS 서버가 고장난다면 어떤 일이 발생할지 서술하시오.',
    correctAnswer: '도메인 이름으로 사이트에 접속할 수 없게 되지만, IP 주소를 직접 입력하면 접속할 수 있다.',
    explanation: '전화번호부가 사라진 것과 같아서 번호(IP)를 외우고 있다면 통화(접속)가 가능합니다.',
  },
];

export const THINKING_PROMPTS: ThinkingPrompt[] = [
  {
    id: 't1',
    type: 'condition',
    title: '조건 바꾸기',
    question: '만약 전 세계의 DNS 서버가 갑자기 10배 느려진다면, 사용자는 웹 서핑 과정 중 "어느 시점"에서 가장 큰 답답함을 느낄까요? 구체적인 상황을 들어 설명해보세요.',
  },
  {
    id: 't2',
    type: 'counter',
    title: '반례 찾기',
    question: '우리는 보통 도메인 주소(예: www.naver.com)를 씁니다. 그렇다면 도메인 없이도 웹사이트에 접속할 수 있는 상황은 언제일까요? 그리고 왜 평소에는 그렇게 하지 않을까요?',
  },
  {
    id: 't3',
    type: 'design',
    title: '적용 설계',
    question: '학교 홈페이지 접속이 자주 실패한다고 가정해봅시다. 여러분이 네트워크 관리자라면 [내 컴퓨터] -> [학교 서버] 까지의 경로 중 어떤 순서로 문제를 점검해 보겠습니까? (퍼즐 단계를 참고하세요)',
  },
];
