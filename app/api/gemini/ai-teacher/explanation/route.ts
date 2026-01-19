import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { topic, context } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'topic is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI teacher explaining Machine Learning concepts to a beginner. 
      Topic: ${topic}
      Context: ${context || ''}
      
      Provide a concise, easy-to-understand explanation (max 2-3 sentences) in Korean. Be encouraging and friendly.`,
    });

    const text = response.text || "설명을 생성할 수 없습니다.";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate explanation', text: 'AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
