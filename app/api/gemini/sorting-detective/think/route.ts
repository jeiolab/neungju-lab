import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Create a 'Think About It' logic puzzle related to sorting algorithms in Korean. It should present a scenario (e.g., 'If the array is reverse sorted...') and ask for a prediction or analysis. Do not make it a multiple choice.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            scenario: { type: Type.STRING },
            question: { type: Type.STRING },
            hint: { type: Type.STRING },
            answerKey: { type: Type.STRING, description: "The correct reasoning/answer" }
          }
        }
      }
    });
    
    if (response.text) {
      return NextResponse.json(JSON.parse(response.text));
    }
    
    return NextResponse.json(
      { error: 'Failed to generate think problem' },
      { status: 500 }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate think problem' },
      { status: 500 }
    );
  }
}
