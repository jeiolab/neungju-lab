import { Point, Neighbor, ClassType } from '../types';

export const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const findNearestNeighbors = (
  target: { x: number; y: number },
  points: Point[],
  k: number
): Neighbor[] => {
  return points
    .map((p) => ({
      ...p,
      distance: calculateDistance(target, p),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
};

export const classifyPoint = (neighbors: Neighbor[]): ClassType => {
  const redCount = neighbors.filter((n) => n.type === 'red').length;
  const blueCount = neighbors.filter((n) => n.type === 'blue').length;

  if (redCount > blueCount) return 'red';
  if (blueCount > redCount) return 'blue';
  return 'neutral'; // Tie (shouldn't happen often with odd k)
};

export const generateRandomPoints = (count: number, width: number, height: number): Point[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p-${i}`,
    x: Math.random() * width,
    y: Math.random() * height,
    type: Math.random() > 0.5 ? 'red' : 'blue',
  }));
};
