import { ConceptCard, CardCategory, QuizQuestion, Difficulty, SimulationScenario } from './types';

export const LEVEL_TITLES = ['네트워크 초보', 'LAN 마스터', '통신 전문가'];

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'c1',
    term: 'LAN (근거리 통신망)',
    category: CardCategory.GENERAL,
    definition: '가정, 학교, 회사 등 가까운 거리에 있는 컴퓨터들을 연결한 네트워크',
    details: 'Local Area Network의 약자예요. 유선 LAN과 무선 LAN(Wi-Fi)으로 나뉩니다.'
  },
  {
    id: 'c2',
    term: '유선 네트워크의 안정성',
    category: CardCategory.WIRED,
    definition: '케이블로 직접 연결되어 신호가 안정적이고 빠름',
    details: '전파 방해가 없어서 대용량 데이터를 주고받거나 중요한 서버를 운영할 때 필수적입니다.'
  },
  {
    id: 'c3',
    term: '무선 네트워크의 이동성',
    category: CardCategory.WIRELESS,
    definition: '선 없이 자유롭게 이동하며 인터넷 접속 가능',
    details: '스마트폰, 태블릿 등 모바일 기기에 필수적이지만, 벽이나 장애물에 의해 신호가 약해질 수 있어요.'
  },
  {
    id: 'c4',
    term: '보안성 비교',
    category: CardCategory.GENERAL,
    definition: '유선 > 무선',
    details: '유선은 물리적으로 선에 접속해야 해킹이 가능하지만, 무선은 공중으로 신호가 퍼져서 해킹 위험이 상대적으로 높습니다.'
  },
  {
    id: 'c5',
    term: '광케이블',
    category: CardCategory.WIRED,
    definition: '빛을 이용하여 정보를 전달하는 케이블',
    details: '구리선보다 훨씬 빠르고 멀리까지 데이터를 보낼 수 있어요. 해저 케이블의 주재료입니다.'
  },
  {
    id: 'c6',
    term: 'Wi-Fi (와이파이)',
    category: CardCategory.WIRELESS,
    definition: '무선 접속 장치(AP)가 설치된 곳에서 전파를 이용해 통신',
    details: '전파 간섭이 발생할 수 있어요. 전자레인지나 블루투스 기기와 주파수가 겹치면 속도가 느려질 수 있습니다.'
  },
  {
    id: 'c7',
    term: '비용과 설치',
    category: CardCategory.GENERAL,
    definition: '초기 설치는 무선이 간편, 유선은 복잡',
    details: '유선은 벽을 뚫거나 선을 정리해야 해서 설치가 어렵지만, 유지보수 비용은 상황에 따라 다릅니다.'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 'q1',
    question: '다음 중 유선 네트워크의 장점이 아닌 것은?',
    options: ['전송 속도가 빠르다', '신호가 안정적이다', '이동이 자유롭다', '보안성이 우수하다'],
    correctAnswer: 2,
    explanation: '이동이 자유로운 것은 무선 네트워크의 가장 큰 장점입니다. 유선은 선에 묶여 있어 이동이 불편합니다.',
    difficulty: Difficulty.EASY
  },
  {
    id: 'q2',
    question: '은행 서버실처럼 보안과 안정성이 최우선인 곳에서 주로 사용하는 방식은?',
    options: ['Wi-Fi', 'Bluetooth', '유선 LAN (광케이블/이더넷)', 'NFC'],
    correctAnswer: 2,
    explanation: '중요한 데이터를 다루는 곳은 해킹 위험이 적고 연결이 끊기지 않는 유선 방식을 선호합니다.',
    difficulty: Difficulty.EASY
  },
  {
    id: 'q3',
    question: '무선 네트워크에서 발생할 수 있는 "간섭" 현상의 원인이 아닌 것은?',
    options: ['전자레인지 사용', '다른 집의 Wi-Fi 신호', '블루투스 기기', '광케이블의 빛 신호'],
    correctAnswer: 3,
    explanation: '광케이블은 빛을 이용하며 유선 내부에 있어 외부 전파 간섭을 받지 않습니다.',
    difficulty: Difficulty.NORMAL
  },
  {
    id: 'q4',
    question: '광케이블의 특징으로 옳은 것은?',
    options: ['전기 신호로 데이터를 보낸다', '구리선보다 속도가 느리다', '빛의 전반사 원리를 이용한다', '거리가 멀어질수록 신호 손실이 매우 크다'],
    correctAnswer: 2,
    explanation: '광케이블은 빛의 전반사를 이용해 데이터를 빛의 속도로 아주 멀리까지 보냅니다.',
    difficulty: Difficulty.NORMAL
  },
  {
    id: 'q5',
    question: '5G, 6G와 같은 이동통신 기술은 어떤 네트워크에 해당할까?',
    options: ['유선 네트워크', '무선 네트워크', '위성 전용 네트워크', '인트라넷'],
    correctAnswer: 1,
    explanation: '스마트폰이 기지국과 전파를 주고받으므로 무선 네트워크(WWAN)의 일종입니다.',
    difficulty: Difficulty.HARD
  }
];

export const SCENARIOS: SimulationScenario[] = [
  {
    id: 's1',
    situation: '당신은 프로게이머 결승전에 참가했습니다. 0.1초의 렉도 허용할 수 없는 상황!',
    task: '어떤 네트워크로 컴퓨터를 연결할까요?',
    correctChoice: 'wired',
    feedbackCorrect: '정답! 유선 연결은 지연 시간(Ping)이 가장 짧고 안정적이라 게임 대회 필수입니다.',
    feedbackWrong: '아차! 무선은 순간적인 신호 불안정으로 렉이 걸려 경기에서 질 수 있어요.'
  },
  {
    id: 's2',
    situation: '넓은 카페를 운영하려고 합니다. 손님들이 자유롭게 자리를 옮기며 노트북을 쓰게 하고 싶어요.',
    task: '어떤 네트워크 환경을 구축할까요?',
    correctChoice: 'wireless',
    feedbackCorrect: '훌륭해요! 카페 손님들에게는 이동성과 편의성이 가장 중요하죠. Wi-Fi가 정답입니다.',
    feedbackWrong: '유선을 선택하면 손님들이 자리마다 랜선을 꽂아야 해요. 커피를 쏟을 수도 있고 너무 불편하겠죠?'
  }
];