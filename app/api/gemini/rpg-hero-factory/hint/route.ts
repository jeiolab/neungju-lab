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
        { error: 'API key not configured', text: 'AI 서비스를 사용할 수 없습니다. API 키를 확인해주세요.' },
        { status: 500 }
      );
    }
    const model = 'gemini-3-flash-preview';
    const prompt = `당신은 코딩 튜터입니다. 다음 파이썬 OOP 질문에 대해 아주 짧고 미묘한 힌트를 한국어로 제공해주세요. 정답을 직접 말하지 마세요.
    질문: ${question}`;

    const response = await generateLlmContent({
      model: model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "문법을 자세히 확인해보세요!"
    });
  } catch (error) {
    console.error("Gemini API Error (RPG Hero Factory Hint):", error);
    return NextResponse.json(
      { error: 'Failed to generate hint', text: '이론 탭을 다시 복습해보세요!' },
      { status: 500 }
    );
  }
}
