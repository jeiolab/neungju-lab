import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { QuizQuestion } from "../types";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
// Initialize conditionally to avoid errors if key is missing during dev
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateQuizQuestionWithGemini = async (): Promise<QuizQuestion | null> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Using static fallback.");
    return null;
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Create a "Truth or False" quiz question about digital literacy, fake news, or internet ethics for high school students.
      It should look like a news headline.
      Make it tricky but educational.
      Return strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "The news headline to judge" },
            isTruth: { type: Type.BOOLEAN, description: "Whether it is true or false" },
            explanation: { type: Type.STRING, description: "Educational feedback explaining why" }
          },
          required: ["headline", "isTruth", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    return {
      id: Date.now().toString(),
      headline: data.headline,
      isTruth: data.isTruth,
      explanation: data.explanation
    };

  } catch (error) {
    console.error("Failed to generate quiz with Gemini:", error);
    return null;
  }
};
