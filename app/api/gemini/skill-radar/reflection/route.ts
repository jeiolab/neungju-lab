import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from '@/lib/ai-gateway';

export async function POST(request: NextRequest) {
  try {
    const { competencyName, userPlan, userMasteryScore } = await request.json();

    if (
      !competencyName ||
      !userPlan ||
      typeof competencyName !== 'string' ||
      typeof userPlan !== 'string' ||
      typeof userMasteryScore !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json({ error: 'API_KEY not configured' }, { status: 500 });
    }

    const prompt = `
당신은 학생의 진로 성장을 돕는 친절하고 통찰력 있는 "성장형 코치"입니다.

[상황]
학생이 "${competencyName}" 역량을 키우기 위해 학교 생활 적용 계획을 세웠습니다.
현재 이 학생의 해당 역량 마스터리 점수는 ${userMasteryScore}점입니다.

[학생의 계획]
"${userPlan}"

[요청사항]
1. 학생의 계획을 칭찬하고, 이 계획이 왜 디지털 사회에서 중요한지 짧게 설명해주세요.
2. 이 계획을 더 구체화하거나 발전시킬 수 있는 "작은 팁" 하나를 제안해주세요.
3. 전체 길이는 3-4문장으로 간결하게 작성해주세요. 말투는 격려하는 존댓말(~해요)을 사용하세요.
    `;
    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate reflection' }, { status: 500 });
  }
}
