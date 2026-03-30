import { CaseStudy, QuizQuestion, Scenario, Stakeholder } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "school_parking",
    title: "학교 앞 불법 주정차 해결",
    description: "등하굣길 안전을 위해 불법 주정차 차량을 자동으로 감지하고 알림을 보냅니다.",
    defaultDNPC: {
      device: "카메라 센서, 번호판 인식기",
      network: "LTE/5G",
      platform: "교통 관제 클라우드",
      service: "운전자 알림 앱, 단속 대시보드"
    }
  },
  {
    id: "bus_arrival",
    title: "정확한 버스 도착 정보",
    description: "겨울철 정류장에서 떨지 않도록 정확한 위치와 도착 시간을 알려줍니다.",
    defaultDNPC: {
      device: "GPS 추적기, 정류장 디스플레이",
      network: "LoRaWAN",
      platform: "BIS (버스정보시스템) 서버",
      service: "스마트폰 지도 앱"
    }
  },
  {
    id: "elderly_safety",
    title: "독거 노인 안전 돌봄",
    description: "집안에서의 움직임이나 가스 사용량을 분석해 위급 상황을 감지합니다.",
    defaultDNPC: {
      device: "동작 감지 센서, 스마트 플러그",
      network: "Wi-Fi (가정용)",
      platform: "복지 관제 플랫폼",
      service: "복지사 긴급 호출 서비스"
    }
  },
  {
    id: "environment_waste",
    title: "쓰레기통 넘침 방지",
    description: "공원 쓰레기통이 넘치기 전에 청소부에게 알려 쾌적한 환경을 만듭니다.",
    defaultDNPC: {
      device: "초음파 거리 센서 (적재량 감지)",
      network: "NB-IoT",
      platform: "도시 환경 데이터 허브",
      service: "청소 트럭 최적 경로 내비게이션"
    }
  }
];

export const RISKS = [
  "수집된 개인정보(영상, 위치) 유출 가능성",
  "네트워크 끊김 시 오작동 위험",
  "센서 배터리 방전 및 유지보수 문제",
  "해킹으로 인한 시스템 조작 위험",
  "사용자(노인/어린이)의 기기 조작 미숙"
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "IoT(사물인터넷)의 구성 요소인 D-N-P-S 모델에 해당하지 않는 것은?",
    options: ["Device (디바이스)", "Network (네트워크)", "People (사람)", "Service (서비스)"],
    answer: 2,
    explanation: "P는 Platform(플랫폼)을 의미합니다. 데이터가 모이고 처리되는 곳이죠."
  },
  {
    id: 2,
    question: "스마트시티에서 '플랫폼'이 하는 주된 역할은 무엇인가요?",
    options: ["데이터를 수집하고 저장/분석한다", "물리적으로 데이터를 측정한다", "사용자에게 화면을 보여준다", "무선 신호를 보낸다"],
    answer: 0,
    explanation: "플랫폼은 디바이스에서 온 데이터를 모으고, 분석하여 가치 있는 정보로 만드는 뇌의 역할을 합니다."
  },
  {
    id: 3,
    question: "센서 데이터를 너무 자주 보내면 발생하는 문제는?",
    options: ["데이터 정확도가 떨어진다", "배터리 소모가 빨라진다", "네트워크 속도가 빨라진다", "보안이 강화된다"],
    answer: 1,
    explanation: "통신 빈도가 높으면 디바이스의 배터리 소모가 급격히 늘어납니다."
  },
  {
    id: 4,
    question: "다음 중 저전력 장거리 통신 기술(LPWAN)에 해당하는 것은?",
    options: ["Wi-Fi", "Bluetooth", "LoRa", "Ethernet"],
    answer: 2,
    explanation: "LoRa(Long Range)는 적은 전력으로 멀리 데이터를 보낼 수 있어 스마트시티 센서에 적합합니다."
  },
  {
    id: 5,
    question: "스마트 서비스 설계 시 '이해관계자'를 고려해야 하는 이유는?",
    options: ["법적으로 필수라서", "다양한 입장에서의 혜택과 불편함을 파악하기 위해", "비용을 줄이기 위해", "센서 종류를 결정하기 위해"],
    answer: 1,
    explanation: "서비스로 인해 혜택을 보는 사람과 불편을 겪을 수 있는 사람을 모두 고려해야 좋은 서비스입니다."
  },
  {
    id: 6,
    question: "개인정보 보호를 위해 CCTV 영상 데이터 수집 시 필요한 조치는?",
    options: ["고화질로 녹화한다", "비식별화(마스킹) 처리를 한다", "모든 사람에게 공개한다", "영구 보존한다"],
    answer: 1,
    explanation: "얼굴이나 번호판 등 민감 정보는 알아볼 수 없게 가리는 비식별화 기술이 필요합니다."
  },
  {
    id: 7,
    question: "스마트 홈 예시 중 '자동화'에 해당하는 것은?",
    options: ["스마트폰으로 TV 켜기", "온도가 30도 이상이면 에어컨 자동 실행", "CCTV 화면 보기", "음성으로 날씨 묻기"],
    answer: 1,
    explanation: "사용자의 개입 없이 조건에 따라 스스로 작동하는 것이 자동화의 핵심입니다."
  },
  {
    id: 8,
    question: "임계값(Threshold)이란 무엇인가요?",
    options: ["센서의 가격", "데이터가 전송되는 속도", "어떤 조치(알림 등)가 실행되는 기준값", "배터리 용량"],
    answer: 2,
    explanation: "예를 들어 '온도 30도'라는 임계값을 넘으면 에어컨을 켜라! 할 때의 기준입니다."
  },
  {
    id: 9,
    question: "IoT 디바이스 보안 취약점으로 가장 흔한 실수는?",
    options: ["비밀번호를 기본값(0000 등)으로 방치함", "너무 비싼 센서 사용", "네트워크 연결 끊김", "데이터 용량 부족"],
    answer: 0,
    explanation: "초기 비밀번호를 바꾸지 않아 해킹당하는 사례가 가장 많습니다."
  },
  {
    id: 10,
    question: "다음 중 스마트 횡단보도에 필요한 센서는?",
    options: ["습도 센서", "가스 센서", "동작/객체 감지 센서", "수질 센서"],
    answer: 2,
    explanation: "보행자나 차량의 유무를 파악하기 위해 동작 또는 객체 감지 센서가 필요합니다."
  }
];

export const CASES: CaseStudy[] = [
  {
    id: "c1",
    category: "스마트 홈",
    title: "아침을 깨우는 스마트 커튼",
    content: "기상 시간에 맞춰 커튼이 열리고, 조명이 서서히 밝아지며, 뉴스가 스피커에서 재생됩니다.",
    tags: ["자동화", "조도센서", "편의성"]
  },
  {
    id: "c2",
    category: "보안/안전",
    title: "AI 산불 감시 드론",
    content: "열화상 카메라를 장착한 드론이 산림을 순찰하며 연기나 이상 고온을 감지해 소방서에 알립니다.",
    tags: ["드론", "열화상", "재난안전"]
  },
  {
    id: "c3",
    category: "이동/교통",
    title: "공유 자전거 재배치 시스템",
    content: "자전거가 부족한 정류장을 예측하여 트럭이 미리 자전거를 옮겨놓습니다.",
    tags: ["빅데이터", "예측", "공유경제"]
  },
  {
    id: "c4",
    category: "환경/에너지",
    title: "스마트 가로등",
    content: "사람이 지나갈 때만 밝아지고 평소에는 어둡게 유지하여 전기를 절약합니다.",
    tags: ["동작센서", "에너지절약", "IoT"]
  }
];

export const CONCEPTS = [
  {
    term: "IoT (사물인터넷)",
    desc: "모든 사물이 인터넷에 연결되어 서로 정보를 주고받는 기술"
  },
  {
    term: "스마트 시티",
    desc: "첨단 정보통신기술(ICT)을 이용해 도시 생활 속의 문제를 해결하는 도시"
  },
  {
    term: "센서 (Sensor)",
    desc: "빛, 소리, 온도 등 물리적인 환경 정보를 감지하여 전기 신호로 바꾸는 장치"
  },
  {
    term: "액추에이터 (Actuator)",
    desc: "전기 신호를 받아 물리적인 움직임이나 빛, 소리 등을 만들어내는 장치 (예: 모터, 스피커)"
  }
];