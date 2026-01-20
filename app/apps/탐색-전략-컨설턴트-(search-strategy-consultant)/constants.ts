import { Scenario, QuizQuestion, Badge } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'library',
    title: '도서관 책 검색',
    description: '전체 도서 목록에서 특정 도서를 찾습니다.',
    defaultDataSize: 90,
    defaultIsSorted: true, // 도서관은 보통 청구기호순 정렬
    defaultUpdateFreq: 10, // 신간은 가끔 들어옴
    defaultSearchFreq: 95, // 검색은 매우 자주 일어남
    context: '도서관 데이터는 방대하며 이미 정렬되어 있는 경우가 많습니다. 검색 빈도가 매우 높습니다.'
  },
  {
    id: 'contacts',
    title: '반 친구 연락처 찾기',
    description: '우리 반 친구 이름으로 전화번호를 찾습니다.',
    defaultDataSize: 20, // 반 인원은 적음
    defaultIsSorted: false, // 보통 가나다순 정렬 전일 수 있음
    defaultUpdateFreq: 5, // 전학은 거의 없음
    defaultSearchFreq: 40, // 가끔 찾음
    context: '데이터 크기가 작아서 복잡한 알고리즘의 이득이 적을 수 있습니다.'
  },
  {
    id: 'grades',
    title: '수행평가 점수 확인',
    description: '특정 점수를 받은 학생이 있는지 확인합니다.',
    defaultDataSize: 60,
    defaultIsSorted: false, // 점수순 정렬 안되어 있음 (이름순일 확률 높음)
    defaultUpdateFreq: 80, // 채점 중이라 점수가 계속 바뀜
    defaultSearchFreq: 20, // 확인은 가끔 함
    context: '데이터가 수시로 변경(업데이트)되는 상황입니다. 정렬을 유지하는 비용이 큽니다.'
  }
];

export const INITIAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "데이터의 개수(N)가 적을 때, 가장 효율적인 선택은?",
    options: ["항상 이진 탐색", "순차 탐색", "퀵 정렬 후 탐색", "해시 테이블"],
    correctAnswer: 1,
    explanation: "데이터가 적을 때는 단순한 순차 탐색이 구현도 쉽고 오버헤드가 적어 유리합니다.",
    type: 'multiple'
  },
  {
    id: 2,
    question: "이진 탐색(Binary Search)을 사용하기 위한 필수 전제 조건은?",
    options: ["데이터가 많아야 한다", "데이터가 정렬되어 있어야 한다", "데이터가 숫자여야 한다", "메모리가 커야 한다"],
    correctAnswer: 1,
    explanation: "이진 탐색은 데이터가 정렬되어 있을 때만 사용할 수 있습니다.",
    type: 'multiple'
  },
  {
    id: 3,
    question: "데이터가 수시로 추가/삭제(업데이트)되는 상황에서 '정렬 후 이진 탐색'의 단점은?",
    options: ["검색 속도가 느려진다", "유지(Maintenance) 비용이 매우 높다", "준비 비용이 없다", "정확도가 떨어진다"],
    correctAnswer: 1,
    explanation: "데이터가 바뀔 때마다 다시 정렬하거나 정렬 상태를 유지해야 하므로 유지 비용이 높습니다.",
    type: 'multiple'
  },
  {
    id: 4,
    question: "도서관의 책처럼 한 번 정리되면 거의 위치가 바뀌지 않고 검색만 수천 번 일어나는 경우 유리한 것은?",
    options: ["순차 탐색", "이진 탐색", "무작위 탐색", "탐색 안 함"],
    correctAnswer: 1,
    explanation: "검색 빈도가 압도적으로 높고 데이터 변경이 적다면 정렬된 상태를 이용한 이진 탐색이 훨씬 빠릅니다.",
    type: 'multiple'
  },
  {
    id: 5,
    question: "반 친구 30명의 명부에서 내 친구를 찾을 때, 굳이 정렬할 필요가 없는 이유는?",
    options: ["컴퓨터가 느려서", "데이터 크기가 작아 탐색 시간 차이가 미미해서", "이진 탐색이 불가능해서", "순차 탐색이 더 멋있어서"],
    correctAnswer: 1,
    explanation: "N이 작을 때는 O(N)과 O(log N)의 실제 시간 차이가 사람이 느끼기 힘들 정도로 미미합니다.",
    type: 'multiple'
  }
];

export const BADGES: Badge[] = [
  { id: 'rookie', name: '초보 컨설턴트', icon: '🎓', description: '첫 번째 시뮬레이션을 완료했습니다.', unlocked: false },
  { id: 'logic_master', name: '논리 마스터', icon: '🧠', description: '퀴즈에서 80점 이상 획득했습니다.', unlocked: false },
  { id: 'cost_saver', name: '비용 절감 전문가', icon: '💰', description: '유지 비용이 낮은 효율적인 선택을 5회 했습니다.', unlocked: false },
  { id: 'speed_demon', name: '스피드 레이서', icon: '⚡', description: '가장 빠른 탐색 방법을 찾았습니다.', unlocked: false }
];
