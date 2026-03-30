import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { className, skills } = await request.json();

    if (!className || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 서비스를 사용할 수 없습니다. API 키를 확인해주세요.' },
        { status: 500 }
      );
    }
    const model = 'gemini-3-flash-preview';
    const prompt = `당신은 판타지 RPG 세계관의 친절한 코딩 선생님입니다.
    사용자가 방금 "${className}"라는 클래스를 정의했고, 스킬로는 ${skills.join(', ')}을(를) 가지고 있습니다.
    이 클래스가 어떻게 미래의 객체들을 만들기 위한 "설계도(붕어빵 틀)" 역할을 하는지 한국어로 2문장 이내로 쉽고 재미있게 설명해주세요.
    초보자에게 용기를 주는 말투를 사용하세요.`;

    const response = await generateLlmContent({
      model: model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "클래스 정의가 업데이트되었습니다!"
    });
  } catch (error) {
    console.error("Gemini API Error (RPG Hero Factory Explain):", error);
    return NextResponse.json(
      { error: 'Failed to generate explanation', text: '멋진 클래스를 정의하셨네요! (AI 설명을 불러올 수 없습니다)' },
      { status: 500 }
    );
  }
}
