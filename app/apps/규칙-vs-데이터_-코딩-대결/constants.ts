import { EmailData, QuizQuestion } from './types';

export const THEORY_CONTENT = {
  traditional: {
    title: "전통적 프로그래밍 (Explicit Programming)",
    desc: "사람이 규칙을 직접 정의합니다.",
    process: ["입력(Data)", "규칙(Rules)", "정답(Result)"],
    icon: "ScrollText",
    color: "blue"
  },
  ml: {
    title: "기계학습 (Machine Learning)",
    desc: "기계가 데이터에서 규칙을 스스로 찾습니다.",
    process: ["입력(Data)", "정답(Result)", "규칙(Rules)"],
    icon: "BrainCircuit",
    color: "purple"
  }
};

export const MOCK_EMAILS: EmailData[] = [
  { id: 1, subject: "안녕하세요, 과제 제출합니다.", body: "첨부파일 확인 부탁드립니다.", isSpam: false },
  { id: 2, subject: "긴급! 50% 할인 쿠폰", body: "지금 구매하지 않으면 기회는 없습니다. 클릭하세요!", isSpam: true },
  { id: 3, subject: "회의 일정 변경 안내", body: "내일 오후 2시 회의가 3시로 변경되었습니다.", isSpam: false },
  { id: 4, subject: "당첨을 축하합니다!", body: "현금 100만원 수령을 위해 계좌를 입력하세요.", isSpam: true },
  { id: 5, subject: "광고 제안 드립니다", body: "귀사의 블로그에 광고를 게시하고 싶습니다.", isSpam: true },
  { id: 6, subject: "주말 가족 모임", body: "이번 주 토요일 저녁 식사 어때?", isSpam: false },
  { id: 7, subject: "최저가 보장, 무료 배송", body: "오늘만 특가 상품을 만나보세요.", isSpam: true },
  { id: 8, subject: "프로젝트 진행 상황 보고", body: "현재 진행률 80%입니다.", isSpam: false },
  { id: 9, subject: "VIP 고객님만을 위한 혜택", body: "지금 바로 접속해서 혜택을 누리세요.", isSpam: true },
  { id: 10, subject: "다음 주 수업 자료", body: "미리 읽어오시기 바랍니다.", isSpam: false },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "전통적 프로그래밍과 기계학습의 가장 큰 차이점은 무엇인가요?",
    options: ["컴퓨터 사용 여부", "규칙을 누가 만드는가", "전기 소모량", "프로그래밍 언어의 종류"],
    correctAnswer: 1,
    explanation: "전통적 방식은 사람이 규칙을 입력하지만, 기계학습은 데이터로부터 기계가 규칙을 생성합니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "다음 중 기계학습이 더 적합한 상황은?",
    options: ["세금 계산 (정해진 세율)", "비밀번호 일치 여부 확인", "사진에서 고양이 찾기", "자판기 거스름돈 계산"],
    correctAnswer: 2,
    explanation: "사진 속 고양이의 특징은 규칙으로 정의하기 어렵고 복잡하여, 데이터 학습이 훨씬 효율적입니다.",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "톰 미첼(Tom Mitchell)의 기계학습 정의에서 'E'가 의미하는 것은?",
    options: ["Energy (에너지)", "Experience (경험/데이터)", "Error (오류)", "Efficiency (효율)"],
    correctAnswer: 1,
    explanation: "E는 Experience, 즉 과거의 데이터나 경험을 의미합니다.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "스팸 필터를 만들 때 '광고'라는 단어가 있으면 스팸으로 분류하는 방식은?",
    options: ["기계학습", "딥러닝", "전통적 프로그래밍(규칙 기반)", "강화학습"],
    correctAnswer: 2,
    explanation: "특정 단어 유무라는 명확한 규칙을 사람이 정했으므로 전통적 방식입니다.",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "기계학습 모델의 성능(P)을 높이기 위해 가장 필요한 것은?",
    options: ["더 비싼 컴퓨터", "더 복잡한 규칙 작성", "질 좋은 데이터(E)의 확보", "전기 공급 차단"],
    correctAnswer: 2,
    explanation: "기계학습의 성능은 학습 데이터(Experience)의 양과 질에 크게 의존합니다.",
    difficulty: 'medium'
  },
  {
    id: 6,
    question: "기계학습은 규칙이 전혀 필요 없다. (O/X)",
    options: ["O", "X"],
    correctAnswer: 1,
    explanation: "기계학습은 사람이 규칙을 '직접 입력'하지 않을 뿐, 내부적으로 데이터에 기반한 수학적 규칙(모델)을 생성합니다.",
    difficulty: 'medium'
  },
  {
    id: 7,
    question: "알파고가 바둑을 두는 방식은 주로 무엇에 해당하나요?",
    options: ["단순 규칙 입력", "기계학습 (강화학습 및 딥러닝)", "데이터베이스 조회", "랜덤 찍기"],
    correctAnswer: 1,
    explanation: "알파고는 수많은 기보 데이터와 자체 대국을 통해 승리 확률이 높은 규칙을 스스로 학습했습니다.",
    difficulty: 'easy'
  },
  {
    id: 8,
    question: "다음 상황 중 '전통적 프로그래밍'이 더 효율적인 경우는?",
    options: ["손글씨 숫자 인식", "사용자 맞춤형 영화 추천", "1년이 365일인지 윤년인지 계산", "자율 주행 자동차"],
    correctAnswer: 2,
    explanation: "윤년 계산은 수학적 공식이 명확하므로 전통적 프로그래밍이 정확하고 효율적입니다.",
    difficulty: 'hard'
  },
  {
    id: 9,
    question: "기계학습 과정의 올바른 순서는?",
    options: ["규칙 입력 -> 결과 도출", "데이터 입력 -> 학습 -> 규칙 생성", "결과 입력 -> 데이터 생성", "규칙 학습 -> 데이터 입력"],
    correctAnswer: 1,
    explanation: "기계학습은 데이터(입력+정답)를 통해 모델을 학습시키고 그 결과로 규칙(모델)이 생성됩니다.",
    difficulty: 'hard'
  },
  {
    id: 10,
    question: "AI 판사가 기존 판결문 10만 건을 학습하여 판결을 내린다면, 이는 어떤 방식인가요?",
    options: ["전통적 방식", "기계학습 방식"],
    correctAnswer: 1,
    explanation: "데이터(판결문)를 통해 판결 패턴을 찾았으므로 기계학습 방식입니다.",
    difficulty: 'medium'
  }
];
