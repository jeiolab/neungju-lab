import { DataPoint, DistanceMetric, Genre } from '../types';

export const normalize = (value: number, min: number, max: number): number => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

export const calculateDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  metric: DistanceMetric
): number => {
  if (metric === 'Manhattan') {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }
  // Euclidean
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const findNearestNeighbors = (
  target: { x: number; y: number },
  points: DataPoint[],
  k: number,
  metric: DistanceMetric,
  normalizeOn: boolean,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): { neighbor: DataPoint; distance: number; rank: number }[] => {
  
  const distances = points.map((point) => {
    let d = 0;
    if (normalizeOn) {
      const p1Norm = {
        x: normalize(target.x, bounds.minX, bounds.maxX),
        y: normalize(target.y, bounds.minY, bounds.maxY)
      };
      const p2Norm = {
        x: normalize(point.x, bounds.minX, bounds.maxX),
        y: normalize(point.y, bounds.minY, bounds.maxY)
      };
      d = calculateDistance(p1Norm, p2Norm, metric);
    } else {
      d = calculateDistance(target, point, metric);
    }
    return { neighbor: point, distance: d };
  });

  // Sort by distance ascending
  distances.sort((a, b) => a.distance - b.distance);

  // Take top k
  return distances.slice(0, k).map((item, index) => ({ ...item, rank: index + 1 }));
};

export const getMajorityVote = (neighbors: { neighbor: DataPoint }[]): { winner: Genre | 'Tie'; counts: Record<string, number> } => {
  if (neighbors.length === 0) return { winner: 'Tie', counts: {} };

  const counts: Record<string, number> = {};
  
  neighbors.forEach((n) => {
    const g = n.neighbor.genre;
    counts[g] = (counts[g] || 0) + 1;
  });

  let maxCount = -1;
  let winners: string[] = [];

  Object.entries(counts).forEach(([genre, count]) => {
    if (count > maxCount) {
      maxCount = count;
      winners = [genre];
    } else if (count === maxCount) {
      winners.push(genre);
    }
  });

  return {
    winner: winners.length === 1 ? (winners[0] as Genre) : 'Tie',
    counts
  };
};