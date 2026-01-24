import { MethodType, TheoryCardData, QuizQuestion } from './types';
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
