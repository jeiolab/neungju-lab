import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { userAnswer } = await request.json();

    if (!userAnswer || typeof userAnswer !== 'string') {
      return NextResponse.json(
        { error: 'userAnswer is required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
        { status: 500 }
      );
    }
    const prompt = `
      당신은 친절한 데이터 과학 선생님입니다.
      학생이 '의사가 환자를 진단할 때 의사결정트리 방식을 쓴다면 어떤 질문 순서가 가장 중요할까?'라는 질문에 대해 다음과 같이 답했습니다:
      "${userAnswer}"
      
      이 답변에 대해 다음 기준으로 피드백을 주세요:
      1. 칭찬할 점 (논리적 접근 등)
      2. '정보 이득(Information Gain)'이나 '엔트로피' 개념을 아주 쉽게 비유해서 설명하며 답변 보강하기
      3. 가장 중요한 증상(가장 많은 가능성을 배제할 수 있는 질문)을 먼저 묻는 것이 왜 효율적인지 설명하기
      
      답변은 한국어로, 초등학생도 이해할 수 있을 만큼 쉽고 친근하게 작성해주세요. 200자 내외로 요약해주세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return NextResponse.json({
      text: response.text || "피드백을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: 'AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
