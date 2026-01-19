import { GoogleGenAI, Type } from "@google/genai";
import { WizardData, ProjectPlan } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Using mock mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProjectPlanAI = async (data: WizardData): Promise<ProjectPlan> => {
  const client = getClient();
  
  // Fallback for demo/no-key environments
  if (!client) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          problemDefinition: `${data.keyword} 문제와 관련하여, 현재 우리 주변에서 발생하는 비효율을 해결하고자 합니다.`,
          background: `최근 ${data.interest} 분야에서 디지털 전환이 가속화되고 있습니다. 특히 ${data.keyword} 이슈는 많은 사람들의 불편을 초래하고 있어 ${data.activity} 활동을 통해 개선이 필요합니다.`,
          dataUsage: `공공데이터포털의 ${data.interest} 관련 통계 데이터와 교내 설문조사 데이터를 활용합니다. 개인정보는 비식별화 처리하여 안전하게 사용합니다.`,
          solutionSteps: [
            "문제 현황 파악 및 기존 해결책 분석",
            `${data.resources}를 활용한 프로토타입 설계`,
            "데이터 수집 및 분석 알고리즘 적용",
            "솔루션 적용 및 피드백 수집",
            "최종 결과물 발표 및 보고서 작성"
          ],
          expectedEffects: {
            positive: ["업무/생활 효율성 30% 증대", "데이터 기반의 객관적 의사결정 문화 정착"],
            negative: "디지털 소외 계층의 접근성 저하 우려",
            response: "쉬운 UI/UX 설계 및 오프라인 보조 수단 마련으로 격차 해소"
          },
          pitchScript: `안녕하십니까, 저는 ${data.interest} 분야의 혁신을 꿈꾸는 학생입니다. 저는 '${data.keyword}' 문제를 해결하기 위해 이 프로젝트를 기획했습니다. ${data.activity} 역량을 발휘하여 데이터를 분석하고, 실질적인 변화를 만들어내겠습니다. 감사합니다.`
        });
      }, 1500);
    });
  }

  const prompt = `
    당신은 고등학생의 진로 지도 교사입니다. 학생이 입력한 정보를 바탕으로 '디지털 사회 변화 탐구 프로젝트 수행평가 계획서'를 작성해주세요.
    
    [학생 입력 정보]
    - 관심 분야: ${data.interest}
    - 선호 활동: ${data.activity}
    - 보유 자원: ${data.resources}
    - 주제 키워드: ${data.keyword}

    다음 JSON 스키마에 맞춰 한국어로 답변해주세요. 내용은 고등학생 수준에서 구체적이고 논리적이어야 합니다.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemDefinition: { type: Type.STRING, description: "프로젝트가 해결하려는 핵심 문제 (1문장)" },
            background: { type: Type.STRING, description: "선정 배경 및 필요성 (3문장)" },
            dataUsage: { type: Type.STRING, description: "사용할 데이터 종류와 윤리적 고려사항" },
            solutionSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "해결 방안 5단계"
            },
            expectedEffects: {
              type: Type.OBJECT,
              properties: {
                positive: { type: Type.ARRAY, items: { type: Type.STRING }, description: "긍정적 효과 2가지" },
                negative: { type: Type.STRING, description: "예상되는 부정적 영향" },
                response: { type: Type.STRING, description: "부정적 영향에 대한 대응 방안" }
              }
            },
            pitchScript: { type: Type.STRING, description: "발표용 30초 요약 스크립트 (경어체)" }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as ProjectPlan;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return fallback on error
    return {
      problemDefinition: "AI 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
      background: "...",
      dataUsage: "...",
      solutionSteps: ["..."],
      expectedEffects: { positive: [], negative: "", response: "" },
      pitchScript: "..."
    };
  }
};
