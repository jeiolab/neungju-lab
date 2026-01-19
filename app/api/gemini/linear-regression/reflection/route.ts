import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userThought } = await request.json();

    if (!userThought) {
      return NextResponse.json(
        { error: 'userThought is required' },
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
    
    const systemInstruction = `
      당신은 친절하고 지적인 데이터 과학 튜터입니다.
      사용자가 선형 회귀의 한계점이나 인과관계에 대해 고민하고 있습니다.
      특히 "아이스크림 판매량과 온도의 관계"와 같은 예시를 통해,
      단순 선형 회귀(변수 1개)의 한계와 다중 선형 회귀(변수 여러 개) 또는 혼란 변수(Confounding Variable)의 개념을
      쉽게 설명해주세요.
      답변은 한국어로, 초등학생이나 중학생도 이해할 수 있을 만큼 명확하고 흥미롭게 작성해주세요.
      사용자의 입력에 맞춰 격려하는 어조를 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userThought,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return NextResponse.json({
      text: response.text || "답변을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: '죄송합니다. 현재 AI 선생님과 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
