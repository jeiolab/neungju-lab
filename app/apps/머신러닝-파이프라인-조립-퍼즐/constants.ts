import { Stage, QuizQuestion, DictionaryTerm } from './types';

export const PIPELINE_STAGES: Stage[] = [
  {
    id: 'step-1',
    title: '데이터 수집 및 전처리',
    description: '원석을 보석으로 다듬는 과정입니다.',
    iconName: 'Database',
    checklistItems: [
      '결측치(빈 값) 처리',
      '이상치(튀는 값) 제거',
      '하이퍼파라미터 튜닝', // 오답
      '데이터 라벨링',
      '모델 배포' // 오답
    ],
    correctChecklist: ['결측치(빈 값) 처리', '이상치(튀는 값) 제거', '데이터 라벨링']
  },
  {
    id: 'step-2',
    title: '모델 선택 및 학습',
    description: '데이터를 통해 패턴을 학습합니다.',
    iconName: 'BrainCircuit',
    checklistItems: [
      '적절한 알고리즘 선정',
      '학습 데이터로 파라미터 최적화',
      '사용자 피드백 수집', // 오답
      '손실 함수(Loss Function) 정의',
      '서버 구축' // 오답
    ],
    correctChecklist: ['적절한 알고리즘 선정', '학습 데이터로 파라미터 최적화', '손실 함수(Loss Function) 정의']
  },
  {
    id: 'step-3',
    title: '성능 평가',
    description: '모델이 얼마나 잘 맞추는지 시험합니다.',
    iconName: 'FlaskConical',
    checklistItems: [
      '테스트 데이터셋 활용',
      '정확도, 재현율 등 지표 확인',
      '학습 데이터 재사용', // 오답(위험)
      '과적합(Overfitting) 여부 점검',
      '데이터 크롤링' // 오답
    ],
    correctChecklist: ['테스트 데이터셋 활용', '정확도, 재현율 등 지표 확인', '과적합(Overfitting) 여부 점검']
  },
  {
    id: 'step-4',
    title: '적용 및 유지보수',
    description: '현실 세계 문제를 해결하고 개선합니다.',
    iconName: 'Rocket',
    checklistItems: [
      '웹/앱 서비스 연동',
      '실시간 데이터 모니터링',
      '모델 재학습 주기 설정',
      '특성 공학(Feature Engineering)', // 오답(주로 전처리 단계)
      '데이터 정규화' // 오답
    ],
    correctChecklist: ['웹/앱 서비스 연동', '실시간 데이터 모니터링', '모델 재학습 주기 설정']
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "머신러닝 파이프라인에서 가장 먼저 수행해야 하는 단계는?",
    options: ["모델 학습", "데이터 수집 및 전처리", "성능 평가", "서비스 배포"],
    correctAnswer: 1,
    explanation: "좋은 데이터가 없으면 좋은 모델도 없습니다(Garbage In, Garbage Out). 데이터 수집과 전처리가 최우선입니다.",
    relatedConcept: "데이터 수집 및 전처리"
  },
  {
    id: 2,
    question: "다음 중 '전처리' 과정에 해당하지 않는 것은?",
    options: ["결측치 채우기", "이상치 제거", "정규화/표준화", "최종 정확도 산출"],
    correctAnswer: 3,
    explanation: "최종 정확도 산출은 '성능 평가' 단계에서 수행합니다.",
    relatedConcept: "데이터 수집 및 전처리"
  },
  {
    id: 3,
    question: "테스트 데이터를 학습 과정에 사용하면 발생하는 문제는?",
    options: ["데이터 부족", "과적합 및 평가 신뢰도 하락", "학습 속도 저하", "모델 용량 증가"],
    correctAnswer: 1,
    explanation: "시험 문제(테스트 데이터)를 미리 보고 공부(학습)하는 것과 같아, 실력(일반화 성능)을 제대로 평가할 수 없습니다.",
    relatedConcept: "성능 평가"
  },
  {
    id: 4,
    question: "모델이 학습 데이터에서는 100점인데, 테스트 데이터에서는 50점이라면?",
    options: ["과소적합(Underfitting)", "과적합(Overfitting)", "최적화 완료", "데이터 부족"],
    correctAnswer: 1,
    explanation: "학습 데이터에만 너무 과하게 맞춰져서 새로운 데이터에 적응하지 못하는 '과적합' 상태입니다.",
    relatedConcept: "성능 평가"
  },
  {
    id: 5,
    question: "다음 중 지도학습(Supervised Learning)에 꼭 필요한 것은?",
    options: ["라벨(정답)이 있는 데이터", "보상 시스템", "군집화 알고리즘", "비정형 데이터만"],
    correctAnswer: 0,
    explanation: "지도학습은 문제와 정답(라벨)을 함께 주어 학습시키는 방식입니다.",
    relatedConcept: "모델 선택 및 학습"
  },
  {
    id: 6,
    question: "파이프라인 마지막 단계인 '유지보수'가 필요한 이유는?",
    options: ["데이터는 변하지 않기 때문에", "시간이 지나면 데이터 트렌드가 변할 수 있어서", "모델은 영구적이라서", "전처리를 다시 할 필요가 없어서"],
    correctAnswer: 1,
    explanation: "현실 세계의 데이터 분포는 시간이 지남에 따라 변하므로(Data Drift), 모델을 주기적으로 재학습해야 합니다.",
    relatedConcept: "적용 및 유지보수"
  },
  {
    id: 7,
    question: "데이터를 8:2로 나누는 일반적인 이유는?",
    options: ["8은 테스트, 2는 학습", "8은 학습, 2는 검증/테스트", "전처리 8, 학습 2", "의미 없는 숫자"],
    correctAnswer: 1,
    explanation: "대부분의 데이터를 학습에 쓰고, 일부(20% 등)를 남겨두어 본 적 없는 데이터에 대한 성능을 평가합니다.",
    relatedConcept: "모델 선택 및 학습"
  },
  {
    id: 8,
    question: "특성 공학(Feature Engineering)의 주된 목적은?",
    options: ["데이터 양 줄이기", "모델이 학습하기 좋은 형태로 데이터 변환", "하드웨어 성능 향상", "결과 시각화"],
    correctAnswer: 1,
    explanation: "날것의 데이터를 모델이 패턴을 잘 찾을 수 있는 유의미한 특징(Feature)으로 가공하는 과정입니다.",
    relatedConcept: "데이터 수집 및 전처리"
  },
  {
    id: 9,
    question: "하이퍼파라미터란?",
    options: ["모델이 학습하며 스스로 찾는 값", "사용자가 직접 설정해야 하는 설정 값", "결측치 값", "예측 결과 값"],
    correctAnswer: 1,
    explanation: "학습률, 트리의 깊이 등 사용자가 학습 전에 미리 정해주는 설정 값을 하이퍼파라미터라고 합니다.",
    relatedConcept: "모델 선택 및 학습"
  },
  {
    id: 10,
    question: "다음 시나리오 중 가장 위험한 것은?",
    options: ["이상치를 제거하고 학습했다.", "다양한 모델을 비교했다.", "전체 데이터를 몽땅 학습에 쓰고 평가했다.", "주기적으로 모델을 업데이트했다."],
    correctAnswer: 2,
    explanation: "전체 데이터를 학습에 쓰면, 새로운 데이터에 대해 모델이 잘 작동하는지(일반화) 검증할 방법이 없습니다.",
    relatedConcept: "성능 평가"
  }
];

export const DICTIONARY_DATA: DictionaryTerm[] = [
  { term: "전처리 (Preprocessing)", definition: "수집한 데이터를 분석에 적합한 형태로 다듬는 과정. 결측치 처리, 정규화 등이 포함됨.", category: "Preprocessing" },
  { term: "이상치 (Outlier)", definition: "정상적인 데이터 분포에서 크게 벗어난 값. 모델 성능을 떨어뜨리는 주범이 될 수 있음.", category: "Preprocessing" },
  { term: "과적합 (Overfitting)", definition: "모델이 학습 데이터에 너무 과하게 맞춰져서, 새로운 데이터에 대한 예측력이 떨어지는 현상.", category: "Model" },
  { term: "과소적합 (Underfitting)", definition: "모델이 너무 단순해서 데이터의 패턴을 제대로 학습하지 못한 상태.", category: "Model" },
  { term: "하이퍼파라미터 (Hyperparameter)", definition: "모델이 스스로 학습하지 못하고 사람이 직접 설정해줘야 하는 변수 (예: 학습률, 나무의 깊이).", category: "Parameter" },
  { term: "정확도 (Accuracy)", definition: "전체 예측 데이터 중 정답을 맞춘 비율. 가장 직관적인 평가지표.", category: "Model" },
  { term: "훈련/테스트 분할 (Train/Test Split)", definition: "데이터를 학습용과 평가용으로 나누는 것. 모델의 일반화 성능을 확인하기 위함.", category: "Preprocessing" },
  { term: "지도 학습 (Supervised Learning)", definition: "정답(Label)이 있는 데이터를 사용하여 모델을 학습시키는 방법.", category: "General" },
  { term: "비지도 학습 (Unsupervised Learning)", definition: "정답 없이 데이터의 특성이나 구조(패턴)를 스스로 학습하는 방법.", category: "General" },
  { term: "배치 (Deployment)", definition: "완성된 모델을 실제 서비스 환경에 적용하여 사용자가 이용할 수 있게 하는 단계.", category: "General" }
];