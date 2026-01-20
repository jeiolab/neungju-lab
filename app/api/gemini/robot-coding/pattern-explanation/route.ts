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
        { error: 'API key not configured', text: 'API Key가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';

    const prompt = `초등학생/중학생을 대상으로 '${topic}'에 대해 설명해줘. 
      패턴 인식(Pattern Recognition)의 관점에서, 이것이 왜 중요하고 컴퓨터 과학에서 어떻게 쓰이는지 
      쉽고 재미있게 300자 이내로 설명해줘.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "설명을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate explanation', text: 'AI 서비스를 사용할 수 없습니다.' },
      { status: 500 }
    );
  }
}
