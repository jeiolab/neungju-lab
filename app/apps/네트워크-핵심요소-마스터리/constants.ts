import { Concept, Question, SimulationResult } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'c1',
    title: '네트워크 (Network)',
    definition: '두 대 이상의 컴퓨팅 시스템이 전송 매체로 연결되어 정보를 주고받는 통신망',
    keywords: ['연결', '통신', '공유'],
    example: '우리 반 친구들이 단톡방에서 급식 사진을 공유하는 상황',
    misconception: {
      wrong: '인터넷과 네트워크는 같은 말이다?',
      right: '인터넷은 전 세계의 수많은 네트워크가 연결된 가장 거대한 네트워크입니다.'
    },
    checkQuestion: {
      question: '네트워크의 가장 기본적인 구성 요소가 아닌 것은?',
      options: ['컴퓨팅 시스템', '전송 매체', '전기 요금', '네트워크 장비'],
      answer: '전기 요금'
    }
  },
  {
    id: 'c2',
    title: '컴퓨팅 시스템',
    definition: '네트워크를 통해 정보를 생성하고 송수신하는 주체',
    keywords: ['PC/스마트폰', '서버', '클라이언트'],
    example: '수행평가 파일을 작성하는 내 노트북',
    misconception: {
      wrong: '컴퓨터만 컴퓨팅 시스템이다?',
      right: '스마트폰, 태블릿, AI 스피커, 스마트 워치도 모두 컴퓨팅 시스템입니다.'
    },
    checkQuestion: {
      question: '정보를 요청하는 역할을 하는 시스템을 무엇이라 할까요?',
      options: ['서버', '클라이언트', '라우터', '스위치'],
      answer: '클라이언트'
    }
  },
  {
    id: 'c3',
    title: '전송 매체',
    definition: '데이터가 이동하는 물리적인 통로',
    keywords: ['유선(케이블)', '무선(전파)', '광섬유'],
    example: '교실 천장에 달린 와이파이 공유기와 내 폰 사이의 전파',
    misconception: {
      wrong: '무선이 유선보다 무조건 좋다?',
      right: '무선은 편리하지만 유선보다 안정성과 보안성이 떨어질 수 있습니다.'
    },
    checkQuestion: {
      question: '빛의 신호를 이용하여 데이터를 아주 빠르게 전송하는 매체는?',
      options: ['랜선(UTP)', '동축 케이블', '광케이블', '전파'],
      answer: '광케이블'
    }
  },
  {
    id: 'c4',
    title: '네트워크 장비',
    definition: '데이터의 이동 경로를 결정하거나 신호를 증폭하는 중계 장치',
    keywords: ['접속', '중계', '경로배정'],
    example: '학교 전산실에 윙윙거리는 검은색 기계들',
    misconception: {
      wrong: '공유기만 있으면 인터넷이 된다?',
      right: '외부 네트워크와 연결하려면 모뎀이나 라우터 같은 추가 장비가 필요합니다.'
    },
    checkQuestion: {
      question: '네트워크 장비의 주 역할이 아닌 것은?',
      options: ['신호 증폭', '경로 설정', '데이터 생성', '연결 확장'],
      answer: '데이터 생성'
    }
  },
  {
    id: 'c5',
    title: '공유기 / 스위치 / 라우터',
    definition: '네트워크의 교통 정리 경찰관들',
    keywords: ['IP주소 할당(공유기)', '목적지 전달(스위치)', '최적 경로(라우터)'],
    example: '우리 집 거실에 있는 안테나 달린 기계(유무선 공유기)',
    misconception: {
      wrong: '스위치와 라우터는 같은 것이다?',
      right: '스위치는 내부 네트워크 안에서 전달, 라우터는 서로 다른 네트워크를 연결합니다.'
    },
    checkQuestion: {
      question: '서로 다른 네트워크(예: 우리집 - 인터넷세상)를 연결해주는 장비는?',
      options: ['허브', '스위치', '라우터', '랜카드'],
      answer: '라우터'
    }
  },
  {
    id: 'c6',
    title: '프로토콜 (Protocol)',
    definition: '컴퓨터끼리 정보를 주고받기 위해 정해둔 약속(규약)',
    keywords: ['규칙', '언어', 'HTTP/TCP'],
    example: '한국어로 말하면 한국어로 대답해야 통하는 것과 같음',
    misconception: {
      wrong: '프로토콜은 하드웨어 장비 이름이다?',
      right: '프로토콜은 소프트웨어적인 통신 규칙입니다.'
    },
    checkQuestion: {
      question: '웹 브라우저에서 홈페이지를 볼 때 주로 사용하는 프로토콜은?',
      options: ['FTP', 'HTTP', 'SMTP', 'POP3'],
      answer: 'HTTP'
    }
  }
];

export const QUIZ_DATA: Question[] = [
  // EASY
  {
    id: 'q_e_1',
    type: 'multiple',
    difficulty: 'easy',
    question: '다음 중 네트워크를 구성하는 3대 요소가 아닌 것은?',
    options: ['컴퓨팅 시스템', '사용자', '전송 매체', '네트워크 장비'],
    correctAnswer: 1, // 사용자
    explanation: '네트워크의 3대 요소는 컴퓨팅 시스템, 전송 매체, 네트워크 장비입니다. 사용자는 이용 주체입니다.',
    correction: '사용자 -> 네트워크 장비'
  },
  {
    id: 'q_e_2',
    type: 'short',
    difficulty: 'easy',
    question: '정보를 제공하는 역할을 하는 컴퓨터를 무엇이라고 부를까요? (세 글자)',
    correctAnswer: ['서버', 'server'],
    explanation: '정보를 제공(Serve)하는 쪽은 서버, 요청하는 쪽은 클라이언트입니다.',
    correction: '정답은 "서버"입니다.'
  },
  {
    id: 'q_e_3',
    type: 'multiple',
    difficulty: 'easy',
    question: '무선 인터넷을 사용하기 위해 필요한 전송 매체는?',
    options: ['광케이블', 'UTP 케이블', '전파', '구리선'],
    correctAnswer: 2,
    explanation: '무선 통신은 공기 중의 전파(Radio Wave)를 매체로 사용합니다.',
    correction: '광/UTP/구리는 유선 매체입니다.'
  },
  // MEDIUM
  {
    id: 'q_m_1',
    type: 'multiple',
    difficulty: 'medium',
    question: '라우터(Router)의 가장 핵심적인 기능은?',
    options: ['신호 증폭', '바이러스 검사', '최적의 경로 설정', '화면 출력'],
    correctAnswer: 2,
    explanation: '라우터는 목적지까지 가는 가장 빠르고 효율적인 길(Route)을 찾아주는 장비입니다.',
    correction: '라우터 = 경로 설정(Routing)'
  },
  {
    id: 'q_m_2',
    type: 'short',
    difficulty: 'medium',
    question: '인터넷 상에서 컴퓨터들을 구별하기 위해 사용하는 고유한 주소 체계는 무엇인가요? (알파벳 2글자)',
    correctAnswer: ['IP', 'ip', 'IP주소', 'ip주소'],
    explanation: '네트워크 상의 집 주소 역할을 하는 것은 IP 주소입니다.',
    correction: '정답은 "IP" 입니다.'
  },
  {
    id: 'q_m_3',
    type: 'narrative',
    difficulty: 'medium',
    question: '학교 컴퓨터실의 모든 컴퓨터가 하나의 스위치에 연결되어 있습니다. 이 스위치의 역할은 무엇인지 30자 이내로 서술하세요.',
    keywords: ['연결', '전달', '데이터', '목적지'],
    correctAnswer: [],
    explanation: '스위치는 내부 네트워크의 기기들을 연결하고, 데이터를 정확한 목적지 기기로 전달합니다.',
    correction: '핵심 키워드: 내부 연결, 목적지로 데이터 전달'
  },
  // HARD
  {
    id: 'q_h_1',
    type: 'narrative',
    difficulty: 'hard',
    question: '유선 네트워크가 무선 네트워크보다 보안성이 높은 이유를 전송 매체의 특성과 관련지어 서술하세요.',
    keywords: ['물리적', '접속', '전파', '도청'],
    correctAnswer: [],
    explanation: '유선은 물리적으로 케이블에 접속해야 하지만, 무선은 전파가 사방으로 퍼져나가 해킹이나 도청의 위험이 더 높습니다.',
    correction: '키워드: 물리적 접속 필요성, 전파의 개방성'
  },
  {
    id: 'q_h_2',
    type: 'multiple',
    difficulty: 'hard',
    question: '다음 중 프로토콜(Protocol)의 기능으로 적절하지 않은 것은?',
    options: ['데이터의 순서 제어', '에러 검출', '물리적 케이블 연결', '동기화'],
    correctAnswer: 2,
    explanation: '물리적 케이블 연결은 하드웨어의 역할이며, 프로토콜은 통신 규약(소프트웨어적 규칙)입니다.',
    correction: '물리적 연결은 NIC나 케이블의 역할임.'
  },
  {
    id: 'q_h_3',
    type: 'short',
    difficulty: 'hard',
    question: 'OSI 7계층 중 가장 하위 계층으로, 데이터를 전기 신호로 변환하여 전송하는 계층은?',
    correctAnswer: ['물리 계층', 'physical', '물리', '1계층'],
    explanation: '데이터를 전기적 신호(0과 1)로 바꾸어 전송 매체로 보내는 계층은 물리 계층(Physical Layer)입니다.',
    correction: '정답은 "물리 계층"입니다.'
  }
];

export const SIMULATION_LOGIC = (media: string, distance: string): SimulationResult => {
  if (media === 'wired') {
    if (distance === 'short') {
      return { score: 100, reasons: '유선 연결에 거리가 짧아 신호 손실이 거의 없습니다.', tip: '가장 이상적인 연결 상태입니다.', recommendation: '이대로 유지하세요!' };
    } else if (distance === 'medium') {
      return { score: 98, reasons: '유선은 안정적이지만 거리가 멀어지면 선정리가 필요해요.', tip: '케이블이 꼬이지 않게 관리하세요.', recommendation: '중간에 스위치를 두면 더 깔끔할 수 있어요.' };
    } else {
      return { score: 90, reasons: '유선 케이블도 100m가 넘어가면 신호가 약해질 수 있어요.', tip: '장거리 유선 연결은 리피터가 필요할 수 있습니다.', recommendation: '광케이블 사용을 고려해보세요.' };
    }
  } else {
    if (distance === 'short') {
      return { score: 85, reasons: '가깝지만 무선은 유선보다 외부 간섭에 취약해요.', tip: '장애물이 없는지 확인하세요.', recommendation: '중요한 작업은 유선을 추천해요.' };
    } else if (distance === 'medium') {
      return { score: 65, reasons: '거리가 멀어지면서 벽이나 장애물로 속도가 저하됩니다.', tip: '공유기 위치를 높이거나 중앙으로 옮기세요.', recommendation: '와이파이 증폭기를 설치해보세요.' };
    } else {
      return { score: 40, reasons: '신호가 너무 약해 연결이 자주 끊길 위험이 큽니다.', tip: '무선으로 커버하기 힘든 거리입니다.', recommendation: '메시 와이파이나 유선 설치를 강력 권장합니다.' };
    }
  }
};

export const BADGES = [
  { id: 'b1', name: '네트워크 입문자', condition: '레벨 2 달성', icon: '🌱' },
  { id: 'b2', name: '개념 마스터', condition: '모든 개념 숙련도 100', icon: '🎓' },
  { id: 'b3', name: '퀴즈 탐험가', condition: '퀴즈 10회 시도', icon: '🔍' },
  { id: 'b4', name: '오답 노트 작성자', condition: '오답노트 5개 기록', icon: '📝' },
  { id: 'b5', name: '설계자', condition: '네트워크 지도 완성', icon: '🏗️' },
  { id: 'b6', name: '실험왕', condition: '모든 시뮬레이션 조합 시도', icon: '⚗️' },
  { id: 'b7', name: '끈기왕', condition: '3일 연속 접속', icon: '🔥' },
  { id: 'b8', name: '만점자', condition: '도전 난이도 100점', icon: '🏆' }
];
