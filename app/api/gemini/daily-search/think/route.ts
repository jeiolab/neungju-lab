import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않아 내용을 불러올 수 없습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Explain this concept simply for a beginner programmer in KOREAN: "${topic}". keep it under 150 words.`,
    });

    return NextResponse.json({
      text: response.text || "내용을 불러올 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate content', text: '생각해볼 문제에 대한 답을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
