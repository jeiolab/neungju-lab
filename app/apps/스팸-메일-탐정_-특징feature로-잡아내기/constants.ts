import { QuizQuestion, QuizType } from './types';

export const STORAGE_KEY_PREFIX = 'spam_detect_v1_';

export const BADGES = {
  FEATURE_MASTER: "특징 선택 고수",
  CONCEPT_MASTER: "오개념 퇴치",
  NEWBIE_DETECTIVE: "신입 탐정"
};

export const THEORY_CARDS = [
  {
    title: "1. 스팸 메일 탐정의 임무",
    content: "우리 반 게시판에 광고글이 너무 많아요! 선생님이 일일이 지우기 힘들대요. 우리가 '스팸'과 '공지'를 자동으로 나누는 도구를 만들어봅시다.",
    icon: "Mail"
  },
  {
    title: "2. 전통적 프로그래밍 vs 기계학습",
    content: "전통적 방법: '광고'라는 단어가 있으면 지워! (규칙을 사람이 직접 만듦)\n기계학습: 수백 통의 메일을 보고 스스로 규칙을 찾아냄 (데이터에서 배움)",
    icon: "BrainCircuit"
  },
  {
    title: "3. 레이블 (Label)",
    content: "이 메일이 '스팸'인지 '정상'인지 알려주는 정답 꼬리표입니다. 지도학습(Supervised Learning)에서는 정답지가 꼭 필요해요.",
    icon: "Tag"
  },
  {
    title: "4. 특징 (Feature)",
    content: "판단의 근거가 되는 속성입니다. 예: '제목에 !!!가 있는가?', '링크가 3개 이상인가?', '보낸 사람이 교장선생님인가?'",
    icon: "Fingerprint"
  },
  {
    title: "5. 특징을 잘 골라야 해요",
    content: "'글자 수'는 스팸 판단에 도움이 될까요? 긴 공지사항도 있고, 긴 스팸도 있죠. 구분력이 좋은 특징을 찾는 것이 핵심입니다!",
    icon: "Filter"
  },
  {
    title: "6. 데이터의 중요성",
    content: "메일 5통만 보고 규칙을 만들면 틀리기 쉬워요. 데이터가 많을수록 다양한 경우의 수를 배워 더 똑똑해집니다.",
    icon: "Database"
  },
  {
    title: "7. 학습과 평가",
    content: "데이터로 규칙을 만든 뒤(학습), 새로운 메일이 왔을 때 잘 맞추는지 시험(평가) 봅니다. 점수가 높으면 실전 투입!",
    icon: "Award"
  },
  {
    title: "8. 지도학습 정리",
    content: "입력(특징)과 정답(레이블)이 있는 데이터를 컴퓨터에게 주면, 컴퓨터가 그 사이의 관계(함수)를 학습합니다.",
    icon: "CheckCircle"
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  // Easy (4)
  {
    id: 1,
    difficulty: 'easy',
    type: QuizType.OX,
    question: "기계학습의 지도학습에는 '정답(레이블)'이 필요 없다.",
    correctAnswer: "X",
    explanation: "지도학습(Supervised Learning)은 문제와 정답(레이블)을 모두 주고 학습시키는 방법입니다."
  },
  {
    id: 2,
    difficulty: 'easy',
    type: QuizType.MULTIPLE_CHOICE,
    question: "다음 중 스팸 메일을 분류할 때 적절한 '특징(Feature)'이 아닌 것은?",
    options: ["메일에 포함된 링크 수", "작성자의 넥타이 색깔", "제목에 포함된 '무료' 단어", "느낌표의 개수"],
    correctAnswer: "작성자의 넥타이 색깔",
    explanation: "작성자의 넥타이 색깔은 이메일 데이터에서 알 수 없으며, 스팸 여부와 관련이 없습니다."
  },
  {
    id: 3,
    difficulty: 'easy',
    type: QuizType.OX,
    question: "학습 데이터가 많을수록 일반적으로 모델의 성능은 좋아진다.",
    correctAnswer: "O",
    explanation: "데이터가 많으면 다양한 패턴을 학습할 수 있어 일반화 성능이 좋아집니다."
  },
  {
    id: 4,
    difficulty: 'easy',
    type: QuizType.MULTIPLE_CHOICE,
    question: "이 시뮬레이션에서 우리가 예측하려는 결과값(레이블)은 무엇인가요?",
    options: ["메일의 길이", "스팸인지 정상인지 여부", "보낸 사람의 이름", "메일 전송 시간"],
    correctAnswer: "스팸인지 정상인지 여부",
    explanation: "우리의 목표(Target)는 메일이 스팸(1)인지 정상(0)인지 분류하는 것입니다."
  },
  // Medium (4)
  {
    id: 5,
    difficulty: 'medium',
    type: QuizType.SHORT_ANSWER,
    question: "데이터의 속성 중 컴퓨터가 학습의 재료로 사용하는 정보를 두 글자로 무엇이라 하나요?",
    correctAnswer: "특징",
    explanation: "영어로는 Feature, 우리말로는 특징(또는 속성)이라고 합니다."
  },
  {
    id: 6,
    difficulty: 'medium',
    type: QuizType.SHORT_ANSWER,
    question: "데이터에 붙어 있는 '정답' 꼬리표를 세 글자로 무엇이라 하나요?",
    correctAnswer: "레이블",
    explanation: "Label, 즉 레이블(또는 라벨)은 지도학습에서 모델이 맞춰야 할 정답입니다."
  },
  {
    id: 7,
    difficulty: 'medium',
    type: QuizType.OX,
    question: "전통적 프로그래밍은 컴퓨터가 데이터에서 스스로 규칙을 찾아낸다.",
    correctAnswer: "X",
    explanation: "스스로 규칙을 찾는 것은 '기계학습'입니다. 전통적 프로그래밍은 사람이 규칙을 짜서 입력합니다."
  },
  {
    id: 8,
    difficulty: 'medium',
    type: QuizType.MULTIPLE_CHOICE,
    question: "다음 중 지도학습의 예시가 아닌 것은?",
    options: ["개와 고양이 사진 분류", "집 크기에 따른 집값 예측", "스팸 메일 필터링", "정답 없이 비슷한 뉴스끼리 묶기(군집화)"],
    correctAnswer: "정답 없이 비슷한 뉴스끼리 묶기(군집화)",
    explanation: "정답 없이 데이터의 특성만으로 그룹을 짓는 것은 비지도학습(Unsupervised Learning)입니다."
  },
  // Hard (2)
  {
    id: 9,
    difficulty: 'hard',
    type: QuizType.ESSAY,
    question: "규칙 기반(전통적) 방식의 스팸 필터가 새로운 신종 스팸(예: '무료' 대신 'Free' 사용)에 취약한 이유는?",
    correctAnswer: "사람이 일일이 규칙을 추가해야 하기 때문",
    explanation: "규칙 기반은 입력된 규칙만 처리하므로, 패턴이 바뀌면 사람이 코드를 수정해야 합니다."
  },
  {
    id: 10,
    difficulty: 'hard',
    type: QuizType.ESSAY,
    question: "정상 메일인데도 스팸으로 분류되는 경우를 무엇이라고 할까요? (힌트: 거짓 양성)",
    correctAnswer: "오탐",
    explanation: "False Positive(오탐)라고 하며, 중요한 메일을 놓치게 만들 수 있어 주의해야 합니다."
  }
];
