import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a short thought-provoking scenario about AI Bias in Supervised Learning for a student.
      Ask: "What happens if we only teach an AI that [Biased Data]?"
      Then explain the consequence briefly.
      Language: Korean.
      Format:
      Q: [Question]
      A: [Consequence]`
    });

    const text = response.text || "시나리오 생성 실패.";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate scenario', text: '시나리오를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
