export enum ComponentType {
  SENSOR = 'SENSOR',
  ACTUATOR = 'ACTUATOR',
  LOGIC = 'LOGIC'
}

export interface IoTComponent {
  id: string;
  name: string;
  type: ComponentType;
  icon: string;
  description: string;
}

export interface LogicBlock {
  conditionSensorId: string;
  operator: '>' | '<' | '=' | 'DETECTS';
  threshold: string;
  actionActuatorId: string;
  actionType: string;
}

export interface Project {
  id: string;
  title: string;
  problem: string;
  sensors: IoTComponent[];
  actuators: IoTComponent[];
  logic: LogicBlock[];
  createdAt: number;
  aiFeedback?: string;
  score?: number;
}

export interface QuizItem {
  id: string;
  text: string;
  correctOrder: number;
}

export type Step = 'PROBLEM' | 'DEVICES' | 'ALGORITHM' | 'REVIEW';

export const AVAILABLE_SENSORS: IoTComponent[] = [
  { id: 's_dist', name: '거리 센서', type: ComponentType.SENSOR, icon: 'Ruler', description: '물체와의 거리를 측정해요.' },
  { id: 's_temp', name: '온도 센서', type: ComponentType.SENSOR, icon: 'Thermometer', description: '얼마나 뜨거운지 측정해요.' },
  { id: 's_motion', name: '동작 감지 센서', type: ComponentType.SENSOR, icon: 'Camera', description: '움직임을 포착해요.' },
  { id: 's_sound', name: '소리 센서', type: ComponentType.SENSOR, icon: 'Mic', description: '시끄러운 정도를 측정해요.' },
  { id: 's_light', name: '조도 센서', type: ComponentType.SENSOR, icon: 'Sun', description: '빛의 밝기를 측정해요.' },
  { id: 's_button', name: '버튼', type: ComponentType.SENSOR, icon: 'MousePointerClick', description: '직접 눌러서 작동시켜요.' },
];

export const AVAILABLE_ACTUATORS: IoTComponent[] = [
  { id: 'a_led', name: 'LED 전광판', type: ComponentType.ACTUATOR, icon: 'Grid3X3', description: '글자나 그림을 보여줘요.' },
  { id: 'a_speak', name: '스피커', type: ComponentType.ACTUATOR, icon: 'Speaker', description: '소리나 안내 방송을 내보내요.' },
  { id: 'a_motor', name: '서보 모터', type: ComponentType.ACTUATOR, icon: 'RefreshCw', description: '물건을 움직이거나 회전시켜요.' },
  { id: 'a_app', name: '스마트폰 알림', type: ComponentType.ACTUATOR, icon: 'Smartphone', description: '선생님이나 학생에게 메시지를 보내요.' },
  { id: 'a_fan', name: '선풍기', type: ComponentType.ACTUATOR, icon: 'Fan', description: '바람을 일으켜요.' },
];
