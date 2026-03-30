import { ConceptCard, QuizQuestion } from './types';

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'c1',
    title: '센서 (Sensor)',
    category: '센서',
    frontContent: 'IoT의 눈과 귀',
    backDefinition: '주변 환경(빛, 소리, 온도 등)의 물리적인 변화를 감지하여 전기적 신호나 데이터로 변환하는 장치입니다.',
    backExample: '버스 도착 알림: 버스의 위치(GPS) 센서가 데이터를 수집합니다.',
    backMythFact: '💡 진실: 센서는 입력 장치입니다! 무언가를 작동시키는 출력 장치(액추에이터)와 다릅니다.',
  },
  {
    id: 'c2',
    title: '액추에이터 (Actuator)',
    category: '처리',
    frontContent: 'IoT의 손과 발',
    backDefinition: '센서가 감지한 정보를 바탕으로 실제 물리적인 행동(움직임, 소리, 빛 등)을 수행하는 출력 장치입니다.',
    backExample: '자동문: 사람이 감지되면 모터(액추에이터)가 문을 엽니다.',
    backMythFact: '🚫 오해: 모든 IoT 기기가 스스로 움직이는 것은 아닙니다. 데이터만 전송하는 기기도 많습니다.',
  },
  {
    id: 'c3',
    title: '네트워크 (Network)',
    category: '네트워크',
    frontContent: '사물들의 대화 통로',
    backDefinition: '사물들이 수집한 데이터를 서버나 다른 기기로 전송하기 위한 유무선 통신 기술입니다.',
    backExample: '하이패스: 차량 단말기와 톨게이트가 적외선/주파수 통신으로 연결됩니다.',
    backMythFact: '💡 진실: Wi-Fi뿐만 아니라 Bluetooth, Zigbee, LTE/5G 등 다양한 통신 방식이 사용됩니다.',
  },
  {
    id: 'c4',
    title: '인터페이스 (Interface)',
    category: '인터페이스',
    frontContent: '사용자와의 소통 창구',
    backDefinition: '사용자가 IoT 기기의 상태를 확인하거나 제어할 수 있도록 돕는 화면이나 앱을 말합니다.',
    backExample: '스마트홈 앱: 스마트폰 화면을 통해 집 안의 보일러 온도를 조절합니다.',
    backMythFact: '🚫 오해: 꼭 화면이 있어야 하는 것은 아닙니다. 음성 인식(AI 스피커)도 인터페이스입니다.',
  },
  {
    id: 'c5',
    title: '클라우드 (Cloud)',
    category: '처리',
    frontContent: '데이터 저장소 및 두뇌',
    backDefinition: '인터넷을 통해 연결된 거대한 서버 컴퓨터로, 수많은 센서 데이터를 저장하고 분석합니다.',
    backExample: '빅데이터 분석: 전국의 교통량을 분석해 가장 빠른 길을 알려줍니다.',
    backMythFact: '💡 진실: 내 폰에 저장되는 것이 아니라, 원격 서버에 저장되므로 어디서든 접근 가능합니다.',
  },
  {
    id: 'c6',
    title: 'RFID',
    category: '센서',
    frontContent: '전파를 이용한 신분증',
    backDefinition: '무선 주파수(Radio Frequency)를 이용해 대상을 식별하는 기술입니다.',
    backExample: '도서관 책 대출: 책에 붙은 태그를 리더기가 읽어 정보를 확인합니다.',
    backMythFact: '💡 차이점: 바코드는 빛이 있어야 하지만, RFID는 전파를 쓰기 때문에 가려져 있어도 인식됩니다.',
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'OX',
    question: '센서(Sensor)는 데이터를 물리적으로 행동하게 만드는 출력 장치이다.',
    correctAnswer: 'X',
    explanation: '센서는 정보를 수집하는 입력 장치입니다. 물리적 행동을 하는 것은 액추에이터입니다.',
  },
  {
    id: 2,
    type: 'MULTIPLE',
    question: '다음 중 "액추에이터"에 해당하는 것은 무엇일까요?',
    options: ['온도 센서', 'GPS 수신기', '전동 모터', '마이크'],
    correctAnswer: 2,
    explanation: '온도 센서, GPS, 마이크는 모두 정보를 받아들이는 센서입니다. 모터는 실제로 움직임을 만드는 액추에이터입니다.',
  },
  {
    id: 3,
    type: 'MULTIPLE',
    question: '버스 도착 정보 시스템(BIS)에서 버스의 위치를 파악하는 기술은?',
    options: ['NFC', 'GPS', 'Bluetooth', '체온 감지'],
    correctAnswer: 1,
    explanation: '위성 신호를 받아 위치를 파악하는 기술은 GPS입니다.',
  },
  {
    id: 4,
    type: 'OX',
    question: 'IoT 환경에서는 사람의 개입 없이 사물끼리 데이터를 주고받을 수 있다.',
    correctAnswer: 'O',
    explanation: 'M2M(Machine to Machine) 기술을 통해 기기 간 자동 통신이 가능합니다.',
  },
  {
    id: 5,
    type: 'MULTIPLE',
    question: '하이패스(Hi-Pass) 시스템이 작동하는 원리와 가장 관련 깊은 통신 기술은?',
    options: ['음성 인식', 'RFID/적외선 통신', '화상 통신', '터치 스크린'],
    correctAnswer: 1,
    explanation: '하이패스는 차량의 단말기와 톨게이트 안테나 간의 무선 통신(RFID 또는 IR)을 이용합니다.',
  },
  {
    id: 6,
    type: 'OX',
    question: '스마트폰 앱으로 집안의 전등을 끄는 과정에서 "스마트폰 화면"은 인터페이스에 해당한다.',
    correctAnswer: 'O',
    explanation: '사용자가 기기를 제어하고 정보를 확인하는 접점을 인터페이스라고 합니다.',
  },
  {
    id: 7,
    type: 'MULTIPLE',
    question: '다음 중 사물 인터넷(IoT)의 3대 주요 구성 요소가 아닌 것은?',
    options: ['센서(감지)', '네트워크(통신)', '인터페이스(서비스)', '배터리(전원)'],
    correctAnswer: 3,
    explanation: '배터리는 전원 공급 장치이지만, IoT 시스템의 기능적 핵심 3요소는 보통 센서, 네트워크, 인터페이스/플랫폼으로 정의합니다.',
  }
];

export const DEEP_DIVE_CONTENT = [
  {
    title: '5G와 IoT의 만남',
    content: '5G는 단순히 속도만 빠른 것이 아닙니다. "초연결"과 "초저지연"이 핵심입니다. 자율주행차처럼 0.001초의 판단이 중요한 IoT 분야에서 5G는 필수적인 신경망 역할을 합니다. 4G보다 20배 빠르고, 10배 많은 기기를 연결할 수 있습니다.',
  },
  {
    title: 'AIoT (AI + IoT)',
    content: '사물 인터넷(IoT)이 데이터를 모으는 몸통이라면, 인공지능(AI)은 그 데이터를 분석하고 판단하는 두뇌입니다. 이 둘이 합쳐진 AIoT는 "지능형 사물 인터넷"이라고 부릅니다. 단순히 온도를 재는 것을 넘어, "주인이 언제 퇴근하는지" 학습하여 미리 온도를 맞춰놓는 것이 AIoT의 예시입니다.',
  }
];