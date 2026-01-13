import { Song, QuizQuestion } from './types';

export const INITIAL_SONGS: Song[] = [
  { id: '1', title: 'Attention', bpm: 120, duration: 180, preference: 5 },
  { id: '2', title: 'Hype Boy', bpm: 100, duration: 178, preference: 4 },
  { id: '3', title: 'Ditto', bpm: 134, duration: 186, preference: 5 },
  { id: '4', title: 'ETA', bpm: 135, duration: 150, preference: 3 },
  { id: '5', title: 'Super Shy', bpm: 150, duration: 160, preference: 4 },
  { id: '6', title: 'Seven', bpm: 125, duration: 184, preference: 5 },
  { id: '7', title: 'Spicy', bpm: 140, duration: 195, preference: 4 },
  { id: '8', title: 'I AM', bpm: 122, duration: 182, preference: 3 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "삽입 정렬의 핵심 아이디어와 가장 유사한 상황은?",
    options: ["책장에서 책을 전부 꺼내 순서대로 꽂기", "카드 게임에서 카드를 한 장씩 가져와 정렬된 손패에 끼워 넣기", "운동장에서 키 순서대로 두 명씩 비교하며 바꾸기", "중간 값을 기준으로 반으로 나누어 정렬하기"],
    correctIndex: 1,
    explanation: "삽입 정렬은 '이미 정렬된 영역'에 새로운 데이터를 적절한 위치에 '끼워 넣는(Insert)' 방식입니다."
  },
  {
    id: 2,
    question: "삽입 정렬이 가장 효율적으로 작동하는 데이터 상태는?",
    options: ["완전히 무작위로 섞인 상태", "역순으로 정렬된 상태", "거의 정렬되어 있는 상태", "데이터의 크기가 매우 클 때"],
    correctIndex: 2,
    explanation: "이미 거의 정렬된 상태에서는 비교 횟수가 적고 이동이 최소화되어 매우 빠릅니다(O(n))."
  },
  {
    id: 3,
    question: "삽입 정렬의 시간 복잡도(Time Complexity)에 대한 설명으로 옳은 것은?",
    options: ["항상 O(n log n)이다", "최선의 경우 O(n), 최악의 경우 O(n²)이다", "항상 O(n²)이다", "데이터 개수와 상관없이 일정하다"],
    correctIndex: 1,
    explanation: "이미 정렬된 경우 n-1번의 비교만 필요하므로 O(n)이며, 역순인 경우 O(n²)이 소요됩니다."
  },
  {
    id: 4,
    question: "안정 정렬(Stable Sort)이란 무엇을 의미하나요?",
    options: ["정렬 속도가 일정한 것", "메모리를 추가로 사용하지 않는 것", "같은 값을 가진 요소들의 기존 순서가 유지되는 것", "오류가 발생하지 않는 것"],
    correctIndex: 2,
    explanation: "삽입 정렬은 안정 정렬입니다. 값이 같을 때 위치를 서로 바꾸지 않고 뒤에 배치하면 기존 순서가 유지됩니다."
  },
  {
    id: 5,
    question: "데이터가 5개일 때, 최악의 경우 비교 횟수는?",
    options: ["4번", "5번", "10번 (1+2+3+4)", "25번"],
    correctIndex: 2,
    explanation: "최악(역순)의 경우, 2번째 요소는 1번, 3번째는 2번... n번째는 n-1번 비교하므로 1부터 n-1까지의 합입니다."
  },
  {
    id: 6,
    question: "플레이리스트를 BPM 순으로 정리하려고 합니다. 삽입 정렬을 사용할 때 '정렬된 영역'은 처음에 몇 개의 곡으로 시작하나요?",
    options: ["0개", "1개 (첫 번째 곡)", "전체 곡의 절반", "사용자가 선택하는 만큼"],
    correctIndex: 1,
    explanation: "삽입 정렬은 첫 번째 원소는 이미 정렬된 것으로 간주하고, 두 번째 원소부터 비교를 시작합니다."
  },
  {
    id: 7,
    question: "다음 중 삽입 정렬의 단점은?",
    options: ["구현이 매우 어렵다", "작은 데이터셋에서 느리다", "데이터 이동(Shift)이 많아 데이터가 클수록 비효율적이다", "추가 메모리가 많이 필요하다"],
    correctIndex: 2,
    explanation: "배열 기반 구현 시, 삽입할 공간을 만들기 위해 뒤의 요소들을 한 칸씩 밀어야 하는 오버헤드가 큽니다."
  },
  {
    id: 8,
    question: "프로젝트에서 2단계 정렬(선호도 → BPM)을 수행할 때, 안정 정렬이 중요한 이유는?",
    options: ["정렬 속도를 높이기 위해", "선호도가 같을 때 BPM 순서를 망가뜨리지 않기 위해 (혹은 그 반대)", "코드를 짧게 쓰기 위해", "메모리를 아끼기 위해"],
    correctIndex: 1,
    explanation: "안정 정렬이어야 이전 단계(또는 원래 순서)의 정렬 상태를 해치지 않고 다음 기준을 적용할 수 있습니다."
  },
  {
    id: 9,
    question: "삽입 정렬 알고리즘에서 'key' 값이란 무엇인가요?",
    options: ["정렬된 영역의 가장 큰 값", "현재 정렬된 영역에 삽입하려고 들고 있는 값", "배열의 인덱스", "데이터의 총 개수"],
    correctIndex: 1,
    explanation: "정렬되지 않은 영역의 첫 번째 요소를 잠시 꺼내둔 값을 보통 Key라고 부르며, 이를 정렬된 영역과 비교합니다."
  },
  {
    id: 10,
    question: "일상생활에서 삽입 정렬을 활용하기 가장 좋은 예시는?",
    options: ["전교생 성적 처리", "수능 시험지 채점", "지갑에 지폐를 액수 순서대로 정리할 때", "도서관의 모든 책을 재배치할 때"],
    correctIndex: 2,
    explanation: "지갑의 지폐처럼 데이터가 적고, 새로운 지폐가 생길 때 적절한 위치에 끼워 넣는 상황이 삽입 정렬과 가장 유사합니다."
  }
];

export const BADGES = [
  { id: 'first_step', name: '시작이 반이다', desc: '위저드 첫 단계 완료' },
  { id: 'combo_master', name: '직관의 제왕', desc: '실수 없이 삽입 위치 찾기 3회 연속 성공' },
  { id: 'theory_master', name: '이론 마스터', desc: '퀴즈 80점 이상 달성' },
  { id: 'architect', name: '설계자', desc: '나만의 정렬 프로젝트 설계 완료' },
];