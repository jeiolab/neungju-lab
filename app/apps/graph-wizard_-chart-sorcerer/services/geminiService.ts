import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getMagicalHint = async (
  missionGoal: string, 
  wrongChartSelected: string, 
  dataDescription: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "마법의 수정구가 흐릿합니다. (API Key Missing)";

  try {
    const prompt = `
      You are a wise Data Visualization Wizard.
      A student is trying to visualize data but selected the wrong chart type.
      
      Mission Goal: ${missionGoal}
      Data Description: ${dataDescription}
      Student Selected: ${wrongChartSelected}
      
      Explain briefly and magically (in Korean) why the selected chart is not ideal for this goal, and hint at the correct one without giving it away directly. Use emojis.
      Keep it under 2 sentences.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "별들이 답을 알려주지 않는군요.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "마법 주문이 실패했습니다. 다시 시도해주세요.";
  }
};

export const analyzeDistortion = async (
  scenario: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "마법의 수정구가 흐릿합니다. (API Key Missing)";

  try {
    const prompt = `
      You are a wise Data Visualization Wizard.
      Explain the potential danger of the following graph distortion scenario to a student.
      
      Scenario: ${scenario}
      
      Provide a 3-bullet point explanation in Korean about how this misleads people. Use a warning tone.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "분석할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "마법 주문이 실패했습니다.";
  }
};
