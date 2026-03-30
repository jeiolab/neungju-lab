import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { topic, userAnswer } = await request.json();

    if (!topic || !userAnswer) {
      return NextResponse.json(
        { error: 'topic and userAnswer are required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    const prompt = `
      당신은 친절하고 격려를 아끼지 않는 고등학교 1학년 인공지능 선생님입니다.
      학생이 의사결정트리(Decision Tree)와 관련된 주제인 "${topic}"에 대해 다음과 같이 답했습니다.
      
      학생 답변: "${userAnswer}"

      이 답변에 대해 3문장 이내로 피드백을 주세요.
      1. 잘 이해한 점 칭찬
      2. 보완하거나 더 생각해볼 점 제시 (부드럽게)
      3. 말투는 친근하게 (~해요 체)
    `;

    const response = await generateLlmContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "피드백을 생성하지 못했습니다."
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: 'AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
