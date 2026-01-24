import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'prompt is required', text: '질문이 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}\n\nPlease provide a clear, educational answer suitable for a student learning about computer networks.`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: "You are a friendly and knowledgeable network router teaching students about the internet, data packets, and network infrastructure. Use simple analogies.",
      }
    });

    return NextResponse.json({
      text: response.text || "죄송합니다. 현재 응답을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate response', text: '네트워크 연결 상태를 확인해주세요. (API 호출 실패)' },
      { status: 500 }
    );
  }
}
