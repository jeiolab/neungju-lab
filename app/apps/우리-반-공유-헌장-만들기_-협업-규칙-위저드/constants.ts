import { QuizQuestion } from './types';

export const WIZARD_STEPS = [
  {
    id: 1,
    title: '공유 대상',
    description: '무엇을 공유할 것인가요?',
    key: 'target',
    options: ['학급 활동 사진', '수업 발표 자료 (PPT/PDF)', '공동 작업 문서', '참고용 인터넷 자료'],
    type: 'checkbox'
  },
  {
    id: 2,
    title: '공유 범위',
    description: '어디까지 공개할 수 있나요?',
    key: 'scope',
    options: ['우리 반 전체', '해당 모둠원만', '선생님과 나만', '외부인 포함(주의 필요)'],
    type: 'radio'
  },
  {
    id: 3,
    title: '권한 설정',
    description: '친구들이 무엇을 할 수 있나요?',
    key: 'permissions',
    options: ['보기(Read)만 가능', '댓글(Comment) 달기 가능', '수정(Edit) 가능', '파일 다운로드 허용'],
    type: 'checkbox'
  },
  {
    id: 4,
    title: '보안 규칙',
    description: '안전하게 공유하려면?',
    key: 'security',
    options: ['비밀번호 설정하기', '공유 링크 유효기간 설정', '2단계 인증 사용(계정 보호)', '공용 PC 사용 후 로그아웃'],
    type: 'checkbox'
  },
  {
    id: 5,
    title: '저작권 및 개인정보',
    description: '남의 권리와 나의 정보를 지키는 법',
    key: 'copyright',
    options: ['인물 사진은 얼굴 가리기(블러)', '자료 출처 반드시 표기', '개인정보(전번 등) 포함 금지', '상업적 폰트/이미지 사용 금지'],
    type: 'checkbox'
  },
  {
    id: 6,
    title: '문제 발생 시 대응',
    description: '규칙을 어기거나 문제가 생기면?',
    key: 'response',
    options: ['즉시 자료 삭제 후 선생님께 알림', '오류 수정 후 재공유', '악성코드는 신고 버튼 누르기', '당사자에게 정중히 삭제 요청'],
    type: 'radio'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "다른 사람의 창작물을 허락 없이 내 발표 자료에 넣어서 공유했다. 어떤 문제인가?",
    options: ["보안 문제", "저작권 침해", "네트워크 오류", "권한 설정 오류"],
    correctIndex: 1,
    relatedTopic: 'copyright',
    explanation: "타인의 창작물을 무단으로 사용하는 것은 저작권 침해입니다."
  },
  {
    id: 2,
    question: "공유 폴더에 '보기' 권한만 주었는데 친구가 파일을 삭제했다. 가능한 상황인가?",
    options: ["가능하다", "불가능하다", "바이러스 때문이라면 가능하다", "컴퓨터가 좋으면 가능하다"],
    correctIndex: 1,
    relatedTopic: 'permissions',
    explanation: "'보기' 권한만으로는 파일의 내용을 수정하거나 삭제할 수 없습니다."
  },
  {
    id: 3,
    question: "다음 중 공유할 때 개인정보 유출 위험이 가장 큰 행동은?",
    options: ["비밀번호를 걸어 공유하기", "내 전화번호가 적힌 문서를 전체 공개로 올리기", "친구 얼굴을 가리고 올리기", "출처를 밝히기"],
    correctIndex: 1,
    relatedTopic: 'copyright', // Includes privacy
    explanation: "전화번호와 같은 개인정보가 전체 공개되면 보이스피싱 등에 악용될 수 있습니다."
  },
  {
    id: 4,
    question: "랜섬웨어 예방을 위해 가장 적절한 공유 습관은?",
    options: ["모르는 사람이 보낸 파일 열어보기", "백신 프로그램 끄기", "중요 파일 백업 및 출처 불분명 파일 받지 않기", "모든 파일에 편집 권한 주기"],
    correctIndex: 2,
    relatedTopic: 'response',
    explanation: "출처가 불분명한 파일은 실행하지 말고, 중요 파일은 항상 백업해야 합니다."
  },
  {
    id: 5,
    question: "팀 프로젝트 문서를 모둠원 모두가 함께 작성해야 한다. 적절한 권한은?",
    options: ["보기", "댓글", "편집", "소유자 양도"],
    correctIndex: 2,
    relatedTopic: 'permissions',
    explanation: "함께 내용을 작성하려면 '편집(Edit)' 권한이 필요합니다."
  },
  {
    id: 6,
    question: "공용 PC에서 로그인을 유지한 채 자리를 비웠다. 발생할 수 있는 문제는?",
    options: ["아무 문제 없다", "계정 도용 및 자료 유출", "인터넷 속도 저하", "저작권 생성"],
    correctIndex: 1,
    relatedTopic: 'security',
    explanation: "공용 PC에서 로그아웃하지 않으면 타인이 내 계정을 악용할 수 있습니다."
  },
  {
    id: 7,
    question: "친구의 사진을 SNS나 공유 폴더에 올릴 때 가장 먼저 해야 할 일은?",
    options: ["보정하기", "친구의 동의 구하기", "해시태그 달기", "댓글 막기"],
    correctIndex: 1,
    relatedTopic: 'copyright',
    explanation: "타인의 초상권 보호를 위해 반드시 당사자의 동의를 먼저 구해야 합니다."
  },
  {
    id: 8,
    question: "클라우드 공유의 장점이 아닌 것은?",
    options: ["언제 어디서나 접속 가능", "여러 명이 동시 편집 가능", "파일 유실 위험 감소(자동저장)", "인터넷이 없어도 실시간 동기화"],
    correctIndex: 3,
    relatedTopic: 'target', // General cloud concept
    explanation: "클라우드 서비스는 기본적으로 인터넷 연결이 되어야 실시간 동기화가 작동합니다."
  },
  {
    id: 9,
    question: "공유 링크의 유효 기간을 설정하는 이유는?",
    options: ["용량을 아끼기 위해", "오래된 자료를 통한 보안 위험을 줄이기 위해", "친구들을 재촉하기 위해", "인터넷 속도를 위해"],
    correctIndex: 1,
    relatedTopic: 'security',
    explanation: "불필요하게 오래 공유된 링크는 의도치 않은 유출 통로가 될 수 있습니다."
  },
  {
    id: 10,
    question: "누군가 공유 규칙을 어기고 내 파일을 지웠다. 올바른 대응은?",
    options: ["친구 파일을 나도 지운다", "감정적으로 싸운다", "버전 기록을 복구하고 규칙 재안내", "컴퓨터를 끈다"],
    correctIndex: 2,
    relatedTopic: 'response',
    explanation: "클라우드의 '버전 기록' 기능을 통해 복구하고, 헌장에 따른 규칙을 다시 상기시킵니다."
  }
];

export const INITIAL_CHARTER: any = {
  target: [],
  scope: '',
  permissions: [],
  security: [],
  copyright: [],
  response: '',
  customRule: '',
  lastUpdated: Date.now()
};