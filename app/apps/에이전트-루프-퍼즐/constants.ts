import { AgentStepData, QuizQuestion, Scenario, ErrorCase } from './types';
import { Eye, Brain, Cpu, Zap } from 'lucide-react';

export const AGENT_STEPS: AgentStepData[] = [
  {
    id: 'Perception',
    koreanName: '인식 (Perception)',
    description: '센서를 통해 외부 환경의 정보를 수집하는 단계입니다. (예: 카메라, 마이크, 온도 센서)',
    icon: 'Eye',
    color: 'bg-blue-100 text-blue-600 border-blue-300'
  },
  {
    id: 'Learning',
    koreanName: '학습 (Learning)',
    description: '수집된 데이터를 바탕으로 패턴을 찾고 모델을 업데이트하는 단계입니다.',
    icon: 'Brain',
    color: 'bg-purple-100 text-purple-600 border-purple-300'
  },
  {
    id: 'Reasoning',
    koreanName: '추론 (Reasoning)',
    description: '현재 상황과 지식을 결합하여 최적의 판단을 내리는 단계입니다.',
    icon: 'Cpu',
    color: 'bg-amber-100 text-amber-600 border-amber-300'
  },
  {
    id: 'Action',
    koreanName: '행동 (Action)',
    description: '결정된 내용을 바탕으로 실제 환경에 물리적/디지털 영향을 주는 단계입니다.',
    icon: 'Zap',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-300'
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'robot_cleaner',
    name: '로봇 청소기',
    description: '먼지를 발견하고 피해서 청소하는 로봇',
    correctOrder: ['Perception', 'Learning', 'Reasoning', 'Action']
  },
  {
    id: 'school_bot',
    name: '학교 급식 알림봇',
    description: '학생의 식성을 학습해 메뉴를 추천하는 봇',
    correctOrder: ['Perception', 'Learning', 'Reasoning', 'Action']
  },
  {
    id: 'career_agent',
    name: '진로 추천 에이전트',
    description: '성적과 흥미를 분석해 학과를 추천',
    correctOrder: ['Perception', 'Learning', 'Reasoning', 'Action']
  }
];

export const ERROR_CASES: ErrorCase[] = [
  {
    id: 'err_perception',
    missingStep: 'Perception',
    title: '눈 가린 자율주행차',
    scenario: '카메라 센서에 진흙이 묻어 신호등을 못 봄.',
    consequence: '빨간불인데도 멈춰야 한다는 정보를 얻지 못해 돌진함 (인식 실패 → 잘못된 행동).'
  },
  {
    id: 'err_learning',
    missingStep: 'Learning',
    title: '발전 없는 번역기',
    scenario: '신조어 데이터가 들어와도 업데이트되지 않음.',
    consequence: '사용자들이 계속 고쳐주어도 매번 똑같은 오역을 반복함 (학습 부재 → 구식 추론).'
  },
  {
    id: 'err_reasoning',
    missingStep: 'Reasoning',
    title: '생각 없는 앵무새',
    scenario: '질문을 들었지만, 문맥을 파악하지 못하고 단어만 매칭.',
    consequence: '"배고파"라고 했는데 "배(Boat)" 사진을 보여줌 (추론 오류 → 엉뚱한 행동).'
  },
  {
    id: 'err_action',
    missingStep: 'Action',
    title: '고장 난 로봇팔',
    scenario: '물건을 집어야 한다고 판단했으나 모터가 고장남.',
    consequence: '허공에서 윙윙거리기만 하고 컵을 깨뜨림 (행동 실패 → 목표 달성 불가).'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "지능형 에이전트가 환경 정보를 받아들이는 첫 번째 단계는?",
    options: ["추론", "행동", "인식", "학습"],
    correctIndex: 2,
    explanation: "에이전트는 먼저 센서를 통해 환경을 '인식'해야 합니다.",
    tags: ["인식"]
  },
  {
    id: 2,
    question: "데이터가 쌓일수록 에이전트의 성능이 좋아지게 만드는 과정은?",
    options: ["학습", "행동", "감지", "출력"],
    correctIndex: 0,
    explanation: "경험(데이터)을 통해 성능을 향상시키는 과정이 '학습'입니다.",
    tags: ["학습"]
  },
  {
    id: 3,
    question: "로봇청소기가 '앞에 장애물이 있으니 오른쪽으로 돌자'라고 판단하는 단계는?",
    options: ["인식", "추론", "행동", "학습"],
    correctIndex: 1,
    explanation: "수집된 정보를 바탕으로 판단을 내리는 것은 '추론' 단계입니다.",
    tags: ["추론"]
  },
  {
    id: 4,
    question: "다음 중 '행동' 단계에 해당하는 장치는?",
    options: ["카메라", "마이크", "모터/스피커", "온도센서"],
    correctIndex: 2,
    explanation: "모터나 스피커는 환경에 물리적 변화를 주거나 정보를 출력하는 액추에이터(행동 장치)입니다.",
    tags: ["행동"]
  },
  {
    id: 5,
    question: "인식 단계에서 오류가 발생하면 어떤 문제가 생길까요?",
    options: ["행동만 느려진다", "잘못된 정보로 인해 엉뚱한 추론과 행동을 한다", "학습 속도가 빨라진다", "아무 문제 없다"],
    correctIndex: 1,
    explanation: "Garbage In, Garbage Out. 입력(인식)이 잘못되면 결과도 잘못됩니다.",
    tags: ["인식", "예외처리"]
  }
];
