import { Mission, QuizQuestion } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000];

export const BADGES = {
  ROW_MASTER: { id: 'row_master', name: '행 마스터', icon: '↔️', description: '행 전체 선택 미션 완료' },
  COL_HUNTER: { id: 'col_hunter', name: '열 사냥꾼', icon: '↕️', description: '열 전체 선택 미션 완료' },
  SLICE_SENSE: { id: 'slice_sense', name: '슬라이싱 감각', icon: '🔪', description: '부분 범위 선택 완료' },
  DATA_ARCHITECT: { id: 'data_architect', name: '데이터 건축가', icon: '🏗️', description: '설계 미션 완료' },
};

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "좌표 탐색",
    description: "인덱스 [1][2] 위치의 좌석을 찾아 클릭하세요.",
    targetType: 'cell',
    targetCondition: (r, c) => r === 1 && c === 2,
    hint: "행(세로 인덱스)이 1이고, 열(가로 인덱스)이 2인 곳입니다."
  },
  {
    id: 2,
    title: "행 마스터",
    description: "인덱스 [2]행 전체를 선택하세요. (모드 변경 필요)",
    targetType: 'row',
    targetCondition: (r, c, grid, sel) => sel.mode === 'row' && sel.r === 2,
    hint: "우측 상단에서 '행 선택' 모드로 바꾸고 두 번째(인덱스 2) 줄을 클릭하세요."
  },
  {
    id: 3,
    title: "열 사냥꾼",
    description: "인덱스 [0]열 전체를 선택하세요.",
    targetType: 'col',
    targetCondition: (r, c, grid, sel) => sel.mode === 'col' && sel.c === 0,
    hint: "모드를 '열 선택'으로 바꾸고 첫 번째(인덱스 0) 세로줄을 클릭하세요."
  },
  {
    id: 4,
    title: "값 수정하기",
    description: "[0][0] 위치의 값을 100점으로 수정하세요.",
    targetType: 'edit',
    targetCondition: (r, c, grid) => grid[0][0] === 100,
    hint: "[0][0] 셀을 클릭하고 값을 변경한 뒤 '수정' 버튼을 누르세요."
  },
  {
    id: 5,
    title: "슬라이싱 연습",
    description: "행 0~1, 열 1~2 범위를 선택해보세요.",
    targetType: 'slice',
    targetCondition: (r, c, grid, sel) => 
      sel.mode === 'slice' && 
      sel.rStart === 0 && sel.rEnd === 1 && 
      sel.cStart === 1 && sel.cEnd === 2,
    hint: "슬라이싱 모드에서 시작점[0][1]과 끝점[1][2]를 설정하세요."
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 2차원 리스트를 선언하는 올바른 파이썬 코드는?",
    options: ["a = [1, 2, 3]", "a = [[1, 2], [3, 4]]", "a = (1, 2, 3)", "a = {1, 2, 3}"],
    correctIndex: 1,
    tag: 'structure',
    explanation: "2차원 리스트는 대괄호 안에 또 다른 리스트들이 들어있는 형태입니다."
  },
  {
    id: 2,
    question: "data = [[10, 20], [30, 40]] 에서 data[1][0]의 값은?",
    options: ["10", "20", "30", "40"],
    correctIndex: 2,
    tag: 'indexing',
    explanation: "인덱스 1번 행([30, 40])의 0번 열 요소는 30입니다."
  },
  {
    id: 3,
    question: "이미지 데이터는 주로 몇 차원 배열로 표현되나요? (흑백 기준)",
    options: ["0차원", "1차원", "2차원", "4차원"],
    correctIndex: 2,
    tag: 'dimension',
    explanation: "이미지는 가로(열)와 세로(행) 픽셀의 격자로 이루어진 2차원 데이터입니다."
  },
  {
    id: 4,
    question: "3차원 데이터의 구성 요소가 아닌 것은?",
    options: ["행(Row)", "열(Column)", "깊이/높이(Depth)", "시간(Time) - 필수 아님"],
    correctIndex: 3,
    tag: 'structure',
    explanation: "3차원 공간 데이터는 행, 열, 깊이(또는 높이/채널)로 구성됩니다."
  },
  {
    id: 5,
    question: "리스트 a에서 첫 번째 행 전체를 가져오는 슬라이싱은?",
    options: ["a[0]", "a[:][0]", "a[0][:]", "a[1]"],
    correctIndex: 0,
    tag: 'slicing',
    explanation: "2차원 리스트에서 a[0]은 첫 번째 행 리스트 전체를 가리킵니다."
  },
  {
    id: 6,
    question: "반별 점수표(2차원)에서 '3반의 5번 학생' 데이터를 찾으려면?",
    options: ["score[3][5]", "score[2][4]", "score[5][3]", "score[3]"],
    correctIndex: 1,
    tag: 'indexing',
    explanation: "인덱스는 0부터 시작하므로 3반은 인덱스 2, 5번 학생은 인덱스 4가 됩니다."
  },
  {
    id: 7,
    question: "픽셀(Pixel) 하나를 표현하는 색상 정보(R,G,B)는 보통 1차원 리스트 [R,G,B]입니다. 이미지 전체는?",
    options: ["1차원 리스트", "2차원 리스트", "3차원 리스트", "문자열"],
    correctIndex: 2,
    tag: 'dimension',
    explanation: "각 픽셀이 [R,G,B] 리스트이고, 픽셀들이 행/열로 배치되므로 3차원(행,열,색상) 구조가 됩니다."
  },
  {
    id: 8,
    question: "a = [[1,2], [3,4]] 일 때 len(a)의 값은?",
    options: ["2", "4", "1", "3"],
    correctIndex: 0,
    tag: 'structure',
    explanation: "가장 바깥쪽 리스트에는 [1,2]와 [3,4] 두 개의 요소가 들어있으므로 길이는 2입니다."
  },
  {
    id: 9,
    question: "슬라이싱 a[0:2]의 의미는?",
    options: ["0번 인덱스만", "0번부터 1번 인덱스까지", "0번부터 2번 인덱스까지", "2번 인덱스만"],
    correctIndex: 1,
    tag: 'slicing',
    explanation: "시작(포함):끝(미포함) 규칙에 따라 0, 1 인덱스가 선택됩니다."
  },
  {
    id: 10,
    question: "행이 늘어나면 2차원 리스트에서 무엇이 추가되는가?",
    options: ["안쪽 리스트의 길이", "바깥쪽 리스트의 요소", "정수값", "변수명"],
    correctIndex: 1,
    tag: 'structure',
    explanation: "행이 늘어난다는 것은 바깥쪽 리스트에 새로운 리스트 요소가 추가된다는 뜻입니다."
  }
];