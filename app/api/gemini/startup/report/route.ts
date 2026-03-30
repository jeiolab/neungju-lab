import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { finalStats, historyLog } = await request.json();

    if (!finalStats) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: "AI 분석을 이용하려면 API 키가 필요합니다." },
        { status: 500 }
      );
    }
    const prompt = `
      Analyze the player's performance as a Startup CEO.
      Final Stats: Security ${finalStats.security}, Users ${finalStats.users}, Budget ${finalStats.budget}, Happiness ${finalStats.happiness}.
      Game Log: ${historyLog}

      Provide a 2-paragraph summary of their leadership style in KOREAN. 
      Were they reckless? Too paranoid? Or a balanced leader?
      Critique their major decisions regarding information security.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "분석 실패.";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error (Report):", error);
    return NextResponse.json(
      { error: 'Failed to generate report', text: "연결 오류로 리포트를 생성할 수 없습니다." },
      { status: 500 }
    );
  }
}
