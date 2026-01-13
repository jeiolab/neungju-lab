import { Badge, TimelineEvent } from './types';

export const INITIAL_BADGES: Badge[] = [
  { id: 'first_step', name: '암호 해독가 입문', description: '첫 시뮬레이션을 실행했습니다.', icon: 'Key', unlocked: false },
  { id: 'rot13_finder', name: 'ROT13 발견', description: '키를 13으로 설정하여 ROT13 알고리즘을 체험했습니다.', icon: 'RotateCw', unlocked: false },
  { id: 'decrypt_master', name: '복호화 전문가', description: '복호화를 5회 이상 시도했습니다.', icon: 'Unlock', unlocked: false },
  { id: 'daily_hero', name: '오늘의 요원', description: '오늘의 암호 쪽지 미션을 완료했습니다.', icon: 'Star', unlocked: false },
  { id: 'quiz_ace', name: '퀴즈 에이스', description: '퀴즈에서 80점 이상을 받았습니다.', icon: 'Trophy', unlocked: false },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 'BC 400s',
    title: '스키테일(Scytale)',
    description: '스파르타에서 사용된 전치 암호. 막대에 가죽끈을 감아 메시지를 적고 풀어내면 글자 순서가 뒤섞입니다.',
    icon: 'Scroll',
  },
  {
    year: 'BC 50s',
    title: '카이사르 암호(Caesar Cipher)',
    description: '줄리어스 시저가 군사 통신에 사용한 치환 암호. 알파벳을 일정 수만큼 밀어서 사용했습니다.',
    icon: 'User',
  },
  {
    year: '1586',
    title: '비제네르 암호',
    description: '단일 치환의 약점을 보완하기 위해 여러 개의 키를 사용하는 다중 치환 암호가 등장했습니다.',
    icon: 'ShieldLock',
  },
  {
    year: '1918',
    title: '에니그마(Enigma)',
    description: '독일군이 사용한 전기기계식 암호기. 매번 키가 바뀌는 복잡한 치환 방식을 사용했습니다.',
    icon: 'Settings',
  },
];

export const REFLECTION_TEMPLATES = [
  {
    id: 1,
    question: "카이사르 암호의 가장 큰 약점은 무엇이라고 생각하나요?",
    placeholder: "예: 'e'같이 자주 쓰이는 글자가..."
  },
  {
    id: 2,
    question: "만약 키(이동 수)가 26이라면 어떤 일이 벌어질까요?",
    placeholder: "원래 문장이..."
  },
  {
    id: 3,
    question: "현대 사회에서 이런 단순 치환 암호를 쓰지 않는 이유는?",
    placeholder: "컴퓨터가..."
  }
];
