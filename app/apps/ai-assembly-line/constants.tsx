import { MLStep, MLStepType, AlgorithmType, Scenario } from './types';
import { Target, Database, Filter, BrainCircuit, ClipboardCheck } from 'lucide-react';
import React from 'react';

export const ML_STEPS: MLStep[] = [
  {
    id: 'step-1',
    type: MLStepType.PROBLEM_DEFINITION,
    label: '1. 문제 정의',
    description: '해결하고자 하는 목표를 명확히 설정합니다.',
    iconName: 'Target',
  },
  {
    id: 'step-2',
    type: MLStepType.DATA_COLLECTION,
    label: '2. 데이터 수집',
    description: '문제 해결에 필요한 데이터를 모읍니다.',
    iconName: 'Database',
  },
  {
    id: 'step-3',
    type: MLStepType.PREPROCESSING,
    label: '3. 데이터 전처리',
    description: '노이즈를 제거하고 학습하기 좋은 형태로 가공합니다.',
    iconName: 'Filter',
  },
  {
    id: 'step-4',
    type: MLStepType.MODEL_TRAINING,
    label: '4. 모델 학습',
    description: '알고리즘을 통해 데이터의 패턴을 익힙니다.',
    iconName: 'BrainCircuit',
  },
  {
    id: 'step-5',
    type: MLStepType.EVALUATION,
    label: '5. 모델 평가',
    description: '학습된 모델의 성능을 테스트합니다.',
    iconName: 'ClipboardCheck',
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'rain-pred',
    title: '새의 비행으로 비 예측하기',
    description: '고대부터 내려온 지혜! 새가 낮게 날면 비가 올까요? 데이터를 통해 비가 올지 안 올지 예측해 봅시다.',
    goal: '비가 온다(Yes) / 안 온다(No) 예측',
    correctAlgorithm: AlgorithmType.CLASSIFICATION,
    dataVariables: ['새의 고도', '습도', '기압'],
  },
  {
    id: 'carbon-pred',
    title: '자동차 탄소 배출량 예측',
    description: '환경 보호를 위해 자동차 엔진 크기에 따른 탄소 배출량을 정확한 수치로 예측해야 합니다.',
    goal: '탄소 배출량(g/km) 수치 예측',
    correctAlgorithm: AlgorithmType.REGRESSION,
    dataVariables: ['엔진 배기량', '연료 종류', '연비'],
  },
];

export const getIconComponent = (name: string, className?: string) => {
  switch (name) {
    case 'Target': return <Target className={className} />;
    case 'Database': return <Database className={className} />;
    case 'Filter': return <Filter className={className} />;
    case 'BrainCircuit': return <BrainCircuit className={className} />;
    case 'ClipboardCheck': return <ClipboardCheck className={className} />;
    default: return <Target className={className} />;
  }
};