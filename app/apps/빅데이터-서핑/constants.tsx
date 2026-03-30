import { DataItemDef, Mission, JobTitle } from './types';

export const DATA_ITEMS: DataItemDef[] = [
  {
    id: 'youtube',
    name: '유튜브 영상 4K',
    category: ['Volume', 'Variety'],
    iconName: 'video',
    description: '1분마다 500시간 분량이 업로드되는 비정형 데이터',
    color: 'text-red-500',
  },
  {
    id: 'excel',
    name: '성적표.xlsx',
    category: ['SmallData'],
    iconName: 'file-spreadsheet',
    description: 'PC에서 처리가 가능한 정형 데이터 (Small Data)',
    color: 'text-green-500',
  },
  {
    id: 'cctv',
    name: 'CCTV 녹화본',
    category: ['Volume', 'Variety'],
    iconName: 'cctv',
    description: '24시간 365일 녹화되는 거대한 영상 데이터',
    color: 'text-gray-400',
  },
  {
    id: 'kakao',
    name: '실시간 톡',
    category: ['Velocity', 'Variety'],
    iconName: 'message-circle',
    description: '순간적으로 폭증하는 텍스트 및 이미지 데이터',
    color: 'text-yellow-400',
  },
  {
    id: 'sensor',
    name: 'IoT 기상 센서',
    category: ['Velocity'],
    iconName: 'cloud-lightning',
    description: '0.1초 단위로 스트리밍되는 실시간 데이터',
    color: 'text-blue-400',
  },
];

export const MISSIONS: Mission[] = [
  {
    target: 'Volume',
    title: '미션 1: 거대한 데이터를 찾아라!',
    description: '기존 PC로는 저장하기 힘든 "규모(Volume)"가 큰 데이터를 클릭하세요!',
  },
  {
    target: 'Velocity',
    title: '미션 2: 속도가 생명이다!',
    description: '실시간으로 빠르게 생성되는 "속도(Velocity)" 데이터를 수집하세요!',
  },
  {
    target: 'Variety',
    title: '미션 3: 형태가 다양해야 한다!',
    description: '숫자가 아닌 영상, 텍스트 등 "다양성(Variety)"을 가진 데이터를 찾으세요!',
  },
];

export const JOB_TITLES: JobTitle[] = ['데이터 분석가 인턴', '데이터 팀장', 'CTO (최고 기술 경영자)'];

export const LEVEL_THRESHOLDS = [0, 50, 100]; // Score to reach next level

export const QUIZ_DATA = {
  question: "다음 중 빅데이터의 특징(3V)이 아닌 것은?",
  options: ["규모 (Volume)", "속도 (Velocity)", "단순성 (Simplicity)", "다양성 (Variety)"],
  answerIndex: 2,
};