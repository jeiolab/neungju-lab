import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { Scenario, MethodType } from "../types";

const VALID_METHODS: MethodType[] = ['Wi-Fi', 'Bluetooth', 'NFC', 'Cloud', 'Mobile', 'Wired'];

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : ""); // Assumption: managed by environment
const ai = new GoogleGenAI({ apiKey });

// Helper to validate the key exists before calling
const checkApiKey = () => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Using fallback/mock data logic would go here in production.");
    // In this demo, we might fail or return a static fallback if the key is missing, 
    // but the prompt implies we should implement the API logic.
    return false;
  }
  return true;
};

export const generateScenario = async (
  difficulty: 'easy' | 'hard' = 'easy',
  uniquenessSeed?: string
): Promise<Scenario | null> => {
  if (!checkApiKey()) return null;

  const seed = uniquenessSeed || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `한국 중·고등학생이 겪을 법한 "데이터 전송 방식 선택" 상황을 하나만 만들어 주세요.

난이도: ${difficulty}
시드(이전과 다른 문제를 위해 참고): ${seed}

규칙:
- description, reasoning은 반드시 자연스러운 한국어로만 작성하세요.
- correctMethod는 다음 중 정확히 하나만: Wi-Fi, Bluetooth, NFC, Cloud, Mobile, Wired (철자 동일).
- 카페·3GB·C-to-C 케이블 같은 전형적인 예시를 반복하지 말고, 매번 다른 맥락(교실, 야외, 해외, 결제, 협업 등)을 사용하세요.

JSON만 반환하세요.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "The scenario description (Korean)" },
            correctMethod: { type: Type.STRING, description: "One of: Wi-Fi, Bluetooth, NFC, Cloud, Mobile, Wired" },
            reasoning: { type: Type.STRING, description: "Why this is the best method (Korean)" },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Relevant tags e.g. distance, security, speed" 
            }
          },
          required: ["description", "correctMethod", "reasoning", "tags"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as {
        description?: string;
        correctMethod?: string;
        reasoning?: string;
        tags?: string[];
      };
      const method = data.correctMethod as MethodType;
      if (
        !data.description ||
        !data.reasoning ||
        !VALID_METHODS.includes(method)
      ) {
        return null;
      }
      return {
        id: crypto.randomUUID(),
        description: data.description,
        correctMethod: method,
        reasoning: data.reasoning,
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getSimulationFeedback = async (
  distance: string, 
  size: string, 
  internet: string, 
  security: string
): Promise<string> => {
  if (!checkApiKey()) return "API 키가 없어 AI 피드백을 불러올 수 없습니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User inputs: Distance=${distance}, FileSize=${size}, Internet=${internet}, Security=${security}.
      Recommend the best data transmission method and explain why in 2-3 sentences in Korean.`
    });
    return response.text || "피드백 생성 실패";
  } catch (e) {
    return "연결 오류";
  }
};
