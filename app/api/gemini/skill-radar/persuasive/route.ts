import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from '@/lib/ai-gateway';

export async function POST(request: NextRequest) {
  try {
    const { masteryScores, jobName } = await request.json();

    if (
      !masteryScores ||
      typeof masteryScores !== 'object' ||
      typeof jobName !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json({ error: 'API_KEY not configured' }, { status: 500 });
    }

    const scoresText = Object.entries(masteryScores)
      .map(([k, v]) => `${k}: ${v}점`)
      .join(', ');

    const prompt = `
당신은 학생의 포트폴리오 작성을 돕는 코치입니다.
학생이 희망하는 직업: ${jobName}
학생의 역량 점수: ${scoresText}

이 점수를 바탕으로, 학생이 왜 이 직업에 적합한지 어필하는 "설득 글 3문장"을 작성해주세요.
높은 점수의 역량을 강조하여 작성해주세요.
    `;
    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate persuasive text' }, { status: 500 });
  }
}
