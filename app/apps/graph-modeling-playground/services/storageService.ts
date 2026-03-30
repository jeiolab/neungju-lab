import { GraphData, SimulationSettings, UserStats } from "../types";

const KEYS = {
  GRAPH: 'gmp_graph',
  SETTINGS: 'gmp_settings',
  STATS: 'gmp_stats',
};

const INITIAL_GRAPH: GraphData = {
  nodes: [
    { id: '1', label: '나' },
    { id: '2', label: '지호' },
    { id: '3', label: '수진' },
  ],
  edges: [
    { source: '1', target: '2', type: 'BEST_FRIEND', weight: 0.8 },
    { source: '1', target: '3', type: 'CLASSMATE', weight: 0.4 },
  ]
};

const INITIAL_STATS: UserStats = {
  streak: 1,
  lastLogin: new Date().toISOString(),
  badges: [],
  totalSimulations: 0,
  masteryScore: 0,
  wrongNotes: []
};

export const loadGraph = (): GraphData => {
  const data = localStorage.getItem(KEYS.GRAPH);
  return data ? JSON.parse(data) : INITIAL_GRAPH;
};

export const saveGraph = (graph: GraphData) => {
  localStorage.setItem(KEYS.GRAPH, JSON.stringify(graph));
};

export const loadStats = (): UserStats => {
  const data = localStorage.getItem(KEYS.STATS);
  if (!data) return INITIAL_STATS;
  
  const stats = JSON.parse(data);
  // Check streak logic (simplified)
  const lastDate = new Date(stats.lastLogin).toDateString();
  const today = new Date().toDateString();
  if (lastDate !== today) {
    // If consecutive day, increment. Else reset if gap > 1 day.
    const diffTime = Math.abs(new Date().getTime() - new Date(stats.lastLogin).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays === 1) stats.streak += 1;
    else if (diffDays > 1) stats.streak = 1;
    
    stats.lastLogin = new Date().toISOString();
    saveStats(stats);
  }
  return stats;
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};