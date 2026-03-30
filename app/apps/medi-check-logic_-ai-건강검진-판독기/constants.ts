import { DiagnosisType, VariableType, OperatorType } from './types';

export const INITIAL_LOGIC_BLOCKS = [
  {
    id: '1',
    variable: VariableType.SYSTOLIC,
    operator: OperatorType.GTE,
    value: 140,
    result: DiagnosisType.DANGER,
  },
  {
    id: '2',
    variable: VariableType.SYSTOLIC,
    operator: OperatorType.GTE,
    value: 120,
    result: DiagnosisType.WARNING,
  },
  // Implicit "Else" is Normal
];

export const DIAGNOSIS_COLORS = {
  [DiagnosisType.NORMAL]: '#10b981', // emerald-500
  [DiagnosisType.WARNING]: '#f59e0b', // amber-500
  [DiagnosisType.DANGER]: '#ef4444', // red-500
};

export const SAMPLE_PATIENTS_NAMES = ['김철수', '이영희', '박민수', '최지우', '정우성'];

// Standard medical guidelines (simplified for education)
// Hypertension: Systolic >= 140 OR Diastolic >= 90
// Pre-hypertension: Systolic >= 120 OR Diastolic >= 80
export const getStandardDiagnosis = (sys: number, dia: number): DiagnosisType => {
  if (sys >= 140 || dia >= 90) return DiagnosisType.DANGER;
  if (sys >= 120 || dia >= 80) return DiagnosisType.WARNING;
  return DiagnosisType.NORMAL;
};
