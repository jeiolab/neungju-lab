import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'userInput is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      사용자는 K-평균 군집화 알고리즘을 배우는 고등학교 1학년 학생입니다.
      학생이 작성한 다음 생각/질문에 대해 친절하고 교육적인 피드백을 제공해주세요.
      
      학생 입력: "${userInput}"
      
      지침:
      1. 3줄 이내로 간결하게 답변하세요.
      2. K-평균의 한계(예: 원형이 아닌 데이터, K 결정의 어려움, 초기값 민감성)와 관련된 내용이라면 칭찬해주세요.
      3. 실생활 예시(예: 옷 사이즈, 마케팅 고객 분류)를 들어주면 좋습니다.
      4. 말투는 격려하는 선생님처럼 해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "피드백을 불러오지 못했습니다.";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to get AI feedback', text: '피드백을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
