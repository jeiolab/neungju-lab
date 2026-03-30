import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const gradeReflection = async (questionType: string, userAnswer: string) => {
  if (!apiKey) {
    return "API Key가 설정되지 않았습니다. 메타데이터 설정을 확인해주세요.";
  }

  try {
    const prompt = `
      당신은 친절하고 전문적인 마이크로비트 IoT 교육 코치입니다.
      학생이 "${questionType}" 유형의 서술형 문제에 대해 다음과 같이 답했습니다.
      
      학생 답변: "${userAnswer}"
      
      이 답변이 논리적으로 타당한지, 개념(라디오 그룹, 임계값, 송수신)을 잘 이해했는지 평가해주세요.
      3줄 이내로 피드백을 작성해 주세요. 칭찬과 함께 부족한 점이 있다면 부드럽게 지적해주세요.
      말투는 초/중학생에게 하듯 친근하게 해주세요.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return result.text ?? null;
  } catch (error) {
    console.error("Gemini Grading Error:", error);
    return "채점 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};