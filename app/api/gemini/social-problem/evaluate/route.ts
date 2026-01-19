import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { problemTitle, userIdea } = await request.json();

    if (
      !problemTitle ||
      !userIdea ||
      typeof problemTitle !== 'string' ||
      typeof userIdea !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API_KEY not configured' }, { status: 500 });
    }

    const prompt = `
당신은 친절하고 전문적인 '소셜 벤처 멘토'입니다.
사용자가 "${problemTitle}" 문제에 대해 다음과 같은 아이디어를 냈습니다:
"${userIdea}"

이 아이디어에 대해 다음 구조로 피드백을 주세요:
1. 칭찬 (아이디어의 좋은 점)
2. 보완점 (기술적으로나 현실적으로 고려할 점)
3. 기대 효과 (이 아이디어가 실현되면 세상이 어떻게 변할지)

말투는 격려하듯이 부드럽게 해주세요. 200자 이내로 요약해주세요.
    `;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to evaluate idea' }, { status: 500 });
  }
}
