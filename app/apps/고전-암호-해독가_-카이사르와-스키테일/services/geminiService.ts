import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getAIClient = () => {
  if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
};

export const getDetectiveAnalysis = async (text: string, cipherType: 'caesar' | 'scytale') => {
  try {
    const ai = getAIClient();
    const prompt = `
      당신은 고대 그리스/로마 시대의 '역사 탐정'입니다.
      사용자가 다음 텍스트에 대해 ${cipherType === 'caesar' ? '카이사르(치환) 암호' : '스키테일(전치) 암호'} 분석을 요청했습니다.
      
      텍스트: "${text}"
      
      다음 내용을 포함하여 짧고 흥미롭게 설명해주세요:
      1. 이 암호 방식의 역사적 배경 (간략히).
      2. 이 텍스트를 해독(또는 암호화)할 때의 핵심 취약점 (예: 빈도 분석, 막대 굵기 추측).
      3. 탐정으로서의 조언 한마디.
      
      말투는 지적이고 고풍스럽게 하되, 한국어로 자연스럽게 작성해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Optimization for speed
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "통신에 문제가 발생하여 탐정의 기록을 불러올 수 없습니다. 잠시 후 다시 시도해주십시오.";
  }
};

export const getFrequencyHint = async (text: string) => {
    try {
        const ai = getAIClient();
        const prompt = `
          다음 텍스트에 대해 '빈도수 분석(Frequency Analysis)' 관점에서 짧은 힌트를 주세요.
          어떤 글자가 가장 많이 반복되는지, 그것이 한국어/영어에서 보통 무엇을 의미하는지 설명해주세요.
          
          텍스트: "${text}"
        `;
    
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt
        });
    
        return response.text;
      } catch (error) {
        return "빈도 분석 데이터를 가져올 수 없습니다.";
      }
}
