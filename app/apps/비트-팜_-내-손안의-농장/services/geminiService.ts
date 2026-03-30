import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const generateQuizQuestion = async () => {
  if (!apiKey) {
    // Fallback if no API key
    return {
      question: "스마트 팜에서 토양의 수분을 측정하는 센서는?",
      options: ["조도 센서", "토양 수분 센서", "온도 센서", "초음파 센서"],
      answer: "토양 수분 센서",
      explanation: "토양 수분 센서는 흙 속의 물의 양을 전기 저항을 이용해 측정합니다."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "스마트 팜, IoT 센서, 마이크로비트 통신, 농업 기술과 관련된 4지선다 퀴즈를 하나 만들어주세요. 초등학생~중학생 수준으로.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      question: "식물이 잘 자라기 위해 꼭 필요한 요소가 아닌 것은?",
      options: ["햇빛", "물", "적절한 온도", "소음"],
      answer: "소음",
      explanation: "식물은 광합성을 위한 빛, 물, 온도가 필요하지만 소음은 성장에 직접적인 영향을 주지 않습니다."
    };
  }
};

export const getReflectionFeedback = async (userIdea: string) => {
  if (!apiKey) {
    return "API 키가 없어서 AI의 피드백을 받을 수 없습니다. 하지만 흥미로운 아이디어네요!";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `사용자가 "넓은 농장에서의 통신 방식"에 대해 다음과 같은 아이디어를 냈습니다: "${userIdea}". 
      이 아이디어에 대해 장점과 보완할 점, 그리고 LoRa나 Wifi, 5G 같은 실제 기술과 연관지어 3문장 내외로 피드백을 주세요. 친절하고 교육적인 어조로.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 연결에 문제가 발생했습니다. 나중에 다시 시도해주세요.";
  }
};
