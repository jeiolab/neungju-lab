import { Difficulty, StepType, ProcessingStep, QuizQuestion } from './types';

export const STEPS: ProcessingStep[] = [
  {
    id: 's1',
    type: StepType.DEFINE_PROBLEM,
    label: '1. 문제 정의',
    description: '무엇을 분석할지 목표를 정합니다.',
    reasonOptions: ['분석 목표가 명확해야 필요한 데이터를 알 수 있어서', '데이터 양을 줄이기 위해서', '컴퓨터 속도를 높이기 위해서'],
    correctReasonIndex: 0
  },
  {
    id: 's2',
    type: StepType.EXPLORE_DATA,
    label: '2. 데이터 탐색',
    description: '데이터의 생김새와 문제를 훑어봅니다.',
    reasonOptions: ['바로 수정하기 귀찮아서', '데이터의 패턴과 문제점을 먼저 파악해야 올바른 처리가 가능해서', '예쁜 그래프를 그리기 위해서'],
    correctReasonIndex: 1
  },
  {
    id: 's3',
    type: StepType.HANDLE_MISSING,
    label: '3. 결측치 처리',
    description: '비어있는 값을 채우거나 지웁니다.',
    options: ['평균값 대치', '행 삭제', '0으로 채우기'],
    reasonOptions: ['빈 칸이 있으면 계산 오류가 나거나 분석 결과가 왜곡되므로', '데이터가 너무 적어보여서', '색깔을 칠하기 위해서'],
    correctReasonIndex: 0
  },
  {
    id: 's4',
    type: StepType.HANDLE_OUTLIERS,
    label: '4. 이상치 처리',
    description: '너무 크거나 작은 튀는 값을 정리합니다.',
    options: ['제거', '상한값으로 변경', '유지'],
    reasonOptions: ['특이한 값은 항상 나쁜 것이라', '전체 평균과 통계를 심각하게 왜곡할 수 있어서', '그래프가 안 예뻐서'],
    correctReasonIndex: 1
  },
  {
    id: 's5',
    type: StepType.REMOVE_DUPLICATES,
    label: '5. 중복 제거',
    description: '똑같은 데이터가 여러 번 들어간 것을 지웁니다.',
    reasonOptions: ['용량을 줄이려고', '동일 데이터 중복 집계로 인한 결과 뻥튀기를 막기 위해', '타이핑이 힘들어서'],
    correctReasonIndex: 1
  },
  {
    id: 's6',
    type: StepType.STANDARDIZE_FORMAT,
    label: '6. 형식 통일',
    description: '날짜나 단위 형식을 하나로 맞춥니다.',
    reasonOptions: ['날짜 계산과 비교 분석을 쉽게 하기 위해', '글씨체를 예쁘게 하려고', '영어 공부를 위해'],
    correctReasonIndex: 0
  },
  {
    id: 's7',
    type: StepType.INTEGRATE_DATA,
    label: '7. 데이터 통합',
    description: '여러 곳의 데이터를 하나로 합칩니다.',
    reasonOptions: ['파일 갯수를 줄이려고', '흩어진 정보를 종합적으로 분석하기 위해', '친구랑 같이 보려고'],
    correctReasonIndex: 1
  },
  {
    id: 's8',
    type: StepType.SUMMARIZE,
    label: '8. 요약 및 저장',
    description: '깨끗해진 데이터를 저장하고 요약합니다.',
    reasonOptions: ['분석 단계로 넘어가기 위한 최종 준비', '이제 놀기 위해서', '선생님께 제출하려고'],
    correctReasonIndex: 0
  }
];

export const CONCEPTS = [
  { title: "전처리(Preprocessing)", content: "원시 데이터(Raw Data)를 분석 목적에 맞게 가공하여 품질을 높이는 과정. 'Garbage In, Garbage Out'을 막기 위해 필수적입니다." },
  { title: "결측치(Missing Value)", content: "데이터 수집 오류 등으로 값이 비어있는 상태(Null, NaN). 삭제하거나 평균/중앙값 등으로 채워넣습니다." },
  { title: "이상치(Outlier)", content: "정상 범위에서 크게 벗어난 값. 센서 오작동일 수도 있고, 실제 특이 현상일 수도 있으므로 탐색 후 처리합니다." },
  { title: "데이터 정제 순서", content: "일반적으로 [탐색 -> 결측치/이상치 처리 -> 정규화 -> 통합] 순으로 진행하지만, 상황에 따라 유연하게 조정합니다." }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "데이터 전처리를 수행하는 가장 큰 이유는 무엇인가요?",
    options: ["데이터 용량을 늘리기 위해", "분석 결과의 신뢰성을 높이기 위해", "데이터를 암호화하기 위해", "그래프 색상을 바꾸기 위해"],
    correctIndex: 1,
    explanation: "전처리는 데이터의 품질을 높여 분석 결과가 왜곡되지 않도록 합니다 (GIGO 원칙).",
    difficulty: Difficulty.EASY,
    conceptTag: "전처리 목적"
  },
  {
    id: 2,
    question: "데이터 탐색(EDA)을 결측치 처리보다 먼저 하는 것이 좋은 이유는?",
    options: ["탐색이 더 쉽기 때문에", "데이터의 분포를 보고 결측치 처리 방법(삭제 vs 대치)을 결정해야 하므로", "알파벳 순서라서", "상관없다"],
    correctIndex: 1,
    explanation: "데이터의 패턴을 모르고 무작정 평균으로 채우거나 삭제하면 중요한 정보를 잃을 수 있습니다.",
    difficulty: Difficulty.NORMAL,
    conceptTag: "순서"
  },
  {
    id: 3,
    question: "PM2.5 수치가 9999로 찍힌 데이터가 있습니다. 가장 적절한 해석은?",
    options: ["실제로 미세먼지가 엄청난 날이다", "센서 오류나 기록 시스템의 기본값일 가능성이 높은 이상치다", "미래의 데이터다", "무시하고 평균에 포함한다"],
    correctIndex: 1,
    explanation: "9999 같은 극단값은 보통 시스템 오류값(Default Error Code)인 경우가 많아 이상치로 처리해야 합니다.",
    difficulty: Difficulty.NORMAL,
    conceptTag: "이상치"
  }
];