import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { type, designText, question, userAnswer, correctAnswer } = await request.json();

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    const model = 'gemini-3-flash-preview';

    let prompt = '';
    if (type === 'checkProjectDesign') {
      prompt = `
        당신은 고등학교 정보 교과 선생님이자 개인정보보호 전문가입니다.
        학생이 제출한 다음 "데이터 공유 프로젝트 계획"을 평가해주세요.
        
        학생의 계획: "${designText}"
        
        다음 기준에 따라 300자 이내로 피드백을 주세요:
        1. 개인정보 침해 위험이 없는지.
        2. 데이터의 유용성(활용 가치)이 충분한지.
        3. 가명화/익명화 조치가 적절한지.
        
        어투는 친절하고 격려하는 선생님처럼 해주세요. 구체적인 개선점 1가지를 포함하세요.
      `;
    } else if (type === 'getContextualQuizFeedback') {
      prompt = `
        학생이 퀴즈를 틀렸습니다. 
        문제: "${question}"
        학생 답: "${userAnswer}"
        정답: "${correctAnswer}"
        
        왜 틀렸는지, 그리고 정답이 왜 정답인지 고등학생 눈높이에서 2문장으로 설명해주세요.
      `;
    } else {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    const response = await generateLlmContent({ model, contents: prompt });
    const text = response.text || "피드백을 생성할 수 없습니다.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error (Anonymization Pipeline):", error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
