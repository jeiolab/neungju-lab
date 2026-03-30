import { TechType, TechCard, QuizQuestion, SimulationItem } from './types';
import { Wifi, Bluetooth, Radio, Smartphone, Activity, Rss, Globe } from 'lucide-react';

export const TECH_DATA: TechCard[] = [
  {
    id: TechType.BLUETOOTH,
    name: "블루투스 (Bluetooth)",
    description: "근거리 무선 통신 표준으로, 주로 휴대기기 간의 연결에 사용됩니다.",
    features: ["거리: 10m 이내(단거리)", "속도: 중간", "전력: 저전력"],
    usage: ["무선 이어폰", "스피커", "스마트워치 연결"],
    icon: "Bluetooth"
  },
  {
    id: TechType.WIFI,
    name: "와이파이 (Wi-Fi)",
    description: "무선 LAN 기술로, 고속 인터넷 접속을 제공합니다.",
    features: ["거리: 50~100m", "속도: 매우 빠름", "전력: 비교적 높음"],
    usage: ["노트북 인터넷", "스마트폰 영상 스트리밍", "스마트홈 기기"],
    icon: "Wifi"
  },
  {
    id: TechType.NFC,
    name: "NFC",
    description: "10cm 이내의 초근거리에서 데이터를 주고받는 통신 기술입니다.",
    features: ["거리: 10cm 이내", "속도: 느림", "보안성: 높음", "접촉식"],
    usage: ["교통카드", "모바일 결제(삼성페이/애플페이)", "출입 태그"],
    icon: "Smartphone"
  },
  {
    id: TechType.RFID,
    name: "RFID",
    description: "무선 주파수를 이용해 물건이나 사람을 식별하는 기술입니다.",
    features: ["거리: 수 m ~ 수십 m", "용도: 인식/식별", "가격: 태그가 저렴"],
    usage: ["하이패스(톨게이트)", "도서관 도난 방지", "물류 관리"],
    icon: "Radio"
  },
  {
    id: TechType.FIVE_G,
    name: "5G",
    description: "초고속, 초저지연, 초연결을 특징으로 하는 5세대 이동통신입니다.",
    features: ["속도: LTE보다 20배 빠름", "지연시간: 매우 짧음", "연결: 대규모 기기"],
    usage: ["자율주행", "VR/AR", "원격 의료"],
    icon: "Activity"
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 'q1',
    scenario: "버스를 탈 때 단말기에 스마트폰이나 카드를 '삑'하고 갖다 댑니다.",
    correctTech: TechType.NFC,
    explanation: "교통카드는 10cm 이내의 초근거리 통신인 NFC를 사용합니다.",
    options: [TechType.NFC, TechType.BLUETOOTH, TechType.WIFI, TechType.RFID]
  },
  {
    id: 'q2',
    scenario: "고속도로 톨게이트를 멈추지 않고 지나가면서 통행료를 결제합니다(하이패스).",
    correctTech: TechType.RFID,
    explanation: "하이패스는 일정 거리 이상에서 차량을 인식해야 하므로 RFID 기술을 사용합니다.",
    options: [TechType.NFC, TechType.RFID, TechType.BLUETOOTH, TechType.FIVE_G]
  },
  {
    id: 'q3',
    scenario: "카페에서 노트북으로 고화질 유튜브 영상을 끊김 없이 보고 싶습니다.",
    correctTech: TechType.WIFI,
    explanation: "대용량 데이터를 빠르고 안정적으로 전송하기 위해서는 와이파이가 적합합니다.",
    options: [TechType.WIFI, TechType.NFC, TechType.BLUETOOTH, TechType.RFID]
  },
  {
    id: 'q4',
    scenario: "스마트폰에 있는 음악을 무선 헤드셋으로 듣고 싶습니다.",
    correctTech: TechType.BLUETOOTH,
    explanation: "저전력으로 주변 기기와 페어링하여 소리를 전송하는 데는 블루투스가 표준입니다.",
    options: [TechType.BLUETOOTH, TechType.WIFI, TechType.NFC, TechType.LTE]
  },
  {
    id: 'q5',
    scenario: "자율주행 자동차가 실시간으로 도로 상황을 주고받으며 운전합니다.",
    correctTech: TechType.FIVE_G,
    explanation: "자율주행은 0.001초의 지연도 허용하지 않는 초저지연 통신인 5G가 필수입니다.",
    options: [TechType.FIVE_G, TechType.WIFI, TechType.BLUETOOTH, TechType.NFC]
  }
];

export const SIMULATION_ITEMS: SimulationItem[] = [
  { id: 's1', name: '무선 이어폰', tech: TechType.BLUETOOTH, x: 20, y: 20, icon: 'Headphones' },
  { id: 's2', name: '와이파이 공유기', tech: TechType.WIFI, x: 80, y: 20, icon: 'Router' },
  { id: 's3', name: '버스 단말기', tech: TechType.NFC, x: 20, y: 80, icon: 'Bus' },
  { id: 's4', name: '하이패스 게이트', tech: TechType.RFID, x: 80, y: 80, icon: 'Car' },
];
