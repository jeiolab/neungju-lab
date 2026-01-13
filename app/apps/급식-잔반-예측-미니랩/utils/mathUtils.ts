import { DataPoint, ScenarioType } from '../types';

export const generateData = (
  scenario: ScenarioType,
  count: number,
  noiseLevel: number, // 0 to 10
  featureValue: number, // 0 to 100, impacts the slope/curve
  splitRatio: number // 0 to 100
): DataPoint[] => {
  const data: DataPoint[] = [];
  const noiseMagnitude = noiseLevel * 2.5; // Scale noise

  for (let i = 0; i < count; i++) {
    // Generate X evenly distributed
    const x = (i / count) * 100;
    
    let y = 0;
    
    // Base functions based on scenario
    if (scenario === 'lunch') {
      // Input: Menu Preference (Higher pref -> Lower waste)
      // Inverse relationship
      const slope = -0.8 - (featureValue / 200); 
      y = 100 + (x * slope);
    } else if (scenario === 'icecream') {
      // Input: Temperature (Higher temp -> Higher sales)
      // Positive relationship with a slight curve (exponential at high heat)
      const slope = 0.5 + (featureValue / 100);
      y = 10 + (x * slope) + (x * x * 0.005); 
    } else if (scenario === 'co2') {
      // Input: Ventilation (Higher vent -> Lower CO2)
      // 1/x relationship approximated
      y = 1000 - (x * 8) + (featureValue * 2);
      if (y < 400) y = 400 + Math.random() * 20;
    }

    // Add Random Noise
    const randomNoise = (Math.random() - 0.5) * noiseMagnitude * 10;
    y += randomNoise;

    // Clamp Y
    y = Math.max(0, y);

    const isTrain = Math.random() * 100 < splitRatio;
    
    data.push({
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      type: isTrain ? 'train' : 'test'
    });
  }

  return data.sort((a, b) => a.x - b.x);
};

// Simple Linear Regression (y = mx + b)
export const calculateLinearRegression = (data: DataPoint[]) => {
  const n = data.length;
  if (n === 0) return { m: 0, b: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  data.forEach(p => {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  });

  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  return { m, b };
};

// Polynomial Regression (Degree 2: y = ax^2 + bx + c) using Matrix determinant method (Cramer's rule or similar simplified)
export const calculatePolynomialRegression = (data: DataPoint[]) => {
  const n = data.length;
  if (n < 3) return { a: 0, b: 0, c: 0 };

  let sx = 0, sx2 = 0, sx3 = 0, sx4 = 0;
  let sy = 0, sxy = 0, sx2y = 0;

  data.forEach(p => {
    const x = p.x;
    const y = p.y;
    sx += x;
    sx2 += x * x;
    sx3 += x * x * x;
    sx4 += x * x * x * x;
    sy += y;
    sxy += x * y;
    sx2y += x * x * y;
  });

  // Matrix:
  // [ n    sx   sx2  ] [ c ]   [ sy   ]
  // [ sx   sx2  sx3  ] [ b ] = [ sxy  ]
  // [ sx2  sx3  sx4  ] [ a ]   [ sx2y ]
  
  // Gaussian elimination or determinant solving
  // Let's use a simplified Gaussian elimination for 3x3
  const matrix = [
    [n, sx, sx2, sy],
    [sx, sx2, sx3, sxy],
    [sx2, sx3, sx4, sx2y]
  ];

  for (let i = 0; i < 3; i++) {
    // Pivot
    let pivot = matrix[i][i];
    for (let j = i + 1; j < 3; j++) {
      const factor = matrix[j][i] / pivot;
      for (let k = i; k < 4; k++) {
        matrix[j][k] -= factor * matrix[i][k];
      }
    }
  }

  // Back substitution
  const a = matrix[2][3] / matrix[2][2];
  const b = (matrix[1][3] - matrix[1][2] * a) / matrix[1][1];
  const c = (matrix[0][3] - matrix[0][2] * a - matrix[0][1] * b) / matrix[0][0];

  return { a, b, c };
};

export const calculateMAE = (data: DataPoint[], predictFn: (x: number) => number) => {
  if (data.length === 0) return 0;
  let errorSum = 0;
  data.forEach(p => {
    errorSum += Math.abs(p.y - predictFn(p.x));
  });
  return errorSum / data.length;
};