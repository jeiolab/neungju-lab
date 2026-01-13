import { DataPoint, ScenarioType } from '../types';

// Helper to generate random number
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate mock data points based on K to visualize clustering
export const generateMockData = (k: number, scenario: ScenarioType): DataPoint[] => {
  const points: DataPoint[] = [];
  const totalPoints = 150;
  
  // Define roughly where centers might be for 2-8 clusters to make it look realistic
  // In a real app, we'd run K-Means on a fixed dataset. Here we reverse-engineer for visual clarity.
  const centers = [];
  for (let i = 0; i < k; i++) {
    centers.push({
      x: random(20, 80),
      y: random(20, 80),
    });
  }

  // Generate points around centers
  for (let i = 0; i < totalPoints; i++) {
    const centerIndex = Math.floor(i % k);
    const center = centers[centerIndex];
    
    // Spread varies to simulate cohesion
    const spread = scenario === 'streaming' ? 15 : 10; 

    points.push({
      x: Math.min(100, Math.max(0, center.x + random(-spread, spread))),
      y: Math.min(100, Math.max(0, center.y + random(-spread, spread))),
      cluster: centerIndex + 1,
    });
  }

  return points;
};

// Simple heuristic scoring (mocking the backend math)
export const calculateMetrics = (k: number, weights: { interpretability: number, cohesion: number, efficiency: number }) => {
  // Interpretability goes DOWN as K goes UP
  const rawInterp = Math.max(0, 10 - (k * 1.2));
  
  // Cohesion goes UP as K goes UP (closer to centers)
  const rawCohesion = Math.min(10, 2 + (k * 1.0));
  
  // Efficiency (Operation) usually peaks at a sweet spot (e.g., 3-5) and drops if too complex or too simple
  let rawEfficiency = 5;
  if (k >= 3 && k <= 5) rawEfficiency = 9;
  else if (k < 3) rawEfficiency = 6;
  else rawEfficiency = Math.max(2, 9 - ((k-5) * 2));

  // Weighted Score (0-100 scale normalized)
  const totalWeight = weights.interpretability + weights.cohesion + weights.efficiency || 1;
  const weightedScore = (
    (rawInterp * weights.interpretability) + 
    (rawCohesion * weights.cohesion) + 
    (rawEfficiency * weights.efficiency)
  ) / totalWeight * 10;

  return {
    metrics: {
      interpretability: rawInterp,
      cohesion: rawCohesion,
      efficiency: rawEfficiency,
    },
    finalScore: Math.round(weightedScore)
  };
};