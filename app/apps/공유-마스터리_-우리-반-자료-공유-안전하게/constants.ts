import { ConceptCard, QuizQuestion, CaseStudy, Badge, UserState } from './types';

// 1. 개념 카드 데이터
export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'c1',
    title: '네트워크(Network)',
    definition: '두 대 이상의 컴퓨터나 장치가 연결되어 정보를 주고받는 그물망.',
    keywords: ['연결', '정보 공유', '자원 공유'],
    example: '우리 반 교실의 PC, 내 스마트폰, 교무실 프린터가 모두 연결된 상태.',
    misconception: '인터넷과 네트워크는 같은 말이다?',
    correction: '아니야! 네트워크가 더 큰 개념이고, 전 세계가 연결된 가장 큰 네트워크가 인터넷이야.',
    checkQuestion: '집에서 노트북과 프린터를 선으로 연결해서 인쇄했다면, 이것도 네트워크일까?'
  },
  {
    id: 'c2',
    title: '전송 매체 (유선 vs 무선)',
    definition: '데이터가 이동하는 물리적인 통로.',
    keywords: ['케이블(LAN)', '전파', '빛'],
    example: 'PC방은 랜선(유선)으로, 카페에서는 와이파이(무선)로 접속하지.',
    misconception: '무선이 유선보다 항상 빠르고 좋다?',
    correction: '무선은 편리하지만, 유선보다 보안이 취약하고 신호 간섭을 받을 수 있어.',
    checkQuestion: '스마트폰으로 유튜브를 볼 때 사용하는 전송 매체는 눈에 보일까?'
  },
  {
    id: 'c3',
    title: '클라우드 공유',
    definition: '인터넷상의 서버에 데이터를 저장해두고 언제 어디서나 접속하는 서비스.',
    keywords: ['서버 저장', '접근성', '동기화'],
    example: '조별 과제 PPT를 구글 드라이브에 올리고 팀원들이 동시에 수정하는 것.',
    misconception: '클라우드는 하늘에 떠 있는 구름에 저장하는 것이다?',
    correction: '실제로는 거대한 데이터 센터(건물) 안에 있는 고성능 컴퓨터(서버)에 저장되는 거야.',
    checkQuestion: '클라우드에 올린 파일은 내 컴퓨터가 꺼져 있어도 친구가 볼 수 있을까?'
  },
  {
    id: 'c4',
    title: '근거리 무선 통신 (Bluetooth/NFC)',
    definition: '가까운 거리에서 장치 간에 데이터를 주고받는 무선 기술.',
    keywords: ['페어링', '초근접', '저전력'],
    example: '친구에게 에어드롭(AirDrop)으로 수행평가 사진 보내기, 버스 카드 찍기(NFC).',
    misconception: '블루투스는 와이파이처럼 인터넷 연결이 필요하다?',
    correction: '아니! 기기끼리 직접(Direct) 연결하는 거라 인터넷 공유기(AP)가 없어도 돼.',
    checkQuestion: '블루투스 이어폰을 연결할 때 인터넷 요금이 나갈까?'
  },
  {
    id: 'c5',
    title: '공유 권한 (Permission)',
    definition: '누가 파일을 보고, 수정하고, 삭제할 수 있는지 정해주는 규칙.',
    keywords: ['읽기 전용', '편집 가능', '소유자'],
    example: '반톡방 공지사항은 "읽기"만 가능하고, 조별 문서는 "편집"도 가능하게 설정.',
    misconception: '링크만 있으면 누구나 들어와도 상관없다?',
    correction: '편집 권한을 아무에게나 주면, 누군가 과제 파일을 다 지워버릴 수도 있어!',
    checkQuestion: '친구에게 과제를 보여주기만 하려는데 "편집자" 권한을 주면 안전할까?'
  },
  {
    id: 'c6',
    title: '공유 시 보안 위협',
    definition: '네트워크를 통해 자료를 주고받을 때 발생할 수 있는 위험 요소.',
    keywords: ['악성코드', '피싱', '스니핑'],
    example: '무료 와이파이로 로그인했다가 비밀번호가 털리거나, 모르는 파일을 받았다가 랜섬웨어 감염.',
    misconception: '비밀번호가 걸려 있는 파일은 무조건 안전하다?',
    correction: '파일 자체에 악성코드가 숨겨져 있을 수 있어. 출처가 불분명하면 열지 마!',
    checkQuestion: '카페 공용 와이파이로 부모님 신용카드를 사용하는 건 안전할까?'
  },
  {
    id: 'c7',
    title: '저작권과 공유 윤리',
    definition: '창작물을 만든 사람의 권리를 보호하고, 올바르게 공유하는 태도.',
    keywords: ['출처 표시', '무단 배포 금지', '초상권'],
    example: '인터넷 기사를 캡처해서 반톡방에 올리는 건 저작권 위반일 수 있음.',
    misconception: '교육 목적인 학교 과제에는 아무거나 다 써도 된다?',
    correction: '수업 목적이라도 "출처"를 밝혀야 하고, 인터넷에 다시 올리는 건 또 다른 문제야.',
    checkQuestion: '친구가 찍힌 웃긴 사진을 허락 없이 단톡방에 올리는 건 괜찮을까?'
  }
];

// 2. 퀴즈 데이터 (샘플 10개만 구성, 실제로는 더 많아야 함)
export const QUIZZES: QuizQuestion[] = [
  // Easy
  { id: 'q1', conceptId: 'c1', difficulty: 'easy', question: '다음 중 네트워크의 장점이 아닌 것은?', options: ['자료를 쉽게 공유할 수 있다.', '프린터 같은 장비를 공동으로 쓸 수 있다.', '바이러스가 더 빨리 퍼질 수 있다.', '서로 다른 장소에서 소통할 수 있다.'], correctIndex: 2, explanation: '바이러스 확산은 네트워크의 위험성(단점)입니다.' },
  { id: 'q2', conceptId: 'c3', difficulty: 'easy', question: '내 PC가 꺼져 있어도 친구가 파일을 내려받을 수 있는 공유 방식은?', options: ['USB 전달', '블루투스 전송', '클라우드 공유', '이메일 첨부 후 내 메일 삭제'], correctIndex: 2, explanation: '클라우드는 24시간 운영되는 서버에 저장되므로 내 PC 상태와 무관합니다.' },
  { id: 'q3', conceptId: 'c5', difficulty: 'easy', question: '수행평가 결과물을 친구들이 수정하지 못하고 보기만 하게 하려면 어떤 권한을 줘야 할까?', options: ['편집자', '소유자', '뷰어(읽기 전용)', '관리자'], correctIndex: 2, explanation: '뷰어 권한은 내용을 볼 수만 있고 변경할 수 없습니다.' },
  
  // Medium
  { id: 'q4', conceptId: 'c2', difficulty: 'medium', question: '무선 네트워크(Wi-Fi)에 대한 설명으로 옳은 것은?', options: ['유선보다 보안이 강력하다.', '전파를 이용하므로 장애물의 영향을 받는다.', '랜선이 반드시 필요하다.', '거리 제한 없이 어디서나 연결된다.'], correctIndex: 1, explanation: '무선 신호(전파)는 벽이나 거리에 따라 신호가 약해질 수 있습니다.' },
  { id: 'q5', conceptId: 'c4', difficulty: 'medium', question: '블루투스(Bluetooth)의 특징으로 알맞은 것은?', options: ['전 세계 어디서나 연결 가능하다.', '인터넷 공유기(AP)가 필수다.', '가까운 거리에서 기기 간 직접 연결한다.', '대용량 영화 전송에 가장 적합하다.'], correctIndex: 2, explanation: '블루투스는 근거리 무선 통신 기술로 기기 간 페어링을 통해 연결됩니다.' },
  { id: 'q6', conceptId: 'c6', difficulty: 'medium', question: '공공장소 무료 와이파이 사용 시 주의사항으로 가장 적절한 것은?', options: ['금융 거래나 로그인을 자제한다.', '모든 파일을 공유 폴더에 넣는다.', '비밀번호 없는 와이파이가 가장 좋다.', '블루투스를 항상 켜둔다.'], correctIndex: 0, explanation: '공용 와이파이는 해킹(스니핑) 위험이 있으므로 민감한 정보 입력은 피해야 합니다.' },
  
  // Hard
  { id: 'q7', conceptId: 'c7', difficulty: 'hard', question: '학교 수행평가 PPT에 인터넷 이미지를 사용할 때 올바른 행동은?', options: ['워터마크를 자르고 사용한다.', '출처를 명확히 밝히고 교육적 목적으로만 쓴다.', '유료 이미지도 캡처해서 그냥 쓴다.', '친구에게 받은 이미지는 확인 없이 쓴다.'], correctIndex: 1, explanation: '저작권법상 교육 목적이라도 출처 표시는 필수이며, 이용 범위를 지켜야 합니다.' },
  { id: 'q8', conceptId: 'c5', difficulty: 'hard', question: '구글 드라이브 공유 링크 설정 중 "링크가 있는 모든 사용자"에게 "편집" 권한을 주었을 때의 위험성은?', options: ['로그인을 해야만 볼 수 있어 불편하다.', '링크가 유출되면 모르는 사람이 파일을 삭제할 수 있다.', '파일 용량이 자동으로 줄어든다.', '바이러스가 자동으로 치료된다.'], correctIndex: 1, explanation: '링크 소유자가 모두 편집 가능하면, 악의적인 사용자가 들어와 데이터를 훼손할 수 있습니다.' },
  { id: 'q9', conceptId: 'c6', difficulty: 'hard', question: '랜섬웨어(Ransomware) 예방을 위한 행동으로 틀린 것은?', options: ['중요 자료는 정기적으로 백업한다.', '출처 불명의 메일 첨부파일은 열지 않는다.', '운영체제와 백신을 최신으로 업데이트한다.', '파일 확장자가 .exe인 파일은 무조건 실행해본다.'], correctIndex: 3, explanation: '.exe 파일은 실행 파일이므로 악성코드일 가능성이 높습니다. 무조건 실행은 매우 위험합니다.' },
  { id: 'q10', conceptId: 'c1', difficulty: 'hard', question: '다음 상황 중 "클라이언트-서버" 모델이 아닌 것은?', options: ['웹 브라우저로 네이버 접속', '카카오톡으로 메시지 전송(서버 경유)', '에어드롭으로 친구에게 사진 전송', '유튜브 동영상 시청'], correctIndex: 2, explanation: '에어드롭은 기기끼리 직접 연결하는 P2P(Peer-to-Peer) 방식에 가깝습니다.' },
];

// 3. 사례 카드
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case1',
    title: 'PC방에서 수행평가 마무리',
    scenario: 'PC방 컴퓨터에 로그인해서 과제를 하고, 로그아웃을 안 하고 그냥 나왔다.',
    tags: ['위험', '편리'],
    feedback: '매우 위험해! 다음 사람이 네 계정으로 들어가서 개인정보를 털거나 과제를 지울 수 있어. 공용 PC는 반드시 로그아웃 & 흔적 지우기!'
  },
  {
    id: 'case2',
    title: '단톡방에 친구 엽사 공유',
    scenario: '친구가 자는 모습이 웃겨서 찍은 뒤, 반 단톡방(30명)에 올렸다.',
    tags: ['위험'],
    feedback: '초상권 침해와 사이버 불링이 될 수 있어. 당사자의 동의 없는 사진 공유는 절대 금지!'
  },
  {
    id: 'case3',
    title: '클라우드 폴더로 조별 과제',
    scenario: '팀원들에게만 "편집 권한"을 준 구글 폴더를 만들어 자료를 모았다.',
    tags: ['안전', '편리'],
    feedback: '아주 훌륭해! 권한을 제한해서 보안을 챙겼고, 클라우드로 협업 효율도 높였어.'
  }
];

// 4. 배지 정의
export const BADGES: Badge[] = [
  {
    id: 'b_starter',
    name: '공유 새내기',
    description: '레벨 2 달성',
    icon: '🌱',
    earned: false,
    condition: (state) => state.level >= 2
  },
  {
    id: 'b_streak',
    name: '꾸준함의 힘',
    description: '3일 연속 학습',
    icon: '🔥',
    earned: false,
    condition: (state) => state.streak >= 3
  },
  {
    id: 'b_master',
    name: '개념 마스터',
    description: '모든 개념 숙련도 80 이상',
    icon: '🎓',
    earned: false,
    condition: (state) => Object.values(state.masteryMap).length === CONCEPT_CARDS.length && Object.values(state.masteryMap).every(score => score >= 80)
  },
  {
    id: 'b_security',
    name: '보안관',
    description: '퀴즈에서 보안 관련 문제 3회 정답',
    icon: '🛡️',
    earned: false,
    condition: (state) => state.quizHistory.length >= 3 // Simplified logic for demo
  }
];