import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', questions: [] },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "순차 탐색과 이진 탐색, 알고리즘 효율성(Big O)에 대한 초보자용 퀴즈 3문제를 만들어주세요.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (!response.text) {
      return NextResponse.json(
        { error: 'No response text', questions: [] },
        { status: 500 }
      );
    }

    const questions = JSON.parse(response.text);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Gemini API Error (Up Down Search Lab Quiz):", error);
    return NextResponse.json(
      { error: 'Failed to generate quiz', questions: [] },
      { status: 500 }
    );
  }
}
