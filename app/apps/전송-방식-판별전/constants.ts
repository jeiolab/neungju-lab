import { MethodType, Scenario, TheoryCardData, QuizQuestion } from './types';
import { Wifi, Bluetooth, Nfc, Cloud, Smartphone, Cable } from 'lucide-react';

export const THEORY_DATA: TheoryCardData[] = [
  {
    title: "Wi-Fi (Direct/LAN)",
    method: "Wi-Fi",
    description: "무선 랜을 통해 데이터를 주고받는 방식. 속도가 빠르고 범위가 비교적 넓음.",
    pros: ["높은 전송 속도", "중거리(수십미터)", "다중 접속"],
    cons: ["공유기 필요(일반적)", "보안 설정 필요"],
    icon: "wifi"
  },
  {
    title: "Bluetooth",
    method: "Bluetooth",
    description: "가까운 거리에서 기기 간 1:1 연결. 저전력으로 간단한 파일 전송에 적합.",
    pros: ["간편한 페어링", "저전력", "인터넷 불필요"],
    cons: ["느린 속도", "짧은 거리(10m 이내)"],
    icon: "bluetooth"
  },
  {
    title: "NFC",
    method: "NFC",
    description: "10cm 이내 초근접 통신. 결제나 태그 인식에 주로 사용.",
    pros: ["매우 빠른 연결(접촉)", "보안성 우수(근접 필수)"],
    cons: ["매우 짧은 거리", "대용량 전송 불가"],
    icon: "nfc"
  },
  {
    title: "Cloud",
    method: "Cloud",
    description: "인터넷 서버에 저장하고 내려받는 방식. 시공간 제약 없음.",
    pros: ["장소/기기 무관", "협업 용이", "백업"],
    cons: ["인터넷 필수", "데이터 요금 발생 가능", "계정 필요"],
    icon: "cloud"
  },
  {
    title: "Mobile Network",
    method: "Mobile",
    description: "LTE/5G망 사용. 기지국을 통해 어디서든 연결.",
    pros: ["넓은 커버리지", "이동 중 사용 가능"],
    cons: ["데이터 요금", "음영 지역 존재"],
    icon: "smartphone"
  },
  {
    title: "Wired (유선)",
    method: "Wired",
    description: "케이블로 직접 연결. 가장 안정적이고 빠름.",
    pros: ["최고 속도", "안정성", "보안성"],
    cons: ["물리적 연결 필요", "이동성 제한"],
    icon: "cable"
  }
];

/** API 실패 시 또는 응답이 비정상일 때 순환하는 고정 시나리오 (항상 같은 한 문제만 쓰지 않도록) */
export const STATIC_GAME_SCENARIOS: Scenario[] = [
  {
    id: 'static-cafe-wired',
    description:
      '친구와 카페에 있다. 3GB 짜리 여행 동영상을 친구의 노트북으로 가장 빨리 옮기고 싶다. 둘 다 외장하드는 없지만 C-to-C 케이블은 가지고 있다.',
    correctMethod: 'Wired',
    reasoning:
      '대용량 파일(3GB)을 가장 빠르고 안정적으로 전송하는 방법은 유선 연결입니다. 무선은 시간이 오래 걸리거나 불안정할 수 있습니다.',
    tags: ['capacity', 'speed'],
  },
  {
    id: 'static-overseas-cloud',
    description:
      '미국에 있는 친구에게 집에서 찍은 2GB 졸업 영상을 보내야 한다. 며칠 안에 받아야 하고, 직접 만날 수는 없다.',
    correctMethod: 'Cloud',
    reasoning:
      '물리적으로 떨어져 있고 대용량이면 클라우드 공유 링크(드라이브 등)로 올려 두고 받게 하는 방식이 현실적입니다.',
    tags: ['distance', 'capacity'],
  },
  {
    id: 'static-airpods-bluetooth',
    description:
      '새 에어팟 케이스를 열었더니 아이폰에 연결 팝업이 떴다. 음악을 들으려면 어떤 방식으로 폰과 이어폰을 연결하는 게 일반적인가?',
    correctMethod: 'Bluetooth',
    reasoning:
      '무선 이어폰은 블루투스 페어링으로 연결하는 것이 표준입니다.',
    tags: ['pairing', 'short-range'],
  },
  {
    id: 'static-bus-card-nfc',
    description:
      '버스에 탔다. 단말기에 카드를 대자 "삑" 소리와 함께 요금이 결제됐다. 주로 어떤 근거리 통신이 쓰였을까?',
    correctMethod: 'NFC',
    reasoning:
      '교통카드 결제는 태그 방식의 NFC가 대표적입니다.',
    tags: ['payment', 'short-range'],
  },
  {
    id: 'static-classroom-wifi',
    description:
      '같은 교실 안에서 노트북 20대가 한 프린터로 과제를 출력해야 한다. 공유기가 있는 교실이다. 가장 무난한 연결 방식은?',
    correctMethod: 'Wi-Fi',
    reasoning:
      '같은 공간에 여러 기기가 네트워크로 연결될 때는 Wi-Fi(무선 LAN)로 프린터를 공유하는 경우가 많습니다.',
    tags: ['multi-device', 'lan'],
  },
  {
    id: 'static-bank-usb-wired',
    description:
      '은행 업무용 PC에서 반출 금지인 고객 정보 파일을 옆자리 승인된 업무 PC로만 옮겨야 한다. 인터넷 업로드는 절대 안 된다.',
    correctMethod: 'Wired',
    reasoning:
      '내부망 업로드도 금지라면 USB 등 유선으로 직접 연결·복사하는 방식이(정책 허용 범위 내에서) 네트워크 유출 위험이 가장 적습니다.',
    tags: ['security', 'policy'],
  },
  {
    id: 'static-hiking-mobile',
    description:
      '등산 중 산속에서 긴급 상황 문자 한 통과 현재 위치만 보내야 한다. Wi-Fi는 없고 LTE 신호는 약하지만 잡힌다.',
    correctMethod: 'Mobile',
    reasoning:
      '야외·이동 중에는 이동통신(LTE/5G)망을 쓰는 것이 일반적입니다.',
    tags: ['mobility', 'outdoor'],
  },
  {
    id: 'static-phone-to-phone-nfc',
    description:
      '친구 폰에 있는 사진 한 장을 내 폰으로 바로 옮기고 싶다. 둘 다 NFC를 지원하고, 등을 맞대면 전송 메뉴가 뜬다.',
    correctMethod: 'NFC',
    reasoning:
      '짧은 거리에서 태그 한 번으로 소량 데이터를 주고받는 방식은 NFC가 적합합니다.',
    tags: ['short-range', 'small-file'],
  },
];

export const INITIAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 전송 거리가 가장 짧은 방식은?",
    options: ["Wi-Fi", "Bluetooth", "NFC", "LTE"],
    answer: 2,
    explanation: "NFC(Near Field Communication)는 10cm 이내의 초근거리 통신 방식입니다."
  },
  {
    id: 2,
    question: "해외 여행 중인 친구에게 고화질 동영상을 보내려 한다. 가장 적절한 방식은?",
    options: ["Bluetooth", "NFC", "Cloud 공유", "유선 케이블"],
    answer: 2,
    explanation: "물리적 거리가 멀기 때문에 인터넷을 이용한 Cloud 공유가 적합합니다."
  },
  {
    id: 3,
    question: "교실에서 태블릿 화면을 TV로 미러링하려 한다. 인터넷이 안 되어도 가능한 방식은?",
    options: ["Cloud", "Miracast (Wi-Fi Direct)", "LTE", "이메일"],
    answer: 1,
    explanation: "Wi-Fi Direct 기술을 활용한 Miracast는 인터넷 없이 기기 간 직접 연결로 화면을 전송합니다."
  },
  {
    id: 4,
    question: "버스 카드를 단말기에 대서 요금을 지불했다. 사용된 기술은?",
    options: ["NFC", "Bluetooth", "Wi-Fi", "GPS"],
    answer: 0,
    explanation: "교통카드는 태그 방식의 NFC 기술을 사용합니다."
  },
  {
    id: 5,
    question: "보안이 매우 중요한 기밀 문서를 옆 사무실로 보내려 한다. 해킹 위험이 가장 적은 방식은?",
    options: ["공용 Wi-Fi", "클라우드 링크", "유선(USB/LAN)", "블루투스"],
    answer: 2,
    explanation: "유선 연결이나 오프라인 USB 전달은 네트워크 해킹 위험으로부터 가장 안전합니다."
  }
];

export const SAFETY_CHECKLIST = [
  "출처가 불분명한 파일은 절대 받지 않기 (악성코드 위험)",
  "공용 Wi-Fi 사용 시 금융 거래 자제하기",
  "블루투스/AirDrop은 사용하지 않을 때 꺼두기 (블루보닝 방지)",
  "클라우드 공유 시 권한 설정(보기/편집) 확인하기",
  "타인의 저작물을 무단으로 공유하지 않기"
];
