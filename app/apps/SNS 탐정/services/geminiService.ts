import { GoogleGenAI, Type } from "@google/genai";
import { TextAnalysisResult, ImageAnalysisResult } from "../types";

const hasApiKey = !!process.env.API_KEY;

// Initialize Gemini only if key exists
const ai = hasApiKey ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

export const analyzeTextWithGemini = async (text: string): Promise<TextAnalysisResult> => {
  if (!ai || !text) {
    // Fallback Mock Logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isNegative = text.includes("엉망") || text.includes("차갑") || text.includes("ㅠㅠ");
    return {
      sentimentScore: isNegative ? 15 : 85,
      sentimentLabel: isNegative ? 'Negative' : 'Positive',
      tokens: text.split(' '),
      keywords: isNegative ? ['엉망', '차갑다', '실망'] : ['좋아요', '맛있어요'],
      explanation: "Mock Analysis: Detected negative keywords indicating dissatisfaction."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the sentiment of the following Korean text: "${text}". 
      Return a JSON object with:
      - sentimentScore (integer 0-100, where 0 is very negative, 100 is very positive)
      - sentimentLabel (Positive, Negative, or Neutral)
      - tokens (array of strings, simple tokenization)
      - keywords (array of strings, key influential words)
      - explanation (short sentence explaining why).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: { type: Type.INTEGER },
            sentimentLabel: { type: Type.STRING },
            tokens: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING },
          }
        }
      }
    });
    
    const result = JSON.parse(response.text || "{}");
    return result as TextAnalysisResult;
  } catch (error) {
    console.error("Gemini Error", error);
    // Fallback on error
    return {
      sentimentScore: 50,
      sentimentLabel: 'Neutral',
      tokens: text.split(' '),
      keywords: [],
      explanation: "Error analyzing text with AI."
    };
  }
};

export const analyzeImageWithGemini = async (base64Image: string): Promise<ImageAnalysisResult> => {
  if (!ai) {
    // Fallback Mock Logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      tags: ['#Cat', '#Cute', '#Animal', '#Pet'],
      description: "A cute cat looking at the camera.",
      features: "Detected rounded ear shapes, fur texture patterns, and whisker vectors."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: `Analyze this image for an educational app about unstructured data.
            Return JSON with:
            - tags (array of strings, e.g. #Cat)
            - description (short string)
            - features (string explaining what visual features like edges, textures, shapes were likely used to identify this).` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            features: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as ImageAnalysisResult;
  } catch (error) {
    console.error("Gemini Image Error", error);
    return {
      tags: ['#Error'],
      description: "Could not analyze image.",
      features: "N/A"
    };
  }
};
