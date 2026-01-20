import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { difficulty } = await request.json();

    if (!difficulty || (difficulty !== 'easy' && difficulty !== 'hard')) {
      return NextResponse.json(
        { error: 'Difficulty must be "easy" or "hard"' },
        { status: 400 }
      );
    }

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
      contents: `Generate a multiple-choice quiz question about sorting algorithms (Bubble, Selection, Insertion, Quick Sort) in Korean. 
      Difficulty: ${difficulty}. 
      Focus on logic, time complexity, or recognizing intermediate states.
      Provide 4 options.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              maxItems: 4,
              minItems: 4
            },
            answer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    });

    if (response.text) {
      return NextResponse.json(JSON.parse(response.text));
    }
    
    return NextResponse.json(
      { error: 'Failed to generate quiz question' },
      { status: 500 }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate quiz question' },
      { status: 500 }
    );
  }
}
