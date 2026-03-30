import React from 'react';
import { SensorOption, ActionOption, ExampleProject } from './types';

// Using simple emoji icons for this implementation to keep it lightweight
export const SENSOR_OPTIONS: SensorOption[] = [
  { id: 'distance', name: '초음파 거리 센서', description: '물체와의 거리를 측정해요', icon: '📏' },
  { id: 'temp_humid', name: '온습도 센서', description: '온도와 습도를 측정해요', icon: '🌡️' },
  { id: 'pir', name: '인체 감지(PIR) 센서', description: '사람이나 동물의 움직임을 감지해요', icon: '🏃' },
  { id: 'light', name: '조도 센서', description: '빛의 밝기를 측정해요', icon: '☀️' },
  { id: 'sound', name: '소리 감지 센서', description: '큰 소리를 감지해요', icon: '🎤' },
  { id: 'gas', name: '가스 센서', description: '연기나 가스 누출을 감지해요', icon: '💨' },
  { id: 'camera', name: '카메라 모듈', description: '이미지를 인식하거나 촬영해요', icon: '📷' },
  { id: 'button', name: '버튼/스위치', description: '사용자가 직접 누를 수 있어요', icon: '🔘' },
  { id: 'soil', name: '토양 수분 센서', description: '화분의 수분을 측정해요', icon: '🌱' },
];

export const ACTION_OPTIONS: ActionOption[] = [
  { id: 'led', name: 'LED 조명', description: '불빛을 켜서 알려줘요', icon: '💡' },
  { id: 'lcd', name: 'LCD 디스플레이', description: '글자를 화면에 보여줘요', icon: '📟' },
  { id: 'speaker', name: '스피커/부저', description: '소리나 경고음을 내요', icon: '🔊' },
  { id: 'motor_servo', name: '서보 모터', description: '각도를 조절해 움직여요 (예: 문 열기)', icon: '🦾' },
  { id: 'motor_dc', name: 'DC 모터/팬', description: '바퀴나 날개를 회전시켜요', icon: '⚙️' },
  { id: 'wifi', name: '스마트폰 알림', description: 'Wi-Fi로 메시지를 보내요', icon: '📱' },
  { id: 'relay', name: '전원 제어(릴레이)', description: '가전제품의 전원을 켜고 꺼요', icon: '🔌' },
];

export const EXAMPLE_PROJECTS: ExampleProject[] = [
  {
    title: "스마트 급식 줄서기 알리미",
    problem: "점심시간에 급식 줄이 너무 길어서 얼마나 기다려야 할지 모르겠어요.",
    sensors: ["초음파 거리 센서", "인체 감지(PIR) 센서"],
    actions: ["LCD 디스플레이", "스마트폰 알림"]
  },
  {
    title: "깜박임 방지 스마트 필통",
    problem: "집에 갈 때 필통이나 준비물을 자꾸 학교에 두고 가요.",
    sensors: ["조도 센서", "초음파 거리 센서"],
    actions: ["스피커/부저", "LED 조명"]
  },
  {
    title: "자동 화분 물주기 로봇",
    problem: "교실 뒤편의 화분이 방학 동안 다 말라 죽었어요.",
    sensors: ["토양 수분 센서", "온습도 센서"],
    actions: ["서보 모터", "DC 모터/팬"]
  }
];

export const RANDOM_IDEAS = [
  "도서관에 빈 자리가 있는지 교실에서 알고 싶어요.",
  "비가 올 때 창문이 자동으로 닫혔으면 좋겠어요.",
  "반려동물이 밥을 먹었는지 확인하고 싶어요.",
  "화장실에 휴지가 떨어지기 전에 알고 싶어요.",
  "밤에 자전거 탈 때 자동으로 불이 켜지면 좋겠어요.",
  "쓰레기통이 꽉 차면 알려주는 장치가 필요해요."
];