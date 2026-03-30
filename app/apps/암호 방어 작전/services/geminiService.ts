import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const generateHint = async (levelContext: string, wrongAnswer: string): Promise<string> => {
  if (!apiKey) return "API 키가 없습니다. 힌트: 기본적인 암호 규칙을 다시 확인해보세요.";

  try {
    const prompt = `
      Context: A student is playing a crypto puzzle game.
      Level Info: ${levelContext}
      The student guessed: "${wrongAnswer}".
      
      Provide a short, encouraging, and specific hint (max 1 sentence) in Korean to help them solve it without giving the direct answer. 
      Act like a senior White Hat Hacker mentor.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "도구를 다시 한번 꼼꼼히 확인해보세요.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "연결 상태가 불안정합니다. 다른 관점에서 접근해보세요.";
  }
};

export const generateCertificateMessage = async (score: number, timeSpent: string): Promise<string> => {
  if (!apiKey) return "공인 화이트 해커. 시스템을 성공적으로 방어했습니다!";

  try {
    const prompt = `
      Generate a short, epic, 1-paragraph commendation text in Korean for a "White Hat Hacker Certificate".
      The student scored ${score} points and completed the mission in ${timeSpent}.
      Use technical cybersecurity jargon but keep it celebratory.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "뛰어난 성과입니다. 시스템 보안이 복구되었습니다.";
  } catch (error) {
    return "임무 완수. 시스템 무결성 복구됨.";
  }
};