import { CaseFile, DetectiveRank } from './types';

export const TEXTBOOK_CASES: CaseFile[] = [
  {
    id: 'tb_001',
    title: '미스터리한 복권 번호',
    description: '의뢰인이 지난 10년간의 로또 당첨 번호 데이터를 가져왔네. 다음 주 1등 번호를 예측해달라고 하는군.',
    category: 'textbook',
    difficulty: 1,
    isSolvable: false,
    correctAttributes: {
      hasBigData: true,
      hasPattern: false,
      isCreativeOrRandom: true
    },
    explanation: '이런, 속으면 안 되네. 복권 추첨은 독립 시행이며 무작위(Random) 이벤트야. 데이터는 많지만 규칙성이 없어서 기계학습으로 예측할 수 없다네.'
  },
  {
    id: 'tb_002',
    title: '스팸 메일의 습격',
    description: '광고성 이메일이 너무 많이 와서 업무가 마비될 지경이라네. 수신된 메일들을 분석해서 자동으로 분류하고 싶다더군.',
    category: 'textbook',
    difficulty: 1,
    isSolvable: true,
    correctAttributes: {
      hasBigData: true,
      hasPattern: true,
      isCreativeOrRandom: false
    },
    explanation: '훌륭해. 스팸 메일에는 특정 단어나 발신자 패턴이 존재하지. 데이터만 충분하다면 기계학습 분류 모델의 아주 전형적인 먹잇감이야.'
  },
  {
    id: 'tb_003',
    title: '희귀 질병 치료법',
    description: '전 세계에 단 5명뿐인 희귀 질병 환자가 있네. 이들의 진료 기록만으로 완벽한 치료 신약을 개발할 수 있을까?',
    category: 'textbook',
    difficulty: 2,
    isSolvable: false,
    correctAttributes: {
      hasBigData: false,
      hasPattern: true,
      isCreativeOrRandom: false
    },
    explanation: '안타깝지만 어렵네. 기계학습은 방대한 데이터를 통해 학습해야 해. 데이터가 너무 적으면(Few-shot) 일반화된 규칙을 찾기 힘들지.'
  },
  {
    id: 'tb_004',
    title: '편의점 김밥 수요 예측',
    description: '편의점 사장님이 날씨, 요일, 인근 행사 정보에 따라 내일 김밥이 몇 개 팔릴지 알고 싶어 하네.',
    category: 'textbook',
    difficulty: 1,
    isSolvable: true,
    correctAttributes: {
      hasBigData: true,
      hasPattern: true,
      isCreativeOrRandom: false
    },
    explanation: '정확한 지적이야. 판매량은 날씨나 요일과 밀접한 상관관계(Pattern)가 있지. 회귀 분석을 통해 훌륭하게 예측할 수 있네.'
  },
  {
    id: 'tb_005',
    title: '완벽하게 새로운 추상화 그리기',
    description: '의뢰인은 이전에 세상에 없던, 인간의 감정을 뒤흔들 완전히 독창적인 화풍의 그림을 기계가 그려주길 원해.',
    category: 'textbook',
    difficulty: 3,
    isSolvable: false, // In the context of "Basic ML" taught in high school, pure creativity is considered hard/impossible, though GenAI blurs this. We stick to the "Textbook" definition where ML learns from existing distribution.
    correctAttributes: {
      hasBigData: true,
      hasPattern: false,
      isCreativeOrRandom: true
    },
    explanation: '주의하게. 생성형 AI가 그림을 그리긴 하지만, 그것은 기존 데이터의 분포를 학습한 것이지. "완전히 새로운 창조"나 "인간의 고유한 감정" 영역은 여전히 기계학습으로 완벽히 정의하기 어려운 난제라네.'
  }
];

export const getRank = (score: number): DetectiveRank => {
  if (score >= 100) return DetectiveRank.LEGEND;
  if (score >= 50) return DetectiveRank.CHIEF;
  if (score >= 20) return DetectiveRank.SENIOR;
  return DetectiveRank.ROOKIE;
};
