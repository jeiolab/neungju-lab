import { ConceptData, QuizQuestion, Scenario } from './types';

export const CONCEPTS: Record<string, ConceptData> = {
  WIRED: {
    type: 'WIRED',
    title: '유선 네트워크 (Wired)',
    description: '물리적인 케이블을 사용하여 장치들을 연결하는 방식입니다. 데이터가 선을 타고 이동하기 때문에 외부 간섭이 적습니다.',
    pros: ['안정적인 연결 (끊김 적음)', '빠른 전송 속도', '우수한 보안성'],
    cons: ['설치의 복잡성', '이동성 제한 (선 길이에 묶임)', '케이블 관리 필요'],
    examples: ['광케이블', 'Twisted Pair (LAN선)', '동축 케이블'],
  },
  WIRELESS: {
    type: 'WIRELESS',
    title: '무선 네트워크 (Wireless)',
    description: '전파(적외선, 라디오파 등)를 이용하여 선 없이 장치를 연결하는 방식입니다. 공간의 제약 없이 자유롭게 접속할 수 있습니다.',
    pros: ['높은 이동성', '편리한 접속', '설치 및 확장이 용이'],
    cons: ['유선 대비 속도가 느릴 수 있음', '장애물의 영향을 받음', '보안 취약 가능성'],
    examples: ['Wi-Fi', 'Bluetooth', 'LTE / 5G', 'NFC'],
  },
};

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'FPS 게임 대회 결승전',
    situation: '0.1초의 반응속도가 승패를 가르는 중요한 순간입니다. 랙(Lag)이 발생하면 절대 안 됩니다!',
    correctAnswer: 'WIRED',
    explanation: '게임 대회처럼 안정성과 빠른 응답 속도가 생명인 상황에서는 유선 네트워크가 필수적입니다.',
    iconType: 'GAME',
  },
  {
    id: 2,
    title: '공원에서 웹툰 보기',
    situation: '날씨 좋은 공원 벤치에 앉아 태블릿으로 좋아하는 웹툰을 정주행하려고 합니다.',
    correctAnswer: 'WIRELESS',
    explanation: '공원과 같은 야외에서 자유롭게 이동하며 인터넷을 사용하려면 5G나 Wi-Fi 같은 무선 네트워크가 적합합니다.',
    iconType: 'PARK',
  },
  {
    id: 3,
    title: '은행 서버실 데이터 백업',
    situation: '고객의 소중한 금융 정보를 다루는 은행 메인 서버에서 대용량 데이터를 백업합니다. 보안이 최우선입니다.',
    correctAnswer: 'WIRED',
    explanation: '높은 보안성과 대용량 데이터의 안정적인 전송을 위해서는 폐쇄적인 유선 네트워크(광케이블 등)가 사용됩니다.',
    iconType: 'OFFICE',
  },
  {
    id: 4,
    title: '스마트워치 운동 기록 연동',
    situation: '러닝을 하면서 스마트워치에 기록된 심박수 정보를 스마트폰으로 실시간 전송합니다.',
    correctAnswer: 'WIRELESS',
    explanation: '운동 중 착용하는 웨어러블 기기는 선을 연결할 수 없으므로 블루투스(무선)를 사용해야 합니다.',
    iconType: 'GAME', // Reusing GAME icon logic or generic mapping
  },
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: '다음 중 유선 네트워크의 장점으로 가장 적절한 것은?',
    options: ['이동하면서 사용하기 편리하다.', '설치가 매우 간편하다.', '외부 간섭이 적고 전송 속도가 안정적이다.', '선이 없어 깔끔하다.'],
    answerIndex: 2,
    explanation: '유선 네트워크는 물리적 케이블을 사용하므로 무선에 비해 외부 전파 간섭이 적고 안정적입니다.',
  },
  {
    id: 2,
    question: '카페에서 노트북을 Wi-Fi에 연결하여 사용하는 방식은 무엇에 해당하는가?',
    options: ['유선 네트워크', '무선 네트워크', '광케이블 통신', '위성 통신'],
    answerIndex: 1,
    explanation: 'Wi-Fi는 전파를 이용하는 대표적인 무선 네트워크 기술입니다.',
  },
  {
    id: 3,
    question: '다음 중 "테더링(Tethering)"에 대한 설명으로 옳은 것은?',
    options: ['스마트폰을 모뎀처럼 활용해 다른 기기(노트북 등)에 인터넷을 연결해주는 기능이다.', '유선 랜선을 연결하는 젠더 이름이다.', '해킹을 방지하는 보안 기술이다.', '데이터를 압축하는 기술이다.'],
    answerIndex: 0,
    explanation: '테더링은 스마트폰의 데이터 통신을 활용하여 다른 IT 기기가 인터넷에 접속할 수 있게 해주는 기술입니다.',
  },
  {
    id: 4,
    question: '블루투스(Bluetooth) 기술의 주된 특징은?',
    options: ['수 킬로미터 이상의 장거리 통신용이다.', '근거리 저전력 무선 통신 기술이다.', '유선 연결 방식 중 하나이다.', '속도가 광케이블보다 빠르다.'],
    answerIndex: 1,
    explanation: '블루투스는 가까운 거리(보통 10m 이내)에서 적은 전력으로 기기 간 정보를 교환하는 무선 기술입니다.',
  },
];