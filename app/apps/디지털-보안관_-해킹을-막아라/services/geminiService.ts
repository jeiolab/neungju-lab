import { Scenario, NewsReport } from "../types";

// Fallback scenarios in case API fails or limit reached
const FALLBACK_SCENARIOS: Scenario[] = [
  {
    id: 'f1',
    title: '공용 Wi-Fi 접속',
    description: '카페의 "Free_Coffee" 와이파이가 비밀번호 없이 열려있습니다. 접속해서 은행 앱을 실행할까요?',
    isSafe: false,
    reasoning: '공용 와이파이는 해커가 데이터를 가로챌 수 있는 중간자 공격(MITM)에 취약합니다.',
    consequence: '계좌 비밀번호가 유출되어 예금이 인출되었습니다!'
  },
  {
    id: 'f2',
    title: 'OS 업데이트 알림',
    description: '스마트폰 운영체제 보안 업데이트 알림이 떴습니다. 지금 설치할까요?',
    isSafe: true,
    reasoning: '보안 업데이트는 알려진 취약점을 수정하므로 즉시 설치하는 것이 가장 안전합니다.',
    consequence: '업데이트를 미루는 사이 제로데이 취약점을 통한 공격을 받았습니다.'
  },
  {
    id: 'f3',
    title: '알 수 없는 첨부파일',
    description: '모르는 사람이 보낸 "택배 배송 조회.zip" 메일이 도착했습니다. 열어볼까요?',
    isSafe: false,
    reasoning: '출처가 불분명한 압축 파일은 랜섬웨어나 악성코드일 확률이 매우 높습니다.',
    consequence: '랜섬웨어에 감염되어 컴퓨터의 모든 파일이 암호화되었습니다.'
  },
];

export const generateScenarios = async (): Promise<Scenario[]> => {
  try {
    const response = await fetch('/api/gemini/digital-sheriff/scenarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'scenarios' }),
    });

    if (!response.ok) {
      return FALLBACK_SCENARIOS;
    }

    const data = await response.json();
    return data.scenarios || FALLBACK_SCENARIOS;
  } catch (error) {
    console.error("Gemini API Error (Scenarios):", error);
    return FALLBACK_SCENARIOS;
  }
};

export const generateFailureNews = async (scenario: Scenario): Promise<NewsReport> => {
  try {
    const response = await fetch('/api/gemini/digital-sheriff/scenarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'news', scenario }),
    });

    if (!response.ok) {
      return {
        headline: "보안 사고 발생!",
        content: `사용자의 부주의한 행동으로 인해 심각한 개인정보 유출 피해가 발생했습니다. (${scenario.title})`,
        severity: "high"
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gemini API Error (News):", error);
    return {
      headline: "보안 사고 발생!",
      content: `사용자의 부주의한 행동으로 인해 심각한 개인정보 유출 피해가 발생했습니다. (${scenario.title})`,
      severity: "high"
    };
  }
};
