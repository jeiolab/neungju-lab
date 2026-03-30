import { BlockType, ETLBlock, QuizQuestion } from './types';

export const TOOLBOX_BLOCKS: Omit<ETLBlock, 'id'>[] = [
  {
    type: BlockType.LOAD,
    label: '데이터 로드',
    description: '소스(DB/파일)에서 원본 데이터를 가져옵니다.',
    iconName: 'Database',
  },
  {
    type: BlockType.CLEAN,
    label: '데이터 정제',
    description: '중복을 제거하고 누락된 값을 처리합니다.',
    iconName: 'Broom',
  },
  {
    type: BlockType.INTEGRATE,
    label: '데이터 통합',
    description: '여러 소스의 데이터를 하나로 합칩니다.',
    iconName: 'Unite', // Mapped to Combine or similar
  },
  {
    type: BlockType.REDUCE,
    label: '데이터 축소',
    description: '분석에 필요한 핵심 특성(Column)만 선택합니다.',
    iconName: 'Filter',
  },
  {
    type: BlockType.NORMALIZE,
    label: '데이터 변환',
    description: 'Min-Max 정규화(0~1 범위)를 수행합니다.',
    iconName: 'Scaling', // Mapped to maximize
  },
  {
    type: BlockType.TRAIN,
    label: 'AI 학습',
    description: '준비된 데이터를 머신러닝 모델에 주입합니다.',
    iconName: 'Brain',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "데이터 정제 없이 AI 모델을 학습시킬 때 발생하는 가장 큰 위험은?",
    options: ["모델 학습 속도가 너무 느려진다", "GIGO (Garbage In, Garbage Out)", "모델의 용량이 너무 커진다", "데이터 보안이 위협받는다"],
    correctAnswer: 1,
    explanation: "쓰레기(잘못된 데이터)가 들어가면 쓰레기(잘못된 결과)가 나옵니다. 품질 낮은 데이터는 낮은 성능의 모델을 만듭니다."
  },
  {
    id: 2,
    question: "Min-Max 정규화(Normalization)를 사용하는 이유는?",
    options: ["중복된 행을 제거하기 위해", "텍스트를 숫자로 변환하기 위해", "숫자 데이터의 범위를 일정하게(예: 0~1) 맞추기 위해", "결측치를 삭제하기 위해"],
    correctAnswer: 2,
    explanation: "특성(Feature) 간의 값의 범위(Scale) 차이가 너무 크면 모델이 큰 값에만 편향되어 학습될 수 있습니다."
  },
  {
    id: 3,
    question: "ETL 파이프라인에서 일반적으로 가장 먼저 수행해야 하는 단계는?",
    options: ["데이터 변환 (Transformation)", "데이터 정제 (Cleaning)", "데이터 추출/로드 (Extraction/Load)", "AI 학습 (Loading to AI)"],
    correctAnswer: 2,
    explanation: "데이터를 처리하려면 먼저 원본 소스에서 데이터를 가져오는(Load/Extract) 작업이 선행되어야 합니다."
  },
  {
    id: 4,
    question: "'데이터 축소(Reduction)'는 주로 무엇을 의미하나요?",
    options: ["압축을 통해 파일 크기 줄이기", "불필요한 특성을 제거하여 차원 줄이기 (Dimensionality Reduction)", "서버 비용 줄이기", "팀 규모 줄이기"],
    correctAnswer: 1,
    explanation: "데이터 축소는 분석과 관련 없는 속성이나 중복되는 특성을 제거하여 모델의 효율성을 높이는 과정입니다."
  },
  {
    id: 5,
    question: "데이터가 '원화(KRW)'와 '달러(USD)'로 섞여 있다면 분석 전 어떤 단계가 필요한가요?",
    options: ["통합 및 변환 (단위 통일)", "데이터 축소", "데이터 로드", "데이터 시각화"],
    correctAnswer: 0,
    explanation: "서로 다른 화폐 단위를 그대로 분석하면 값의 크기 차이로 인해 오류가 발생하므로, 단위를 하나로 통일하는 변환 과정이 필수입니다."
  }
];