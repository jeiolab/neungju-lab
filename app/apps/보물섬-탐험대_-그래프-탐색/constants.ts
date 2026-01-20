import { PuzzleLevel } from './types';

export const LEVEL_1: PuzzleLevel = {
  id: 1,
  name: "시작의 해변",
  difficulty: '쉬움',
  startNodeId: 'A',
  targetNodeId: 'F',
  minMoves: 2,
  graph: {
    nodes: [
      { id: 'A', label: '선착장', x: 100, y: 250 },
      { id: 'B', label: '야자수 숲', x: 250, y: 100 },
      { id: 'C', label: '모래언덕', x: 250, y: 400 },
      { id: 'D', label: '작은 동굴', x: 400, y: 100 },
      { id: 'E', label: '거북 바위', x: 400, y: 400 },
      { id: 'F', label: '보물 상자', x: 550, y: 250, isTreasure: true },
    ],
    edges: [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'B', target: 'D' },
      { source: 'C', target: 'E' },
      { source: 'D', target: 'F' },
      { source: 'E', target: 'F' },
    ]
  }
};

export const LEVEL_2: PuzzleLevel = {
  id: 2,
  name: "혼란의 정글",
  difficulty: '보통',
  startNodeId: 'A',
  targetNodeId: 'H',
  minMoves: 3,
  graph: {
    nodes: [
      { id: 'A', label: '베이스캠프', x: 50, y: 250 },
      { id: 'B', label: '덩굴 숲', x: 200, y: 100 },
      { id: 'C', label: '늪지대', x: 200, y: 400 },
      { id: 'D', label: '원숭이 나무', x: 350, y: 50 },
      { id: 'E', label: '고대 유적', x: 350, y: 250 },
      { id: 'F', label: '폭포', x: 350, y: 450 },
      { id: 'G', label: '해골 바위', x: 500, y: 150 },
      { id: 'H', label: '황금 사원', x: 600, y: 350, isTreasure: true },
    ],
    edges: [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'A', target: 'E' },
      { source: 'B', target: 'D' },
      { source: 'B', target: 'E' },
      { source: 'C', target: 'F' },
      { source: 'C', target: 'E' },
      { source: 'D', target: 'G' },
      { source: 'E', target: 'G' },
      { source: 'E', target: 'H' },
      { source: 'F', target: 'H' },
    ]
  }
};

export const LEVEL_3: PuzzleLevel = {
  id: 3,
  name: "미궁의 화산섬",
  difficulty: '어려움',
  startNodeId: 'A',
  targetNodeId: 'J',
  minMoves: 3,
  graph: {
    nodes: [
      { id: 'A', label: '해안가', x: 50, y: 300 },
      { id: 'B', label: '갈림길 1', x: 150, y: 150 },
      { id: 'C', label: '갈림길 2', x: 150, y: 450 },
      { id: 'D', label: '화산 입구', x: 300, y: 100 },
      { id: 'E', label: '용암 다리', x: 300, y: 300 },
      { id: 'F', label: '검은 숲', x: 300, y: 500 },
      { id: 'G', label: '비밀 통로', x: 450, y: 150 },
      { id: 'H', label: '전망대', x: 450, y: 450 },
      { id: 'I', label: '용의 둥지', x: 600, y: 200 },
      { id: 'J', label: '전설의 보물', x: 650, y: 400, isTreasure: true },
    ],
    edges: [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'B', target: 'D' },
      { source: 'B', target: 'E' },
      { source: 'C', target: 'E' },
      { source: 'C', target: 'F' },
      { source: 'D', target: 'G' },
      { source: 'E', target: 'G' },
      { source: 'E', target: 'H' },
      { source: 'F', target: 'H' },
      { source: 'G', target: 'I' },
      { source: 'H', target: 'J' },
      { source: 'I', target: 'J' },
      { source: 'G', target: 'J' }, // Shortcut makes it interesting
    ]
  }
};

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "BFS(너비 우선 탐색)는 어떤 자료구조를 주로 사용하나요?",
    options: ["스택(Stack)", "큐(Queue)", "트리(Tree)", "해시테이블(Hash Table)"],
    answer: 1,
    explanation: "BFS는 줄을 서서 차례대로 처리하는 방식인 '큐(Queue)'를 사용하여 먼저 들어온 노드를 먼저 방문합니다."
  },
  {
    id: 2,
    question: "미로 찾기에서 '출구까지의 최단 경로'를 찾을 때 더 유리한 알고리즘은?",
    options: ["DFS (깊이 우선 탐색)", "BFS (너비 우선 탐색)", "둘 다 똑같다", "알 수 없다"],
    answer: 1,
    explanation: "BFS는 시작점에서 가까운 곳부터 차근차근 찾기 때문에, 목적지를 처음 발견했을 때가 곧 최단 거리입니다."
  },
  {
    id: 3,
    question: "DFS(깊이 우선 탐색)의 탐색 방식을 비유한 것으로 가장 적절한 것은?",
    options: ["물결이 퍼져나가듯 탐색한다.", "한 놈만 끝까지 팬다(한 우물만 판다).", "여러 곳을 동시에 찔러본다.", "무작위로 이동한다."],
    answer: 1,
    explanation: "DFS는 막다른 길이 나올 때까지 한 방향으로 깊게 들어가는 방식입니다."
  }
];