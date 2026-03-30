import React from 'react';
import { DeviceType, QuizQuestion } from './types';
import { 
  Router, 
  Network, 
  Wifi, 
  Monitor, 
  Laptop, 
  Printer, 
  Tablet, 
  Globe 
} from 'lucide-react';

export const DEVICE_CONFIG = {
  [DeviceType.INTERNET]: { label: '외부망(ISP)', icon: <Globe className="w-8 h-8 text-blue-500" />, cost: 0, wireless: false },
  [DeviceType.ROUTER]: { label: '라우터', icon: <Router className="w-6 h-6 text-purple-600" />, cost: 150000, wireless: false },
  [DeviceType.SWITCH]: { label: '스위치', icon: <Network className="w-6 h-6 text-indigo-600" />, cost: 80000, wireless: false },
  [DeviceType.AP]: { label: '무선 AP', icon: <Wifi className="w-6 h-6 text-green-600" />, cost: 120000, wireless: true },
  [DeviceType.PC]: { label: 'PC', icon: <Monitor className="w-6 h-6 text-slate-700" />, cost: 800000, wireless: false },
  [DeviceType.LAPTOP]: { label: '노트북', icon: <Laptop className="w-6 h-6 text-slate-700" />, cost: 1200000, wireless: true },
  [DeviceType.PRINTER]: { label: '프린터', icon: <Printer className="w-6 h-6 text-slate-700" />, cost: 300000, wireless: true },
  [DeviceType.TABLET]: { label: '태블릿', icon: <Tablet className="w-6 h-6 text-slate-700" />, cost: 600000, wireless: true },
};

export const INITIAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "서로 다른 네트워크(예: 학교 내부망과 외부 인터넷)를 연결해주는 '문지기' 역할의 장비는 무엇일까요?",
    options: ["스위치", "라우터", "랜선", "프린터"],
    correctAnswer: 1,
    explanation: "라우터(Router)는 서로 다른 네트워크 간에 데이터 경로를 지정하고 연결해주는 장비입니다."
  },
  {
    id: 2,
    question: "여러 대의 컴퓨터를 유선으로 연결하여 하나의 네트워크 그룹을 만들어주는 장비는?",
    options: ["스위치", "AP", "블루투스", "서버"],
    correctAnswer: 0,
    explanation: "스위치(Switch)는 여러 장비를 유선 케이블로 연결하여 데이터를 필요한 곳으로만 효율적으로 전달합니다."
  },
  {
    id: 3,
    question: "Wi-Fi 신호를 발생시켜 태블릿이나 노트북이 무선으로 인터넷을 쓸 수 있게 해주는 장비는?",
    options: ["모뎀", "스위치", "무선 AP", "방화벽"],
    correctAnswer: 2,
    explanation: "무선 AP(Access Point)는 유선 신호를 무선 신호로 변환하여 기기들이 와이파이를 쓸 수 있게 해줍니다."
  }
];

export const IOT_SCENARIOS = [
  {
    title: "자동 환기 시스템",
    description: "CO2 센서가 공기질을 측정하여, 나쁨 수준이 되면 자동으로 창문 개폐기와 환풍기를 작동시킵니다.",
    device: "CO2 센서 + 스마트 윈도우"
  },
  {
    title: "스마트 조명",
    description: "조도 센서가 교실의 밝기를 감지하여, 날씨가 흐리면 전등을 켜고 맑으면 전등을 어둡게 조절합니다.",
    device: "조도 센서 + 스마트 LED"
  },
  {
    title: "에너지 절약",
    description: "모션 센서가 교실에 사람이 없는 것을 감지하면 10분 후 자동으로 냉난방기와 전등을 끕니다.",
    device: "모션 센서 + 스마트 플러그"
  }
];