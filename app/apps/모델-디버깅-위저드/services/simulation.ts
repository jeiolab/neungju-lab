import { DataSize, NoiseLevel, ProblemType, SimulationState, SimulationResult } from '../types';

export const calculatePerformance = (state: SimulationState): SimulationResult => {
  const { dataSize, noiseLevel, modelComplexity, splitRatio } = state;

  // Base capability of the model
  let basePerformance = 0.85;

  // Data Size Impact
  // More data allows for better generalization (test score) and supports higher complexity
  let dataFactor = 0;
  let optimalComplexity = 3;
  
  if (dataSize === DataSize.SMALL) {
    dataFactor = -0.15;
    optimalComplexity = 2;
  } else if (dataSize === DataSize.MEDIUM) {
    dataFactor = 0;
    optimalComplexity = 5;
  } else {
    dataFactor = 0.1;
    optimalComplexity = 7;
  }

  // Noise Impact
  // Noise hurts Test score significantly, and hurts Train score slightly (unless overfitted)
  let noiseFactor = 0;
  if (noiseLevel === NoiseLevel.MEDIUM) noiseFactor = -0.05;
  if (noiseLevel === NoiseLevel.HIGH) noiseFactor = -0.15;

  // Split Ratio Impact
  // If test set is too small (splitRatio high, e.g. 0.9), test score becomes volatile (simulated here as slightly lower average reliability)
  // If train set is too small (splitRatio low, e.g. 0.5), model learns poorly
  let splitPenalty = 0;
  if (splitRatio > 0.85) splitPenalty = -0.05; // Too little test data
  if (splitRatio < 0.6) splitPenalty = -0.08; // Too little train data

  // Complexity Impact (The core logic)
  // Train Score: Asymptotically approaches 1.0 (or 1.0 - noise) as complexity grows
  // Test Score: Parabolic. Peaked at 'optimalComplexity', drops after.
  
  // 1. Calculate Train Score
  // Logarithmic growth based on complexity
  const trainCurve = 1 - Math.exp(-0.5 * modelComplexity); 
  // Adjust for noise (if noise is high, even complex models might struggle to get 100% on train unless they memorize pure noise)
  const maxTrain = noiseLevel === NoiseLevel.HIGH ? 0.95 : 0.99;
  let trainScore = Math.min(maxTrain, trainCurve * (1 + (dataSize === DataSize.SMALL ? 0.1 : 0))); // Small data is easier to memorize

  // 2. Calculate Test Score
  // Distance from optimal complexity
  const dist = modelComplexity - optimalComplexity;
  // Penalty grows with square of distance (steeper for overfitting than underfitting usually)
  let complexityPenalty = 0;
  
  if (dist < 0) {
    // Underfitting
    complexityPenalty = Math.abs(dist) * 0.1;
  } else {
    // Overfitting
    // Overfitting penalty is worse if data is small or noise is high
    const overfitMultiplier = (dataSize === DataSize.SMALL ? 0.05 : 0.02) + (noiseLevel === NoiseLevel.HIGH ? 0.05 : 0.01);
    complexityPenalty = (dist * dist) * overfitMultiplier * 3;
  }

  let testScore = basePerformance + dataFactor + noiseFactor + splitPenalty - complexityPenalty;

  // Cap scores
  trainScore = Math.max(0, Math.min(1, trainScore));
  testScore = Math.max(0, Math.min(1, testScore));

  // Determine Status
  const gap = trainScore - testScore;
  let status: SimulationResult['status'] = 'good';
  let message = "좋은 균형! 모델이 새로운 데이터에도 잘 동작합니다.";

  if (trainScore < 0.65) {
    status = 'underfitting';
    message = "과소적합(Underfitting): 모델이 너무 단순해서 패턴을 배우지 못했습니다.";
  } else if (gap > 0.25) {
    status = 'severe_overfitting';
    message = "심각한 과적합(Severe Overfitting)! 모델이 훈련 데이터를 통째로 외워버렸습니다.";
  } else if (gap > 0.15) {
    status = 'overfitting';
    message = "과적합 경고: 훈련 점수는 오르는데 테스트 점수는 떨어지고 있습니다.";
  }

  // Regression Adjustment (Just semantic mapping for the simulation, mathematically similar)
  if (state.problemType === ProblemType.REGRESSION) {
    // For regression, we might visualize MAE, but for simplicity of the "Score" concept in this app (higher is better), 
    // we keep the 0-1 scale as R^2 or similar accuracy metric.
  }

  return {
    trainScore,
    testScore,
    message,
    status
  };
};

export const generateConfusionMatrix = (score: number, samples: number) => {
  // Simplified logic to generate a 2x2 matrix based on accuracy score
  const correct = Math.floor(samples * score);
  const incorrect = samples - correct;
  
  const truePos = Math.floor(correct * 0.6);
  const trueNeg = correct - truePos;
  const falsePos = Math.floor(incorrect * 0.5);
  const falseNeg = incorrect - falsePos;

  return { tp: truePos, tn: trueNeg, fp: falsePos, fn: falseNeg };
};