import { Badge } from './types';

export const THEORY_CARDS = [
  {
    title: "순차 탐색 (Linear Search)",
    keywords: ["1씩 증가", "처음부터 끝까지", "단순함"],
    content: "책장의 책을 첫 번째 칸부터 하나씩 확인하며 찾는 방법입니다. 운이 좋으면 바로 찾지만, 최악의 경우 모든 데이터를 확인해야 합니다.",
    icon: "🐌"
  },
  {
    title: "이진 탐색 (Binary Search)",
    keywords: ["반으로 뚝", "업/다운", "정렬 필수"],
    content: "책의 중간을 펼쳐 찾으려는 쪽수보다 큰지 작은지 비교합니다. 한 번 비교할 때마다 후보가 절반으로 줄어듭니다.",
    icon: "⚡"
  },
  {
    title: "왜 정렬이 필요한가?",
    keywords: ["순서", "규칙", "전제조건"],
    content: "숫자가 뒤죽박죽 섞여 있다면 'UP/DOWN' 힌트를 줄 수 없습니다. 이진 탐색은 데이터가 정렬되어 있을 때만 사용 가능합니다.",
    icon: "📚"
  },
  {
    title: "효율성 비교",
    keywords: ["O(n)", "O(log n)", "속도 차이"],
    content: "데이터가 1000개일 때 순차 탐색은 최대 1000번, 이진 탐색은 단 10번 만에 찾을 수 있습니다.",
    icon: "📊"
  }
];

export const BADGES: Badge[] = [
  {
    id: 'first_win',
    name: '첫 번째 성공',
    description: '첫 탐색 실험을 완료했습니다.',
    icon: '🎉',
    condition: (stats) => stats.totalGames === 1
  },
  {
    id: 'binary_master',
    name: '이진 탐색 마스터',
    description: '1~1000 범위에서 10회 이하로 성공했습니다.',
    icon: '🧠',
    condition: (_stats, game, config) => {
      if (!game || !config) return false;
      return config.max - config.min >= 999 && game.attempts <= 10;
    }
  },
  {
    id: 'streak_3',
    name: '작심삼일 돌파',
    description: '3일 연속 실험에 참여했습니다.',
    icon: '🔥',
    condition: (stats) => stats.streak >= 3
  }
];

export const INITIAL_STATS: any = {
  totalGames: 0,
  bestAttempts: {},
  totalAttempts: 0,
  streak: 0,
  lastPlayed: '',
  badges: []
};
