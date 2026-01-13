import { PuzzleStep, QuizQuestion, ThinkScenario } from './types';

export const PUZZLE_STEPS: PuzzleStep[] = [
  { 
    id: 'PADDING', 
    label: '패딩 (Padding)', 
    description: '블록 크기에 맞게 남는 공간 채우기', 
    iconName: 'Maximize',
    type: 'prep' 
  },
  { 
    id: 'SPLIT', 
    label: '블록 나누기 (Split)', 
    description: '평문을 정해진 크기의 블록으로 절단', 
    iconName: 'Scissors',
    type: 'prep' 
  },
  { 
    id: 'ASCII', 
    label: '아스키 변환 (ASCII)', 
    description: '문자를 컴퓨터가 이해하는 숫자로 변환', 
    iconName: 'Binary',
    type: 'process' 
  },
  { 
    id: 'BINARY', 
    label: '비트 변환 (To Bits)', 
    description: '숫자를 0과 1의 이진수로 변환', 
    iconName: 'Hash',
    type: 'process' 
  },
  { 
    id: 'KEY_PREP', 
    label: '키 준비 (Key Prep)', 
    description: '암호화 키를 블록 길이에 맞게 준비', 
    iconName: 'Key',
    type: 'process' 
  },
  { 
    id: 'XOR', 
    label: 'XOR 연산', 
    description: '데이터와 키를 배타적 논리합 수행', 
    iconName: 'X',
    type: 'math' 
  },
  { 
    id: 'CONNECT', 
    label: '블록 연결 (Connect)', 
    description: '암호화된 각 블록을 하나로 연결', 
    iconName: 'Link',
    type: 'output' 
  }
];

// The correct logical order for this educational simulation
export const CORRECT_ORDER = ['PADDING', 'SPLIT', 'ASCII', 'BINARY', 'KEY_PREP', 'XOR', 'CONNECT'];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "블록 암호에서 평문의 길이가 블록 크기의 배수가 아닐 때 사용하는 기법은?",
    options: ["해싱 (Hashing)", "패딩 (Padding)", "압축 (Compression)", "트리밍 (Trimming)"],
    correctIndex: 1,
    explanation: "패딩은 블록 암호화 수행 전, 평문의 길이를 블록 크기에 맞추기 위해 의미 없는 데이터를 채우는 과정입니다."
  },
  {
    id: 2,
    question: "XOR 연산의 특징으로 옳은 것은? (A XOR B = C)",
    options: ["C XOR B = A (복호화 가능)", "항상 0이 나온다", "항상 1이 나온다", "키 없이도 C를 해석할 수 있다"],
    correctIndex: 0,
    explanation: "XOR 연산은 같은 값으로 두 번 연산하면 원래 값으로 돌아오는 대칭적 성질(역연산)을 가집니다."
  },
  {
    id: 3,
    question: "'A' (ASCII 65)를 이진수로 변환하면?",
    options: ["01000001", "11110000", "00110011", "10000001"],
    correctIndex: 0,
    explanation: "65는 64(2^6) + 1(2^0)이므로 01000001 입니다."
  },
  {
    id: 4,
    question: "블록 암호화 과정의 올바른 첫 단계는 무엇인가요?",
    options: ["XOR 연산", "블록 연결", "블록 나누기 및 패딩", "키 삭제"],
    correctIndex: 2,
    explanation: "가장 먼저 긴 평문을 처리 가능한 단위(블록)로 나누고 길이를 맞추는 작업이 필요합니다."
  },
  {
    id: 5,
    question: "동일한 평문 블록과 동일한 키를 XOR 하면 결과는?",
    options: ["항상 다르다", "항상 같다", "랜덤이다", "알 수 없다"],
    correctIndex: 1,
    explanation: "XOR은 결정론적인 연산이므로 입력값들이 같다면 결과값도 항상 같습니다. (ECB 모드의 취약점 원인)"
  }
];

export const THINK_SCENARIOS: ThinkScenario[] = [
  {
    id: 'block_size',
    title: "블록 크기가 1바이트라면?",
    content: "현재 대부분의 강력한 암호(AES 등)는 128비트(16바이트) 이상의 블록 크기를 사용합니다. 만약 블록 크기를 1바이트(8비트)로 극단적으로 줄인다면 어떤 보안 문제가 생길까요?",
    question: "빈도 분석 공격에 대해 생각해보세요. 'e'나 'a' 같은 문자가 암호문에서도 티가 날까요?"
  },
  {
    id: 'no_padding',
    title: "패딩이 없다면?",
    content: "친구가 보내준 파일의 마지막 부분이 블록 크기보다 1바이트 모자랍니다. 패딩 과정 없이 억지로 암호화 함수에 넣으면 컴퓨터 내부에서는 어떤 일이 벌어질까요?",
    question: "메모리의 쓰레기 값(Garbage Value)이나 버퍼 오버런 문제와 연관지어 보세요."
  },
  {
    id: 'school_file',
    title: "학교 성적표 전송 설계",
    content: "선생님이 학생들에게 암호화된 성적표 파일을 전송하려 합니다. XOR 블록 암호 방식을 사용할 때, 학생마다 다른 키를 써야 할까요? 아니면 같은 키를 써도 될까요?",
    question: "키 배송 문제(Key Distribution Problem)와 기밀성 관점에서 고민해보세요."
  }
];