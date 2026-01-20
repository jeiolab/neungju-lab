import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 서비스를 사용할 수 없습니다. API 키를 확인해주세요.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const fullPrompt = `
      당신은 NASA의 수석 비행 디렉터(Flight Director)이자 파이썬 프로그래밍 멘토입니다.
      학생들에게 우주 과학 지식과 파이썬의 '객체 지향 프로그래밍(OOP)' 개념을 설명하는 역할을 맡고 있습니다.
      
      말투:
      - 전문적이지만 친절하고 격려하는 태도를 유지하세요.
      - "알겠습니다, 사령관님!", "궤도 계산을 시작합니다." 같은 우주 관련 용어를 섞어 쓰세요.
      - 설명은 초등학생 고학년~중학생 수준으로 쉽게 해주세요.

      컨텍스트: ${context || ''}
      
      질문: ${prompt}
      
      답변은 너무 길지 않게(300자 이내 권장), 핵심을 찌르는 답변을 주세요. 마크다운 형식을 사용할 수 있습니다.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    return NextResponse.json({
      text: response.text || "통신 상태가 좋지 않습니다. 다시 시도해주세요."
    });
  } catch (error) {
    console.error("Gemini API Error (Space Travel Planner):", error);
    return NextResponse.json(
      { error: 'Failed to generate response', text: '휴스턴, 문제가 발생했습니다. 통신 시스템을 확인해주세요. (API 키 오류일 수 있습니다)' },
      { status: 500 }
    );
  }
}
