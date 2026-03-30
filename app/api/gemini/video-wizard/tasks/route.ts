import { NextRequest, NextResponse } from 'next/server';
import { Type } from "@google/genai";
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { concept, duration } = await request.json();

    if (!concept || !duration) {
      return NextResponse.json(
        { error: 'Concept and duration are required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', tasks: [] },
        { status: 500 }
      );
    }
    const response = await generateLlmContent({
      model: "gemini-3-flash-preview",
      contents: `학교 소개 영상 제작 프로젝트를 위한 상세 작업 목록을 작성해줘.
      상황: 고등학생들이 ${duration}분 분량의 '${concept}' 컨셉 영상을 제작함.
      작업을 3단계(Planning, Production, Post-Production)로 나누어 구체적이고 실행 가능한 작업들로 분해해줘.
      작업 개수는 8개에서 12개 사이로 해줘.
      결과는 한국어로 작성해야 하며, 반드시 JSON 스키마를 따라야 해.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              phase: { type: Type.STRING, enum: ["Planning", "Production", "Post-Production"] },
            },
            required: ["id", "title", "phase"]
          }
        }
      }
    });

    const tasks = JSON.parse(response.text || "[]");
    const formattedTasks = tasks.map((t: any) => ({
      ...t,
      dependencies: [],
      completed: false
    }));

    return NextResponse.json({ tasks: formattedTasks });
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback tasks
    const fallbackTasks = [
      { id: 'gen_1', title: '컨셉 아이디어 브레인스토밍', phase: 'Planning', dependencies: [], completed: false },
      { id: 'gen_2', title: '스토리보드 작성', phase: 'Planning', dependencies: [], completed: false },
      { id: 'gen_3', title: '촬영 장소 답사', phase: 'Planning', dependencies: [], completed: false },
      { id: 'gen_4', title: '메인 인터뷰 촬영', phase: 'Production', dependencies: [], completed: false },
      { id: 'gen_5', title: 'B-roll(스케치 영상) 촬영', phase: 'Production', dependencies: [], completed: false },
      { id: 'gen_6', title: '나레이션 녹음', phase: 'Production', dependencies: [], completed: false },
      { id: 'gen_7', title: '배경음악 선정', phase: 'Post-Production', dependencies: [], completed: false },
      { id: 'gen_8', title: '최종 컷 편집 및 색보정', phase: 'Post-Production', dependencies: [], completed: false },
    ];
    return NextResponse.json({ tasks: fallbackTasks });
  }
}
