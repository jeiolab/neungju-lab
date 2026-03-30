import { QuizQuestion } from './types';

export const LOCAL_STORAGE_KEY_PREFIX = 'commute_v1_';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000];
export const BADGES = [
  { id: 'condition_master', name: '조건식 장인', description: '선택 구조 80점 이상', icon: '⚡' },
  { id: 'loop_saver', name: '반복 절약왕', description: '반복 예측 5연속 정답', icon: '💰' },
  { id: 'early_bird', name: '지각 면역자', description: '시뮬레이션 10회 지각 없음', icon: '⏰' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  // Easy
  {
    id: 1,
    difficulty: 'easy',
    type: 'multiple',
    question: 'if문 조건이 거짓(False)이면 어떻게 되나요?',
    options: ['if 블록 내부를 실행한다', 'if 블록을 건너뛴다', '프로그램이 종료된다', '오류가 발생한다'],
    correctAnswer: 'if 블록을 건너뛴다',
    concept: 'selection',
    explanation: '조건이 거짓이면 해당 들여쓰기 된 블록은 실행되지 않고 다음 코드로 넘어갑니다.'
  },
  {
    id: 2,
    difficulty: 'easy',
    type: 'short',
    question: 'n % 2 == 0 은 무엇을 판단하는 조건식인가요?',
    correctAnswer: ['짝수', '짝수 여부', '2의 배수'],
    concept: 'selection',
    explanation: '나머지가 0이라는 것은 나누어 떨어진다는 의미이므로 짝수(2의 배수)를 판단합니다.'
  },
  {
    id: 3,
    difficulty: 'easy',
    type: 'multiple',
    question: '파이썬 등에서 들여쓰기(Indentation)의 주된 역할은?',
    options: ['코드를 예쁘게 하려고', '실행 영역(블록)을 구분하려고', '주석을 달기 위해', '변수를 선언하려고'],
    correctAnswer: '실행 영역(블록)을 구분하려고',
    concept: 'indentation',
    explanation: '조건문이나 반복문에 종속된 실행 코드 범위를 지정하기 위해 들여쓰기를 사용합니다.'
  },
  // Normal
  {
    id: 4,
    difficulty: 'normal',
    type: 'multiple',
    question: 'elif 문은 언제 검사(실행)되나요?',
    options: ['항상 실행된다', '이전 조건(if/elif)이 거짓일 때만', '이전 조건이 참일 때만', '마지막에 무조건 실행된다'],
    correctAnswer: '이전 조건(if/elif)이 거짓일 때만',
    concept: 'nested',
    explanation: 'elif는 "그게 아니라면 만약에"라는 뜻으로, 앞선 조건이 False일 때만 체크합니다.'
  },
  {
    id: 5,
    difficulty: 'normal',
    type: 'short',
    question: '반복문이 필요한 상황 예시를 1개 적어보세요.',
    correctAnswer: ['시간', '초', '분', '검사', '체크', '계속', '도착', '합계', '카운트'],
    concept: 'iteration',
    explanation: '등굣길 시간 흐름, 정류장마다 검사하기 등 똑같은 로직을 여러 번 수행할 때 필요합니다.'
  },
  {
    id: 6,
    difficulty: 'normal',
    type: 'narrative',
    question: '"if 문을 여러 번 쓰는 것"과 "if-elif-else" 구조의 결정적 차이는?',
    correctAnswer: ['독립', '종속', '여러 개', '하나만', '동시에'],
    concept: 'nested',
    explanation: 'if 여러 번은 각각 독립적으로 검사해 여러 결과가 나올 수 있지만, if-elif는 하나의 덩어리라 조건이 맞아도 하나만 실행됩니다.'
  },
  // Hard
  {
    id: 7,
    difficulty: 'hard',
    type: 'multiple',
    question: '다음 중 조건이 겹칠 때 의도치 않게 두 문장이 모두 출력될 수 있는 구조는?',
    options: ['if - if - else', 'if - elif - else'],
    correctAnswer: 'if - if - else',
    concept: 'nested',
    explanation: '앞의 if가 참이어도 뒤의 if를 또 검사하기 때문에 두 번 출력될 위험이 있습니다.'
  },
  {
    id: 8,
    difficulty: 'hard',
    type: 'short',
    question: 'while 문에서 종료 조건을 빠뜨리면 어떤 문제가 발생하나요?',
    correctAnswer: ['무한', '무한루프', '멈추지', '끝나지'],
    concept: 'iteration',
    explanation: '조건이 항상 참(True)이 되어 프로그램이 멈추지 않는 무한 루프에 빠집니다.'
  },
  {
    id: 9,
    difficulty: 'hard',
    type: 'narrative',
    question: '"지각 기준 10분 전까지 도착"을 표현할 때 경계값(=) 처리가 중요한 이유는?',
    correctAnswer: ['포함', '미만', '이하', '기준', '1분'],
    concept: 'selection',
    explanation: '10분을 포함하느냐(<=) 안 하느냐(<)에 따라 지각 여부가 갈리기 때문입니다.'
  },
  {
    id: 10,
    difficulty: 'hard',
    type: 'multiple',
    question: '"비가 오거나(OR) 시간이 8시 20분 미만이면 버스를 탄다"를 코드로 옳게 표현한 것은?',
    options: ['rain AND time < 8:20', 'rain OR time < 8:20', 'rain NOT time > 8:20', 'rain == time'],
    correctAnswer: 'rain OR time < 8:20',
    concept: 'logic',
    explanation: '둘 중 하나만 만족해도 실행되어야 하므로 논리연산자 OR를 사용해야 합니다.'
  }
];

export const THEORY_CARDS = [
  {
    id: 'seq',
    title: '순차 구조 (Sequence)',
    summary: '위에서 아래로 차례대로!',
    content: '프로그램은 기본적으로 코드의 윗줄부터 아랫줄로 한 줄씩 실행됩니다. 등굣길에서 신발을 신고 -> 문을 열고 -> 엘리베이터를 타는 순서가 바뀌면 안 되는 것과 같습니다.',
    checkQuestion: '코드는 아래에서 위로 실행된다? (O/X)',
    checkAnswer: 'X'
  },
  {
    id: 'sel',
    title: '선택 구조 (Selection)',
    summary: '조건에 따라 갈림길!',
    content: 'if, elif, else를 사용해 상황(조건)에 따라 다른 코드를 실행합니다. "비가 오면 우산을 쓰고, 아니면 그냥 간다"처럼요.',
    checkQuestion: 'if 조건이 참이면 else 블록이 실행된다? (O/X)',
    checkAnswer: 'X'
  },
  {
    id: 'iter',
    title: '반복 구조 (Iteration)',
    summary: '조건이 맞을 때까지 계속!',
    content: 'while이나 for를 사용합니다. "학교에 도착할 때까지 1분씩 걷는다"처럼 특정 조건이 만족될 때까지 같은 행동을 반복합니다.',
    checkQuestion: 'while문은 조건이 참일 동안 계속 실행된다? (O/X)',
    checkAnswer: 'O'
  },
  {
    id: 'indent',
    title: '들여쓰기 (Indentation)',
    summary: '어디까지가 내 구역?',
    content: '파이썬 같은 언어에서는 들여쓰기(공백)로 코드의 소속을 정합니다. if문 안에 속한 코드인지, 아니면 if문이 끝나고 실행되는 코드인지 구분하는 핵심 규칙입니다.',
    checkQuestion: '들여쓰기는 코드 실행 결과에 영향을 주지 않는다? (O/X)',
    checkAnswer: 'X'
  }
];
