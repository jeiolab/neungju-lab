import { SimulationState, SimulationResult } from '../types';

export const calculateScore = (
  state: SimulationState,
  scenario: string
): SimulationResult => {
  const { aiUsage, verificationTime, isSensitive } = state;

  // 1. Efficiency: High AI, Low Verification increases efficiency
  // Formula: Base efficiency from AI (up to 70) + Efficiency from speed (low verification) (up to 30)
  // If verification is 100, speed bonus is 0. If verification is 0, speed bonus is 30.
  let efficiency = (aiUsage * 0.7) + ((100 - verificationTime) * 0.3);

  // 2. Quality: AI helps, but needs verification.
  // If AI is high but verification is low -> Hallucinations -> Low Quality.
  // Ideal: High AI + High Verification.
  // Base quality is 50 (human only).
  // Quality gains from AI potential: up to 50.
  // Penalty factor: If verification is low relative to AI usage.
  
  const aiBenefit = aiUsage * 0.5;
  const humanCheck = verificationTime * 0.5;
  let quality = 40 + aiBenefit + humanCheck;
  
  // Penalty for high AI with low verification
  if (aiUsage > 50 && verificationTime < 30) {
    quality -= 30; // Significant penalty for hallucinations
  } else if (aiUsage > 70 && verificationTime < 50) {
    quality -= 15;
  }
  
  // Cap quality
  quality = Math.min(100, Math.max(0, quality));


  // 3. Ethics: 
  // Base 100.
  // If sensitive data is ON: Immediate -40 penalty.
  // Verification restores ethics (checks for bias/privacy).
  let ethics = 100;
  if (isSensitive) {
    ethics -= 50;
    // Verification helps mitigate sensitivity risks
    ethics += (verificationTime * 0.4); 
  } else {
    // Even without sensitive data, low verification risks bias/plagiarism
    if (verificationTime < 20) ethics -= 20;
    else if (verificationTime < 50) ethics -= 10;
  }
  
  // Over-reliance penalty on ethics
  if (aiUsage > 90 && verificationTime < 20) {
    ethics -= 15;
  }

  ethics = Math.min(100, Math.max(0, ethics));


  // Total Score
  const total = Math.round((efficiency + quality + ethics) / 3);

  // Generate Feedback
  const feedEfficiency = 
    efficiency > 80 ? "⚡ AI를 적극 활용하여 작업 속도가 매우 빠릅니다." :
    efficiency > 50 ? "⚖️ 적절한 속도로 과제를 진행하고 있습니다." :
    "🐢 AI 활용이 적거나 검증 시간이 길어 효율이 낮습니다.";

  const feedQuality = 
    quality > 80 ? "💎 꼼꼼한 검증 덕분에 결과물의 신뢰도가 매우 높습니다!" :
    quality > 50 ? "📝 품질은 무난하지만, 할루시네이션 가능성을 주의하세요." :
    "⚠️ 검증 부족으로 잘못된 정보가 포함될 위험이 매우 큽니다.";

  let feedEthics = "";
  if (isSensitive && verificationTime < 60) {
    feedEthics = "🚨 [경고] 민감 데이터가 포함되었는데 검증이 부족합니다. 개인정보 유출 위험!";
  } else if (aiUsage > 90 && verificationTime < 30) {
    feedEthics = "🤖 [주의] AI 과의존 상태입니다. 본인의 비판적 사고가 결여될 수 있습니다.";
  } else if (ethics > 85) {
    feedEthics = "🛡️ 윤리적 가이드라인을 잘 준수하고 있습니다. 훌륭해요!";
  } else {
    feedEthics = "⚖️ 윤리 점수가 평이합니다. 출처 표기와 편향성을 더 체크해보세요.";
  }

  return {
    id: Date.now().toString(),
    timestamp: Date.now(),
    input: state,
    scores: {
      efficiency: Math.round(efficiency),
      quality: Math.round(quality),
      ethics: Math.round(ethics),
      total
    },
    feedback: {
      efficiency: feedEfficiency,
      quality: feedQuality,
      ethics: feedEthics
    },
    scenario
  };
};