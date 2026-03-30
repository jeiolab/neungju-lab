import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

const SYSTEM_INSTRUCTION = `
당신은 학교의 "정보샘"입니다. 
당신의 목표는 프로그래밍 초보자인 동료 선생님들에게 "2차원 리스트(배열)"의 개념을 아주 쉽고 친절하게 설명하는 것입니다.
다음 규칙을 따르세요:
1. 엑셀(표)과 파이썬 리스트(코드)를 비교해서 설명하세요.
2. 행(Row)은 학생, 열(Column)은 과목이라는 비유를 계속 사용하세요.
3. 인덱스가 0부터 시작한다는 점을 헷갈리지 않게 강조하세요.
4. 말투는 정중하면서도 격려하는 선생님 말투를 사용하세요. (예: "~입니다", "~해볼까요?")
5. 사용자가 코드를 어려워하면 "서랍장 속의 서랍장" 같은 비유를 들어주세요.
`;

export async function POST(request: NextRequest) {
  try {
    const { userMessage, history } = await request.json();

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Invalid userMessage parameter' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 서비스를 사용할 수 없습니다. API 키를 확인해주세요.' },
        { status: 500 }
      );
    }
    // Construct prompt with context
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n이전 대화:\n${(history || []).join('\n')}\n\n사용자 질문: ${userMessage}`;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Fast response for chat
      }
    });

    return NextResponse.json({
      text: response.text || "죄송합니다. 답변을 생성하는 데 문제가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (ClassManager Coach):", error);
    return NextResponse.json(
      { error: 'Failed to generate response', text: '통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
