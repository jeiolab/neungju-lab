import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer } = await request.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'question and userAnswer are required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 없어 피드백을 줄 수 없습니다.' },
        { status: 500 }
      );
    }
    const prompt = `
      질문: "${question}"
      학생의 답변: "${userAnswer}"

      역할: AI 전문가 선생님.
      지침:
      1. 학생의 답변이 논리적인지, 어떤 데이터가 더 필요할지 칭찬과 함께 보완할 점을 3문장 내외로 피드백해주세요.
      2. 긍정적이고 격려하는 어조를 사용하세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "피드백 생성 실패"
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: '피드백을 생성하는 도중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
