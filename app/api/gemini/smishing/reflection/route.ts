import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', text: '입력이 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: "AI 멘토를 이용하려면 API 키가 필요합니다." },
        { status: 500 }
      );
    }
    const prompt = `
      당신은 고등학생을 위한 친절한 정보보안 멘토입니다.
      학생이 자신의 보안 취약점이나 고민을 입력했습니다: "${userInput}"

      다음 형식으로 짧고(200자 이내) 격려가 담긴 보안 조언을 해주세요:
      1. 공감하기 (그럴 수 있어!)
      2. 구체적인 행동 팁 (하나만 딱 정해서)
      3. 격려 (너도 보안 캡틴이 될 수 있어!)
      
      말투는 고등학생에게 말하듯 친근하게 해요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({ text: response.text || "분석 실패." });
  } catch (error) {
    console.error("Gemini API Error (Smishing Reflection):", error);
    return NextResponse.json(
      { error: 'Failed to generate reflection', text: "연결 오류로 조언을 생성할 수 없습니다." },
      { status: 500 }
    );
  }
}
