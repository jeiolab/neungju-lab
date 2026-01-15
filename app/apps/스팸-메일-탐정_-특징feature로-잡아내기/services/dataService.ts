import { EmailData, SimulationConfig } from '../types';

// Deterministic Pseudo-random number generator for consistent results across same inputs
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateMockData = (count: number): EmailData[] => {
  const data: EmailData[] = [];
  
  for (let i = 0; i < count; i++) {
    // 40% chance of spam naturally
    const isSpam = seededRandom(i) < 0.4;
    
    // Feature correlation logic
    // Spam tends to have keywords, many links, many exclamation marks
    // Ham tends to have few links, few exclamation, rarely keywords
    
    let hasKeyword = false;
    let linkCount = 0;
    let exclamationCount = 0;

    if (isSpam) {
      hasKeyword = seededRandom(i + 1000) < 0.8; // 80% chance if spam
      linkCount = Math.floor(seededRandom(i + 2000) * 5) + 1; // 1 to 5 links
      exclamationCount = Math.floor(seededRandom(i + 3000) * 10); // 0 to 9 exclamations
    } else {
      hasKeyword = seededRandom(i + 1000) < 0.1; // 10% chance if ham (e.g. "Free time?")
      linkCount = Math.floor(seededRandom(i + 2000) * 2); // 0 to 1 link
      exclamationCount = Math.floor(seededRandom(i + 3000) * 3); // 0 to 2 exclamations
    }

    data.push({
      id: i,
      isSpam,
      hasKeyword,
      linkCount,
      exclamationCount
    });
  }
  return data;
};

export const runSimulation = (data: EmailData[], config: SimulationConfig) => {
  let correctCount = 0;

  data.forEach(mail => {
    // Simple Linear Model: Score = w1*x1 + w2*x2 + w3*x3
    let score = 0;

    // Weights (Imagine these are learned parameters or heuristic rules)
    if (config.useKeyword && mail.hasKeyword) score += 5;
    if (config.useLinks) score += mail.linkCount * 2;
    if (config.useExclamation) score += mail.exclamationCount * 0.5;

    // Threshold (Bias)
    const threshold = 3; 
    const predictionIsSpam = score > threshold;

    if (predictionIsSpam === mail.isSpam) {
      correctCount++;
    }
  });

  const accuracy = Math.round((correctCount / data.length) * 100);
  
  return {
    accuracy,
    details: generateFeedback(accuracy, config, data.length)
  };
};

const generateFeedback = (accuracy: number, config: SimulationConfig, count: number): string[] => {
  const feedback = [];

  // Line 1: Analysis
  if (count < 50) {
    feedback.push("데이터 개수가 적어서 결과가 들쑥날쑥할 수 있어요.");
  } else if (!config.useKeyword && !config.useLinks) {
    feedback.push("특징이 부족해서 스팸을 구분하기 어려워요.");
  } else if (accuracy > 85) {
    feedback.push("훌륭해요! 데이터와 특징이 잘 조화되었습니다.");
  } else {
    feedback.push("어느 정도 분류가 되고 있지만, 개선의 여지가 있습니다.");
  }

  // Line 2: Hint
  if (!config.useKeyword) {
    feedback.push("힌트: 스팸 메일에는 '당첨', '무료' 같은 단어가 자주 등장하지 않을까요?");
  } else if (!config.useLinks && accuracy < 80) {
    feedback.push("힌트: 스팸 메일은 다른 사이트로 유도하려고 링크를 많이 씁니다.");
  } else if (accuracy < 70) {
    feedback.push("힌트: 특징을 더 여러 개 조합해보세요.");
  } else {
    feedback.push("잘했습니다! 다른 설정으로도 실험해보세요.");
  }

  // Line 3: Suggestion
  feedback.push(`현재 정확도: ${accuracy}%. 데이터 개수를 ${count === 200 ? '줄여서' : '늘려서'} 차이를 비교해보세요.`);

  return feedback;
};
