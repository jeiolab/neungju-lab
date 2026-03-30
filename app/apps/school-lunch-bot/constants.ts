import { LevelConfig, CellType, Direction, QuizQuestion } from './types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "레벨 1: 직선 주행",
    description: "앞으로 이동해서 학생에게 급식을 배식하세요.",
    grid: [
      [2, 2, 2, 2, 2],
      [2, 0, 0, 1, 2],
      [2, 2, 2, 2, 2],
    ],
    startPos: { x: 1, y: 1, direction: Direction.EAST },
    maxCommands: 5,
  },
  {
    id: 2,
    name: "레벨 2: 회전하기",
    description: "벽을 피해 배고픈 학생에게 도달하세요.",
    grid: [
      [2, 2, 2, 2, 2],
      [2, 0, 2, 1, 2],
      [2, 0, 0, 0, 2],
      [2, 2, 2, 2, 2],
    ],
    startPos: { x: 1, y: 1, direction: Direction.SOUTH },
    maxCommands: 10,
  },
  {
    id: 3,
    name: "레벨 3: 줄 서 있는 학생들",
    description: "반복문(LOOP)을 사용하여 여러 학생에게 효율적으로 배식하세요!",
    grid: [
      [2, 2, 2, 2, 2, 2],
      [2, 0, 1, 1, 1, 2],
      [2, 0, 0, 0, 0, 2],
      [2, 2, 2, 2, 2, 2],
    ],
    startPos: { x: 1, y: 2, direction: Direction.EAST },
    maxCommands: 10,
  },
  {
    id: 4,
    name: "레벨 4: 교실 미로",
    description: "복잡한 길입니다. 벽(인덱스 초과)을 조심하세요!",
    grid: [
      [2, 2, 2, 2, 2, 2],
      [2, 1, 0, 1, 0, 2],
      [2, 0, 2, 0, 2, 2],
      [2, 1, 0, 1, 0, 2],
      [2, 2, 2, 2, 2, 2],
    ],
    startPos: { x: 2, y: 2, direction: Direction.NORTH },
    maxCommands: 15,
  }
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "로봇이 grid[1][1]에 있고 동쪽(EAST)으로 이동하면 어디로 갈까요?",
    codeSnippet: "현재위치: grid[1][1]\n방향: 동쪽(EAST)\n명령: 앞으로 이동",
    options: ["grid[1][0]", "grid[1][2]", "grid[2][1]", "grid[0][1]"],
    correctAnswer: 1,
    explanation: "동쪽으로 이동하면 x좌표(열 인덱스)가 1 증가합니다. 따라서 [1][1]은 [1][2]가 됩니다.",
  },
  {
    id: 2,
    question: "5x5 격자(인덱스 0-4)에서 grid[5][0]에 접근하면 어떻게 될까요?",
    options: ["로봇이 출발점으로 돌아간다", "아무 일도 일어나지 않는다", "IndexError (범위 초과 오류)", "게임이 일시 정지된다"],
    correctAnswer: 2,
    explanation: "배열 인덱스는 0부터 시작합니다. 크기가 5인 배열의 유효 인덱스는 0, 1, 2, 3, 4입니다. 인덱스 5는 범위를 벗어납니다!",
  },
  {
    id: 3,
    question: "학생 5명에게 연속으로 배식하기 가장 좋은 방법은?",
    codeSnippet: "학생 위치: (0,1), (0,2), (0,3), (0,4), (0,5)",
    options: ["'배식하기'를 5번 쓴다", "5회 반복: [이동, 배식]", "5회 반복: [왼쪽 회전]", "무한 반복: 이동"],
    correctAnswer: 1,
    explanation: "반복문을 사용하면 '이동 후 배식'이라는 행동을 5번 반복하도록 하여 코드를 짧고 효율적으로 만들 수 있습니다.",
  },
];

export const XP_TITLES = [
  { xp: 0, title: '인턴 영양사' },
  { xp: 50, title: '주니어 코더' },
  { xp: 100, title: '알고리즘 조교' },
  { xp: 200, title: '로봇 엔지니어' },
  { xp: 400, title: '수석 RPA 설계자' },
];