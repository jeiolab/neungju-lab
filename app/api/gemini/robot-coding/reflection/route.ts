import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'userInput is required', text: '입력 내용이 필요합니다.' },
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

    const prompt = `학생이 신호등의 규칙을 모델링한 내용이야: "${userInput}".
      이 모델링의 장점과, 놓친 부분(예: 보행자 신호, 비상 상황, 점멸 신호 등)을 
      '패턴 탐정'이라는 친절한 페르소나로 피드백해줘. 
      마지막에는 격려의 말을 덧붙여줘.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "피드백을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: 'AI 서비스를 사용할 수 없습니다.' },
      { status: 500 }
    );
  }
}
