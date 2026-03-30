import { BlockType, CodeBlock, Stage, QuizQuestion } from './types';

// Blocks Library
export const BLOCKS: Record<string, CodeBlock> = {
  START: { id: 'start', label: '시작 (Start)', type: BlockType.START, codeSnippet: 'def main():' },
  READ_TEMP: { id: 'read_temp', label: '온도 센서 읽기', type: BlockType.SENSOR, codeSnippet: 'temp = sensor.read_temperature()' },
  READ_MOTION: { id: 'read_motion', label: '동작 센서 읽기', type: BlockType.SENSOR, codeSnippet: 'motion = sensor.read_motion()' },
  IF_TEMP_HIGH: { id: 'if_temp_high', label: '만약 온도가 25도보다 높다면', type: BlockType.LOGIC, codeSnippet: 'if temp > 25:' },
  IF_MOTION_DETECTED: { id: 'if_motion', label: '만약 움직임이 감지되면', type: BlockType.LOGIC, codeSnippet: 'if motion == True:' },
  FAN_ON: { id: 'fan_on', label: '선풍기 켜기', type: BlockType.ACTION, codeSnippet: '    actuator.fan.on()' },
  LIGHT_ON: { id: 'light_on', label: '조명 켜기', type: BlockType.ACTION, codeSnippet: '    actuator.light.on()' },
  ELSE: { id: 'else', label: '아니라면 (Else)', type: BlockType.ELSE, codeSnippet: 'else:' },
  FAN_OFF: { id: 'fan_off', label: '선풍기 끄기', type: BlockType.ACTION, codeSnippet: '    actuator.fan.off()' },
  LIGHT_OFF: { id: 'light_off', label: '조명 끄기', type: BlockType.ACTION, codeSnippet: '    actuator.light.off()' },
};

// Stages
export const STAGES: Stage[] = [
  {
    id: 1,
    title: "1단계: 자동 선풍기",
    description: "교실이 너무 더우면 자동으로 선풍기를 켜는 시스템을 만들어보세요.",
    mission: "온도가 25도보다 높을 때 선풍기를 켜고, 그렇지 않으면 끄세요.",
    initialState: { temperature: 30, fanOn: false },
    availableBlocks: [
      BLOCKS.START,
      BLOCKS.READ_TEMP,
      BLOCKS.IF_TEMP_HIGH,
      BLOCKS.FAN_ON,
      BLOCKS.ELSE,
      BLOCKS.FAN_OFF
    ],
    correctSequenceIds: [
      ['start', 'read_temp', 'if_temp_high', 'fan_on', 'else', 'fan_off'],
      ['start', 'read_temp', 'if_temp_high', 'fan_on'] // Simplified success without else allowed too
    ]
  },
  {
    id: 2,
    title: "2단계: 스마트 조명",
    description: "사람이 들어오면 자동으로 불이 켜지는 시스템이 필요합니다.",
    mission: "동작 센서가 감지되면 조명을 켜세요. (에너지 절약!)",
    initialState: { motion: true, lightOn: false },
    availableBlocks: [
      BLOCKS.START,
      BLOCKS.READ_MOTION,
      BLOCKS.IF_MOTION_DETECTED,
      BLOCKS.LIGHT_ON,
      BLOCKS.ELSE,
      BLOCKS.LIGHT_OFF,
      BLOCKS.FAN_ON // Distractor
    ],
    correctSequenceIds: [
      ['start', 'read_motion', 'if_motion', 'light_on', 'else', 'light_off'],
      ['start', 'read_motion', 'if_motion', 'light_on']
    ]
  }
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "컴퓨터가 명령을 위에서 아래로 차례대로 실행하는 구조를 무엇이라고 할까요?",
    answer: "순차",
    type: 'choice',
    options: ["순차", "반복", "선택", "함수"]
  },
  {
    id: 2,
    question: "'만약 ~라면'과 같이 조건에 따라 다른 행동을 하는 구조는?",
    answer: "선택",
    type: 'choice',
    options: ["순차", "입력", "선택", "변수"]
  },
  {
    id: 3,
    question: "센서 값을 읽어오기 전에, 그 값을 사용하는 조건문을 먼저 쓰면 프로그램이 제대로 작동할까요?",
    answer: "아니오",
    type: 'choice',
    options: ["예", "아니오"]
  }
];