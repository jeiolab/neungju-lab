import { GraphData, Edge } from '../types';

// Helper to get adjacency list
const getAdjacencyList = (graph: GraphData) => {
  const adj = new Map<string, string[]>();
  graph.nodes.forEach(node => adj.set(node.id, []));
  graph.edges.forEach(edge => {
    adj.get(edge.source)?.push(edge.target);
    adj.get(edge.target)?.push(edge.source); // Undirected graph
  });
  // Sort neighbors for deterministic behavior (alphabetical)
  adj.forEach(neighbors => neighbors.sort());
  return adj;
};

export const runBFS = (graph: GraphData, startId: string): string[] => {
  const adj = getAdjacencyList(graph);
  const visited = new Set<string>();
  const queue = [startId];
  const history: string[] = [];

  visited.add(startId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    history.push(current);

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return history;
};

export const runDFS = (graph: GraphData, startId: string): string[] => {
  const adj = getAdjacencyList(graph);
  const visited = new Set<string>();
  const history: string[] = [];

  const dfs = (node: string) => {
    visited.add(node);
    history.push(node);

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  };

  dfs(startId);
  return history;
};

export const findShortestPath = (graph: GraphData, startId: string, endId: string): string[] => {
  const adj = getAdjacencyList(graph);
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;

    if (id === endId) {
      return path;
    }

    const neighbors = adj.get(id) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ id: neighbor, path: [...path, neighbor] });
      }
    }
  }
  return [];
};