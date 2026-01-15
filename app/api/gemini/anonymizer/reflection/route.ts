import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userText } = await request.json();

    if (!userText || typeof userText !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', text: '입력이 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되어 있지 않습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      The user wrote a reflection on "Privacy vs Utility in the Big Data Era".
      User text: "${userText}"
      
      Provide a constructive, encouraging response in Korean (max 200 characters) acting as a Senior Professor.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({ text: response.text || "훌륭한 생각입니다! 데이터 활용과 보호의 균형은 항상 중요한 숙제입니다." });
  } catch (error) {
    console.error("Reflection Error:", error);
    return NextResponse.json(
      { text: "훌륭한 생각입니다! 데이터 활용과 보호의 균형은 항상 중요한 숙제입니다." },
      { status: 200 }
    );
  }
}
