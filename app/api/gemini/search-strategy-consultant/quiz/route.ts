import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, isCorrect } = await request.json();

    if (!question || userAnswer === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Question, userAnswer, and isCorrect are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않아 AI와 연결할 수 없습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      퀴즈 문제: "${question}"
      사용자 답안: "${userAnswer}"
      정답 여부: ${isCorrect ? "정답" : "오답"}

      이 사용자에게 한 문장으로 핵심 개념을 설명해주는 피드백을 주세요. 
      오답이라면 왜 틀렸는지, 정답이라면 왜 중요한 개념인지 알려주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return NextResponse.json({
      text: response.text || ""
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: '' },
      { status: 500 }
    );
  }
}
