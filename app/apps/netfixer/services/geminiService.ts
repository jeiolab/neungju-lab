import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is effectively present (though we assume it is per instructions)
const isConfigured = !!apiKey;

export const generateCustomerReaction = async (
  scenarioContext: string,
  userAction: string,
  isSuccess: boolean,
  effectiveness: string
): Promise<string> => {
  if (!isConfigured) return "API Key missing. Simulation proceeding with default text.";

  try {
    const prompt = `
      You are roleplaying as a customer calling a Network Technician (AS Driver).
      
      Context: ${scenarioContext}
      Technician's Action: ${userAction}
      Outcome: ${isSuccess ? 'The problem was solved.' : 'The problem persists or got worse.'}
      Effectiveness: ${effectiveness}

      Write a short, 1-2 sentence reaction dialog from the customer's perspective IN KOREAN.
      If it worked, be grateful.
      If it failed, be frustrated.
      Do not include quotes or prefixes like "Customer:". Just the spoken text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return isSuccess 
      ? "와! 이제 정말 잘 되네요. 감사합니다 기사님!" 
      : "아직도 안 되는데요... 제대로 고치신 거 맞나요?";
  }
};

export const evaluateDiscussionAnswer = async (question: string, userAnswer: string): Promise<string> => {
  if (!isConfigured) return "API Key missing. Cannot evaluate.";

  try {
    const prompt = `
      You are a senior Network Engineer mentor explaining concepts to a junior in KOREAN.
      
      Topic Question: "${question}"
      Student's Answer: "${userAnswer}"

      Evaluate the student's answer in under 100 words in Korean.
      Is it safe? Is it technically accurate? 
      Provide a constructive tip in a friendly tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 서버에 연결할 수 없습니다. 하지만 일반적으로 공공 장소에서는 VPN을 사용하고 HTTPS 사이트만 이용하는 것이 좋습니다.";
  }
};