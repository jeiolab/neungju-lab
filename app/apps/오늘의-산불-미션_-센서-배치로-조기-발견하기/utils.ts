import { CellType, GridCell, SensitivityLevel, SimulationResult } from './types';

// Seeded Random Number Generator
class SeededRNG {
  private seed: number;

  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      const char = seedStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    this.seed = Math.abs(hash);
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

export const generateDailyGrid = (seedStr: string, size: number = 10): GridCell[] => {
  const rng = new SeededRNG(seedStr);
  const grid: GridCell[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const rand = rng.next();
      let type: CellType = 'FOREST';
      
      // Terrain generation logic
      if (rand < 0.15) type = 'ROCK';
      else if (rand < 0.25) type = 'WATER';
      else if (rand > 0.95) type = 'VILLAGE'; // Rare village

      grid.push({
        x,
        y,
        type,
        hasSensor: false,
        temp: 20, // Base temp
        isOnFire: false
      });
    }
  }
  return grid;
};

export const runSimulationLogic = (
  seedStr: string,
  gridState: GridCell[],
  sensitivity: SensitivityLevel
): SimulationResult => {
  const rng = new SeededRNG(seedStr + "_fire"); // Separate seed sequence for fire logic
  const size = 10;
  
  // 1. Determine Fire Start Location (Must be Forest)
  const forestCells = gridState.filter(c => c.type === 'FOREST');
  const fireStartIndex = Math.floor(rng.next() * forestCells.length);
  const fireStartCell = forestCells[fireStartIndex];

  if (!fireStartCell) {
    // Fallback if map has no forest (unlikely)
    return { detectedAt: null, costUsed: 0, falseAlarms: 0, burnedArea: 0, success: false, score: 0 };
  }

  // 2. Simulation Parameters
  const MAX_STEPS = 20;
  let currentFireCells = [fireStartCell];
  let detectedAt: number | null = null;
  let burnedCount = 0;
  let falseAlarms = 0;
  
  // Sensitivity Settings
  // Low: Slow detection, Low false alarm
  // High: Fast detection, High false alarm
  let detectionThreshold = 0;
  let noiseLevel = 0;

  switch (sensitivity) {
    case 'LOW': detectionThreshold = 80; noiseLevel = 0.05; break;
    case 'MEDIUM': detectionThreshold = 60; noiseLevel = 0.15; break;
    case 'HIGH': detectionThreshold = 40; noiseLevel = 0.3; break;
  }

  const sensors = gridState.filter(c => c.hasSensor);
  const costUsed = sensors.length; // 1 point per sensor

  // 3. Time Step Loop
  for (let t = 1; t <= MAX_STEPS; t++) {
    // Expand Fire
    const newFireCells: GridCell[] = [];
    currentFireCells.forEach(cell => {
      // Neighbors
      const neighbors = [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x, y: cell.y - 1 },
      ];

      neighbors.forEach(n => {
        const target = gridState.find(g => g.x === n.x && g.y === n.y);
        if (target && target.type === 'FOREST' && !currentFireCells.includes(target) && !newFireCells.includes(target)) {
          // Spread chance
          if (rng.next() > 0.3) { // 70% spread chance
             newFireCells.push(target);
          }
        }
      });
    });

    currentFireCells = [...currentFireCells, ...newFireCells];
    burnedCount = currentFireCells.length;

    // Check Detection
    let alarmTriggered = false;

    // Simulate sensor readings
    for (const sensor of sensors) {
      // Distance to nearest fire
      let minDist = Infinity;
      for (const fireCell of currentFireCells) {
        const dist = Math.sqrt(Math.pow(sensor.x - fireCell.x, 2) + Math.pow(sensor.y - fireCell.y, 2));
        if (dist < minDist) minDist = dist;
      }

      // Temp rises as fire gets closer
      // Temp formula: Base(20) + (MaxTemp / (Dist + 1))
      // If fire is on the sensor (dist 0), temp is high.
      const simulatedTemp = 20 + (100 / (minDist * 0.5 + 1));
      
      // Noise injection (Random spikes)
      const noise = rng.next() < noiseLevel ? 30 : 0; 
      
      if (simulatedTemp + noise > detectionThreshold) {
        alarmTriggered = true;
        // Is it a true positive?
        // If simulatedTemp (without noise) was enough, or fire is very close (< 2.5 units)
        if (minDist < 2.5) {
             if (!detectedAt) detectedAt = t;
        } else {
             // Triggered by noise or distant heat, but considered "False Alarm" if fire is actually far
             falseAlarms++;
        }
      }
    }

    if (detectedAt) break; // Stop simulation once detected
  }

  const success = detectedAt !== null;
  
  // Score Calculation
  // Max 100.
  // Fast detection: Max 40 (40 - t*2)
  // Low Cost: Max 30 (30 - cost*2)
  // Low False Alarm: Max 30 (30 - false*5)
  
  let score = 0;
  if (success && detectedAt) {
    score += Math.max(0, 50 - (detectedAt * 2));
    score += Math.max(0, 30 - (costUsed * 2));
    score += Math.max(0, 20 - (falseAlarms * 2));
  } else {
    // Failed to detect
    score = 0;
  }

  return {
    detectedAt,
    costUsed,
    falseAlarms,
    burnedArea: burnedCount,
    success,
    score
  };
};

export const getTodaySeed = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};
