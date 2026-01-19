import React from 'react';

export interface Agent {
  id: string;
  name: string;
  goal: string;
  environment: string;
  sensors: string[];
  actions: string[];
  characteristics: string;
  avatarColor: string;
  createdAt: number;
}

export enum SensorType {
  CAMERA = '카메라 (시각)',
  MICROPHONE = '마이크 (청각)',
  GPS = 'GPS (위치)',
  THERMOMETER = '온도계 (온도)',
  TOUCH = '터치 센서 (압력)',
  MOTION = '모션 센서 (움직임)',
  WIFI = 'Wi-Fi/인터넷 (데이터)',
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  agentDescription: string;
  missingElement: string;
  options: string[];
}

export interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
}