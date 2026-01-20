import { QuizQuestion, Task } from './types';

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: '시나리오 초안 작성', phase: 'Planning', dependencies: [] },
  { id: 't2', title: '배우 섭외하기', phase: 'Planning', dependencies: ['t1'] },
  { id: 't3', title: '교실 장면 촬영', phase: 'Production', dependencies: ['t1', 't2'] },
  { id: 't4', title: '운동장 장면 촬영', phase: 'Production', dependencies: ['t1', 't2'] },
  { id: 't5', title: '나레이션 녹음', phase: 'Production', dependencies: ['t1'] },
  { id: 't6', title: '영상 컷 편집', phase: 'Post-Production', dependencies: ['t3', 't4', 't5'] },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "왜 큰 프로젝트를 작은 작업으로 분해해야 할까요?",
    options: [
      "프로젝트를 더 복잡하게 보이게 하기 위해서",
      "의존 관계를 파악하고 소요 시간을 더 정확히 예측하기 위해서",
      "선생님이 시켜서",
      "프로젝트 시작을 미루기 위해서"
    ],
    correctIndex: 1,
    explanation: "문제 분해(Decomposition)는 숨겨진 복잡성을 발견하고, 더 나은 예측을 가능하게 하며, 작업을 동시에 진행할 수 있게 해줍니다.",
    difficulty: 'Easy'
  },
  {
    id: 2,
    question: "의존 관계 그래프에서 '작업 B'가 '작업 A'를 가리키고 있다면(B → A), 보통 어떤 의미인가요?",
    options: [
      "작업 B가 끝나야 작업 A를 시작할 수 있다.",
      "작업 A가 끝나야 작업 B를 시작할 수 있다.",
      "작업 A와 B는 동시에 일어나야 한다.",
      "작업 B가 작업 A보다 중요하다."
    ],
    correctIndex: 1,
    explanation: "일반적으로 의존 관계 화살표는 선행 작업에서 후행 작업으로 흐릅니다. (또는 'B가 A를 필요로 한다'는 표기법도 있지만, 여기서는 A가 선행조건임을 의미합니다.)",
    difficulty: 'Medium'
  },
  {
    id: 3,
    question: "다음 중 '나쁜' 분해의 예시는 무엇인가요?",
    options: [
      "'촬영'을 '장비 세팅', '녹화', '정리'로 나누기",
      "'편집'을 '컷 편집', '음향 삽입', '자막 작업'으로 나누기",
      "'프로젝트'를 '월요일에 다 하기'로 나누기",
      "'대본'을 '아이디어 회의', '초안 작성', '검토'로 나누기"
    ],
    correctIndex: 2,
    explanation: "'월요일에 다 하기'는 작업을 분해한 것이 아니라 일정표에 적어넣은 것에 불과합니다. 작업 자체를 쪼개야 합니다.",
    difficulty: 'Easy'
  },
  {
    id: 4,
    question: "의존 관계 그래프에 '순환(Cycle)'이 생기면(A→B→C→A) 어떤 일이 벌어지나요?",
    options: [
      "프로젝트가 더 빨리 끝난다.",
      "논리적으로 프로젝트를 완료할 수 없게 된다.",
      "작업을 두 번 검토할 수 있어 좋다.",
      "팀원들의 업무량이 균형 잡힌다."
    ],
    correctIndex: 1,
    explanation: "순환 의존성이 생기면 서로가 서로를 기다리는 상태(Deadlock)가 되어 어떤 작업도 시작할 수 없습니다.",
    difficulty: 'Hard'
  },
  {
    id: 5,
    question: "촬영 담당이 2명 있습니다. '교실 촬영'과 '운동장 촬영' 사이에 서로 의존 관계가 없다면 어떤 이점이 있나요?",
    options: [
      "아무런 도움이 되지 않는다.",
      "동시에 진행(병렬 처리)하여 시간을 절약할 수 있다.",
      "그래도 순서대로 진행해야 한다.",
      "편집이 더 어려워진다."
    ],
    correctIndex: 1,
    explanation: "서로 의존하지 않는 작업들은 자원(사람, 장비)이 충분하다면 병렬로 동시에 실행하여 전체 소요 시간을 줄일 수 있습니다.",
    difficulty: 'Medium'
  }
];

export const RISKS = [
  "촬영 당일 비가 옴",
  "마이크 배터리 방전",
  "배우가 대사를 까먹음",
  "편집 프로그램 오류로 종료됨",
  "촬영 장소 사용 허가를 못 받음"
];