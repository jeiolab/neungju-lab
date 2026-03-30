import { BlockType, PipelineBlock, Scenario, QuizQuestion } from './types';

export const ALL_BLOCKS: PipelineBlock[] = [
  { id: 'b1', type: BlockType.SENSOR, description: '현실 세계의 데이터를 감지 (GPS, 온도 등)' },
  { id: 'b2', type: BlockType.APP_LOG, description: '사용자의 행동 기록 수집' },
  { id: 'b3', type: BlockType.TRANSMISSION, description: '네트워크를 통해 데이터 이동 (5G/WiFi)' },
  { id: 'b4', type: BlockType.STORAGE, description: '대용량 데이터를 클라우드에 저장' },
  { id: 'b5', type: BlockType.CLEANING, description: '오류 제거 및 데이터 형식 통일' },
  { id: 'b6', type: BlockType.ANALYSIS, description: '데이터의 패턴과 통계 분석' },
  { id: 'b7', type: BlockType.TRAINING, description: '과거 데이터로 AI 모델 학습' },
  { id: 'b8', type: BlockType.INFERENCE, description: '새로운 데이터에 대한 판단/예측' },
  { id: 'b9', type: BlockType.FEEDBACK, description: '사용자에게 결과 제공 및 행동 유도' },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'bus-prediction',
    title: '버스 도착 예측',
    description: '실시간 버스 위치를 기반으로 언제 도착할지 예측하는 서비스',
    difficulty: 1,
    context: 'GPS 위치 데이터가 이동하여 도착 시간을 계산하는 과정',
    correctSequence: [
      BlockType.SENSOR,
      BlockType.TRANSMISSION,
      BlockType.STORAGE,
      BlockType.CLEANING,
      BlockType.ANALYSIS, // 트래픽 패턴 분석
      BlockType.TRAINING, // 소요 시간 모델 학습
      BlockType.INFERENCE, // 현재 위치 기반 도착 시간 예측
      BlockType.FEEDBACK  // 앱에 시간 표시
    ]
  },
  {
    id: 'health-alert',
    title: '건강 이상 알림',
    description: '스마트워치 심박수를 분석하여 위급 상황 시 알림 발송',
    difficulty: 2,
    context: '생체 신호를 수집하여 이상 징후를 즉시 파악하는 과정',
    correctSequence: [
      BlockType.SENSOR,
      BlockType.TRANSMISSION,
      BlockType.STORAGE,
      BlockType.ANALYSIS, // 평소 심박수 패턴 분석
      BlockType.INFERENCE, // 현재 심박수 이상 여부 판단
      BlockType.FEEDBACK  // 경고 알림 전송
    ]
  },
  {
    id: 'custom-learning',
    title: 'AI 맞춤형 학습',
    description: '학생의 문제 풀이 기록을 분석해 취약점 보완 문제 추천',
    difficulty: 2,
    context: '학습 로그를 쌓아 개인화된 추천을 제공하는 과정',
    correctSequence: [
      BlockType.APP_LOG,
      BlockType.TRANSMISSION,
      BlockType.STORAGE,
      BlockType.CLEANING,
      BlockType.TRAINING, // 학생 수준별 패턴 학습
      BlockType.INFERENCE, // 다음 추천 문제 결정
      BlockType.FEEDBACK  // 문제 화면 제시
    ]
  },
  {
    id: 'disaster-detection',
    title: '산불/재난 감지',
    description: 'CCTV 영상과 센서를 융합하여 산불 발생 조기 감지',
    difficulty: 3,
    context: '영상 및 환경 센서 데이터를 복합적으로 분석하는 과정',
    correctSequence: [
      BlockType.SENSOR, // 열화상/연기 센서
      BlockType.TRANSMISSION,
      BlockType.STORAGE,
      BlockType.CLEANING, // 노이즈 제거
      BlockType.ANALYSIS, // 환경 데이터 분석
      BlockType.TRAINING, // 화재 패턴 학습
      BlockType.INFERENCE, // 화재 확률 계산
      BlockType.FEEDBACK  // 소방서 자동 신고
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '데이터 전처리(Cleaning)' 단계가 필요한 이유로 가장 적절한 것은?",
    options: ["데이터 용량을 늘리기 위해", "중복되거나 잘못된 데이터를 수정하여 AI 정확도를 높이기 위해", "데이터를 암호화하기 위해", "데이터 전송 속도를 늦추기 위해"],
    correctAnswer: 1,
    explanation: "데이터 정제(Cleaning)는 결측치나 이상치를 제거하여 모델 학습의 품질을 높이는 필수 과정입니다."
  },
  {
    id: 2,
    question: "클라우드 컴퓨팅이 빅데이터 처리에 적합한 이유는?",
    options: ["인터넷 연결이 필요 없어서", "유연한 저장 공간과 강력한 연산 능력을 빌려 쓸 수 있어서", "개인 PC보다 보안이 약해서", "데이터를 영구적으로 삭제할 수 있어서"],
    correctAnswer: 1,
    explanation: "클라우드는 필요에 따라 자원을 확장할 수 있어 방대한 빅데이터 처리에 효율적입니다."
  },
  {
    id: 3,
    question: "AI 모델 학습(Training)과 추론(Inference)의 차이점은?",
    options: ["학습은 데이터를 삭제하는 것이고, 추론은 복구하는 것이다.", "학습은 규칙을 만드는 과정이고, 추론은 그 규칙으로 새로운 데이터를 판단하는 것이다.", "차이가 없다.", "추론이 먼저 일어나고 학습이 나중에 일어난다."],
    correctAnswer: 1,
    explanation: "학습(Training)을 통해 모델(지능)을 만들고, 추론(Inference)을 통해 실전 데이터에 대한 답을 냅니다."
  },
  {
    id: 4,
    question: "IoT(사물인터넷) 센서가 수집하지 않는 데이터 유형은?",
    options: ["온도 및 습도", "위치 정보(GPS)", "사용자의 마음(감정)을 직접 독심술로 읽기", "CCTV 영상"],
    correctAnswer: 2,
    explanation: "IoT 센서는 물리적인 신호(빛, 소리, 온도 등)를 감지합니다. 독심술은 불가능하며 생체 신호로 추정만 가능합니다."
  },
  {
    id: 5,
    question: "초연결 사회(Hyper-connected Society)의 특징이 아닌 것은?",
    options: ["사람과 사물, 공간이 네트워크로 연결된다.", "데이터가 실시간으로 생성되고 공유된다.", "모든 정보가 오프라인 문서로만 관리된다.", "언제 어디서나 인터넷 접속이 가능하다."],
    correctAnswer: 2,
    explanation: "초연결 사회는 디지털 네트워크를 통해 모든 것이 연결되는 사회를 의미합니다."
  },
  // Additional questions to reach 10 could be added here
];

export const REFLECTION_QUESTIONS = [
  "내가 설계한 서비스에서 개인정보가 유출될 위험이 있는 단계는 어디인가요?",
  "만약 센서가 고장나서 잘못된 데이터를 보낸다면, AI는 어떤 판단을 하게 될까요?",
  "이 서비스가 도입되었을 때 혜택을 보는 사람과 소외될 수 있는 사람은 누구일까요?"
];
