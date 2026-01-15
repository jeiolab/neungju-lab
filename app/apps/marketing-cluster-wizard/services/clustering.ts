import { DataPoint, Cluster } from '../types';

// Simple K-Means implementation
export const performClustering = (points: DataPoint[], k: number): Cluster[] => {
  if (k <= 0) return [];

  // 1. Initialize Centroids (pick k random points)
  let centroids = points
    .sort(() => 0.5 - Math.random())
    .slice(0, k)
    .map(p => ({ height: p.height, weight: p.weight }));

  // Color palette for clusters
  const colors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
  ];

  const names = ['S', 'M', 'L', 'XL', 'XS', 'XXL', '3XL', '4XL'];

  let assignments: number[] = new Array(points.length).fill(-1);
  let hasChanged = true;
  let iterations = 0;
  const maxIterations = 20; // Prevent infinite loops

  while (hasChanged && iterations < maxIterations) {
    hasChanged = false;
    iterations++;

    // 2. Assign points to nearest centroid
    points.forEach((point, index) => {
      let minDist = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, cIndex) => {
        const dist = Math.sqrt(
          Math.pow(point.height - centroid.height, 2) + 
          Math.pow(point.weight - centroid.weight, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = cIndex;
        }
      });

      if (assignments[index] !== clusterIndex) {
        assignments[index] = clusterIndex;
        hasChanged = true;
      }
    });

    // 3. Recalculate centroids
    centroids = centroids.map((_, cIndex) => {
      const clusterPoints = points.filter((_, i) => assignments[i] === cIndex);
      if (clusterPoints.length === 0) return centroids[cIndex]; // Keep old if empty

      const sumH = clusterPoints.reduce((acc, p) => acc + p.height, 0);
      const sumW = clusterPoints.reduce((acc, p) => acc + p.weight, 0);

      return {
        height: sumH / clusterPoints.length,
        weight: sumW / clusterPoints.length
      };
    });
  }

  // 4. Sort clusters by average weight/height magnitude to assign logical names (S, M, L)
  // We approximate "size" by height * weight
  const clusterIndices = centroids.map((c, i) => ({ 
    index: i, 
    magnitude: c.height * c.weight 
  })).sort((a, b) => a.magnitude - b.magnitude);

  // Map internal indices to sorted size names
  const result: Cluster[] = clusterIndices.map((c, i) => {
    const originalIndex = c.index;
    const clusterPoints = points
      .map((p, pIndex) => ({ ...p, clusterId: assignments[pIndex] === originalIndex ? i : -1 }))
      .filter(p => p.clusterId === i);

    return {
      id: i,
      name: names[i] || `G${i+1}`,
      color: colors[i % colors.length],
      centroid: centroids[originalIndex],
      points: clusterPoints,
    };
  });

  return result;
};

export const generateMockData = (count: number): DataPoint[] => {
  return Array.from({ length: count }).map((_, i) => {
    // Generate somewhat realistic height/weight correlation
    const height = 150 + Math.random() * 45; // 150cm - 195cm
    const baseWeight = (height - 100) * 0.9; 
    const weight = baseWeight + (Math.random() * 30 - 15); // Add variance
    
    return {
      id: i,
      height: Math.round(height * 10) / 10,
      weight: Math.round(weight * 10) / 10,
    };
  });
};
