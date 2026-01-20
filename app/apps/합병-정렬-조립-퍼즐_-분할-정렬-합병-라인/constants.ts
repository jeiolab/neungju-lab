import { Badge, PipelineStep } from './types';

export const APP_NAME = "합병 정렬 조립 퍼즐";

export const BADGES: Badge[] = [
  {
    id: 'split_master',
    name: '분할 마스터',
    description: '퍼즐을 3회 이상 완료했습니다.',
    icon: '✂️',
    condition: (stats) => stats.completedPuzzles >= 3
  },
  {
    id: 'merge_artist',
    name: '합병 아티스트',
    description: '합병 게임에서 연속 10회 정답을 맞췄습니다.',
    icon: '🔗',
    condition: (stats) => stats.consecutiveMerges >= 10
  },
  {
    id: 'algo_guru',
    name: '알고리즘 고수',
    description: '레벨 5에 도달했습니다.',
    icon: '🎓',
    condition: (stats) => stats.level >= 5
  }
];

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: '1', label: '절반 나누기', type: 'SPLIT', description: '주문 목록을 중간 지점을 기준으로 두 개의 묶음으로 나눕니다.' },
  { id: '2', label: '왼쪽 묶음 정렬 (재귀)', type: 'SORT_LEFT', description: '왼쪽 묶음을 동일한 방식으로 정렬해오라고 시킵니다.' },
  { id: '3', label: '오른쪽 묶음 정렬 (재귀)', type: 'SORT_RIGHT', description: '오른쪽 묶음을 동일한 방식으로 정렬해오라고 시킵니다.' },
  { id: '4', label: '두 묶음 합치기', type: 'MERGE', description: '정렬된 두 묶음을 크기 순서대로 비교하며 하나의 묶음으로 합칩니다.' },
];

export const INITIAL_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: '합병 정렬(Merge Sort)의 시간 복잡도는 평균적으로 얼마인가요?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    correctAnswer: 'O(n log n)',
    explanation: '합병 정렬은 항상 리스트를 절반으로 나누고(log n), 다시 합병(n)하는 과정을 거치므로 O(n log n)입니다.'
  },
  {
    id: 'q2',
    question: '합병 정렬에서 "분할" 단계는 무엇을 하는 과정인가요?',
    options: ['리스트를 정렬한다', '가장 작은 값을 찾는다', '리스트를 절반으로 나눈다', '중복된 값을 제거한다'],
    correctAnswer: '리스트를 절반으로 나눈다',
    explanation: '합병 정렬의 첫 단계는 문제를 더 작은 문제로 나누기 위해 리스트를 절반으로 분할하는 것입니다.'
  },
  {
    id: 'q3',
    question: '합병 정렬의 단점으로 꼽히는 것은 무엇인가요?',
    options: ['속도가 느리다', '추가적인 메모리 공간이 필요하다', '구현이 너무 복잡하다', '작은 데이터에서만 작동한다'],
    correctAnswer: '추가적인 메모리 공간이 필요하다',
    explanation: '합병 정렬은 정렬된 데이터를 임시로 저장할 배열이 필요하므로 O(n)의 추가 공간 복잡도를 가집니다.'
  }
];

export const FOOD_ITEMS = [
  "떡볶이", "김말이", "순대", "어묵", "닭강정", "소떡소떡", "와플", "아이스티"
];
