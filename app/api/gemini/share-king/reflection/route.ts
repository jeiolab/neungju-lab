import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userResponse } = await request.json();

    if (!userResponse || typeof userResponse !== 'string') {
      return NextResponse.json(
        { error: 'userResponse is required', text: '입력 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `너는 중고등학교 정보 선생님이자 윤리 상담가야. 
        학생이 "내가 만든 자료가 동의 없이 퍼졌을 때 어떻게 대처해야 할까?"라는 질문에 대해 자신의 생각을 적었어.
        학생의 답변을 분석하고, 구체적이고 현실적인 조언을 3~4문장으로 따뜻하게 해줘. 
        저작권법적 측면과 감정적 대처 방법을 모두 포함해줘.
        
        학생의 답변: "${userResponse}"`,
    });

    return NextResponse.json({
      text: response.text || "AI 조교가 연결되지 않았어요. 잠시 후 다시 시도해주세요."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: 'AI 조교가 연결되지 않았어요. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
