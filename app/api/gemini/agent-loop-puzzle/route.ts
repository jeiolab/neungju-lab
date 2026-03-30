import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { originalStep, userProposal } = await request.json();

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    const model = 'gemini-3-flash-preview';

    const prompt = `
      너는 고등학교 1학년 학생에게 '지능형 에이전트 루프(인식-학습-추론-행동)'를 가르치는 친절하고 논리적인 '퍼즐 코치'야.
      학생이 '${originalStep}' 단계를 다르게 바꾸거나 개선하는 아이디어를 냈어.
      
      학생의 아이디어: "${userProposal}"
      
      이 아이디어가 에이전트의 루프에 어떤 영향을 미칠지, 어떤 장점이나 예상되는 문제가 있을지 3문장 이내로 쉽고 격려하는 톤으로 피드백해줘.
      전문 용어보다는 쉬운 비유를 사용해.
    `;

    const response = await generateLlmContent({ model, contents: prompt });
    const text = response.text || "피드백을 생성하는 중 오류가 발생했습니다.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error (Agent Loop Puzzle):", error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
