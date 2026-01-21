import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const isAiAvailable = () => !!apiKey;

/**
 * Suggests sensors based on the problem description.
 */
export const getSensorSuggestions = async (problem: string): Promise<string[]> => {
  if (!apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `High school student IoT project helper.
      The student has defined this problem: "${problem}".
      Suggest 3 types of electronic sensors or input modules that would be most useful to solve this.
      Focus on standard Arduino/Micro:bit sensors (e.g., Ultrasonic, Temperature, PIR, Sound, Light, Soil Moisture, Camera).
      Return ONLY the names of the sensors in Korean.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};

/**
 * Generates the final project details (Title, Effect, Ethical Issue).
 */
export const generateProjectDetails = async (
  problem: string, 
  sensors: string[], 
  actions: string[]
): Promise<{ title: string; effect: string; ethical: string }> => {
  if (!apiKey) {
    return {
      title: "나만의 IoT 프로젝트",
      effect: "문제를 해결하여 생활이 더 편리해질 것입니다.",
      ethical: "기기가 오작동할 경우의 안전 문제를 고려해야 합니다."
    };
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy, creative title for the project in Korean." },
      effect: { type: Type.STRING, description: "1-2 sentences explaining the positive impact in Korean." },
      ethical: { type: Type.STRING, description: "A thought-provoking question about security or ethics related to this device in Korean." }
    },
    required: ["title", "effect", "ethical"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a summary for a high school IoT project.
      Problem: ${problem}
      Sensors: ${sensors.join(', ')}
      Actions: ${actions.join(', ')}
      
      1. Create a fun, catchy title.
      2. Explain the expected positive effect clearly.
      3. Propose one serious ethical or security question (e.g. privacy, hacking risks).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return {
      title: "멋진 IoT 프로젝트",
      effect: "센서와 출력장치를 통해 문제를 스마트하게 해결합니다.",
      ethical: "데이터 수집 과정에서 개인정보 보호에 유의해야 합니다."
    };
  }
};