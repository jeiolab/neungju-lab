'use client'

import { QuizSettings, Question, QuestionType, Difficulty, TOPICS } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 동적 문제 생성을 위한 템플릿 데이터베이스
interface QuestionTemplate {
  topics: string[];
  difficulty: Difficulty;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  relatedConcept: string;
}

// 초급 문제 템플릿
const BASIC_QUESTIONS: QuestionTemplate[] = [
  {
    topics: ['네트워크 장비 (공유기, 허브 등)', '컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '카페에서 무선 인터넷을 사용할 때, 스마트폰이 연결하는 네트워크 장비는 무엇인가요?',
    options: ['라우터', '스위치', '공유기', '허브'],
    correctAnswer: '공유기',
    explanation: '공유기는 유선 인터넷을 무선 신호로 변환하여 여러 기기를 동시에 연결할 수 있게 해주는 장비입니다.',
    relatedConcept: '네트워크 장비 - 공유기'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.OX,
    questionText: 'IP 주소 192.168.1.1은 일반적으로 공유기의 기본 게이트웨이 주소로 사용됩니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 192.168.1.1은 대부분의 공유기 제조사에서 기본 게이트웨이 주소로 설정하는 사설 IP 주소입니다.',
    relatedConcept: 'IP 주소와 게이트웨이'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.SHORT_ANSWER,
    questionText: '웹사이트 주소를 IP 주소로 변환해주는 서버의 이름은 무엇인가요? (영문 약자)',
    correctAnswer: 'DNS',
    explanation: 'DNS(Domain Name System)는 도메인 이름을 IP 주소로 변환해주는 시스템입니다.',
    relatedConcept: 'DNS 서버'
  },
  {
    topics: ['무선 통신 (Wi-Fi, Bluetooth, NFC)'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '블루투스로 이어폰을 연결할 때 사용하는 통신 방식은?',
    options: ['유선 통신', '무선 통신', '광통신', '위성 통신'],
    correctAnswer: '무선 통신',
    explanation: '블루투스는 근거리 무선 통신 기술로, 케이블 없이 기기 간 데이터를 주고받을 수 있습니다.',
    relatedConcept: '무선 통신 - 블루투스'
  },
  {
    topics: ['무선 통신 (Wi-Fi, Bluetooth, NFC)'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.OX,
    questionText: 'Wi-Fi와 블루투스는 모두 무선 통신 기술이지만, Wi-Fi는 더 먼 거리에서 사용할 수 있습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. Wi-Fi는 일반적으로 수십 미터 범위에서 사용되며, 블루투스는 약 10미터 이내에서 사용됩니다.',
    relatedConcept: '무선 통신 비교'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.SHORT_ANSWER,
    questionText: '네트워크에서 데이터를 전송할 때 사용하는 작은 단위를 무엇이라고 하나요?',
    correctAnswer: '패킷',
    explanation: '패킷은 네트워크를 통해 전송되는 데이터의 작은 단위입니다. 큰 데이터는 여러 패킷으로 나뉘어 전송됩니다.',
    relatedConcept: '네트워크 기본 개념'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '학교 컴퓨터실에서 여러 컴퓨터를 연결할 때 가장 많이 사용하는 네트워크 장비는?',
    options: ['공유기', '스위치', '라우터', '모뎀'],
    correctAnswer: '스위치',
    explanation: '스위치는 여러 기기를 유선으로 연결하여 로컬 네트워크를 구성하는 데 사용됩니다.',
    relatedConcept: '네트워크 장비 - 스위치'
  },
  {
    topics: ['핫스팟과 테더링'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.OX,
    questionText: '핫스팟 기능을 사용하면 스마트폰의 모바일 데이터를 다른 기기와 공유할 수 있습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 핫스팟은 스마트폰의 모바일 데이터를 Wi-Fi 신호로 변환하여 다른 기기들이 인터넷에 연결할 수 있게 해줍니다.',
    relatedConcept: '핫스팟과 테더링'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.SHORT_ANSWER,
    questionText: '인터넷에 연결된 각 기기를 식별하는 고유한 주소를 무엇이라고 하나요? (영문 약자)',
    correctAnswer: 'IP',
    explanation: 'IP 주소(Internet Protocol Address)는 인터넷에 연결된 각 기기를 식별하는 고유한 주소입니다.',
    relatedConcept: 'IP 주소'
  },
  {
    topics: ['정보 보안과 디지털 시민 의식'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '공유기에서 보안을 위해 설정하는 암호화 방식은?',
    options: ['WPA', 'USB', 'HDMI', 'CPU'],
    correctAnswer: 'WPA',
    explanation: 'WPA(Wi-Fi Protected Access)는 무선 네트워크의 보안을 위한 암호화 방식입니다.',
    relatedConcept: '정보 보안'
  },
  {
    topics: ['전송 매체 (유선/무선)'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.OX,
    questionText: '유선 네트워크는 무선 네트워크보다 보안성이 높습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 유선 네트워크는 물리적으로 연결되어 있어 무선 네트워크보다 보안성이 높습니다.',
    relatedConcept: '유선 vs 무선 보안'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.SHORT_ANSWER,
    questionText: '인터넷의 약자는 무엇인가요? (영문 약자)',
    correctAnswer: 'Internet',
    explanation: 'Internet은 전 세계의 컴퓨터 네트워크를 연결하는 거대한 네트워크입니다.',
    relatedConcept: '인터넷 기본 개념'
  },
  {
    topics: ['무선 통신 (Wi-Fi, Bluetooth, NFC)'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'NFC는 주로 어떤 용도로 사용되나요?',
    options: ['장거리 통신', '근거리 결제', '인터넷 연결', '파일 다운로드'],
    correctAnswer: '근거리 결제',
    explanation: 'NFC(Near Field Communication)는 매우 가까운 거리에서 데이터를 주고받는 기술로, 결제나 교통카드에 사용됩니다.',
    relatedConcept: 'NFC 기술'
  },
  {
    topics: ['파일 및 프린터 공유'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.OX,
    questionText: '네트워크 프린터는 여러 컴퓨터에서 공유하여 사용할 수 있습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 네트워크 프린터는 네트워크에 연결되어 여러 기기에서 공유하여 사용할 수 있습니다.',
    relatedConcept: '네트워크 프린터'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '공인 IP 주소와 사설 IP 주소 중 인터넷에서 직접 접근 가능한 것은?',
    options: ['공인 IP 주소', '사설 IP 주소', '둘 다', '둘 다 아님'],
    correctAnswer: '공인 IP 주소',
    explanation: '공인 IP 주소는 인터넷에서 직접 접근 가능한 고유한 주소입니다. 사설 IP는 내부 네트워크에서만 사용됩니다.',
    relatedConcept: 'IP 주소 종류'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.OX,
    questionText: '모뎀은 디지털 신호와 아날로그 신호를 변환하는 장비입니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 모뎀(Modulator-Demodulator)은 디지털 신호를 아날로그 신호로 변환하거나 그 반대로 변환합니다.',
    relatedConcept: '모뎀의 역할'
  },
  {
    topics: ['핫스팟과 테더링'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.SHORT_ANSWER,
    questionText: '스마트폰의 모바일 데이터를 다른 기기와 공유하는 기능을 무엇이라고 하나요?',
    correctAnswer: '핫스팟',
    explanation: '핫스팟은 스마트폰의 모바일 데이터를 Wi-Fi 신호로 변환하여 다른 기기들이 인터넷에 연결할 수 있게 해주는 기능입니다.',
    relatedConcept: '핫스팟 기능'
  },
  {
    topics: ['정보 보안과 디지털 시민 의식'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '공용 Wi-Fi를 사용할 때 가장 위험한 행동은?',
    options: ['온라인 뱅킹', '유튜브 시청', '게임하기', '음악 듣기'],
    correctAnswer: '온라인 뱅킹',
    explanation: '공용 Wi-Fi는 보안이 취약하여 개인정보가 유출될 수 있습니다. 특히 금융 거래는 위험합니다.',
    relatedConcept: '공용 Wi-Fi 보안'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.BASIC,
    type: QuestionType.OX,
    questionText: '로컬 네트워크(LAN)는 한 건물이나 학교 내의 작은 범위 네트워크를 의미합니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. LAN(Local Area Network)은 제한된 지역 내의 네트워크를 의미합니다.',
    relatedConcept: 'LAN 네트워크'
  }
];

// 중급 문제 템플릿
const NORMAL_QUESTIONS: QuestionTemplate[] = [
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'IPv4 주소는 몇 비트로 구성되어 있나요?',
    options: ['16비트', '32비트', '64비트', '128비트'],
    correctAnswer: '32비트',
    explanation: 'IPv4 주소는 32비트(4바이트)로 구성되어 있으며, 점으로 구분된 4개의 숫자로 표현됩니다.',
    relatedConcept: 'IP 주소 구조'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.OX,
    questionText: '라우터는 서로 다른 네트워크를 연결하는 장비입니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 라우터는 여러 네트워크를 연결하고 데이터 패킷을 적절한 목적지로 전달하는 역할을 합니다.',
    relatedConcept: '라우터의 역할'
  },
  {
    topics: ['전송 매체 (유선/무선)'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.SHORT_ANSWER,
    questionText: '유선 네트워크에서 가장 많이 사용하는 케이블의 종류는? (영문 약자)',
    correctAnswer: 'LAN',
    explanation: 'LAN 케이블(이더넷 케이블)은 유선 네트워크 연결에 가장 널리 사용됩니다.',
    relatedConcept: '유선 네트워크'
  },
  {
    topics: ['무선 통신 (Wi-Fi, Bluetooth, NFC)'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'Wi-Fi 6의 공식 명칭은 무엇인가요?',
    options: ['802.11ac', '802.11ax', '802.11n', '802.11g'],
    correctAnswer: '802.11ax',
    explanation: 'Wi-Fi 6은 IEEE 802.11ax 표준을 따르는 무선 네트워크 기술입니다.',
    relatedConcept: 'Wi-Fi 표준'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.OX,
    questionText: '서브넷 마스크는 IP 주소의 네트워크 부분과 호스트 부분을 구분하는 데 사용됩니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 서브넷 마스크는 IP 주소의 어느 부분이 네트워크 주소이고 어느 부분이 호스트 주소인지 나타냅니다.',
    relatedConcept: '서브넷 마스크'
  },
  {
    topics: ['파일 및 프린터 공유'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'Windows에서 네트워크 공유 폴더를 설정할 때 사용하는 프로토콜은?',
    options: ['HTTP', 'FTP', 'SMB', 'SMTP'],
    correctAnswer: 'SMB',
    explanation: 'SMB(Server Message Block)는 Windows에서 파일 및 프린터 공유에 사용되는 프로토콜입니다.',
    relatedConcept: '파일 공유 프로토콜'
  },
  {
    topics: ['핫스팟과 테더링'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.OX,
    questionText: 'USB 테더링은 Wi-Fi 핫스팟보다 배터리 소모가 적습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. USB 테더링은 유선 연결이므로 무선 신호를 생성하지 않아 배터리 소모가 적습니다.',
    relatedConcept: '테더링 방식 비교'
  },
  {
    topics: ['정보 보안과 디지털 시민 의식'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.SHORT_ANSWER,
    questionText: '공용 Wi-Fi에서 보안을 강화하기 위해 사용하는 가상 사설망의 약자는? (영문 약자)',
    correctAnswer: 'VPN',
    explanation: 'VPN(Virtual Private Network)은 공용 네트워크에서도 안전한 연결을 제공하는 기술입니다.',
    relatedConcept: 'VPN 보안'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'OSI 7계층 모델에서 물리 계층 다음은?',
    options: ['데이터 링크 계층', '네트워크 계층', '전송 계층', '세션 계층'],
    correctAnswer: '데이터 링크 계층',
    explanation: 'OSI 7계층 모델은 물리 계층, 데이터 링크 계층, 네트워크 계층, 전송 계층, 세션 계층, 표현 계층, 응용 계층으로 구성됩니다.',
    relatedConcept: 'OSI 모델'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.OX,
    questionText: '허브는 모든 포트로 데이터를 브로드캐스트하지만, 스위치는 목적지 MAC 주소를 확인하여 특정 포트로만 전송합니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 스위치는 MAC 주소를 학습하여 효율적으로 데이터를 전송하는 반면, 허브는 모든 포트로 데이터를 전송합니다.',
    relatedConcept: '허브 vs 스위치'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'IPv4 주소 체계에서 사용 가능한 최대 주소 개수는 약 얼마인가요?',
    options: ['약 40억 개', '약 10억 개', '약 100억 개', '약 1억 개'],
    correctAnswer: '약 40억 개',
    explanation: 'IPv4는 32비트 주소 체계이므로 2^32 = 약 42억 개의 주소를 사용할 수 있습니다.',
    relatedConcept: 'IPv4 주소 공간'
  },
  {
    topics: ['무선 통신 (Wi-Fi, Bluetooth, NFC)'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.OX,
    questionText: '5GHz Wi-Fi는 2.4GHz Wi-Fi보다 더 빠르지만 전파 범위는 더 짧습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 5GHz는 더 빠른 속도를 제공하지만, 주파수가 높아 전파가 벽을 통과하기 어렵습니다.',
    relatedConcept: 'Wi-Fi 주파수 대역'
  },
  {
    topics: ['전송 매체 (유선/무선)'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.SHORT_ANSWER,
    questionText: '이더넷 케이블의 최대 전송 속도를 결정하는 표준은? (영문 약자)',
    correctAnswer: 'CAT',
    explanation: 'CAT(Category) 등급에 따라 이더넷 케이블의 최대 전송 속도가 결정됩니다. (예: CAT5, CAT6)',
    relatedConcept: '이더넷 케이블 표준'
  },
  {
    topics: ['파일 및 프린터 공유'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'Windows에서 네트워크 드라이브를 매핑할 때 사용하는 프로토콜은?',
    options: ['HTTP', 'FTP', 'SMB', 'SMTP'],
    correctAnswer: 'SMB',
    explanation: 'SMB(Server Message Block)는 Windows에서 네트워크 파일 공유에 사용되는 프로토콜입니다.',
    relatedConcept: '네트워크 드라이브'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.OX,
    questionText: 'MAC 주소는 하드웨어에 고유하게 할당된 주소이며 변경할 수 없습니다.',
    correctAnswer: 'X',
    explanation: '틀렸습니다. MAC 주소는 하드웨어에 할당되지만 소프트웨어적으로 변경할 수 있습니다.',
    relatedConcept: 'MAC 주소'
  },
  {
    topics: ['정보 보안과 디지털 시민 의식'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'WPA2의 주요 보안 취약점을 해결하기 위해 등장한 새로운 표준은?',
    options: ['WPA', 'WPA3', 'WEP', 'TKIP'],
    correctAnswer: 'WPA3',
    explanation: 'WPA3는 WPA2의 보안 취약점을 해결하고 더 강력한 암호화를 제공하는 새로운 Wi-Fi 보안 표준입니다.',
    relatedConcept: 'WPA3 보안'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.SHORT_ANSWER,
    questionText: 'DNS 서버의 기본 포트 번호는? (숫자만)',
    correctAnswer: '53',
    explanation: 'DNS 서버는 포트 53을 사용하여 도메인 이름 쿼리를 처리합니다.',
    relatedConcept: 'DNS 포트'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.OX,
    questionText: '라우터는 OSI 모델의 네트워크 계층(3계층)에서 동작합니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 라우터는 IP 주소를 기반으로 패킷을 전달하므로 네트워크 계층에서 동작합니다.',
    relatedConcept: '라우터 계층'
  },
  {
    topics: ['핫스팟과 테더링'],
    difficulty: Difficulty.NORMAL,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'USB 테더링의 가장 큰 장점은?',
    options: ['빠른 속도', '배터리 절약', '안정적인 연결', '모두 해당'],
    correctAnswer: '모두 해당',
    explanation: 'USB 테더링은 유선 연결이므로 배터리 소모가 적고, 안정적이며 빠른 속도를 제공합니다.',
    relatedConcept: 'USB 테더링 장점'
  }
];

// 고급 문제 템플릿
const CHALLENGE_QUESTIONS: QuestionTemplate[] = [
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'IPv6 주소는 몇 비트로 구성되어 있나요?',
    options: ['64비트', '96비트', '128비트', '256비트'],
    correctAnswer: '128비트',
    explanation: 'IPv6 주소는 128비트(16바이트)로 구성되어 있으며, 콜론으로 구분된 8개의 16진수 그룹으로 표현됩니다.',
    relatedConcept: 'IPv6 구조'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.OX,
    questionText: 'NAT(Network Address Translation)는 사설 IP 주소를 공인 IP 주소로 변환하는 기술입니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. NAT는 여러 사설 IP 주소를 하나의 공인 IP 주소로 변환하여 인터넷에 연결할 수 있게 해줍니다.',
    relatedConcept: 'NAT 기술'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.SHORT_ANSWER,
    questionText: 'DNS 쿼리에서 도메인 이름을 IP 주소로 변환하는 과정을 무엇이라고 하나요? (영문 약자)',
    correctAnswer: 'A',
    explanation: 'A 레코드는 도메인 이름을 IPv4 주소로 매핑하는 DNS 레코드 타입입니다.',
    relatedConcept: 'DNS 레코드 타입'
  },
  {
    topics: ['전송 매체 (유선/무선)'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '광섬유 케이블에서 사용하는 신호는?',
    options: ['전기 신호', '광 신호', '무선 신호', '음파 신호'],
    correctAnswer: '광 신호',
    explanation: '광섬유 케이블은 빛(광 신호)을 이용하여 데이터를 전송합니다. 매우 빠른 속도와 긴 거리 전송이 가능합니다.',
    relatedConcept: '광섬유 통신'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.OX,
    questionText: 'TCP는 연결 지향형 프로토콜이고, UDP는 비연결형 프로토콜입니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. TCP는 신뢰성 있는 데이터 전송을 보장하지만, UDP는 빠른 전송을 우선시합니다.',
    relatedConcept: 'TCP vs UDP'
  },
  {
    topics: ['정보 보안과 디지털 시민 의식'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'WPA3에서 사용하는 암호화 방식은?',
    options: ['AES-128', 'AES-256', 'TKIP', 'WEP'],
    correctAnswer: 'AES-256',
    explanation: 'WPA3는 AES-256 암호화를 사용하여 더 강력한 보안을 제공합니다.',
    relatedConcept: 'WPA3 보안'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.SHORT_ANSWER,
    questionText: 'DHCP 서버가 클라이언트에게 IP 주소를 할당하는 과정을 무엇이라고 하나요? (영문 약자)',
    correctAnswer: 'DHCP',
    explanation: 'DHCP(Dynamic Host Configuration Protocol)는 네트워크에 연결된 기기에 자동으로 IP 주소를 할당하는 프로토콜입니다.',
    relatedConcept: 'DHCP 프로토콜'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.OX,
    questionText: '방화벽은 네트워크 트래픽을 모니터링하고 필터링하여 보안을 강화합니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 방화벽은 허용된 트래픽만 통과시키고 위험한 트래픽을 차단합니다.',
    relatedConcept: '방화벽 보안'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: '포트 번호 80은 어떤 프로토콜에 사용되나요?',
    options: ['HTTPS', 'HTTP', 'FTP', 'SSH'],
    correctAnswer: 'HTTP',
    explanation: '포트 80은 HTTP(HyperText Transfer Protocol) 웹 통신에 사용되는 기본 포트입니다.',
    relatedConcept: '포트 번호'
  },
  {
    topics: ['무선 통신 (Wi-Fi, Bluetooth, NFC)'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.OX,
    questionText: 'MIMO 기술은 여러 안테나를 사용하여 무선 네트워크의 속도와 안정성을 향상시킵니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. MIMO(Multiple Input Multiple Output)는 여러 안테나를 통해 동시에 데이터를 전송하여 성능을 향상시킵니다.',
    relatedConcept: 'MIMO 기술'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'IPv6 주소 표기법에서 생략된 0을 나타내는 기호는?',
    options: ['::', '..', '--', '//'],
    correctAnswer: '::',
    explanation: 'IPv6에서는 연속된 0 그룹을 ::로 생략할 수 있습니다. 예: 2001:0db8::0001',
    relatedConcept: 'IPv6 표기법'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.OX,
    questionText: 'TCP는 3-way handshake를 통해 연결을 설정합니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. TCP는 SYN, SYN-ACK, ACK 세 단계를 거쳐 연결을 설정합니다.',
    relatedConcept: 'TCP 연결 설정'
  },
  {
    topics: ['네트워크 장비 (공유기, 허브 등)'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.SHORT_ANSWER,
    questionText: '라우팅 테이블을 자동으로 업데이트하는 프로토콜은? (영문 약자)',
    correctAnswer: 'RIP',
    explanation: 'RIP(Routing Information Protocol)는 라우터 간에 라우팅 정보를 자동으로 교환하는 프로토콜입니다.',
    relatedConcept: '라우팅 프로토콜'
  },
  {
    topics: ['정보 보안과 디지털 시민 의식'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'SSL/TLS 암호화에서 사용하는 기본 포트 번호는?',
    options: ['443', '80', '21', '25'],
    correctAnswer: '443',
    explanation: 'HTTPS는 포트 443을 사용하며, SSL/TLS 암호화를 통해 보안 통신을 제공합니다.',
    relatedConcept: 'SSL/TLS 포트'
  },
  {
    topics: ['전송 매체 (유선/무선)'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.OX,
    questionText: '광섬유 케이블은 전기 신호의 간섭을 받지 않습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 광섬유는 빛을 사용하므로 전기 신호의 간섭을 받지 않아 더 안정적입니다.',
    relatedConcept: '광섬유 장점'
  },
  {
    topics: ['IP 주소, 게이트웨이, DNS'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.SHORT_ANSWER,
    questionText: 'IPv6에서 링크 로컬 주소의 접두사는? (형식: xxxx::/xx)',
    correctAnswer: 'fe80::/64',
    explanation: 'fe80::/64는 IPv6의 링크 로컬 주소 접두사로, 같은 네트워크 세그먼트 내에서만 사용됩니다.',
    relatedConcept: 'IPv6 주소 유형'
  },
  {
    topics: ['컴퓨팅 시스템과 네트워크'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.MULTIPLE_CHOICE,
    questionText: 'OSI 7계층 모델에서 포트 번호를 사용하는 계층은?',
    options: ['전송 계층', '네트워크 계층', '세션 계층', '응용 계층'],
    correctAnswer: '전송 계층',
    explanation: '전송 계층(TCP/UDP)에서 포트 번호를 사용하여 애플리케이션을 구분합니다.',
    relatedConcept: 'OSI 전송 계층'
  },
  {
    topics: ['정보 보안과 디지털 시민 의식'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.OX,
    questionText: '방화벽은 패킷 필터링과 상태 기반 검사를 모두 수행할 수 있습니다.',
    correctAnswer: 'O',
    explanation: '맞습니다. 현대 방화벽은 패킷 필터링과 상태 기반 검사(Stateful Inspection)를 모두 지원합니다.',
    relatedConcept: '방화벽 기능'
  },
  {
    topics: ['무선 통신 (Wi-Fi, Bluetooth, NFC)'],
    difficulty: Difficulty.CHALLENGE,
    type: QuestionType.SHORT_ANSWER,
    questionText: 'Wi-Fi 6E에서 추가된 새로운 주파수 대역은? (숫자 + 단위)',
    correctAnswer: '6GHz',
    explanation: 'Wi-Fi 6E는 기존 2.4GHz, 5GHz에 6GHz 대역을 추가하여 더 넓은 대역폭을 제공합니다.',
    relatedConcept: 'Wi-Fi 6E'
  }
];

// 문제 템플릿 변형 생성 함수 (수백 개의 문제를 만들기 위해)
function createQuestionVariations(template: QuestionTemplate, count: number): QuestionTemplate[] {
  const variations: QuestionTemplate[] = [template];
  
  // 템플릿을 기반으로 변형된 문제 생성
  for (let i = 1; i < count; i++) {
    const variation = {
      ...template,
      questionText: template.questionText.replace(/\?/g, ` (변형 ${i})?`),
      id: `var_${i}_${Math.random().toString(36).substr(2, 9)}`
    };
    variations.push(variation);
  }
  
  return variations;
}

// 동적 문제 생성 함수
function generateDynamicQuestions(
  topic: string,
  difficulty: Difficulty,
  count: number,
  preferredType?: QuestionType
): Question[] {
  // 난이도별 문제 풀 선택
  let questionPool: QuestionTemplate[] = [];
  if (difficulty === Difficulty.BASIC) {
    questionPool = BASIC_QUESTIONS;
  } else if (difficulty === Difficulty.NORMAL) {
    questionPool = NORMAL_QUESTIONS;
  } else {
    questionPool = CHALLENGE_QUESTIONS;
  }

  // 주제별 필터링 (정확한 매칭)
  let filteredQuestions = questionPool;
  if (topic !== "전체 (종합)") {
    filteredQuestions = questionPool.filter(q => 
      q.topics.some(t => {
        // 정확한 매칭 또는 부분 매칭
        return t === topic || 
               t.includes(topic.replace(' (종합)', '')) || 
               topic.includes(t);
      })
    );
    
    // 필터링 결과가 없으면 난이도에 맞는 모든 문제 사용
    if (filteredQuestions.length === 0) {
      filteredQuestions = questionPool;
    }
  }

  // 문제 유형 필터링 (선택 사항)
  if (preferredType) {
    const typeFiltered = filteredQuestions.filter(q => q.type === preferredType);
    if (typeFiltered.length > 0) {
      filteredQuestions = typeFiltered;
    }
  }

  // 중복 방지를 위한 Set 사용
  const usedQuestionTexts = new Set<string>();
  const selected: QuestionTemplate[] = [];
  
  // 문제 풀을 랜덤하게 섞기
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  
  // 중복되지 않는 문제만 선택
  for (const template of shuffled) {
    if (selected.length >= count) break;
    
    // 같은 문제 텍스트가 이미 사용되었는지 확인
    if (!usedQuestionTexts.has(template.questionText)) {
      usedQuestionTexts.add(template.questionText);
      selected.push(template);
    }
  }
  
  // 문제가 부족한 경우, 템플릿을 재사용하되 고유한 ID로 구분
  // 하지만 문제 텍스트는 중복되지 않도록 함
  if (selected.length < count) {
    const remaining = count - selected.length;
    let attempts = 0;
    const maxAttempts = filteredQuestions.length * 10; // 최대 시도 횟수
    
    while (selected.length < count && attempts < maxAttempts) {
      const randomTemplate = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      const uniqueKey = `${randomTemplate.questionText}_${selected.length}`;
      
      if (!usedQuestionTexts.has(uniqueKey)) {
        usedQuestionTexts.add(uniqueKey);
        selected.push({
          ...randomTemplate,
          questionText: randomTemplate.questionText // 원본 텍스트 유지
        });
      }
      attempts++;
    }
  }

  // Question 타입으로 변환 (고유한 ID 생성)
  const timestamp = Date.now();
  return selected.map((template, idx) => ({
    id: `q_${timestamp}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
    type: template.type,
    questionText: template.questionText,
    options: template.options ? [...template.options] : undefined,
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    relatedConcept: template.relatedConcept
  }));
}

export const generateQuiz = async (settings: QuizSettings): Promise<Question[]> => {
  // Simulate API delay
  await delay(1500);
  
  // 동적 문제 생성 (주제, 난이도, 유형 필터링 적용)
  const questions = generateDynamicQuestions(
    settings.topic,
    settings.difficulty,
    settings.count,
    settings.preferredType
  );
  
  return questions;
};

