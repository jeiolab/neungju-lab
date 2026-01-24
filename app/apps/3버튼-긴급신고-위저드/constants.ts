import { QuizQuestion } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000];

export const BADGES = {
  TESTER: "전문 테스터", // 3 valid test cases
  ARCHITECT: "시스템 설계자", // Completed first spec
  SAFETY: "안전 제일", // Included safety protocols
  MASTER: "IoT 마스터" // Quiz mastery
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "음성 통화 대신 '무음' 버튼 신고 시스템을 사용하는 이유는 무엇인가요?",
    options: [
      "만들기 더 저렴해서",
      "음성 통화는 항상 느리기 때문에",
      "부상이나 위협으로 인해 말을 할 수 없는 사용자를 위해",
      "버튼이 더 멋져 보여서"
    ],
    correctAnswer: 2,
    explanation: "무음 신고 시스템은 피해자가 부상을 입었거나, 기도가 막혔거나, 소리를 내면 위치가 발각되는 위험한 상황에서 매우 중요합니다."
  },
  {
    id: 2,
    question: "이 설계에서 '버튼 A'를 누르면 어떤 일이 발생하나요?",
    options: [
      "경찰 (그룹 30)",
      "구급차 (그룹 10)",
      "소방서 (그룹 20)",
      "아무 일도 일어나지 않음"
    ],
    correctAnswer: 1,
    explanation: "고정된 시나리오에 따르면, 버튼 A는 라디오 그룹 10을 통해 구급차(의료) 요청을 보냅니다."
  },
  {
    id: 3,
    question: "왜 서로 다른 '라디오 그룹'(10, 20, 30)을 사용하나요?",
    options: [
      "코드를 길게 만들기 위해",
      "긴급 상황 유형별로 통신 채널을 분리하기 위해",
      "배터리를 절약하기 위해",
      "인터넷 제공업체의 요구사항이라서"
    ],
    correctAnswer: 1,
    explanation: "라디오 그룹은 별도의 채널 역할을 합니다. 그룹 10은 의료, 20은 화재, 30은 경찰로 구분하여 올바른 부서가 신호를 받도록 합니다."
  },
  {
    id: 4,
    question: "이 문맥에서 '알고리즘'이란 무엇인가요?",
    options: [
      "물리적인 버튼",
      "배터리 전원",
      "어떤 신호를 보낼지 결정하는 논리적인 규칙의 집합",
      "사용자의 위치"
    ],
    correctAnswer: 2,
    explanation: "알고리즘은 '만약 A가 눌리면, 10번 신호를 보낸다'와 같이 입력과 처리를 거쳐 출력을 결정하는 논리 구조입니다."
  },
  {
    id: 5,
    question: "이 프로토타입에서는 실제 GPS 대신 위치를 어떻게 처리하나요?",
    options: [
      "추측한다",
      "가상 위치값(랜덤 또는 수동 코드)을 사용한다",
      "위성에 연결한다",
      "위치를 무시한다"
    ],
    correctAnswer: 1,
    explanation: "교육용 프로토타입에서의 개인정보 보호와 기술적 단순함을 위해 실제 GPS 좌표 대신 '가상 위치값(Zone ID)'을 사용합니다."
  },
  {
    id: 6,
    question: "사용자가 A와 B 버튼을 동시에 누르면 어떻게 되나요?",
    options: [
      "장치가 폭발한다",
      "신호가 취소된다",
      "경찰 긴급 신고(그룹 30)를 보낸다",
      "화재와 구급차 신호를 각각 보낸다"
    ],
    correctAnswer: 2,
    explanation: "설계상 A+B 동시 입력은 경찰(그룹 30)을 호출하는 특수 트리거로 정의되어 있습니다."
  },
  {
    id: 7,
    question: "다음 중 좋은 '테스트 케이스'는 무엇인가요?",
    options: [
      "버튼 A 누르기",
      "버튼 A를 누르고, 위치 정보와 함께 그룹 10 신호가 전송되는지 확인하기",
      "장치 쳐다보기",
      "장치를 바닥에 떨어뜨리기"
    ],
    correctAnswer: 1,
    explanation: "좋은 테스트 케이스는 구체적인 '행동(Action)'과 그에 따른 '예상 결과(Expected Result)'를 모두 포함해야 합니다."
  },
  {
    id: 8,
    question: "이 IoT 시스템에서 '입력(Input)' 장치는 무엇인가요?",
    options: [
      "LED 화면",
      "무선 신호",
      "물리적 버튼 (A, B)",
      "경찰차"
    ],
    correctAnswer: 2,
    explanation: "버튼은 사용자가 시스템을 작동시키기 위해 상호작용하는 센서이자 입력 장치 역할을 합니다."
  },
  {
    id: 9,
    question: "자동 신고 시스템의 잠재적인 위험 요소는 무엇인가요?",
    options: [
      "너무 빠르다",
      "오작동 및 허위 신고 (실수로 버튼 누름)",
      "인터넷을 너무 많이 사용한다",
      "너무 조용하다"
    ],
    correctAnswer: 1,
    explanation: "실수로 버튼이 눌려 발생하는 허위 신고(오작동)는 큰 문제입니다. 이를 방지하기 위해 '길게 누르기'나 '동시 누르기' 같은 안전장치가 필요합니다."
  },
  {
    id: 10,
    question: "'설계 문서(Documentation)'가 중요한 이유는 무엇인가요?",
    options: [
      "프로젝트를 거창하게 보이게 하려고",
      "개발자와 사용자가 시스템 작동 방식을 명확히 이해하도록 하기 위해",
      "종이를 낭비하기 위해",
      "개발 속도를 늦추기 위해"
    ],
    correctAnswer: 1,
    explanation: "문서화는 시스템을 만들기 전에 요구사항, 로직, 한계점을 모든 참여자가 명확히 이해하도록 돕습니다."
  }
];
