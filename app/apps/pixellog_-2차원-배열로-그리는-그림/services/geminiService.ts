import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { GridData } from "../types";

// Helper to safely parse JSON from AI response
const parseJSON = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
};

export const generatePixelArtFromText = async (prompt: string, size: 5 | 8): Promise<GridData | null> => {
  if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
    console.error("API Key missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
  
  const systemPrompt = `
    You are a pixel art generator engine.
    User will provide a description.
    You must output a strictly valid JSON 2D array (list of lists) of numbers.
    Use only 0 (background/white) and 1 (foreground/black).
    The grid size must be exactly ${size}x${size}.
    Do not add any explanation, only the JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER }
            }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const data = parseJSON(text);
    
    // Basic validation
    if (Array.isArray(data) && data.length === size && Array.isArray(data[0]) && data[0].length === size) {
        return data as GridData;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateMysteryHint = async (grid: GridData): Promise<string> => {
    if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) return "AI 힌트를 사용할 수 없습니다.";

    const ai = new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
    const gridStr = JSON.stringify(grid);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Look at this 2D binary array representing a simple pixel art image: ${gridStr}. 0 is empty, 1 is filled. Give a cryptic but helpful 1-sentence hint about what this object might be. Do not reveal the answer directly. Language: Korean.`,
        });
        return response.text || "힌트를 생성할 수 없습니다.";
    } catch (e) {
        return "힌트를 가져오는 중 오류가 발생했습니다.";
    }
}
