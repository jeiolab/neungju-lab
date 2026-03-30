import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer } = await request.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    const prompt = `
      당신은 고등학교 정보 보호 과목 선생님입니다.
      
      질문: "${question}"
      학생 답변: "${userAnswer}"
      
      이 답변이 보안 관점에서 타당한지 평가해주세요.
      다음 JSON 형식으로만 응답하세요.
      {
        "isCorrect": boolean,
        "score": number, // 0-100
        "feedback": "2~3문장의 구체적인 피드백 (친절하고 교육적인 말투)"
      }
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (!response.text) {
      return NextResponse.json(
        { error: 'No response' },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Gemini Evaluation Error (SNS):", error);
    return NextResponse.json(
      {
        isCorrect: false,
        score: 0,
        feedback: "시스템 오류로 채점할 수 없습니다. 잠시 후 다시 시도해주세요."
      },
      { status: 200 }
    );
  }
}
