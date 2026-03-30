import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { questionType, userAnswer } = await request.json();

    if (!questionType || !userAnswer) {
      return NextResponse.json(
        { error: 'questionType and userAnswer are required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
        { status: 500 }
      );
    }
    const prompt = `
      사용자가 '지능 에이전트' 학습 중 '${questionType}'에 대한 서술형 답변을 제출했습니다.
      답변: "${userAnswer}"

      이 답변에 대해 3가지 관점(이해도, 논리성, 창의성)에서 짧은 평가와 루브릭 점수(A/B/C)를 매겨주세요.
      그리고 보완할 점을 한 문장으로 조언해주세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "평가를 생성할 수 없습니다.";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to evaluate reflection', text: '평가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
