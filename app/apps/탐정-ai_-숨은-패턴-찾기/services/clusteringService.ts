import { Point, Centroid, Article } from '../types';
import { CLUSTER_COLORS } from '../constants';

export const generateRandomPoints = (count: number, width: number, height: number): Point[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p-${i}`,
    x: Math.random() * width,
    y: Math.random() * height,
    clusterId: null,
  }));
};

export const initializeCentroids = (k: number, width: number, height: number): Centroid[] => {
  return Array.from({ length: k }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
  }));
};

const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const assignClusters = (points: Point[], centroids: Centroid[]): Point[] => {
  return points.map((p) => {
    let minDist = Infinity;
    let clusterId = -1;

    centroids.forEach((c) => {
      const d = distance(p, c);
      if (d < minDist) {
        minDist = d;
        clusterId = c.id;
      }
    });

    return {
      ...p,
      clusterId,
      color: centroids.find((c) => c.id === clusterId)?.color,
    };
  });
};

export const updateCentroids = (points: Point[], centroids: Centroid[]): Centroid[] => {
  return centroids.map((c) => {
    const clusterPoints = points.filter((p) => p.clusterId === c.id);
    if (clusterPoints.length === 0) return c; // Avoid division by zero, keep current pos

    const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
    const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);

    return {
      ...c,
      x: sumX / clusterPoints.length,
      y: sumY / clusterPoints.length,
    };
  });
};

// For News Clustering Simulation
export const getTargetPositionForArticle = (
  category: Article['category'],
  width: number,
  height: number
): { x: number; y: number } => {
  // Define 3 cluster centers
  const clusters = {
    sports: { x: width * 0.2, y: height * 0.3 },
    politics: { x: width * 0.8, y: height * 0.3 },
    entertainment: { x: width * 0.5, y: height * 0.8 },
  };

  const center = clusters[category];
  // Add some randomness (jitter)
  const jitter = 60;
  return {
    x: center.x + (Math.random() - 0.5) * jitter,
    y: center.y + (Math.random() - 0.5) * jitter,
  };
};