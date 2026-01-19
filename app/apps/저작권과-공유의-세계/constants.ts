import { Scenario, QuizQuestion } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "유튜버 A의 배경음악",
    description: "유튜버 A는 '비영리 목적(NC)'으로만 사용 가능한 무료 음원을 다운로드하여, 광고 수익이 창출되는 자신의 브이로그 영상에 배경음악으로 사용했습니다.",
    verdict: 'guilty',
    explanation: "CCL의 NC(Non-Commercial) 조건은 영리 목적 사용을 금지합니다. 유튜브 광고 수익 창출은 영리 활동에 해당하므로 저작권 침해입니다.",
    difficulty: '쉬움'
  },
  {
    id: 2,
    title: "학생 B의 발표 자료",
    description: "학생 B는 학교 수업 시간에 발표를 하기 위해, 인터넷 뉴스 기사의 사진 한 장을 출처를 밝히고 PPT에 넣어 친구들 앞에서 발표했습니다.",
    verdict: 'innocent',
    explanation: "학교 교육 목적을 위한 저작물 이용(저작권법 제25조)은 보상금을 지급하거나 특정 범위 내에서 허용됩니다. 또한 수업 목적의 단순 인용은 공정이용에 해당할 가능성이 높습니다.",
    difficulty: '보통'
  },
  {
    id: 3,
    title: "디자이너 C의 폰트 사용",
    description: "디자이너 C는 '개인적 용도 무료'인 폰트를 다운로드하여, 외주를 받은 회사의 유료 팜플렛 제작에 사용했습니다.",
    verdict: 'guilty',
    explanation: "무료 폰트라도 '개인적 용도'와 '상업적 용도' 범위가 다릅니다. 상업적 외주 작업에 개인용 라이선스 폰트를 쓰면 라이선스 위반입니다.",
    difficulty: '쉬움'
  },
  {
    id: 4,
    title: "블로거 D의 영화 리뷰",
    description: "블로거 D는 영화 리뷰를 쓰면서 영화 포스터를 작게 축소하여 글 옆에 붙이고, 해당 포스터가 어떤 영화인지 설명하는 용도로만 사용했습니다.",
    verdict: 'innocent',
    explanation: "비평, 연구 등을 위한 정당한 범위 안에서의 인용(공정이용)은 허용됩니다. 포스터를 단순 정보 전달 및 비평의 보조 자료로 쓴 것은 통상적으로 허용됩니다.",
    difficulty: '보통'
  },
  {
    id: 5,
    title: "개발자 E의 코드 수정",
    description: "개발자 E는 'ND(변경금지)' 조건이 붙은 오픈소스 코드를 다운로드하여, 기능을 개선한 뒤 자신의 블로그에 '개선판'이라며 수정된 코드를 배포했습니다.",
    verdict: 'guilty',
    explanation: "ND(No Derivatives)는 2차적 저작물 작성 금지, 즉 변경을 금지하는 조건입니다. 코드를 수정하여 배포하는 행위는 이를 위반한 것입니다.",
    difficulty: '어려움'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    symbol: "BY",
    question: "이 아이콘(BY)이 의미하는 바는 무엇일까요?",
    options: ["상업적 이용 금지", "저작자 표시 필수", "변경 금지", "동일조건 변경 허락"],
    correctAnswer: 1
  },
  {
    id: 2,
    symbol: "NC",
    question: "달러 표시에 사선이 그어진 'NC' 아이콘의 의미는?",
    options: ["돈을 내고 써야 함", "비영리 목적으로만 이용 가능", "해외 사용 금지", "기부 필수"],
    correctAnswer: 1
  },
  {
    id: 3,
    symbol: "ND",
    question: "'= (등호)' 모양의 ND 아이콘이 붙은 저작물은 어떻게 써야 할까요?",
    options: ["반드시 수정해서 써야 한다", "원본 그대로만 써야 한다 (변경 금지)", "출처를 밝히지 않아도 된다", "공유하면 안 된다"],
    correctAnswer: 1
  },
  {
    id: 4,
    symbol: "SA",
    question: "화살표가 도는 모양의 'SA(Share Alike)' 조건은 무엇을 뜻합니까?",
    options: ["친구에게만 공유 가능", "2차 저작물 제작 시 원본과 동일한 라이선스 적용", "SNS 공유 금지", "사용 후 원작자에게 알림"],
    correctAnswer: 1
  }
];