import { Point, Centroid } from '../types';
import { CLUSTER_COLORS } from '../constants';

// Generate random data points
export const generatePoints = (count: number, width: number, height: number): Point[] => {
  const points: Point[] = [];
  // Create some natural clusters for better visualization
  const centers = [
    { x: width * 0.3, y: height * 0.3 },
    { x: width * 0.7, y: height * 0.7 },
    { x: width * 0.3, y: height * 0.7 },
    { x: width * 0.7, y: height * 0.3 },
    { x: width * 0.5, y: height * 0.5 },
  ];

  for (let i = 0; i < count; i++) {
    // Pick a random center to be somewhat near to
    const center = centers[Math.floor(Math.random() * centers.length)];
    const spread = 80; // How spread out the points are
    
    let x = center.x + (Math.random() - 0.5) * spread * 2;
    let y = center.y + (Math.random() - 0.5) * spread * 2;

    // Clamp to canvas
    x = Math.max(10, Math.min(width - 10, x));
    y = Math.max(10, Math.min(height - 10, y));

    points.push({ x, y, clusterIndex: -1 });
  }
  return points;
};

// Initialize centroids
export const initializeCentroids = (k: number, width: number, height: number, method: 'random' | 'far', points: Point[]): Centroid[] => {
  const centroids: Centroid[] = [];
  
  if (method === 'random') {
    for (let i = 0; i < k; i++) {
      centroids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        color: CLUSTER_COLORS[i % CLUSTER_COLORS.length]
      });
    }
  } else {
    // 'far' method (Simplified K-Means++ logic idea: pick random point, then pick furthest)
    // For simplicity in this demo, we just pick points that are actually from the dataset to avoid empty clusters
    // and try to space them out by index if sorted, or just random points from the set.
    const usedIndices = new Set<number>();
    for (let i = 0; i < k; i++) {
        let idx = Math.floor(Math.random() * points.length);
        while(usedIndices.has(idx)) {
             idx = Math.floor(Math.random() * points.length);
        }
        usedIndices.add(idx);
        centroids.push({
            x: points[idx].x,
            y: points[idx].y,
            color: CLUSTER_COLORS[i % CLUSTER_COLORS.length]
        });
    }
  }
  return centroids;
};

const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Step 1: Assign points to nearest centroid
export const assignClusters = (points: Point[], centroids: Centroid[]): { points: Point[], changed: boolean } => {
  let changed = false;
  const newPoints = points.map(p => {
    let minDistance = Infinity;
    let clusterIndex = -1;

    centroids.forEach((c, idx) => {
      const dist = getDistance(p, c);
      if (dist < minDistance) {
        minDistance = dist;
        clusterIndex = idx;
      }
    });

    if (p.clusterIndex !== clusterIndex) {
      changed = true;
    }

    return { ...p, clusterIndex };
  });

  return { points: newPoints, changed };
};

// Step 2: Update centroids to mean of points
export const updateCentroids = (points: Point[], centroids: Centroid[]): Centroid[] => {
  return centroids.map((c, idx) => {
    const clusterPoints = points.filter(p => p.clusterIndex === idx);
    if (clusterPoints.length === 0) return c; // Don't move if no points

    const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
    const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);

    return {
      ...c,
      x: sumX / clusterPoints.length,
      y: sumY / clusterPoints.length
    };
  });
};
