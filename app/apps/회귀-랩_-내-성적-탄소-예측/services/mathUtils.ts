import { DataPoint, SimulationMode, RegressionResult } from '../types';

// Constants for Data Generation
const SCORE_BASE = 40;
const SCORE_W_STUDY = 2.2;
const SCORE_W_SLEEP = 1.5;
const SCORE_W_ABSENCE = -3.5;

const CARBON_COEFF = 0.42; // Approx kg CO2 per kWh in Korea (example)

// Matrix Math Helpers
const transpose = (matrix: number[][]): number[][] => {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

const multiply = (a: number[][], b: number[][]): number[][] => {
  const result = new Array(a.length).fill(0).map(() => new Array(b[0].length).fill(0));
  return result.map((row, i) => {
    return row.map((_, j) => {
      return a[i].reduce((sum, elm, k) => sum + elm * b[k][j], 0);
    });
  });
};

// Gaussian elimination for matrix inversion (sufficient for small N)
const invert = (matrix: number[][]): number[][] => {
  const n = matrix.length;
  // Create augmented matrix [A | I]
  const aug = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))]);

  for (let i = 0; i < n; i++) {
    // Pivot
    let pivot = aug[i][i];
    if (Math.abs(pivot) < 1e-10) return matrix; // Singular or error
    for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivot;

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) aug[k][j] -= factor * aug[i][j];
      }
    }
  }
  return aug.map(row => row.slice(n));
};

export const generateDataset = (
  mode: SimulationMode,
  count: number,
  outlierRatio: number
): DataPoint[] => {
  const data: DataPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    const isOutlier = Math.random() < outlierRatio;
    let noise = (Math.random() - 0.5) * 10; // Base noise
    
    if (isOutlier) {
      noise += (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 20);
    }

    if (mode === SimulationMode.SCORE) {
      // Inputs: Study (0-10h), Sleep (4-10h), Absence (0-5)
      const study = Math.random() * 10;
      const sleep = 4 + Math.random() * 6;
      const absence = Math.floor(Math.random() * 5);
      
      let score = SCORE_BASE 
        + (SCORE_W_STUDY * study) 
        + (SCORE_W_SLEEP * sleep) 
        + (SCORE_W_ABSENCE * absence) 
        + noise;
        
      score = Math.max(0, Math.min(100, score)); // Clamp 0-100

      data.push({
        id: i,
        x: Number(study.toFixed(1)),
        x2: Number(sleep.toFixed(1)),
        x3: absence,
        y: Number(score.toFixed(1)),
        isOutlier
      });
    } else {
      // Carbon: kWh (50 - 500)
      const kwh = 50 + Math.random() * 450;
      let co2 = kwh * CARBON_COEFF + (noise * 0.1); // Small noise for physics
      
      if (isOutlier) co2 *= 2; // Simulate massive leak or error

      data.push({
        id: i,
        x: Number(kwh.toFixed(1)),
        y: Number(co2.toFixed(1)),
        isOutlier
      });
    }
  }
  return data;
};

// Ordinary Least Squares Implementation
export const trainModel = (data: DataPoint[], mode: SimulationMode): RegressionResult => {
  const N = data.length;
  if (N < 2) return { slope: 0, intercept: 0, mae: 0, rmse: 0 };

  let weights: number[] = [];

  // Prepare Matrices: Y = X * Beta
  // Y: [N x 1]
  // X: [N x (features + 1)] (1 is for intercept)
  
  const Y = data.map(d => [d.y]);
  let X: number[][] = [];

  if (mode === SimulationMode.SCORE) {
    // Features: 1 (Intercept), Study(x), Sleep(x2), Absence(x3)
    X = data.map(d => [1, d.x, d.x2 || 0, d.x3 || 0]);
  } else {
    // Features: 1 (Intercept), kWh(x)
    X = data.map(d => [1, d.x]);
  }

  try {
    const XT = transpose(X);
    const XTX = multiply(XT, X);
    const XTX_inv = invert(XTX);
    const XTY = multiply(XT, Y);
    const Beta = multiply(XTX_inv, XTY); // Result is [(features+1) x 1]

    weights = Beta.map(row => row[0]);
  } catch (e) {
    console.error("Regression calculation failed", e);
    weights = new Array(X[0].length).fill(0);
  }

  // Calculate Errors
  let sumAbsError = 0;
  let sumSqError = 0;

  data.forEach(d => {
    let pred = weights[0]; // Intercept
    pred += weights[1] * d.x;
    if (mode === SimulationMode.SCORE) {
      pred += weights[2] * (d.x2 || 0);
      pred += weights[3] * (d.x3 || 0);
    }
    
    const error = d.y - pred;
    sumAbsError += Math.abs(error);
    sumSqError += error * error;
  });

  return {
    intercept: weights[0],
    slope: weights[1], // Primary slope (Study or kWh)
    weights: weights,
    mae: Number((sumAbsError / N).toFixed(2)),
    rmse: Number(Math.sqrt(sumSqError / N).toFixed(2))
  };
};