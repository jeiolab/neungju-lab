import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'question is required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 튜터와 연결할 수 없습니다. API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    const systemPrompt = `
      당신은 고등학교 1학년 학생에게 알고리즘을 가르치는 친절하고 비유를 잘 사용하는 'AI 알고리즘 튜터'입니다.
      학생의 질문에 대해 이해하기 쉽게 설명하세요.
      너무 기술적인 용어보다는 일상 생활의 비유(예: 카드 정리, 키 순서대로 줄 서기 등)를 적극 활용하세요.
      답변은 3-4문장으로 간결하지만 핵심을 찌르도록 구성하세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context || '사용자는 버블 정렬, 선택 정렬, 삽입 정렬의 시각화 도구를 체험했습니다.'}\n\nStudent Question: ${question}`,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return NextResponse.json({
      text: response.text || "죄송합니다. 답변을 생성하는 중에 문제가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate response', text: '현재 AI 튜터와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
