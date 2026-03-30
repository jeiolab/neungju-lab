import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from '@/lib/ai-gateway';

export async function POST(request: NextRequest) {
  try {
    const { concept } = await request.json();

    if (!concept || typeof concept !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json({ error: 'API_KEY not configured' }, { status: 500 });
    }
    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: `초중고 학생이 이해하기 쉽게 '${concept}'에 대해 3줄 요약 설명해줘. 실제 예시를 1개 포함해줘.`,
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
