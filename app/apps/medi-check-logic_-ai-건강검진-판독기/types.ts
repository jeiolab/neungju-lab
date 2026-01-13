export enum DiagnosisType {
  NORMAL = '정상',
  WARNING = '주의',
  DANGER = '위험',
}

export enum VariableType {
  SYSTOLIC = '수축기 혈압',
  DIASTOLIC = '이완기 혈압',
  BLOOD_SUGAR = '공복 혈당',
}

export enum OperatorType {
  GTE = '>= (이상)',
  LT = '< (미만)',
}

export interface LogicBlock {
  id: string;
  variable: VariableType;
  operator: OperatorType;
  value: number;
  result: DiagnosisType;
}

export interface Patient {
  id: string;
  name: string;
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  trueDiagnosis: DiagnosisType; // The medically correct diagnosis based on standard guidelines
}

export interface SimulationResult {
  patientId: string;
  patientName: string;
  inputs: {
    systolic: number;
    diastolic: number;
    bloodSugar: number;
  };
  userDiagnosis: DiagnosisType;
  correctDiagnosis: DiagnosisType;
  isCorrect: boolean;
  message: string;
}

export type TabType = 'theory' | 'simulation' | 'info' | 'quiz' | 'think';
