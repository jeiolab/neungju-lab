'use client'

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sample game scenarios for local simulation
const INITIAL_MESSAGE = `**네트워크 신뢰도 게이지: ○○○○○**

안녕하세요! 네트워크 수습반 본부입니다. 🕵️

학교 컴퓨터실 서버에서 심각한 문제가 발생했습니다. 학교 홈페이지가 열리지 않고, 네트워크 설정이 꼬여 있는 것 같습니다.

**현재 상황:**
- 서버 로그를 확인한 결과, IP 주소 설정에 문제가 있는 것으로 보입니다.
- 칠판에 낙서가 하나 남아있습니다: "192.168.10.x 대역 사용 중"
- 서버 관리자 노트: "호스트 주소는 10~50 사이"

**목표:**
올바른 IP 주소를 추리하여 입력하세요. (형식: 192.168.10.XX)`;

const SAMPLE_RESPONSES: Record<string, string> = {
  '192.168.10.25': `**네트워크 신뢰도 게이지: ●○○○○**

정답입니다! 🎉

**해설:**
IP 주소는 네트워크에서 각 기기를 식별하는 고유한 주소입니다. 
- 192.168.10.x는 네트워크 대역을 나타냅니다.
- 마지막 숫자(25)는 호스트 주소로, 10~50 사이의 값이었습니다.

이제 다음 단계로 넘어갑니다.

**스테이지 2: 게이트웨이 주소 추리**

서버 로그를 더 확인한 결과, 게이트웨이 설정도 필요합니다.
- 관리자 메모: "라우터는 보통 .1로 끝남"
- 네트워크 대역: 192.168.10.x

**목표:**
게이트웨이 주소를 입력하세요. (형식: 192.168.10.XX)`,
  
  '192.168.10.1': `**네트워크 신뢰도 게이지: ●●○○○**

정답입니다! 🎉

**해설:**
게이트웨이는 다른 네트워크로 나가는 출구 역할을 합니다.
- 보통 라우터나 공유기의 주소로 사용됩니다.
- 일반적으로 네트워크 대역의 첫 번째 주소(.1)를 사용합니다.

**스테이지 3: DNS 설정**

이제 마지막 단계입니다. DNS 서버 주소를 설정해야 합니다.
- DNS는 도메인 이름을 IP 주소로 변환해주는 서버입니다.
- 일반적으로 공인 DNS 서버 주소를 사용합니다.

**목표:**
DNS 서버 주소를 입력하세요. (예: 8.8.8.8 또는 1.1.1.1)`,
  
  '8.8.8.8': `**네트워크 신뢰도 게이지: ●●●●●**

완벽합니다! 🎉🎉🎉

**해설:**
DNS(Domain Name System)는 도메인 이름을 IP 주소로 변환해주는 시스템입니다.
- 8.8.8.8은 구글의 공인 DNS 서버 주소입니다.
- 1.1.1.1은 Cloudflare의 DNS 서버 주소입니다.

**오늘 배운 개념 요약:**
1. **IP 주소**: 네트워크에서 각 기기를 식별하는 고유한 주소
2. **게이트웨이**: 다른 네트워크로 나가는 출구 역할을 하는 라우터 주소
3. **DNS**: 도메인 이름을 IP 주소로 변환해주는 시스템

축하합니다! 모든 설정을 완료하여 학교 서버를 복구했습니다! 🏆`,
  
  '1.1.1.1': `**네트워크 신뢰도 게이지: ●●●●●**

완벽합니다! 🎉🎉🎉

**해설:**
DNS(Domain Name System)는 도메인 이름을 IP 주소로 변환해주는 시스템입니다.
- 1.1.1.1은 Cloudflare의 공인 DNS 서버 주소입니다.
- 8.8.8.8은 구글의 DNS 서버 주소입니다.

**오늘 배운 개념 요약:**
1. **IP 주소**: 네트워크에서 각 기기를 식별하는 고유한 주소
2. **게이트웨이**: 다른 네트워크로 나가는 출구 역할을 하는 라우터 주소
3. **DNS**: 도메인 이름을 IP 주소로 변환해주는 시스템

축하합니다! 모든 설정을 완료하여 학교 서버를 복구했습니다! 🏆`
};

// Simple answer matching logic
const checkAnswer = (userInput: string, stage: number): { correct: boolean; response: string } => {
  const normalized = userInput.trim().toLowerCase();
  
  if (stage === 1) {
    // Stage 1: IP address (192.168.10.10 ~ 192.168.10.50)
    const ipMatch = normalized.match(/192\.168\.10\.(\d+)/);
    if (ipMatch) {
      const host = parseInt(ipMatch[1]);
      if (host >= 10 && host <= 50) {
        return { correct: true, response: SAMPLE_RESPONSES['192.168.10.25'] };
      }
    }
    return { 
      correct: false, 
      response: `**네트워크 신뢰도 게이지: ○○○○○**

오답입니다. 다시 생각해보세요.

**힌트:**
- 네트워크 대역은 192.168.10.x입니다.
- 호스트 주소는 10~50 사이의 숫자입니다.
- 형식: 192.168.10.XX (XX는 10~50 사이)`
    };
  } else if (stage === 2) {
    // Stage 2: Gateway (usually .1)
    if (normalized.includes('192.168.10.1') || normalized.includes('192.168.1.1')) {
      return { correct: true, response: SAMPLE_RESPONSES['192.168.10.1'] };
    }
    return {
      correct: false,
      response: `**네트워크 신뢰도 게이지: ●○○○○**

오답입니다. 다시 생각해보세요.

**힌트:**
- 게이트웨이는 보통 라우터 주소입니다.
- 일반적으로 네트워크 대역의 첫 번째 주소를 사용합니다.
- 192.168.10.x 대역이라면...?`
    };
  } else if (stage === 3) {
    // Stage 3: DNS
    if (normalized.includes('8.8.8.8') || normalized.includes('1.1.1.1')) {
      const dns = normalized.includes('8.8.8.8') ? '8.8.8.8' : '1.1.1.1';
      return { correct: true, response: SAMPLE_RESPONSES[dns] };
    }
    return {
      correct: false,
      response: `**네트워크 신뢰도 게이지: ●●○○○**

오답입니다. 다시 생각해보세요.

**힌트:**
- DNS는 도메인 이름을 IP 주소로 변환해주는 서버입니다.
- 공인 DNS 서버 주소를 사용합니다.
- 구글 DNS: 8.8.8.8 또는 Cloudflare DNS: 1.1.1.1`
    };
  }
  
  return {
    correct: false,
    response: '잘못된 입력입니다. 다시 시도해주세요.'
  };
};

let currentStage = 1;

export const initializeGame = async (): Promise<string> => {
  await delay(1000);
  currentStage = 1;
  return INITIAL_MESSAGE;
};

export const sendUserMessage = async (message: string): Promise<string> => {
  await delay(800);
  
  const result = checkAnswer(message, currentStage);
  
  if (result.correct && currentStage < 3) {
    currentStage++;
  }
  
  return result.response;
};

