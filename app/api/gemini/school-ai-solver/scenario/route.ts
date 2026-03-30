import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { problemTitle, selectedType, features, isCorrect, score } = await request.json();

    if (!problemTitle || !selectedType || !features || typeof isCorrect !== 'boolean' || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않아 시나리오를 생성할 수 없습니다.' },
        { status: 500 }
      );
    }
    const prompt = `
      당신은 친절하고 재치 있는 'AI 학교 선생님'입니다. 
      학생이 "${problemTitle}" 문제를 해결하기 위해 AI 모델을 설계했습니다.
      
      학생의 선택:
      - 기계학습 유형: ${selectedType}
      - 사용 데이터(특징): ${features}
      
      채점 결과:
      - 적합도 점수: ${score}점 / 100점
      - 정답 여부: ${isCorrect ? '적절함' : '부적절함'}

      작성 지침:
      1. 학생의 선택에 따른 가상의 미래 시나리오를 3~4문장으로 재미있게 묘사해주세요.
      2. 점수가 높다면 성공적인 결과를, 낮다면 엉뚱하거나 아쉬운 결과를 유머러스하게 표현해주세요.
      3. 만약 선택이 틀렸다면, 왜 틀렸는지 그리고 어떤 유형이 더 좋았을지 부드럽게 조언해주세요.
      4. 초등학생~중학생이 이해하기 쉬운 용어를 사용하세요.
      5. 이모지를 적절히 사용하여 생동감을 주세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "시나리오 생성 중 오류가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate scenario', text: 'AI 선생님이 잠시 바쁜가 봐요! 시나리오를 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
