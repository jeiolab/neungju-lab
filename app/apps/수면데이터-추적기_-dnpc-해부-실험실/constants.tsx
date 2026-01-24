import { QuizQuestion } from './types';
import { Database, Radio, Smartphone, Activity, Server, LayoutTemplate } from 'lucide-react';
import React from 'react';

export const CONCEPTS = [
  {
    step: 1,
    title: '데이터 수집 (Collection)',
    dnpc: 'Device (디바이스)',
    desc: '스마트워치의 가속도/심박 센서가 내 움직임을 감지하여 디지털 신호로 바꿉니다.',
    icon: <Activity className="w-8 h-8 text-blue-500" />,
  },
  {
    step: 2,
    title: '데이터 전송 (Transmission)',
    dnpc: 'Network (네트워크)',
    desc: '수집된 데이터를 블루투스나 Wi-Fi를 통해 스마트폰 또는 클라우드로 보냅니다.',
    icon: <Radio className="w-8 h-8 text-indigo-500" />,
  },
  {
    step: 3,
    title: '저장 및 분석 (Processing)',
    dnpc: 'Platform (플랫폼)',
    desc: '클라우드 서버나 앱이 데이터를 저장하고, AI 알고리즘으로 수면 단계를 판단합니다.',
    icon: <Database className="w-8 h-8 text-purple-500" />,
  },
  {
    step: 4,
    title: '서비스 활용 (Utilization)',
    dnpc: 'Content (콘텐츠)',
    desc: '분석 결과를 바탕으로 "오늘의 수면 점수"를 보여주고 수면 코칭을 제공합니다.',
    icon: <LayoutTemplate className="w-8 h-8 text-pink-500" />,
  },
];

export const QUIZ_DATA: QuizQuestion[] = [
  // Easy
  {
    id: 1,
    difficulty: 'easy',
    question: 'IoT 시스템에서 온도, 움직임 등을 감지하여 데이터를 수집하는 단계는?',
    options: ['데이터 수집', '데이터 전송', '데이터 분석', '서비스 활용'],
    correctIndex: 0,
    explanation: '센서를 통해 주변 환경의 정보를 받아들이는 것은 데이터 수집 단계입니다.',
  },
  {
    id: 2,
    difficulty: 'easy',
    question: 'DNPC 모델에서 "Network"에 해당하는 활동은?',
    options: ['센서 감지', '데이터 무선 전송', 'DB 저장', '스마트폰 알림 표시'],
    correctIndex: 1,
    explanation: 'Network(네트워크)는 수집된 데이터를 다른 장치나 서버로 옮기는 전송 역할을 합니다.',
  },
  // Medium
  {
    id: 3,
    difficulty: 'medium',
    question: '전송 지연이 길어질 때 발생할 수 있는 문제점으로 가장 적절한 것은?',
    options: ['배터리가 절약된다.', '데이터가 더 정확해진다.', '실시간 분석이 어려워진다.', '센서 감도가 좋아진다.'],
    correctIndex: 2,
    explanation: '데이터가 늦게 도착하면 현재 상태를 즉시 파악하고 대처하는 실시간 분석이 불가능해집니다.',
  },
  {
    id: 4,
    difficulty: 'medium',
    question: '스마트워치 수면 분석에서 "샘플링 간격"을 1분에서 1초로 줄였을 때의 효과는?',
    options: ['데이터 양이 감소한다.', '배터리 소모가 줄어든다.', '더 정밀한 움직임 포착이 가능하다.', '전송 속도가 빨라진다.'],
    correctIndex: 2,
    explanation: '샘플링 간격이 좁을수록 더 자주 측정하므로 미세한 변화를 놓치지 않고 포착할 수 있습니다.',
  },
  // Hard
  {
    id: 5,
    difficulty: 'hard',
    question: '만약 "저장·분석" 단계가 고장 난다면 스마트워치 사용자가 겪을 현상은?',
    options: ['센서가 작동하지 않는다.', '블루투스 연결이 끊긴다.', '데이터는 쌓이지만 수면 점수를 볼 수 없다.', '배터리가 방전된다.'],
    correctIndex: 2,
    explanation: '수집과 전송이 되어도, 이를 해석(분석)하지 못하면 의미 있는 정보(수면 점수 등)를 사용자에게 보여줄 수 없습니다.',
  },
];

export const EXPLORE_DATA = [
  { id: 'e1', name: '수면 중 뒤척임', type: 'source' },
  { id: 'e2', name: '가속도 센서', type: 'collection' },
  { id: 'e3', name: '블루투스/LTE', type: 'transmission' },
  { id: 'e4', name: '클라우드 DB', type: 'storage' },
  { id: 'e5', name: '수면 패턴 리포트', type: 'utilization' },
];