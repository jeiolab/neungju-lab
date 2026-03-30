import { NetworkType, GameCard, QuizQuestion, Badge } from './types';
import { Bluetooth, Wifi, Map, Globe, HelpCircle, Award, Zap, Brain, Target, Shield, Send } from 'lucide-react';

export const THEORY_CARDS = [
  {
    type: NetworkType.PAN,
    title: 'PAN (Personal Area Network)',
    range: '개인 활동 공간 (약 10m 이내)',
    description: '개인의 기기 간 연결을 위한 가장 작은 규모의 네트워크입니다.',
    examples: ['블루투스 이어폰 연결', '스마트워치와 폰 동기화', '무선 마우스'],
    icon: Bluetooth
  },
  {
    type: NetworkType.LAN,
    title: 'LAN (Local Area Network)',
    range: '근거리 통신망 (집, 학교, 건물)',
    description: '한정된 공간에서 여러 기기를 연결하는 네트워크입니다. 가장 흔하게 접합니다.',
    examples: ['학교 컴퓨터실', '우리집 Wi-Fi', '회사 사내망'],
    icon: Wifi
  },
  {
    type: NetworkType.MAN,
    title: 'MAN (Metropolitan Area Network)',
    range: '도시권 통신망 (도시 규모)',
    description: 'LAN을 여러 개 묶어 도시 전체를 커버하는 네트워크입니다.',
    examples: ['도시 방범용 CCTV망', '통신사 기지국망', '케이블 TV망'],
    icon: Map
  },
  {
    type: NetworkType.WAN,
    title: 'WAN (Wide Area Network)',
    range: '광역 통신망 (국가, 대륙, 전 세계)',
    description: '서로 멀리 떨어진 LAN이나 MAN을 연결하는 가장 넓은 네트워크입니다.',
    examples: ['인터넷', '해저 광케이블', '국가 간 위성 통신'],
    icon: Globe
  },
];

export const GAME_CARDS: GameCard[] = [
  { id: 1, description: "내 스마트폰과 블루투스 스피커 연결", correctType: NetworkType.PAN, explanation: "개인 기기 간의 짧은 거리(약 10m) 연결입니다." },
  { id: 2, description: "거실에 있는 공유기로 노트북 인터넷 접속", correctType: NetworkType.LAN, explanation: "집이라는 한정된 공간 내의 연결입니다." },
  { id: 3, description: "학교 컴퓨터실의 모든 PC가 연결됨", correctType: NetworkType.LAN, explanation: "학교/건물 단위의 근거리 연결입니다." },
  { id: 4, description: "서울시 전체의 교통 신호 제어 시스템", correctType: NetworkType.MAN, explanation: "도시 규모를 커버하는 네트워크입니다." },
  { id: 5, description: "미국에 있는 친구에게 이메일 전송", correctType: NetworkType.WAN, explanation: "국가와 국가를 연결하는 광역 네트워크입니다." },
  { id: 6, description: "스마트워치로 심박수 데이터 폰으로 전송", correctType: NetworkType.PAN, explanation: "신체 부착 기기와 폰 사이의 초근거리 통신입니다." },
  { id: 7, description: "회사 건물 내의 프린터 공유", correctType: NetworkType.LAN, explanation: "사무실/건물 내의 자원 공유를 위한 네트워크입니다." },
  { id: 8, description: "통신사의 도시 내 기지국 연결망", correctType: NetworkType.MAN, explanation: "LAN들이 모여 도시 규모를 형성합니다." },
  { id: 9, description: "넷플릭스 서버(미국)에서 영화 스트리밍", correctType: NetworkType.WAN, explanation: "전 세계를 연결하는 인터넷망을 이용합니다." },
  { id: 10, description: "무선 키보드로 태블릿에 타이핑", correctType: NetworkType.PAN, explanation: "책상 위 정도의 개인 공간 내 연결입니다." },
  { id: 11, description: "구청과 동사무소를 잇는 행정망", correctType: NetworkType.MAN, explanation: "지역(도시) 내의 공공기관 연결입니다." },
  { id: 12, description: "해저 케이블을 통한 글로벌 주식 거래", correctType: NetworkType.WAN, explanation: "대륙 간을 연결하는 가장 넓은 망입니다." },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "다음 중 커버리지(범위)가 가장 좁은 네트워크는?", options: ["WAN", "MAN", "LAN", "PAN"], correctAnswer: 3, explanation: "PAN은 개인 주변 수 미터 이내를 커버합니다." },
  { id: 2, question: "학교 내에서 선생님 컴퓨터와 학생 컴퓨터가 연결된 형태는?", options: ["PAN", "LAN", "MAN", "WAN"], correctAnswer: 1, explanation: "학교, 가정 등 건물 단위는 LAN입니다." },
  { id: 3, question: "서울에서 부산으로 데이터를 보낼 때 주로 이용되는 네트워크는?", options: ["PAN", "LAN", "MAN", "WAN"], correctAnswer: 3, explanation: "도시와 도시, 국가와 국가를 잇는 것은 WAN입니다." },
  { id: 4, question: "블루투스(Bluetooth) 기술이 대표적으로 사용되는 네트워크는?", options: ["PAN", "LAN", "MAN", "WAN"], correctAnswer: 0, explanation: "블루투스는 대표적인 무선 PAN 기술입니다." },
  { id: 5, question: "MAN(Metropolitan Area Network)의 설명으로 옳은 것은?", options: ["개인 기기 간 연결", "전 세계 연결", "도시 규모 연결", "건물 내 연결"], correctAnswer: 2, explanation: "Metropolitan은 도시권을 의미합니다." },
  { id: 6, question: "LAN과 WAN을 연결하기 위해 필요한 장비는?", options: ["모니터", "라우터(Router)", "마우스", "스피커"], correctAnswer: 1, explanation: "서로 다른 네트워크를 연결하여 경로를 설정하는 것은 라우터입니다." },
  { id: 7, question: "집에서 Wi-Fi를 쓰는 것은 어떤 네트워크에 접속하는 것인가요?", options: ["PAN", "LAN", "MAN", "WAN"], correctAnswer: 1, explanation: "Wi-Fi는 무선 LAN(WLAN) 기술입니다." },
  { id: 8, question: "인터넷(Internet)은 어떤 네트워크들의 집합체인가요?", options: ["PAN들의 모임", "오직 LAN들의 모임", "전 세계 수많은 LAN, MAN, WAN의 연결", "컴퓨터 한 대"], correctAnswer: 2, explanation: "인터넷은 전 세계의 네트워크가 연결된 거대 WAN입니다." },
  { id: 9, question: "스마트폰 핫스팟을 켜서 친구가 접속했다면?", options: ["MAN 구성", "소규모 LAN(혹은 PAN) 구성", "WAN 직접 연결", "연결 아님"], correctAnswer: 1, explanation: "기기 간 직접 연결 혹은 소규모 로컬 네트워크를 구성합니다." },
  { id: 10, question: "다음 중 WAN의 사례가 아닌 것은?", options: ["해저 광케이블", "국가 간 위성 통신", "월드 와이드 웹(WWW) 접속", "옆자리 친구에게 에어드롭 전송"], correctAnswer: 3, explanation: "에어드롭 등 기기 간 직접 전송은 PAN 또는 Ad-hoc LAN에 가깝습니다." },
];

export const BADGES: Badge[] = [
  { id: 'start', name: '네트워크 입문', description: '첫 게임을 완료했습니다.', icon: 'Zap', unlocked: false },
  { id: 'accuracy_100', name: '완벽주의자', description: '한 게임에서 100점을 받았습니다.', icon: 'Target', unlocked: false },
  { id: 'streak_3', name: '꾸준함의 힘', description: '3일 연속 접속했습니다.', icon: 'Award', unlocked: false },
  { id: 'quiz_master', name: '퀴즈 마스터', description: '퀴즈에서 100점을 받았습니다.', icon: 'Brain', unlocked: false },
  { id: 'writer', name: '논리왕', description: '서술형 문제에 답변을 작성했습니다.', icon: 'Pen', unlocked: false },
  { id: 'pan_expert', name: 'PAN 전문가', description: 'PAN 관련 문제를 모두 맞혔습니다.', icon: 'User', unlocked: false },
  { id: 'wan_expert', name: 'WAN 전문가', description: 'WAN 관련 문제를 모두 맞혔습니다.', icon: 'Globe', unlocked: false },
  { id: 'mission_complete', name: '하루 분석가', description: '내 하루 네트워크 지도를 완성했습니다.', icon: 'Map', unlocked: false },
  { id: 'try_again', name: '오뚝이', description: '오답노트를 확인하고 재도전했습니다.', icon: 'RefreshCcw', unlocked: false },
  { id: 'level_5', name: '네트워크 마스터', description: '레벨 5에 도달했습니다.', icon: 'Shield', unlocked: false },
];
