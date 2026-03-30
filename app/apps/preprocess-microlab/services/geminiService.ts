import { GoogleGenAI } from "@/lib/genai-browser-shim";

// Initialize Gemini Client only if API key is available
const apiKey = process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeStudentReflection = async (
  experimentContext: string,
  studentAnswer: string
): Promise<{ score: number; feedback: string }> => {
  
  // If API key is not available, return a fallback response
  if (!ai) {
    return {
      score: 50,
      feedback: "AI 분석 기능을 사용하려면 API 키가 필요합니다. 하지만 스스로 생각해보는 과정이 훌륭해요!"
    };
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      상황: 고등학교 1학년 학생이 데이터 전처리 실험(결측치/이상치 처리)을 진행했습니다.
      
      실험 설정 및 결과: ${experimentContext}
      
      학생의 분석(생각): "${studentAnswer}"
      
      역할: 친절하고 격려하는 선생님.
      지시:
      1. 학생의 답변이 실험 결과와 논리적으로 맞는지 확인하세요.
      2. 0~100점 사이의 점수를 주세요 (논리적이면 높게).
      3. 2문장 이내로 칭찬과 보완할 점을 한국어로 피드백해주세요.
      
      출력 형식(JSON):
      {
        "score": number,
        "feedback": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      score: 50,
      feedback: "AI 분석에 실패했습니다. 하지만 스스로 생각해보는 과정이 훌륭해요!"
    };
  }
};
