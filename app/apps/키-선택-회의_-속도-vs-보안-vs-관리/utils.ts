import { CryptoMethod, Scenario, SimulationResult } from './types';

// Deterministic Feedback Generator based on Prompt Rules
export const evaluateDecision = (
  scenario: Scenario,
  method: CryptoMethod,
  sliders: { speed: number; security: number; management: number }
): SimulationResult => {
  let baseScore = 0;
  let pro = "";
  let con = "";
  let reality = "";

  // 1. Method Characteristics (Fixed Knowledge)
  const methodStats: Record<CryptoMethod, { speed: number; security: number; mgmt: number }> = {
    [CryptoMethod.SYMMETRIC]: { speed: 10, security: 6, mgmt: 2 },
    [CryptoMethod.ASYMMETRIC]: { speed: 2, security: 9, mgmt: 9 },
    [CryptoMethod.HASH]: { speed: 10, security: 5, mgmt: 10 }, // Security here means Integrity
    [CryptoMethod.HYBRID]: { speed: 8, security: 8, mgmt: 7 },
    [CryptoMethod.HOMOMORPHIC]: { speed: 1, security: 10, mgmt: 5 },
  };

  const stats = methodStats[method];

  // 2. Scenario Fit Calculation
  const isRecommended = scenario.recommendedMethods.includes(method);
  
  // Special Fail Cases
  if (scenario.requiredAttributes.security > 7 && method === CryptoMethod.HASH && scenario.id !== 's2') {
     // Trying to use Hash for confidentiality
     baseScore = 10;
     pro = "해시는 빠릅니다.";
     con = "하지만 해시는 복호화가 안 돼서 내용을 다시 볼 수 없습니다! 데이터가 유실됩니다.";
     reality = "해시는 비밀번호 저장이나 파일 변조 확인에만 쓰입니다.";
  } else if (scenario.requiredAttributes.speed > 8 && method === CryptoMethod.ASYMMETRIC) {
     // Using Asymmetric for large files
     baseScore = 40;
     pro = "키 관리는 편하겠네요.";
     con = "하지만 너무 느려서 전송이 끝나지 않을 겁니다. (대칭키보다 1000배 이상 느림)";
     reality = "현실에선 대용량 파일은 대칭키로, 그 키만 비대칭키로 잠급니다(하이브리드).";
  } else if (isRecommended) {
     baseScore = 90;
     // Add bonus based on user slider understanding
     // If user prioritized what matters for the scenario, give bonus
     const sliderError = 
       Math.abs(sliders.speed - scenario.requiredAttributes.speed) +
       Math.abs(sliders.security - scenario.requiredAttributes.security);
     
     if (sliderError < 5) baseScore += 10;

     // Success Feedback Generation
     switch (method) {
       case CryptoMethod.SYMMETRIC:
         pro = "속도가 빨라 대용량 처리에 적합합니다.";
         con = "키를 안전하게 전달할 방법을 별도로 고민해야 합니다.";
         reality = "파일 암호화(AES) 등 속도가 중요한 곳에 필수입니다.";
         break;
       case CryptoMethod.ASYMMETRIC:
         pro = "공개키/개인키가 분리되어 키 관리가 안전합니다.";
         con = "연산 속도가 느려 대용량 데이터엔 부적합합니다.";
         reality = "전자서명, 블록체인 지갑 주소 등에 사용됩니다.";
         break;
       case CryptoMethod.HASH:
         pro = "데이터가 1비트만 변해도 결과가 달라져 무결성 확인에 완벽합니다.";
         con = "복호화가 불가능해 원본 내용을 숨기는 용도로는 제한적입니다.";
         reality = "비밀번호 저장(Salt), 블록체인 연결, 파일 체크섬에 쓰입니다.";
         break;
       case CryptoMethod.HYBRID:
         pro = "대칭키의 속도와 비대칭키의 보안성을 모두 챙겼습니다.";
         con = "시스템 구현이 복잡하고 비용이 듭니다.";
         reality = "HTTPS(SSL/TLS) 통신이 대표적인 혼합 방식입니다.";
         break;
       case CryptoMethod.HOMOMORPHIC:
         pro = "암호화된 상태로 통계를 낼 수 있어 프라이버시가 완벽 보호됩니다.";
         con = "현재 기술로는 속도가 매우 느리고 데이터가 커집니다.";
         reality = "민감한 의료 데이터 분석이나 선거 시스템에 연구되고 있습니다.";
         break;
     }
  } else {
     // Generic Suboptimal
     baseScore = 60;
     pro = "작동은 할 수 있습니다.";
     con = "하지만 이 시나리오에 더 효율적인(빠르거나 안전한) 방법이 있습니다.";
     reality = "보통은 트레이드오프를 고려해 다른 방식을 선택합니다.";
  }

  return {
    score: Math.min(100, Math.max(0, baseScore)),
    feedback: { pro, con, reality },
    userAttributes: sliders,
    method,
    scenarioId: scenario.id,
    timestamp: Date.now()
  };
};

export const getBadge = (history: SimulationResult[]): string | null => {
    const successCount = history.filter(h => h.score >= 90).length;
    if (successCount === 1) return "초보 보안관";
    if (successCount === 5) return "합리적 트레이드오프";
    if (successCount >= 10) return "인증 마스터";
    return null;
};

export const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;