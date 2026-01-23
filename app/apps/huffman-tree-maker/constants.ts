import { Badge, QuizQuestion, Reflection } from './types';

export const APP_KEYS = {
  SAVES: 'app4_treeSaves',
  MASTERY: 'app4_masteryMap',
  WRONG: 'app4_wrongNotes',
  BADGES: 'app4_badges',
  STREAK: 'app4_streak',
  STATS: 'app4_stats',
  REFLECTIONS: 'app4_reflections'
};

export const BADGES: Badge[] = [
  { id: 'tree_master', name: '트리 장인', description: '허프만 트리 5회 완성', icon: '🌳' },
  { id: 'savings_king', name: '비트 절감왕', description: '압축률 50% 이상 달성', icon: '💾' },
  { id: 'tie_expert', name: '동률 처리 전문가', description: '동률 빈도 문제 해결', icon: '⚖️' },
  { id: 'quiz_whiz', name: '퀴즈 마스터', description: '모든 퀴즈 정답', icon: '🎓' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'OX',
    difficulty: 'EASY',
    question: '허프만 코딩에서 빈도수가 높은 문자는 더 짧은 코드를 부여받는다.',
    options: ['O', 'X'],
    answer: 'O',
    explanation: '자주 나오는 문자를 짧게 줄여야 전체 길이가 줄어듭니다.'
  },
  {
    id: 2,
    type: 'MULTIPLE',
    difficulty: 'EASY',
    question: '허프만 트리는 어떤 자료구조를 기반으로 하나요?',
    options: ['스택', '이진 트리', '해시 테이블', '큐'],
    answer: '이진 트리',
    explanation: '0과 1로 갈라지는 이진 트리 구조를 사용합니다.'
  },
  {
    id: 3,
    type: 'MULTIPLE',
    difficulty: 'NORMAL',
    question: '트리를 만들 때 가장 먼저 묶어야 하는 노드들은?',
    options: ['빈도수가 가장 큰 두 개', '빈도수가 가장 작은 두 개', '알파벳 순서', '랜덤'],
    answer: '빈도수가 가장 작은 두 개',
    explanation: '가장 작은 빈도끼리 묶어 아래쪽(긴 코드)으로 보내야 합니다.'
  },
  {
    id: 4,
    type: 'OX',
    difficulty: 'NORMAL',
    question: '허프만 코딩의 결과는 항상 유일하다.',
    options: ['O', 'X'],
    answer: 'X',
    explanation: '빈도수가 같은 경우 묶는 순서나 좌우 배치에 따라 코드가 달라질 수 있습니다.'
  },
  {
    id: 5,
    type: 'MULTIPLE',
    difficulty: 'NORMAL',
    question: '압축 전 8비트 ASCII 문자 10개를 허프만으로 압축했더니 총 45비트가 되었습니다. 절감된 비트 수는?',
    options: ['35', '45', '80', '15'],
    answer: '35',
    explanation: '8 * 10 = 80비트(원본). 80 - 45 = 35비트 절감.'
  },
  {
    id: 6,
    type: 'SHORT',
    difficulty: 'HARD',
    question: '빈도수가 모두 동일한 문자 4개(A,B,C,D)를 허프만 코딩하면 모든 문자의 비트 길이는 몇 비트인가?',
    answer: '2',
    explanation: '모두 균등하게 분포되므로 완전 이진 트리가 되어 모두 2비트가 됩니다.'
  },
  {
    id: 7,
    type: 'OX',
    difficulty: 'HARD',
    question: '허프만 코드는 접두어(Prefix) 규칙을 만족해야 한다.',
    options: ['O', 'X'],
    answer: 'O',
    explanation: '어떤 문자의 코드가 다른 문자의 코드의 앞부분이 되면 안 됩니다.'
  },
  {
    id: 8,
    type: 'MULTIPLE',
    difficulty: 'NORMAL',
    question: 'GIF나 PNG 이미지 포맷도 허프만 코딩과 유사한 원리를 사용할까요?',
    options: ['전혀 다르다', '사용한다', '비디오만 사용한다', '오디오만 사용한다'],
    answer: '사용한다',
    explanation: '데이터 압축의 마지막 단계에서 엔트로피 코딩(허프만 등)을 자주 사용합니다.'
  },
  {
    id: 9,
    type: 'SHORT',
    difficulty: 'HARD',
    question: '빈도수: A(5), B(9), C(12), D(13), E(16), F(45). 가장 먼저 묶이는 두 문자는?',
    answer: 'AB',
    explanation: 'A(5)와 B(9)가 가장 작으므로 먼저 묶입니다.'
  },
  {
    id: 10,
    type: 'OX',
    difficulty: 'EASY',
    question: '왼쪽 자식 노드에는 보통 1을, 오른쪽에는 0을 부여하는 것이 강제 규칙이다.',
    options: ['O', 'X'],
    answer: 'X',
    explanation: '관습적으로 0, 1을 쓰지만 반대로 해도 상관없습니다 (일관성만 있다면).'
  }
];

export const REFLECTION_QUESTIONS: Reflection[] = [
  {
    id: 'ref_1',
    question: '만약 우리가 쓰는 문자 집합이 이모지(Emoji)까지 포함해서 수천 개라면, 허프만 트리는 어떻게 변할까요?',
    userAnswer: '',
    isCompleted: false,
  },
  {
    id: 'ref_2',
    question: '모든 문자가 정확히 한 번씩만 등장한다면(빈도가 모두 1), 허프만 코딩을 써도 파일 크기가 줄어들까요?',
    userAnswer: '',
    isCompleted: false,
  },
  {
    id: 'ref_3',
    question: '학교 급식 메뉴판 문자열을 허프만 코딩으로 더 압축하고 싶습니다. 메뉴 이름을 어떻게 바꾸면 좋을까요?',
    userAnswer: '',
    isCompleted: false,
  },
];
