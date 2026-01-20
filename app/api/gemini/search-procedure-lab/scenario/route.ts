import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { algorithm } = await request.json();

    if (!algorithm || typeof algorithm !== 'string') {
      return NextResponse.json(
        { error: 'Invalid algorithm parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key가 없습니다. 기본 시나리오: 도서관에서 책 찾기를 상상해보세요!' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      '${algorithm}' 알고리즘을 실생활에서 활용할 수 있는 재미있는 시나리오를 하나 만들어주세요.
      예: "학교 축제에서 보물찾기", "지하철 최단 환승 경로 찾기" 등.
      
      형식:
      상황: [상황 설명 1문장]
      문제: [해결해야 할 문제 1문장]
      생각해보기: [이 알고리즘을 어떻게 적용할지 묻는 질문]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "시나리오 생성 중 오류가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (Search Procedure Lab Scenario):", error);
    return NextResponse.json(
      { error: 'Failed to generate scenario', text: '시나리오 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
