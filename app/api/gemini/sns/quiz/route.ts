import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { difficulty } = await request.json();

    if (!difficulty) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    const prompt = `
      고등학교 1학년 수준의 정보보호/SNS해킹방어 관련 퀴즈를 1개 만들어주세요.
      난이도: ${difficulty}
      
      형식:
      ${difficulty === 'EASY' ? '객관식 (4지선다)' : difficulty === 'NORMAL' ? '단답형 주관식' : '서술형 (논술)'}

      다음 JSON 스키마를 따라주세요:
      {
        "id": "unique_id_${Date.now()}",
        "difficulty": "${difficulty}",
        "question": "질문 내용",
        "options": ["보기1", "보기2", "보기3", "보기4"], // 객관식일 경우만
        "correctAnswer": "정답",
        "explanation": "해설"
      }
      
      이미 출제된 문제와 겹치지 않게 참신한 상황(SNS, 학교 Wi-Fi, 게임 계정 등)을 설정해주세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (!response.text) {
      return NextResponse.json(
        { error: 'No response' },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Gemini Quiz Error (SNS):", error);
    return NextResponse.json(
      null,
      { status: 200 }
    );
  }
}
