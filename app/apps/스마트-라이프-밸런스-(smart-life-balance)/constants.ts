import { CaseStudy, QuizQuestion, Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "AI CCTV 설치",
    description: "범죄 예방을 위해 우리 동네 모든 골목에 안면 인식 기능이 탑재된 지능형 CCTV를 설치할까요?",
    choiceA: {
      text: "설치한다 (범죄 예방 중요)",
      convenienceChange: 20,
      privacyChange: -15
    },
    choiceB: {
      text: "반대한다 (감시 사회 우려)",
      convenienceChange: -10,
      privacyChange: 15
    }
  },
  {
    id: 2,
    title: "맞춤형 광고 동의",
    description: "쇼핑 앱에서 당신의 검색 기록과 위치 정보를 수집하여 딱 맞는 상품을 추천해주겠다고 합니다.",
    choiceA: {
      text: "동의함 (편리한 쇼핑)",
      convenienceChange: 15,
      privacyChange: -10
    },
    choiceB: {
      text: "거절함 (정보 유출 싫음)",
      convenienceChange: -15,
      privacyChange: 10
    }
  },
  {
    id: 3,
    title: "공공장소 무료 와이파이",
    description: "로그인 없이 바로 쓸 수 있는 개방형 공공 와이파이를 사용하시겠습니까? (보안 취약 가능성 있음)",
    choiceA: {
      text: "사용한다 (데이터 절약)",
      convenienceChange: 20,
      privacyChange: -20
    },
    choiceB: {
      text: "사용 안 함 (LTE/5G 사용)",
      convenienceChange: -5,
      privacyChange: 10
    }
  },
  {
    id: 4,
    title: "생체 인식 결제",
    description: "지갑 없이 얼굴만 보여주면 결제되는 '페이스 페이'를 도입할까요?",
    choiceA: {
      text: "도입 찬성 (결제 1초컷)",
      convenienceChange: 25,
      privacyChange: -20
    },
    choiceB: {
      text: "도입 반대 (생체정보 해킹 우려)",
      convenienceChange: -10,
      privacyChange: 20
    }
  },
  {
    id: 5,
    title: "위치 추적 앱",
    description: "친구끼리 서로의 위치를 실시간으로 공유하는 앱이 유행입니다. 가입하시겠습니까?",
    choiceA: {
      text: "가입한다 (만날 때 편함)",
      convenienceChange: 15,
      privacyChange: -15
    },
    choiceB: {
      text: "가입 안 함 (사생활 침해)",
      convenienceChange: -5,
      privacyChange: 15
    }
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    title: "안면인식 CCTV",
    icon: "🎥",
    summary: "AI가 사람의 얼굴을 인식하여 신원을 파악하고 동선을 추적하는 기술",
    pros: ["범죄자 신속 검거", "실종 아동/치매 노인 찾기 용이", "무인 매장 등 서비스 자동화"],
    cons: ["모든 시민의 일상 감시 (빅브라더)", "오인식으로 인한 무고한 피해자 발생", "해킹 시 심각한 생체 정보 유출"]
  },
  {
    id: 2,
    title: "알고리즘 추천",
    icon: "📱",
    summary: "사용자의 과거 행동 데이터를 분석하여 좋아할 만한 콘텐츠나 상품을 보여주는 기술",
    pros: ["정보 탐색 시간 단축", "새로운 취향 발견", "개인화된 편리한 경험"],
    cons: ["필터 버블 (편향된 정보만 습득)", "과도한 상업적 유도", "민감한 개인 성향(정치, 종교 등) 추론 및 악용"]
  },
  {
    id: 3,
    title: "스마트 홈/IoT",
    icon: "🏠",
    summary: "집안의 가전제품이 인터넷에 연결되어 원격 제어 및 자동화되는 시스템",
    pros: ["가사 노동 감소", "에너지 효율적 관리", "응급 상황 자동 신고"],
    cons: ["집안 내부 영상/음성 해킹 위험", "기기 오작동 시 안전 사고", "사생활 데이터의 기업 전송"]
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '디지털 발자국'에 대한 설명으로 옳은 것은?",
    options: [
      "걸어다닐 때 생기는 실제 발자국이다.",
      "인터넷 사용 기록, 위치 정보 등 온라인에 남는 흔적이다.",
      "디지털 기기를 구매한 영수증이다.",
      "삭제하면 영원히 복구할 수 없다."
    ],
    correctIndex: 1,
    explanation: "디지털 발자국은 우리가 온라인 활동을 하며 남기는 로그인 기록, 검색어, 업로드한 사진 등의 흔적을 말합니다."
  },
  {
    id: 2,
    question: "저작권법상 올바른 행동은?",
    options: [
      "좋아하는 연예인 사진을 허락 없이 굿즈로 만들어 팔았다.",
      "유료 영화 파일을 친구들에게 공유했다.",
      "학교 과제를 위해 뉴스 기사 일부를 출처를 밝히고 인용했다.",
      "인터넷에서 찾은 이미지를 내 블로그 로고로 무단 사용했다."
    ],
    correctIndex: 2,
    explanation: "비영리적 교육/연구 목적의 정당한 범위 내 인용은 출처를 명시할 경우 허용됩니다."
  },
  {
    id: 3,
    question: "사이버 폭력을 당했을 때 가장 적절한 대처법은?",
    options: [
      "똑같이 욕설로 대응한다.",
      "무조건 참는다.",
      "증거 화면을 캡처하고, 부모님이나 선생님, 경찰(117)에 알린다.",
      "계정을 삭제하고 잠적한다."
    ],
    correctIndex: 2,
    explanation: "감정적으로 대응하지 말고 증거를 확보한 뒤, 신뢰할 수 있는 어른이나 전문 기관에 도움을 요청해야 합니다."
  }
];