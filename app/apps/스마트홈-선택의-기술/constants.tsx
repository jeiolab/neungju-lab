import { IoTFeature, QuizQuestion, CaseStudy, ThinkingProblem } from './types';
import { Home, Zap, Shield, HeartPulse, Video, Mic, Key, Thermometer, ShoppingCart, Tv } from 'lucide-react';
import React from 'react';

export const IOT_FEATURES: (IoTFeature & { icon: React.ReactNode })[] = [
  {
    id: 'ai_speaker',
    name: 'AI 음성 비서',
    description: '음성으로 집안 기기를 제어하고 정보를 검색합니다.',
    category: 'convenience',
    scores: { convenience: 9, safety: 2, privacyRisk: 8 },
    icon: <Mic className="w-5 h-5" />
  },
  {
    id: 'smart_lock',
    name: '스마트 도어락',
    description: '원격으로 문을 열고 방문 기록을 확인합니다.',
    category: 'security',
    scores: { convenience: 8, safety: 7, privacyRisk: 5 },
    icon: <Key className="w-5 h-5" />
  },
  {
    id: 'indoor_cam',
    name: '홈 CCTV (실내)',
    description: '집 안 상황을 실시간으로 모니터링합니다.',
    category: 'security',
    scores: { convenience: 4, safety: 9, privacyRisk: 10 },
    icon: <Video className="w-5 h-5" />
  },
  {
    id: 'smart_fridge',
    name: '스마트 냉장고',
    description: '식재료 유통기한 관리 및 레시피를 추천합니다.',
    category: 'health',
    scores: { convenience: 7, safety: 1, privacyRisk: 3 },
    icon: <ShoppingCart className="w-5 h-5" />
  },
  {
    id: 'robot_cleaner',
    name: '로봇 청소기 (카메라형)',
    description: '집 구조를 매핑하고 자동으로 청소합니다.',
    category: 'convenience',
    scores: { convenience: 9, safety: 1, privacyRisk: 7 },
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'smart_thermostat',
    name: '스마트 온도조절기',
    description: '외출 시 자동으로 난방을 조절해 에너지를 절약합니다.',
    category: 'energy',
    scores: { convenience: 6, safety: 2, privacyRisk: 2 },
    icon: <Thermometer className="w-5 h-5" />
  },
  {
    id: 'health_monitor',
    name: '노인 돌봄 센서',
    description: '움직임이 없으면 보호자에게 알림을 보냅니다.',
    category: 'health',
    scores: { convenience: 5, safety: 8, privacyRisk: 4 },
    icon: <HeartPulse className="w-5 h-5" />
  },
  {
    id: 'smart_tv',
    name: '스마트 TV',
    description: '사용자 취향을 분석해 콘텐츠를 추천합니다.',
    category: 'convenience',
    scores: { convenience: 8, safety: 0, privacyRisk: 5 },
    icon: <Tv className="w-5 h-5" />
  },
  {
    id: 'gas_breaker',
    name: '가스 차단기',
    description: '원격으로 가스 밸브를 잠급니다.',
    category: 'safety',
    scores: { convenience: 5, safety: 10, privacyRisk: 1 },
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'smart_curtain',
    name: '스마트 커튼',
    description: '기상 시간에 맞춰 자동으로 커튼을 엽니다.',
    category: 'convenience',
    scores: { convenience: 7, safety: 1, privacyRisk: 1 },
    icon: <Home className="w-5 h-5" />
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "IoT(사물인터넷) 기술의 가장 큰 특징은 무엇인가요?",
    options: ["모든 사물이 인터넷에 연결되어 데이터를 주고받는다.", "사물이 스스로 생각하고 감정을 가진다.", "인터넷 연결 없이 기기가 작동한다.", "모든 기기가 무료로 제공된다."],
    correctAnswer: 0,
    explanation: "IoT는 사물들이 인터넷을 통해 연결되어 서로 정보를 공유하고 제어하는 기술입니다.",
    biasType: 'knowledge_gap'
  },
  {
    id: 2,
    question: "스마트홈 기기를 사용할 때 발생할 수 있는 '프라이버시 침해' 사례로 적절하지 않은 것은?",
    options: ["홈 CCTV 해킹으로 집안 영상 유출", "AI 스피커가 대화 내용 무단 수집", "스마트 냉장고가 전기세 절약", "로봇청소기가 집 구조 데이터 유출"],
    correctAnswer: 2,
    explanation: "전기세 절약은 프라이버시 침해가 아닌 IoT의 혜택(경제성/효율성)에 해당합니다.",
    biasType: 'risk_overestimation'
  },
  {
    id: 3,
    question: "다음 중 IoT 보안을 위해 권장되는 행동은?",
    options: ["초기 비밀번호(0000 등) 계속 사용", "소프트웨어 업데이트 끄기", "비밀번호를 주기적으로 변경하고 복잡하게 설정", "모든 기기의 권한을 '항상 허용'으로 설정"],
    correctAnswer: 2,
    explanation: "초기 비밀번호 변경과 주기적인 업데이트는 가장 기본적인 보안 수칙입니다.",
    biasType: 'risk_underestimation'
  },
  {
    id: 4,
    question: "편의성을 높이기 위해 위치 데이터를 항상 켜두는 것의 트레이드오프(Trade-off)는?",
    options: ["배터리가 절약된다.", "개인의 이동 경로가 노출될 위험이 커진다.", "인터넷 속도가 빨라진다.", "기기 가격이 저렴해진다."],
    correctAnswer: 1,
    explanation: "편의성(위치 기반 서비스)을 얻는 대신 프라이버시(이동 경로 노출)의 위험이 증가하는 트레이드오프 관계입니다.",
    biasType: 'balanced'
  },
  {
    id: 5,
    question: "스마트 의료 기기(웨어러블)의 주요 혜택은?",
    options: ["개인 건강 데이터 실시간 모니터링", "게임 성능 향상", "동영상 스트리밍 속도 증가", "SNS 팔로워 증가"],
    correctAnswer: 0,
    explanation: "스마트 워치 등은 심박수, 활동량 등을 측정하여 건강 관리에 도움을 줍니다.",
    biasType: 'knowledge_gap'
  },
  {
    id: 6,
    question: "데이터 '최소 수집의 원칙'이란 무엇인가요?",
    options: ["가능한 모든 데이터를 수집하는 것", "서비스 제공에 꼭 필요한 최소한의 정보만 수집하는 것", "데이터를 전혀 수집하지 않는 것", "사용자 몰래 데이터를 수집하는 것"],
    correctAnswer: 1,
    explanation: "프라이버시 보호를 위해 서비스 목적 달성에 필요한 최소한의 정보만 요구해야 합니다.",
    biasType: 'balanced'
  },
  {
    id: 7,
    question: "스마트홈 기기가 인터넷 연결이 끊겼을 때 발생할 수 있는 문제는?",
    options: ["기기가 폭발한다.", "원격 제어 등 핵심 기능을 사용할 수 없게 된다.", "자동으로 보안이 강화된다.", "전기세가 0원이 된다."],
    correctAnswer: 1,
    explanation: "IoT 기기는 네트워크 의존도가 높아 연결 끊김 시 기능 장애(가용성 문제)가 발생합니다.",
    biasType: 'risk_underestimation'
  },
  {
    id: 8,
    question: "다음 중 '안전(Safety)'을 강화하기 위한 IoT 활용 예시는?",
    options: ["스마트 전구로 분위기 연출", "스마트 플러그로 원격 전원 차단 (화재 예방)", "음성으로 음악 재생", "냉장고 식재료 주문"],
    correctAnswer: 1,
    explanation: "과열된 기기의 전원을 원격으로 차단하여 화재를 예방하는 것은 안전 기능입니다.",
    biasType: 'knowledge_gap'
  },
  {
    id: 9,
    question: "공유 자전거 이용 시 수집되는 데이터와 거리가 먼 것은?",
    options: ["이동 경로", "결제 정보", "사용자 혈액형", "대여/반납 시간"],
    correctAnswer: 2,
    explanation: "혈액형은 공유 자전거 서비스 이용에 불필요한 과도한 정보입니다.",
    biasType: 'risk_overestimation'
  },
  {
    id: 10,
    question: "IoT 시대에 필요한 시민의 태도로 가장 적절한 것은?",
    options: ["기술을 무조건 거부한다.", "편리하다면 위험은 무시한다.", "기술의 혜택을 누리되, 위험 요소를 이해하고 주체적으로 선택한다.", "모든 결정을 AI에게 맡긴다."],
    correctAnswer: 2,
    explanation: "디지털 리터러시를 갖추고 기술의 명암을 균형 있게 바라보는 태도가 필요합니다.",
    biasType: 'balanced'
  }
];

export const CASES: CaseStudy[] = [
  {
    id: 'case_home',
    title: '스마트홈 통합 제어',
    image: 'https://picsum.photos/400/250?random=1',
    description: 'A씨는 스마트폰 하나로 집안의 조명, 온도, 가스를 모두 제어합니다. 퇴근 길에 미리 보일러를 켜두어 따뜻한 집에 도착합니다.',
    pros: ["전기세가 많이 나온다.", "원격 제어로 생활 편의성과 시간 절약", "집안 인테리어가 예뻐진다."],
    cons: ["해킹 시 집안의 모든 제어권 탈취 가능", "스마트폰 배터리 소모 증가", "기기 가격이 저렴함"],
    correctProIndex: 1,
    correctConIndex: 0
  },
  {
    id: 'case_security',
    title: '지능형 CCTV 보안',
    image: 'https://picsum.photos/400/250?random=2',
    description: '집안에 설치된 카메라가 움직임을 감지하여 앱으로 알림을 보냅니다. 반려동물이 잘 있는지 언제든 볼 수 있습니다.',
    pros: ["반려동물과 대화 가능", "실시간 모니터링으로 안심 및 범죄 예방", "영화 감상 가능"],
    cons: ["사생활 영상이 외부로 유출될 치명적 위험", "카메라 렌즈 수명 단축", "인터넷 속도 저하"],
    correctProIndex: 1,
    correctConIndex: 0
  },
  {
    id: 'case_mobility',
    title: '공유 전동 킥보드',
    image: 'https://picsum.photos/400/250?random=3',
    description: '앱으로 주변 킥보드를 찾아 QR코드로 잠금을 해제하고 목적지까지 이동한 후 반납합니다.',
    pros: ["운동 효과가 없다.", "원하는 곳에서 타고 내리는 이동의 유연성", "버스를 무료로 이용 가능"],
    cons: ["킥보드 고장 시 수리비 청구", "이동 경로 및 위치 데이터의 지속적 수집", "헬멧 착용 불편"],
    correctProIndex: 1,
    correctConIndex: 1
  }
];

export const THINKING_PROBLEMS: ThinkingProblem[] = [
  {
    id: 'cond_change',
    type: 'condition',
    title: '조건 바꾸기: 데이터 저장 금지',
    prompt: "만약 IoT 기기가 데이터를 클라우드 서버에 '저장'하지 못하고, 실시간으로만 처리해야 한다면 어떤 편리한 기능을 포기해야 할까요? 그리고 그 대신 얻는 안전함은 무엇일까요?",
    placeholder: "예: AI 스피커가 내 목소리 패턴을 기억하지 못해서 매번 설정을 다시 해야 할 것 같다. 하지만 대화 내용이 유출될 걱정은 사라진다."
  },
  {
    id: 'counter_ex',
    type: 'counter_example',
    title: '반례 찾기: 불편해진 스마트홈',
    prompt: "IoT 기술은 편리함을 목표로 하지만, 오히려 '내 삶의 질'을 낮추거나 더 귀찮게 만드는 상황은 없을까요? 구체적인 시나리오를 상상해 보세요.",
    placeholder: "예: 스마트 도어락 배터리가 방전되었는데 비밀번호도 기억나지 않아 추운 겨울에 밖에서 1시간을 떨었다. 아날로그 열쇠가 그리웠다."
  },
  {
    id: 'design',
    type: 'design',
    title: '적용 설계: 우리 집 프라이버시 규칙',
    prompt: "우리 집에 다양한 IoT 기기를 들여놓기로 결정했습니다. 가족(또는 룸메이트)의 프라이버시를 지키기 위해 꼭 지켜야 할 '3가지 규칙'을 정해보세요.",
    placeholder: "1. 실내 카메라는 거실에만 설치하고 침실에는 두지 않는다.\n2. ...\n3. ..."
  }
];