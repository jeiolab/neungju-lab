import { GraphData, Node, Link } from '../types';
import { Seeder } from '../constants';

// Force-directed layout simulation (simple implementation)
const simulateLayout = (nodes: Node[], links: Link[], seeder: Seeder, width: number, height: number) => {
  // Initialize random positions
  nodes.forEach(node => {
    node.x = seeder.random() * width;
    node.y = seeder.random() * height;
  });

  const iterations = 100;
  const k = Math.sqrt((width * height) / nodes.length); // Optimal distance
  const repulsiveForce = 2500;
  const springLength = k * 1.5;

  for (let i = 0; i < iterations; i++) {
    // Repulsion
    for (let u = 0; u < nodes.length; u++) {
      for (let v = 0; v < nodes.length; v++) {
        if (u === v) continue;
        const dx = nodes[u].x - nodes[v].x;
        const dy = nodes[u].y - nodes[v].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsiveForce / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[u].x += fx;
        nodes[u].y += fy;
      }
    }

    // Attraction
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source)!;
      const target = nodes.find(n => n.id === link.target)!;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - springLength) / dist; // spring constant like
      const fx = dx * force * 0.1;
      const fy = dy * force * 0.1;

      source.x += fx;
      source.y += fy;
      target.x -= fx;
      target.y -= fy;
    });

    // Center gravity & Bounds
    nodes.forEach(node => {
        const cx = width / 2;
        const cy = height / 2;
        node.x += (cx - node.x) * 0.05;
        node.y += (cy - node.y) * 0.05;
        
        node.x = Math.max(20, Math.min(width - 20, node.x));
        node.y = Math.max(20, Math.min(height - 20, node.y));
    });
  }
};

export const generateDailyGraph = (dateString: string): GraphData => {
  const seeder = new Seeder(dateString);
  const numNodes = seeder.range(8, 12);
  const nodes: Node[] = [];

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      id: `n${i}`,
      label: String.fromCharCode(65 + i), // A, B, C...
      x: 0,
      y: 0,
    });
  }

  const links: Link[] = [];
  // Ensure connectivity (Spanning Tree)
  const connected = [0];
  const unconnect = Array.from({ length: numNodes - 1 }, (_, i) => i + 1);

  while (unconnect.length > 0) {
    const sourceIdx = connected[seeder.range(0, connected.length - 1)];
    const targetIdxInUnconnected = seeder.range(0, unconnect.length - 1);
    const targetIdx = unconnect[targetIdxInUnconnected];

    links.push({
      source: nodes[sourceIdx].id,
      target: nodes[targetIdx].id,
    });

    connected.push(targetIdx);
    unconnect.splice(targetIdxInUnconnected, 1);
  }

  // Add random extra edges for complexity
  const extraEdges = seeder.range(3, 6);
  for (let i = 0; i < extraEdges; i++) {
    const u = seeder.range(0, numNodes - 1);
    const v = seeder.range(0, numNodes - 1);
    if (u !== v) {
      const exists = links.some(
        l => (l.source === nodes[u].id && l.target === nodes[v].id) ||
             (l.source === nodes[v].id && l.target === nodes[u].id)
      );
      if (!exists) {
        links.push({ source: nodes[u].id, target: nodes[v].id });
      }
    }
  }

  // Calculate layout
  simulateLayout(nodes, links, seeder, 600, 400);

  // Pick Start and Target
  const startIdx = seeder.range(0, numNodes - 1);
  let targetIdx = startIdx;
  while (targetIdx === startIdx) {
    targetIdx = seeder.range(0, numNodes - 1);
  }

  return {
    nodes,
    links,
    startNodeId: nodes[startIdx].id,
    targetNodeId: nodes[targetIdx].id,
  };
};
