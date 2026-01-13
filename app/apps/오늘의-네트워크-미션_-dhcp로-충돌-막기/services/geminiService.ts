import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
}

export const analyzeReflection = async (mission: string, reflection: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (.env 설정을 확인하세요)";

  try {
    const prompt = `
      미션: ${mission}
      학생의 회고: "${reflection}"
      
      당신은 친절한 네트워크 선생님입니다. 학생의 회고가 미션의 핵심(DHCP, IP 충돌, 효율성 등)을 잘 파악했는지 분석해주세요.
      잘한 점을 칭찬하고, 부족한 개념이 있다면 한 문장으로 부드럽게 조언해주세요. 
      전체 길이는 3문장 이내로 작성해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateDailyScenario = async (seed: string): Promise<string> => {
    // Optional: Use AI to generate a unique scenario based on the seed
    // For reliability in this demo, we might fallback to constants, but here is the implementation.
    const ai = getClient();
    if (!ai) return "";

    try {
        const prompt = `
            날짜 시드: ${seed}
            고등학교 1학년 수준의 네트워크 학습 앱입니다.
            오늘의 주제: DHCP와 IP 충돌.
            
            짧고 흥미로운 "오늘의 미션 시나리오"를 1개 생성해주세요.
            예시: "전학생이 왔는데 와이파이 비밀번호만 치고 바로 인터넷을 쓴다. 어떻게 가능한 걸까?"
            길이: 50자 이내. 한국어.
        `;
         const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        return "";
    }
}
