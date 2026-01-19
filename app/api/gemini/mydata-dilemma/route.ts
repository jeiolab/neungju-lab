import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { type, scenario, userAnswer, questionContext, appType, dataShared, protections, scores } = await request.json();

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';

    let prompt = '';
    if (type === 'generateReflectionFeedback') {
      prompt = `
        당신은 고등학교 1학년 학생들에게 정보 보호와 데이터 윤리를 가르치는 친절한 선생님입니다.
        
        상황: 학생이 "${scenario}" 앱 개발 시나리오에 대해 고민하고 있습니다.
        질문: ${questionContext}
        학생의 답변: "${userAnswer}"
        
        이 답변에 대해 다음 기준으로 피드백을 주세요:
        1. 학생의 논리에서 훌륭한 점 (칭찬)
        2. 놓쳤을 수 있는 개인정보 보호의 위험성이나 마이데이터의 관점 (보완점)
        3. 더 깊게 생각해볼 만한 질문 하나
        
        말투는 친근하고 격려하는 투로, 300자 이내로 요약해주세요.
      `;
    } else if (type === 'analyzeSimulation') {
      prompt = `
        학생이 마이데이터 앱 시뮬레이션을 진행했습니다.
        
        - 앱 종류: ${appType}
        - 공유한 데이터: ${dataShared.join(', ')}
        - 선택한 보호 조치: ${protections.join(', ')}
        - 결과: 편의성 점수 ${scores.convenience}점, 위험도 ${scores.risk}점.
        
        이 학생의 선택 성향(위험 감수형/균형형/보수형)을 분석하고,
        이 선택이 실제 생활에서 어떤 결과를 초래할지 한 줄로 명확하게 요약해주세요.
        예: "편리함을 위해 금융 정보를 공유했지만, 2단계 인증이 없어 해킹 위험이 높습니다."
      `;
    } else {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    const response = await ai.models.generateContent({ model, contents: prompt });
    const text = response.text || "피드백을 생성할 수 없습니다.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error (MyData Dilemma):", error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
