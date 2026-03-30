import { GoogleGenAI } from "@/lib/genai-browser-shim";

// Initialize Gemini Client
// Note: In a production environment, you should never expose API keys on the client side.
// This is for demonstration/educational prototype purposes.
const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getTeacherFeedback = async (studentThought: string): Promise<string> => {
  if (!ai) {
    // Fallback if no API key is provided
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("훌륭한 생각입니다! (API 키가 설정되지 않아 모의 응답을 보냅니다.) 자동화 시대에도 인간의 창의성과 감성, 그리고 도덕적 판단력은 여전히 중요한 역할을 할 것입니다. 기술을 도구로 활용하는 지혜를 기르는 것이 중요해요.");
        }, 1000);
    });
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 고등학교 기술가정 선생님입니다. 
      학생이 "스마트 팩토리나 AI 자동화로 인해 일자리가 사라진다면 우리는 어떻게 대비해야 할까?"라는 질문에 대해 다음과 같은 의견을 냈습니다:
      "${studentThought}"
      
      이 학생의 의견에 대해 칭찬하고, 추가적으로 생각해볼 만한 긍정적인 방향이나 조언을 3문장 이내로 따뜻하게 답변해주세요.
      답변은 한국어로 해주세요.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "선생님 AI와 연결하는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};