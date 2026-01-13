import { IoTObject, QuizQuestion } from './types';
import { Lightbulb, Bus, Home, Watch, Car } from 'lucide-react';
import React from 'react';

export const INITIAL_OBJECTS: IoTObject[] = [
  {
    id: 'lamp',
    name: '가로등',
    type: 'city',
    x: 20,
    y: 40,
    iconName: 'Lightbulb',
    isUpgraded: false,
    normalDescription: '일반적인 가로등입니다. 정해진 시간에만 켜지고 꺼집니다.',
    iotDescription: '스마트 가로등으로 변신했습니다! 주변 환경에 반응합니다.',
    sensorData: {
      input: '조도 센서 (밝기 감지)',
      processing: '어두워지면 데이터 전송',
      output: '자동 점등 및 밝기 조절',
    },
    upgradeMessage: '주변 밝기를 감지해 스스로 켜집니다!',
  },
  {
    id: 'bus-stop',
    name: '버스 정류장',
    type: 'transport',
    x: 45,
    y: 55,
    iconName: 'Bus',
    isUpgraded: false,
    normalDescription: '종이로 된 버스 노선표만 붙어있는 정류장입니다.',
    iotDescription: '버스 정보 시스템(BIS)이 설치되었습니다.',
    sensorData: {
      input: 'GPS (위치 수신)',
      processing: '도착 예정 시간 계산',
      output: '전광판에 남은 시간 표시',
    },
    upgradeMessage: '버스가 어디쯤 왔는지 실시간으로 알려줍니다!',
  },
  {
    id: 'home',
    name: '집 (온도 조절)',
    type: 'home',
    x: 75,
    y: 30,
    iconName: 'Home',
    isUpgraded: false,
    normalDescription: '사람이 직접 에어컨과 보일러를 켜야 합니다.',
    iotDescription: '스마트 홈 시스템이 작동 중입니다.',
    sensorData: {
      input: '온습도 센서',
      processing: '쾌적 지수 분석',
      output: '냉난방기 자동 제어',
    },
    upgradeMessage: '외부 날씨에 맞춰 집안 온도를 자동으로 조절합니다!',
  },
  {
    id: 'watch',
    name: '손목 시계',
    type: 'wearable',
    x: 85,
    y: 75,
    iconName: 'Watch',
    isUpgraded: false,
    normalDescription: '시간만 확인할 수 있는 일반 시계입니다.',
    iotDescription: '건강을 지켜주는 스마트 워치입니다.',
    sensorData: {
      input: '심박수/가속도 센서',
      processing: '운동량 및 건강 분석',
      output: '스마트폰으로 건강 리포트 전송',
    },
    upgradeMessage: '내 심박수와 운동량을 실시간으로 기록합니다!',
  },
  {
    id: 'car',
    name: '자동차',
    type: 'transport',
    x: 15,
    y: 75,
    iconName: 'Car',
    isUpgraded: false,
    normalDescription: '운전자가 직접 모든 것을 조작해야 하는 자동차입니다.',
    iotDescription: '자율주행 기능이 탑재된 스마트 카입니다.',
    sensorData: {
      input: 'LiDAR/카메라 센서',
      processing: '장애물 및 차선 인식',
      output: '자동 조향 및 제동',
    },
    upgradeMessage: '주변 장애물을 피해 스스로 안전하게 운전합니다!',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "사물 인터넷(IoT)은 인터넷 연결 없이도 작동할 수 있다?",
    isCorrect: false,
    explanation: "X: 사물 인터넷의 핵심은 '통신'입니다. 인터넷이나 네트워크에 연결되어 데이터를 주고받아야 합니다.",
  },
  {
    id: 2,
    question: "사물 인터넷은 오직 공장에서만 사용되는 기술이다?",
    isCorrect: false,
    explanation: "X: 가정(스마트 홈), 도시(스마트 시티), 농업(스마트 팜) 등 우리 생활 곳곳에서 사용됩니다.",
  },
  {
    id: 3,
    question: "스마트 가로등의 센서는 데이터를 입력받는 역할을 한다?",
    isCorrect: true,
    explanation: "O: 센서는 주변 환경(밝기, 움직임 등)의 데이터를 수집(입력)하는 역할을 합니다.",
  },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  Lightbulb,
  Bus,
  Home,
  Watch,
  Car,
};
