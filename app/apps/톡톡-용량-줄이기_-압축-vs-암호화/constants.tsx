import { ConceptCard, QuizQuestion, Scenario, Badge } from './types';
import React from 'react';
import { Shield, Zap, FileText } from 'lucide-react';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'compression',
    title: '압축 (Compression)',
    definition: '데이터의 중복을 제거하거나 불필요한 정보를 줄여 용량을 작게 만드는 기술',
    keywords: ['효율성', '중복 제거', '용량 절약'],
    example: '여행 가방 쌀 때 옷을 돌돌 말아 넣거나 진공팩 사용하기',
    misconception: {
      text: '압축하면 화질이 무조건 나빠진다?',
      correction: '아니요! 무손실 압축은 화질 변화 없이 용량만 줄입니다.',
    },
    checkQuestion: {
      question: '압축의 가장 큰 목적 두 가지는?',
      answer: '저장 공간 절약, 전송 속도 향상',
    },
  },
  {
    id: 'lossless',
    title: '무손실 압축 (Lossless)',
    definition: '압축을 풀었을 때 원본 데이터가 100% 완벽하게 복원되는 방식',
    keywords: ['100% 복원', '데이터 보존', 'ZIP/PNG'],
    example: '아래아한글 문서(.hwp)나 엑셀 파일(.xlsx) 압축',
    misconception: {
      text: '무손실 압축은 용량이 엄청나게 줄어든다?',
      correction: '손실 압축에 비해 줄어드는 비율(압축률)은 낮습니다.',
    },
    checkQuestion: {
      question: '원본과 동일하게 복원 가능한 압축 방식은?',
      answer: '무손실 압축',
    },
  },
  {
    id: 'lossy',
    title: '손실 압축 (Lossy)',
    definition: '사람이 잘 느끼지 못하는 정보를 버려서 용량을 획기적으로 줄이는 방식',
    keywords: ['정보 삭제', '높은 압축률', 'JPEG/MP3'],
    example: '스트리밍 음악 듣기 (MP3), 유튜브 영상 보기',
    misconception: {
      text: '손실 압축된 파일은 다시 원본으로 되돌릴 수 있다?',
      correction: '한 번 버린 데이터는 영원히 복구할 수 없습니다.',
    },
    checkQuestion: {
      question: '손실 압축의 대표적인 이미지 파일 형식은?',
      answer: 'JPEG (또는 JPG)',
    },
  },
  {
    id: 'rle',
    title: 'RLE (Run-Length Encoding)',
    definition: '연속되는 데이터를 개수로 표현하여 줄이는 아주 단순한 무손실 압축',
    keywords: ['연속 데이터', '단순함', 'AAAAA→5A'],
    example: '흰 배경이 많은 그림판 그림 (BMP)',
    misconception: {
      text: 'RLE는 모든 파일에 효과적이다?',
      correction: '데이터가 불규칙하면(예: 사진) 오히려 용량이 커질 수도 있습니다.',
    },
    checkQuestion: {
      question: 'BBBBB를 RLE로 표현하면?',
      answer: '5B',
    },
  },
  {
    id: 'encryption',
    title: '암호화 (Encryption)',
    definition: '허가된 사람만 내용을 볼 수 있도록 데이터를 변환하는 보안 기술',
    keywords: ['비밀번호', '보안', '열쇠(Key)'],
    example: '현관 도어락 비밀번호, 카카오톡 비밀 채팅',
    misconception: {
      text: '암호화를 하면 용량이 줄어든다?',
      correction: '아니요! 암호화는 내용을 숨기는 것이지 용량을 줄이는 것이 아닙니다.',
    },
    checkQuestion: {
      question: '압축과 암호화 중 "내용 숨기기"가 목적인 것은?',
      answer: '암호화',
    },
  },
  {
    id: 'huffman',
    title: '허프만 코딩 (Huffman)',
    definition: '자주 나오는 문자는 짧은 코드로, 드물게 나오는 문자는 긴 코드로 변환',
    keywords: ['빈도수', '이진 트리', '가변 길이'],
    example: '자주 쓰는 "이/가/은/는"은 짧게, 잘 안 쓰는 "닢/갉"은 길게',
    misconception: {
      text: '모든 글자를 똑같은 길이로 줄인다?',
      correction: '빈도수에 따라 길이(비트 수)가 달라집니다.',
    },
    checkQuestion: {
      question: '허프만 코딩은 데이터의 무엇을 기준으로 코드를 만드나요?',
      answer: '등장 빈도수(자주 나오는 정도)',
    },
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'homework_pdf',
    title: '수행평가 PDF 단톡방 공유',
    description: '30MB짜리 수행평가 보고서를 반 단톡방에 올려야 한다. 친구들이 폰으로 바로 확인해야 한다.',
    baseSize: '30MB',
    targets: { quality: 80, speed: 90, security: 30 }, // Text readability needs quality, speed is key
    recommended: { compression: 'lossless', encryption: false },
  },
  {
    id: 'grade_photo',
    title: '성적표 사진 친구 전송',
    description: '이번 중간고사 성적표를 찍어서 베프에게 카톡으로 보낸다. 남이 보면 절대 안 된다.',
    baseSize: '5MB',
    targets: { quality: 60, speed: 60, security: 100 },
    recommended: { compression: 'lossy', encryption: true }, // Encryption is paramount
  },
  {
    id: 'club_video',
    title: '동아리 홍보 영상 업로드',
    description: '학교 홈페이지에 올릴 500MB짜리 고화질 댄스 영상. 용량 제한이 100MB다.',
    baseSize: '500MB',
    targets: { quality: 70, speed: 80, security: 10 },
    recommended: { compression: 'lossy', encryption: false },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // EASY
  {
    id: 1,
    difficulty: 'easy',
    type: 'choice',
    question: '압축을 하는 가장 주된 목적은 무엇인가요?',
    options: ['바이러스를 막기 위해', '저장 공간 절약 및 전송 효율', '파일 이름을 예쁘게 하려고', '해킹을 방지하려고'],
    correctAnswer: '저장 공간 절약 및 전송 효율',
    feedback: {
      reason: '압축은 데이터를 효율적으로 관리하기 위한 기술입니다.',
      correction: '보안은 암호화의 영역입니다.',
      retry: '그렇다면 암호화의 목적은 무엇일까요?',
    },
  },
  {
    id: 2,
    difficulty: 'easy',
    type: 'ox',
    question: '암호화 기술을 사용하면 파일의 용량이 획기적으로 줄어든다.',
    correctAnswer: 'X',
    feedback: {
      reason: '암호화는 데이터를 "변환"하여 숨기는 것이지 "축소"하는 것이 아닙니다.',
      correction: '오히려 암호화 정보를 추가하느라 용량이 약간 늘어날 수도 있습니다.',
    },
  },
  {
    id: 3,
    difficulty: 'easy',
    type: 'short',
    question: '압축을 풀었을 때 원본과 100% 동일하게 복원되는 압축 방식을 무엇이라 하나요?',
    correctAnswer: '무손실', // contains matching logic will be loosely applied
    feedback: {
      reason: '손실이 없다는 뜻입니다.',
      correction: '반대는 "손실 압축"입니다.',
    },
  },
  {
    id: 4,
    difficulty: 'easy',
    type: 'choice',
    question: '다음 중 손실 압축 방식을 사용하는 파일 형식은?',
    options: ['ZIP', 'PNG', 'JPEG', 'TXT'],
    correctAnswer: 'JPEG',
    feedback: {
      reason: 'JPEG는 사람 눈에 잘 안 보이는 색상 정보를 제거하여 사진 용량을 줄입니다.',
      correction: 'ZIP, PNG는 무손실 압축입니다.',
    },
  },
  // MEDIUM
  {
    id: 5,
    difficulty: 'medium',
    type: 'choice',
    question: '주민등록번호가 적힌 문서를 이메일로 보낼 때 가장 고려해야 할 요소는?',
    options: ['최고 화질', '빠른 전송 속도', '보안(암호화)', '색감 보정'],
    correctAnswer: '보안(암호화)',
    feedback: {
      reason: '민감한 개인정보는 유출되면 위험합니다.',
      correction: '전송 속도보다 정보 보호가 우선순위입니다.',
    },
  },
  {
    id: 6,
    difficulty: 'medium',
    type: 'short',
    question: '빈칸 채우기: 압축 = 효율성, 암호화 = _____',
    correctAnswer: ['보안', '보호', '기밀성'],
    feedback: {
      reason: '각 기술의 핵심 목표를 묻는 문제입니다.',
      correction: '암호화는 자물쇠를 채우는 것과 같습니다.',
    },
  },
  {
    id: 7,
    difficulty: 'medium',
    type: 'essay',
    question: '단톡방에 과제 영상을 올릴 때 "손실 압축"을 써도 되는 이유를 서술하세요.',
    correctAnswer: '사람의 눈/귀는 미세한 정보 차이를 못 느끼므로, 용량을 줄여 빨리 보내는 게 이득이다.',
    feedback: {
      reason: '동영상은 데이터가 매우 크기 때문에 효율이 중요합니다.',
      correction: '약간의 화질 저하를 감수하고 전송 편의성을 택하는 트레이드오프입니다.',
    },
  },
  {
    id: 8,
    difficulty: 'medium',
    type: 'choice',
    question: 'JPEG보다 PNG(무손실)가 더 유리한 경우는?',
    options: ['풍경 사진 저장', '영화 파일 저장', '배경이 투명한 로고 아이콘', '2시간짜리 녹음 파일'],
    correctAnswer: '배경이 투명한 로고 아이콘',
    feedback: {
      reason: 'PNG는 투명 배경을 지원하고, 글자나 로고처럼 경계가 뚜렷한 이미지에 적합합니다.',
      correction: 'JPEG는 투명도를 지원하지 않습니다.',
    },
  },
  // HARD
  {
    id: 9,
    difficulty: 'hard',
    type: 'essay',
    question: '어떤 파일에 "압축"과 "암호화"를 동시에 적용하면 전송 시 어떤 장단점이 있나요?',
    correctAnswer: '장점: 용량이 줄고 보안이 강화됨. 단점: 압축/해제 및 암/복호화에 시간이 걸림.',
    feedback: {
      reason: '두 기술을 섞으면 두 마리 토끼(효율, 보안)를 잡지만 처리 비용(시간, CPU)이 듭니다.',
      correction: '보통 압축을 먼저 하고 암호화를 합니다.',
    },
  },
  {
    id: 10,
    difficulty: 'hard',
    type: 'choice', // Changed to choice for simplicity in MVP, logic can be extended
    question: '다음 상황에서 가장 적절한 행동은? "은행 비밀번호가 적힌 메모장 파일"',
    options: ['압축만 한다', '암호화만 한다', '손실 압축을 한다', '그냥 보낸다'],
    correctAnswer: '암호화만 한다',
    feedback: {
      reason: '텍스트 파일은 용량이 작아 압축이 필수가 아니지만, 보안은 필수입니다.',
      correction: '텍스트에 손실 압축을 쓰면 글자가 깨질 수 있습니다.',
    },
  },
];

export const BADGES: Badge[] = [
  {
    id: 'security_expert',
    name: '보안 감별사',
    description: '암호화 관련 퀴즈를 모두 맞히거나 보안 점수 100을 달성함',
    icon: 'Shield',
    condition: (state) => state.mastery['encryption'] >= 100,
  },
  {
    id: 'quality_guard',
    name: '품질 지킴이',
    description: '무손실 압축 개념을 완벽하게 이해함',
    icon: 'Zap',
    condition: (state) => state.mastery['lossless'] >= 100,
  },
  {
    id: 'explainer',
    name: '설명왕',
    description: '서술형 문제에 답변을 3회 이상 작성함',
    icon: 'FileText',
    condition: (state) => Object.keys(state.reflections).length >= 3,
  },
];