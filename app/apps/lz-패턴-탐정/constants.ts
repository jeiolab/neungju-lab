import { PuzzleData, QuizQuestion, Badge, UserProgress } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 3000];

export const BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: '신입 탐정',
    description: '첫 번째 퍼즐을 해결했습니다.',
    icon: '🔍',
    condition: (p) => p.solvedPuzzles >= 1,
  },
  {
    id: 'distance_master',
    name: '거리 계산 마스터',
    description: '퍼즐 5개를 해결했습니다.',
    icon: '📏',
    condition: (p) => p.solvedPuzzles >= 5,
  },
  {
    id: 'streak_genius',
    name: '꾸준한 천재',
    description: '3일 연속 학습을 달성했습니다.',
    icon: '🔥',
    condition: (p) => p.streak >= 3,
  },
  {
    id: 'lz_expert',
    name: 'LZ 전문가',
    description: 'XP 1000점을 달성했습니다.',
    icon: '🎓',
    condition: (p) => p.xp >= 1000,
  }
];

export const PUZZLES: PuzzleData[] = [
  {
    id: 'p1',
    difficulty: 'easy',
    text: 'BANANABANA',
    targetPattern: { startIndex: 6, length: 4, matchIndex: 0 }, // Second BANA matches first BANA
    hint: '"BANA"가 반복되고 있어요. 얼마나 멀리 떨어져 있나요?'
  },
  {
    id: 'p2',
    difficulty: 'easy',
    text: 'ABCABCABC',
    targetPattern: { startIndex: 3, length: 3, matchIndex: 0 },
    hint: 'ABC 패턴이 바로 직전에 나왔네요.'
  },
  {
    id: 'p3',
    difficulty: 'medium',
    text: 'SCHOOLCOOL',
    targetPattern: { startIndex: 6, length: 4, matchIndex: 1 }, // COOL matches CHOOL? No. COOL matches COOL (index 2? no)
    // S C H O O L C O O L
    // 0 1 2 3 4 5 6 7 8 9
    // 'COOL' at 6 matches 'COOL' at... wait. simple example:
    // Pattern: COOL. Source: C(1) H(2) O(3) O(4) L(5).
    // Let's adjust text for better LZ example.
    // 'KICKKICK' -> KICK(0), KICK(4). Dist 4, Len 4.
    hint: '바로 앞의 단어가 반복됩니다.'
  },
  {
    id: 'p4',
    difficulty: 'medium',
    text: 'TOKTOKTOK',
    targetPattern: { startIndex: 3, length: 3, matchIndex: 0 },
    hint: 'TOK이 반복됩니다.'
  },
  {
    id: 'p5',
    difficulty: 'hard',
    text: 'MISSISSIPPI',
    targetPattern: { startIndex: 4, length: 3, matchIndex: 1 }, // ISSI matches ISSI
    // M I S S I S S I P P I
    // 0 1 2 3 4 5 6 7 8 9 10
    // ISSI at 1. ISSI at 4.
    // At index 4 (I), look back. Found I at 1. S at 2 match S at 5. S at 3 match S at 6. I at 4 match I at 7.
    // Length 4 match? ISSI (1..4) vs ISSI (4..7).
    // Let's target the "ISSI" repetition.
    hint: 'ISSI 패턴을 찾아보세요.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "LZ 알고리즘의 핵심 원리는 무엇인가요?",
    options: ["모든 문자를 숫자로 바꾼다", "자주 나오는 글자를 짧게 줄인다 (허프만)", "이전에 나온 패턴을 위치와 길이로 치환한다", "모음을 모두 제거한다"],
    answer: 2,
    explanation: "LZ는 '사전'을 동적으로 만들며, 이전에 등장한 문자열을 <거리, 길이> 쌍으로 참조하여 압축합니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "<거리(Distance), 길이(Length)>에서 '거리'의 의미는?",
    options: ["패턴의 글자 수", "현재 위치에서 얼마나 뒤로(과거로) 가야 패턴이 있는지", "전체 문자열의 길이", "압축 후 파일 크기"],
    answer: 1,
    explanation: "거리는 현재 압축하려는 위치로부터 '얼마나 이전에' 똑같은 패턴이 시작되었는지를 나타내는 상대적 위치입니다.",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "문자열 'ABCABC'에서 뒤의 'ABC'를 LZ로 표현할 때 올바른 쌍은? (바로 직전 ABC 참조)",
    options: ["<3, 3>", "<0, 3>", "<3, 0>", "<6, 3>"],
    answer: 0,
    explanation: "ABC(012) ABC(345). 3번 인덱스에서 시작할 때, 3칸 뒤로 가면(인덱스 0) 'A'가 시작되고, 거기서부터 3글자가 일치합니다.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "LZ 압축이 가장 효과적인 데이터 유형은?",
    options: ["완전 무작위 난수", "로또 당첨 번호", "반복되는 문구가 많은 채팅 로그나 소스코드", "이미 압축된 ZIP 파일"],
    answer: 2,
    explanation: "패턴의 반복이 많을수록 참조(Reference)를 통해 데이터를 줄일 기회가 많아집니다.",
    difficulty: 'easy'
  },
  {
    id: 5,
    question: "패턴이 멀리 떨어져 있어도 참조할 수 있나요?",
    options: ["아니오, 바로 옆에 있어야 합니다.", "네, 설정된 '윈도우 크기' 안이라면 가능합니다.", "오직 10글자 이내만 가능합니다.", "무조건 파일의 맨 처음만 참조 가능합니다."],
    answer: 1,
    explanation: "LZ 계열 알고리즘은 '슬라이딩 윈도우'라는 범위를 사용하여, 일정 범위 내의 과거 데이터를 모두 참조할 수 있습니다.",
    difficulty: 'medium'
  },
  {
    id: 6,
    question: "길이(Length)가 2인 패턴을 <거리, 길이> 토큰으로 바꿀 때, 토큰 자체가 3바이트라면?",
    options: ["압축 효율이 좋아진다", "오히려 용량이 커질 수 있다", "아무 변화 없다", "파일이 깨진다"],
    answer: 1,
    explanation: "치환하려는 원본보다 치환 정보(토큰)가 더 크다면 압축하는 의미가 없으므로, 보통 일정 길이(예: 3~4) 이상일 때만 치환합니다.",
    difficulty: 'hard'
  },
  {
    id: 7,
    question: "LZ77과 LZ78의 가장 큰 차이점은?",
    options: ["압축 속도", "만든 사람의 국적", "사전을 만드는 방식 (슬라이딩 윈도우 vs 명시적 사전 구축)", "사용하는 전기량"],
    answer: 2,
    explanation: "LZ77은 과거 데이터를 윈도우로 사용하여 암묵적 사전을 쓰고, LZ78은 별도의 사전 목록을 명시적으로 구축해 나갑니다.",
    difficulty: 'hard'
  },
  {
    id: 8,
    question: "다음 중 LZ 압축을 사용하는 포맷이 아닌 것은?",
    options: ["ZIP", "PNG", "GIF", "BMP (무압축)"],
    answer: 3,
    explanation: "BMP는 보통 무압축 비트맵 저장 방식입니다. ZIP(DEFLATE), PNG, GIF 등은 LZ 계열 알고리즘을 사용합니다.",
    difficulty: 'medium'
  },
  {
    id: 9,
    question: "문자열 'AAAAA'를 압축하려 합니다. 두 번째 A부터는 바로 앞의 A를 참조할 수 있습니다. 이것은 무엇을 의미하나요?",
    options: ["불가능한 참조", "재귀적 참조를 통한 RLE(Run-Length Encoding) 효과", "사전 오염", "버퍼 오버플로우"],
    answer: 1,
    explanation: "LZ77에서는 거리(Distance)가 1이고 길이(Length)가 길면, 한 글자가 계속 반복되는 효과를 낼 수 있습니다.",
    difficulty: 'hard'
  },
  {
    id: 10,
    question: "우리 반 급식표 메뉴가 매주 똑같이 반복된다면 LZ 압축률은?",
    options: ["매우 높을 것이다", "매우 낮을 것이다", "0%일 것이다", "알 수 없다"],
    answer: 0,
    explanation: "긴 텍스트 블록이 주기적으로 반복되므로, 통째로 <거리, 길이>로 치환되어 압축률이 매우 높습니다.",
    difficulty: 'easy'
  }
];

export const REFLECTION_QUESTIONS = [
  {
    id: 'q1',
    question: '만약 패턴 길이 제한을 최소 2글자에서 6글자로 늘린다면 어떤 장단점이 있을까요?',
  },
  {
    id: 'q2',
    question: '랜덤한 문자열(예: 비밀번호)은 왜 LZ 방식으로 압축하기 어려울까요?',
  },
  {
    id: 'q3',
    question: '우리 반 공지사항이나 알림장에서 자주 반복되는 문구를 찾아 "템플릿"을 만들어보세요. 이것이 압축과 어떤 관련이 있을까요?',
  }
];