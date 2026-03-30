import { AlgorithmType, Scenario, QuizQuestion } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: '1',
    question: '내일 서울의 기온(°C) 예측하기',
    type: AlgorithmType.REGRESSION,
    explanation: '기온은 25.5도처럼 연속적인 숫자로 나타나기 때문에 회귀 문제입니다.',
  },
  {
    id: '2',
    question: '받은 메일이 스팸인지 아닌지 판단하기',
    type: AlgorithmType.CLASSIFICATION,
    explanation: '스팸(O) 또는 정상(X)처럼 딱 떨어지는 범주를 예측하므로 분류 문제입니다.',
  },
  {
    id: '3',
    question: '사진 속 동물이 강아지, 고양이, 햄스터 중 무엇인지 맞히기',
    type: AlgorithmType.CLASSIFICATION,
    explanation: '동물의 종류(Category)를 구분하는 것이므로 분류 문제입니다.',
  },
  {
    id: '4',
    question: '주택의 크기와 위치를 보고 집값 예측하기',
    type: AlgorithmType.REGRESSION,
    explanation: '집값은 연속된 금액(숫자)으로 나타나므로 회귀 문제입니다.',
  },
  {
    id: '5',
    question: '고객이 다음 달에 이탈할지(Yes) 안 할지(No) 예측하기',
    type: AlgorithmType.CLASSIFICATION,
    explanation: '이탈 여부는 Yes/No 두 가지 중 하나이므로 이진 분류 문제입니다.',
  },
  {
    id: '6',
    question: '유튜브 영상의 예상 조회수 예측하기',
    type: AlgorithmType.REGRESSION,
    explanation: '조회수는 0부터 무한대까지 연속적인 정수 값이므로 회귀 문제입니다.',
  },
  {
    id: '7',
    question: '손글씨 숫자가 0~9 중 무엇인지 판별하기',
    type: AlgorithmType.CLASSIFICATION,
    explanation: '0부터 9까지 정해진 10개의 클래스 중 하나를 고르는 것이므로 분류입니다.',
  },
  {
    id: '8',
    question: '오늘 야구 경기에서 우리 팀이 이길 확률(%)이 아니라 승패 여부 예측',
    type: AlgorithmType.CLASSIFICATION,
    explanation: '승/패라는 결과를 예측하는 것은 분류입니다. (확률 자체를 값으로 예측한다면 회귀적 접근도 가능하지만, 결과는 분류)',
  },
  {
    id: '9',
    question: '학생의 공부 시간을 보고 시험 점수(0~100점) 예측하기',
    type: AlgorithmType.REGRESSION,
    explanation: '점수는 연속적인 수치이므로 회귀 문제입니다.',
  },
  {
    id: '10',
    question: 'CT 사진을 보고 암 종양 여부 판단하기',
    type: AlgorithmType.CLASSIFICATION,
    explanation: '정상/비정상 분류 문제입니다.',
  },
  {
    id: '11',
    question: '택시 이동 거리에 따른 예상 요금 계산하기',
    type: AlgorithmType.REGRESSION,
    explanation: '요금은 수치 데이터입니다.',
  },
  {
    id: '12',
    question: '넷플릭스 사용자가 이 영화를 좋아할지(Like) 싫어할지(Dislike) 예측',
    type: AlgorithmType.CLASSIFICATION,
    explanation: '선호 여부를 나누는 분류 문제입니다.',
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    dataPreview: '데이터: [키, 몸무게, 나이] -> 목표변수: [기대 수명(세)]',
    question: '이 데이터셋을 학습시켜 기대 수명을 예측하려고 합니다.',
    answer: AlgorithmType.REGRESSION,
    explanation: '기대 수명은 80.5세, 72.1세 등 연속적인 숫자이므로 회귀입니다.',
  },
  {
    id: 2,
    dataPreview: '데이터: [꽃잎 길이, 꽃잎 너비] -> 목표변수: [붓꽃 품종(Setosa, Versicolor, Virginica)]',
    question: '이 데이터로 붓꽃의 품종을 알아내려고 합니다.',
    answer: AlgorithmType.CLASSIFICATION,
    explanation: '품종은 명확히 구분되는 범주(Category)이므로 분류입니다.',
  },
  {
    id: 3,
    dataPreview: '데이터: [지난달 매출, 광고비, 계절] -> 목표변수: [이번달 총 매출액]',
    question: '이번 달 매출액을 예측하는 모델을 만듭니다.',
    answer: AlgorithmType.REGRESSION,
    explanation: '매출액은 연속된 금액 수치입니다.',
  },
  {
    id: 4,
    dataPreview: '데이터: [신용카드 사용 내역, 시간, 장소] -> 목표변수: [사기 거래 여부(0:정상, 1:사기)]',
    question: '카드 도용 범죄를 탐지하는 시스템입니다.',
    answer: AlgorithmType.CLASSIFICATION,
    explanation: '사기냐 아니냐 두 가지 상태로 구분하므로 분류입니다.',
  },
];
