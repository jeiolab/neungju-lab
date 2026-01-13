import { ProjectTheme, MethodType, QuizQuestion } from './types';

export const THEMES = {
  [ProjectTheme.STUDY]: {
    label: "학습 루틴 유형 찾기",
    desc: "학생들의 공부 시간, 수면 시간 등을 분석하여 학습 유형을 군집화합니다.",
    defaultMethod: MethodType.CLUSTERING,
    safeAttributes: ["일일 공부 시간", "수면 시간", "주말 자습 시간", "과목별 흥미도(1-5)", "집중 지속 시간"],
  },
  [ProjectTheme.ENV]: {
    label: "환경 센서 이상치 탐지",
    desc: "교실 내 온습도, CO2 농도 데이터를 통해 환기가 필요한 이상 상황을 탐지합니다.",
    defaultMethod: MethodType.OUTLIER,
    safeAttributes: ["온도(℃)", "습도(%)", "CO2 농도(ppm)", "미세먼지 농도", "소음(dB)"],
  },
  [ProjectTheme.LIBRARY]: {
    label: "도서관 대출 패턴 분석",
    desc: "대출 빈도와 체류 시간을 분석하여 학생들이 몰리는 패턴(밀도)을 찾습니다.",
    defaultMethod: MethodType.DENSITY,
    safeAttributes: ["월 대출 권수", "도서관 체류 시간(분)", "방문 횟수", "연체 횟수", "희망 도서 신청 수"],
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "비지도 학습의 가장 큰 특징은 무엇인가요?",
    options: ["정답(레이블)이 있는 데이터를 사용한다.", "정답이 없는 데이터에서 패턴을 찾는다.", "강화 학습과 동일하다.", "미래의 값을 정확히 예측하는 것이 유일한 목표다."],
    correctAnswer: 1,
    explanation: "비지도 학습은 정답(Label)이 주어지지 않은 상태에서 데이터 자체의 특성이나 패턴을 찾아내는 방법입니다.",
    difficulty: "Easy"
  },
  {
    id: 2,
    question: "다음 중 '군집화(Clustering)'가 적절한 사례는?",
    options: ["스팸 메일 필터링", "내일 날씨 예측", "고객 구매 패턴에 따른 그룹 나누기", "사진 속 고양이 찾기"],
    correctAnswer: 2,
    explanation: "고객을 특성에 따라 그룹으로 묶는 것은 전형적인 군집화 문제입니다. 나머지는 지도학습(분류/회귀)에 가깝습니다.",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "이상치 탐지(Outlier Detection)를 수행할 때 유의할 점은?",
    options: ["모든 데이터를 이상치로 간주해야 한다.", "이상치는 무조건 삭제해야 한다.", "이상치가 단순 오류인지, 의미 있는 예외인지 해석해야 한다.", "군집의 개수(K)를 정하는 것이 가장 중요하다."],
    correctAnswer: 2,
    explanation: "이상치는 데이터 오류일 수도 있지만, 화재 감지나 도난 처럼 매우 중요한 정보일 수도 있으므로 무조건 삭제하지 말고 해석해야 합니다.",
    difficulty: "Medium"
  },
  {
    id: 4,
    question: "K-Means 군집화에서 'K'가 의미하는 것은?",
    options: ["데이터의 총 개수", "나눌 그룹(군집)의 개수", "이상치의 개수", "학습 반복 횟수"],
    correctAnswer: 1,
    explanation: "K는 데이터를 몇 개의 그룹으로 묶을지 결정하는 하이퍼파라미터입니다.",
    difficulty: "Easy"
  }
];

export const THEORY_CARDS = [
  {
    title: "비지도 학습 (Unsupervised Learning)",
    content: "정답(Label)이 없는 데이터에서 숨겨진 구조나 패턴을 발견하는 머신러닝 방법입니다. 선생님이 답을 알려주지 않고 스스로 공부하여 규칙을 깨닫는 것과 비슷합니다.",
    icon: "Brain"
  },
  {
    title: "군집화 (Clustering)",
    content: "유사한 속성을 가진 데이터끼리 묶어주는 기법입니다. '끼리끼리 모으기'라고 생각하면 됩니다. 예: 뉴스 기사 주제별 분류, 쇼핑 성향별 고객 그룹.",
    icon: "Group"
  },
  {
    title: "이상치 탐지 (Outlier Detection)",
    content: "대부분의 데이터와 확연히 다른 특성을 가진 데이터를 찾아내는 기법입니다. 예: 신용카드 도난 사용 감지, 기계 고장 전조 증상 발견.",
    icon: "Alert"
  },
  {
    title: "밀도 추정 (Density Estimation)",
    content: "데이터가 어디에 얼마나 많이 몰려있는지 확률적으로 추정하는 것입니다. 데이터가 희소한 영역과 밀집한 영역을 구분할 때 사용합니다.",
    icon: "Wave"
  }
];
