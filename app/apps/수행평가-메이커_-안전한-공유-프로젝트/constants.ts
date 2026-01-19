import { ProjectTemplate, QuizQuestion, TheoryCardData } from './types';
import { Share2, Shield, Lock, FileText, Globe } from 'lucide-react';

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: 'lunch',
    title: '급식 만족도 개선 프로젝트',
    description: '학생들의 급식 선호도를 조사하여 더 맛있는 급식을 만들기 위한 데이터 분석 프로젝트입니다.',
    defaultGoal: '우리 학교 급식 잔반을 줄이고 학생 만족도를 20% 향상시킨다.',
    suggestedData: ['학년/반 정보', '식습관 데이터', '선호 메뉴', '알레르기 정보(민감정보)']
  },
  {
    id: 'safety',
    title: '통학로 안전지도 만들기',
    description: '등하굣길 위험 요소를 사진으로 제보받아 안전지도를 제작하는 프로젝트입니다.',
    defaultGoal: '학생들이 안전하게 등하교할 수 있도록 위험 구역 10곳을 식별하고 지도로 공유한다.',
    suggestedData: ['통학 경로(위치정보)', '학생 얼굴 사진', '위험물 사진', '제보자 이름']
  },
  {
    id: 'wiki',
    title: '학급 공부법 공유 위키',
    description: '각자의 공부 비법과 노트 필기를 공유하여 함께 성장하는 지식 공유 프로젝트입니다.',
    defaultGoal: '모든 과목의 핵심 요약 노트를 공유하여 학급 전체 평균 점수를 높인다.',
    suggestedData: ['교과서 요약 내용', '인터넷 강의 캡처', '직접 쓴 노트 필기', '참고서 문제 발췌']
  }
];

export const PROTECTION_MEASURES = [
  { id: 'anonymization', label: '가명처리 (이름 → A학생)' },
  { id: 'aggregation', label: '통계처리 (개별 데이터 비공개)' },
  { id: 'permission_read', label: '읽기 전용 권한 설정 (수정 불가)' },
  { id: 'watermark', label: '워터마크 삽입 (출처 표시)' },
  { id: 'consent', label: '정보 주체 동의서 받기' },
  { id: 'limited_retention', label: '프로젝트 종료 후 데이터 파기' }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 개인정보 최소수집 원칙에 가장 잘 부합하는 행동은?",
    options: ["설문조사 시 혹시 몰라 전화번호까지 모두 받는다.", "경품 추첨을 위해 주민등록번호를 수집한다.", "통계 분석에 꼭 필요한 학년 정보만 수집한다.", "친구의 모든 SNS 계정을 조사하여 기록한다."],
    correctIndex: 2,
    explanation: "최소수집 원칙은 목적 달성에 필요한 최소한의 정보만 수집해야 한다는 원칙입니다.",
    category: 'privacy'
  },
  {
    id: 2,
    question: "클라우드 문서 공유 시 '편집 권한'을 '링크가 있는 모든 사용자'에게 주는 것의 위험성은?",
    options: ["누구나 들어와서 문서를 훼손하거나 삭제할 수 있다.", "편집이 너무 느려진다.", "저장 용량이 부족해진다.", "파일 이름이 자동으로 변경된다."],
    correctIndex: 0,
    explanation: "링크가 유출되면 의도치 않은 사용자가 들어와 데이터를 망칠 수 있으므로, 편집 권한은 신중히 부여해야 합니다.",
    category: 'security'
  },
  {
    id: 3,
    question: "수행평가 보고서에 인터넷 기사를 인용할 때 올바른 방법은?",
    options: ["기사 전체를 복사해서 내 이름으로 낸다.", "출처를 밝히고, 인용의 목적에 맞게 필요한 부분만 발췌한다.", "기사 사진만 몰래 캡처해서 쓴다.", "기자 이름을 지우고 사용한다."],
    correctIndex: 1,
    explanation: "저작권법상 공표된 저작물은 정당한 범위 안에서 공정한 관행에 합치되게 인용할 수 있으며, 반드시 출처를 명시해야 합니다.",
    category: 'copyright'
  },
  {
    id: 4,
    question: "설문조사 결과 데이터를 공유할 때, 개인정보 보호를 위한 조치는?",
    options: ["응답자의 실명을 그대로 공개한다.", "특정 개인을 알아볼 수 없도록 가명처리 혹은 통계 수치만 공개한다.", "전화번호 뒷자리는 남겨둔다.", "집 주소를 동까지만 공개한다(상황에 따라 위험할 수 있음)."],
    correctIndex: 1,
    explanation: "개인을 식별할 수 없도록 가명처리하거나 통계 데이터로 변환하여 공유해야 안전합니다.",
    category: 'privacy'
  },
  {
    id: 5,
    question: "친구의 얼굴이 나온 사진을 수행평가 발표 자료(공개 웹사이트)에 쓸 때 필요한 것은?",
    options: ["내 사진이 아니니 그냥 쓴다.", "친구가 잘 나왔으니 그냥 쓴다.", "친구(정보주체)의 동의를 구하고 사용한다.", "모자이크를 해도 동의는 필요 없다."],
    correctIndex: 2,
    explanation: "초상권 보호를 위해 당사자의 동의가 필수적입니다.",
    category: 'privacy'
  },
  {
    id: 6,
    question: "CCL(크리에이티브 커먼즈 라이선스) 기호 중 'BY-NC'의 의미는?",
    options: ["저작자 표시, 영리 목적 이용 가능", "저작자 표시, 비영리 목적만 이용 가능", "저작자 표시 불필요, 변경 금지", "출처 표시 안 해도 됨"],
    correctIndex: 1,
    explanation: "BY는 저작자 표시, NC는 비영리(Non-Commercial)를 의미합니다.",
    category: 'copyright'
  },
  {
    id: 7,
    question: "우리 반만의 비밀번호가 설정된 페이지에 자료를 올리는 것은 어떤 보호 조치인가?",
    options: ["가명처리", "접근 통제(기술적 보호 조치)", "데이터 파기", "최소 수집"],
    correctIndex: 1,
    explanation: "비밀번호 설정은 인가되지 않은 사람의 접근을 막는 기술적 보호 조치입니다.",
    category: 'security'
  },
  {
    id: 8,
    question: "무료 이미지 사이트에서 받은 사진을 사용할 때 주의할 점은?",
    options: ["무료면 무조건 아무렇게나 써도 된다.", "라이선스 범위를 확인하고(상업적 이용 가능 여부 등) 출처를 남긴다.", "화질을 낮춰서 쓴다.", "색깔을 바꿔서 쓴다."],
    correctIndex: 1,
    explanation: "무료 이미지라도 저작권자가 설정한 이용 허락 범위(라이선스)가 다를 수 있습니다.",
    category: 'copyright'
  },
  {
    id: 9,
    question: "수행평가가 끝난 후 수집한 개인정보가 포함된 설문지는 어떻게 해야 할까?",
    options: ["혹시 모르니 평생 보관한다.", "개인 SNS에 추억으로 올린다.", "보유 기간이 지났으므로 지체 없이 파기한다.", "후배들에게 물려준다."],
    correctIndex: 2,
    explanation: "목적이 달성된 개인정보는 지체 없이 파기하는 것이 원칙입니다.",
    category: 'privacy'
  },
  {
    id: 10,
    question: "공유를 통해 얻을 수 있는 장점이 아닌 것은?",
    options: ["정보의 가치가 커진다.", "협업을 통해 더 나은 결과물을 만들 수 있다.", "개인정보 유출 위험이 사라진다.", "지식을 널리 확산할 수 있다."],
    correctIndex: 2,
    explanation: "공유는 가치를 높이지만, 적절한 보호 조치가 없으면 개인정보 유출 위험이 커질 수 있습니다.",
    category: 'balance'
  }
];

export const THEORY_CARDS: TheoryCardData[] = [
  {
    id: 'sharing_benefit',
    title: '정보 공유의 힘',
    content: '나의 작은 데이터가 모여 큰 지식이 됩니다. 위키피디아처럼 함께 만드는 정보는 혼자 만드는 것보다 훨씬 정확하고 풍부해질 수 있습니다.',
    icon: 'Share2',
    category: 'sharing'
  },
  {
    id: 'protection_need',
    title: '왜 보호해야 할까?',
    content: '한 번 유출된 개인정보는 회수하기 어렵습니다. 악용되면 보이스피싱, 명의도용 등 심각한 피해로 이어질 수 있어 예방이 필수입니다.',
    icon: 'Shield',
    category: 'protection'
  },
  {
    id: 'permissions',
    title: '권한 설정의 마법',
    content: "'보기 전용', '댓글 작성', '편집 가능' 권한을 구분하세요. 모든 사람에게 편집 권한을 주면 프로젝트가 엉망이 될 수 있습니다.",
    icon: 'Lock',
    category: 'protection'
  },
  {
    id: 'copyright',
    title: '저작권과 CCL',
    content: '남의 자료를 쓸 때는 허락된 범위인지 꼭 확인하세요. CCL 마크(BY, NC, SA, ND)를 이해하면 안전하게 자료를 공유할 수 있습니다.',
    icon: 'FileText',
    category: 'balance'
  }
];

export const THINKING_PROBLEMS = [
  {
    id: 1,
    type: 'condition',
    title: '조건 변경: 만약 대상이 전 국민이라면?',
    description: '우리 학교 학생 대상 설문조사를 전 국민 대상으로 확대한다면, 수집해야 할 데이터와 보호 조치는 어떻게 달라져야 할까요?'
  },
  {
    id: 2,
    type: 'counter',
    title: '반례 찾기: 공유가 독이 된 경우',
    description: '선의로 공유한 정보가 누군가에게 피해를 준 사례를 상상해보세요 (예: 여행 사진 공유로 빈집털이 발생 등).'
  },
  {
    id: 3,
    type: 'application',
    title: '적용하기: 우리 동아리 홍보물',
    description: '동아리원들의 활동 사진이 담긴 홍보 포스터를 SNS에 올리려 합니다. 초상권 보호와 홍보 효과를 모두 잡는 방법은?'
  }
];
