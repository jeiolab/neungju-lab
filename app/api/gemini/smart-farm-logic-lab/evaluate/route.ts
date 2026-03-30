import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { userAnswer, scenario } = await request.json();

    if (!userAnswer || typeof userAnswer !== 'string' || !scenario || typeof scenario !== 'string') {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: '오류: API 키가 누락되었습니다.' },
        { status: 500 }
      );
    }
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 '스마트팜 엔지니어링 멘토'입니다. 고등학교 1학년 학생들에게 프로그래밍 논리를 가르치고 있습니다.
      
      시나리오: "${scenario}"
      
      학생의 답변: "${userAnswer}"
      
      위 답변을 평가하고, 건설적인 피드백을 제공해주세요.
      1. 학생의 접근 방식이 논리적으로 타당한지 칭찬해주세요.
      2. 만약 부족한 점이 있다면, 구체적인 예외 처리 방법(예: 센서 범위 체크, 오류 코드 반환 등)을 친절하게 설명해주세요.
      3. 톤은 전문적이지만 매우 친절하고 격려하는 어조여야 합니다.
      4. 200자 이내로 요약해서 답변하세요.
    `;

    const response = await generateLlmContent({
      model: model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "죄송합니다. 멘토 연결 상태가 좋지 않아 피드백을 불러올 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (Smart Farm Logic Lab Evaluate):", error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer', text: '통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
