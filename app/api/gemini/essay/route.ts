import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { essay } = await request.json();

    if (!essay || typeof essay !== 'string') {
      return NextResponse.json(
        { error: 'Invalid essay parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', score: 0, feedback: 'AI 서비스를 사용할 수 없습니다. API 키를 확인해주세요.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate the following short essay on "Why do we need White Hat Hackers?". The essay is likely in Korean.
      Essay: "${essay}"
      
      Provide a JSON response with a score (0-100) and a brief, encouraging feedback paragraph in Korean explaining key points they missed or got right.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
          },
          required: ['score', 'feedback'],
        },
      },
    });
    
    if (response.text) {
      const result = JSON.parse(response.text);
      return NextResponse.json(result);
    }
    
    return NextResponse.json(
      { error: 'No response text', score: 0, feedback: '시스템 오프라인. 현재 에세이를 평가할 수 없습니다.' },
      { status: 500 }
    );
  } catch (error) {
    console.error("Gemini API Error (Essay):", error);
    return NextResponse.json(
      { error: 'Failed to analyze essay', score: 0, feedback: '시스템 오프라인. 현재 에세이를 평가할 수 없습니다.' },
      { status: 500 }
    );
  }
}
