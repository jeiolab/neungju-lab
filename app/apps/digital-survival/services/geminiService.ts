'use client'

import { Scenario, Choice, GameStats, EvaluationResult } from "../types";

// 동적 시나리오 생성을 위한 템플릿 데이터베이스
const LOCATIONS = [
  "스타벅스", "이디야 커피", "카페베네", "할리스", "학교 교실", "도서관", "학교 급식실",
  "시내버스", "지하철", "KTX", "공항", "지하철역", "버스정류장", "편의점",
  "학교 운동장", "학원", "PC방", "노래방", "영화관", "쇼핑몰", "식당",
  "친구 집", "할머니 집", "공원", "해변", "산", "박물관", "미술관",
  "체육관", "수영장", "서점", "병원", "은행", "우체국", "약국"
];

const SITUATIONS = [
  { 
    context: "과제", 
    tasks: ["수행평가 파일 업로드", "프레젠테이션 자료 다운로드", "과제 제출", "논문 자료 검색", "온라인 수업 참여"],
    urgency: ["급하게", "여유롭게", "서두르지 않고", "시간이 없어서", "마감이 다가와서"]
  },
  { 
    context: "엔터테인먼트", 
    tasks: ["유튜브 영상 시청", "게임 스트리밍", "음악 스트리밍", "넷플릭스 시청", "웹툰 보기", "SNS 확인"],
    urgency: ["지루해서", "시간을 보내기 위해", "재미있게", "편하게", "즐겁게"]
  },
  { 
    context: "소통", 
    tasks: ["친구와 채팅", "가족과 영상통화", "그룹 프로젝트 회의", "온라인 모임 참여", "파일 공유"],
    urgency: ["중요한", "긴급한", "즉시", "빠르게", "서둘러서"]
  },
  { 
    context: "정보", 
    tasks: ["지도 확인", "날씨 확인", "뉴스 읽기", "검색", "번역", "길 찾기"],
    urgency: ["필요해서", "궁금해서", "확인하려고", "찾기 위해", "알아보려고"]
  },
  { 
    context: "보안", 
    tasks: ["알 수 없는 파일 수신", "의심스러운 링크 수신", "공용 와이파이 발견", "모르는 사람의 연결 요청"],
    urgency: ["갑자기", "예상치 못하게", "의외로", "순간적으로", "갑작스럽게"]
  },
  { 
    context: "데이터", 
    tasks: ["데이터 부족", "데이터 소진", "데이터 절약 필요", "대용량 파일 전송", "데이터 공유 요청"],
    urgency: ["급하게", "절실히", "필요해서", "부족해서", "절약하려고"]
  },
  { 
    context: "배터리", 
    tasks: ["배터리 부족", "충전기 없음", "배터리 절약 필요", "장시간 사용", "배터리 관리"],
    urgency: ["급하게", "절실히", "필요해서", "부족해서", "관리하려고"]
  }
];

const WIFI_OPTIONS = [
  { name: "Open_WiFi_Free", security: false },
  { name: "Free_Public_WiFi", security: false },
  { name: "Public_WiFi_No_Password", security: false },
  { name: "Guest_WiFi", security: false },
  { name: "Cafe_WiFi_Free", security: false },
  { name: "Secure_Cafe_WiFi", security: true },
  { name: "Library_WiFi", security: true },
  { name: "School_WiFi", security: true },
  { name: "Bus_WiFi", security: false },
  { name: "Subway_WiFi", security: false }
];

// 선택지 템플릿
const CHOICE_TEMPLATES = {
  wifi: [
    { id: "wifi", label: "공용 와이파이 연결", description: "데이터를 아끼기 위해 공용 와이파이를 사용합니다." },
    { id: "wifi_secure", label: "암호화된 와이파이 연결", description: "비밀번호가 있는 안전한 와이파이를 사용합니다." }
  ],
  hotspot: [
    { id: "hotspot", label: "내 폰으로 핫스팟", description: "보안을 위해 내 LTE/5G 데이터를 나눠줍니다." },
    { id: "hotspot_open", label: "핫스팟 켜주기", description: "다른 사람을 위해 핫스팟을 켜줍니다." }
  ],
  data: [
    { id: "data_use", label: "LTE/5G 데이터 사용", description: "안정적인 데이터 연결을 사용합니다." },
    { id: "roaming", label: "로밍 데이터 사용", description: "비싸지만 안전한 로밍을 사용합니다." }
  ],
  bluetooth: [
    { id: "bluetooth", label: "블루투스 / 퀵쉐어 사용", description: "가까운 거리에서 무선으로 연결합니다." },
    { id: "bluetooth_share", label: "블루투스 테더링", description: "속도는 느리지만 배터리를 아끼는 방식을 씁니다." }
  ],
  offline: [
    { id: "wait", label: "참는다", description: "나중에 처리하기 위해 기다립니다." },
    { id: "offline", label: "오프라인 모드 사용", description: "데이터를 아끼기 위해 오프라인으로 처리합니다." },
    { id: "ask", label: "다른 사람에게 물어보기", description: "디지털 기기를 쓰지 않고 직접 물어봅니다." }
  ],
  security: [
    { id: "accept", label: "수락하기", description: "무엇인지 궁금해서 받아봅니다." },
    { id: "decline", label: "거절하고 기능 끄기", description: "모르는 파일은 위험하므로 거절하고 공유 기능을 끕니다." },
    { id: "ignore", label: "무시하기", description: "아무 반응도 하지 않고 가만히 둡니다." }
  ]
};

// 시나리오 생성 함수
function generateDynamicScenario(turn: number, previousScenario?: Scenario): Omit<Scenario, 'id'> {
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const situation = SITUATIONS[Math.floor(Math.random() * SITUATIONS.length)];
  const task = situation.tasks[Math.floor(Math.random() * situation.tasks.length)];
  const urgency = situation.urgency[Math.floor(Math.random() * situation.urgency.length)];
  
  let title = "";
  let description = "";
  let choices: Choice[] = [];
  
  // 상황별 시나리오 생성
  if (situation.context === "보안") {
    const wifiOption = WIFI_OPTIONS[Math.floor(Math.random() * WIFI_OPTIONS.length)];
    title = `${location}에서의 ${situation.context} 상황`;
    description = `${urgency} ${task}했습니다. ${wifiOption.security ? '암호화된' : '암호 없는'} 와이파이 '${wifiOption.name}'가 보입니다.`;
    
    if (task.includes("파일 수신") || task.includes("연결 요청")) {
      choices = [
        CHOICE_TEMPLATES.security[0],
        CHOICE_TEMPLATES.security[1],
        CHOICE_TEMPLATES.security[2]
      ];
    } else {
      choices = [
        wifiOption.security ? CHOICE_TEMPLATES.wifi[1] : CHOICE_TEMPLATES.wifi[0],
        CHOICE_TEMPLATES.hotspot[0],
        CHOICE_TEMPLATES.offline[0]
      ];
    }
  } else if (situation.context === "데이터") {
    title = `${location}에서의 ${situation.context} 문제`;
    description = `${urgency} ${task}해야 합니다. ${location}에 와이파이가 있지만 보안 상태를 알 수 없습니다.`;
    
    const choiceSet = Math.floor(Math.random() * 3);
    if (choiceSet === 0) {
      choices = [
        CHOICE_TEMPLATES.wifi[0],
        CHOICE_TEMPLATES.hotspot[0],
        CHOICE_TEMPLATES.offline[0]
      ];
    } else if (choiceSet === 1) {
      choices = [
        CHOICE_TEMPLATES.data[0],
        CHOICE_TEMPLATES.bluetooth[0],
        CHOICE_TEMPLATES.offline[1]
      ];
    } else {
      choices = [
        CHOICE_TEMPLATES.wifi[1],
        CHOICE_TEMPLATES.data[0],
        CHOICE_TEMPLATES.offline[2]
      ];
    }
  } else if (situation.context === "배터리") {
    title = `${location}에서의 ${situation.context} 관리`;
    description = `${urgency} ${task}해야 하는데 배터리가 부족합니다. 충전기가 없어서 전력 관리를 해야 합니다.`;
    
    choices = [
      CHOICE_TEMPLATES.data[0],
      CHOICE_TEMPLATES.bluetooth[1],
      CHOICE_TEMPLATES.offline[0]
    ];
  } else {
    // 일반 상황
    const wifiOption = WIFI_OPTIONS[Math.floor(Math.random() * WIFI_OPTIONS.length)];
    title = `${location}에서의 ${task}`;
    description = `${urgency} ${task}해야 합니다. ${wifiOption.security ? '암호화된' : '암호 없는'} 와이파이 '${wifiOption.name}'가 보입니다.`;
    
    const choiceSet = Math.floor(Math.random() * 4);
    if (choiceSet === 0) {
      choices = [
        wifiOption.security ? CHOICE_TEMPLATES.wifi[1] : CHOICE_TEMPLATES.wifi[0],
        CHOICE_TEMPLATES.hotspot[0],
        CHOICE_TEMPLATES.offline[0]
      ];
    } else if (choiceSet === 1) {
      choices = [
        CHOICE_TEMPLATES.data[0],
        CHOICE_TEMPLATES.bluetooth[0],
        CHOICE_TEMPLATES.offline[1]
      ];
    } else if (choiceSet === 2) {
      choices = [
        wifiOption.security ? CHOICE_TEMPLATES.wifi[1] : CHOICE_TEMPLATES.wifi[0],
        CHOICE_TEMPLATES.data[0],
        CHOICE_TEMPLATES.offline[2]
      ];
    } else {
      choices = [
        CHOICE_TEMPLATES.hotspot[1],
        CHOICE_TEMPLATES.bluetooth[1],
        CHOICE_TEMPLATES.offline[0]
      ];
    }
  }
  
  // 이전 시나리오와 중복 방지 (간단한 체크)
  if (previousScenario && previousScenario.title === title && previousScenario.location === location) {
    return generateDynamicScenario(turn, previousScenario);
  }
  
  return {
    title,
    location,
    description,
    choices: choices.map((c, idx) => ({
      ...c,
      id: `${c.id}_${turn}_${idx}_${Date.now()}`
    }))
  };
}

// 상황별 평가 로직
export const evaluateAction = async (
  scenario: Scenario,
  choice: Choice,
  currentStats: GameStats
): Promise<EvaluationResult> => {
  // 네트워크 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 800));

  let changes = { data: 0, battery: 0, security: 0, exp: 0 };
  let message = "";
  let knowledge = "";
  let success = true;

  // 키워드 기반 판정 로직
  const label = choice.label;
  const id = choice.id;

  // 1. 와이파이 (WiFi)
  if (label.includes("와이파이") || id.includes("wifi")) {
    if (label.includes("공용") || label.includes("무료") || id.includes("free")) {
      changes = { data: 0, battery: -5, security: -20, exp: 5 };
      message = "주의! 공용 와이파이는 해킹 위험이 있습니다. 데이터는 아꼈지만 보안 점수가 크게 깎였습니다.";
      knowledge = "공공 장소의 암호 없는 와이파이는 '중간자 공격'에 취약하여 개인정보가 탈취될 수 있습니다.";
      success = false;
    } else {
      changes = { data: 0, battery: -5, security: 0, exp: 10 };
      message = "안전한 와이파이에 연결했습니다. 데이터 걱정 없이 인터넷을 사용합니다.";
      knowledge = "WPA2/WPA3 등 암호화된 와이파이를 사용하는 것이 안전합니다.";
      success = true;
    }
  }
  // 2. 핫스팟 (Hotspot)
  else if (label.includes("핫스팟") || id.includes("hotspot")) {
    changes = { data: -25, battery: -20, security: -5, exp: 15 };
    message = "핫스팟을 켜자 배터리와 데이터가 녹아내립니다! 친구가 고화질 영상을 보나 봅니다.";
    knowledge = "모바일 핫스팟은 통신망 신호를 와이파이로 변환하므로 배터리와 데이터 소모가 극심합니다.";
    success = false; // 자원 소모가 너무 큼
  }
  // 3. 데이터 (Cellular)
  else if (label.includes("데이터") || label.includes("LTE") || label.includes("5G") || label.includes("로밍")) {
    changes = { data: -15, battery: -10, security: 5, exp: 10 };
    message = "가장 안정적인 선택입니다. 데이터는 줄었지만 보안 위협 없이 작업을 마쳤습니다.";
    knowledge = "LTE/5G 셀룰러 네트워크는 공용 와이파이보다 보안성이 훨씬 뛰어납니다.";
    success = true;
  }
  // 4. 블루투스/근거리 (Bluetooth/AirDrop)
  else if (label.includes("블루투스") || label.includes("쉐어") || label.includes("AirDrop")) {
    if (id === "accept") {
      changes = { data: 0, battery: -2, security: -30, exp: 5 };
      message = "위험! 모르는 사람의 파일을 받았다가 바이러스에 감염될 뻔했습니다.";
      knowledge = "AirDrop이나 퀵쉐어는 아는 사람하고만 사용하고, 평소에는 '연락처만' 또는 '끄기'로 설정해야 합니다.";
      success = false;
    } else if (label.includes("거절") || label.includes("끄기")) {
      changes = { data: 0, battery: 0, security: 10, exp: 20 };
      message = "현명한 판단입니다! 사이버 불링이나 악성 코드로부터 자신을 지켰습니다.";
      knowledge = "불필요한 무선 연결 기능을 꺼두는 것만으로도 스마트폰 보안을 높일 수 있습니다.";
      success = true;
    } else {
      changes = { data: 0, battery: -5, security: 5, exp: 15 };
      message = "데이터 소모 없이 파일을 주고받았습니다. 속도는 느리지만 효율적입니다.";
      knowledge = "블루투스 테더링은 핫스팟보다 배터리 소모가 적지만 속도가 느립니다.";
      success = true;
    }
  }
  // 5. 오프라인/대기 (Offline)
  else if (label.includes("참는다") || label.includes("저장된") || label.includes("묻기")) {
    changes = { data: 0, battery: 0, security: 5, exp: 5 };
    message = "디지털 디톡스! 자원을 전혀 쓰지 않고 상황을 넘겼습니다.";
    knowledge = "때로는 연결하지 않는 것이 최고의 보안이자 절약입니다.";
    success = true;
  }
  // Fallback
  else {
    changes = { data: -5, battery: -5, security: 0, exp: 5 };
    message = "무난하게 상황을 해결했습니다.";
    knowledge = "상황에 맞는 네트워크 선택이 중요합니다.";
    success = true;
  }

  return {
    outcomeMessage: message,
    acquiredKnowledge: knowledge,
    statChanges: changes,
    success: success,
    nextScenarioPreview: "다음 상황으로 이동합니다..."
  };
};

export const generateNextScenario = async (
  previousScenario: Scenario,
  turn: number
): Promise<Scenario> => {
  // 네트워크 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));

  // 동적 시나리오 생성 (수백 개의 다양한 조합 가능)
  const dynamicScenario = generateDynamicScenario(turn, previousScenario);

  return {
    id: `turn_${turn}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...dynamicScenario
  };
};
