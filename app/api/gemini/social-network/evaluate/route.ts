import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { solution, scenario } = await request.json();

    if (!solution || !scenario) {
      return NextResponse.json(
        { error: 'Solution and scenario are required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않아 AI 피드백을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }
    const modelId = "gemini-3-flash-preview";
    
    const response = await generateLlmContent({
      model: modelId,
      contents: `
        Scenario: ${scenario}
        Student's Solution: ${solution}
        
        Evaluate the student's solution regarding social network theory (connecting isolated nodes).
        Give constructive feedback in Korean. Compliment them if it makes sense, or suggest a better approach if it's flawed.
      `,
    });

    return NextResponse.json({
      text: response.text || "평가 중 오류가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: '오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
