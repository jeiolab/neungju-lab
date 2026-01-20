import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', mission: "오늘의 미션: 센서 목록을 다시 검토해보세요." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `수질 관리 AI 에이전트를 설계하는 학생에게 줄 '오늘의 짧은 미션'을 한국어로 한 문장 만들어주세요. 예: "비가 올 때 오탐을 줄이는 방법을 생각해보세요."`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      mission: response.text || "오늘의 미션: 시뮬레이션 탭을 탐험해보세요."
    });
  } catch (error) {
    console.error("Gemini API Error (Project Wizard Daily Mission):", error);
    return NextResponse.json(
      { error: 'Failed to generate mission', mission: "오늘의 미션: 예외 상황에 대한 논리를 점검해보세요." },
      { status: 500 }
    );
  }
}
