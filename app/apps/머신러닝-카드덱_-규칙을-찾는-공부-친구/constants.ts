import { ConceptCard, QuizQuestion, ThinkProblem } from './types';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'c1',
    title: '기계학습 (Machine Learning)',
    definition: '데이터에서 규칙을 스스로 찾아내는 컴퓨터 프로그램.',
    keywords: ['데이터', '규칙 발견', '학습'],
    example: '수천 장의 고양이 사진을 보고 고양이의 특징(귀 모양, 수염 등)을 스스로 익힘.',
    misconception: '기계학습은 인간처럼 스스로 의식을 갖는 것이다.',
    correction: '의식이 아니라, 수학적 패턴을 통계적으로 찾아내는 기술임.',
    checkQuestion: {
      question: '기계학습의 핵심 역할은?',
      options: ['규칙을 사람이 직접 입력하기', '데이터에서 패턴 찾기', '모든 경우의 수 암기하기'],
      answerIndex: 1,
      explanation: '기계학습은 사람이 규칙을 주입하는 것이 아니라, 데이터 속에서 패턴을 찾아냅니다.'
    }
  },
  {
    id: 'c2',
    title: '전통적 프로그래밍 vs 기계학습',
    definition: '사람이 규칙을 짜면 전통적, 기계가 규칙을 찾으면 기계학습.',
    keywords: ['규칙 입력(Rule-based)', '데이터 기반(Data-driven)'],
    example: '스팸 필터: "광고" 단어가 있으면 차단(전통적) vs 수만 개 메일 분석해 차단(기계학습).',
    misconception: '기계학습은 코드를 전혀 짤 필요가 없다.',
    correction: '학습할 모델(구조)을 만드는 코딩은 사람이 해야 함.',
    checkQuestion: {
      question: '다음 중 기계학습 방식은?',
      options: ['if-else 문으로 규칙 작성', '데이터를 넣어 모델 훈련', '답안지 미리 입력'],
      answerIndex: 1,
      explanation: '데이터를 통해 모델을 훈련시키는 것이 기계학습입니다.'
    }
  },
  {
    id: 'c3',
    title: '지도학습 (Supervised Learning)',
    definition: '문제와 정답(레이블)을 함께 주고 가르치는 방법.',
    keywords: ['문제+정답', '지도(Teaching)', '예측'],
    example: '개 사진에 "개", 고양이 사진에 "고양이"라고 이름표를 붙여 학습시킴.',
    misconception: '지도학습은 선생님이 옆에 있어야 한다.',
    correction: '여기서 "지도"는 정답 데이터(레이블)가 있다는 뜻임.',
    checkQuestion: {
      question: '지도학습에 반드시 필요한 것은?',
      options: ['레이블(정답)', '보상', '규칙'],
      answerIndex: 0,
      explanation: '지도학습은 입력 데이터와 그에 해당하는 정답(레이블)이 쌍으로 필요합니다.'
    }
  },
  {
    id: 'c4',
    title: '비지도학습 (Unsupervised Learning)',
    definition: '정답 없이 데이터의 특징만 보고 스스로 그룹을 짓는 방법.',
    keywords: ['정답 없음', '군집화', '특징 발견'],
    example: '비슷한 구매 성향을 가진 고객끼리 묶어 그룹 만들기(정답 그룹 없음).',
    misconception: '비지도학습은 아무것도 배우지 못한다.',
    correction: '정답은 없지만 데이터 간의 유사성이나 구조를 배움.',
    checkQuestion: {
      question: '비지도학습의 대표적인 목표는?',
      options: ['미래 값 예측', '데이터 그룹핑(군집화)', '보상 최대화'],
      answerIndex: 1,
      explanation: '비지도학습은 데이터의 패턴을 찾아 비슷한 것끼리 묶는 군집화 등에 쓰입니다.'
    }
  },
  {
    id: 'c5',
    title: '강화학습 (Reinforcement Learning)',
    definition: '행동에 대한 보상과 처벌을 통해 점수를 최대화하는 방법.',
    keywords: ['에이전트', '행동', '보상'],
    example: '알파고가 바둑을 두며 승리(보상)하는 수를 찾아가는 과정.',
    misconception: '강화학습은 데이터가 전혀 필요 없다.',
    correction: '행동의 결과로 얻어지는 경험(상호작용 데이터)이 필요함.',
    checkQuestion: {
      question: '강화학습의 핵심 메커니즘은?',
      options: ['정답 맞추기', '시행착오와 보상', '데이터 분류'],
      answerIndex: 1,
      explanation: '강화학습은 시행착오를 겪으며 보상을 많이 받는 쪽으로 행동을 수정합니다.'
    }
  },
  {
    id: 'c6',
    title: '레이블 (Label)',
    definition: '지도학습에서 우리가 맞혀야 할 "정답" 또는 "목표 값".',
    keywords: ['정답', '타겟', 'Y값'],
    example: '주택 가격 예측에서 "실제 주택 가격"이 레이블임.',
    misconception: '모든 데이터에는 레이블이 있다.',
    correction: '현실 데이터 대부분은 레이블이 없어서(비지도) 사람이 붙여줘야 함.',
    checkQuestion: {
      question: '스팸 메일 분류에서 "레이블"은?',
      options: ['이메일 내용', '보낸 사람', '스팸 여부(O/X)'],
      answerIndex: 2,
      explanation: '우리가 맞히고자 하는 정답인 "스팸인지 아닌지"가 레이블입니다.'
    }
  },
  {
    id: 'c7',
    title: '특성 (Feature)',
    definition: '예측을 위해 사용하는 데이터의 재료(힌트).',
    keywords: ['입력 변수', '속성', 'X값'],
    example: '오렌지를 구분할 때 "색깔", "무게", "표면 질감" 등이 특성.',
    misconception: '특성은 많을수록 무조건 좋다.',
    correction: '불필요한 특성은 오히려 학습을 방해(잡음)할 수 있음.',
    checkQuestion: {
      question: '학생 성적 예측 시 적절한 특성이 아닌 것은?',
      options: ['지난 시험 점수', '공부 시간', '학생의 이름'],
      answerIndex: 2,
      explanation: '이름은 성적과 인과관계가 없는 단순 식별자이므로 특성으로 부적절합니다.'
    }
  },
  {
    id: 'c8',
    title: '분류 (Classification)',
    definition: '지도학습 중, 몇 가지 정해진 클래스(종류) 중 하나를 고르는 것.',
    keywords: ['범주형', '선택', 'O/X'],
    example: '이 사진이 강아지냐? 고양이냐? (둘 중 하나 선택)',
    misconception: '숫자를 맞히는 건 모두 분류다.',
    correction: '연속적인 숫자(예: 85점, 1억 원)를 맞히는 건 회귀임.',
    checkQuestion: {
      question: '다음 중 분류 문제는?',
      options: ['내일 기온 예측(25.5도)', '암 환자 여부 진단(양성/음성)', '아파트 가격 예측'],
      answerIndex: 1,
      explanation: '양성/음성과 같이 정해진 범주 중 하나를 선택하는 것이 분류입니다.'
    }
  },
  {
    id: 'c9',
    title: '회귀 (Regression)',
    definition: '지도학습 중, 연속적인 숫자 값을 예측하는 것.',
    keywords: ['연속값', '수치 예측', '경향성'],
    example: '공부 시간에 따른 시험 점수(0~100점) 예측.',
    misconception: '회귀는 과거로 돌아간다는 뜻이다.',
    correction: '통계 용어에서 유래했으나, 머신러닝에서는 "수치 예측"을 의미함.',
    checkQuestion: {
      question: '다음 중 회귀 문제는?',
      options: ['합격/불합격 예측', '배달 소요 시간 예측', '동물 종류 맞히기'],
      answerIndex: 1,
      explanation: '시간, 가격, 온도 등 연속적인 숫자를 맞히는 것은 회귀입니다.'
    }
  },
  {
    id: 'c10',
    title: '군집화 (Clustering)',
    definition: '비지도학습의 대표 유형. 비슷한 데이터끼리 덩어리로 묶는 것.',
    keywords: ['그룹핑', '유사도', 'K-Means'],
    example: '뉴스 기사를 주제별(정치, 경제, 스포츠)로 자동 분류하기.',
    misconception: '분류(Classification)와 같다.',
    correction: '분류는 정답(레이블)이 있고, 군집화는 정답 없이 묶는 것.',
    checkQuestion: {
      question: '군집화가 사용되는 사례는?',
      options: ['고객 세분화(Segmentation)', '내일 날씨 맞히기', '손글씨 숫자 인식'],
      answerIndex: 0,
      explanation: '고객의 특성에 따라 비슷한 그룹으로 나누는 것이 군집화입니다.'
    }
  },
  {
    id: 'c11',
    title: '훈련 데이터와 테스트 데이터',
    definition: '공부할 때 쓰는 문제집(훈련)과 시험 칠 때 쓰는 문제집(테스트).',
    keywords: ['학습용', '평가용', '분리'],
    example: '교과서 문제로 공부하고(훈련), 수능 문제로 실력 확인(테스트).',
    misconception: '모든 데이터를 학습에 다 쓰는 게 좋다.',
    correction: '그러면 실전에서 잘하는지(일반화) 평가할 수 없음.',
    checkQuestion: {
      question: '테스트 데이터의 목적은?',
      options: ['모델을 훈련시키기 위해', '모델의 성능을 평가하기 위해', '데이터 양을 늘리기 위해'],
      answerIndex: 1,
      explanation: '테스트 데이터는 학습에 사용하지 않고, 오직 성능 평가용으로만 씁니다.'
    }
  },
  {
    id: 'c12',
    title: '일반화 (Generalization)',
    definition: '학습하지 않은 새로운 데이터도 잘 맞히는 능력.',
    keywords: ['응용력', '실전 성능', '과적합 방지'],
    example: '문제집만 달달 외운 학생은 변형 문제(새로운 데이터)를 못 풂.',
    misconception: '훈련 데이터 점수가 100점이면 최고다.',
    correction: '훈련만 잘하고 실전을 못하는 "과적합(Overfitting)" 상태일 수 있음.',
    checkQuestion: {
      question: '일반화 성능이 좋다는 뜻은?',
      options: ['훈련 데이터만 잘 맞힘', '새로운 데이터도 잘 맞힘', '데이터를 외워버림'],
      answerIndex: 1,
      explanation: '배우지 않은 새로운 데이터에 대해서도 올바른 결과를 내는 것이 일반화입니다.'
    }
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Easy
  {
    id: 'q1',
    difficulty: 'easy',
    relatedConceptId: 'c1',
    question: '기계학습이 전통적 프로그래밍과 다른 점은?',
    type: 'multiple',
    options: ['사람이 규칙을 입력한다', '데이터에서 규칙을 찾는다', '규칙이 필요 없다'],
    correctAnswer: '데이터에서 규칙을 찾는다',
    explanation: '기계학습은 데이터 기반으로 패턴(규칙)을 학습합니다.',
    misconceptionType: '전통적/ML 혼동'
  },
  {
    id: 'q2',
    difficulty: 'easy',
    relatedConceptId: 'c3',
    question: '정답(레이블)이 있는 데이터를 학습하는 방법은?',
    type: 'multiple',
    options: ['지도학습', '비지도학습', '강화학습'],
    correctAnswer: '지도학습',
    explanation: '문제와 정답을 함께 주는 것은 "지도"학습입니다.',
    misconceptionType: '지도/비지도 혼동'
  },
  {
    id: 'q3',
    difficulty: 'easy',
    relatedConceptId: 'c6',
    question: '다음 중 "특성(Feature)"에 해당하는 것은?',
    type: 'multiple',
    options: ['아파트 가격(예측 목표)', '아파트 평수(입력 정보)', '아파트 주소(식별자)'],
    correctAnswer: '아파트 평수(입력 정보)',
    explanation: '예측에 도움을 주는 입력 정보가 특성입니다. 가격은 레이블입니다.',
    misconceptionType: '특성/레이블 혼동'
  },
  // Normal
  {
    id: 'q4',
    difficulty: 'normal',
    relatedConceptId: 'c8',
    question: '이메일이 스팸인지 아닌지 구분하는 문제는 어떤 유형인가?',
    type: 'multiple',
    options: ['회귀', '분류', '군집화'],
    correctAnswer: '분류',
    explanation: '스팸/정상 두 가지 범주 중 하나를 선택하므로 분류입니다.',
    misconceptionType: '분류/회귀 혼동'
  },
  {
    id: 'q5',
    difficulty: 'normal',
    relatedConceptId: 'c9',
    question: '내일의 최고 기온(섭씨)을 예측하는 문제는?',
    type: 'multiple',
    options: ['분류', '회귀', '강화학습'],
    correctAnswer: '회귀',
    explanation: '기온은 연속적인 숫자 값이므로 회귀 문제입니다.',
    misconceptionType: '분류/회귀 혼동'
  },
  {
    id: 'q6',
    difficulty: 'normal',
    relatedConceptId: 'c5',
    question: '강화학습에서 에이전트가 학습하는 기준은 무엇인가?',
    type: 'short', // 단답형 시뮬레이션 (여기서는 객관식으로 처리하되 UI는 다르게 가능)
    options: ['보상', '정답표', '데이터 크기'],
    correctAnswer: '보상',
    explanation: '강화학습은 행동에 따른 보상을 최대화하는 방향으로 학습합니다.',
    misconceptionType: '강화/지도 혼동'
  },
  // Hard (Challenge)
  {
    id: 'q7',
    difficulty: 'hard',
    relatedConceptId: 'c12',
    question: '훈련 데이터에서는 100점인데 테스트 데이터에서는 50점인 상태를 무엇이라 하는가?',
    type: 'multiple',
    options: ['일반화(Generalization)', '과소적합(Underfitting)', '과적합(Overfitting)'],
    correctAnswer: '과적합(Overfitting)',
    explanation: '훈련 데이터에만 너무 익숙해져서 새로운 데이터(테스트)를 못 맞히는 상태입니다.',
    misconceptionType: '일반화/과적합 혼동'
  },
  {
    id: 'q8',
    difficulty: 'hard',
    relatedConceptId: 'c4',
    question: '고객 데이터를 구매 패턴에 따라 5개 그룹으로 나누려 한다. 정답은 없다. 어떤 학습법을 써야 할까?',
    type: 'multiple',
    options: ['분류(Classification)', '군집화(Clustering)', '회귀(Regression)'],
    correctAnswer: '군집화(Clustering)',
    explanation: '정답(레이블) 없이 유사한 것끼리 묶는 것은 비지도학습의 군집화입니다.',
    misconceptionType: '분류/군집화 혼동'
  },
  {
    id: 'q9',
    difficulty: 'hard',
    relatedConceptId: 'c11',
    question: '모델의 최종 성능을 평가하기 위해 한 번도 보여주지 않은 데이터를 무엇이라 하는가?',
    type: 'multiple',
    options: ['훈련 데이터', '검증 데이터', '테스트 데이터'],
    correctAnswer: '테스트 데이터',
    explanation: '최종 성능 평가는 학습에 참여하지 않은 테스트 데이터로 수행합니다.',
    misconceptionType: '데이터 분할 오해'
  },
  {
    id: 'q10',
    difficulty: 'hard',
    relatedConceptId: 'c2',
    question: '전통적 프로그래밍 방식이 기계학습보다 더 유리한 경우는?',
    type: 'multiple',
    options: ['규칙이 명확하고 간단할 때', '데이터가 매우 많고 복잡할 때', '규칙을 정의하기 어려울 때'],
    correctAnswer: '규칙이 명확하고 간단할 때',
    explanation: '규칙이 간단하고 명확하다면 굳이 데이터를 모아 학습시킬 필요 없이 직접 코딩하는 게 빠릅니다.',
    misconceptionType: 'ML 만능주의'
  }
];

export const THINK_PROBLEMS: ThinkProblem[] = [
  {
    id: 'th1',
    type: 'condition',
    title: '조건 바꾸기',
    description: '만약 "고양이 사진 분류기"에 호랑이 사진을 입력하면 어떻게 될까? (데이터 분포의 차이 관점에서 서술하시오)'
  },
  {
    id: 'th2',
    type: 'counterexample',
    title: '반례 찾기',
    description: '지도학습이 항상 정답일까? 지도학습을 사용하기 어렵거나 불가능한 실제 상황을 하나 찾아보세요.'
  },
  {
    id: 'th3',
    type: 'design',
    title: '적용 설계하기',
    description: '학교 매점의 빵 판매량을 예측하려고 한다. 어떤 "특성(Feature)" 3가지를 수집하면 도움이 될까?'
  }
];
