import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json();

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: '카메라 보조 배터리를 꼭 챙기고, 녹음 시 조용한 장소를 확보하세요.' },
        { status: 500 }
      );
    }
    const taskList = tasks.map((t: any) => t.title).join(", ");
    const response = await generateLlmContent({
      model: "gemini-3-flash-preview",
      contents: `이 학교 홍보 영상 제작 계획을 검토해줘: ${taskList}. 
      치명적인 리스크 2가지와 효율성을 높일 수 있는 제안 1가지를 한국어로 50단어 이내로 작성해줘.`
    });

    return NextResponse.json({
      text: response.text || "카메라 보조 배터리를 꼭 챙기고, 녹음 시 조용한 장소를 확보하세요."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate risk assessment', text: '팁: 촬영 나가기 전에 장비를 다시 한번 점검하세요.' },
      { status: 500 }
    );
  }
}
