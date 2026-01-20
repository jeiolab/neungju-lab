import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 시스템 연결에 실패했습니다. (API Key 확인 필요)' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';

    const prompt = `Create a multiple-choice quiz question about Graph Theory (BFS vs DFS).
      Return JSON format: { "question": "string", "options": ["string", "string", "string", "string"], "answer": int (0-3 index), "explanation": "string" }.
      The tone should be adventurous and fun.
      Write in Korean.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json(
        { error: 'Failed to generate quiz', question: null },
        { status: 500 }
      );
    }

    try {
      const quizData = JSON.parse(text);
      return NextResponse.json(quizData);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: 'Failed to parse quiz data', question: null },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate quiz', question: null },
      { status: 500 }
    );
  }
}
