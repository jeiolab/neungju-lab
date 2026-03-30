import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { ProjectData, ProjectTemplate } from '../types';
import { TEMPLATES } from '../constants';

const getClient = () => {
  const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateOnePageSummary = async (project: ProjectData): Promise<string> => {
  const client = getClient();
  if (!client) {
    console.warn("API Key not found, returning placeholder.");
    return `API 키가 설정되지 않아 자동 생성을 사용할 수 없습니다. 
    
    [기본 요약 예시]
    1. 목표: ${project.goal}
    2. 데이터: ${project.collectedData.join(', ')} 활용
    3. 공유: ${project.sharingScope === 'school' ? '학교 전체' : project.sharingScope} 대상 공유
    4. 보호: ${project.protectionMeasures.join(', ')} 적용
    5. 결과: ${project.outputFormat} 형태로 산출물 제작`;
  }

  const templateName = TEMPLATES.find(t => t.id === project.templateId)?.title || '프로젝트';
  
  const prompt = `
    다음은 고등학교 수행평가 프로젝트 계획입니다.
    이 계획을 바탕으로 발표 자료(PPT)의 첫 장에 들어갈 "핵심 요약 5줄"을 작성해주세요.
    학생들이 발표할 때 청중의 흥미를 끌고, 프로젝트의 핵심(안전한 공유와 가치)을 잘 전달하도록 격려하는 톤으로 작성해주세요.
    
    [프로젝트 정보]
    - 주제: ${templateName}
    - 목표: ${project.goal}
    - 수집 데이터: ${project.collectedData.join(', ')}
    - 공유 범위: ${project.sharingScope}
    - 보호 조치: ${project.protectionMeasures.join(', ')}
    - 결과물 형태: ${project.outputFormat}

    출력 형식:
    - 이모지를 적절히 사용하여 5개의 불렛포인트로 작성.
    - Markdown 형식 불필요, 텍스트만 출력.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "요약 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 요약 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
