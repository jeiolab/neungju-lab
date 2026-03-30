import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { scenario } = await request.json();

    if (!scenario || typeof scenario !== 'string') {
      return NextResponse.json(
        { error: 'Invalid scenario parameter' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않아 셰프와 대화할 수 없습니다. (데모 모드: 인종차별이나 편향 문제는 주로 \'데이터 수집\' 단계에서 편향된 데이터가 들어갔기 때문에 발생합니다.)' },
        { status: 500 }
      );
    }
    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절하고 지혜로운 '데이터 셰프'입니다. AI 윤리, 편향성, 기계학습 파이프라인의 문제점에 대해 요리에 비유하여 초등학생도 이해하기 쉽게 설명해주세요.
        
        사용자가 다음 상황에 대해 질문했습니다: "${scenario}". 
        이 문제가 기계학습의 4단계(수집/전처리 -> 학습 -> 평가 -> 적용) 중 주로 어디서 발생했는지, 그리고 어떻게 고쳐야 하는지 3문장 이내로 설명해주세요.
      `,
    });

    const text = response.text || "죄송해요, 지금은 주방이 너무 바빠서 답변하기 어렵네요.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to get chef response', text: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
