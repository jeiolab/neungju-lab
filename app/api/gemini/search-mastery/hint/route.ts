import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { problemType, userContent } = await request.json();

    if (!problemType || !userContent) {
      return NextResponse.json(
        { error: 'Problem type and user content are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: '힌트를 불러오는 중 문제가 발생했습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      당신은 고등학교 1학년 정보 교과 '탐색 알고리즘' 코치입니다.
      학생이 '${problemType}' 문제 유형에 대해 생각하고 있습니다.
      학생이 입력한 내용: "${userContent}"
      
      이 학생에게 정답을 바로 알려주지 말고, 스스로 생각할 수 있도록 유도하는 힌트를 2문장 이내로 제공하세요.
      순차 탐색과 이진 탐색의 차이점(정렬 여부, 효율성)에 기반하여 조언하세요.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "힌트를 불러오는 중 문제가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate hint', text: '현재 AI 코치를 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
