import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { design } = await request.json();

    if (!design) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', feedback: "오류: API 키가 없습니다. 설정을 확인해주세요." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      당신은 고등학교 정보 교과 선생님입니다. 학생이 제출한 '수질 관리 지능형 에이전트 설계서'를 평가하고 피드백을 주어야 합니다.
      반드시 **한국어(Korean)**로 답변해주세요. 어조는 친절하고 격려하는 존댓말을 사용하세요.

      학생의 설계 내용:
      - 프로젝트 이름: ${design.name}
      - 인식 (센서): ${design.perception.sensors.join(', ')} (위치: ${design.perception.location})
      - 분석 (논리): 임계값은 "${design.analysis.threshold}", 논리 규칙은 "${design.analysis.logic}"
      - 추론 (전략): 전략은 "${design.reasoning.strategy}" -> 결정: "${design.reasoning.decision}"
      - 행동 (액추에이터): ${design.action.actuators.join(', ')}
      - 주장하는 특성: ${design.characteristics.join(', ')}

      다음 3가지 항목으로 간결하게 3문단 피드백을 작성해주세요 (총 200자 내외):
      1. 강점: 이 설계에서 논리적으로 잘 된 점은 무엇인가요?
      2. 일관성 체크: 센서가 분석에 필요한 데이터를 제공하나요? 액추에이터가 결정된 행동을 수행할 수 있나요?
      3. 생각해볼 점: 센서 고장이나 오탐(False Positive) 가능성에 대해 학생이 고민해볼 만한 질문을 하나 던져주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      feedback: response.text || "피드백을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (Project Wizard Agent Feedback):", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', feedback: "죄송합니다. 현재 AI 선생님과 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
