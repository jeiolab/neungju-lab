import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(_request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Generate a 'O/X' quiz question related to Korean Personal Information Protection Act (개인정보보호법), pseudonymization (가명처리), or anonymization (익명처리).
      Include the question, the correct answer (O or X), and a brief explanation in Korean.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING, enum: ["O", "X"] },
            explanation: { type: Type.STRING }
          }
        }
      }
    });

    if (!response.text) {
      return NextResponse.json(
        { error: 'No response' },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return NextResponse.json(
      {
        question: "개인정보보호법에 따라 가명정보는 본인의 동의 없이 통계 작성, 과학적 연구 목적으로 활용할 수 있다.",
        answer: "O",
        explanation: "기본값: 가명정보는 특례 조항에 따라 특정 목적 하에 동의 없이 처리가 가능합니다."
      },
      { status: 200 }
    );
  }
}
