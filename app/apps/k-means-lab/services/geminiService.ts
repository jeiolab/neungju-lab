import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");

export const generateReport = async (k: number, iterations: number, converged: boolean): Promise<string> => {
  if (!apiKey) {
    return `API 키가 설정되지 않아 AI 리포트를 생성할 수 없습니다.\n\n[기본 리포트]\n실험 설정 K=${k}\n반복 횟수: ${iterations}회\n수렴 여부: ${converged ? '완료' : '진행 중'}\n\nK-평균 알고리즘은 중심점이 더 이상 움직이지 않을 때까지 반복하여 데이터를 군집화합니다.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      나는 데이터 과학 학생이야. 방금 K-Means 알고리즘 실험을 마쳤어.
      결과를 분석해서 짧고 격려가 담긴 리포트를 작성해줘. 한국어로 부탁해.
      
      [실험 데이터]
      - 설정한 군집 수 (K): ${k}
      - 반복(Iteration) 횟수: ${iterations}
      - 수렴(Convergence) 여부: ${converged ? "완벽하게 수렴함" : "아직 수렴하지 않음"}
      
      리포트는 다음 형식을 따라줘:
      1. 실험 요약 (한 문장)
      2. 결과 분석 (K값의 적절성이나 반복 횟수에 대한 짧은 코멘트)
      3. 데이터 과학자로서의 조언 (한 문장)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "리포트 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 리포트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
