import { Badge, Concept, PipelineBlock, Question } from './types';
import { Thermometer, Radio, Cpu, Bell, Activity } from 'lucide-react';
import React from 'react';

// --- Badges ---
export const INITIAL_BADGES: Badge[] = [
  { id: 'b_master', name: '순서 마스터', description: '파이프라인 퍼즐을 완벽하게 조립했습니다.', icon: '🧩', unlocked: false },
  { id: 'b_zero', name: '오경보 0회', description: '시뮬레이션에서 오경보를 0회로 만들었습니다.', icon: '🎯', unlocked: false },
  { id: 'b_writer', name: '설명왕', description: '생각해볼 문제에서 근거를 충실히 작성했습니다.', icon: '📝', unlocked: false },
  { id: 'b_streak', name: '꾸준함의 증명', description: '3일 연속 학습을 달성했습니다.', icon: '🔥', unlocked: false },
];

// --- Concepts ---
export const CONCEPTS: Concept[] = [
  {
    id: 'c_pipeline',
    title: '데이터 파이프라인 (Data Pipeline)',
    definition: '데이터가 생성되어 처리되고 결과로 출력되기까지의 흐름',
    keywords: ['입력(Input)', '처리(Process)', '출력(Output)'],
    example: '온도 측정 -> 값 전송 -> 50도 넘는지 확인 -> 사이렌',
    misconception: '오해: 센서가 스스로 판단해서 소리를 낸다?',
    correction: '교정: 센서는 값만 측정하고, 판단은 처리 장치(CPU 등)가 합니다.',
    checkQuestion: {
      q: '다음 중 "처리(Process)" 단계에 해당하는 것은?',
      options: ['온도 측정', '50도 이상인지 비교 판단', '사이렌 소리', '와이파이 전송'],
      a: 1
    }
  },
  {
    id: 'c_threshold',
    title: '임계값 (Threshold)',
    definition: '어떤 상태가 변화하거나 판단이 바뀌는 기준 값',
    keywords: ['기준선', '조건', '트리거'],
    example: '화재 경보기의 임계값이 50도라면, 49도는 안전, 50도는 위험.',
    misconception: '오해: 임계값은 무조건 0이어야 한다?',
    correction: '교정: 상황에 따라 설계자가 적절한 값을 설정해야 합니다.',
    checkQuestion: {
      q: '임계값을 너무 낮게 설정하면 어떤 문제가 생길까요?',
      options: ['경보가 절대 안 울린다', '오경보(False Alarm)가 많아진다', '배터리가 절약된다', '센서가 고장난다'],
      a: 1
    }
  },
  {
    id: 'c_sensor_noise',
    title: '노이즈와 오경보',
    definition: '센서 값에 섞이는 불필요한 신호 흔들림',
    keywords: ['오차', '필터링', '신뢰도'],
    example: '실제 48도인데 센서 오류로 순간 51도로 측정됨.',
    misconception: '오해: 디지털 센서는 언제나 100% 정확하다?',
    correction: '교정: 모든 센서는 오차가 있으며, 이를 S/W로 보정해야 합니다.',
    checkQuestion: {
      q: '일시적인 노이즈로 인한 오경보를 줄이는 방법은?',
      options: ['임계값을 1도로 낮춘다', '센서를 끈다', '여러 번 측정해서 평균을 낸다', '소리를 더 크게 낸다'],
      a: 2
    }
  }
];

// --- Puzzle Blocks ---
export const PUZZLE_BLOCKS: PipelineBlock[] = [
  { id: 'blk_sensor', label: '온도 센서 입력', type: 'sensor', description: '주변 온도를 측정하여 전기 신호로 변환' },
  { id: 'blk_send', label: '데이터 전송', type: 'comm_send', description: '측정된 값을 중앙 처리 장치로 보냄' },
  { id: 'blk_recv', label: '데이터 수신', type: 'comm_recv', description: '보낸 데이터를 받음' },
  { id: 'blk_process', label: '조건 판단 (>=임계값)', type: 'process', description: '설정된 기준(50도)과 비교' },
  { id: 'blk_output', label: '경보 아이콘 출력', type: 'output', description: '위험시 시각/청각 알림 발생' },
];

// --- Quiz ---
export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: '화재 경보기 설계 시 "판단" 단계보다 먼저 선행되어야 하는 단계가 아닌 것은?',
    options: ['데이터 수신', '온도 측정', '경보 출력', '데이터 전송'],
    type: 'multiple',
    answer: '경보 출력',
    explanation: '경보 출력은 판단의 결과로 실행되는 "Output" 단계이므로 판단 뒤에 와야 합니다.',
    difficulty: 'easy',
    conceptId: 'c_pipeline',
    misconceptionType: '순서 오해'
  },
  {
    id: 'q2',
    question: '임계값이 50도인 시스템에서 센서가 49.9도를 가리켰습니다. 시스템의 올바른 반응은?',
    options: ['경보 울림', '경보 울리지 않음', '센서 재부팅', '임계값 자동 수정'],
    type: 'multiple',
    answer: '경보 울리지 않음',
    explanation: '49.9도는 50도 미만이므로 조건(>=50)을 만족하지 않아 안전 상태입니다.',
    difficulty: 'easy',
    conceptId: 'c_threshold',
    misconceptionType: '수치 비교 오류'
  },
  {
    id: 'q3',
    question: '오경보(False Alarm)를 줄이기 위한 방법으로 가장 적절한 것은?',
    options: ['임계값을 아주 낮게 설정한다', '센서 데이터를 10초 평균내어 판단한다', '배터리를 뺀다', '통신 속도를 늦춘다'],
    type: 'multiple',
    answer: '센서 데이터를 10초 평균내어 판단한다',
    explanation: '평균을 내면 일시적인 노이즈(튀는 값)를 상쇄시켜 오경보를 줄일 수 있습니다.',
    difficulty: 'medium',
    conceptId: 'c_sensor_noise',
    misconceptionType: '해결책 오해'
  },
   {
    id: 'q4',
    question: 'IoT 시스템의 일반적인 3단계 구성 요소가 아닌 것은?',
    options: ['센서(Input)', '네트워크(Network)', '모터(Output)', '사람(Human)'],
    type: 'multiple',
    answer: '사람(Human)',
    explanation: 'IoT 시스템 자체는 입력-처리-출력(또는 센서-네트워크-액추에이터)로 구성되며, 사람은 사용자입니다.',
    difficulty: 'easy',
    conceptId: 'c_pipeline',
    misconceptionType: '구성요소 정의'
  },
  {
    id: 'q5',
    question: '다음 중 "출력(Output)" 장치에 해당하는 것은?',
    options: ['온도 센서', '가습기 분무구', '마이크', '키보드'],
    type: 'multiple',
    answer: '가습기 분무구',
    explanation: '센서, 마이크, 키보드는 데이터를 받아들이는 입력 장치이고, 가습기 분무구는 동작을 수행하는 출력 장치입니다.',
    difficulty: 'medium',
    conceptId: 'c_pipeline',
    misconceptionType: '입출력 구분'
  }
];

export const ICONS = {
  Thermometer, Radio, Cpu, Bell, Activity
};