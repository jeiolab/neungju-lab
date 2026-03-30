import { NextRequest, NextResponse } from "next/server";
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { userIdea } = await request.json();

    if (!userIdea || typeof userIdea !== 'string') {
      return NextResponse.json(
        { error: 'userIdea is required', text: '아이디어를 입력해주세요.' },
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
      당신은 미래 기술을 연구하는 '무선 통신 수석 연구원'입니다.
      사용자가 상상한 미래 무선 통신 아이디어: "${userIdea}"
      
      이 아이디어에 대해 다음 구조로 답변해주세요:
      1. 칭찬 및 흥미로운 점 (탐정 말투로, 예: "오, 자네 생각이 아주 기발하군!")
      2. 기술적 실현 가능성 또는 보완점 (현재 기술(Wi-Fi, 6G 등)과 연결지어 간단히)
      3. 관련된 미래 시나리오 한 줄 요약.
      
      너무 길지 않게 300자 이내로 답변하세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "통신 상태가 불안정하여 본부와 연결할 수 없습니다. 다시 시도해주세요."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate response', text: '보안 채널 접속 실패. 시스템 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
