import { Badge, Concept, QuizQuestion } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'c1',
    title: '암호화 (Encryption)',
    definition: '누구나 볼 수 있는 데이터를 약속된 규칙을 이용해 아무나 못 보는 형태로 바꾸는 것',
    keywords: ['변환', '비밀', '잠금'],
    example: '단톡방 대화 내용을 "Gdkkn" 같은 외계어로 바꿔서 서버에 보내기',
    misconception: {
      myth: '암호화는 데이터를 삭제하는 것이다?',
      truth: '삭제가 아니라, 열쇠가 없으면 읽을 수 없게 "변장"시키는 것입니다.',
    },
    checkQuestion: {
      question: '암호화의 주된 목적은 무엇일까요?',
      options: ['데이터 용량 줄이기', '허가되지 않은 사람의 접근 막기', '데이터 전송 속도 높이기'],
      answerIndex: 1,
    },
  },
  {
    id: 'c2',
    title: '복호화 (Decryption)',
    definition: '암호화된 데이터를 다시 원래의 알아볼 수 있는 형태로 되돌리는 것',
    keywords: ['복원', '해독', '풀기'],
    example: '친구에게 받은 "Gdkkn"을 다시 "Hello"로 바꿔서 화면에 띄우기',
    misconception: {
      myth: '복호화는 해킹과 같은 말이다?',
      truth: '복호화는 정당한 열쇠로 문을 여는 것이고, 해킹은 억지로 문을 따는 것입니다.',
    },
    checkQuestion: {
      question: '복호화를 위해 반드시 필요한 것은?',
      options: ['고성능 컴퓨터', '인터넷 연결', '올바른 키(Key)'],
      answerIndex: 2,
    },
  },
  {
    id: 'c3',
    title: '평문 & 암호문',
    definition: '평문은 원본 데이터, 암호문은 암호화 처리가 끝난 데이터',
    keywords: ['원본', '변환본', 'Plain/Cipher'],
    example: '평문: "비밀번호1234" → 암호문: "A1#fd9@!"',
    misconception: {
      myth: '암호문은 그냥 글자가 깨진 것이다?',
      truth: '단순 오류로 깨진 것이 아니라, 수학적 규칙에 따라 철저히 계산된 결과물입니다.',
    },
    checkQuestion: {
      question: '해커가 훔쳐갔을 때 봐도 안전한 형태는?',
      options: ['평문', '암호문', '둘 다 위험함'],
      answerIndex: 1,
    },
  },
  {
    id: 'c4',
    title: '키 (Key)',
    definition: '암호화와 복호화를 수행할 때 사용하는 비밀스러운 매개체(열쇠)',
    keywords: ['비밀값', '패스워드', '제어권'],
    example: '와이파이 접속 비밀번호, 현관문 도어락 비밀번호',
    misconception: {
      myth: '키는 길수록 무조건 좋다?',
      truth: '일반적으론 보안성이 높아지지만, 관리하기 어렵고 처리 속도가 느려질 수 있어 균형이 필요해요.',
    },
    checkQuestion: {
      question: '암호 알고리즘이 공개되어도 안전한 이유는?',
      options: ['키를 모르기 때문', '알고리즘이 너무 복잡해서', '컴퓨터가 느려서'],
      answerIndex: 0,
    },
  },
  {
    id: 'c5',
    title: '대칭키 (같은 키)',
    definition: '잠글 때(암호화)와 열 때(복호화) 사용하는 키가 똑같은 방식',
    keywords: ['빠름', '단순', '배송문제'],
    example: '현관문 비밀번호를 가족끼리 공유하는 상황 (누설되면 끝장!)',
    misconception: {
      myth: '대칭키는 낡은 방식이라 안 쓴다?',
      truth: '속도가 매우 빨라서 대용량 파일 전송 등에는 여전히 필수적으로 사용됩니다.',
    },
    checkQuestion: {
      question: '대칭키 방식의 가장 큰 단점은?',
      options: ['암호화 속도가 느리다', '키를 상대방에게 안전하게 전달하기 어렵다', '복호화가 불가능하다'],
      answerIndex: 1,
    },
  },
  {
    id: 'c6',
    title: '비대칭키 (다른 키)',
    definition: '잠그는 키(공개키)와 여는 키(개인키)가 서로 다른 쌍으로 존재하는 방식',
    keywords: ['공개키/개인키', '안전', '느림'],
    example: '누구나 편지를 우체통(공개키)에 넣을 순 있지만, 우체통을 여는 열쇠(개인키)는 집배원만 가짐',
    misconception: {
      myth: '비대칭키가 대칭키보다 무조건 우월하다?',
      truth: '보안성은 좋지만 계산이 복잡해 속도가 느려요. 보통 대칭키 교환 용도로 씁니다.',
    },
    checkQuestion: {
      question: '나만 볼 수 있게 친구가 편지를 보내려면 어떤 키로 암호화해야 할까?',
      options: ['나의 공개키', '나의 개인키', '친구의 개인키'],
      answerIndex: 0,
    },
  },
  {
    id: 'c7',
    title: '기밀성 (Confidentiality)',
    definition: '허락된 사람만 정보를 볼 수 있게 하는 성질',
    keywords: ['보안', '열람제한', '프라이버시'],
    example: '성적표가 든 봉투를 뜯지 않으면 내용을 볼 수 없게 밀봉하기',
    misconception: {
      myth: '기밀성만 있으면 완벽한 보안이다?',
      truth: '누가 내용을 몰래 바꾸거나(무결성 훼손), 보낸 척 속이는(인증 실패) 공격도 막아야 합니다.',
    },
    checkQuestion: {
      question: '기밀성을 위협하는 공격은?',
      options: ['도청(Sniffing)', '데이터 변조', '서버 다운'],
      answerIndex: 0,
    },
  },
  {
    id: 'c8',
    title: '무결성 & 인증',
    definition: '데이터가 변조되지 않았음(무결성)과 보낸 사람이 진짜임(인증)을 확인',
    keywords: ['변조방지', '신원확인', '전자서명'],
    example: '수행평가 파일을 제출했는데 중간에 누가 내용을 0점으로 바꾸지 않았는지 확인',
    misconception: {
      myth: '암호화만 하면 무결성도 저절로 된다?',
      truth: '암호화는 내용을 숨기는 것이고, 내용이 안 바뀌었는지 확인하려면 해시값 등 추가 기술이 필요해요.',
    },
    checkQuestion: {
      question: '친구 이름으로 온 메시지가 진짜 친구가 보낸 것인지 확인하는 것은?',
      options: ['기밀성', '가용성', '인증'],
      answerIndex: 2,
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    conceptId: 'c1',
    question: '다음 중 "암호화"가 필요한 상황으로 가장 적절한 것은?',
    options: ['공개된 학교 게시판에 급식 메뉴 올리기', '선생님께 수행평가 점수 이의신청 메일 보내기', '유튜브 인기 동영상 시청하기'],
    correctIndex: 1,
    explanation: '암호화는 남이 보면 안 되는 민감한 정보를 보호할 때 씁니다.',
    correction: '급식 메뉴나 공개 영상은 비밀이 아니지만, 개인 성적 관련 내용은 보호가 필요해요.',
    retryQuestion: {
      question: '카페 와이파이에서 인터넷 뱅킹을 할 때 암호화가 안 된다면?',
      options: ['속도가 빨라진다', '통장 비밀번호가 털릴 수 있다', '은행 서버가 고장 난다'],
      correctIndex: 1,
    }
  },
  {
    id: 'q2',
    conceptId: 'c4',
    question: '키(Key) 관리에 대한 설명으로 올바른 것은?',
    options: ['기억하기 쉽게 1234로 설정한다', '여러 사이트에서 똑같은 키를 쓴다', '주기적으로 변경하고 남에게 알려주지 않는다'],
    correctIndex: 2,
    explanation: '키는 암호를 푸는 유일한 수단이므로 유출되면 모든 보안이 뚫립니다.',
    correction: '쉬운 키나 재사용된 키는 해커가 추측하기 쉬워 매우 위험합니다.',
    retryQuestion: {
      question: '현관문 비밀번호(키)를 친구들에게 모두 알려주면 발생하는 문제는?',
      options: ['집에 들어가기 편해진다', '기밀성이 깨진다', '무결성이 강화된다'],
      correctIndex: 1,
    }
  },
  {
    id: 'q3',
    conceptId: 'c3',
    question: '암호화된 데이터(암호문)를 중간에 해커가 가로챘습니다. 어떤 일이 벌어질까요?',
    options: ['내용을 바로 읽을 수 있다', '키가 없으면 내용을 알 수 없다', '파일이 자동으로 폭파된다'],
    correctIndex: 1,
    explanation: '암호문은 키 없이는 무의미한 문자열일 뿐입니다.',
    correction: '해킹 영화처럼 파일이 폭파되진 않아요. 단지 "읽을 수 없는 상태"일 뿐입니다.',
    retryQuestion: {
      question: '평문을 암호문으로 바꾸는 과정을 무엇이라 하나요?',
      options: ['압축', '암호화', '복호화'],
      correctIndex: 1,
    }
  },
  {
    id: 'q4',
    conceptId: 'c6',
    question: '비대칭키 암호화 방식에서 "공개키"의 역할은?',
    options: ['누구나 데이터를 잠글 수 있게 공개한다', '나만 데이터를 볼 수 있게 숨긴다', '데이터 전송 속도를 높인다'],
    correctIndex: 0,
    explanation: '공개키는 우체통처럼 누구나 넣을 수 있게 공개하는 키입니다.',
    correction: '푸는 열쇠(개인키)는 나만 가지고, 잠그는 열쇠(공개키)는 뿌리는 방식입니다.',
    retryQuestion: {
      question: '비대칭키 방식에서 "개인키"를 잃어버리면?',
      options: ['다시 다운로드 받으면 된다', '암호문을 영원히 못 푼다', '공개키로 풀면 된다'],
      correctIndex: 1,
    }
  }
  // Simplified to 4 for demo brevity, but logic supports 10.
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: '시작이 반이다',
    description: '첫 번째 개념 카드 학습 완료',
    icon: '🚀',
    unlocked: false,
    condition: (state) => Object.values(state.masteryByConcept).some(v => v > 0)
  },
  {
    id: 'b2',
    name: '퀴즈 루키',
    description: '퀴즈에서 100점 획득 (누적)',
    icon: '🎯',
    unlocked: false,
    condition: (state) => state.score >= 100
  },
  {
    id: 'b3',
    name: '개념 마스터',
    description: '3개 이상의 개념 마스터리 80점 이상',
    icon: '👑',
    unlocked: false,
    condition: (state) => Object.values(state.masteryByConcept).filter(v => v >= 80).length >= 3
  },
  {
    id: 'b4',
    name: '끈기의 화신',
    description: '3일 연속 학습 달성',
    icon: '🔥',
    unlocked: false,
    condition: (state) => state.streak >= 3
  },
  {
    id: 'b5',
    name: '보안관',
    description: '시뮬레이션 위험도 0점 달성',
    icon: '🛡️',
    unlocked: false,
    condition: (state) => true // Handled manually in simulation component logic
  },
  {
    id: 'b6',
    name: '만점자',
    description: '레벨 5 달성',
    icon: '🏆',
    unlocked: false,
    condition: (state) => state.level >= 5
  }
];
