import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { dataSummary } = await request.json();

    if (!dataSummary || typeof dataSummary !== 'string') {
      return NextResponse.json(
        { error: 'Invalid dataSummary parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: '분석 서비스를 사용할 수 없습니다. API 키를 확인해주세요.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 성적 데이터를 분석하고 특이사항이나 교육적 조언을 한 문단으로 짧게 해줘:\n${dataSummary}`,
    });

    return NextResponse.json({
      text: response.text || "분석 실패"
    });
  } catch (error) {
    console.error("Gemini API Error (ClassManager Analyze):", error);
    return NextResponse.json(
      { error: 'Failed to analyze', text: '분석 서비스를 사용할 수 없습니다.' },
      { status: 500 }
    );
  }
}
