import React from 'react';
import { Badge, PosterRule, QuizQuestion } from './types';
import { Zap, Shield, Wifi, WifiOff, Users, Award, Lock, Activity } from 'lucide-react';

export const THEORY_CARDS = [
  {
    title: '유선 네트워크',
    icon: <Zap className="w-8 h-8 text-blue-600" />,
    description: '케이블(LAN선)을 사용하여 물리적으로 연결하는 방식입니다.',
    traits: { mobility: '낮음', stability: '매우 높음', security: '높음' }
  },
  {
    title: '무선 네트워크',
    icon: <Wifi className="w-8 h-8 text-green-600" />,
    description: '전파(Wi-Fi 등)를 이용해 선 없이 연결하는 방식입니다.',
    traits: { mobility: '매우 높음', stability: '환경에 따라 변동', security: '설정 필요' }
  },
  {
    title: '이동성 (Mobility)',
    icon: <Activity className="w-8 h-8 text-purple-600" />,
    description: '사용자가 위치를 바꾸며 통신할 수 있는 성질입니다. 무선이 압도적으로 유리합니다.',
    traits: null
  },
  {
    title: '안정성 & 간섭',
    icon: <WifiOff className="w-8 h-8 text-red-600" />,
    description: '장애물(벽)이나 다른 전파(전자레인지, 블루투스)의 방해를 받으면 속도가 느려집니다.',
    traits: null
  },
  {
    title: '보안성 (Security)',
    icon: <Lock className="w-8 h-8 text-orange-600" />,
    description: '무선은 공중으로 신호를 쏘기 때문에 암호화가 없으면 해킹 위험이 높습니다.',
    traits: null
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "무선 네트워크의 가장 큰 장점은 무엇인가요?",
    options: ["전송 속도가 항상 일정하다", "이동하면서 사용할 수 있다", "보안이 유선보다 강력하다", "장애물의 영향을 받지 않는다"],
    correctIndex: 1,
    explanation: "무선 네트워크의 핵심 특성은 '이동성'입니다. 선이 없어 자유롭게 움직일 수 있습니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "무선 공유기(AP) 근처에 전자레인지가 있을 때 속도가 느려지는 현상은?",
    options: ["보안 취약점", "전파 간섭", "데이터 암호화", "유선 연결"],
    correctIndex: 1,
    explanation: "전자레인지와 Wi-Fi(2.4GHz)는 비슷한 주파수를 사용하여 '전파 간섭'이 발생합니다.",
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "다음 중 무선 네트워크 보안을 높이는 방법으로 적절하지 않은 것은?",
    options: ["비밀번호 설정", "최신 암호화 방식(WPA3 등) 사용", "공개 와이파이(Open) 사용", "관리자 비밀번호 변경"],
    correctIndex: 2,
    explanation: "비밀번호가 없는 공개 와이파이는 데이터가 암호화되지 않아 해킹 위험이 높습니다.",
    difficulty: 'easy'
  },
  {
    id: 4,
    question: "유선 네트워크가 무선보다 유리한 상황은?",
    options: ["공원 벤치에서 인터넷 하기", "대용량 파일을 끊김 없이 전송해야 할 때", "카페에서 돌아다니며 작업할 때", "스마트폰으로 침대에서 영상 보기"],
    correctIndex: 1,
    explanation: "유선은 안정성이 높아 대용량 데이터 전송이나 끊김 없는 연결이 필요할 때 유리합니다.",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "접속자가 많아질수록 무선 인터넷이 느려지는 주된 이유는?",
    options: ["AP의 배터리가 닳아서", "대역폭(통신 도로)을 나누어 쓰기 때문에", "유선 케이블이 낡아서", "스마트폰 성능이 떨어져서"],
    correctIndex: 1,
    explanation: "무선 주파수 대역폭은 한정되어 있어, 접속자가 늘어나면 1인당 사용할 수 있는 도로 폭이 좁아집니다.",
    difficulty: 'hard'
  },
  {
    id: 6,
    question: "벽이나 문 같은 장애물이 있을 때 더 크게 영향을 받는 것은?",
    options: ["유선 네트워크", "무선 네트워크", "둘 다 동일하다", "알 수 없다"],
    correctIndex: 1,
    explanation: "무선 신호(전파)는 콘크리트 벽이나 금속 장애물을 통과할 때 신호 세기가 급격히 약해집니다.",
    difficulty: 'easy'
  },
  {
    id: 7,
    question: "네트워크 안정성(Stability)에 대한 설명으로 옳은 것은?",
    options: ["무선은 항상 유선보다 안정적이다", "유선은 외부 환경 간섭을 거의 받지 않는다", "비가 오면 유선 인터넷이 끊긴다", "안정성은 보안성과 같은 말이다"],
    correctIndex: 1,
    explanation: "유선(광케이블, UTP)은 물리적으로 차폐되어 있어 외부 간섭에 매우 강하고 안정적입니다.",
    difficulty: 'medium'
  },
  {
    id: 8,
    question: "학교에서 시험 기간에만 와이파이 속도가 빨라지는 것처럼 느껴진다면 이유는?",
    options: ["학교에서 더 비싼 요금제를 써서", "동시 접속자 수가 줄어들어서", "장애물이 사라져서", "날씨가 좋아서"],
    correctIndex: 1,
    explanation: "사용자가 줄어들면 대역폭을 독점할 수 있어 속도와 품질이 향상됩니다.",
    difficulty: 'hard'
  },
  {
    id: 9,
    question: "'이동성'은 높지만 '보안'에 각별히 신경 써야 하는 것은?",
    options: ["유선 LAN", "데스크탑 PC", "무선 Wi-Fi", "해저 케이블"],
    correctIndex: 2,
    explanation: "무선 Wi-Fi는 이동성이 좋지만, 전파가 사방으로 퍼지므로 도청 위험이 있어 보안 설정이 필수입니다.",
    difficulty: 'easy'
  },
  {
    id: 10,
    question: "다음 상황 중 무선 네트워크 품질 점수가 가장 낮을 것으로 예상되는 경우는?",
    options: ["사용자 1명, 장애물 없음", "사용자 5명, 나무 벽 1개", "사용자 40명, 콘크리트 벽 2개", "사용자 10명, 장애물 없음"],
    correctIndex: 2,
    explanation: "사용자가 많고(대역폭 부족), 장애물이 많을수록(신호 감쇠) 품질이 최악이 됩니다.",
    difficulty: 'hard'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'starter',
    name: '신입 연구원',
    description: '첫 번째 실험을 완료했습니다.',
    icon: '🧪',
    condition: (stats) => stats.experimentsCount >= 1
  },
  {
    id: 'expert',
    name: '실험가',
    description: '실험을 20회 이상 수행했습니다.',
    icon: '🎓',
    condition: (stats) => stats.experimentsCount >= 20
  },
  {
    id: 'detective',
    name: '간섭 탐정',
    description: '최악의 조건(품질 30 이하)을 발견했습니다.',
    icon: '🕵️',
    condition: (stats) => false // Logic handled in simulation component
  },
  {
    id: 'master',
    name: '네트워크 마스터',
    description: '퀴즈에서 100점을 달성했습니다.',
    icon: '🏆',
    condition: (stats) => stats.quizScore >= 100
  }
];

export const POSTER_RULES: PosterRule[] = [
  { id: 'r1', text: '수업 시간에는 불필요한 동영상 스트리밍 자제하기', category: 'stability' },
  { id: 'r2', text: '내 기기에 비밀번호 잠금 설정하기', category: 'security' },
  { id: 'r3', text: '공유기 근처에 물건 쌓아두지 않기', category: 'stability' },
  { id: 'r4', text: '알 수 없는 공개 와이파이 접속하지 않기', category: 'security' },
  { id: 'r5', text: '대용량 다운로드는 점심시간 피해서 하기', category: 'etiquette' },
  { id: 'r6', text: '블루투스 기기 사용 줄여서 전파 간섭 막기', category: 'stability' },
];
