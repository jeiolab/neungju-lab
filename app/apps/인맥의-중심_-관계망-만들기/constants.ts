import { GraphData, QuizData } from './types';

export const INITIAL_GRAPH: GraphData = {
  nodes: [
    { id: "1", name: "민수", hobby: "축구", group: 1 },
    { id: "2", name: "영희", hobby: "독서", group: 1 },
    { id: "3", name: "철수", hobby: "게임", group: 1 },
    { id: "4", name: "지민", hobby: "댄스", group: 2 },
    { id: "5", name: "준호", hobby: "축구", group: 2 },
    { id: "6", name: "서연", hobby: "음악", group: 2 },
    { id: "7", name: "현우", hobby: "코딩", group: 3 }, // Somewhat isolated
    { id: "8", name: "보라", hobby: "그림", group: 1 },
  ],
  links: [
    { source: "1", target: "2", value: 1 },
    { source: "1", target: "3", value: 1 },
    { source: "2", target: "3", value: 1 },
    { source: "3", target: "4", value: 1 }, // Bridge
    { source: "4", target: "5", value: 1 },
    { source: "4", target: "6", value: 1 },
    { source: "5", target: "6", value: 1 },
    { source: "1", target: "8", value: 1 },
    { source: "7", target: "5", value: 1 }, // Connected only to 5
  ]
};

export const QUIZZES: QuizData[] = [
  {
    id: 1,
    question: "가장 많은 친구와 직접 연결된 '마당발' 친구는 누구인가요?",
    options: ["민수", "영희", "지민", "현우"],
    correctAnswer: 2, // 지민
    explanation: "지민이는 철수, 준호, 서연이와 연결되어 있어 연결 중심성(Degree Centrality)이 높습니다. 그래프에서 가장 많은 선(Edge)을 가진 점(Node)입니다."
  },
  {
    id: 2,
    question: "만약 '지민'이가 전학을 간다면, 1그룹(민수,영희,철수)과 2그룹(준호,서연)은 어떻게 될까요?",
    options: ["여전히 잘 연결된다", "연결이 끊어진다", "모두 현우와 친해진다", "아무 변화 없다"],
    correctAnswer: 1,
    explanation: "지민이는 두 그룹을 연결하는 '브릿지(Bridge)' 역할을 하고 있습니다. 지민이가 사라지면 두 그룹 간의 소통 경로가 사라집니다."
  },
  {
    id: 3,
    question: "친구들에게 소문을 가장 빨리 퍼뜨리려면 누구에게 먼저 말해야 할까요?",
    options: ["가장 외곽에 있는 친구", "가장 중심에 있는 친구", "아무나 상관없다", "친구가 없는 친구"],
    correctAnswer: 1,
    explanation: "중심성(Centrality)이 높은 친구에게 말하면, 적은 단계를 거쳐 모든 친구에게 정보가 도달할 확률이 높습니다."
  }
];

export const THINK_SCENARIO = "우리 반에 '재민'이라는 친구가 전학을 왔습니다. 재민이는 아직 아는 친구가 없어서 그래프상에 '고립된 노드(Isolated Node)'로 존재합니다. 재민이가 반 친구들과 가장 빨리 어울리게 하려면 누구와 짝을 지어주는 것이 좋을까요? 그리고 그 이유는 무엇일까요?";
