import { AlgorithmType, PuzzleBlock, GraphData, QuizQuestion } from './types';

export const ALGORITHMS: Record<AlgorithmType, { title: string; desc: string; blocks: PuzzleBlock[] }> = {
  BINARY_SEARCH: {
    title: "이진 탐색 (Binary Search)",
    desc: "정렬된 데이터에서 절반씩 나눠가며 찾는 효율적인 탐색 방법",
    blocks: [
      { id: 'bs-1', text: "탐색 범위(Low, High) 설정 (0, N-1)", order: 0 },
      { id: 'bs-2', text: "Low > High 이면 '실패' 종료", order: 1 },
      { id: 'bs-3', text: "중간값(Mid) 계산: (Low + High) / 2", order: 2 },
      { id: 'bs-4', text: "arr[Mid] == Target 이면 '성공' 종료", order: 3 },
      { id: 'bs-5', text: "arr[Mid] < Target 이면 Low = Mid + 1", order: 4 },
      { id: 'bs-6', text: "arr[Mid] > Target 이면 High = Mid - 1", order: 5 },
      { id: 'bs-7', text: "2번 단계로 돌아가 반복", order: 6 },
    ]
  },
  DFS: {
    title: "깊이 우선 탐색 (DFS)",
    desc: "미로를 탐험하듯 갈림길에서 한 방향으로 끝까지 간 후 되돌아오는 방식",
    blocks: [
      { id: 'dfs-1', text: "시작 노드를 스택(Stack)에 넣음", order: 0 },
      { id: 'dfs-2', text: "스택이 비었는지 확인 (비었으면 종료)", order: 1 },
      { id: 'dfs-3', text: "스택에서 노드 하나 꺼냄 (Pop)", order: 2 },
      { id: 'dfs-4', text: "이미 방문했는지 확인 (방문했으면 패스)", order: 3 },
      { id: 'dfs-5', text: "방문 처리 및 출력", order: 4 },
      { id: 'dfs-6', text: "인접한 미방문 노드들을 스택에 넣음", order: 5 },
      { id: 'dfs-7', text: "2번 단계로 돌아가 반복", order: 6 },
    ]
  },
  BFS: {
    title: "너비 우선 탐색 (BFS)",
    desc: "호수에 던진 돌의 물결처럼 가까운 곳부터 넓게 퍼져나가는 방식",
    blocks: [
      { id: 'bfs-1', text: "시작 노드를 큐(Queue)에 넣음", order: 0 },
      { id: 'bfs-2', text: "큐가 비었는지 확인 (비었으면 종료)", order: 1 },
      { id: 'bfs-3', text: "큐에서 노드 하나 꺼냄 (Dequeue)", order: 2 },
      { id: 'bfs-4', text: "이미 방문했는지 확인 (방문했으면 패스)", order: 3 },
      { id: 'bfs-5', text: "방문 처리 및 출력", order: 4 },
      { id: 'bfs-6', text: "인접한 미방문 노드들을 큐에 넣음", order: 5 },
      { id: 'bfs-7', text: "2번 단계로 돌아가 반복", order: 6 },
    ]
  }
};

export const SAMPLE_ARRAY = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

export const SAMPLE_GRAPH: GraphData = {
  nodes: [
    { id: 'A', x: 150, y: 50, label: 'A' },
    { id: 'B', x: 80, y: 150, label: 'B' },
    { id: 'C', x: 220, y: 150, label: 'C' },
    { id: 'D', x: 40, y: 250, label: 'D' },
    { id: 'E', x: 120, y: 250, label: 'E' },
    { id: 'F', x: 190, y: 250, label: 'F' },
    { id: 'G', x: 260, y: 250, label: 'G' },
  ],
  edges: [
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'D' },
    { source: 'B', target: 'E' },
    { source: 'C', target: 'F' },
    { source: 'C', target: 'G' },
  ]
};

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "이진 탐색(Binary Search)을 사용하기 위한 필수 전제 조건은?",
    options: ["데이터가 많아야 한다", "데이터가 정렬되어 있어야 한다", "데이터가 모두 양수여야 한다", "메모리가 충분해야 한다"],
    correctAnswer: 1,
    explanation: "이진 탐색은 중간값을 기준으로 범위를 반으로 줄여나가기 때문에 데이터가 반드시 정렬되어 있어야 합니다."
  },
  {
    id: 2,
    question: "DFS(깊이 우선 탐색) 구현 시 주로 사용하는 자료구조는?",
    options: ["Queue (큐)", "Stack (스택)", "Heap (힙)", "Hash Map (해시 맵)"],
    correctAnswer: 1,
    explanation: "DFS는 가장 깊은 곳까지 갔다가 되돌아오는(Backtracking) 방식이므로 LIFO(Last In First Out) 구조인 스택을 사용합니다."
  },
  {
    id: 3,
    question: "BFS(너비 우선 탐색)가 가장 적합한 문제 유형은?",
    options: ["미로의 출구 찾기 (경로 유무)", "가중치가 없는 그래프의 최단 경로", "모든 경우의 수 탐색", "사이클 판별"],
    correctAnswer: 1,
    explanation: "BFS는 시작점에서 가까운 노드부터 순차적으로 방문하므로, 가중치가 없는 그래프에서 최단 경로를 보장합니다."
  },
  {
    id: 4,
    question: "이진 탐색의 시간 복잡도는?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    correctAnswer: 1,
    explanation: "탐색 범위를 매 단계마다 절반으로 줄이므로 O(log N)의 시간 복잡도를 가집니다."
  },
  {
    id: 5,
    question: "그래프 탐색에서 '방문 처리'를 하는 주된 이유는?",
    options: ["메모리를 아끼기 위해", "무한 루프(사이클) 방지 및 중복 방지", "탐색 속도를 늦추기 위해", "오류를 발생시키기 위해"],
    correctAnswer: 1,
    explanation: "이미 방문한 노드를 다시 큐나 스택에 넣으면 탐색이 끝나지 않고 무한 루프에 빠질 수 있습니다."
  },
  {
    id: 6,
    question: "DFS의 특징이 아닌 것은?",
    options: ["현 경로상의 노드만 기억하면 되므로 메모리가 비교적 적게 든다", "목표가 깊은 단계에 있을 때 빨리 찾을 수 있다", "항상 최단 경로를 보장한다", "재귀 호출로 구현하기 쉽다"],
    correctAnswer: 2,
    explanation: "DFS는 해를 찾으면 탐색을 종료할 수 있지만, 그 경로가 최단 경로라는 보장은 없습니다."
  },
  {
    id: 7,
    question: "큐(Queue) 자료구조의 특징은?",
    options: ["LIFO (Last In First Out)", "FIFO (First In First Out)", "Random Access", "Key-Value Pair"],
    correctAnswer: 1,
    explanation: "큐는 먼저 들어온 데이터가 먼저 나가는 선입선출(FIFO) 구조입니다."
  },
  {
    id: 8,
    question: "이진 탐색 중 Low > High가 되었다는 의미는?",
    options: ["탐색 성공", "탐색 실패 (값이 없음)", "중간 지점 도달", "에러 발생"],
    correctAnswer: 1,
    explanation: "탐색 범위가 교차되어 유효한 범위가 사라졌다는 뜻이므로, 찾는 값이 리스트에 없다는 의미입니다."
  },
  {
    id: 9,
    question: "트리(Tree) 순회 방법 중, 루트를 먼저 방문하는 것은?",
    options: ["전위 순회 (Pre-order)", "중위 순회 (In-order)", "후위 순회 (Post-order)", "레벨 순회"],
    correctAnswer: 0,
    explanation: "전위 순회는 Root -> Left -> Right 순서로 방문합니다. (DFS의 일종)"
  },
  {
    id: 10,
    question: "다음 중 탐색 알고리즘이 아닌 것은?",
    options: ["Dijkstra", "A*", "Merge Sort", "Bellman-Ford"],
    correctAnswer: 2,
    explanation: "Merge Sort(병합 정렬)는 정렬 알고리즘입니다. 나머지는 그래프/경로 탐색 알고리즘입니다."
  }
];
