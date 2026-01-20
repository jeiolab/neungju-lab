import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'topic is required', text: '주제가 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 시스템 연결에 실패했습니다. (API Key 확인 필요)' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';

    const prompt = `Explain the concept of "${topic}" in the context of finding a treasure on a map.
      Keep it simple, fun, and educational for a student.
      Use an analogy. Max 150 words.
      Write in Korean.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "AI 응답을 불러올 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate insight', text: '네트워크 오류로 설명을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
