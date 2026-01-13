import { TaskNode, QuizQuestion, Badge } from './types';
import { Trophy, Star, BookOpen, Lightbulb } from 'lucide-react';

// Simulation Data
export const SCENARIOS: { [key: string]: { root: TaskNode; nodes: TaskNode[] } } = {
  video: {
    root: { id: 'root_video', text: '학교 홍보 영상 제작', type: 'root', parentId: null },
    nodes: [
      // Level 2
      { id: 'v_plan', text: '기획 단계', type: 'category', parentId: 'root_video' },
      { id: 'v_filming', text: '촬영 단계', type: 'category', parentId: 'root_video' },
      { id: 'v_edit', text: '편집 단계', type: 'category', parentId: 'root_video' },
      // Level 3 - Planning
      { id: 'v_script', text: '대본 작성', type: 'task', parentId: 'v_plan' },
      { id: 'v_casting', text: '배우 섭외', type: 'task', parentId: 'v_plan' },
      // Level 3 - Filming
      { id: 'v_cam', text: '카메라 장비 대여', type: 'task', parentId: 'v_filming' },
      { id: 'v_loc', text: '장소 섭외 및 촬영', type: 'task', parentId: 'v_filming' },
      // Level 3 - Editing
      { id: 'v_cut', text: '컷 편집', type: 'task', parentId: 'v_edit' },
      { id: 'v_sound', text: '자막 및 효과음 삽입', type: 'task', parentId: 'v_edit' },
    ],
  },
  sports: {
    root: { id: 'root_sports', text: '체육대회 운영', type: 'root', parentId: null },
    nodes: [
      { id: 's_game', text: '경기 운영', type: 'category', parentId: 'root_sports' },
      { id: 's_safe', text: '안전 관리', type: 'category', parentId: 'root_sports' },
      { id: 's_event', text: '이벤트/응원', type: 'category', parentId: 'root_sports' },
      { id: 's_referee', text: '심판진 구성', type: 'task', parentId: 's_game' },
      { id: 's_rule', text: '경기 대진표 작성', type: 'task', parentId: 's_game' },
      { id: 's_nurse', text: '보건실 연계', type: 'task', parentId: 's_safe' },
      { id: 's_water', text: '식수 및 응급키트 준비', type: 'task', parentId: 's_safe' },
      { id: 's_cheer', text: '치어리딩 팀 모집', type: 'task', parentId: 's_event' },
    ],
  },
};

// Quiz Data
export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple',
    question: '복잡한 문제를 작고 관리 가능한 단위로 나누는 과정을 무엇이라고 합니까?',
    options: ['문제 합성', '문제 분해', '문제 회피', '문제 복사'],
    answer: 1,
    explanation: '문제 분해(Decomposition)는 큰 문제를 작은 단위로 쪼개어 해결하기 쉽게 만드는 과정입니다.',
  },
  {
    id: 2,
    type: 'multiple',
    question: 'WBS의 약자로 올바른 것은?',
    options: ['World Best System', 'Work Breakdown Structure', 'Work Basic Standard', 'Whole Business Strategy'],
    answer: 1,
    explanation: 'WBS는 Work Breakdown Structure(작업 분해 구조)의 약자입니다.',
  },
  {
    id: 3,
    type: 'short',
    question: '큰 문제에서 작은 문제로 내려가는 분해 방식을 OOO-OOOO 방식이라고 합니다. (영어로)',
    answer: 'top-down',
    explanation: '위에서 아래로 구체화하는 방식은 Top-down(탑다운) 방식입니다.',
  },
  {
    id: 4,
    type: 'multiple',
    question: '다음 중 "학교 축제 기획"의 하위 단계로 적절하지 않은 것은?',
    options: ['예산 수립', '프로그램 기획', '수학 숙제 하기', '홍보물 제작'],
    answer: 2,
    explanation: '수학 숙제 하기는 학교 축제 프로젝트의 범위에 포함되지 않는 개인적인 과업입니다.',
  },
];

// Theory Cards
export const THEORY_CARDS = [
  {
    title: '문제 분해란?',
    content: '거대한 코끼리를 먹는 방법은? 한 입씩 먹는 것입니다! 큰 문제(Project)를 실행 가능한 작은 단위(Task)로 쪼개는 것을 문제 분해라고 합니다.',
    image: 'https://picsum.photos/400/200?random=1',
  },
  {
    title: '위계 구조 (Hierarchy)',
    content: '문제는 계층을 가집니다. 대분류 > 중분류 > 소분류 순서로 체계적으로 정리해야 누락 없이 완벽한 계획을 세울 수 있습니다.',
    image: 'https://picsum.photos/400/200?random=2',
  },
  {
    title: 'Top-down 접근법',
    content: '학교 홍보 영상 만들기라는 큰 목표를 먼저 세우고, 기획/촬영/편집으로 나누는 것처럼 위에서 아래로 구체화하는 방식입니다.',
    image: 'https://picsum.photos/400/200?random=3',
  },
];

// Badges
export const BADGES: Badge[] = [
  {
    id: 'starter',
    name: '새내기 기획자',
    description: '첫 번째 시뮬레이션을 시작했습니다.',
    icon: 'seed',
    condition: (xp) => xp >= 10,
  },
  {
    id: 'meticulous',
    name: '꼼꼼한 기획자',
    description: '모든 시뮬레이션을 완료했습니다.',
    icon: 'check',
    condition: (xp, completedSims) => completedSims >= 2,
  },
  {
    id: 'logic_king',
    name: '논리의 왕',
    description: '퀴즈에서 고득점을 획득했습니다.',
    icon: 'crown',
    condition: (xp, c, quizScore) => quizScore >= 3,
  },
];