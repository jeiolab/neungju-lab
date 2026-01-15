import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { diaryEntry } = await request.json();

    if (!diaryEntry || typeof diaryEntry !== 'string') {
      return NextResponse.json({ error: 'Invalid diary entry' }, { status: 400 });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API_KEY not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
You are a career counselor from 10 years in the future (Future Time Machine AI).
The user is a high school student writing about their dream job and how it might change in 10 years.

User's Diary Entry:
"${diaryEntry}"

Task:
1. Analyze their vision of the future job.
2. Provide encouraging feedback.
3. Suggest one specific skill they should prepare for based on current trends (AI, automation, etc.).
4. Keep the tone inspiring, futuristic, and friendly.
5. Respond in Korean.
6. Keep it under 200 words.
      `,
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}
