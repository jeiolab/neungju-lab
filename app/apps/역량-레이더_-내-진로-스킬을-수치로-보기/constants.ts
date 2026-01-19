import { CompetencyDef, JobProfile, QuizQuestion, Scenario } from './types';

export const COMPETENCY_DATA: Record<string, CompetencyDef> = {
  knowledge: {
    id: 'knowledge',
    name: '지식정보처리 역량',
    description: '문제를 해결하기 위해 다양한 영역의 지식과 정보를 처리하고 활용하는 능력',
    misconception: '단순히 정보를 많이 암기하는 것이 아니라, 필요한 정보를 선별하고 가공하는 능력입니다.',
    icon: '🧠'
  },
  computational: {
    id: 'computational',
    name: '컴퓨팅 사고력',
    description: '복잡한 문제를 효율적으로 해결하기 위해 컴퓨팅 시스템의 사고 방식을 적용하는 능력',
    misconception: '반드시 코딩을 잘해야 하는 것이 아니라, 문제를 절차적으로 분해하고 알고리즘화하는 사고방식입니다.',
    icon: '💻'
  },
  creative: {
    id: 'creative',
    name: '창의적 사고 역량',
    description: '폭넓은 기초 지식을 바탕으로 새롭고 독창적인 것을 창출하는 능력',
    misconception: '예술가에게만 필요한 것이 아니라, 기존의 것을 새롭게 연결하는 융합적 사고를 포함합니다.',
    icon: '✨'
  },
  communication: {
    id: 'communication',
    name: '협력적 소통 역량',
    description: '타인의 의견을 경청하고 자신의 생각을 효과적으로 전달하며 협력하는 능력',
    misconception: '말을 잘하는 언변이 아니라, 갈등을 조정하고 공동의 목표를 향해 나아가는 과정입니다.',
    icon: '🤝'
  },
  community: {
    id: 'community',
    name: '공동체 역량',
    description: '지역사회, 국가, 세계 시민으로서의 권리와 책임을 다하고 공동체 발전에 기여하는 능력',
    misconception: '희생이나 봉사만을 의미하는 것이 아니라, 책임감 있게 참여하고 가치를 나누는 태도입니다.',
    icon: '🌍'
  }
};

export const JOB_PROFILES: JobProfile[] = [
  {
    id: 'dev',
    name: 'AI 개발자',
    category: 'IT/SW',
    requiredCompetencies: ['computational', 'knowledge', 'creative'],
    description: '복잡한 데이터를 알고리즘으로 처리하고 새로운 모델을 설계합니다.'
  },
  {
    id: 'planner',
    name: '디지털 콘텐츠 기획자',
    category: 'Media',
    requiredCompetencies: ['creative', 'communication', 'knowledge'],
    description: '트렌드 정보를 분석하고 팀원과 소통하여 창의적인 결과물을 만듭니다.'
  },
  {
    id: 'env',
    name: '환경 데이터 분석가',
    category: 'Science',
    requiredCompetencies: ['knowledge', 'community', 'computational'],
    description: '지구적 문제를 해결하기 위해 데이터를 분석하고 공동체에 제언합니다.'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    competency: 'knowledge',
    difficulty: 'easy',
    errorType: 'definition_confusion',
    question: '다음 중 "지식정보처리 역량"의 가장 올바른 정의는?',
    options: [
      '교과서 내용을 토씨 하나 틀리지 않고 외우는 능력',
      '문제를 해결하기 위해 다양한 지식과 정보를 선별하고 활용하는 능력',
      '컴퓨터 프로그래밍 언어를 유창하게 사용하는 능력',
      '친구들과 대화할 때 리더십을 발휘하는 능력'
    ],
    correctIndex: 1,
    explanation: '지식정보처리 역량은 단순 암기가 아니라, 정보를 탐색, 선별, 조직화하여 문제 해결에 활용하는 능력입니다.'
  },
  {
    id: 2,
    competency: 'computational',
    difficulty: 'medium',
    errorType: 'application_error',
    question: '일상 생활에서 "컴퓨팅 사고"를 적용한 사례로 적절하지 않은 것은?',
    options: [
      '라면 끓이는 과정을 순서도(Flowchart)로 그려보았다.',
      '여행 짐을 쌀 때 가방의 크기와 물건의 부피를 고려해 최적의 배치를 찾았다.',
      '복잡한 과제를 작은 단위로 쪼개어(Decomposition) 순서대로 해결했다.',
      '컴퓨터가 고장 나서 AS 기사님을 불렀다.'
    ],
    correctIndex: 3,
    explanation: 'AS 기사를 부르는 것은 문제 해결 행동이지만, 컴퓨팅 사고의 핵심 과정(분해, 패턴인식, 추상화, 알고리즘)을 직접 수행한 예시는 아닙니다.'
  },
  {
    id: 3,
    competency: 'communication',
    difficulty: 'hard',
    errorType: 'term_confusion',
    question: '협력적 소통 역량에서 말하는 "경청"의 자세로 가장 적절한 것은?',
    options: [
      '상대방의 말이 끝나기 전에 내 의견을 준비한다.',
      '상대방의 의견에 무조건 동의하며 갈등을 피한다.',
      '상대방의 의도와 감정을 파악하며 듣고, 적절히 반응한다.',
      '나의 논리적 우위를 점하기 위해 상대의 논리적 허점을 찾는다.'
    ],
    correctIndex: 2,
    explanation: '진정한 경청은 단순히 듣는 것을 넘어 공감하고 의도를 파악하는 적극적인 소통 행위입니다.'
  },
  {
    id: 4,
    competency: 'community',
    difficulty: 'medium',
    errorType: 'application_error',
    question: '디지털 시민으로서 공동체 역량을 발휘한 행동은?',
    options: [
      '익명 게시판에 확인되지 않은 사실을 재미로 유포했다.',
      '사이버 폭력을 목격하고 증거를 캡처해 선생님께 알리고 피해 친구를 위로했다.',
      '나만의 비밀번호를 매우 복잡하게 설정했다.',
      '게임에서 이기기 위해 불법 프로그램을 사용했다.'
    ],
    correctIndex: 1,
    explanation: '공동체 역량은 공동체의 문제 해결에 참여하고 타인을 배려하는 태도를 포함합니다. 사이버 폭력 방관을 거부하는 행동이 이에 해당합니다.'
  },
  {
    id: 5,
    competency: 'creative',
    difficulty: 'easy',
    errorType: 'definition_confusion',
    question: '창의적 사고 역량에 대한 설명 중 틀린 것은?',
    options: [
      '기존의 지식을 융합하여 새로운 가치를 만든다.',
      '무조건 엉뚱하고 기발하기만 하면 된다.',
      '문제 해결을 위해 독창적인 대안을 탐색한다.',
      '다양한 관점을 수용하는 개방적 태도가 필요하다.'
    ],
    correctIndex: 1,
    explanation: '창의적 사고는 단순한 기발함이 아니라, 타당성과 유용성을 갖춘 새로운 가치를 창출하는 것입니다.'
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: '학교 축제 만족도 조사를 위해 전교생 500명의 설문 데이터를 수집했습니다. 이 데이터에서 유의미한 패턴을 찾아 내년 축제 기획에 반영하려 합니다.',
    correctCompetency: 'knowledge',
    feedback: '대량의 데이터에서 정보를 추출하고 의미를 해석하는 것은 [지식정보처리 역량]의 핵심입니다.'
  },
  {
    id: 2,
    situation: '동아리 프로젝트 마감일이 다가오는데 팀원 간 의견 충돌로 진행이 멈췄습니다. 서로의 감정이 상하지 않게 중재안을 내야 합니다.',
    correctCompetency: 'communication',
    feedback: '갈등을 조정하고 팀의 목표 달성을 위해 소통하는 것은 [협력적 소통 역량]이 필요합니다.'
  },
  {
    id: 3,
    situation: '매일 아침 등굣길 셔틀버스 줄이 너무 길어 지각생이 속출합니다. 버스 배차 간격과 학생 도착 시간 패턴을 분석해 효율적인 줄 서기 규칙을 만들고자 합니다.',
    correctCompetency: 'computational',
    feedback: '문제를 구조화하고 데이터에 기반한 규칙(알고리즘)을 만드는 것은 [컴퓨팅 사고력]입니다.'
  },
  {
    id: 4,
    situation: '환경 오염 문제를 알리는 캠페인을 기획 중입니다. 기존의 포스터 방식이 아닌, AR 기술과 미술을 결합한 새로운 참여형 전시를 구상했습니다.',
    correctCompetency: 'creative',
    feedback: '기존 방식에서 벗어나 기술과 예술을 융합해 새로운 해결책을 제시하는 것은 [창의적 사고 역량]입니다.'
  },
  {
    id: 5,
    situation: '우리 지역 도서관에 점자책이 부족하다는 사실을 알게 되었습니다. 친구들을 모아 "점자 입력 봉사단"을 조직하고 지속적인 활동 규칙을 정했습니다.',
    correctCompetency: 'community',
    feedback: '지역 사회의 문제를 발견하고 이를 해결하기 위해 적극적으로 참여하고 연대하는 것은 [공동체 역량]입니다.'
  }
];

export const ACTION_PLAN_TEMPLATES = [
  '관련 뉴스 기사 1개 읽고 요약하기',
  '수업 시간 배운 내용 마인드맵 그리기',
  '친구의 이야기 3분간 경청하고 맞장구치기',
  '불편한 점을 발견하고 개선 아이디어 1개 메모하기',
  '하루의 일과를 순서대로 정리해보기'
];
