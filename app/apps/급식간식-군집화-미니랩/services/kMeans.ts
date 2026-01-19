import { Snack, KMeansResult, Centroid, DistanceType } from '../types';

// Pseudo-random number generator seeded by date string
class SeededRandom {
  private seed: number;

  constructor(seedStr: string) {
    // Simple hash to number
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      const char = seedStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    this.seed = Math.abs(hash);
  }

  // Returns number between 0 and 1
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }, type: DistanceType): number => {
  if (type === 'manhattan') {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }
  // Euclidean
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const runKMeans = (
  snacks: Snack[],
  k: number,
  distanceType: DistanceType,
  seedDate: string
): KMeansResult => {
  const points = snacks.map((s) => ({ x: s.servingSize, y: s.kcal }));
  const rng = new SeededRandom(seedDate);

  // 1. Initialize Centroids (Randomly select k points from data to ensure bounds)
  let centroids: Centroid[] = [];
  const initialIndices = new Set<number>();
  
  while (centroids.length < k && initialIndices.size < points.length) {
    const idx = Math.floor(rng.next() * points.length);
    if (!initialIndices.has(idx)) {
        initialIndices.add(idx);
        centroids.push({ ...points[idx], clusterId: centroids.length });
    }
  }
  
  // Fallback if K > points (should be prevented by UI)
  if (centroids.length < k) {
      // Just fill with random existing points allowing duplicates strictly if needed, 
      // but UI limits K=6 and data > 15 usually.
  }

  let clusters = snacks.map((s) => ({ ...s, clusterId: -1 }));
  let iterations = 0;
  let hasChanged = true;
  const maxIterations = 20;

  while (hasChanged && iterations < maxIterations) {
    hasChanged = false;
    iterations++;

    // 2. Assign points to nearest centroid
    const newClusters = clusters.map((snack, index) => {
      const point = points[index];
      let minDist = Infinity;
      let closestClusterId = -1;

      centroids.forEach((centroid) => {
        const dist = calculateDistance(point, centroid, distanceType);
        if (dist < minDist) {
          minDist = dist;
          closestClusterId = centroid.clusterId;
        }
      });

      if (closestClusterId !== snack.clusterId) {
        hasChanged = true;
      }

      return { ...snack, clusterId: closestClusterId };
    });

    clusters = newClusters;

    // 3. Update Centroids
    if (hasChanged) {
        const newCentroids = centroids.map(c => {
            const clusterPoints = clusters
                .map((s, i) => ({ ...points[i], id: s.clusterId }))
                .filter(p => p.id === c.clusterId);
            
            if (clusterPoints.length === 0) return c; // Keep old position if empty

            const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
            const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
            
            return { ...c, x: avgX, y: avgY };
        });
        centroids = newCentroids;
    }
  }

  return {
    clusters,
    centroids,
    iterations
  };
};