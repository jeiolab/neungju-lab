import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { opinion } = await request.json();

    if (!opinion || typeof opinion !== 'string') {
      return NextResponse.json(
        { error: 'Invalid opinion parameter' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 서비스를 사용할 수 없습니다. API 키를 확인해주세요.' },
        { status: 500 }
      );
    }
    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절하고 전문적인 정보 보안 컨설턴트입니다. 
        학생이 작성한 "생체 인식(지문, 홍채 등)을 비밀번호로 사용하는 것에 대한 의견"을 분석해주세요.
        
        학생의 의견: "${opinion}"
        
        다음 지침에 따라 답변해 주세요:
        1. 학생의 의견에 공감하고 칭찬해 주세요.
        2. 보안 전문가 입장에서 추가적으로 고려해야 할 점이나 흥미로운 사실을 짧게(1~2문장) 덧붙여 주세요.
        3. 전체적으로 격려하는 톤을 유지하세요.
        4. 답변은 한국어로, 300자 이내로 작성하세요.
      `,
    });

    const text = response.text || "분석에 실패했습니다. 다시 시도해 주세요.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to analyze opinion', text: '현재 AI 보안 컨설턴트와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
}
