import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    const model = 'gemini-3-flash-preview';

    const prompt = `
      당신은 지능 에이전트(Intelligent Agent) 교육 전문가입니다.
      학생이 자신의 일상 생활 문제를 "인식-학습-추론-행동" 4단계 파이프라인으로 분석했습니다.
      
      학생의 입력:
      1. 인식(Perception): ${data.perception}
      2. 학습(Learning): ${data.learning}
      3. 추론(Reasoning): ${data.reasoning}
      4. 행동(Action): ${data.action}

      이 분석이 개념적으로 타당한지 평가하고, 격려와 함께 짧은 피드백(3문장 이내)을 한국어로 제공해주세요.
      각 단계가 적절하게 연결되었는지 확인해주세요.
    `;

    const response = await generateLlmContent({ model, contents: prompt });
    const text = response.text || "피드백을 생성할 수 없습니다. 다시 시도해주세요.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error (Pipeline Assembly):", error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
