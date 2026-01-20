import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userAnswer } = await request.json();

    if (!userAnswer || typeof userAnswer !== 'string') {
      return NextResponse.json(
        { error: 'userAnswer is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 시스템 연결에 실패했습니다. API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절하고 지혜로운 수석 도서관 사서입니다. 
        사용자(신입 사서)가 "우리 반을 번호순으로 가장 빠르게 줄 세우는 방법"에 대해 답변을 제출했습니다.
        
        사용자의 답변: "${userAnswer}"
        
        다음 지침에 따라 피드백을 주세요:
        1. 사용자가 제안한 방식이 어떤 정렬 알고리즘(예: 버블, 선택, 삽입, 퀵, 병합 등)과 유사한지 분석해주세요.
        2. 그 방식의 장점과 단점을 실생활(운동장 줄서기) 관점에서 설명해주세요.
        3. 격려하는 말투로 3~4문장 내외로 짧게 답변해주세요.
      `,
    });

    return NextResponse.json({
      text: response.text || "피드백을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: 'AI 시스템 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
