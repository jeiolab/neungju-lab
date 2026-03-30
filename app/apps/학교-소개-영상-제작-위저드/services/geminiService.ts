import { Task } from '../types';

export const generateTasksFromConcept = async (
  concept: string, 
  duration: number
): Promise<Task[]> => {
  try {
    const response = await fetch('/api/gemini/video-wizard/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept, duration }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.tasks || [];
    } else {
      console.error("API Error:", data.error);
      // Fallback tasks if API fails
      return [
        { id: 'gen_1', title: '컨셉 아이디어 브레인스토밍', phase: 'Planning', dependencies: [], completed: false },
        { id: 'gen_2', title: '스토리보드 작성', phase: 'Planning', dependencies: [], completed: false },
        { id: 'gen_3', title: '촬영 장소 답사', phase: 'Planning', dependencies: [], completed: false },
        { id: 'gen_4', title: '메인 인터뷰 촬영', phase: 'Production', dependencies: [], completed: false },
        { id: 'gen_5', title: 'B-roll(스케치 영상) 촬영', phase: 'Production', dependencies: [], completed: false },
        { id: 'gen_6', title: '나레이션 녹음', phase: 'Production', dependencies: [], completed: false },
        { id: 'gen_7', title: '배경음악 선정', phase: 'Post-Production', dependencies: [], completed: false },
        { id: 'gen_8', title: '최종 컷 편집 및 색보정', phase: 'Post-Production', dependencies: [], completed: false },
      ];
    }
  } catch (error) {
    console.error("Network Error:", error);
    // Fallback tasks if API fails
    return [
      { id: 'gen_1', title: '컨셉 아이디어 브레인스토밍', phase: 'Planning', dependencies: [], completed: false },
      { id: 'gen_2', title: '스토리보드 작성', phase: 'Planning', dependencies: [], completed: false },
      { id: 'gen_3', title: '촬영 장소 답사', phase: 'Planning', dependencies: [], completed: false },
      { id: 'gen_4', title: '메인 인터뷰 촬영', phase: 'Production', dependencies: [], completed: false },
      { id: 'gen_5', title: 'B-roll(스케치 영상) 촬영', phase: 'Production', dependencies: [], completed: false },
      { id: 'gen_6', title: '나레이션 녹음', phase: 'Production', dependencies: [], completed: false },
      { id: 'gen_7', title: '배경음악 선정', phase: 'Post-Production', dependencies: [], completed: false },
      { id: 'gen_8', title: '최종 컷 편집 및 색보정', phase: 'Post-Production', dependencies: [], completed: false },
    ];
  }
};

export const getRiskAssessment = async (tasks: Task[]): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/video-wizard/risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text || "카메라 보조 배터리를 꼭 챙기고, 녹음 시 조용한 장소를 확보하세요.";
    } else {
      console.error("API Error:", data.error);
      return data.text || "팁: 촬영 나가기 전에 장비를 다시 한번 점검하세요.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "팁: 촬영 나가기 전에 장비를 다시 한번 점검하세요.";
  }
}