import { Badge, QuizQuestion, Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "시선 추적(Eye Tracking) 도입",
    description: "개발팀에서 수업 중 학생들의 집중도를 분석하기 위해 눈동자 움직임을 녹화하자고 제안했습니다. 맞춤형 학습에 획기적일 수 있지만, 민감한 생체 데이터를 수집해야 합니다.",
    options: [
      {
        label: "전면 수집 허용",
        utilityImpact: 25,
        ethicsImpact: -20,
        feedback: "유용성은 크게 증가했지만, 생체 감시에 대한 우려로 프라이버시 점수가 하락했습니다."
      },
      {
        label: "요청 거부",
        utilityImpact: -10,
        ethicsImpact: 15,
        feedback: "프라이버시는 완벽히 보호했지만, 집중도를 측정할 핵심 기능을 잃었습니다."
      },
      {
        label: "비식별화된 히트맵만 수집",
        utilityImpact: 15,
        ethicsImpact: 10,
        feedback: "균형 잡힌 접근입니다. 개인 식별 정보는 버리고, 반 전체의 패턴 데이터만 남겼습니다."
      }
    ]
  },
  {
    id: 2,
    title: "지문 인식 출석 시스템",
    description: "학교 행정실에서 출석 부르는 시간을 줄이기 위해 교실 문앞에 지문 인식기를 설치하자고 합니다.",
    options: [
      {
        label: "지문 인식 승인",
        utilityImpact: 20,
        ethicsImpact: -25,
        feedback: "매우 효율적이지만, 미성년자의 지문 정보를 수집하는 것은 보안상 큰 위험입니다."
      },
      {
        label: "NFC 카드 태그 사용",
        utilityImpact: 10,
        ethicsImpact: 5,
        feedback: "좋은 타협안입니다. 카드는 분실 위험이 있지만, 생체 정보는 저장되지 않습니다."
      },
      {
        label: "전통적인 호명 방식 유지",
        utilityImpact: -15,
        ethicsImpact: 10,
        feedback: "프라이버시 위험은 없지만, 매일 소중한 수업 시간이 낭비됩니다."
      }
    ]
  },
  {
    id: 3,
    title: "안전 귀가를 위한 GPS 추적",
    description: "학부모회에서 학생들의 안전한 등하교를 위해 태블릿의 실시간 위치 추적 기능을 켜달라고 요청했습니다.",
    options: [
      {
        label: "실시간 위치 추적 활성화",
        utilityImpact: 20,
        ethicsImpact: -15,
        feedback: "학부모님들은 안심하지만, 학생들은 감시받는 느낌을 받습니다."
      },
      {
        label: "지오펜싱 (등하교 알림만)",
        utilityImpact: 15,
        ethicsImpact: 5,
        feedback: "효과적입니다. 이동 경로 전체가 아닌, 학교 도착/출발 여부만 확인합니다."
      },
      {
        label: "추적 기능 거부",
        utilityImpact: -10,
        ethicsImpact: 10,
        feedback: "위치 프라이버시는 지켰지만, 안전에 대한 우려는 해소되지 않았습니다."
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "비식별화(De-identification)의 주된 목적은 무엇인가요?",
    options: [
      "모든 데이터를 영구적으로 삭제하기 위해",
      "데이터셋에서 특정 개인을 식별할 수 없도록 만들기 위해",
      "데이터를 암호화하여 아무도 읽지 못하게 하기 위해",
      "저장 용량을 줄이기 위해 압축하기 위해"
    ],
    correctAnswer: 1,
    explanation: "비식별화는 이름이나 주민번호 같은 식별자를 제거하거나 마스킹하여, 개인을 알아볼 수 없게 하면서도 데이터 분석에는 활용할 수 있도록 하는 기술입니다."
  },
  {
    id: 2,
    question: "다음 중 더 엄격한 보호가 필요한 '민감 정보'에 해당하는 것은?",
    options: [
      "가장 좋아하는 색깔",
      "사용 중인 휴대폰 모델명",
      "생체 데이터 (지문/홍채)",
      "학교 급식 메뉴 선호도"
    ],
    correctAnswer: 2,
    explanation: "생체 데이터는 개인 고유의 정보이며 변경할 수 없기 때문에, 유출 시 피해가 매우 크므로 민감 정보로 분류됩니다."
  },
  {
    id: 3,
    question: "'가명처리(Pseudonymization)'란 무엇인가요?",
    options: [
      "이름을 식별할 수 없는 고유 코드(예: User_001)로 대체하는 것",
      "동영상에서 얼굴을 흐릿하게 처리하는 것",
      "데이터 행을 삭제하는 것",
      "데이터를 외부에 공개하는 것"
    ],
    correctAnswer: 0,
    explanation: "가명처리는 개인 식별 정보를 알아볼 수 없는 가명(코드 등)으로 대체하여, 추가 정보 없이는 개인을 식별할 수 없도록 하는 조치입니다."
  },
  {
    id: 4,
    question: "데이터 3법과 관련된 '마이데이터(MyData)'의 핵심 개념은?",
    options: [
      "기업이 데이터를 독점하는 것",
      "정부가 모든 데이터를 관리하는 것",
      "정보 주체(개인)가 자신의 정보를 관리하고 이동시킬 권리를 갖는 것",
      "클라우드 저장 서비스 이름"
    ],
    correctAnswer: 2,
    explanation: "마이데이터는 개인이 자신의 데이터에 대한 통제권을 갖고, 이를 원하는 곳으로 전송하거나 주도적으로 활용하는 것을 의미합니다."
  },
  {
    id: 5,
    question: "데이터 수집에서의 '트레이드오프(Trade-off)'란?",
    options: [
      "데이터를 사고파는 행위",
      "데이터의 유용성(활용도)과 프라이버시 위험 사이의 균형 관계",
      "서버를 클라우드로 교체하는 것",
      "암호화 키를 교환하는 것"
    ],
    correctAnswer: 1,
    explanation: "데이터를 상세하게 수집하면 유용성은 높아지지만 프라이버시 침해 위험도 함께 높아집니다. 이 둘 사이의 균형을 찾는 것이 트레이드오프입니다."
  },
  {
    id: 6,
    question: "나이를 '20~29세'와 같이 범주화하여 프라이버시를 보호하는 기술은?",
    options: [
      "삭제 (Suppression)",
      "총계처리/범주화 (Generalization)",
      "암호화 (Encryption)",
      "토큰화 (Tokenization)"
    ],
    correctAnswer: 1,
    explanation: "범주화(총계처리)는 구체적인 값을 넓은 범주로 묶어 개인의 특성을 숨기는 비식별화 기술입니다."
  },
  {
    id: 7,
    question: "학생이 데이터 수집에 동의했다면, 무엇이든 수집해도 되나요?",
    options: [
      "네, 동의는 절대적입니다.",
      "아니요, 목적 달성에 필요한 '최소한의 데이터'만 수집해야 합니다.",
      "네, 나중에 판매만 안 하면 됩니다.",
      "아니요, 교장 선생님 허락이 필요합니다."
    ],
    correctAnswer: 1,
    explanation: "'데이터 최소 수집 원칙'에 따라, 정보 주체의 동의가 있더라도 서비스 제공에 필수적인 정보만 수집해야 합니다."
  },
  {
    id: 8,
    question: "'재식별(Re-identification)'의 위험성이란?",
    options: [
      "데이터가 손상되는 것",
      "비식별화된 데이터가 다른 정보와 결합되어 다시 특정 개인을 알아보게 되는 것",
      "사용자가 비밀번호를 잊어버리는 것",
      "데이터베이스 용량이 부족해지는 것"
    ],
    correctAnswer: 1,
    explanation: "비식별 조치를 했더라도 외부의 다른 데이터와 결합하면 다시 개인이 식별될 위험이 있습니다."
  },
  {
    id: 9,
    question: "'옵트인(Opt-in)' 방식이란?",
    options: [
      "기본적으로 수집하고 사용자가 거부하면 중단하는 것",
      "수집 전에 사용자에게 명시적으로 동의를 먼저 구하는 것",
      "약관 속에 숨겨서 수집하는 것",
      "몰래 수집하는 것"
    ],
    correctAnswer: 1,
    explanation: "옵트인은 정보 주체가 동의 의사를 밝혀야만 수집을 시작하는 방식으로, 개인정보 보호 측면에서 더 윤리적이고 안전한 방식입니다."
  },
  {
    id: 10,
    question: "빅데이터 프로젝트에서 '투명성'이 중요한 이유는?",
    options: [
      "대시보드가 예뻐 보이기 위해서",
      "사용자에게 어떤 데이터가 왜 수집되는지 알려 신뢰를 쌓기 위해서",
      "경쟁사가 코드를 볼 수 있게 하기 위해서",
      "데이터베이스 속도를 높이기 위해서"
    ],
    correctAnswer: 1,
    explanation: "투명성은 데이터 윤리의 핵심입니다. 사용자가 자신의 데이터가 어떻게 처리되는지 알 수 있어야 기업/기관을 신뢰할 수 있습니다."
  }
];

export const BADGES: Badge[] = [
  {
    id: 'guardian',
    name: '프라이버시 수호자',
    description: '기능보다는 사용자의 권리를 최우선으로 지켰습니다.',
    icon: '🛡️',
    condition: (u, e) => e >= 80
  },
  {
    id: 'innovator',
    name: '무자비한 혁신가',
    description: '최첨단 시스템을 구축했지만, 윤리적 우려가 큽니다.',
    icon: '🚀',
    condition: (u, e) => u >= 80 && e < 50
  },
  {
    id: 'balanced',
    name: '균형의 마스터',
    description: '유용성과 프라이버시 사이에서 완벽한 균형을 찾았습니다.',
    icon: '⚖️',
    condition: (u, e) => u >= 60 && e >= 60
  },
  {
    id: 'trainee',
    name: '초보 관리자',
    description: '아직 배우는 단계입니다. 다시 도전해서 점수를 높여보세요!',
    icon: '🎓',
    condition: (u, e) => u < 60 && e < 60
  }
];

export const DE_IDENTIFICATION_TEXT = "학생 이름: 김철수, 전화번호: 010-1234-5678, 주소: 서울시 강남구 역삼동 123. 진단명: ADHD.";
export const SENSITIVE_WORDS = ["김철수", "010-1234-5678", "서울시 강남구 역삼동 123", "ADHD"];
