import { Scenario, Axis, QuizQuestion } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: '재난 문자 발송 범위',
    description: '인근 지역에 지진이 발생했습니다. 긴급 재난 문자를 발송하려고 합니다. 어느 정도 범위와 상세 내용으로 발송해야 할까요?',
    category: 'disaster',
    idealValues: {
      [Axis.PUBLIC_INTEREST]: 90,
      [Axis.CONVENIENCE]: 40,
      [Axis.PRIVACY]: 30, // 재난 시에는 사생활보다 안전 우선
    },
    minThresholds: {
        [Axis.PUBLIC_INTEREST]: 70,
    },
    policyOptions: [
      { id: 'p1_1', category: 'scope', label: '전 국민 대상 발송', value: 10, isIdeal: false },
      { id: 'p1_2', category: 'scope', label: '해당 시/군/구 거주자', value: 5, isIdeal: true },
      { id: 'p1_3', category: 'duration', label: '1시간 후 자동 삭제', value: 0, isIdeal: false },
      { id: 'p1_4', category: 'duration', label: '재난 종료 시까지 보존', value: 5, isIdeal: true },
    ],
    feedback: {
        balanced: "재난 상황의 시급성과 정보의 정확성을 잘 균형 잡았습니다.",
        tooRisky: "너무 광범위한 정보 공개는 불필요한 공포감을 조성할 수 있습니다.",
        tooRestrictive: "정보가 너무 제한되면 시민들의 안전이 위협받을 수 있습니다."
    }
  },
  {
    id: 's2',
    title: '학교 급식 잔반 데이터 공개',
    description: '잔반을 줄이기 위해 학생별 잔반량을 측정하여 데이터를 공개하려고 합니다. 어디까지 공개해야 할까요?',
    category: 'school',
    idealValues: {
      [Axis.PUBLIC_INTEREST]: 60,
      [Axis.CONVENIENCE]: 20,
      [Axis.PRIVACY]: 80, // 학생 개인의 식습관 보호 중요
    },
    minThresholds: {
        [Axis.PRIVACY]: 60,
    },
    policyOptions: [
      { id: 'p2_1', category: 'anonymization', label: '실명 공개 (순위표)', value: 0, isIdeal: false },
      { id: 'p2_2', category: 'anonymization', label: '학급별 평균만 공개', value: 10, isIdeal: true },
      { id: 'p2_3', category: 'consent', label: '강제 참여', value: 0, isIdeal: false },
      { id: 'p2_4', category: 'consent', label: '동의한 학생만 참여', value: 10, isIdeal: true },
    ],
    feedback: {
        balanced: "학생들의 인권을 보호하면서도 캠페인 효과를 낼 수 있는 좋은 선택입니다.",
        tooRisky: "실명 공개는 심각한 따돌림이나 인권 침해로 이어질 수 있습니다.",
        tooRestrictive: "데이터 활용도가 너무 낮아 잔반 줄이기 효과가 미미할 수 있습니다."
    }
  },
  {
    id: 's3',
    title: '동네 CCTV 설치 위치 공유',
    description: '범죄 예방을 위해 동네 방범용 CCTV의 실시간 영상을 주민들에게 앱으로 공유하자는 의견이 있습니다.',
    category: 'community',
    idealValues: {
      [Axis.PUBLIC_INTEREST]: 70,
      [Axis.CONVENIENCE]: 50,
      [Axis.PRIVACY]: 80,
    },
     minThresholds: {
        [Axis.PRIVACY]: 70,
    },
    policyOptions: [
      { id: 'p3_1', category: 'access', label: '누구나 앱으로 실시간 시청', value: 0, isIdeal: false },
      { id: 'p3_2', category: 'access', label: '경찰 및 승인된 방범대만 열람', value: 10, isIdeal: true },
      { id: 'p3_3', category: 'anonymization', label: '얼굴 모자이크 처리 후 공개', value: 5, isIdeal: false }, // 그래도 위치 추적 위험
      { id: 'p3_4', category: 'scope', label: '설치 위치 지도만 공유 (영상 X)', value: 8, isIdeal: true },
    ],
    feedback: {
        balanced: "범죄 예방 목적을 달성하면서도 주민들의 사생활 감시 우려를 해소했습니다.",
        tooRisky: "실시간 영상 공유는 심각한 사생활 침해(동선 노출 등) 위험이 있습니다.",
        tooRestrictive: "최소한의 위치 정보는 공유되어야 주민들이 안심할 수 있습니다."
    }
  },
  {
    id: 's4',
    title: 'AI 학습용 의료 데이터 기증',
    description: '난치병 치료 AI 개발을 위해 병원의 환자 진료 기록을 연구소에 제공하려고 합니다.',
    category: 'data_service',
    idealValues: {
      [Axis.PUBLIC_INTEREST]: 90,
      [Axis.CONVENIENCE]: 30,
      [Axis.PRIVACY]: 90, // 의료 정보는 민감 정보
    },
     minThresholds: {
        [Axis.PRIVACY]: 85,
    },
    policyOptions: [
      { id: 'p4_1', category: 'anonymization', label: '가명 처리 (재식별 가능)', value: 2, isIdeal: false },
      { id: 'p4_2', category: 'anonymization', label: '익명 처리 (재식별 불가)', value: 10, isIdeal: true },
      { id: 'p4_3', category: 'consent', label: '포괄적 동의 (한 번 동의로 계속 사용)', value: 5, isIdeal: false },
      { id: 'p4_4', category: 'consent', label: '프로젝트별 개별 동의', value: 8, isIdeal: true },
    ],
    feedback: {
        balanced: "의료 기술 발전과 환자의 민감 정보 보호라는 두 마리 토끼를 잡았습니다.",
        tooRisky: "의료 정보 유출은 환자에게 돌이킬 수 없는 피해를 줄 수 있습니다.",
        tooRestrictive: "지나친 규제는 의학 발전과 공익을 저해할 수 있습니다. 익명화 기술을 활용하세요."
    }
  },
    {
    id: 's5',
    title: 'SNS 친구 사진 업로드',
    description: '친구들과 찍은 사진을 내 SNS에 올리려고 합니다. 친구의 얼굴이 선명하게 나왔습니다.',
    category: 'school',
    idealValues: {
      [Axis.PUBLIC_INTEREST]: 10,
      [Axis.CONVENIENCE]: 80,
      [Axis.PRIVACY]: 90,
    },
    minThresholds: {
        [Axis.PRIVACY]: 90,
    },
    policyOptions: [
      { id: 'p5_1', category: 'consent', label: '허락 없이 업로드', value: 0, isIdeal: false },
      { id: 'p5_2', category: 'consent', label: '당사자에게 물어보고 업로드', value: 10, isIdeal: true },
      { id: 'p5_3', category: 'scope', label: '전체 공개', value: 0, isIdeal: false },
      { id: 'p5_4', category: 'scope', label: '친구 공개', value: 5, isIdeal: true },
    ],
    feedback: {
        balanced: "친구의 초상권을 존중하는 멋진 태도입니다.",
        tooRisky: "동의 없는 사진 업로드는 초상권 침해이며 갈등의 원인이 됩니다.",
        tooRestrictive: "친구들끼리의 추억 공유는 자연스러운 일입니다. 동의만 구한다면 괜찮습니다."
    }
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    type: 'objective',
    difficulty: 'easy',
    question: '다음 중 개인정보를 "공익"을 위해 부득이하게 공유해야 하는 상황으로 가장 적절한 것은?',
    options: ['친구 생일 파티 사진 SNS 업로드', '감염병 확산 방지를 위한 확진자 동선 공개(익명)', '게임 아이템 거래 내역 공유', '반 등수 공개'],
    correctAnswer: '감염병 확산 방지를 위한 확진자 동선 공개(익명)',
    explanation: '감염병 예방은 타인의 생명과 안전에 직결된 공익적인 목적입니다.'
  },
  {
    id: 2,
    type: 'short_answer',
    difficulty: 'medium',
    question: '개인정보를 식별할 수 없도록, 더 이상 특정 개인을 알아볼 수 없게 처리하는 기술적 조치를 무엇이라고 할까요? (OOO)',
    correctAnswer: '비식별화',
    explanation: '비식별화(또는 익명화, 가명화)는 데이터 활용과 프라이버시 보호를 동시에 추구하는 핵심 기술입니다.'
  },
  {
    id: 3,
    type: 'essay',
    difficulty: 'hard',
    question: '공익을 이유로 개인정보를 무제한 공개할 때 발생할 수 있는 부작용에 대해 2문장 내외로 서술하시오.',
    explanation: '개인정보 자기결정권 침해, 낙인 효과, 사생활 감시 사회 도래 등의 부작용이 있습니다.'
  }
];
