import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid question parameter' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 필요합니다.' },
        { status: 500 }
      );
    }
    const prompt = `
      초등학생/중학생 대상 코딩 교육 앱입니다.
      다음 질문에 대해 창의적인 사고를 돕는 짧은 힌트를 2-3문장으로 주세요. 답을 바로 알려주지 마세요.
      
      질문: "${question}"
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || ""
    });
  } catch (error) {
    console.error("Gemini API Error (Medi-Check Logic Hint):", error);
    return NextResponse.json(
      { error: 'Failed to generate hint', text: '힌트를 불러오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}
