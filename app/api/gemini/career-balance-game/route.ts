import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { situation, selection, userText } = await request.json();

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash-latest';

    const prompt = `
      학생이 자신의 진로 선택에 대해 쓴 글이다.
      상황: ${situation}
      선택한 직업: ${selection}
      학생의 글: "${userText}"

      역할: 진로 코치
      평가 기준:
      1. 근거가 명확한가?
      2. 예시가 있는가?
      3. 대안이나 보완점이 있는가?

      출력 형식(JSON):
      {
        "score": 0~100 사이 정수,
        "feedback": "3문장 이내의 구체적인 피드백 (친절하게)",
        "badgeEarned": true/false (점수가 85점 이상이고 3가지 기준을 잘 충족했을 때)
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response");
    }
    
    const result = JSON.parse(text);
    return NextResponse.json({
      score: result.score,
      feedback: result.feedback,
      badgeEarned: result.badgeEarned
    });
  } catch (error) {
    console.error("Gemini API Error (Career Balance Game):", error);
    return NextResponse.json(
      { 
        score: 70,
        feedback: "AI 분석 중 오류가 발생했습니다. 글의 내용이 충분히 구체적인지 확인해보세요.",
        badgeEarned: false
      },
      { status: 500 }
    );
  }
}
