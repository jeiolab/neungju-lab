import { ConceptCard, CaseStudy, QuizQuestion } from './types';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'c1',
    title: '비지도학습 (Unsupervised Learning)',
    definition: '정답(Label)이 없는 데이터를 학습하여 데이터 자체의 패턴이나 구조를 발견하는 방법',
    detail: '지도학습이 "선생님이 정답을 알려주는 수업"이라면, 비지도학습은 "스스로 규칙을 찾아내는 탐험"입니다. 예측보다는 해석과 탐색이 주 목적입니다.',
    checkQuestion: {
      q: '비지도학습의 핵심 특징으로 가장 적절한 것은?',
      options: ['정답(Label)이 주어진다', '미래 값을 정확히 예측한다', '데이터의 숨겨진 구조를 찾는다', '오차를 계산하여 수정한다'],
      answer: 2
    }
  },
  {
    id: 'c2',
    title: '군집화 (Clustering)',
    definition: '유사한 특성을 가진 데이터끼리 그룹으로 묶는 기법',
    detail: '비슷한 것끼리 모으는 것입니다. 예를 들어, 뉴스 기사를 주제별로 묶거나, 고객을 구매 패턴별로 그룹핑할 때 사용합니다.',
    checkQuestion: {
      q: '군집화의 예시가 아닌 것은?',
      options: ['고객 세분화', '뉴스 기사 분류', '비슷한 유전자 그룹 찾기', '이메일 스팸 여부 판별(O/X)'],
      answer: 3
    }
  },
  {
    id: 'c3',
    title: '밀도 추정 (Density Estimation)',
    definition: '데이터가 어디에 많이 모여 있는지 확률 분포를 추정하는 것',
    detail: '데이터가 집중된 곳과 희소한 곳을 파악합니다. 이를 통해 데이터가 생성되는 확률적 모델을 이해할 수 있습니다.',
    checkQuestion: {
      q: '밀도 추정이 주로 활용되는 분야는?',
      options: ['이상치 탐지', '이미지 분류', '텍스트 번역', '강화학습'],
      answer: 0
    }
  },
  {
    id: 'c4',
    title: '이상치 탐지 (Anomaly Detection)',
    definition: '보통의 패턴에서 크게 벗어난 희귀한 데이터를 찾아내는 것',
    detail: '대부분의 데이터(정상)와 다른 특이점을 찾습니다. 신용카드 사기 거래 탐지나 공장 설비 고장 예측에 쓰입니다.',
    checkQuestion: {
      q: '이상치 탐지의 핵심 가정은?',
      options: ['이상치는 정상 데이터와 매우 비슷하다', '이상치는 정상 데이터보다 빈도가 훨씬 적다', '이상치는 항상 라벨이 있다', '모든 데이터는 이상치일 수 있다'],
      answer: 1
    }
  },
  {
    id: 'c5',
    title: '차원 축소 (Dimensionality Reduction)',
    definition: '정보 손실을 최소화하며 데이터의 복잡도(변수 개수)를 줄이는 것',
    detail: '너무 많은 특징(Feature)은 학습을 방해할 수 있습니다. 중요한 핵심 특징만 남겨 데이터를 시각화하거나 압축할 때 사용합니다.',
    checkQuestion: {
      q: '차원 축소의 장점이 아닌 것은?',
      options: ['시각화가 용이해진다', '계산 효율이 좋아진다', '데이터의 모든 세부 정보를 보존한다', '노이즈를 제거할 수 있다'],
      answer: 2
    }
  },
  {
    id: 'c6',
    title: 'K-평균 (K-Means)',
    definition: '데이터를 K개의 중심점(Centroid)을 기준으로 묶는 대표적인 군집화 알고리즘',
    detail: '각 데이터에서 가장 가까운 중심점을 찾아 그룹을 할당하고, 중심점을 다시 계산하는 과정을 반복합니다.',
    checkQuestion: {
      q: 'K-Means 알고리즘에서 사용자가 미리 정해야 하는 것은?',
      options: ['데이터의 개수', '학습률', '그룹의 개수(K)', '정답 라벨'],
      answer: 2
    }
  },
  {
    id: 'c7',
    title: '연관 규칙 (Association Rules)',
    definition: '데이터 항목 간의 "If-Then" 관계를 찾아내는 것',
    detail: '"맥주를 사는 사람은 기저귀도 산다"와 같이 장바구니 분석에 주로 쓰입니다.',
    checkQuestion: {
      q: '연관 규칙 학습의 대표적인 사례는?',
      options: ['장바구니 분석', '손글씨 인식', '주가 예측', '얼굴 인식'],
      answer: 0
    }
  },
  {
    id: 'c8',
    title: '주성분 분석 (PCA)',
    definition: '데이터의 분산(퍼짐)을 가장 잘 설명하는 새로운 축을 찾는 차원 축소 기법',
    detail: '데이터를 가장 잘 표현하는 뼈대(주성분)를 찾아 투영하여 차원을 줄입니다.',
    checkQuestion: {
      q: 'PCA의 주 목적은?',
      options: ['데이터 개수 늘리기', '데이터 차원(변수) 줄이기', '데이터 라벨링하기', '결측치 채우기'],
      answer: 1
    }
  }
];

export const CASES: CaseStudy[] = [
  {
    id: 'cs1',
    title: '스트리밍 서비스 취향 분석',
    icon: 'music',
    description: '수백만 명의 청취 기록이 있습니다. 어떤 장르를 좋아하는지 라벨은 없지만, 비슷한 곡을 듣는 사람들을 묶고 싶습니다.',
    attributes: ['나이/성별', '청취 시간대', '스킵한 곡 목록', '재생한 곡의 템포(BPM)', '곡의 가사 감성', '사용자 주소'],
    correctAttributes: ['청취 시간대', '스킵한 곡 목록', '재생한 곡의 템포(BPM)', '곡의 가사 감성']
  },
  {
    id: 'cs2',
    title: '의류 사이즈 표준화',
    icon: 'shirt',
    description: '사람들의 신체 치수 데이터는 있지만, S/M/L 라벨은 없습니다. 새로운 사이즈 체계를 만들기 위해 사람들을 그룹핑해야 합니다.',
    attributes: ['키', '어깨 너비', '좋아하는 색상', '허리 둘레', '구매 빈도', '팔 길이'],
    correctAttributes: ['키', '어깨 너비', '허리 둘레', '팔 길이']
  },
  {
    id: 'cs3',
    title: '공장 불량품 탐지',
    icon: 'factory',
    description: '매일 수만 개의 제품이 생산됩니다. 불량품은 매우 드물어서 불량 라벨을 붙이기 어렵습니다. 정상 패턴과 다른 것을 찾아야 합니다.',
    attributes: ['제품 무게', '진동 센서 데이터', '작업자 이름', '소음 데시벨', '공장 온도', '생산 날짜'],
    correctAttributes: ['제품 무게', '진동 센서 데이터', '소음 데시벨', '공장 온도']
  }
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    difficulty: 'easy',
    question: '다음 중 비지도학습이 필요한 상황은?',
    type: 'multiple',
    options: ['개 고양이 사진 분류하기(라벨 있음)', '스팸 메일 필터링(스팸 표시 있음)', '구매 이력으로 고객 그룹 나누기(라벨 없음)', '집 크기로 가격 예측하기(가격 정보 있음)'],
    answer: 2,
    explanation: '고객 그룹 나누기는 정해진 정답(그룹명)이 없이 데이터의 유사성을 기반으로 나누는 것이므로 비지도학습입니다.',
    relatedConceptId: 'c1'
  },
  {
    id: 'q2',
    difficulty: 'medium',
    question: '이상치 탐지(Anomaly Detection)에서 "이상치"로 판단하는 기준은 무엇인가?',
    type: 'multiple',
    options: ['데이터의 크기가 큰 것', '가장 최근에 수집된 데이터', '대다수의 데이터 분포와 확률적으로 거리가 먼 것', '라벨이 잘못 붙은 것'],
    answer: 2,
    explanation: '이상치는 정상 데이터의 분포(밀도)에서 벗어나 발생 확률이 매우 낮은 데이터를 의미합니다.',
    relatedConceptId: 'c4'
  },
  {
    id: 'q3',
    difficulty: 'hard',
    question: 'K-Means 클러스터링의 단점으로 올바른 것은?',
    type: 'multiple',
    options: ['계산 속도가 매우 느리다', '초기 중심점 위치에 따라 결과가 달라질 수 있다', '데이터의 차원이 낮아야만 작동한다', '모든 데이터가 같은 그룹이 된다'],
    answer: 1,
    explanation: 'K-Means는 초기에 무작위로 설정한 중심점(Centroid)의 위치에 따라 최종 군집 결과가 달라질 수 있다는 단점이 있습니다.',
    relatedConceptId: 'c6'
  }
];
