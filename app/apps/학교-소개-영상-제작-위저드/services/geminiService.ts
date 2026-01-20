import { GoogleGenAI, Type } from "@google/genai";
import { Task } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTasksFromConcept = async (
  concept: string, 
  duration: number
): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
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
    return tasks.map((t: any) => ({
      ...t,
      dependencies: [], // Initialize empty
      completed: false
    }));
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback tasks if API fails
    return [
      { id: 'gen_1', title: '컨셉 아이디어 브레인스토밍', phase: 'Planning', dependencies: [] },
      { id: 'gen_2', title: '스토리보드 작성', phase: 'Planning', dependencies: [] },
      { id: 'gen_3', title: '촬영 장소 답사', phase: 'Planning', dependencies: [] },
      { id: 'gen_4', title: '메인 인터뷰 촬영', phase: 'Production', dependencies: [] },
      { id: 'gen_5', title: 'B-roll(스케치 영상) 촬영', phase: 'Production', dependencies: [] },
      { id: 'gen_6', title: '나레이션 녹음', phase: 'Production', dependencies: [] },
      { id: 'gen_7', title: '배경음악 선정', phase: 'Post-Production', dependencies: [] },
      { id: 'gen_8', title: '최종 컷 편집 및 색보정', phase: 'Post-Production', dependencies: [] },
    ];
  }
};

export const getRiskAssessment = async (tasks: Task[]): Promise<string> => {
    try {
        const taskList = tasks.map(t => t.title).join(", ");
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `이 학교 홍보 영상 제작 계획을 검토해줘: ${taskList}. 
            치명적인 리스크 2가지와 효율성을 높일 수 있는 제안 1가지를 한국어로 50단어 이내로 작성해줘.`
        });
        return response.text || "카메라 보조 배터리를 꼭 챙기고, 녹음 시 조용한 장소를 확보하세요.";
    } catch (e) {
        return "팁: 촬영 나가기 전에 장비를 다시 한번 점검하세요.";
    }
}