import { Agent, QuizQuestion, SensorType } from './types';
import { Brain, Layout, PlusCircle, CheckCircle, MessageCircle } from 'lucide-react';
import React from 'react';

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'mock-1',
    name: '급식 알리미 3000',
    goal: '오늘의 급식 메뉴와 영양 정보를 학생들에게 알려줍니다.',
    environment: '학교 식당 및 교실',
    sensors: [SensorType.WIFI, SensorType.GPS],
    actions: ['푸시 알림 보내기', '화면에 메뉴 띄우기', '건강한 메뉴 추천'],
    characteristics: '친절함, 시간 엄수, 유익함',
    avatarColor: 'bg-green-500',
    createdAt: 1715420000000,
  },
  {
    id: 'mock-2',
    name: '안전 지킴이 드론',
    goal: '학생들의 등하교길 안전을 위해 학교 주변 횡단보도를 모니터링합니다.',
    environment: '학교 정문 및 횡단보도',
    sensors: [SensorType.CAMERA, SensorType.MOTION, SensorType.GPS],
    actions: ['경고등 켜기', '교통 위반 녹화', '안전 경고 방송 송출'],
    characteristics: '경계심 강함, 시끄러움, 보호적',
    avatarColor: 'bg-blue-500',
    createdAt: 1715430000000,
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    scenario: "청소 로봇이 방을 돌아다니지만, 계속해서 벽과 가구에 '쿵쿵' 부딪히며 다닙니다.",
    agentDescription: "목표: 바닥 청소. 행동: 전진, 회전, 흡입. 환경: 거실.",
    missingElement: "센서 (Sensor)",
    options: ["목표 (Goal)", "센서 (Sensor)", "행동 (Action)", "환경 (Environment)"]
  },
  {
    id: 2,
    scenario: "정원 관리 로봇이 카메라가 있고 물 주는 법을 알지만, 정원이 아니라 거실에 있는 '플라스틱 조화'에 물을 주어 바닥을 젖게 만들었습니다.",
    agentDescription: "목표: 식물 물주기. 센서: 카메라. 행동: 물 뿌리기.",
    missingElement: "환경 (Environment)",
    options: ["환경 (Environment)", "센서 (Sensor)", "특성 (Characteristics)", "목표 (Goal)"]
  },
  {
    id: 3,
    scenario: "수학 튜터 로봇이 학생의 질문을 듣고 이해했지만, 아무런 대답도 하지 않고 가만히 서 있습니다.",
    agentDescription: "목표: 수학 가르치기. 환경: 교실. 센서: 마이크.",
    missingElement: "행동 (Action)",
    options: ["센서 (Sensor)", "환경 (Environment)", "행동 (Action)", "목표 (Goal)"]
  }
];