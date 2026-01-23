import { QuizQuestion } from './types';

export const COLORS = {
  0: '#f8fafc', // Slate 50 (밝은 흰색, 배경 대비 선명)
  1: '#0f172a', // Slate 900 (진한 검정)
  2: '#2563eb', // Blue 600 (선명한 파랑)
};

export const COLOR_NAMES = {
  0: '흰색',
  1: '검정',
  2: '파랑',
};

export const BADGES = [
  { id: 'compress_master', name: '연속의 달인', desc: '압축률 60% 이하 달성', icon: '🏆' },
  { id: 'scan_strategist', name: '스캔 전략가', desc: '행/열 변경으로 압축률 개선', icon: '🔄' },
  { id: 'counter_hunter', name: '반례 사냥꾼', desc: '체커보드 패턴 설명 정답', icon: '🕵️' },
  { id: 'daily_challenger', name: '성실한 연구원', desc: '3일 연속 방문', icon: '🔥' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    difficulty: 'easy',
    question: "RLE의 뜻으로 가장 적절한 것은?",
    options: ["랜덤 길이 부호화", "런(연속) 길이 부호화", "레드 라이트 부호화", "우측 정렬 부호화"],
    correctIndex: 1,
    explanation: "RLE는 Run-Length Encoding으로, 연속된 데이터(Run)의 길이를 기록하여 압축하는 방식입니다."
  },
  {
    id: 2,
    difficulty: 'easy',
    question: "AAAABBB를 RLE로 표현하면?",
    options: ["7AB", "A3B4", "A4B3", "AB7"],
    correctIndex: 2,
    explanation: "A가 4번, B가 3번 연속되므로 A4B3가 됩니다."
  },
  {
    id: 3,
    difficulty: 'medium',
    question: "다음 중 RLE 압축 효율이 가장 좋은 경우는?",
    options: ["흰색과 검은색이 번갈아 나올 때", "화면 전체가 흰색일 때", "랜덤한 노이즈가 가득할 때", "세로 줄무늬가 많을 때 (가로 스캔 시)"],
    correctIndex: 1,
    explanation: "화면 전체가 한 가지 색이면 단 하나의 데이터(예: W64)로 표현되어 압축률이 극대화됩니다."
  },
  {
    id: 4,
    difficulty: 'medium',
    question: "가로 줄무늬가 있는 옷 그림을 압축하려 합니다. 유리한 스캔 방식은?",
    options: ["행 우선 스캔 (가로로 읽기)", "열 우선 스캔 (세로로 읽기)", "대각선 스캔", "상관 없다"],
    correctIndex: 0,
    explanation: "가로 줄무늬는 가로로 읽었을 때 색 변화가 적어(연속됨) 행 우선 스캔이 유리합니다."
  },
  {
    id: 5,
    difficulty: 'hard',
    question: "RLE 압축을 했는데 오히려 파일 크기가 커졌습니다. 이유는?",
    options: ["색상이 너무 적어서", "연속된 구간이 거의 없고 자주 바뀌어서", "해상도가 너무 낮아서", "컴퓨터 오류"],
    correctIndex: 1,
    explanation: "색이 한 칸마다 바뀌면 '색+길이' 정보가 원본 픽셀 하나보다 많은 공간을 차지해 역효과(Negative Compression)가 납니다."
  },
  {
    id: 6,
    difficulty: 'medium',
    question: "RLE는 어떤 종류의 압축 방식인가요?",
    options: ["손실 압축 (화질 저하 있음)", "무손실 압축 (원본 완벽 복원)", "오디오 전용 압축", "3D 모델 압축"],
    correctIndex: 1,
    explanation: "RLE는 데이터 손실 없이 원본을 완벽하게 복원할 수 있는 무손실 압축 방식입니다."
  },
  {
    id: 7,
    difficulty: 'hard',
    question: "체커보드(체스판) 패턴이 RLE에 최악인 이유는?",
    options: ["검은색이 많아서", "흰색이 많아서", "런(Run)의 길이가 모두 1이라 메타데이터가 늘어나서", "대각선이 있어서"],
    correctIndex: 2,
    explanation: "모든 픽셀마다 색이 바뀌면 런 길이가 1이 되어, 기록해야 할 숫자가 픽셀 수의 2배가 될 수 있습니다."
  },
  {
    id: 8,
    difficulty: 'easy',
    question: "팩스(Fax) 전송에서 RLE가 사용된 주된 이유는?",
    options: ["문서는 대부분 흰 배경에 검은 글씨라 여백이 많아서", "컬러 사진을 보내기 위해서", "종이를 아끼기 위해서", "전기를 절약하려고"],
    correctIndex: 0,
    explanation: "문서는 넓은 흰색 영역(여백)이 많아 RLE로 압축하면 전송 시간을 획기적으로 줄일 수 있었습니다."
  },
  {
    id: 9,
    difficulty: 'medium',
    question: "행 우선 스캔으로 '검검검흰흰흰'을 읽으면?",
    options: ["검3흰3", "흰3검3", "3검3흰", "검흰6"],
    correctIndex: 0,
    explanation: "순서대로 검은색 3개, 흰색 3개이므로 검3흰3입니다."
  },
  {
    id: 10,
    difficulty: 'hard',
    question: "10x10 그리드에서 전체가 검은색일 때, 압축률(대략)은?",
    options: ["100% (변화 없음)", "약 2% (매우 높음)", "50%", "200% (커짐)"],
    correctIndex: 1,
    explanation: "원본 100개 데이터가 '검정, 100'이라는 2개의 데이터로 줄어드므로 약 2/100 = 2% 수준이 됩니다."
  }
];

export const SAMPLE_ARTWORKS = [
  { name: "스마일", grid: [0,0,0,0,0,0,0,0, 0,0,1,0,0,1,0,0, 0,0,1,0,0,1,0,0, 0,0,0,0,0,0,0,0, 0,1,0,0,0,0,1,0, 0,1,0,0,0,0,1,0, 0,0,1,1,1,1,0,0, 0,0,0,0,0,0,0,0], size: 8 },
  { name: "하트", grid: [0,0,0,0,0,0,0,0, 0,1,1,0,0,1,1,0, 1,2,2,1,1,2,2,1, 1,2,2,2,2,2,2,1, 0,1,2,2,2,2,1,0, 0,0,1,2,2,1,0,0, 0,0,0,1,1,0,0,0, 0,0,0,0,0,0,0,0], size: 8 },
  { name: "줄무늬", grid: [1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0], size: 8 },
];
